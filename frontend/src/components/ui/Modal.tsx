// ============================================
// ANSELMO - Modal Component
// ============================================

import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function Modal({ isOpen, onClose, title, description, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`relative w-full sm:max-w-[calc(100%-2rem)] ${sizeClasses[size]} bg-white dark:bg-dark-800
                       rounded-t-2xl sm:rounded-2xl shadow-2xl border border-surface-200 dark:border-dark-700 max-h-[90vh] overflow-y-auto`}
          >
            {/* Header */}
            {(title || description) && (
              <div className="flex items-start justify-between p-6 pb-4">
                <div>
                  {title && (
                    <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-surface-500 dark:text-dark-400">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-dark-200
                             hover:bg-surface-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="p-6 pt-0">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
