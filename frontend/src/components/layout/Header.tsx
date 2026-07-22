import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Avatar } from '../ui/Avatar';
import {
  Bell, MessageCircle, Search, Menu, X, LogOut, Settings,
  User, Sun, Moon, Home, Compass, Users, Medal, Map,
  MessageCircle as ChatIcon, Hash, UserPlus, FileText, Shield,
} from 'lucide-react';

const mobileNavItems = [
  { to: '/feed', icon: Home, label: 'Feed' },
  { to: '/friends', icon: UserPlus, label: 'Amigos' },
  { to: '/messages', icon: ChatIcon, label: 'Chat' },
  { to: '/notifications', icon: Bell, label: 'Novidades' },
  { to: '/search', icon: Hash, label: 'Buscar' },
];

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate('/login');
  };

  // Drawer navigation items for mobile
  const drawerItems = [
    { to: '/feed', icon: Home, label: 'Feed' },
    { to: '/explore', icon: Compass, label: 'Explorar' },
    { to: '/friends', icon: UserPlus, label: 'Amigos' },
    { to: '/pages', icon: FileText, label: 'Páginas' },
    { to: '/treasure', icon: Map, label: 'Tesouro' },
    { to: '/badges', icon: Medal, label: 'Coleções' },
    { to: '/communities', icon: Users, label: 'Comunidades' },
    { to: '/messages', icon: ChatIcon, label: 'Mensagens' },
    { to: '/notifications', icon: Bell, label: 'Notificações' },
    { to: '/search', icon: Hash, label: 'Buscar' },
    { to: '/settings', icon: Settings, label: 'Configurações' },
  ];

  // Admin items
  if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
    drawerItems.push({ to: '/admin', icon: Shield, label: 'Dashboard Admin' });
    drawerItems.push({ to: '/moderation', icon: Shield, label: 'Moderação' });
  }

  return (
    <>
      {/* ═══ TOP HEADER ═══ */}
      <header className="sticky top-0 z-30 glass-strong border-b border-surface-200/50 dark:border-dark-800/50">
        <div className="flex items-center gap-2 sm:gap-4 px-2 sm:px-4 h-14 sm:h-16">
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-xl text-surface-500 dark:text-dark-400 hover:bg-surface-100 dark:hover:bg-dark-800 transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Search bar - hidden on very small screens, collapses on tablet */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md sm:max-w-lg hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 dark:text-dark-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar pessoas, posts..."
                className="input pl-9 h-9 sm:h-10 text-xs sm:text-sm"
              />
            </div>
          </form>

          {/* Spacer on mobile */}
          <div className="flex-1 sm:hidden" />

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Notifications */}
            <button onClick={() => navigate('/notifications')} className="btn-icon relative" aria-label="Notificações">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Messages */}
            <button onClick={() => navigate('/messages')} className="btn-icon hidden sm:flex" aria-label="Mensagens">
              <MessageCircle className="w-5 h-5" />
            </button>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-1.5 sm:px-2 py-1 rounded-xl hover:bg-surface-100 dark:hover:bg-dark-800 transition-colors"
              >
                <Avatar src={user?.avatar} name={user?.name} size="sm" />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-surface-700 dark:text-dark-200 leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-surface-400 dark:text-dark-500">Nv. {user?.level}</p>
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 top-full mt-2 w-56 z-50 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-surface-200 dark:border-dark-700 overflow-hidden"
                    >
                      <div className="p-3 border-b border-surface-100 dark:border-dark-700">
                        <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{user?.name} {user?.surname}</p>
                        <p className="text-xs text-surface-400 dark:text-dark-500">@{user?.username} · Nv. {user?.level}</p>
                      </div>
                      <div className="p-1">
                        <button onClick={() => { setProfileOpen(false); navigate(`/${user?.username}`); }}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-surface-600 dark:text-dark-300 hover:bg-surface-100 dark:hover:bg-dark-700">
                          <User className="w-4 h-4" /> Meu Perfil
                        </button>
                        <button onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-surface-600 dark:text-dark-300 hover:bg-surface-100 dark:hover:bg-dark-700">
                          <Settings className="w-4 h-4" /> Configurações
                        </button>
                        <button onClick={toggleTheme}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-surface-600 dark:text-dark-300 hover:bg-surface-100 dark:hover:bg-dark-700">
                          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                          {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                        </button>
                      </div>
                      <div className="p-1 border-t border-surface-100 dark:border-dark-700">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <LogOut className="w-4 h-4" /> Sair
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ MOBILE DRAWER ═══ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 w-72 z-50 bg-white dark:bg-dark-900 shadow-2xl lg:hidden overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-dark-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">TC</span>
                  </div>
                  <span className="font-bold text-surface-900 dark:text-white">TechConnect</span>
                </div>
                <button onClick={() => setMenuOpen(false)} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-dark-800">
                  <X className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              {/* Search on mobile */}
              <div className="p-3 border-b border-surface-100 dark:border-dark-800">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar..." className="input pl-9 h-9 text-sm" />
                  </div>
                </form>
              </div>

              {/* Nav items */}
              <div className="p-2 space-y-0.5">
                {drawerItems.map((item) => {
                  const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                  return (
                    <button key={item.to} onClick={() => { navigate(item.to); setMenuOpen(false); }}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                          : 'text-surface-600 dark:text-dark-300 hover:bg-surface-100 dark:hover:bg-dark-800'
                      }`}>
                      <item.icon className="w-5 h-5 shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ BOTTOM MOBILE NAV ═══ */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-dark-900/90 backdrop-blur-2xl border-t border-surface-200 dark:border-dark-800 lg:hidden safe-area-bottom">
        <div className="flex items-center justify-around px-1 py-1">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/feed' && location.pathname.startsWith(item.to));
            return (
              <button key={item.to} onClick={() => navigate(item.to)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-0 ${
                  isActive ? 'text-primary-500' : 'text-surface-400 dark:text-dark-500'
                }`}>
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] font-medium truncate max-w-full">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
