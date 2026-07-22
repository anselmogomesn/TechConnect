// ============================================
// ANSELMO - Login Page
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
  twoFactorCode: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);

      if (result.requiresTwoFactor) {
        setRequires2FA(true);
        setUserId(result.userId);
      } else {
        navigate('/feed');
      }
    } catch (err: any) {
      // Error already handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit2FA = async (data: LoginForm) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/feed');
    } catch {
      // Error handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Mobile logo */}
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="font-bold text-lg text-surface-900 dark:text-white">
          TechConnect
        </span>
      </div>

      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
        {requires2FA ? 'Autenticação em dois fatores' : 'Entrar'}
      </h1>
      <p className="text-surface-500 dark:text-dark-400 mb-8">
        {requires2FA
          ? 'Digite o código do seu aplicativo autenticador'
          : 'Bem-vindo de volta! Entre com suas credenciais.'}
      </p>

      <form
        onSubmit={handleSubmit(requires2FA ? onSubmit2FA : onSubmit)}
        className="space-y-4"
      >
        {!requires2FA && (
          <>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1.5">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="seu@email.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Sua senha"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 dark:text-dark-500
                             hover:text-surface-600 dark:hover:text-dark-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </>
        )}

        {requires2FA && (
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1.5">
              Código 2FA
            </label>
            <input
              type="text"
              {...register('twoFactorCode')}
              className="input text-center text-2xl tracking-[0.5em] font-mono"
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
          </div>
        )}

        <motion.button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full h-11"
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : requires2FA ? (
            'Verificar'
          ) : (
            'Entrar'
          )}
        </motion.button>
      </form>

      {!requires2FA && (
        <p className="mt-6 text-center text-sm text-surface-500 dark:text-dark-400">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
          >
            Criar conta
          </Link>
        </p>
      )}
    </div>
  );
}
