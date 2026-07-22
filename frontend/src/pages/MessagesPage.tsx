import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/ui/Avatar';
import { io, Socket } from 'socket.io-client';
import {
  Search, Send, Loader2, MessageCircle, ArrowLeft, User, Paperclip,
  Smile, MoreHorizontal, Check, CheckCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export function MessagesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeConversation, setActiveConversation] = useState<string | null>(
    sessionStorage.getItem('activeConversation')
  );
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear stored conversation on mount
  useEffect(() => {
    sessionStorage.removeItem('activeConversation');
  }, []);

  // Socket connection
  useEffect(() => {
    const token = localStorage.getItem('techconnect-token');
    if (!token) return;

    const s = io('/', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => console.log('Socket connected'));
    s.on('message:new', (msg) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    setSocket(s);
    return () => { s.disconnect(); };
  }, []);

  // Conversations
  const { data: conversationsData, isLoading: convLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await messageApi.getConversations();
      return data.conversations || [];
    },
    refetchInterval: 5000,
  });

  const conversations = conversationsData || [];

  // Messages for active conversation
  const { data: messagesData, isLoading: msgLoading } = useQuery({
    queryKey: ['messages', activeConversation],
    queryFn: async () => {
      if (!activeConversation) return [];
      const { data } = await messageApi.getMessages(activeConversation);
      return data.data || [];
    },
    enabled: !!activeConversation,
  });

  const messages = messagesData || [];

  // Join conversation room
  useEffect(() => {
    if (socket && activeConversation) {
      socket.emit('conversation:join', { conversationId: activeConversation });
      return () => {
        socket.emit('conversation:leave', { conversationId: activeConversation });
      };
    }
  }, [socket, activeConversation]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      messageApi.sendMessage(activeConversation!, content),
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', activeConversation] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (socket && activeConversation) {
        socket.emit('typing:stop', { conversationId: activeConversation });
      }
    },
  });

  const handleSend = () => {
    if (!newMessage.trim() || !activeConversation) return;
    sendMutation.mutate(newMessage.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Typing indicator
    if (socket && activeConversation) {
      socket.emit('typing:start', { conversationId: activeConversation });
      clearTimeout((window as any).typingTimeout);
      (window as any).typingTimeout = setTimeout(() => {
        socket.emit('typing:stop', { conversationId: activeConversation });
      }, 1000);
    }
  };

  const activeConv = conversations.find((c: any) => c.id === activeConversation);

  return (
    <div className="flex h-[calc(100vh-5rem)] -m-4 lg:-m-6">
      {/* Conversations sidebar */}
      <div className={`w-full sm:w-80 lg:w-96 border-r border-surface-200 dark:border-dark-800 bg-white dark:bg-dark-900 flex flex-col ${activeConversation ? 'hidden sm:flex' : 'flex'}`}>
        <div className="p-4 border-b border-surface-200 dark:border-dark-800">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Mensagens</h2>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input className="input pl-9 h-9 text-sm" placeholder="Buscar conversas..." />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {convLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3 w-24" />
                    <div className="skeleton h-2 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageCircle className="w-10 h-10 text-surface-300 dark:text-dark-600 mx-auto mb-3" />
              <p className="text-sm text-surface-500 dark:text-dark-400">Nenhuma conversa</p>
              <p className="text-xs text-surface-400 dark:text-dark-500 mt-1">Comece uma conversa com outros profissionais</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-100 dark:divide-dark-800">
              {conversations.map((conv: any) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-surface-50 dark:hover:bg-dark-800 transition-colors text-left ${
                    activeConversation === conv.id ? 'bg-surface-50 dark:bg-dark-800' : ''
                  }`}
                >
                  <Avatar src={conv.avatar} name={conv.name} size="md" status={conv.participants?.[0]?.status === 'ACTIVE' ? 'online' : 'offline'} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{conv.name}</p>
                      {conv.lastMessage && (
                        <span className="text-[10px] text-surface-400 dark:text-dark-500 whitespace-nowrap ml-2">
                          {format(new Date(conv.lastMessage.createdAt), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-surface-400 dark:text-dark-500 truncate mt-0.5">
                      {conv.lastMessage?.content || 'Clique para começar a conversar'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-dark-900 ${!activeConversation ? 'hidden sm:flex' : 'flex'}`}>
        {activeConversation && activeConv ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 p-3 border-b border-surface-200 dark:border-dark-800 bg-white dark:bg-dark-900">
              <button onClick={() => setActiveConversation(null)} className="sm:hidden btn-icon">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Avatar src={activeConv.avatar} name={activeConv.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{activeConv.name}</p>
                <p className="text-[11px] text-surface-400 dark:text-dark-500">Online</p>
              </div>
              <button className="btn-icon"><MoreHorizontal className="w-5 h-5" /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-10 h-10 text-surface-300 dark:text-dark-600 mx-auto mb-2" />
                  <p className="text-sm text-surface-400 dark:text-dark-500">Nenhuma mensagem ainda</p>
                  <p className="text-xs text-surface-400 dark:text-dark-500 mt-1">Envie a primeira mensagem!</p>
                </div>
              ) : (
                messages.map((msg: any) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${isMine ? 'order-1' : 'order-1'}`}>
                        {!isMine && (
                          <p className="text-[10px] text-surface-400 dark:text-dark-500 mb-1 ml-1">{msg.sender?.name}</p>
                        )}
                        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                          isMine
                            ? 'bg-primary-500 text-white rounded-br-md'
                            : 'bg-surface-100 dark:bg-dark-700 text-surface-900 dark:text-dark-100 rounded-bl-md'
                        }`}>
                          {msg.content}
                        </div>
                        <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-[10px] text-surface-400 dark:text-dark-500">
                            {format(new Date(msg.createdAt), 'HH:mm')}
                          </span>
                          {isMine && (
                            msg.isRead
                              ? <CheckCheck className="w-3 h-3 text-primary-500" />
                              : <Check className="w-3 h-3 text-surface-400" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-surface-200 dark:border-dark-800 bg-white dark:bg-dark-900">
              <div className="flex items-center gap-2 bg-surface-50 dark:bg-dark-800 rounded-xl px-3 py-1.5">
                <button className="btn-icon p-1"><Paperclip className="w-4 h-4" /></button>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-transparent text-sm text-surface-900 dark:text-dark-100 placeholder:text-surface-400 outline-none resize-none max-h-20 py-1"
                  rows={1}
                />
                <button className="btn-icon p-1"><Smile className="w-4 h-4" /></button>
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sendMutation.isPending}
                  className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sendMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-dark-800 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-surface-400 dark:text-dark-500" />
              </div>
              <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-1">Suas mensagens</h3>
              <p className="text-sm text-surface-400 dark:text-dark-500 max-w-xs">
                Selecione uma conversa para começar a conversar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
