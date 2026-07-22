// ============================================
// ANSELMO - Register Page
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(50),
    surname: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres').max(50),
    username: z
      .string()
      .min(3, 'Usuário deve ter no mínimo 3 caracteres')
      .max(30)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Usuário pode conter apenas letras, números e underscore'
      ),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Senha deve conter maiúscula, minúscula e número'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        surname: data.surname,
        username: data.username,
        email: data.email,
        password: data.password,
      });
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
        Criar conta
      </h1>
      <p className="text-surface-500 dark:text-dark-400 mb-8">
        Junte-se à rede profissional mais inovadora.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1.5">
              Nome
            </label>
            <input
              {...register('name')}
              className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="Seu nome"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1.5">
              Sobrenome
            </label>
            <input
              {...register('surname')}
              className={`input ${errors.surname ? 'input-error' : ''}`}
              placeholder="Seu sobrenome"
            />
            {errors.surname && (
              <p className="mt-1 text-sm text-red-500">
                {errors.surname.message}
              </p>
            )}
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1.5">
            Usuário
          </label>
          <input
            {...register('username')}
            className={`input ${errors.username ? 'input-error' : ''}`}
            placeholder="seu_usuario"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1.5">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className={`input ${errors.email ? 'input-error' : ''}`}
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1.5">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 dark:text-dark-500"
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

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-dark-200 mb-1.5">
            Confirmar senha
          </label>
          <input
            type="password"
            {...register('confirmPassword')}
            className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
            placeholder="Repita a senha"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <p className="text-xs text-surface-400 dark:text-dark-500">
          Ao criar uma conta, você concorda com nossos{' '}
          <a href="#" className="text-primary-500 hover:text-primary-400">
            Termos de Serviço
          </a>{' '}
          e{' '}
          <a href="#" className="text-primary-500 hover:text-primary-400">
            Política de Privacidade
          </a>
          .
        </p>

        <motion.button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full h-11"
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Criar conta'
          )}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-surface-500 dark:text-dark-400">
        Já tem uma conta?{' '}
        <Link
          to="/login"
          className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
