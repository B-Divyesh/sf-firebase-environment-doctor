import './styles.css';

const demoKey = 'demo:firebase-environment-doctor:reset';
const pageRoute = document.body.dataset.route ?? 'Page';
const announcement = document.querySelector<HTMLElement>('[data-route-announcement]');

if (location.pathname === '/' && new URLSearchParams(location.search).get('demo') === '1') {
  location.replace('/demo/?demo=1');
}

window.requestAnimationFrame(() => {
  const heading = document.querySelector<HTMLElement>('main h1');
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
  if (announcement) announcement.textContent = `${pageRoute} page loaded.`;
});

document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy ?? '';
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = 'Copied install command';
    } catch {
      button.textContent = 'Select install command';
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

if (document.querySelector('[data-demo-output]')) {
  try { localStorage.setItem(demoKey, 'active'); } catch { /* Demo works without storage. */ }
}

document.querySelector<HTMLButtonElement>('[data-reset-demo]')?.addEventListener('click', () => {
  try { localStorage.removeItem(demoKey); } catch { /* No persistent demo state exists. */ }
  const output = document.querySelector<HTMLElement>('[data-demo-output]');
  if (output) output.dataset.reset = String(Date.now());
  if (announcement) announcement.textContent = 'Demo reset. Sample project check loaded.';
});

document.querySelector<HTMLAnchorElement>('[data-start-real]')?.addEventListener('click', () => {
  try { localStorage.removeItem(demoKey); } catch { /* No persistent demo state exists. */ }
});
