import { useState, useEffect } from 'react';
import { canInstall, triggerInstall } from '../../lib/pwa';
import { Download, X, Smartphone } from 'lucide-react';

export function InstallPWA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('techconnect-install-dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 60000); // Show after 1 min
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (canInstall()) setShow(true);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!show || !canInstall()) return null;

  const handleInstall = async () => {
    const ok = await triggerInstall();
    if (ok) { setShow(false); localStorage.setItem('techconnect-install-dismissed', 'done'); }
  };

  return (
    <div className="fixed bottom-24 right-6 z-40 w-72 p-4 rounded-2xl bg-white dark:bg-dark-800 shadow-2xl border border-surface-200 dark:border-dark-700">
      <button onClick={() => { setShow(false); localStorage.setItem('techconnect-install-dismissed', 'done'); }}
        className="absolute top-2 right-2 p-1 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100">
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/20">
          <Smartphone className="w-5 h-5 text-primary-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-900 dark:text-white">Instalar TechConnect</p>
          <p className="text-xs text-surface-400 mt-0.5">Instale como app para acesso rápido!</p>
          <button onClick={handleInstall}
            className="mt-2 text-xs font-medium text-primary-500 hover:text-primary-400 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Instalar agora
          </button>
        </div>
      </div>
    </div>
  );
}
