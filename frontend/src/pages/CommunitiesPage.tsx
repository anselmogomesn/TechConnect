import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '../services/api';
import { Modal } from '../components/ui/Modal';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import {
  Users, Plus, Search, Loader2, Hash, Lock, Globe, UserCheck,
} from 'lucide-react';

export function CommunitiesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const { data } = await communityApi.getAll();
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: () => communityApi.create({ name: newName, description: newDesc, category: newCategory || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      setShowCreate(false);
      setNewName('');
      setNewDesc('');
      setNewCategory('');
      toast.success('Comunidade criada!');
    },
  });

  const communities = data?.data || [];
  const filtered = search
    ? communities.filter((c: any) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase()))
    : communities;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Comunidades</h1>
          <p className="text-sm text-surface-500 dark:text-dark-400">Conecte-se com pessoas da sua área</p>
        </div>
        <Button onClick={() => setShowCreate(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Criar
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar comunidades..."
          className="input pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-5"><div className="skeleton h-20" /></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-surface-300 dark:text-dark-600 mx-auto mb-3" />
          <h3 className="font-medium text-surface-900 dark:text-white mb-1">
            {search ? 'Nenhuma comunidade encontrada' : 'Nenhuma comunidade'}
          </h3>
          <p className="text-sm text-surface-400 dark:text-dark-500">
            {search ? 'Tente buscar por outro termo' : 'Crie a primeira comunidade!'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((community: any) => (
            <Link key={community.id} to={`/communities/${community.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-hover p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
                    <Hash className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-surface-900 dark:text-white truncate">
                      {community.name}
                    </h3>
                    {community.description && (
                      <p className="text-sm text-surface-500 dark:text-dark-400 mt-1 line-clamp-2">
                        {community.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-xs text-surface-400 dark:text-dark-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {community.membersCount || community._count?.members} membros
                      </span>
                      {community.category && (
                        <span className="flex items-center gap-1">
                          <Hash className="w-3.5 h-3.5" />
                          {community.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Criar comunidade" description="Dê um nome e descrição para sua comunidade">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Nome</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} className="input" placeholder="Ex: Desenvolvedores React" maxLength={50} />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Descrição (opcional)</label>
            <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="input min-h-[80px]" placeholder="O que as pessoas vão encontrar aqui?" maxLength={500} />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Categoria (opcional)</label>
            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="input" placeholder="Ex: Tecnologia, Design, Marketing" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!newName.trim() || createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar comunidade'}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
