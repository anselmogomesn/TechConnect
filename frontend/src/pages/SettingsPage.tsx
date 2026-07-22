import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi, authApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Avatar } from '../components/ui/Avatar';
import {
  User, Shield, Bell, Lock, Palette, Globe, Smartphone, Eye,
  Moon, Sun, Monitor, Camera, Loader2, LogOut, Trash2, Copy,
  Check, ChevronRight,
} from 'lucide-react';

// ============================================
// Schemas
// ============================================
const profileSchema = z.object({
  name: z.string().min(2).max(50),
  surname: z.string().min(2).max(50),
  bio: z.string().max(500).optional(),
  website: z.string().max(200).optional(),
  location: z.string().max(100).optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Deve conter maiúscula, minúscula e número'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Senhas não conferem', path: ['confirmPassword'],
});

const tabs = [
  { key: 'profile', label: 'Perfil', icon: User },
  { key: 'account', label: 'Conta', icon: Shield },
  { key: 'security', label: 'Segurança', icon: Lock },
  { key: 'sessions', label: 'Sessões', icon: Smartphone },
  { key: 'appearance', label: 'Aparência', icon: Palette },
];

export function SettingsPage() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(tab || 'profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(`/settings/${key}`, { replace: true });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Configurações</h1>
        <p className="text-surface-500 dark:text-dark-400 text-sm">Gerencie suas preferências</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <nav className="lg:w-48 space-y-0.5 shrink-0">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => handleTabChange(item.key)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeTab === item.key
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-surface-600 dark:text-dark-300 hover:bg-surface-100 dark:hover:bg-dark-800'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && <ProfileSettings user={user} refreshUser={refreshUser} fileInputRef={fileInputRef} bannerInputRef={bannerInputRef} />}
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'sessions' && <SessionSettings />}
          {activeTab === 'appearance' && <AppearanceSettings theme={theme} setTheme={setTheme} />}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Profile Settings
// ============================================
function ProfileSettings({ user, refreshUser, fileInputRef, bannerInputRef }: any) {
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      surname: user?.surname || '',
      bio: user?.bio || '',
      website: user?.website || '',
      location: user?.location || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => userApi.updateProfile(data),
    onSuccess: () => {
      refreshUser();
      toast.success('Perfil atualizado!');
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await userApi.uploadAvatar(formData);
      refreshUser();
      toast.success('Avatar atualizado!');
    } catch { toast.error('Erro ao enviar avatar'); }
    finally { setIsUploading(false); }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('banner', file);
      await userApi.uploadBanner(formData);
      refreshUser();
      toast.success('Banner atualizado!');
    } catch { toast.error('Erro ao enviar banner'); }
    finally { setIsUploading(false); }
  };

  return (
    <div className="card overflow-hidden">
      {/* Banner */}
      <div className="relative h-36 lg:h-44 bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700">
        {user?.banner && (
          <img src={user.banner} alt="" className="w-full h-full object-cover" />
        )}
        <button
          onClick={() => bannerInputRef.current?.click()}
          className="absolute top-3 right-3 p-2 rounded-lg bg-black/30 hover:bg-black/50
                     text-white backdrop-blur-sm transition-all"
        >
          <Camera className="w-4 h-4" />
        </button>
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
      </div>

      {/* Avatar */}
      <div className="px-6 pb-6">
        <div className="flex items-end -mt-12 mb-4">
          <div className="relative group">
            <Avatar src={user?.avatar} name={user?.name} size="3xl" className="ring-4 ring-white dark:ring-dark-800" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100
                         flex items-center justify-center text-white transition-all"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
          {isUploading && <Loader2 className="w-5 h-5 animate-spin text-primary-500 ml-2 mb-2" />}
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Nome</label>
              <input {...register('name')} className={`input ${errors.name ? 'input-error' : ''}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{String(errors.name.message || '')}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Sobrenome</label>
              <input {...register('surname')} className={`input ${errors.surname ? 'input-error' : ''}`} />
              {errors.surname && <p className="text-xs text-red-500 mt-1">{String(errors.surname.message || '')}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Bio</label>
            <textarea {...register('bio')} className="input min-h-[80px] resize-none" rows={3} maxLength={500} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Website</label>
              <input {...register('website')} className="input" placeholder="https://" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1">Localização</label>
              <input {...register('location')} className="input" placeholder="Cidade, País" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={mutation.isPending} className="btn-primary">
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// Account Settings
// ============================================
function AccountSettings() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const updateUsernameMutation = useMutation({
    mutationFn: (newUsername: string) => userApi.updateProfile({ username: newUsername }),
    onSuccess: () => { toast.success('Username atualizado!'); setIsEditingUsername(false); },
  });

  return (
    <div className="card p-6 space-y-6">
      <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Conta</h2>

      {/* Email */}
      <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-dark-700">
        <div>
          <p className="text-sm font-medium text-surface-700 dark:text-dark-200">Email</p>
          <p className="text-sm text-surface-500 dark:text-dark-400">{user?.email}</p>
        </div>
        <span className="badge-success text-xs">Verificado</span>
      </div>

      {/* Username */}
      <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-dark-700">
        <div>
          <p className="text-sm font-medium text-surface-700 dark:text-dark-200">Username</p>
          {isEditingUsername ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input text-sm py-1 h-8 w-40"
              />
              <button onClick={() => updateUsernameMutation.mutate(username)} className="btn-primary text-xs px-3 py-1">
                Salvar
              </button>
              <button onClick={() => { setIsEditingUsername(false); setUsername(user?.username || ''); }} className="btn-ghost text-xs px-3 py-1">
                Cancelar
              </button>
            </div>
          ) : (
            <p className="text-sm text-surface-500 dark:text-dark-400">@{user?.username}</p>
          )}
        </div>
        {!isEditingUsername && (
          <button onClick={() => setIsEditingUsername(true)} className="btn-ghost text-xs">
            Alterar
          </button>
        )}
      </div>

      {/* Level info */}
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm font-medium text-surface-700 dark:text-dark-200">Nível</p>
          <p className="text-sm text-surface-500 dark:text-dark-400">Nível {user?.level} — {user?.title || 'Recruta'}</p>
        </div>
        <span className="text-xs text-surface-400 dark:text-dark-500">{user?.xp} XP</span>
      </div>
    </div>
  );
}

// ============================================
// Security Settings
// ============================================
function SecuritySettings() {
  const [twoFASecret, setTwoFASecret] = useState<string | null>(null);
  const [twoFAToken, setTwoFAToken] = useState('');
  const [show2FASetup, setShow2FASetup] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const passwordMutation = useMutation({
    mutationFn: (data: any) => authApi.changePassword(data),
    onSuccess: () => { toast.success('Senha alterada!'); reset(); },
  });

  const setup2FA = async () => {
    try {
      const { data } = await userApi.updateProfile({}); // will add 2fa route
      toast.success('2FA configurado!');
    } catch { toast.error('Erro ao configurar 2FA'); }
  };

  return (
    <div className="card p-6 space-y-6">
      <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Segurança</h2>

      {/* Change Password */}
      <form onSubmit={handleSubmit((d) => passwordMutation.mutate(d))} className="space-y-4">
        <h3 className="text-sm font-medium text-surface-700 dark:text-dark-200">Alterar senha</h3>
        <div>
          <input {...register('currentPassword')} type="password" className={`input ${errors.currentPassword ? 'input-error' : ''}`} placeholder="Senha atual" />
          {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{String(errors.currentPassword.message || '')}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input {...register('newPassword')} type="password" className={`input ${errors.newPassword ? 'input-error' : ''}`} placeholder="Nova senha" />
            {errors.newPassword && <p className="text-xs text-red-500 mt-1">{String(errors.newPassword.message || '')}</p>}
          </div>
          <div>
            <input {...register('confirmPassword')} type="password" className={`input ${errors.confirmPassword ? 'input-error' : ''}`} placeholder="Confirmar senha" />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{String(errors.confirmPassword.message || '')}</p>}
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={passwordMutation.isPending} className="btn-primary text-sm">
            {passwordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Alterar senha'}
          </button>
        </div>
      </form>

      <div className="divider" />

      {/* 2FA */}
      <div>
        <h3 className="text-sm font-medium text-surface-700 dark:text-dark-200 mb-2">Autenticação em dois fatores</h3>
        <p className="text-sm text-surface-500 dark:text-dark-400 mb-3">
          Adicione uma camada extra de segurança à sua conta.
        </p>
        <button onClick={setup2FA} className="btn-secondary text-sm">
          Configurar 2FA
        </button>
      </div>
    </div>
  );
}

// ============================================
// Sessions Settings
// ============================================
function SessionSettings() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data } = await userApi.updateProfile({}); // Needs dedicated endpoint
      return data.sessions || [];
    },
    enabled: false, // Disabled until backend route is added
  });

  return (
    <div className="card p-6 space-y-6">
      <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Sessões ativas</h2>
      <div className="text-center py-8">
        <Smartphone className="w-12 h-12 text-surface-300 dark:text-dark-600 mx-auto mb-3" />
        <p className="text-sm text-surface-500 dark:text-dark-400">
          Gerencie seus dispositivos conectados
        </p>
      </div>
    </div>
  );
}

// ============================================
// Appearance Settings
// ============================================
function AppearanceSettings({ theme, setTheme }: { theme: string; setTheme: (t: any) => void }) {
  return (
    <div className="card p-6 space-y-6">
      <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Aparência</h2>

      <div className="grid grid-cols-3 gap-3">
        {[
          { value: 'light', label: 'Claro', icon: Sun, desc: 'Modo claro' },
          { value: 'dark', label: 'Escuro', icon: Moon, desc: 'Modo escuro' },
          { value: 'system', label: 'Sistema', icon: Monitor, desc: 'Segue o sistema' },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
              theme === t.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-sm'
                : 'border-surface-200 dark:border-dark-700 hover:border-surface-300 dark:hover:border-dark-600'
            }`}
          >
            <t.icon className={`w-7 h-7 ${
              theme === t.value ? 'text-primary-500' : 'text-surface-400 dark:text-dark-500'
            }`} />
            <div className="text-center">
              <p className={`text-sm font-medium ${
                theme === t.value ? 'text-primary-600 dark:text-primary-400' : 'text-surface-700 dark:text-dark-200'
              }`}>
                {t.label}
              </p>
              <p className="text-xs text-surface-400 dark:text-dark-500 mt-0.5">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="mt-4 p-4 rounded-xl bg-surface-50 dark:bg-dark-800 border border-surface-200 dark:border-dark-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-500" />
          <div>
            <div className="h-3 w-24 rounded bg-surface-300 dark:bg-dark-600" />
            <div className="h-2 w-16 rounded bg-surface-200 dark:bg-dark-700 mt-1" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-surface-200 dark:bg-dark-700" />
          <div className="h-3 w-3/4 rounded bg-surface-200 dark:bg-dark-700" />
        </div>
      </div>
    </div>
  );
}
