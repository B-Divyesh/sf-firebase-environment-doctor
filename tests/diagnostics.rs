use firebase_environment_doctor::{
    CommandResult, DiagnoseOptions, FirebaseRunner, Severity, Verdict, apply_network_checks,
    diagnose_local,
};
use std::collections::HashMap;
use std::path::PathBuf;
use std::process::Command;

fn fixture(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests/fixtures")
        .join(name)
}

fn options(name: &str) -> DiagnoseOptions {
    DiagnoseOptions {
        start: fixture(name),
        project_override: None,
        environment: HashMap::new(),
    }
}

#[test]
fn identifies_wrong_project_context() {
    let mut options = options("wrong-project");
    options
        .environment
        .insert("FIREBASE_PROJECT".into(), "careful-app-prod".into());
    let report = diagnose_local(&options).unwrap();
    assert_eq!(report.project.unwrap().id, "careful-app-prod");
    assert!(
        report
            .findings
            .iter()
            .any(|item| item.code == "project_context_mismatch")
    );
    assert!(
        report
            .findings
            .iter()
            .any(|item| item.code == "production_target")
    );
}

#[test]
fn identifies_emulator_mismatch() {
    let mut options = options("emulator-mismatch");
    options
        .environment
        .insert("FIRESTORE_EMULATOR_HOST".into(), "localhost:8181".into());
    options.environment.insert(
        "FIREBASE_AUTH_EMULATOR_HOST".into(),
        "127.0.0.1:9099".into(),
    );
    let report = diagnose_local(&options).unwrap();
    assert_eq!(report.target, "emulators");
    assert_eq!(report.verdict, Verdict::Caution);
    assert_eq!(
        report
            .findings
            .iter()
            .filter(|item| item.code == "emulator_mismatch")
            .count(),
        1
    );
}

struct ExpiredRunner;
impl FirebaseRunner for ExpiredRunner {
    fn run(&self, _args: &[&str]) -> CommandResult {
        CommandResult {
            success: false,
            stdout: String::new(),
            stderr: "Authentication Error: token expired".into(),
        }
    }
}

#[test]
fn identifies_expired_login_without_exposing_output() {
    let mut report = diagnose_local(&options("expired-login")).unwrap();
    apply_network_checks(&mut report, &ExpiredRunner);
    assert_eq!(report.verdict, Verdict::Blocked);
    assert!(
        report
            .findings
            .iter()
            .any(|item| item.code == "auth_invalid" && item.severity == Severity::Error)
    );
    let serialized = serde_json::to_string(&report).unwrap();
    assert!(!serialized.contains("token"));
}

struct ReadyRunner;
impl FirebaseRunner for ReadyRunner {
    fn run(&self, args: &[&str]) -> CommandResult {
        let stdout = if args.first() == Some(&"projects:list") {
            r#"{"result":[{"projectId":"careful-app-dev"}]}"#
        } else {
            r#"{"result":[{"user":{"email":"developer@example.test"}}]}"#
        };
        CommandResult {
            success: true,
            stdout: stdout.into(),
            stderr: String::new(),
        }
    }
}

struct EmptyLoginRunner;
impl FirebaseRunner for EmptyLoginRunner {
    fn run(&self, args: &[&str]) -> CommandResult {
        let stdout = if args.first() == Some(&"login:list") {
            r#"{"status":"success"}"#
        } else {
            r#"{"error":{"message":"Authentication Error: credentials are no longer valid"}}"#
        };
        CommandResult {
            success: args.first() == Some(&"login:list"),
            stdout: stdout.into(),
            stderr: "Authentication Error: credentials are no longer valid".into(),
        }
    }
}

#[test]
fn identifies_no_account_from_real_firebase_login_list_shape() {
    let mut report = diagnose_local(&options("expired-login")).unwrap();
    apply_network_checks(&mut report, &EmptyLoginRunner);
    assert_eq!(
        report.auth.state,
        firebase_environment_doctor::CheckState::Error
    );
    assert!(
        report
            .findings
            .iter()
            .any(|item| item.code == "auth_invalid")
    );
    assert!(
        !report
            .findings
            .iter()
            .any(|item| item.code == "cloud_unreachable")
    );
}

struct ExpiredAfterListedRunner;
impl FirebaseRunner for ExpiredAfterListedRunner {
    fn run(&self, args: &[&str]) -> CommandResult {
        if args.first() == Some(&"login:list") {
            CommandResult {
                success: true,
                stdout:
                    r#"{"status":"success","result":[{"user":{"email":"developer@example.test"}}]}"#
                        .into(),
                stderr: String::new(),
            }
        } else {
            CommandResult {
                success: false,
                stdout: String::new(),
                stderr: "Authentication Error: Your credentials are no longer valid. Please run firebase login --reauth".into(),
            }
        }
    }
}

#[test]
fn identifies_expired_credentials_when_account_listing_succeeds() {
    let mut report = diagnose_local(&options("expired-login")).unwrap();
    apply_network_checks(&mut report, &ExpiredAfterListedRunner);
    assert_eq!(
        report.auth.state,
        firebase_environment_doctor::CheckState::Error
    );
    assert!(
        report
            .findings
            .iter()
            .any(|item| item.code == "auth_invalid")
    );
    assert!(
        !report
            .findings
            .iter()
            .any(|item| item.code == "cloud_unreachable")
    );
}

#[test]
fn healthy_network_result_is_ready() {
    let mut report = diagnose_local(&options("expired-login")).unwrap();
    apply_network_checks(&mut report, &ReadyRunner);
    assert_eq!(
        report.verdict,
        Verdict::Caution,
        "missing firebase CLI remains an honest local warning in the test environment"
    );
    assert!(
        !report
            .findings
            .iter()
            .any(|item| item.severity == Severity::Error)
    );
    assert!(report.network_opt_in);
}

#[test]
fn demo_command_uses_a_new_temporary_sample_project() {
    let output = Command::new(env!("CARGO_BIN_EXE_firebase-environment-doctor"))
        .arg("--demo")
        .output()
        .expect("run bundled demo");
    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).expect("UTF-8 demo output");
    assert!(stdout.contains("Demo sample copied to"));
    assert!(stdout.contains("sample-store-prod"));
    assert!(stdout.contains(".firebaserc defaults to 'sample-store-dev'"));
}
