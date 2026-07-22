import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '../services/api';
import { postApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PostCard } from '../components/features/PostCard';
import toast from 'react-hot-toast';
import {
  Users, Hash, Loader2, Globe, Lock, Calendar, UserPlus, UserMinus,
  ArrowLeft, Shield, Crown, Settings, LogOut, Trash2, Edit3,
  MessageSquare, BookOpen, Plus, X, Search,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function CommunityPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'about'>('feed');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editRules, setEditRules] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  const { data: communityData, isLoading, isError } = useQuery({
    queryKey: ['community', slug],
    queryFn: async () => {
      const { data } = await communityApi.getBySlug(slug!);
      return data.community;
    },
    enabled: !!slug,
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['community-posts', slug],
    queryFn: async () => {
      const { data } = await communityApi.getPosts(slug!);
      return data;
    },
    enabled: !!slug,
  });

  const community = communityData;
  const communityPosts = postsData?.data || [];
  const isMember = !!community?.userRole;
  const isOwner = community?.userRole === 'OWNER';
  const isAdmin = community?.userRole === 'ADMIN' || isOwner;
  const canManage = isOwner || isAdmin;

  useEffect(() => {
    if (community) {
      setEditName(community.name);
      setEditDesc(community.description || '');
      setEditRules(community.rules || '');
    }
  }, [community]);

  const joinMutation = useMutation({
    mutationFn: () => communityApi.join(slug!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', slug] });
      toast.success('Entrou na comunidade!');
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => communityApi.leave(slug!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', slug] });
      toast.success('Saiu da comunidade');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => communityApi.update(slug!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', slug] });
      setShowEditModal(false);
      toast.success('Comunidade atualizada!');
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => communityApi.removeMember(slug!, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', slug] });
      toast.success('Membro removido');
    },
  });

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setPosting(true);
    try {
      await postApi.create({ content: newPostContent.trim(), type: 'TEXT' });
      setNewPostContent('');
      queryClient.invalidateQueries({ queryKey: ['community-posts', slug] });
      toast.success('Post publicado!');
    } catch { toast.error('Erro ao publicar'); }
    finally { setPosting(false); }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (isError || !community) {
    return (
      <div className="text-center py-20">
        <Hash className="w-16 h-16 text-surface-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-surface-900 dark:text-white">Comunidade não encontrada</h2>
        <p className="text-sm text-surface-500 mt-2 mb-6">Esta comunidade não existe ou foi removida.</p>
        <Link to="/communities" className="btn-primary"><ArrowLeft className="w-4 h-4" /> Voltar</Link>
      </div>
    );
  }

  const tabs = [
    { key: 'feed' as const, label: 'Feed', icon: MessageSquare, count: communityPosts.length },
    { key: 'members' as const, label: 'Membros', icon: Users, count: community.membersCount || community._count?.members },
    { key: 'about' as const, label: 'Sobre', icon: BookOpen },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 max-w-3xl mx-auto">
      {/* ═══ HEADER ═══ */}
      <div className="card overflow-hidden">
        <div className="h-36 sm:h-44 bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 relative">
          {community.banner && <img src={community.banner} className="w-full h-full object-cover" alt="" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-4 left-5 sm:left-7 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <Hash className="w-7 h-7 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-xl sm:text-2xl font-bold">{community.name}</h1>
              <p className="text-sm text-white/80">/{community.slug}</p>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-5">
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4 text-sm text-surface-500 dark:text-dark-400 flex-wrap">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {community.membersCount || community._count?.members} membros</span>
              {community.category && <span className="flex items-center gap-1.5"><Hash className="w-4 h-4" /> {community.category}</span>}
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {format(new Date(community.createdAt), "MMM yyyy", { locale: ptBR })}</span>
              {community.isPrivate ? <span className="text-yellow-500 flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Privada</span>
                : <span className="text-green-500 flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Pública</span>}
            </div>
            <div className="flex items-center gap-2">
              {canManage && (
                <button onClick={() => setShowEditModal(true)} className="btn-icon" title="Configurar">
                  <Settings className="w-4 h-4" />
                </button>
              )}
              {user && (
                isMember ? (
                  <div className="flex items-center gap-2">
                    {(isOwner || isAdmin) && (
                      <span className="badge flex items-center gap-1">
                        {isOwner ? <Crown className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {isOwner ? 'Dono' : 'Admin'}
                      </span>
                    )}
                    <Button variant="secondary" size="sm" onClick={() => leaveMutation.mutate()}>
                      <UserMinus className="w-4 h-4" /> Sair
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => joinMutation.mutate()}>
                    <UserPlus className="w-4 h-4" /> Entrar
                  </Button>
                )
              )}
            </div>
          </div>

          {community.description && (
            <p className="mt-3 text-sm text-surface-600 dark:text-dark-300 leading-relaxed">{community.description}</p>
          )}

          <Link to={`/${community.owner?.username}`} className="inline-flex items-center gap-1.5 mt-3 text-xs text-surface-400 dark:text-dark-500 hover:text-primary-500 transition-colors">
            Criada por <span className="font-medium">{community.owner?.name}</span>
          </Link>
        </div>
      </div>

      {/* ═══ TABS ═══ */}
      <div className="flex items-center gap-1 bg-surface-100 dark:bg-dark-800 rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === t.key
                ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-surface-500 dark:text-dark-400 hover:text-surface-700'
            }`}>
            <t.icon className="w-4 h-4" />
            {t.label}
            {(t.count ?? 0) > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === t.key
                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600'
                  : 'bg-surface-200 dark:bg-dark-600 text-surface-500 dark:text-dark-400'
              }`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ═══ FEED TAB ═══ */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {/* Create post (if member) */}
          {isMember && (
            <div className="card p-4">
              <div className="flex items-start gap-3">
                <Avatar src={user?.avatar} name={user?.name} size="sm" />
                <div className="flex-1">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder={`Compartilhe algo com a comunidade ${community.name}...`}
                    className="w-full bg-transparent text-sm text-surface-900 dark:text-dark-100 placeholder:text-surface-400 resize-none outline-none min-h-[60px]"
                    maxLength={2000}
                  />
                  <div className="flex justify-end pt-2 border-t border-surface-100 dark:border-dark-700">
                    <Button size="sm" onClick={handleCreatePost} disabled={!newPostContent.trim() || posting}>
                      {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publicar'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Posts */}
          {postsLoading ? (
            <div className="space-y-3">{[1, 2].map((i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-dark-700 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-surface-200 dark:bg-dark-700 rounded" />
                    <div className="h-3 w-full bg-surface-200 dark:bg-dark-700 rounded" />
                  </div>
                </div>
              </div>
            ))}</div>
          ) : communityPosts.length === 0 ? (
            <div className="card py-14 text-center">
              <MessageSquare className="w-12 h-12 text-surface-300 dark:text-dark-600 mx-auto mb-3" />
              <h3 className="font-semibold text-surface-700 dark:text-dark-200">Nenhuma publicação</h3>
              <p className="text-sm text-surface-400 dark:text-dark-500 mt-1">
                {isMember ? 'Seja o primeiro a publicar!' : 'Entre na comunidade para ver as publicações.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {communityPosts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ MEMBERS TAB ═══ */}
      {activeTab === 'members' && (
        <div className="card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-500" />
            Membros ({community.membersCount || community._count?.members || community.members?.length || 0})
          </h3>

          {community.members?.length > 0 ? (
            <div className="divide-y divide-surface-100 dark:divide-dark-700">
              {community.members.map((member: any) => {
                const memberRole = member.role;
                return (
                  <div key={member.id} className="flex items-center justify-between py-2.5">
                    <Link to={`/${member.user.username}`} className="flex items-center gap-3 min-w-0">
                      <Avatar src={member.user.avatar} name={member.user.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-surface-900 dark:text-white truncate flex items-center gap-1.5">
                          {member.user.name}
                          {memberRole === 'OWNER' && <Crown className="w-3.5 h-3.5 text-yellow-500" />}
                          {memberRole === 'ADMIN' && <Shield className="w-3.5 h-3.5 text-primary-500" />}
                        </p>
                        <p className="text-xs text-surface-400 dark:text-dark-500">@{member.user.username}</p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-surface-400 dark:text-dark-500">Nv. {member.user.level}</span>
                      {canManage && member.user.id !== user?.id && memberRole !== 'OWNER' && (
                        <button
                          onClick={() => {
                            if (confirm(`Remover ${member.user.name} da comunidade?`))
                              removeMemberMutation.mutate(member.user.id);
                          }}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-surface-400 text-center py-4">Nenhum membro ainda</p>
          )}
        </div>
      )}

      {/* ═══ ABOUT TAB ═══ */}
      {activeTab === 'about' && (
        <div className="space-y-4">
          {community.description && (
            <div className="card p-5">
              <h3 className="font-semibold text-surface-900 dark:text-white mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary-500" /> Descrição
              </h3>
              <p className="text-sm text-surface-600 dark:text-dark-300 leading-relaxed">{community.description}</p>
            </div>
          )}

          {community.rules && (
            <div className="card p-5">
              <h3 className="font-semibold text-surface-900 dark:text-white mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-500" /> Regras
              </h3>
              <div className="text-sm text-surface-600 dark:text-dark-300 whitespace-pre-wrap leading-relaxed">{community.rules}</div>
            </div>
          )}

          <div className="card p-5">
            <h3 className="font-semibold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-500" /> Informações
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <InfoBox label="Criada em" value={format(new Date(community.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} />
              <InfoBox label="Membros" value={String(community.membersCount || community._count?.members || 0)} />
              <InfoBox label="Categoria" value={community.category || '—'} />
              <InfoBox label="Visibilidade" value={community.isPrivate ? 'Privada' : 'Pública'} />
            </div>
          </div>
        </div>
      )}

      {/* ═══ EDIT MODAL ═══ */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Configurar comunidade" description="Edite as informações da sua comunidade">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Nome</label>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} className="input" maxLength={50} />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Descrição</label>
            <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="input min-h-[80px]" maxLength={500} />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Regras</label>
            <textarea value={editRules} onChange={(e) => setEditRules(e.target.value)} className="input min-h-[120px] font-mono text-xs"
              placeholder="1. Seja respeitoso&#10;2. Sem spam&#10;3. ..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>Cancelar</Button>
            <Button onClick={() => updateMutation.mutate({ name: editName, description: editDesc, rules: editRules })} disabled={!editName.trim()}>
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-surface-50 dark:bg-dark-800/50 border border-surface-100 dark:border-dark-700/50">
      <p className="text-[10px] font-medium text-surface-400 dark:text-dark-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-medium text-surface-700 dark:text-dark-200">{value}</p>
    </div>
  );
}
