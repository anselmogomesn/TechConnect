import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Users, FileText, MessageCircle, Heart, Trophy,
  TrendingUp, Activity, UserPlus, Loader2,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import api from '../services/api';

function StatCard({ icon: Icon, label, value, change, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-surface-500 dark:text-dark-400">{label}</p>
          <p className="text-3xl font-bold text-surface-900 dark:text-white mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUp className="w-3 h-3 inline mr-0.5" />
              {change > 0 ? '+' : ''}{change} hoje
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
}

export function AdminDashboardPage() {
  const [days] = useState(30);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats');
      return data;
    },
  });

  const { data: userGrowth } = useQuery({
    queryKey: ['admin-user-growth', days],
    queryFn: async () => {
      const { data } = await api.get(`/admin/users/growth?days=${days}`);
      return data.data;
    },
  });

  const { data: postActivity } = useQuery({
    queryKey: ['admin-post-activity', days],
    queryFn: async () => {
      const { data } = await api.get(`/admin/activity/posts?days=${days}`);
      return data.data;
    },
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const s = stats || { users: {}, content: {}, xp: {} };
  const growthData = userGrowth || [];
  const activityData = postActivity || [];

  const totalUsers = growthData.reduce((sum: number, d: any) => sum + d.count, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
        <p className="text-surface-500 dark:text-dark-400 text-sm">Visão geral da plataforma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatCard icon={Users} label="Usuários" value={s.users.total || 0} change={s.users.newToday} color="text-blue-500" />
        <StatCard icon={FileText} label="Posts" value={s.content.posts || 0} change={s.content.postsToday} color="text-primary-500" />
        <StatCard icon={MessageCircle} label="Comentários" value={s.content.comments || 0} color="text-green-500" />
        <StatCard icon={Heart} label="Reações" value={s.content.reactions || 0} color="text-red-500" />
        <StatCard icon={Users} label="Ativos (7d)" value={s.users.activeWeek || 0} color="text-purple-500" />
        <StatCard icon={Trophy} label="Comunidades" value={stats?.community?.communities || 0} color="text-yellow-500" />
        <StatCard icon={Activity} label="Mensagens" value={stats?.community?.messages || 0} color="text-orange-500" />
        <StatCard icon={TrendingUp} label="XP Total" value={(s.xp.total || 0).toLocaleString()} color="text-emerald-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* User Growth */}
        <div className="card p-6">
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary-500" />
            Crescimento de Usuários
          </h3>
          {growthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a1d23', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" fill="url(#userGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-sm text-surface-400">Sem dados</div>
          )}
        </div>

        {/* Post Activity */}
        <div className="card p-6">
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary-500" />
            Atividade de Posts
          </h3>
          {activityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a1d23', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="posts" fill="#6366f1" radius={[4, 4, 0, 0]} name="Posts" />
                <Bar dataKey="comments" fill="#22c55e" radius={[4, 4, 0, 0]} name="Comentários" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-sm text-surface-400">Sem dados</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
