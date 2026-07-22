import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import {
  Users, Search, UserPlus, UserMinus, Loader2, UserCheck,
  Sparkles, MessageCircle, MapPin,
} from 'lucide-react';

export function FriendsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { data: suggestionsData, isLoading } = useQuery({
    queryKey: ['friend-suggestions'],
    queryFn: async () => {
      const { data } = await api.get('/friends/suggestions');
      return data.suggestions || [];
    },
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ['friend-search', search],
    queryFn: async () => {
      const { data } = await api.get(`/friends/search?q=${encodeURIComponent(search)}`);
      return data.users || [];
    },
    enabled: search.length > 0,
  });

  const followMutation = useMutation({
    mutationFn: (username: string) => api.post(`/users/${username}/follow`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['friend-search'] });
      toast.success('Agora vocês são amigos! 🎉');
    },
  });

  const suggestions = suggestionsData || [];
  const searchResults = searchData || [];
  const displayUsers = search ? searchResults : suggestions;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Amigos</h1>
          <p className="text-sm text-surface-500 dark:text-dark-400">Conecte-se com pessoas da comunidade</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar pessoas pelo nome, username..."
          className="input pl-10"
        />
      </div>

      {/* Suggestions hint */}
      {!search && suggestions.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-dark-400">
          <Sparkles className="w-4 h-4 text-primary-500" />
          Sugestões para você baseadas na comunidade
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-surface-200 dark:bg-dark-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 bg-surface-200 dark:bg-dark-700 rounded" />
                  <div className="h-3 w-20 bg-surface-200 dark:bg-dark-700 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!isLoading && displayUsers.length === 0 && !searchLoading && (
        <div className="card py-14 text-center">
          <Users className="w-12 h-12 text-surface-300 dark:text-dark-600 mx-auto mb-3" />
          <h3 className="font-semibold text-surface-700 dark:text-dark-200">
            {search ? 'Ninguém encontrado' : 'Nenhuma sugestão por enquanto'}
          </h3>
          <p className="text-sm text-surface-400 dark:text-dark-500 mt-1">
            {search ? 'Tente buscar por outro nome' : 'Explore mais a plataforma para conhecer pessoas!'}
          </p>
        </div>
      )}

      {/* People grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {displayUsers.map((person: any) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              <Link to={`/${person.username}`}>
                <Avatar src={person.avatar} name={person.name} size="lg" className="ring-2 ring-surface-100 dark:ring-dark-700" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/${person.username}`} className="hover:text-primary-500 transition-colors">
                  <p className="font-semibold text-surface-900 dark:text-white truncate">
                    {person.name} {person.surname}
                  </p>
                </Link>
                <p className="text-xs text-surface-400 dark:text-dark-500">@{person.username}</p>
                {person.title && (
                  <p className="text-xs text-surface-500 dark:text-dark-400 mt-0.5">{person.title}</p>
                )}
                {person.bio && (
                  <p className="text-xs text-surface-400 dark:text-dark-500 mt-1 line-clamp-1">{person.bio}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-[11px] text-surface-400 dark:text-dark-500">
                  <span>Nv. {person.level}</span>
                  <span>{person.followersCount} seguidores</span>
                  {person.mutualFriends > 0 && (
                    <span className="text-primary-500">{person.mutualFriends} amigos em comum</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-surface-100 dark:border-dark-800">
              <Button
                size="sm"
                variant={person.isFollowing ? 'secondary' : 'primary'}
                onClick={() => followMutation.mutate(person.username)}
                leftIcon={person.isFollowing ? <UserMinus className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
              >
                {person.isFollowing ? 'Seguindo' : 'Seguir'}
              </Button>
              <Link to={`/${person.username}`} className="btn-ghost text-xs px-3 py-1.5">
                <MessageCircle className="w-3.5 h-3.5" /> Perfil
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
