use firebase_environment_doctor::{
    CommandResult, DiagnoseOptions, FirebaseRunner, Severity, Verdict, apply_network_checks,
    diagnose_local,
};
use std::collections::HashMap;
use std::path::PathBuf;

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
        }
    }
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
