import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../services/api';
import { Avatar } from '../components/ui/Avatar';
import {
  Bell, Heart, MessageCircle, UserPlus, Award, Shield,
  CheckCheck, Loader2, AlertTriangle, Info, Trash2,
  BadgeCheck, Star, Zap,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const notificationIcons: Record<string, any> = {
  LIKE: { icon: Heart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  COMMENT: { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  FOLLOW: { icon: UserPlus, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
  MESSAGE: { icon: MessageCircle, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
  BADGE: { icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  ACHIEVEMENT: { icon: Star, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  LEVEL_UP: { icon: Zap, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  ADMIN: { icon: Shield, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  SYSTEM: { icon: Info, color: 'text-surface-500', bg: 'bg-surface-100 dark:bg-dark-700' },
};

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const { data: notifData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await notificationApi.getAll();
      return data;
    },
    refetchInterval: 15000,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications = notifData?.data || [];
  const unreadCount = notifData?.unreadCount || 0;
  const filtered = filter === 'unread' ? notifications.filter((n: any) => !n.isRead) : notifications;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Notificações</h1>
          <p className="text-sm text-surface-500 dark:text-dark-400">
            {unreadCount > 0 ? `${unreadCount} não lidas` : 'Tudo em dia!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllReadMutation.mutate()}
            className="btn-ghost text-sm gap-1"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-100 dark:bg-dark-800 rounded-lg p-1 w-fit">
        {[
          { key: 'all', label: 'Todas', count: notifications.length },
          { key: 'unread', label: 'Não lidas', count: unreadCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as 'all' | 'unread')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-white dark:bg-dark-700 text-surface-900 dark:text-white shadow-sm'
                : 'text-surface-500 dark:text-dark-400'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                filter === tab.key
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'bg-surface-200 dark:bg-dark-600 text-surface-500 dark:text-dark-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-48" />
                  <div className="skeleton h-2 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-surface-100 dark:bg-dark-800 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-surface-400 dark:text-dark-500" />
          </div>
          <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
            {filter === 'unread' ? 'Nenhuma não lida' : 'Nenhuma notificação'}
          </h3>
          <p className="text-sm text-surface-500 dark:text-dark-400">
            {filter === 'unread'
              ? 'Você leu todas as notificações!'
              : 'Quando você receber curtidas, comentários ou seguidores, aparecerão aqui.'}
          </p>
        </div>
      )}

      {/* List */}
      <div className="space-y-1">
        {filtered.map((notif: any) => {
          const iconConfig = notificationIcons[notif.type] || notificationIcons.SYSTEM;
          const IconComponent = iconConfig.icon;

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card p-4 transition-all cursor-pointer hover:shadow-md ${
                !notif.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/30 dark:bg-primary-900/10' : ''
              }`}
              onClick={() => {
                if (!notif.isRead) markReadMutation.mutate(notif.id);
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full ${iconConfig.bg} flex items-center justify-center shrink-0`}>
                  <IconComponent className={`w-5 h-5 ${iconConfig.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-900 dark:text-white font-medium">
                    {notif.title}
                  </p>
                  {notif.message && (
                    <p className="text-xs text-surface-500 dark:text-dark-400 mt-0.5">
                      {notif.message}
                    </p>
                  )}
                  <p className="text-[11px] text-surface-400 dark:text-dark-500 mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
                {!notif.isRead && (
                  <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-1.5" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
