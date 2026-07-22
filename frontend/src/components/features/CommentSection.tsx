import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Loader2, Send, Heart, Trash2, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface CommentSectionProps {
  postId: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function CommentSection({ postId, isOpen, onToggle }: CommentSectionProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data } = await postApi.getComments(postId);
      return data.data || [];
    },
    enabled: isOpen,
  });

  const comments = data || [];

  const commentMutation = useMutation({
    mutationFn: ({ content, parentId }: { content: string; parentId?: string }) =>
      postApi.comment(postId, { content, parentId }),
    onSuccess: () => {
      setNewComment('');
      setReplyTo(null);
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    commentMutation.mutate({
      content: newComment.trim(),
      parentId: replyTo?.id,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 text-xs text-surface-400 dark:text-dark-500
                   hover:text-primary-500 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{comments.length || 0}</span>
        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-surface-100 dark:border-dark-800 space-y-3">
              {/* Comment input */}
              <div className="flex items-start gap-2">
                <Avatar src={user?.avatar} name={user?.name} size="xs" />
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 relative">
                    {replyTo && (
                      <div className="text-[10px] text-primary-500 mb-1 flex items-center gap-1">
                        Respondendo a <span className="font-medium">{replyTo.name}</span>
                        <button onClick={() => setReplyTo(null)} className="text-red-400 hover:text-red-500">✕</button>
                      </div>
                    )}
                    <input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={replyTo ? `Responder a ${replyTo.name}...` : 'Escreva um comentário...'}
                      className="input text-sm py-1.5 h-8 pr-8"
                      maxLength={2000}
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!newComment.trim() || commentMutation.isPending}
                    className="p-1.5 rounded-lg text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20
                               disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    {commentMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Comments list */}
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-xs text-surface-400 dark:text-dark-500 text-center py-3">
                  Nenhum comentário ainda. Seja o primeiro!
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {comments.map((comment: any) => (
                    <div key={comment.id}>
                      <div className="flex items-start gap-2">
                        <Avatar src={comment.user?.avatar} name={comment.user?.name} size="xs" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-surface-700 dark:text-dark-200">
                              {comment.user?.name}
                            </span>
                            <span className="text-[10px] text-surface-400 dark:text-dark-500">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ptBR })}
                            </span>
                          </div>
                          <p className="text-sm text-surface-800 dark:text-dark-200 mt-0.5">{comment.content}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <button
                              onClick={() => setReplyTo({ id: comment.id, name: comment.user?.name })}
                              className="text-[10px] text-surface-400 dark:text-dark-500 hover:text-primary-500 transition-colors"
                            >
                              Responder
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Replies */}
                      {comment.replies?.length > 0 && (
                        <div className="ml-8 mt-2 space-y-2 border-l-2 border-surface-100 dark:border-dark-700 pl-3">
                          {comment.replies.map((reply: any) => (
                            <div key={reply.id} className="flex items-start gap-2">
                              <Avatar src={reply.user?.avatar} name={reply.user?.name} size="xs" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-medium text-surface-700 dark:text-dark-200">
                                    {reply.user?.name}
                                  </span>
                                  <span className="text-[10px] text-surface-400">
                                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: ptBR })}
                                  </span>
                                </div>
                                <p className="text-sm text-surface-800 dark:text-dark-200">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
