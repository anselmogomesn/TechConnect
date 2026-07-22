// ============================================
// ANSELMO - Avatar Component
// ============================================

import { useState } from 'react';
import { clsx } from 'clsx';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  status?: 'online' | 'offline' | 'away';
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
  '3xl': 'w-24 h-24 text-2xl',
};

const statusClasses = {
  online: 'bg-green-500',
  offline: 'bg-surface-400 dark:bg-dark-500',
  away: 'bg-yellow-500',
};

const statusSizes = {
  xs: 'w-1.5 h-1.5 right-0 bottom-0',
  sm: 'w-2 h-2 right-0 bottom-0',
  md: 'w-2.5 h-2.5 right-0 bottom-0',
  lg: 'w-3 h-3 right-0.5 bottom-0',
  xl: 'w-3.5 h-3.5 right-0 bottom-0',
  '2xl': 'w-4 h-4 right-0 bottom-0',
  '3xl': 'w-4 h-4 right-0 bottom-0',
};

export function Avatar({
  src,
  name,
  size = 'md',
  className,
  status,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const initial = name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className={clsx('relative shrink-0', className)}>
      {src && !imgError ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          onError={() => setImgError(true)}
          className={clsx(
            'rounded-full object-cover bg-surface-200 dark:bg-dark-700',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center',
            'text-primary-600 dark:text-primary-400 font-semibold',
            sizeClasses[size]
          )}
        >
          {name ? (
            initial
          ) : (
            <User className={clsx(size === 'xs' ? 'w-3 h-3' : 'w-4 h-4')} />
          )}
        </div>
      )}

      {status && (
        <span
          className={clsx(
            'absolute rounded-full border-2 border-white dark:border-dark-900',
            statusClasses[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
