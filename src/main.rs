use clap::Parser;
use firebase_environment_doctor::{
    DiagnoseOptions, ProcessFirebaseRunner, Severity, Verdict, apply_network_checks,
    diagnose_local, render_card,
};
use std::path::PathBuf;
use std::process::ExitCode;
use std::{env, fs};

#[derive(Debug, Parser)]
#[command(
    name = "firebase-environment-doctor",
    version,
    about = "Check a Firebase project before a risky command",
    long_about = "Inspect the active Firebase project, local sign-in marker, emulator addresses, and rules files. Network access is off unless --network is passed. The command only runs read-only Firebase checks.",
    after_help = "Exit codes:\n  0  environment is usable\n  1  errors found, or warnings with --strict\n  2  invalid invocation or unreadable input\n\nNetwork mode runs only: firebase login:list --json; firebase projects:list --json"
)]
struct Cli {
    /// Project ID or .firebaserc alias to inspect without changing files
    #[arg(long, value_name = "ID_OR_ALIAS")]
    project: Option<String>,

    /// Opt in to read-only Firebase login and project-list network checks
    #[arg(long)]
    network: bool,

    /// Emit versioned JSON for scripts
    #[arg(long)]
    json: bool,

    /// Return exit 1 when warnings are present
    #[arg(long)]
    strict: bool,

    /// Directory to inspect; parent directories are searched
    #[arg(long, value_name = "PATH", default_value = ".")]
    root: PathBuf,

    /// Run the bundled sample project from a new temporary directory
    #[arg(long)]
    demo: bool,
}

fn make_demo_workspace() -> Result<PathBuf, String> {
    let nonce = format!(
        "firebase-environment-doctor-demo-{}-{}",
        std::process::id(),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map_err(|error| error.to_string())?
            .as_nanos()
    );
    let root = env::temp_dir().join(nonce);
    fs::create_dir_all(&root)
        .map_err(|error| format!("could not create demo directory: {error}"))?;
    fs::write(
        root.join(".firebaserc"),
        include_str!("../examples/demo-wrong-project/.firebaserc"),
    )
    .map_err(|error| format!("could not write demo project: {error}"))?;
    fs::write(
        root.join("firebase.json"),
        include_str!("../examples/demo-wrong-project/firebase.json"),
    )
    .map_err(|error| format!("could not write demo project: {error}"))?;
    fs::write(
        root.join("firestore.rules"),
        include_str!("../examples/demo-wrong-project/firestore.rules"),
    )
    .map_err(|error| format!("could not write demo rules: {error}"))?;
    Ok(root)
}

fn run(cli: Cli) -> Result<ExitCode, String> {
    let demo_root = cli.demo.then(make_demo_workspace).transpose()?;
    let requested_root = demo_root.as_ref().unwrap_or(&cli.root);
    let start = requested_root
        .canonicalize()
        .map_err(|error| format!("could not open {}: {error}", requested_root.display()))?;
    let project = if cli.demo {
        Some("sample-store-prod".to_owned())
    } else {
        cli.project
    };
    let options = DiagnoseOptions::from_process(start, project);
    let mut report = diagnose_local(&options).map_err(|error| error.to_string())?;
    if cli.network {
        apply_network_checks(&mut report, &ProcessFirebaseRunner::default());
    }
    if cli.json {
        println!(
            "{}",
            serde_json::to_string_pretty(&report).map_err(|error| error.to_string())?
        );
    } else {
        if let Some(root) = demo_root {
            println!("Demo sample copied to {}", root.display());
            println!("This temporary sample is separate from your project.\n");
        }
        println!("{}", render_card(&report));
    }
    let has_warning = report
        .findings
        .iter()
        .any(|finding| finding.severity == Severity::Warning);
    Ok(
        if report.verdict == Verdict::Blocked || (cli.strict && has_warning) {
            ExitCode::from(1)
        } else {
            ExitCode::SUCCESS
        },
    )
}

fn main() -> ExitCode {
    let cli = Cli::parse();
    match run(cli) {
        Ok(code) => code,
        Err(message) => {
            eprintln!("firebase-environment-doctor: {message}");
            ExitCode::from(2)
        }
    }
}
