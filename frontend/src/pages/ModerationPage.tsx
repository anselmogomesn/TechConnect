import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import toast from 'react-hot-toast';
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Search,
  Loader2, UserX, Ban, MessageSquare, Flag,
} from 'lucide-react';

export function ModerationPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('PENDING');

  const { data, isLoading } = useQuery({
    queryKey: ['moderation', filter],
    queryFn: async () => {
      const { data } = await api.get(`/admin/reports?status=${filter}`);
      return data;
    },
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/admin/reports/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation'] });
      toast.success('Reporte atualizado');
    },
  });

  const reports = data?.data || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Moderação</h1>
          <p className="text-sm text-surface-500 dark:text-dark-400">Gerencie reportes da comunidade</p>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-surface-100 dark:bg-dark-800 rounded-lg p-1 w-fit">
        {[
          { key: 'PENDING', label: 'Pendentes' },
          { key: 'RESOLVED', label: 'Resolvidos' },
          { key: 'DISMISSED', label: 'Rejeitados' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-white dark:bg-dark-700 text-surface-900 dark:text-white shadow-sm'
                : 'text-surface-500 dark:text-dark-400 hover:text-surface-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (<div key={i} className="card p-4"><div className="skeleton h-16" /></div>))}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16">
          <Shield className="w-12 h-12 text-surface-300 dark:text-dark-600 mx-auto mb-3" />
          <h3 className="font-medium text-surface-900 dark:text-white mb-1">Nenhum reporte</h3>
          <p className="text-sm text-surface-400 dark:text-dark-500">Tudo limpo por aqui!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report: any) => (
            <div key={report.id} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <Flag className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-surface-900 dark:text-white">
                      Reporte de {report.targetType?.toLowerCase()}
                    </p>
                    <span className={`badge ${
                      report.status === 'PENDING' ? 'badge-warning' :
                      report.status === 'RESOLVED' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-surface-500 dark:text-dark-400 mt-1">
                    Motivo: {report.reason}
                  </p>
                  {report.description && (
                    <p className="text-xs text-surface-400 dark:text-dark-500 mt-1">
                      {report.description}
                    </p>
                  )}
                  {filter === 'PENDING' && (
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => resolveMutation.mutate({ id: report.id, status: 'RESOLVED' })}
                        leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                      >
                        Resolver
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => resolveMutation.mutate({ id: report.id, status: 'DISMISSED' })}
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
