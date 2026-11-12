// PWA glue: service worker registration + "Install" button.
// Skipped inside Electron (custom app:// scheme has no service workers and doesn't need them).

if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !window.desktop) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

const btn = document.getElementById('installBtn');
let deferred = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferred = e;
  if (btn) btn.hidden = false;
});

window.addEventListener('appinstalled', () => { if (btn) btn.hidden = true; });

if (btn) {
  btn.onclick = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    btn.hidden = true;
  };
}
