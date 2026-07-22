import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { TechBackground } from '../ui/TechBackground';
import { Sun, Moon, Monitor, Zap } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { theme, setTheme } = useTheme();
  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white dark:bg-dark-950">
      {/* Tech background */}
      <TechBackground variant="auth" />

      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
          className="p-2 rounded-xl bg-white/10 dark:bg-dark-800/50 backdrop-blur-xl
                     text-surface-400 dark:text-dark-300 hover:bg-white/20 dark:hover:bg-dark-700/50
                     transition-all duration-200 border border-white/10 dark:border-dark-700/50
                     shadow-lg shadow-black/5"
        >
          <ThemeIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Left panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-primary-500/30">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                TechConnect
              </span>
              <span className="block text-[10px] tracking-[0.2em] uppercase text-surface-400 dark:text-dark-500 font-medium">
                Rede Profissional
              </span>
            </div>
          </div>

          {/* Tagline */}
          <h1 className="text-5xl font-bold text-surface-900 dark:text-white mb-6 leading-tight">
            Conecte-se ao<br />
            <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-purple-500 bg-clip-text text-transparent">
              futuro do trabalho
            </span>
          </h1>

          <p className="text-lg text-surface-500 dark:text-dark-400 mb-10 max-w-md leading-relaxed">
            A rede social profissional onde tecnologia e talento se encontram.
          </p>

          {/* Features */}
          <div className="space-y-5">
            {[
              { icon: '✦', title: 'Perfil inteligente', desc: 'Destaque suas habilidades com badges e conquistas' },
              { icon: '◆', title: 'Networking tech', desc: 'Conecte-se com profissionais da sua área' },
              { icon: '⚡', title: 'Gamificação', desc: 'Ganhe XP, suba de nível e destaque-se' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                className="flex items-start gap-4 group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20
                                flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-sm text-primary-500">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-surface-700 dark:text-dark-200 text-sm">{item.title}</h3>
                  <p className="text-sm text-surface-400 dark:text-dark-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-12 flex items-center gap-8 p-4 rounded-2xl bg-white/5 dark:bg-dark-800/30 backdrop-blur-sm border border-white/10 dark:border-dark-700/30"
          >
            {[
              { value: '10k+', label: 'Profissionais' },
              { value: '500+', label: 'Comunidades' },
              { value: '50k+', label: 'Conexões' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-[10px] text-surface-400 dark:text-dark-500 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                TechConnect
              </span>
            </div>
          </div>

          {/* Glass card for form */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-3xl blur-lg opacity-50" />
            <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-2xl rounded-2xl p-8
                            border border-white/20 dark:border-dark-700/50 shadow-2xl shadow-black/10">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
