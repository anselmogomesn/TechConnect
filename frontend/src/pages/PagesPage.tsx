import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import {
  FileText, Plus, Search, Loader2, ThumbsUp, Users, ThumbsDown,
  Edit3, Calendar, Hash, Trash2,
} from 'lucide-react';

export function PagesListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data } = await api.get('/pages');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: () => api.post('/pages', { name: newName, description: newDesc, category: newCategory || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setShowCreate(false); setNewName(''); setNewDesc(''); setNewCategory('');
      toast.success('Página criada!');
    },
  });

  const pages = data?.data || [];
  const filtered = search ? pages.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())
  ) : pages;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Páginas</h1>
          <p className="text-sm text-surface-500 dark:text-dark-400">Siga páginas e receba conteúdo</p>
        </div>
        <Button onClick={() => setShowCreate(true)} leftIcon={<Plus className="w-4 h-4" />}>Criar Página</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar páginas..." className="input pl-10" />
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-200 dark:bg-dark-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 bg-surface-200 dark:bg-dark-700 rounded" />
                  <div className="h-3 w-20 bg-surface-200 dark:bg-dark-700 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card py-14 text-center">
          <FileText className="w-12 h-12 text-surface-300 dark:text-dark-600 mx-auto mb-3" />
          <h3 className="font-semibold text-surface-700 dark:text-dark-200">Nenhuma página encontrada</h3>
          <p className="text-sm text-surface-400 dark:text-dark-500 mt-1">{search ? 'Tente outro termo' : 'Crie a primeira página!'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((pg: any) => (
            <Link key={pg.id} to={`/pages/${pg.slug}`}>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="card-hover p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center shrink-0 shadow-sm">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-surface-900 dark:text-white truncate">{pg.name}</h3>
                  {pg.description && <p className="text-xs text-surface-500 dark:text-dark-400 mt-0.5 line-clamp-2">{pg.description}</p>}
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-surface-400">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{pg._count?.followers || pg.followersCount} seguidores</span>
                    {pg.category && <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{pg.category}</span>}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Criar Página" description="Crie uma página para compartilhar conteúdo">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Nome da página</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} className="input" maxLength={50} />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Descrição</label>
            <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="input min-h-[80px]" maxLength={500} />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Categoria</label>
            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="input" placeholder="Ex: Tecnologia, Educação, Entretenimento" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!newName.trim() || createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Página'}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

export function SinglePagePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState('');

  const { data: pageData, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: async () => {
      const { data } = await api.get(`/pages/${slug}`);
      return data.page;
    },
    enabled: !!slug,
  });

  const { data: postsData } = useQuery({
    queryKey: ['page-posts', slug],
    queryFn: async () => {
      const { data } = await api.get(`/pages/${slug}/posts`);
      return data.data || [];
    },
    enabled: !!slug,
  });

  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCat, setEditCat] = useState('');

  const followMutation = useMutation({
    mutationFn: () => api.post(`/pages/${slug}/follow`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page', slug] });
      toast.success(pageData?.isFollowing ? 'Deixou de seguir' : 'Seguindo página!');
    },
  });

  const postMutation = useMutation({
    mutationFn: () => api.post(`/pages/${slug}/posts`, { content: newPost }),
    onSuccess: () => {
      setNewPost('');
      queryClient.invalidateQueries({ queryKey: ['page-posts', slug] });
      toast.success('Post publicado!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (d: any) => api.put(`/pages/${slug}`, d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['page', slug] }); setShowEdit(false); toast.success('Página atualizada!'); },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/pages/${slug}`),
    onSuccess: () => { toast.success('Página removida'); navigate('/pages'); },
  });

  const page = pageData;
  const posts = postsData || [];

  useEffect(() => { if (page) { setEditName(page.name); setEditDesc(page.description || ''); setEditCat(page.category || ''); } }, [page]);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (!page) return <div className="text-center py-20"><h2 className="text-xl font-semibold">Página não encontrada</h2></div>;

  const isOwner = page.owner?.id === user?.id;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="card overflow-hidden">
        <div className="h-28 sm:h-36 bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 relative">
          {page.banner && <img src={page.banner} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <div className="px-5 pb-5">
          <div className="flex items-end -mt-8 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            {isOwner && (
              <div className="flex gap-1 ml-auto mb-2">
                <button onClick={() => setShowEdit(true)} className="btn-ghost text-xs px-2 py-1"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => { if (confirm('Excluir página?')) deleteMutation.mutate(); }} className="btn-ghost text-xs px-2 py-1 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            )}
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-surface-900 dark:text-white">{page.name}</h1>
              <div className="flex items-center gap-3 text-xs text-surface-400 dark:text-dark-500 mt-1">
                <span>{page._count?.followers || page.followersCount} seguidores</span>
                {page.category && <span>· {page.category}</span>}
                <span>· {page._count?.pagePosts || 0} posts</span>
              </div>
              {page.description && <p className="text-sm text-surface-600 dark:text-dark-300 mt-2">{page.description}</p>}
            </div>
            {user && !isOwner && (
              <Button variant={page.isFollowing ? 'secondary' : 'primary'} size="sm"
                onClick={() => followMutation.mutate()}
                leftIcon={page.isFollowing ? <ThumbsDown className="w-4 h-4" /> : <ThumbsUp className="w-4 h-4" />}>
                {page.isFollowing ? 'Seguindo' : 'Seguir'}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-100 dark:border-dark-800 text-xs text-surface-400">
            <Calendar className="w-3.5 h-3.5" /> Criada por <span className="font-medium text-surface-600 dark:text-dark-300">{page.owner?.name}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-surface-900 dark:text-white">{page._count?.followers || page.followersCount}</p>
          <p className="text-[10px] text-surface-400">Seguidores</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-surface-900 dark:text-white">{page._count?.pagePosts || 0}</p>
          <p className="text-[10px] text-surface-400">Publicações</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-surface-900 dark:text-white">{new Date(page.createdAt).toLocaleDateString('pt-BR')}</p>
          <p className="text-[10px] text-surface-400">Criada em</p>
        </div>
      </div>

      {/* Create post (owner only) */}
      {isOwner && (
        <div className="card p-4">
          <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)}
            placeholder="Escreva algo para sua página..."
            className="w-full bg-transparent text-sm text-surface-900 dark:text-dark-100 placeholder:text-surface-400 resize-none outline-none min-h-[60px]"
            maxLength={2000} />
          <div className="flex justify-end pt-2 border-t border-surface-100 dark:border-dark-700">
            <Button size="sm" onClick={() => postMutation.mutate()} disabled={!newPost.trim() || postMutation.isPending}>
              {postMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publicar'}
            </Button>
          </div>
        </div>
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="card py-10 text-center">
          <FileText className="w-10 h-10 text-surface-300 mx-auto mb-2" />
          <p className="text-sm text-surface-400">Nenhum post ainda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post: any) => (
            <div key={post.id} className="card p-4">
              <p className="text-sm text-surface-800 dark:text-dark-200 leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-surface-400 dark:text-dark-500">
                <span>❤️ {post.likesCount}</span>
                <span>💬 {post.commentsCount}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Editar Página">
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
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Categoria</label>
            <input value={editCat} onChange={(e) => setEditCat(e.target.value)} className="input" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowEdit(false)}>Cancelar</Button>
            <Button onClick={() => updateMutation.mutate({ name: editName, description: editDesc, category: editCat })} disabled={!editName.trim()}>
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
