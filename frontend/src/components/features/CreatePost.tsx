import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image, Code, BarChart3, X, Loader2, Send, Plus, Trash2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { postApi } from '../../services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

type PostMode = 'TEXT' | 'IMAGE' | 'CODE' | 'POLL';

export function CreatePost() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<PostMode>('TEXT');
  const [isExpanded, setIsExpanded] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [codeLanguage, setCodeLanguage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const mutation = useMutation({
    mutationFn: async (data: { content: string; type: string; media?: string }) => {
      const { data: res } = await postApi.create(data);
      return res;
    },
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast.success('Post publicado!');
    },
    onError: () => toast.error('Erro ao publicar'),
  });

  const resetForm = () => {
    setContent('');
    setMode('TEXT');
    setIsExpanded(false);
    setMediaPreview(null);
    setMediaFile(null);
    setPollOptions(['', '']);
    setCodeLanguage('');
  };

  const handleModeChange = (newMode: PostMode) => {
    setMode(newMode);
    setMediaPreview(null);
    setMediaFile(null);
    if (!isExpanded) setIsExpanded(true);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setMode('IMAGE');
    if (!isExpanded) setIsExpanded(true);
  };

  const uploadMedia = async (): Promise<string | null> => {
    if (!mediaFile) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('media', mediaFile);
      const { data } = await postApi.uploadMedia(formData);
      return data.media;
    } catch {
      toast.error('Erro ao enviar imagem');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (mode === 'POLL') {
      const validOptions = pollOptions.filter((o) => o.trim());
      if (validOptions.length < 2) {
        toast.error('Adicione pelo menos 2 opções');
        return;
      }
      const pollContent = `${content}\n\n📊 **Enquete:**\n${validOptions.map((o, i) => `${i + 1}. ${o}`).join('\n')}`;
      mutation.mutate({ content: pollContent, type: 'POLL' });
      return;
    }

    if (mode === 'CODE') {
      const codeContent = `\`\`\`${codeLanguage || 'text'}\n${content}\n\`\`\``;
      mutation.mutate({ content: codeContent, type: 'CODE' });
      return;
    }

    if (mode === 'IMAGE' && mediaFile) {
      const mediaUrl = await uploadMedia();
      mutation.mutate({ content: content || '📷', type: 'IMAGE', media: mediaUrl || undefined });
      return;
    }

    if (!content.trim()) { toast.error('Escreva algo'); return; }
    mutation.mutate({ content: content.trim(), type: 'TEXT' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 5) setPollOptions([...pollOptions, '']);
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Mode indicator tabs */}
            <div className="flex items-center gap-1 mb-2 bg-surface-100 dark:bg-dark-800 rounded-lg p-0.5 w-fit">
              {[
                { mode: 'TEXT' as PostMode, icon: Send, label: 'Texto' },
                { mode: 'IMAGE' as PostMode, icon: Image, label: 'Imagem' },
                { mode: 'CODE' as PostMode, icon: Code, label: 'Código' },
                { mode: 'POLL' as PostMode, icon: BarChart3, label: 'Enquete' },
              ].map((item) => (
                <button
                  key={item.mode}
                  onClick={() => handleModeChange(item.mode)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    mode === item.mode
                      ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-surface-400 dark:text-dark-500 hover:text-surface-600'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Image preview */}
            <AnimatePresence>
              {mediaPreview && mode === 'IMAGE' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative mb-2 rounded-xl overflow-hidden border border-surface-200 dark:border-dark-700"
                >
                  <img src={mediaPreview} alt="Preview" className="max-h-48 w-full object-contain bg-surface-50 dark:bg-dark-800" />
                  <button
                    onClick={() => { setMediaPreview(null); setMediaFile(null); }}
                    className="absolute top-2 right-2 p-1 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image mode - upload button */}
            {mode === 'IMAGE' && !mediaPreview && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 rounded-xl border-2 border-dashed border-surface-300 dark:border-dark-600
                           hover:border-primary-500 dark:hover:border-primary-500 text-surface-400 dark:text-dark-500
                           hover:text-primary-500 transition-all duration-200 flex flex-col items-center gap-2"
              >
                <Image className="w-8 h-8" />
                <span className="text-sm font-medium">Clique para selecionar uma imagem</span>
                <span className="text-xs">PNG, JPG, WEBP ou GIF</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

            {/* Code mode - language selector */}
            {mode === 'CODE' && (
              <div className="mb-2">
                <input
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  placeholder="Linguagem (ex: javascript, python, typescript)..."
                  className="input text-xs py-1.5 h-8 font-mono"
                />
              </div>
            )}

            {/* Main textarea */}
            {(mode !== 'IMAGE' || (mode === 'IMAGE' && content)) && (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => { setContent(e.target.value); if (!isExpanded) setIsExpanded(true); }}
                onFocus={() => setIsExpanded(true)}
                onKeyDown={handleKeyDown}
                placeholder={
                  mode === 'CODE' ? 'Digite seu código aqui...' :
                  mode === 'POLL' ? 'Digite a pergunta da enquete...' :
                  mode === 'IMAGE' ? 'Adicione uma legenda (opcional)...' :
                  'No que você está pensando?'
                }
                className={`w-full bg-transparent text-surface-900 dark:text-dark-100
                           placeholder:text-surface-400 dark:placeholder:text-dark-500
                           resize-none outline-none min-h-[28px] text-sm leading-relaxed scrollbar-hide
                           ${mode === 'CODE' ? 'font-mono text-sm' : ''}`}
                rows={isExpanded ? (mode === 'CODE' ? 8 : 3) : 1}
                maxLength={5000}
              />
            )}

            {/* Poll options */}
            {mode === 'POLL' && isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2 my-2"
              >
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-surface-400 dark:text-dark-500 w-5">{i + 1}.</span>
                    <input
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...pollOptions];
                        newOpts[i] = e.target.value;
                        setPollOptions(newOpts);
                      }}
                      placeholder={`Opção ${i + 1}`}
                      className="input flex-1 text-sm py-1.5 h-8"
                      maxLength={100}
                    />
                    {pollOptions.length > 2 && (
                      <button
                        onClick={() => setPollOptions(pollOptions.filter((_, j) => j !== i))}
                        className="p-1 text-surface-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 5 && (
                  <button
                    onClick={addPollOption}
                    className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-400 transition-colors mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar opção
                  </button>
                )}
              </motion.div>
            )}

            {/* Submit bar */}
            <motion.div
              initial={false}
              animate={{ height: isExpanded ? 'auto' : 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-dark-700 mt-2">
                <span className="text-[10px] text-surface-300 dark:text-dark-600">
                  Ctrl+Enter para publicar
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${content.length > 4500 ? 'text-red-500' : 'text-surface-400 dark:text-dark-500'}`}>
                    {content.length}/5000
                  </span>
                  <button onClick={resetForm} className="btn-ghost text-xs px-3 py-1.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={mutation.isPending || uploading || (!content.trim() && !mediaFile)}
                    className="btn-primary text-sm px-5 py-1.5"
                  >
                    {mutation.isPending || uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Publicar'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
