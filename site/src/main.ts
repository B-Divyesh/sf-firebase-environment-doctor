import './styles.css';

type DemoCase = 'wrong-project' | 'expired-login' | 'emulator-mismatch';

const cases: Record<DemoCase, { label: string; tone: string; output: string }> = {
  'wrong-project': {
    label: 'Wrong project diagnosed',
    tone: 'caution',
    output: `<span class="term-dim">FIREBASE ENVIRONMENT DOCTOR · READ-ONLY PREFLIGHT</span>

Project   <strong>studio-api-prod</strong> · from FIREBASE_PROJECT
Expected  studio-api-dev · .firebaserc default
Target    CLOUD · remote project selected
Rules     firestore.rules · sha256:830e8b7c4bb7

<span class="term-warn">! CAUTION · Project context mismatch</span>
  FIREBASE_PROJECT selects “studio-api-prod”.
  Confirm this ID before any write command.`,
  },
  'expired-login': {
    label: 'Expired login diagnosed',
    tone: 'blocked',
    output: `<span class="term-dim">FIREBASE ENVIRONMENT DOCTOR · NETWORK OPTED IN</span>

Project   studio-api-dev · .firebaserc default
CLI       firebase 14.12.0 · found
Auth      validation failed
Target    CLOUD · project check unavailable

<span class="term-error">× BLOCKED · Firebase login expired</span>
  Run firebase login, then repeat with --network.
  No token or credential value was printed.`,
  },
  'emulator-mismatch': {
    label: 'Emulator mismatch diagnosed',
    tone: 'caution',
    output: `<span class="term-dim">FIREBASE ENVIRONMENT DOCTOR · READ-ONLY PREFLIGHT</span>

Project   studio-api-dev · .firebaserc default
Target    HYBRID · emulator variables detected
Auth      127.0.0.1:9099 · matches config
Firestore localhost:8181 · expected 127.0.0.1:8080

<span class="term-warn">! CAUTION · Emulator endpoint mismatch</span>
  Align FIRESTORE_EMULATOR_HOST or unset it
  to use the cloud service intentionally.`,
  },
};

const output = document.querySelector<HTMLElement>('[data-demo-output]');
const status = document.querySelector<HTMLElement>('[data-demo-status]');
const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-demo-case]'));
let updateTimer = 0;

function selectCase(name: DemoCase, announce = true) {
  const selected = cases[name];
  tabs.forEach((tab) => {
    const active = tab.dataset.demoCase === name;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  if (!output || !status) return;
  window.clearTimeout(updateTimer);
  output.setAttribute('aria-busy', 'true');
  status.textContent = announce ? 'Running local fixture…' : '';
  const render = () => {
    output.innerHTML = selected.output;
    output.dataset.tone = selected.tone;
    output.setAttribute('aria-busy', 'false');
    status.textContent = selected.label;
  };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) render();
  else updateTimer = window.setTimeout(render, 180);
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCase(tab.dataset.demoCase as DemoCase));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
      (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus();
    selectCase(tabs[next].dataset.demoCase as DemoCase);
  });
});

if (tabs.length) selectCase('wrong-project', false);

document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy ?? '';
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Select the command';
      const command = document.querySelector<HTMLElement>('[data-install-command]');
      const selection = window.getSelection();
      if (command && selection) {
        const range = document.createRange();
        range.selectNodeContents(command);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    window.setTimeout(() => { button.textContent = 'Copy install command'; }, 1800);
  });
});
