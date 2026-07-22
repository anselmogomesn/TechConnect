import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TechBackground } from '../ui/TechBackground';
import { BotAssistant } from '../features/BotAssistant';
import { OnboardingTour } from '../features/OnboardingTour';
import { InstallPWA } from '../features/InstallPWA';
import toast from 'react-hot-toast';

export function AppLayout() {
  const navigate = useNavigate();

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Only when no input is focused
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.key) {
        case 'p': case 'P': e.preventDefault(); navigate('/feed'); toast('✏️ Clique no campo "No que você está pensando?"', { icon: '📝', duration: 2000 }); break;
        case 'm': case 'M': e.preventDefault(); navigate('/messages'); break;
        case '/': if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); document.querySelector<HTMLInputElement>('[placeholder*="Buscar"]')?.focus(); } break;
        case '?': e.preventDefault(); toast(
          '📖 **Atalhos:**\n`p` — Criar post\n`m` — Mensagens\n`/` — Buscar\n`?` — Ajuda\n`g` + `f` — Feed\n`g` + `p` — Perfil', { duration: 6000, icon: '⌨️' }
        ); break;
        case 'f': if (e.ctrlKey || e.metaKey) { e.preventDefault(); navigate('/friends'); } break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-dark-950 relative">
      {/* Subtle tech background */}
      <TechBackground variant="app" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary-500/3 via-transparent to-purple-500/3 pointer-events-none" />

      {/* Onboarding Tour */}
      <OnboardingTour />

      {/* Bot Assistant */}
      <BotAssistant />
      <InstallPWA />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
          <div className="max-w-4xl mx-auto relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
