// ============================================
// ANSELMO - Explore Page
// ============================================

import { motion } from 'framer-motion';
import { Compass, TrendingUp, Users, Hash } from 'lucide-react';

export function ExplorePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Explorar
        </h1>
        <p className="text-surface-500 dark:text-dark-400">
          Descubra conteúdo novo e interessante
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: 'Tendências', color: 'text-brand-orange' },
          { icon: Users, label: 'Pessoas', color: 'text-brand-blue' },
          { icon: Hash, label: 'Hashtags', color: 'text-brand-purple' },
          { icon: Compass, label: 'Descobrir', color: 'text-brand-green' },
        ].map((cat) => (
          <button
            key={cat.label}
            className="card-hover p-4 text-center"
          >
            <cat.icon className={`w-6 h-6 ${cat.color} mx-auto mb-2`} />
            <span className="text-sm font-medium text-surface-700 dark:text-dark-200">
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Trending section */}
      <div className="card p-6">
        <h2 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-orange" />
          Em alta
        </h2>
        <div className="text-center py-8 text-surface-400 dark:text-dark-500 text-sm">
          Nenhuma tendência no momento
        </div>
      </div>
    </motion.div>
  );
}
