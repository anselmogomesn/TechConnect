import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { postApi } from '../services/api';
import { CreatePost } from '../components/features/CreatePost';
import { PostCard } from '../components/features/PostCard';
import { Loader2, RefreshCw, Hash, TrendingUp } from 'lucide-react';

export function FeedPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await postApi.getFeed(pageParam);
      return data;
    },
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const posts = data?.pages.flatMap((page) => page.data || []) ?? [];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Feed</h1>
        <p className="text-surface-500 dark:text-dark-400 text-sm">
          Acompanhe as últimas postagens
        </p>
      </div>

      {/* Create Post */}
      <CreatePost />

      {/* Refresh */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => refetch()}
          className="btn-ghost text-xs p-2"
          title="Atualizar"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="skeleton h-4 w-32" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-surface-500 dark:text-dark-400 text-sm mb-3">
            Erro ao carregar o feed
          </p>
          <button onClick={() => refetch()} className="btn-primary text-sm">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && posts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-surface-100 dark:bg-dark-800 flex items-center justify-center mx-auto mb-4">
            <Hash className="w-8 h-8 text-surface-400 dark:text-dark-500" />
          </div>
          <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
            Nenhuma postagem no feed
          </h3>
          <p className="text-surface-500 dark:text-dark-400 text-sm max-w-sm mx-auto">
            Siga mais pessoas para personalizar seu feed ou seja o primeiro a publicar algo!
          </p>
        </div>
      )}

      {/* Post list */}
      <div className="space-y-3">
        {posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load more */}
      {hasNextPage && (
        <div className="text-center py-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="btn-secondary text-sm"
          >
            {isFetchingNextPage ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Carregar mais'
            )}
          </button>
        </div>
      )}

      {/* Scroll to top indicator */}
      {posts.length > 10 && (
        <div className="text-center py-2">
          <p className="text-xs text-surface-400 dark:text-dark-500">
            {posts.length} postagens carregadas
          </p>
        </div>
      )}
    </div>
  );
}
