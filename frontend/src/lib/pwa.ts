// TechConnect - PWA Registration + Install Prompt

let deferredPrompt: any = null;

export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        (reg) => console.log('✅ SW registrado:', reg.scope),
        (err) => console.log('❌ SW erro:', err)
      );
    });
  }
}

export function listenInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
}

export function canInstall(): boolean {
  return deferredPrompt !== null;
}

export async function triggerInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return outcome === 'accepted';
}
