import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, postApi, messageApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/ui/Avatar';
import { PostCard } from '../components/features/PostCard';
import {
  MapPin, Link as LinkIcon, Calendar, Settings,
  BadgeCheck, Shield, Loader2, MessageCircle, UserPlus, UserMinus,
  GalleryVerticalEnd, Medal, Info, Sparkles, Zap,
  Flame, CheckCircle, TrendingUp, Award, Crown,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

const rarityConfig: Record<string, { gradient: string; color: string; label: string }> = {
  MYTHIC:    { gradient: 'from-red-500 via-purple-500 to-pink-500', color: 'text-red-400', label: 'Mítico' },
  LEGENDARY: { gradient: 'from-yellow-400 to-amber-500',           color: 'text-yellow-400', label: 'Lendário' },
  EPIC:      { gradient: 'from-purple-400 to-violet-500',          color: 'text-purple-400', label: 'Épico' },
  RARE:      { gradient: 'from-blue-400 to-indigo-500',            color: 'text-blue-400', label: 'Raro' },
  UNCOMMON:  { gradient: 'from-green-400 to-emerald-500',          color: 'text-green-400', label: 'Incomum' },
  COMMON:    { gradient: 'from-surface-400 to-surface-500',        color: 'text-surface-400', label: 'Comum' },
};

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'posts' | 'badges' | 'about'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const { data } = await userApi.getProfile(username!);
      return data.user;
    },
    enabled: !!username,
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['profile-posts', username],
    queryFn: async () => {
      const { data } = await postApi.getByUser(username!);
      return data;
    },
    enabled: !!username,
  });

  const posts = postsData?.data || [];

  useEffect(() => { if (user) setIsFollowing(user.isFollowing); }, [user]);

  const followMutation = useMutation({
    mutationFn: () => userApi.toggleFollow(username!),
    onSuccess: (d: any) => { setIsFollowing(d.data?.following ?? d.following); queryClient.invalidateQueries({ queryKey: ['profile', username] }); },
  });

  const startConversation = async () => {
    if (!user?.id) return;
    try {
      const { data } = await messageApi.getOrCreateConversation(user.id);
      navigate('/messages');
      sessionStorage.setItem('activeConversation', data.conversation.id);
      toast.success('Conversa iniciada!');
    } catch { toast.error('Erro ao iniciar conversa'); }
  };

  const isOwn = currentUser?.username === username;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <Shield className="w-16 h-16 text-surface-300 dark:text-dark-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-surface-900 dark:text-white">Perfil não encontrado</h2>
        <p className="text-surface-500 dark:text-dark-400 mt-1 text-sm">Este usuário não existe ou foi removido.</p>
        <Link to="/feed" className="btn-primary mt-6">Voltar ao feed</Link>
      </div>
    );
  }

  const tabs = [
    { key: 'posts' as const, icon: GalleryVerticalEnd, label: 'Publicações', count: user.postsCount },
    { key: 'badges' as const, icon: Medal, label: 'Badges', count: user.badgesCount || user.badges?.length || 0 },
    { key: 'about' as const, icon: Info, label: 'Sobre' },
  ];

  const roleBadge = user.role === 'SUPER_ADMIN'
    ? { bg: 'bg-gradient-to-r from-primary-500 to-purple-600', text: 'Super Admin', icon: Crown }
    : user.role === 'ADMIN'
      ? { bg: 'bg-primary-500', text: 'Admin', icon: Shield }
      : user.role === 'MODERATOR'
        ? { bg: 'bg-emerald-500', text: 'Mod', icon: Shield }
        : null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-5">
      {/* ═══════ PROFILE HEADER ═══════ */}
      <div className="card overflow-hidden">
        {/* Banner — altura exata para o avatar encaixar */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600">
          {user.banner && (
            <img src={user.banner} className="w-full h-full object-cover object-center" alt="" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

          {/* Botão editar capa (próprio perfil) */}
          {isOwn && (
            <Link to="/settings/profile"
              className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/50
                         text-white text-xs backdrop-blur-sm transition-all z-20">
              Editar capa
            </Link>
          )}
        </div>

        {/* Avatar — montado na divisa entre banner e conteúdo */}
        <div className="relative px-5 sm:px-7 pb-5 sm:pb-7">
          <div className="absolute left-5 sm:left-7 top-0 z-10 -translate-y-1/2">
            <div className="relative">
              <Avatar
                src={user.avatar}
                name={user.name}
                size="3xl"
                className="shadow-xl"
              />
              {user.emailVerified && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary-500
                                flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo — padding-top para não ficar atrás do avatar */}
          <div className="pt-14 sm:pt-16">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white truncate">
                    {user.name} {user.surname}
                  </h1>
                  {roleBadge && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white ${roleBadge.bg}`}>
                      <roleBadge.icon className="w-3 h-3" />
                      {roleBadge.text}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-dark-400 mt-0.5">
                  <span>@{user.username}</span>
                  <span className="text-surface-300">·</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold
                                 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                    <Zap className="w-3 h-3" />
                    Nível {user.level}
                  </span>
                  {user.title && (
                    <>
                      <span className="text-surface-300 hidden sm:inline">·</span>
                      <span className="text-surface-600 dark:text-dark-300 text-xs hidden sm:inline">{user.title}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2 shrink-0">
                {isOwn ? (
                  <Link to="/settings/profile" className="btn-secondary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
                    <Settings className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Editar perfil</span>
                  </Link>
                ) : (
                  <>
                    <button onClick={() => followMutation.mutate()}
                      className={`btn text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}>
                      {isFollowing ? <UserMinus className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                      {isFollowing ? 'Seguindo' : 'Seguir'}
                    </button>
                    <button onClick={startConversation} className="btn-icon p-1.5 sm:p-2" title="Enviar mensagem">
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            {user.bio ? (
              <p className="mt-2.5 text-sm text-surface-600 dark:text-dark-300 leading-relaxed">{user.bio}</p>
            ) : isOwn ? (
              <Link to="/settings/profile" className="mt-2.5 text-sm text-surface-400 hover:text-primary-500 italic inline-block transition-colors">
                + Adicionar biografia
              </Link>
            ) : null}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-surface-500 dark:text-dark-400">
              {user.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {user.location}
                </span>
              )}
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-400 transition-colors">
                  <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                  {user.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                {format(new Date(user.createdAt), "MMM yyyy", { locale: ptBR })}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 mt-4 pt-4 border-t border-surface-100 dark:border-dark-800">
              {[
                { label: 'Seguidores', value: user.followersCount },
                { label: 'Seguindo', value: user.followingCount },
                { label: 'Posts', value: user.postsCount },
                { label: 'Curtidas', value: user.likesReceived },
                { label: 'Badges', value: user.badgesCount || user.badges?.length || 0 },
                { label: 'Streak', value: `${user.streakCount || 0}d` },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-bold text-base sm:text-lg text-surface-900 dark:text-white">{s.value}</p>
                  <p className="text-[10px] text-surface-400 dark:text-dark-500 truncate">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ XP PROGRESS ═══════ */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm shrink-0">
              <Medal className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-surface-900 dark:text-white">Nível {user.level}</span>
              <span className="text-xs text-surface-400 dark:text-dark-500 ml-1.5">{user.title || 'Recruta'}</span>
            </div>
          </div>
          <span className="text-xs tabular-nums text-surface-500 dark:text-dark-400">
            {user.xp?.toLocaleString()} / {((user.xpNeeded || 1000) + (user.xpProgress || 0)).toLocaleString()}
          </span>
        </div>
        <div className="h-2.5 bg-surface-100 dark:bg-dark-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(user.xpProgressPercent || 0, 100)}%` }}
            className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-500 to-purple-500"
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-[11px] text-surface-400 dark:text-dark-500">
            <span className="text-primary-500 font-medium">{user.xpProgress || 0}</span> XP para Nv. {user.nextLevel || user.level + 1}
          </p>
          <p className="text-[11px] text-surface-400 dark:text-dark-500">
            Total: <span className="text-surface-600 dark:text-dark-300 font-medium">{user.totalXpEarned?.toLocaleString()}</span> XP
          </p>
        </div>
      </div>

      {/* ═══════ TABS ═══════ */}
      <div className="flex items-center gap-0.5 bg-surface-100 dark:bg-dark-800 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-surface-500 dark:text-dark-400 hover:text-surface-700 dark:hover:text-dark-200'
            }`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'bg-surface-200 dark:bg-dark-600 text-surface-500 dark:text-dark-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════ POSTS TAB ═══════ */}
      {activeTab === 'posts' && (
        <>
          {postsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-dark-700 shrink-0" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-3 w-32 bg-surface-200 dark:bg-dark-700 rounded" />
                      <div className="h-3 w-full bg-surface-200 dark:bg-dark-700 rounded" />
                      <div className="h-3 w-3/4 bg-surface-200 dark:bg-dark-700 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="card py-14 text-center">
              <GalleryVerticalEnd className="w-12 h-12 text-surface-300 dark:text-dark-600 mx-auto mb-3" />
              <h3 className="font-semibold text-surface-700 dark:text-dark-200">Nenhuma publicação</h3>
              <p className="text-sm text-surface-400 dark:text-dark-500 mt-1">
                {isOwn ? 'Suas publicações aparecerão aqui.' : `${user.name} ainda não publicou nada.`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post: any) => (
                <PostCard key={post.id} post={{
                  ...post,
                  user: { name: user.name, surname: user.surname, username: user.username, avatar: user.avatar, level: user.level }
                }} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ═══════ BADGES TAB ═══════ */}
      {activeTab === 'badges' && (
        <div>
          {user.badges?.length > 0 ? (
            <div className="space-y-5">
              {(['MYTHIC', 'LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'] as const).map((rarity) => {
                const items = user.badges.filter((b: any) => b.rarity === rarity);
                if (!items.length) return null;
                const cfg = rarityConfig[rarity];
                return (
                  <div key={rarity}>
                    <h4 className="text-[11px] font-semibold uppercase tracking-widest text-surface-400 dark:text-dark-500 mb-2.5">
                      {cfg.label}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {items.map((badge: any) => (
                        <div key={badge.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-dark-800
                                     border border-surface-200 dark:border-dark-700
                                     hover:border-surface-300 dark:hover:border-dark-600 transition-all">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{badge.name}</p>
                            <p className={`text-[11px] ${cfg.color}`}>+{badge.xpReward} XP</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card py-14 text-center">
              <Award className="w-12 h-12 text-surface-300 dark:text-dark-600 mx-auto mb-3" />
              <h3 className="font-semibold text-surface-700 dark:text-dark-200">Nenhum badge</h3>
              <p className="text-sm text-surface-400 dark:text-dark-500 mt-1">Complete ações na plataforma para ganhar badges!</p>
              <Link to="/badges" className="btn-primary text-sm mt-5 inline-flex">
                <Sparkles className="w-4 h-4" /> Ver badges disponíveis
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ═══════ ABOUT TAB ═══════ */}
      {activeTab === 'about' && (
        <div className="card p-5 sm:p-6 space-y-6">
          <h3 className="font-semibold text-surface-900 dark:text-white flex items-center gap-2 text-base">
            <Info className="w-4 h-4 text-primary-500" />
            Informações do perfil
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Coluna 1 */}
            <div className="space-y-3">
              <InfoRow label="Membro desde"
                value={format(new Date(user.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} />
              <InfoRow label="Última atividade"
                value={format(new Date(user.lastActivity), "dd/MM/yyyy 'às' HH:mm")} />
              {user.birthDate && (
                <InfoRow label="Data de nascimento"
                  value={format(new Date(user.birthDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} />
              )}
              <InfoRow label="Status" value={
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  {user.status === 'ACTIVE' ? 'Ativo' : user.status}
                </span>
              } />
              <InfoRow label="Função" value={roleBadge?.text || 'Usuário'} />
            </div>

            {/* Coluna 2 */}
            <div className="space-y-3">
              <InfoRow label="XP Total" value={user.totalXpEarned?.toLocaleString()} highlight />
              <InfoRow label="Reputação" value={user.reputation?.toLocaleString() || '0'} />
              <InfoRow label="Conquistas" value={String(user.achievementsCount || 0)} />
              <InfoRow label="Streak" value={`${user.streakCount || 0} dias`} />
              <InfoRow label="Email" value={
                <span className={`flex items-center gap-1.5 ${user.emailVerified ? 'text-green-500' : 'text-yellow-500'}`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  {user.emailVerified ? 'Verificado' : 'Não verificado'}
                </span>
              } />
            </div>
          </div>

          {user.bio && (
            <div className="pt-4 border-t border-surface-100 dark:border-dark-800">
              <p className="text-[11px] font-medium text-surface-400 dark:text-dark-500 uppercase tracking-wider mb-2">Biografia</p>
              <p className="text-sm text-surface-600 dark:text-dark-300 leading-relaxed">{user.bio}</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="p-3 rounded-xl bg-surface-50 dark:bg-dark-800/50 border border-surface-100 dark:border-dark-700/50">
      <p className="text-[10px] font-medium text-surface-400 dark:text-dark-500 uppercase tracking-wider mb-1">{label}</p>
      <div className={`text-sm font-medium ${highlight ? 'text-primary-500' : 'text-surface-700 dark:text-dark-200'}`}>
        {value}
      </div>
    </div>
  );
}
