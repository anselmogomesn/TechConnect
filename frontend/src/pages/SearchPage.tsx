import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../services/api';
import { Avatar } from '../components/ui/Avatar';
import { Search, Users, Hash, FileText, Loader2, User as UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const activeFilter = searchParams.get('type') || 'all';
  const [searchInput, setSearchInput] = useState(query);

  const { data, isLoading } = useQuery({
    queryKey: ['search', query, activeFilter],
    queryFn: async () => {
      const { data } = await searchApi.search(query, activeFilter);
      return data;
    },
    enabled: query.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim(), type: activeFilter });
    }
  };

  const setFilter = (type: string) => {
    setSearchParams({ q: query, type });
  };

  const filters = [
    { key: 'all', label: 'Todos', icon: Search },
    { key: 'users', label: 'Pessoas', icon: Users },
    { key: 'posts', label: 'Posts', icon: FileText },
    { key: 'communities', label: 'Comunidades', icon: Hash },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Buscar</h1>

      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 dark:text-dark-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar pessoas, posts, comunidades..."
            className="input pl-12 h-12 text-base"
            autoFocus
          />
        </div>
      </form>

      {query && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`btn text-sm ${activeFilter === f.key ? 'btn-primary' : 'btn-secondary'}`}
            >
              <f.icon className="w-4 h-4" />
              {f.label}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="card p-4"><div className="skeleton h-12" /></div>)}
        </div>
      )}

      {data && !isLoading && (
        <div className="space-y-6">
          {/* Users */}
          {data.users?.length > 0 && (activeFilter === 'all' || activeFilter === 'users') && (
            <div>
              <h2 className="text-sm font-semibold text-surface-500 dark:text-dark-400 uppercase tracking-wider mb-3">
                Pessoas ({data.userTotal})
              </h2>
              <div className="space-y-2">
                {data.users.map((user: any) => (
                  <Link key={user.id} to={`/${user.username}`}>
                    <div className="card-hover p-3 flex items-center gap-3">
                      <Avatar src={user.avatar} name={user.name} size="md" />
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-white">
                          {user.name} {user.surname}
                        </p>
                        <p className="text-xs text-surface-400 dark:text-dark-500">@{user.username}</p>
                      </div>
                      <span className="ml-auto text-xs text-surface-400 dark:text-dark-500">Nv. {user.level}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts */}
          {data.posts?.length > 0 && (activeFilter === 'all' || activeFilter === 'posts') && (
            <div>
              <h2 className="text-sm font-semibold text-surface-500 dark:text-dark-400 uppercase tracking-wider mb-3">
                Posts ({data.postTotal})
              </h2>
              <div className="space-y-2">
                {data.posts.map((post: any) => (
                  <div key={post.id} className="card p-4">
                    <p className="text-sm text-surface-800 dark:text-dark-200 line-clamp-3">{post.content}</p>
                    <p className="text-xs text-surface-400 dark:text-dark-500 mt-2">
                      {post.likesCount} curtidas · {post.commentsCount} comentários
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communities */}
          {data.communities?.length > 0 && (activeFilter === 'all' || activeFilter === 'communities') && (
            <div>
              <h2 className="text-sm font-semibold text-surface-500 dark:text-dark-400 uppercase tracking-wider mb-3">
                Comunidades ({data.commTotal})
              </h2>
              <div className="space-y-2">
                {data.communities.map((comm: any) => (
                  <Link key={comm.id} to={`/communities/${comm.slug}`}>
                    <div className="card-hover p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <Hash className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-white">{comm.name}</p>
                        <p className="text-xs text-surface-400 dark:text-dark-500">{comm.membersCount} membros</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(!data.users?.length && !data.posts?.length && !data.communities?.length) && (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-surface-300 dark:text-dark-600 mx-auto mb-3" />
              <p className="text-sm text-surface-500 dark:text-dark-400">Nenhum resultado para "{query}"</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
