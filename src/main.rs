use clap::Parser;
use firebase_environment_doctor::{
    DiagnoseOptions, ProcessFirebaseRunner, Severity, Verdict, apply_network_checks,
    diagnose_local, render_card,
};
use std::path::PathBuf;
use std::process::ExitCode;

#[derive(Debug, Parser)]
#[command(
    name = "firebase-environment-doctor",
    version,
    about = "Read-only Firebase environment preflight",
    long_about = "Inspect the active Firebase project, local credential markers, emulator endpoints, rules hashes, and CLI reachability before debugging data. Network access is off unless --network is passed. This command never deploys or modifies Firebase state.",
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

    /// Disable interactive/colored behavior (the doctor never prompts)
    #[arg(long)]
    ci: bool,

    /// Return exit 1 when warnings are present
    #[arg(long)]
    strict: bool,

    /// Directory to inspect; parent directories are searched
    #[arg(long, value_name = "PATH", default_value = ".")]
    root: PathBuf,
}

fn run(cli: Cli) -> Result<ExitCode, String> {
    let start = cli
        .root
        .canonicalize()
        .map_err(|error| format!("could not open {}: {error}", cli.root.display()))?;
    let options = DiagnoseOptions::from_process(start, cli.project);
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
