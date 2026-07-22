import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Bot, X, Send, Loader2 } from 'lucide-react';

interface ChatMessage {
  role: 'bot' | 'user';
  text: string;
}

const quickActions = [
  { label: 'Ganhar XP', msg: 'Como ganhar XP?' },
  { label: 'Badges', msg: 'O que são badges?' },
  { label: 'Caça ao Tesouro', msg: 'O que é caça ao tesouro?' },
  { label: 'Criar post', msg: 'Como criar um post?' },
];

export function BotAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && showWelcome) loadWelcome();
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadWelcome = async () => {
    try {
      const { data } = await api.get('/bot/welcome');
      setMessages([{ role: 'bot', text: data.message }]);
    } catch {
      setMessages([{ role: 'bot', text: 'Olá! 👋 Como posso ajudar?' }]);
    }
    setShowWelcome(false);
  };

  const handleSend = async (msg?: string) => {
    const text = (msg || input).trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const { data } = await api.post('/bot/chat', { message: text });
      setMessages((prev) => [...prev, { role: 'bot', text: data.message }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Desculpe, tive um problema! 😊' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão fixo no canto inferior direito */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600
                   text-white shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50
                   flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.08, boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.5)' }}
        whileTap={{ scale: 0.92 }}
        animate={isOpen ? { scale: 0.92, rotate: 0 } : {
          y: [0, -6, 0],
          scale: [1, 1.03, 1],
        }}
        transition={isOpen ? { type: 'spring', stiffness: 400, damping: 20 } : {
          y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>

      {/* Painel do chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] max-h-[70vh]
                       bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-surface-200 dark:border-dark-700
                       flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary-500 to-purple-600 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">TechBot</p>
                  <p className="text-[11px] text-white/80">Assistente Virtual</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-10 h-10 text-surface-300 dark:text-dark-600 mx-auto mb-2" />
                  <p className="text-sm text-surface-400">Carregando...</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-br-md'
                      : 'bg-surface-100 dark:bg-dark-700 text-surface-700 dark:text-dark-200 rounded-bl-md'
                  }`}>
                    {msg.text.split('\n').map((line, j) => (
                      <p key={j}>{line || <br />}</p>
                    ))}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-surface-100 dark:bg-dark-700 rounded-2xl rounded-bl-md p-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {quickActions.map((action) => (
                <button key={action.label} onClick={() => handleSend(action.msg)} disabled={loading}
                  className="text-[10px] px-2 py-1 rounded-full bg-surface-100 dark:bg-dark-700
                             text-surface-500 dark:text-dark-400 hover:text-primary-500 hover:bg-primary-50
                             dark:hover:bg-primary-900/20 transition-all disabled:opacity-50">
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-surface-100 dark:border-dark-700 shrink-0">
              <div className="flex items-center gap-2 bg-surface-50 dark:bg-dark-700 rounded-xl px-3 py-1.5">
                <input value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pergunte algo..." disabled={loading}
                  className="flex-1 bg-transparent text-sm text-surface-900 dark:text-dark-100 placeholder:text-surface-400 outline-none" />
                <button onClick={() => handleSend()} disabled={!input.trim() || loading}
                  className="p-1.5 rounded-lg text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-30 transition-all">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
