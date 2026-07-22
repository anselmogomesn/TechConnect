import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Share2, MoreHorizontal, Edit3, Trash2,
  Bookmark, Image, Code, BarChart3, Check,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { postApi } from '../../services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  post: any;
  onDelete?: (id: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [pollVotes, setPollVotes] = useState<Record<string, Record<number, number>>>({});

  const isOwner = user?.id === post.userId;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const likeMutation = useMutation({
    mutationFn: () => postApi.like(post.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      queryClient.setQueryData(['feed'], (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((p: any) =>
              p.id === post.id
                ? { ...p, hasLiked: !p.hasLiked, likesCount: p.likesCount + (p.hasLiked ? -1 : 1) }
                : p
            ),
          })),
        };
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => postApi.delete(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast.success('Post excluído');
      onDelete?.(post.id);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (content: string) => postApi.update(post.id, { content }),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast.success('Post atualizado');
    },
  });

  const hasVoted = pollVotes[post.id] !== undefined;

  // Extract code content from markdown
  const getCodeContent = () => {
    const match = post.content.match(/```(\w+)?\n?([\s\S]*?)```/);
    if (match) return { language: match[1] || 'text', code: match[2].trim() };
    return null;
  };

  // Extract poll options from content
  const getPollContent = () => {
    const lines = post.content.split('\n');
    const options: string[] = [];
    lines.forEach((line: string) => {
      const match = line.match(/^\d+\.\s(.+)/);
      if (match) options.push(match[1]);
    });
    return options.length >= 2 ? options : null;
  };

  const codeBlock = post.type === 'CODE' ? getCodeContent() : null;
  const pollData = post.type === 'POLL' ? getPollContent() : null;

  const displayContent = post.type === 'CODE'
    ? post.content.replace(/```[\s\S]*?```/g, '').trim()
    : post.type === 'POLL'
      ? post.content.split('\n\n📊')[0].trim()
      : post.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden group"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Link to={`/${post.user?.username}`} className="shrink-0">
            <Avatar src={post.user?.avatar} name={post.user?.name} size="md" />
          </Link>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <Link to={`/${post.user?.username}`}
                  className="font-semibold text-sm text-surface-900 dark:text-white hover:text-primary-500 truncate">
                  {post.user?.name} {post.user?.surname}
                </Link>
                <span className="text-xs text-surface-400 dark:text-dark-500">@{post.user?.username}</span>
                <span className="text-xs text-surface-300 dark:text-dark-600">·</span>
                <span className="text-xs text-surface-400 dark:text-dark-500 whitespace-nowrap">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                </span>
                {post.isEdited && <span className="text-xs text-surface-400 italic">· editado</span>}
              </div>
              {(isOwner || isAdmin) && (
                <div className="relative">
                  <button onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-surface-400
                               hover:bg-surface-100 dark:hover:bg-dark-700 transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {showMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                      <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-white dark:bg-dark-800
                                      rounded-xl shadow-xl border border-surface-200 dark:border-dark-700 py-1">
                        <button onClick={() => { setIsEditing(true); setShowMenu(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-surface-600 dark:text-dark-300 hover:bg-surface-100 dark:hover:bg-dark-700">
                          <Edit3 className="w-3.5 h-3.5" /> Editar
                        </button>
                        <button onClick={() => { if (confirm('Excluir?')) deleteMutation.mutate(); setShowMenu(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="w-3.5 h-3.5" /> Excluir
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Level + Type badge */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium
                             bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                Nv. {post.user?.level}
              </span>
              {post.type !== 'TEXT' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium
                               bg-surface-100 dark:bg-dark-700 text-surface-500 dark:text-dark-400">
                  {post.type === 'IMAGE' && <><Image className="w-3 h-3" /> Foto</>}
                  {post.type === 'CODE' && <><Code className="w-3 h-3" /> Código</>}
                  {post.type === 'POLL' && <><BarChart3 className="w-3 h-3" /> Enquete</>}
                  {post.type === 'VIDEO' && 'Vídeo'}
                  {post.type === 'LINK' && 'Link'}
                </span>
              )}
            </div>

            {/* Content / Editing */}
            {isEditing ? (
              <div className="space-y-2">
                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)}
                  className="input min-h-[80px] text-sm" autoFocus />
                <div className="flex items-center gap-2">
                  <button onClick={() => updateMutation.mutate(editContent)}
                    className="btn-primary text-xs px-3 py-1">
                    Salvar
                  </button>
                  <button onClick={() => setIsEditing(false)} className="btn-ghost text-xs px-3 py-1">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Text content */}
                {displayContent && (
                  <p className="text-sm text-surface-800 dark:text-dark-200 leading-relaxed whitespace-pre-wrap break-words">
                    {displayContent}
                  </p>
                )}

                {/* Image */}
                {post.type === 'IMAGE' && post.media && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-surface-200 dark:border-dark-700 bg-surface-50 dark:bg-dark-800">
                    <img
                      src={post.media}
                      alt="Post media"
                      className="w-full max-h-96 object-contain"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Code block */}
                {codeBlock && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-surface-200 dark:border-dark-700 bg-dark-900">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-dark-800 border-b border-dark-700">
                      <span className="text-[11px] font-mono text-dark-300">{codeBlock.language}</span>
                      <button
                        onClick={() => { navigator.clipboard.writeText(codeBlock.code); toast.success('Código copiado!'); }}
                        className="text-[11px] text-dark-400 hover:text-dark-200 transition-colors"
                      >
                        Copiar
                      </button>
                    </div>
                    <pre className="p-3 overflow-x-auto text-sm leading-relaxed">
                      <code className="font-mono text-green-400">{codeBlock.code}</code>
                    </pre>
                  </div>
                )}

                {/* Poll */}
                {pollData && (
                  <div className="mt-3 space-y-2">
                    {pollData.map((option, i) => {
                      const pv = pollVotes[post.id];
                      const votes = (pv?.[i]) || 0;
                      const total = Object.values(pv || {}).reduce((a: number, b: number) => a + b, 0);
                      const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
                      const isSelected = selectedPollOption === i;

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (!hasVoted) {
                              setSelectedPollOption(i);
                              setPollVotes((prev) => ({
                                ...prev,
                                [post.id]: { ...prev[post.id], [i]: (prev[post.id]?.[i] || 0) + 1 },
                              }));
                              toast.success('Voto registrado!');
                            }
                          }}
                          disabled={hasVoted}
                          className={`relative w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-surface-200 dark:border-dark-700 hover:border-surface-300 dark:hover:border-dark-600'
                          } disabled:opacity-80`}
                        >
                          <div className="flex items-center justify-between relative z-10">
                            <span className="text-sm text-surface-800 dark:text-dark-200">{option}</span>
                            {isSelected && <Check className="w-4 h-4 text-primary-500" />}
                            {hasVoted && (
                              <span className="text-xs text-surface-400">{pct}%</span>
                            )}
                          </div>
                          {hasVoted && (
                            <div className="absolute inset-0 rounded-lg bg-primary-500/10 overflow-hidden">
                              <div className="h-full bg-primary-500/20 rounded-lg transition-all duration-500"
                                style={{ width: `${pct}%` }} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 mt-3 pt-2 border-t border-surface-100 dark:border-dark-800">
              <button onClick={() => likeMutation.mutate()}
                className={`flex items-center gap-1.5 text-xs transition-all duration-200 group/btn
                  ${post.hasLiked ? 'text-red-500' : 'text-surface-400 dark:text-dark-500 hover:text-red-500'}`}>
                <Heart className={`w-4 h-4 transition-all ${post.hasLiked ? 'fill-red-500 scale-110' : 'group-hover/btn:scale-110'}`} />
                <span>{post.likesCount || post._count?.reactions || 0}</span>
              </button>

              <CommentSection
                postId={post.id}
                isOpen={showComments}
                onToggle={() => setShowComments(!showComments)}
              />

              <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`); toast.success('Link copiado!'); }}
                className="flex items-center gap-1.5 text-xs text-surface-400 dark:text-dark-500 hover:text-primary-500 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>

              <button className="flex items-center gap-1.5 text-xs text-surface-400 dark:text-dark-500 hover:text-primary-500 transition-colors ml-auto">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
