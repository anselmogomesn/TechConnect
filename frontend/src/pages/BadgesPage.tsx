import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import {
  Shield, Award, Trophy, Target, Loader2, Sparkles, AlertCircle,
  Medal, Star, Zap,
} from 'lucide-react';

const rarityGradients: Record<string, string> = {
  MYTHIC: 'from-red-500 via-purple-500 to-pink-500',
  LEGENDARY: 'from-yellow-400 to-amber-500',
  EPIC: 'from-purple-400 to-violet-500',
  RARE: 'from-blue-400 to-indigo-500',
  UNCOMMON: 'from-green-400 to-emerald-500',
  COMMON: 'from-surface-300 to-surface-400 dark:from-dark-600 dark:to-dark-500',
};

const rarityColors: Record<string, string> = {
  MYTHIC: 'text-red-400', LEGENDARY: 'text-yellow-400', EPIC: 'text-purple-400',
  RARE: 'text-blue-400', UNCOMMON: 'text-green-400', COMMON: 'text-surface-400',
};

const rarityLabels: Record<string, string> = {
  MYTHIC: 'Mítico', LEGENDARY: 'Lendário', EPIC: 'Épico',
  RARE: 'Raro', UNCOMMON: 'Incomum', COMMON: 'Comum',
};

async function fetchData(url: string) {
  const { data } = await api.get(url);
  return data.data || [];
}

export function BadgesPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'badges' | 'achievements' | 'missions'>('badges');

  const { data: badges, isLoading: badgesLoading, error: badgesErr } = useQuery({
    queryKey: ['badges'], queryFn: () => fetchData('/badges'),
  });
  const { data: userBadges, isLoading: ubLoading } = useQuery({
    queryKey: ['user-badges'], queryFn: () => fetchData('/badges/user'),
  });
  const { data: achievements, isLoading: achLoading, error: achErr } = useQuery({
    queryKey: ['achievements'], queryFn: () => fetchData('/achievements'),
  });
  const { data: userAchievements, isLoading: uaLoading } = useQuery({
    queryKey: ['user-achievements'], queryFn: () => fetchData('/achievements/user'),
  });
  const { data: missions, isLoading: misLoading, error: misErr } = useQuery({
    queryKey: ['missions'], queryFn: () => fetchData('/missions'),
  });
  const { data: userMissions, isLoading: umLoading } = useQuery({
    queryKey: ['user-missions'], queryFn: () => fetchData('/missions/user'),
  });

  const badgeList = badges || [];
  const userBadgeSlugs = new Set((userBadges || []).map((b: any) => b.slug));
  const achList = achievements || [];
  const userAchMap = new Map((userAchievements || []).map((a: any) => [a.slug, a as any]));
  const misList = missions || [];
  const userMisMap = new Map((userMissions || []).map((m: any) => [m.slug, m]));

  const tabs = [
    { key: 'badges' as const, label: 'Badges', icon: Shield, count: userBadges?.length || 0, loading: badgesLoading },
    { key: 'achievements' as const, label: 'Conquistas', icon: Trophy, count: achList.length, loading: achLoading },
    { key: 'missions' as const, label: 'Missões', icon: Target, count: misList.length, loading: misLoading },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Coleções</h1>
        <p className="text-sm text-surface-500 dark:text-dark-400">
          {user?.xp?.toLocaleString()} XP total · {userBadges?.length || 0} badges conquistados
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-100 dark:bg-dark-800 rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key
                ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-surface-500 dark:text-dark-400 hover:text-surface-700'
            }`}>
            <t.icon className="w-4 h-4" />
            {t.label}
            {t.count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                tab === t.key ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600' : 'bg-surface-200 dark:bg-dark-600 text-surface-500'
              }`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════════ BADGES ═══════════ */}
      {tab === 'badges' && (
        <>
          {badgesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card p-4 animate-pulse"><div className="h-20 bg-surface-200 dark:bg-dark-700 rounded-lg" /></div>
              ))}
            </div>
          ) : badgesErr ? (
            <div className="card p-6 text-center text-red-500"><AlertCircle className="w-8 h-8 mx-auto mb-2" />Erro ao carregar badges</div>
          ) : badgeList.length === 0 ? (
            <div className="card py-14 text-center">
              <Award className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-400">Nenhum badge disponível</p>
            </div>
          ) : (
            <div className="space-y-6">
              {(['MYTHIC', 'LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'] as const).map((rarity) => {
                const items = badgeList.filter((b: any) => b.rarity === rarity);
                if (!items.length) return null;
                return (
                  <div key={rarity}>
                    <h4 className="text-[11px] font-semibold uppercase tracking-widest text-surface-400 dark:text-dark-500 mb-2.5">
                      {rarityLabels[rarity]} ({items.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {items.map((badge: any) => {
                        const owned = userBadgeSlugs.has(badge.slug);
                        return (
                          <div key={badge.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                              owned
                                ? 'bg-white dark:bg-dark-800 border-surface-200 dark:border-dark-700'
                                : 'bg-surface-50/50 dark:bg-dark-800/30 border-surface-100 dark:border-dark-800 opacity-60'
                            }`}>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rarityGradients[rarity]} flex items-center justify-center shrink-0 shadow-sm ${!owned && 'grayscale'}`}>
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className={`text-sm font-medium truncate ${owned ? 'text-surface-900 dark:text-white' : 'text-surface-400 dark:text-dark-500'}`}>
                                {badge.name}
                              </p>
                              <p className={`text-[11px] ${rarityColors[rarity]}`}>
                                {owned ? `+${badge.xpReward} XP · ${userBadges?.find((b: any) => b.slug === badge.slug)?.rarity || 'Conquistado'}` : `+${badge.xpReward} XP`}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ═══════════ ACHIEVEMENTS ═══════════ */}
      {tab === 'achievements' && (
        <>
          {achLoading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="card p-4 animate-pulse"><div className="h-16 bg-surface-200 dark:bg-dark-700 rounded-lg" /></div>)}</div>
          ) : achErr ? (
            <div className="card p-6 text-center text-red-500"><AlertCircle className="w-8 h-8 mx-auto mb-2" />Erro</div>
          ) : achList.length === 0 ? (
            <div className="card py-14 text-center"><Trophy className="w-12 h-12 text-surface-300 mx-auto mb-3" /><p className="text-surface-400">Nenhuma conquista</p></div>
          ) : (
            <div className="space-y-2">
              {achList.map((ach: any) => {
                const userAch = userAchMap.get(ach.slug);
                const progress = userAch?.progress || 0;
                const completed = userAch?.completed || false;
                const pct = ach.maxProgress > 1 ? Math.min(Math.round((progress / ach.maxProgress) * 100), 100) : completed ? 100 : 0;
                return (
                  <div key={ach.id} className={`card p-4 transition-all ${completed ? 'border-primary-500/30' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${completed ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/20' : 'bg-surface-100 dark:bg-dark-700'}`}>
                        <Trophy className={`w-5 h-5 ${completed ? 'text-yellow-500' : 'text-surface-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-surface-900 dark:text-white">{ach.name}</p>
                          <span className="text-xs text-surface-400 dark:text-dark-500">+{ach.xpReward} XP</span>
                        </div>
                        <p className="text-xs text-surface-500 dark:text-dark-400 mt-0.5">{ach.description}</p>
                        {ach.maxProgress > 1 && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1.5 bg-surface-100 dark:bg-dark-700 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-500 ${completed ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gradient-to-r from-primary-500 to-primary-600'}`}
                                style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] text-surface-400 dark:text-dark-500 shrink-0 tabular-nums">
                              {completed ? '✓' : `${progress}/${ach.maxProgress}`}
                            </span>
                          </div>
                        )}
                        {completed && userAch?.completedAt && (
                          <p className="text-[10px] text-green-500 mt-1">Concluído em {new Date(userAch.completedAt).toLocaleDateString('pt-BR')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ═══════════ MISSIONS ═══════════ */}
      {tab === 'missions' && (
        <>
          {misLoading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="card p-4 animate-pulse"><div className="h-16 bg-surface-200 dark:bg-dark-700 rounded-lg" /></div>)}</div>
          ) : misErr ? (
            <div className="card p-6 text-center text-red-500"><AlertCircle className="w-8 h-8 mx-auto mb-2" />Erro</div>
          ) : misList.length === 0 ? (
            <div className="card py-14 text-center"><Target className="w-12 h-12 text-surface-300 mx-auto mb-3" /><p className="text-surface-400">Nenhuma missão ativa</p></div>
          ) : (
            <div className="space-y-5">
              {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((type) => {
                const items = misList.filter((m: any) => m.type === type);
                if (!items.length) return null;
                return (
                  <div key={type}>
                    <h4 className="text-[11px] font-semibold uppercase tracking-widest text-surface-400 dark:text-dark-500 mb-2.5 flex items-center gap-2">
                      {type === 'DAILY' ? <Zap className="w-3.5 h-3.5 text-yellow-500" /> : type === 'WEEKLY' ? <Star className="w-3.5 h-3.5 text-primary-500" /> : <Medal className="w-3.5 h-3.5 text-purple-500" />}
                      {type === 'DAILY' ? 'Diárias' : type === 'WEEKLY' ? 'Semanais' : 'Mensais'}
                    </h4>
                    <div className="space-y-2">
                      {items.map((mission: any) => {
                        const userMis = userMisMap.get(mission.slug);
                        const progress = userMis?.progress || 0;
                        const completed = userMis?.completed || false;
                        const pct = Math.min(Math.round((progress / mission.maxProgress) * 100), 100);
                        return (
                          <div key={mission.id} className={`card p-4 ${completed ? 'border-green-500/30 bg-green-50/30 dark:bg-green-900/10' : ''}`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${completed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-primary-50 dark:bg-primary-900/20'}`}>
                                <Target className={`w-4 h-4 ${completed ? 'text-green-500' : 'text-primary-500'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-surface-900 dark:text-white">{mission.name}</p>
                                  <span className="text-xs font-medium text-primary-500">+{mission.xpReward} XP</span>
                                </div>
                                <p className="text-xs text-surface-500 dark:text-dark-400">{mission.description}</p>
                                {mission.maxProgress > 1 && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex-1 h-1.5 bg-surface-100 dark:bg-dark-700 rounded-full overflow-hidden">
                                      <div className={`h-full rounded-full transition-all duration-500 ${completed ? 'bg-green-500' : 'bg-primary-500'}`}
                                        style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-[10px] text-surface-400 dark:text-dark-500 shrink-0 tabular-nums">
                                      {completed ? '✓' : `${progress}/${mission.maxProgress}`}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
