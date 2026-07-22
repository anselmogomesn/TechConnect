// ============================================
// ANSELMO - Loading Screen
// ============================================

import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-dark-900">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <motion.div
            className="absolute -inset-1 rounded-xl border-2 border-primary-500"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Loading bar */}
        <div className="w-32 h-1 bg-surface-200 dark:bg-dark-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <p className="text-sm text-surface-500 dark:text-dark-400 font-medium">
          Loading...
        </p>
      </motion.div>
    </div>
  );
}
