import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Home, Compass, Users, MessageCircle, Bell, Settings, LogOut,
  Sun, Moon, Hash, User, Medal, Shield, Zap, Map, UserPlus, FileText,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/feed', icon: Home, label: 'Feed' },
  { to: '/explore', icon: Compass, label: 'Explorar' },
  { to: '/friends', icon: UserPlus, label: 'Amigos' },
  { to: '/pages', icon: FileText, label: 'Páginas' },
  { to: '/treasure', icon: Map, label: 'Caça ao Tesouro' },
  { to: '/badges', icon: Medal, label: 'Coleções' },
  { to: '/communities', icon: Users, label: 'Comunidades' },
  { to: '/messages', icon: MessageCircle, label: 'Mensagens' },
  { to: '/notifications', icon: Bell, label: 'Notificações' },
  { to: '/search', icon: Hash, label: 'Buscar' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 280 }}
      className="hidden xl:flex flex-col bg-white/80 dark:bg-dark-900/80 backdrop-blur-2xl border-r border-surface-200/50 dark:border-dark-800/50 shrink-0 relative z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-200/50 dark:border-dark-800/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
            TechConnect
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${isActive
                ? 'bg-gradient-to-r from-primary-500/10 to-purple-500/10 text-primary-600 dark:text-primary-400 font-medium shadow-sm'
                : 'text-surface-500 dark:text-dark-400 hover:bg-surface-100/50 dark:hover:bg-dark-800/50 hover:text-surface-700 dark:hover:text-dark-200'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}

        {/* Admin section */}
        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
          <div className="pt-4 mt-4 border-t border-surface-200/50 dark:border-dark-800/50">
            {!collapsed && (
              <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-surface-400 dark:text-dark-500 mb-2">
                Admin
              </p>
            )}
            <NavLink to="/admin" className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? 'bg-primary-500/10 text-primary-600' : 'text-surface-500 dark:text-dark-400 hover:bg-surface-100/50 dark:hover:bg-dark-800/50'}`}>
              <Shield className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">Dashboard</span>}
            </NavLink>
            <NavLink to="/moderation" className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? 'bg-primary-500/10 text-primary-600' : 'text-surface-500 dark:text-dark-400 hover:bg-surface-100/50 dark:hover:bg-dark-800/50'}`}>
              <Shield className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">Moderação</span>}
            </NavLink>
          </div>
        )}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-surface-200/50 dark:border-dark-800/50 p-2 space-y-1">
        <NavLink to={`/${user?.username}`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-500 dark:text-dark-400
                     hover:bg-surface-100/50 dark:hover:bg-dark-800/50 transition-all">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center shrink-0 shadow-sm">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-700 dark:text-dark-200 truncate">{user?.name}</p>
              <p className="text-xs text-surface-400 dark:text-dark-500 truncate">Nv. {user?.level}</p>
            </div>
          )}
        </NavLink>

        <button onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-surface-500 dark:text-dark-400
                     hover:bg-surface-100/50 dark:hover:bg-dark-800/50 transition-all">
          {theme === 'dark' ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
          {!collapsed && <span className="text-sm">Tema</span>}
        </button>

        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm">Sair</span>}
        </button>

        <button onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-xl text-surface-400 dark:text-dark-500
                     hover:bg-surface-100/50 dark:hover:bg-dark-800/50 transition-all">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
