import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { TechBackground } from '../components/ui/TechBackground';
import {
  ArrowRight, Shield, Zap, Users, Trophy, MessageCircle, Sparkles,
  Sun, Moon, Monitor,
} from 'lucide-react';

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 relative overflow-hidden">
      <TechBackground variant="auth" />
      <div className="relative z-10">
        {/* Theme toggle */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
            className="p-2 rounded-xl bg-white/10 dark:bg-dark-800/50 backdrop-blur-xl
                       text-surface-400 dark:text-dark-300 hover:bg-white/20 dark:hover:bg-dark-700/50
                       border border-white/10 dark:border-dark-700/50 transition-all"
          >
            <ThemeIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <header className="border-b border-surface-200/50 dark:border-dark-800/50 bg-white/50 dark:bg-dark-900/50 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                TechConnect
              </span>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link to="/feed" className="btn-primary">
                  Ir para o Feed <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary">Entrar</Link>
                  <Link to="/register" className="btn-primary">Criar conta</Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 py-28 relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-8 border border-primary-500/20">
                <Sparkles className="w-4 h-4" />
                Onde profissionais se conectam
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-surface-900 dark:text-white mb-6 leading-[1.1]">
                Construa seu<br />
                <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-purple-500 bg-clip-text text-transparent">
                  futuro profissional
                </span>
              </h1>

              <p className="text-xl text-surface-500 dark:text-dark-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                A rede social onde tecnologia, conhecimento e oportunidades se encontram.
                Evolua seu perfil, ganhe XP e conecte-se com profissionais incríveis.
              </p>

              <div className="flex items-center justify-center gap-4">
                {!isAuthenticated && (
                  <Link to="/register" className="btn-primary text-base px-8 py-3 shadow-2xl shadow-primary-500/25">
                    Começar agora <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
                <Link to={isAuthenticated ? '/feed' : '/login'}
                  className="btn-secondary text-base px-8 py-3">
                  {isAuthenticated ? 'Ir para o Feed' : 'Já tenho conta'}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 border-t border-surface-200/50 dark:border-dark-800/50">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-4">Tudo que você precisa</h2>
              <p className="text-surface-500 dark:text-dark-400 max-w-2xl mx-auto">Ferramentas profissionais para construir sua marca e acelerar sua carreira.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: 'Perfil Inteligente', desc: 'Badges, conquistas e um perfil que mostra sua evolução profissional.', gradient: 'from-blue-500 to-blue-600' },
                { icon: Zap, title: 'Feed Curado', desc: 'Conteúdo relevante baseado nos seus interesses e área de atuação.', gradient: 'from-primary-500 to-purple-600' },
                { icon: Users, title: 'Comunidades', desc: 'Espaços dedicados para conectar com profissionais da sua área.', gradient: 'from-green-500 to-emerald-600' },
                { icon: Trophy, title: 'Gamificação', desc: 'Ganhe XP, suba de nível e desbloqueie conquistas ao contribuir.', gradient: 'from-yellow-500 to-orange-600' },
                { icon: MessageCircle, title: 'Chat em Tempo Real', desc: 'Converse com outros profissionais com mensagens instantâneas.', gradient: 'from-pink-500 to-rose-600' },
                { icon: Sparkles, title: 'Reconhecimento', desc: 'Badges, rankings e reputação para destacar seu talento.', gradient: 'from-purple-500 to-violet-600' },
              ].map((feature, i) => (
                <motion.div key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-6 rounded-2xl bg-white dark:bg-dark-800/50 border border-surface-200/50 dark:border-dark-700/50
                             hover:border-primary-500/30 dark:hover:border-primary-500/20 transition-all duration-300
                             hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-surface-500 dark:text-dark-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-surface-200/50 dark:border-dark-800/50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-4">
                Pronto para <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">evoluir</span>?
              </h2>
              <p className="text-surface-500 dark:text-dark-400 mb-8 max-w-lg mx-auto">
                Junte-se à comunidade que está construindo o futuro do trabalho.
              </p>
              {!isAuthenticated && (
                <Link to="/register" className="btn-primary text-base px-10 py-3 shadow-2xl shadow-primary-500/25">
                  Criar conta gratuita <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-surface-200/50 dark:border-dark-800/50 py-8 bg-white/50 dark:bg-dark-900/50">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-surface-400 dark:text-dark-500 text-sm">
              <Zap className="w-4 h-4 text-primary-500" />
              <span>&copy; 2026 TechConnect. Todos os direitos reservados.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-surface-400 dark:text-dark-500">
              <a href="#" className="hover:text-surface-600 dark:hover:text-dark-300 transition-colors">Termos</a>
              <a href="#" className="hover:text-surface-600 dark:hover:text-dark-300 transition-colors">Privacidade</a>
              <a href="#" className="hover:text-surface-600 dark:hover:text-dark-300 transition-colors">Ajuda</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
