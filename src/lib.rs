//! Diagnostic engine for Firebase Environment Doctor.
//!
//! The library deliberately separates local inspection from the opt-in
//! Firebase CLI calls. Consumers can use [`diagnose_local`] without network
//! access or subprocess mutation.

use serde::{Deserialize, Serialize};
use serde_json::Value;
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, HashMap};
use std::env;
use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::thread;
use std::time::{Duration, Instant};

#[derive(Debug, Clone)]
pub struct DiagnoseOptions {
    pub start: PathBuf,
    pub project_override: Option<String>,
    pub environment: HashMap<String, String>,
}

impl DiagnoseOptions {
    pub fn from_process(start: PathBuf, project_override: Option<String>) -> Self {
        Self {
            start,
            project_override,
            environment: env::vars().collect(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum Verdict {
    Ready,
    Caution,
    Blocked,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum Severity {
    Info,
    Warning,
    Error,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum CheckState {
    Ok,
    Warning,
    Error,
    Skipped,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Finding {
    pub severity: Severity,
    pub code: String,
    pub message: String,
    pub next: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectIdentity {
    pub id: String,
    pub source: String,
    pub alias: Option<String>,
    pub default_id: Option<String>,
    pub production_like: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Check {
    pub state: CheckState,
    pub summary: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmulatorCheck {
    pub service: String,
    pub configured: Option<String>,
    pub environment: Option<String>,
    pub state: CheckState,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RulesCheck {
    pub service: String,
    pub path: String,
    pub sha256: Option<String>,
    pub state: CheckState,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Report {
    pub schema_version: u8,
    pub root: String,
    pub verdict: Verdict,
    pub project: Option<ProjectIdentity>,
    pub target: String,
    pub cli: Check,
    pub auth: Check,
    pub network_opt_in: bool,
    pub emulators: Vec<EmulatorCheck>,
    pub rules: Vec<RulesCheck>,
    pub findings: Vec<Finding>,
    pub suggestions: Vec<String>,
}

#[derive(Debug)]
pub enum DiagnoseError {
    NoProjectRoot(PathBuf),
    ReadFile {
        path: PathBuf,
        source: io::Error,
    },
    InvalidJson {
        path: PathBuf,
        source: serde_json::Error,
    },
}

impl std::fmt::Display for DiagnoseError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NoProjectRoot(path) => write!(
                f,
                "no firebase.json or .firebaserc found from {} upward",
                path.display()
            ),
            Self::ReadFile { path, source } => {
                write!(f, "could not read {}: {source}", path.display())
            }
            Self::InvalidJson { path, source } => {
                write!(f, "invalid JSON in {}: {source}", path.display())
            }
        }
    }
}

impl std::error::Error for DiagnoseError {}

fn read_json(path: &Path) -> Result<Option<Value>, DiagnoseError> {
    if !path.exists() {
        return Ok(None);
    }
    let content = fs::read_to_string(path).map_err(|source| DiagnoseError::ReadFile {
        path: path.to_owned(),
        source,
    })?;
    serde_json::from_str(&content)
        .map(Some)
        .map_err(|source| DiagnoseError::InvalidJson {
            path: path.to_owned(),
            source,
        })
}

pub fn find_project_root(start: &Path) -> Result<PathBuf, DiagnoseError> {
    let start = if start.is_file() {
        start.parent().unwrap_or(start)
    } else {
        start
    };
    for candidate in start.ancestors() {
        if candidate.join("firebase.json").is_file() || candidate.join(".firebaserc").is_file() {
            return Ok(candidate.to_owned());
        }
    }
    Err(DiagnoseError::NoProjectRoot(start.to_owned()))
}

fn aliases(rc: Option<&Value>) -> BTreeMap<String, String> {
    rc.and_then(|value| value.get("projects"))
        .and_then(Value::as_object)
        .map(|object| {
            object
                .iter()
                .filter_map(|(key, value)| value.as_str().map(|id| (key.clone(), id.to_owned())))
                .collect()
        })
        .unwrap_or_default()
}

fn production_like(project: &str) -> bool {
    project
        .split(|c: char| !c.is_ascii_alphanumeric())
        .any(|part| {
            matches!(
                part.to_ascii_lowercase().as_str(),
                "prod" | "production" | "live"
            )
        })
}

fn select_project(
    explicit: Option<&str>,
    environment: &HashMap<String, String>,
    aliases: &BTreeMap<String, String>,
) -> Option<ProjectIdentity> {
    let (selected, source) =
        if let Some(project) = explicit.filter(|value| !value.trim().is_empty()) {
            (project.trim(), "--project")
        } else if let Some(project) = environment
            .get("FIREBASE_PROJECT")
            .filter(|v| !v.trim().is_empty())
        {
            (project.trim(), "FIREBASE_PROJECT")
        } else if let Some(project) = environment
            .get("GOOGLE_CLOUD_PROJECT")
            .filter(|v| !v.trim().is_empty())
        {
            (project.trim(), "GOOGLE_CLOUD_PROJECT")
        } else {
            let project = aliases.get("default")?;
            (project.as_str(), ".firebaserc (default)")
        };

    let resolved = aliases
        .get(selected)
        .map(String::as_str)
        .unwrap_or(selected);
    Some(ProjectIdentity {
        id: resolved.to_owned(),
        source: source.to_owned(),
        alias: (resolved != selected).then(|| selected.to_owned()),
        default_id: aliases.get("default").cloned(),
        production_like: production_like(resolved),
    })
}

fn normalize_endpoint(input: &str) -> String {
    input
        .trim()
        .trim_end_matches('/')
        .strip_prefix("http://")
        .or_else(|| input.trim().trim_end_matches('/').strip_prefix("https://"))
        .unwrap_or_else(|| input.trim().trim_end_matches('/'))
        .replace("localhost", "127.0.0.1")
}

fn configured_emulators(config: Option<&Value>) -> BTreeMap<String, String> {
    let mut result = BTreeMap::new();
    let Some(object) = config
        .and_then(|value| value.get("emulators"))
        .and_then(Value::as_object)
    else {
        return result;
    };
    for (service, value) in object {
        let Some(port) = value.get("port").and_then(Value::as_u64) else {
            continue;
        };
        let host = value
            .get("host")
            .and_then(Value::as_str)
            .unwrap_or("127.0.0.1");
        result.insert(
            service.clone(),
            format!("{}:{port}", normalize_endpoint(host)),
        );
    }
    result
}

fn environment_emulators(environment: &HashMap<String, String>) -> BTreeMap<String, String> {
    [
        ("auth", "FIREBASE_AUTH_EMULATOR_HOST"),
        ("database", "FIREBASE_DATABASE_EMULATOR_HOST"),
        ("firestore", "FIRESTORE_EMULATOR_HOST"),
        ("pubsub", "PUBSUB_EMULATOR_HOST"),
        ("storage", "FIREBASE_STORAGE_EMULATOR_HOST"),
    ]
    .into_iter()
    .filter_map(|(service, variable)| {
        environment
            .get(variable)
            .filter(|value| !value.trim().is_empty())
            .map(|value| (service.to_owned(), normalize_endpoint(value)))
    })
    .collect()
}

fn rules_paths(config: Option<&Value>) -> Vec<(String, String)> {
    let Some(config) = config else {
        return Vec::new();
    };
    let mut paths = Vec::new();
    for service in ["firestore", "storage", "database"] {
        let Some(value) = config.get(service) else {
            continue;
        };
        collect_rules(service, value, &mut paths);
    }
    paths.sort();
    paths.dedup();
    paths
}

fn collect_rules(service: &str, value: &Value, paths: &mut Vec<(String, String)>) {
    match value {
        Value::Array(items) => {
            for item in items {
                collect_rules(service, item, paths);
            }
        }
        Value::Object(object) => {
            if let Some(path) = object.get("rules").and_then(Value::as_str) {
                paths.push((service.to_owned(), path.to_owned()));
            }
        }
        _ => {}
    }
}

fn detect_cached_auth(environment: &HashMap<String, String>) -> Check {
    if let Some(path) = environment.get("GOOGLE_APPLICATION_CREDENTIALS") {
        return if Path::new(path).is_file() {
            Check {
                state: CheckState::Ok,
                summary: "application credentials file found · not validated (offline)".into(),
            }
        } else {
            Check {
                state: CheckState::Warning,
                summary: "GOOGLE_APPLICATION_CREDENTIALS points to a missing file".into(),
            }
        };
    }
    let config_home = environment
        .get("XDG_CONFIG_HOME")
        .map(PathBuf::from)
        .or_else(|| {
            environment
                .get("HOME")
                .map(|home| Path::new(home).join(".config"))
        });
    let cached = config_home
        .map(|home| home.join("configstore/firebase-tools.json"))
        .is_some_and(|path| path.is_file());
    if cached {
        Check {
            state: CheckState::Ok,
            summary: "cached Firebase session found · not validated (offline)".into(),
        }
    } else {
        Check {
            state: CheckState::Skipped,
            summary: "no local credential marker found · use --network to validate".into(),
        }
    }
}

fn detect_cli() -> Check {
    match Command::new("firebase")
        .arg("--version")
        .stdin(Stdio::null())
        .stderr(Stdio::null())
        .output()
    {
        Ok(output) if output.status.success() => {
            let version = String::from_utf8_lossy(&output.stdout).trim().to_owned();
            Check {
                state: CheckState::Ok,
                summary: format!(
                    "firebase {} · found",
                    if version.is_empty() {
                        "(version unknown)"
                    } else {
                        &version
                    }
                ),
            }
        }
        Ok(_) => Check {
            state: CheckState::Warning,
            summary: "firebase CLI found but version check failed".into(),
        },
        Err(error) if error.kind() == io::ErrorKind::NotFound => Check {
            state: CheckState::Warning,
            summary: "firebase CLI not found on PATH".into(),
        },
        Err(_) => Check {
            state: CheckState::Warning,
            summary: "firebase CLI could not be started".into(),
        },
    }
}

fn add_finding(
    report: &mut Report,
    severity: Severity,
    code: &str,
    message: impl Into<String>,
    next: impl Into<String>,
) {
    report.findings.push(Finding {
        severity,
        code: code.to_owned(),
        message: message.into(),
        next: next.into(),
    });
}

fn refresh_summary(report: &mut Report) {
    report.verdict = if report
        .findings
        .iter()
        .any(|item| item.severity == Severity::Error)
    {
        Verdict::Blocked
    } else if report
        .findings
        .iter()
        .any(|item| item.severity == Severity::Warning)
    {
        Verdict::Caution
    } else {
        Verdict::Ready
    };
    report.suggestions = report
        .findings
        .iter()
        .map(|finding| finding.next.clone())
        .chain(std::iter::once(if report.network_opt_in {
            "Review the project ID above before running any write command.".to_owned()
        } else {
            "Run again with --network when you are ready to validate login and project access."
                .to_owned()
        }))
        .fold(Vec::new(), |mut list, item| {
            if !list.contains(&item) {
                list.push(item);
            }
            list
        });
}

pub fn diagnose_local(options: &DiagnoseOptions) -> Result<Report, DiagnoseError> {
    let root = find_project_root(&options.start)?;
    let firebase_config = read_json(&root.join("firebase.json"))?;
    let rc = read_json(&root.join(".firebaserc"))?;
    let project_aliases = aliases(rc.as_ref());
    let project = select_project(
        options.project_override.as_deref(),
        &options.environment,
        &project_aliases,
    );
    let configured = configured_emulators(firebase_config.as_ref());
    let active = environment_emulators(&options.environment);
    let mut report = Report {
        schema_version: 1,
        root: root
            .file_name()
            .and_then(|name| name.to_str())
            .unwrap_or(".")
            .to_owned(),
        verdict: Verdict::Ready,
        project,
        target: if active.is_empty() {
            "cloud".into()
        } else if configured.keys().all(|key| active.contains_key(key)) {
            "emulators".into()
        } else {
            "hybrid".into()
        },
        cli: detect_cli(),
        auth: detect_cached_auth(&options.environment),
        network_opt_in: false,
        emulators: Vec::new(),
        rules: Vec::new(),
        findings: Vec::new(),
        suggestions: Vec::new(),
    };

    if report.project.is_none() {
        add_finding(
            &mut report,
            Severity::Error,
            "project_missing",
            "No active Firebase project could be selected.",
            "Add projects.default to .firebaserc or pass --project explicitly.",
        );
    }
    if let Some(project) = report.project.clone() {
        if project.production_like {
            add_finding(
                &mut report,
                Severity::Warning,
                "production_target",
                format!("Project '{}' looks production-like.", project.id),
                "Confirm this project ID before any command that can write or deploy.",
            );
        }
        if let Some(default) = &project.default_id {
            if project.source != ".firebaserc (default)" && default != &project.id {
                add_finding(
                    &mut report,
                    Severity::Warning,
                    "project_context_mismatch",
                    format!(
                        "{} selects '{}' while .firebaserc defaults to '{}'.",
                        project.source, project.id, default
                    ),
                    "Unset the overriding environment variable or pass --project with the intended ID.",
                );
            }
        }
    }
    if report.cli.state == CheckState::Warning {
        let summary = report.cli.summary.clone();
        add_finding(
            &mut report,
            Severity::Warning,
            "cli_unavailable",
            summary,
            "Install or repair firebase-tools before using --network.",
        );
    }
    if report.auth.state == CheckState::Warning {
        let summary = report.auth.summary.clone();
        add_finding(
            &mut report,
            Severity::Warning,
            "credential_path_missing",
            summary,
            "Correct or unset GOOGLE_APPLICATION_CREDENTIALS.",
        );
    }

    let services: BTreeMap<String, ()> = configured
        .keys()
        .chain(active.keys())
        .map(|key| (key.clone(), ()))
        .collect();
    for service in services.keys() {
        let expected = configured.get(service).cloned();
        let actual = active.get(service).cloned();
        let state = match (&expected, &actual) {
            (Some(expected), Some(actual))
                if normalize_endpoint(expected) == normalize_endpoint(actual) =>
            {
                CheckState::Ok
            }
            (Some(_), Some(_)) | (None, Some(_)) => CheckState::Warning,
            (Some(_), None) => CheckState::Skipped,
            (None, None) => CheckState::Skipped,
        };
        report.emulators.push(EmulatorCheck {
            service: service.clone(),
            configured: expected.clone(),
            environment: actual.clone(),
            state: state.clone(),
        });
        if state == CheckState::Warning {
            add_finding(
                &mut report,
                Severity::Warning,
                "emulator_mismatch",
                format!(
                    "{service} emulator environment is '{}' but firebase.json expects '{}'.",
                    actual.as_deref().unwrap_or("not configured"),
                    expected.as_deref().unwrap_or("no endpoint")
                ),
                "Align the emulator host environment variable with firebase.json, or unset it to use cloud services intentionally.",
            );
        }
    }

    for (service, relative) in rules_paths(firebase_config.as_ref()) {
        let path = root.join(&relative);
        match fs::read(&path) {
            Ok(bytes) => {
                let hash = format!("{:x}", Sha256::digest(bytes));
                report.rules.push(RulesCheck {
                    service,
                    path: relative,
                    sha256: Some(hash),
                    state: CheckState::Ok,
                });
            }
            Err(_) => {
                report.rules.push(RulesCheck {
                    service: service.clone(),
                    path: relative.clone(),
                    sha256: None,
                    state: CheckState::Error,
                });
                add_finding(
                    &mut report,
                    Severity::Error,
                    "rules_missing",
                    format!("Configured {service} rules file '{relative}' could not be read."),
                    "Restore the rules file or correct its path in firebase.json.",
                );
            }
        }
    }
    refresh_summary(&mut report);
    Ok(report)
}

#[derive(Debug, Clone)]
pub struct CommandResult {
    pub success: bool,
    pub stdout: String,
    /// Kept private to the report. Firebase CLI diagnostics can identify an
    /// authentication failure, but they are never rendered or serialized.
    pub stderr: String,
}

pub trait FirebaseRunner {
    fn run(&self, args: &[&str]) -> CommandResult;
}

pub struct ProcessFirebaseRunner {
    pub timeout: Duration,
}

impl Default for ProcessFirebaseRunner {
    fn default() -> Self {
        Self {
            timeout: Duration::from_secs(25),
        }
    }
}

impl FirebaseRunner for ProcessFirebaseRunner {
    fn run(&self, args: &[&str]) -> CommandResult {
        let Ok(mut child) = Command::new("firebase")
            .args(args)
            .stdin(Stdio::null())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
        else {
            return CommandResult {
                success: false,
                stdout: String::new(),
                stderr: String::new(),
            };
        };
        let start = Instant::now();
        loop {
            match child.try_wait() {
                Ok(Some(_)) => {
                    return child
                        .wait_with_output()
                        .map(|output| CommandResult {
                            success: output.status.success(),
                            stdout: String::from_utf8_lossy(&output.stdout).into_owned(),
                            stderr: String::from_utf8_lossy(&output.stderr).into_owned(),
                        })
                        .unwrap_or(CommandResult {
                            success: false,
                            stdout: String::new(),
                            stderr: String::new(),
                        });
                }
                Ok(None) if start.elapsed() < self.timeout => {
                    thread::sleep(Duration::from_millis(50))
                }
                _ => {
                    let _ = child.kill();
                    let _ = child.wait();
                    return CommandResult {
                        success: false,
                        stdout: String::new(),
                        stderr: String::new(),
                    };
                }
            }
        }
    }
}

fn has_authorized_account(value: &Value) -> bool {
    match value {
        Value::Object(object) => {
            let direct_account = object
                .get("email")
                .and_then(Value::as_str)
                .is_some_and(|email| !email.trim().is_empty());
            direct_account || object.values().any(has_authorized_account)
        }
        Value::Array(items) => items.iter().any(has_authorized_account),
        _ => false,
    }
}

fn command_error_text(result: &CommandResult) -> String {
    format!("{}\n{}", result.stdout, result.stderr).to_ascii_lowercase()
}

fn looks_like_auth_failure(result: &CommandResult) -> bool {
    let text = command_error_text(result);
    [
        "authentication",
        "unauthenticated",
        "credential",
        "reauth",
        "login",
        "not logged in",
        "token expired",
    ]
    .iter()
    .any(|needle| text.contains(needle))
}

fn looks_like_permission_failure(result: &CommandResult) -> bool {
    let text = command_error_text(result);
    ["permission", "forbidden", "not authorized", "access denied"]
        .iter()
        .any(|needle| text.contains(needle))
}

fn set_auth_invalid(report: &mut Report, message: &str) {
    report.auth = Check {
        state: CheckState::Error,
        summary: "Firebase sign-in needs attention".into(),
    };
    if !report
        .findings
        .iter()
        .any(|finding| finding.code == "auth_invalid")
    {
        add_finding(
            report,
            Severity::Error,
            "auth_invalid",
            message,
            "Run firebase login, then repeat this read-only check with --network.",
        );
    }
}

fn contains_project(value: &Value, project_id: &str) -> bool {
    match value {
        Value::Object(object) => object.iter().any(|(key, value)| {
            ((key == "projectId" || key == "project_id") && value.as_str() == Some(project_id))
                || contains_project(value, project_id)
        }),
        Value::Array(items) => items.iter().any(|item| contains_project(item, project_id)),
        _ => false,
    }
}

pub fn apply_network_checks(report: &mut Report, runner: &dyn FirebaseRunner) {
    report.network_opt_in = true;
    let login = runner.run(&["login:list", "--json"]);
    let account_is_listed = login.success
        && serde_json::from_str::<Value>(&login.stdout)
            .ok()
            .is_some_and(|json| has_authorized_account(&json));
    if account_is_listed {
        report.auth = Check {
            state: CheckState::Ok,
            summary: "Firebase account found; checking project access".into(),
        };
    } else {
        set_auth_invalid(
            report,
            "Firebase CLI has no signed-in account, or the account list could not be read.",
        );
    }

    if let Some(project_id) = report.project.as_ref().map(|project| project.id.clone()) {
        let projects = runner.run(&["projects:list", "--json"]);
        if !projects.success {
            if looks_like_auth_failure(&projects) {
                set_auth_invalid(
                    report,
                    "Firebase rejected the current sign-in while checking project access.",
                );
            } else if looks_like_permission_failure(&projects) {
                add_finding(
                    report,
                    Severity::Error,
                    "project_inaccessible",
                    "Firebase rejected access to the selected project.",
                    "Confirm the project ID and account permissions in firebase projects:list.",
                );
            } else {
                add_finding(
                    report,
                    Severity::Error,
                    "cloud_unreachable",
                    "Firebase projects could not be listed because the network check did not complete.",
                    "Check connectivity, then retry with --network.",
                );
            }
        } else if serde_json::from_str::<Value>(&projects.stdout)
            .ok()
            .is_none_or(|json| !contains_project(&json, &project_id))
        {
            add_finding(
                report,
                Severity::Error,
                "project_inaccessible",
                format!("Project '{project_id}' is not visible to the current Firebase account."),
                "Confirm the project ID and account permissions in firebase projects:list.",
            );
        } else if account_is_listed {
            report.auth = Check {
                state: CheckState::Ok,
                summary: "Firebase sign-in and project access checked".into(),
            };
        }
    }
    refresh_summary(report);
}

pub fn render_card(report: &Report) -> String {
    let mut lines = vec!["FIREBASE ENVIRONMENT DOCTOR · READ-ONLY PREFLIGHT".to_owned()];
    if let Some(project) = &report.project {
        let alias = project
            .alias
            .as_ref()
            .map(|value| format!(" via alias {value}"))
            .unwrap_or_default();
        lines.push(format!(
            "Project   {} · from {}{}",
            project.id, project.source, alias
        ));
    } else {
        lines.push("Project   not selected".into());
    }
    lines.push(format!(
        "Target    {} · {}",
        report.target.to_ascii_uppercase(),
        if report.target == "cloud" {
            "remote project selected"
        } else {
            "emulator variables detected"
        }
    ));
    lines.push(format!("CLI       {}", report.cli.summary));
    lines.push(format!("Auth      {}", report.auth.summary));
    for emulator in &report.emulators {
        lines.push(format!(
            "Emulator  {} · config {} · env {}",
            emulator.service,
            emulator.configured.as_deref().unwrap_or("—"),
            emulator.environment.as_deref().unwrap_or("—")
        ));
    }
    for rules in &report.rules {
        lines.push(format!(
            "Rules     {} · {} · sha256:{}",
            rules.service,
            rules.path,
            rules
                .sha256
                .as_deref()
                .map(|hash| &hash[..12])
                .unwrap_or("unavailable")
        ));
    }
    let warnings = report
        .findings
        .iter()
        .filter(|item| item.severity == Severity::Warning)
        .count();
    let errors = report
        .findings
        .iter()
        .filter(|item| item.severity == Severity::Error)
        .count();
    lines.push(format!(
        "Verdict   {} · {} error{} · {} warning{}",
        format!("{:?}", report.verdict).to_ascii_uppercase(),
        errors,
        if errors == 1 { "" } else { "s" },
        warnings,
        if warnings == 1 { "" } else { "s" }
    ));
    if !report.findings.is_empty() {
        lines.push(String::new());
        lines.push("Findings".into());
        for finding in &report.findings {
            lines.push(format!(
                "  [{}] {}",
                match finding.severity {
                    Severity::Info => "info",
                    Severity::Warning => "warn",
                    Severity::Error => "error",
                },
                finding.message
            ));
        }
    }
    lines.push(String::new());
    lines.push("Next checks".into());
    for suggestion in &report.suggestions {
        lines.push(format!("  - {suggestion}"));
    }
    lines.join("\n")
}
