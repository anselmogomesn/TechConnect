import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import {
  MapPin, Compass, Sparkles, Zap, Flame, Loader2,
  Search, Lightbulb, Trophy, ArrowRight,
} from 'lucide-react';

const locations = [
  { id: 'feed', label: 'Feed', icon: '📝', desc: 'Página principal de postagens' },
  { id: 'profile', label: 'Meu Perfil', icon: '👤', desc: 'Seu perfil pessoal' },
  { id: 'communities', label: 'Comunidades', icon: '🏛️', desc: 'Página de comunidades' },
  { id: 'badges', label: 'Coleções', icon: '🏅', desc: 'Badges e conquistas' },
  { id: 'messages', label: 'Mensagens', icon: '💬', desc: 'Chat e conversas' },
  { id: 'notifications', label: 'Notificações', icon: '🔔', desc: 'Central de notificações' },
  { id: 'settings', label: 'Configurações', icon: '⚙️', desc: 'Configurações da conta' },
  { id: 'search', label: 'Busca', icon: '🔍', desc: 'Pesquisar na plataforma' },
];

export function TreasureHuntPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const { data: treasure, isLoading } = useQuery({
    queryKey: ['treasure'],
    queryFn: async () => {
      const { data } = await api.get('/treasure/daily');
      return data;
    },
  });

  const searchMutation = useMutation({
    mutationFn: async (location: string) => {
      const { data } = await api.post('/treasure/search', { location });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['treasure'] });
      if (data.found) {
        toast.success(data.message, { duration: 5000 });
      } else {
        toast(data.message, { icon: '🔍', duration: 3000 });
      }
    },
  });

  const handleSearch = (locationId: string) => {
    setSelectedLocation(locationId);
    setSearching(true);
    searchMutation.mutate(locationId, {
      onSettled: () => setSearching(false),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const isFound = treasure?.found;
  const attemptsLeft = 3 - (treasure?.attempts || 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="card overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border-amber-200/50 dark:border-amber-700/30">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900 dark:text-white">Caça ao Tesouro 🗺️</h1>
              <p className="text-sm text-surface-500 dark:text-dark-400">Encontre o tesouro escondido e ganhe XP!</p>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-dark-800/40 border border-amber-200/50 dark:border-amber-700/30">
            <div className="flex items-center gap-2">
              <Flame className={`w-5 h-5 ${(treasure?.streakCount || 0) > 0 ? 'text-orange-500' : 'text-surface-300'}`} />
              <span className="text-sm font-semibold text-surface-700 dark:text-dark-200">
                Streak: {treasure?.streakCount || 0}d
              </span>
            </div>
            <div className="text-xs text-surface-400 dark:text-dark-500">
              Bônus: +{(treasure?.streakCount || 0 + 1) * 10} XP
            </div>
            <div className="ml-auto text-xs font-medium text-amber-600 dark:text-amber-400">
              +{treasure?.xpReward || 50} XP base
            </div>
          </div>
        </div>
      </div>

      {/* Clue */}
      <div className="card p-6 text-center">
        {isFound ? (
          <div className="space-y-3">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-lg font-bold text-green-600 dark:text-green-400">Tesouro encontrado hoje!</h2>
            <p className="text-sm text-surface-500 dark:text-dark-400">Volte amanhã para uma nova aventura!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-4xl mb-2">🗺️</div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Tesouro do Dia</h2>
            <p className="text-base text-surface-600 dark:text-dark-300 italic leading-relaxed px-4">
              "{treasure?.clue}"
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-surface-400 dark:text-dark-500">
              <Search className="w-4 h-4" />
              <span>Tentativas restantes: {attemptsLeft}</span>
            </div>
          </div>
        )}
      </div>

      {/* Search locations */}
      {!isFound && (
        <div>
          <h3 className="text-sm font-semibold text-surface-500 dark:text-dark-400 uppercase tracking-wider mb-3">
            Onde você quer procurar?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {locations.map((loc) => {
              const isDisabled = attemptsLeft <= 0 || searching;
              const wasSearched = selectedLocation === loc.id && searchMutation.isPending;
              return (
                <button
                  key={loc.id}
                  onClick={() => handleSearch(loc.id)}
                  disabled={isDisabled}
                  className={`p-3 rounded-xl border text-left transition-all group ${
                    isDisabled
                      ? 'opacity-40 cursor-not-allowed border-surface-200 dark:border-dark-700'
                      : 'border-surface-200 dark:border-dark-700 hover:border-amber-400/50 hover:shadow-md hover:-translate-y-0.5 bg-white dark:bg-dark-800'
                  }`}
                >
                  <div className="text-2xl mb-1">{loc.icon}</div>
                  <p className="text-sm font-medium text-surface-700 dark:text-dark-200">{loc.label}</p>
                  <p className="text-[10px] text-surface-400 dark:text-dark-500">{loc.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {searchMutation.data && !searchMutation.data.found && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card p-4 border-amber-200 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/10"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <p className="text-sm text-surface-700 dark:text-dark-200">{searchMutation.data.message}</p>
                {searchMutation.data.hintRevealed && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" /> Dica revelada!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP info */}
      <div className="card p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/10 dark:to-purple-900/10">
        <h3 className="text-sm font-semibold text-surface-700 dark:text-dark-200 mb-2 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" /> Recompensas
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="p-2 rounded-lg bg-white/60 dark:bg-dark-800/40">
            <p className="font-bold text-amber-500">{treasure?.xpReward || 50}</p>
            <p className="text-[10px] text-surface-400">XP Base</p>
          </div>
          <div className="p-2 rounded-lg bg-white/60 dark:bg-dark-800/40">
            <p className="font-bold text-orange-500">+{((treasure?.streakCount || 0) + 1) * 10}</p>
            <p className="text-[10px] text-surface-400">Bônus Streak</p>
          </div>
          <div className="p-2 rounded-lg bg-white/60 dark:bg-dark-800/40">
            <p className="font-bold text-primary-500">{(treasure?.xpReward || 50) + ((treasure?.streakCount || 0) + 1) * 10}</p>
            <p className="text-[10px] text-surface-400">XP Total</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
