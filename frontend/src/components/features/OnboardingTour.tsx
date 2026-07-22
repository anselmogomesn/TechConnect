import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import {
  Zap, Medal, Map, MessageCircle, Users, FileText, UserPlus,
  Check, ArrowRight, Sparkles, Bot,
} from 'lucide-react';

const steps = [
  {
    icon: Sparkles, color: 'from-primary-500 to-purple-600',
    title: 'Bem-vindo à TechConnect! 🚀',
    desc: 'Sua rede social profissional com gamificação! Vamos te mostrar os principais recursos em 30 segundos.',
    action: 'Vamos lá!',
    route: '/feed',
  },
  {
    icon: Medal, color: 'from-amber-400 to-orange-500',
    title: 'Ganhe XP e Badges 🏅',
    desc: 'Cada ação sua na plataforma rende XP! Publique posts, comente, curta e siga pessoas para subir de nível e desbloquear badges exclusivos.',
    action: 'Entendi!',
    route: '/badges',
  },
  {
    icon: Map, color: 'from-emerald-400 to-green-500',
    title: 'Caça ao Tesouro Diária 🗺️',
    desc: 'Todo dia tem um tesouro escondido! Resolva a pista, encontre o local certo e ganhe 50 XP + bônus de streak.',
    action: 'Quero jogar!',
    route: '/treasure',
  },
  {
    icon: UserPlus, color: 'from-blue-400 to-indigo-500',
    title: 'Conecte-se com Pessoas 👥',
    desc: 'Encontre colegas da sua área na página Amigos. Siga quem te inspira e construa sua rede profissional.',
    action: 'Ver amigos',
    route: '/friends',
  },
  {
    icon: Bot, color: 'from-primary-500 to-purple-600',
    title: 'TechBot - Seu Assistente 🤖',
    desc: 'Precisando de ajuda? O TechBot responde perguntas sobre a plataforma, dá dicas personalizadas e tem memória das conversas!',
    action: 'Finalizar! 🎉',
    route: '/feed',
  },
];

export function OnboardingTour() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem('techconnect-onboarding');
    if (!seen && user) {
      setDismissed(false);
    }
  }, [user]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('techconnect-onboarding', 'done');
      setDismissed(true);
    }
  };

  const handleAction = () => {
    navigate(steps[step].route);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('techconnect-onboarding', 'done');
      setDismissed(true);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('techconnect-onboarding', 'done');
    setDismissed(true);
  };

  const s = steps[step];

  return (
    <AnimatePresence>
      {!dismissed && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />

          {/* Card */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md"
          >
            <div className="card p-6 sm:p-8 shadow-2xl border-primary-500/20">
              {/* Progress */}
              <div className="flex items-center gap-1.5 mb-6">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                    i <= step ? 'bg-primary-500' : 'bg-surface-200 dark:bg-dark-700'
                  }`} />
                ))}
                <button onClick={handleSkip} className="text-xs text-surface-400 dark:text-dark-500 hover:text-surface-600 ml-2 shrink-0">
                  Pular
                </button>
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                <s.icon className="w-8 h-8 text-white" />
              </div>

              {/* Text */}
              <h2 className="text-xl font-bold text-surface-900 dark:text-white text-center mb-2">{s.title}</h2>
              <p className="text-sm text-surface-500 dark:text-dark-400 text-center leading-relaxed mb-6">{s.desc}</p>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3">
                <Button onClick={handleAction} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {s.action}
                </Button>
              </div>

              <p className="text-center text-[10px] text-surface-400 dark:text-dark-500 mt-4">
                {step + 1} de {steps.length}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
