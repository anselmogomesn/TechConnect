// ============================================
// ANSELMO - Main App with Routes
// ============================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';

// Layouts
import { AuthLayout } from './components/layout/AuthLayout';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { FeedPage } from './pages/FeedPage';
import { ProfilePage } from './pages/ProfilePage';
import { ExplorePage } from './pages/ExplorePage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { CommunityPage } from './pages/CommunityPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SearchPage } from './pages/SearchPage';
import { Suspense, lazy } from 'react';
import { BadgesPage } from './pages/BadgesPage';
import { FriendsPage } from './pages/FriendsPage';
import { PagesListPage, SinglePagePage } from './pages/PagesPage';
import { LoadingScreen } from './components/ui/LoadingScreen';

// Lazy loaded pages (code splitting para redução de bundle)
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const ModerationPage = lazy(() => import('./pages/ModerationPage').then(m => ({ default: m.ModerationPage })));
const TreasureHuntPage = lazy(() => import('./pages/TreasureHuntPage').then(m => ({ default: m.TreasureHuntPage })));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/feed" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: 'var(--toast-bg, #1a1d23)',
            color: 'var(--toast-color, #f1f5f9)',
            border: '1px solid var(--toast-border, #334155)',
          },
        }}
      />

      <AnimatePresence mode="wait">
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthLayout>
                  <LoginPage />
                </AuthLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <AuthLayout>
                  <RegisterPage />
                </AuthLayout>
              </PublicRoute>
            }
          />

          {/* App Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/communities/:slug" element={<CommunityPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/:tab" element={<SettingsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/badges" element={<BadgesPage />} />
            <Route path="/treasure" element={<Suspense fallback={<LoadingScreen />}><TreasureHuntPage /></Suspense>} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/pages" element={<PagesListPage />} />
            <Route path="/pages/:slug" element={<SinglePagePage />} />
            <Route path="/admin" element={<Suspense fallback={<LoadingScreen />}><AdminDashboardPage /></Suspense>} />
            <Route path="/moderation" element={<Suspense fallback={<LoadingScreen />}><ModerationPage /></Suspense>} />
            <Route path="/:username" element={<ProfilePage />} />
          </Route>

          {/* Home / Redirect */}
          <Route path="/" element={<HomePage />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-surface-300 dark:text-dark-500">
                    404
                  </h1>
                  <p className="mt-4 text-lg text-surface-500 dark:text-dark-400">
                    Page not found
                  </p>
                  <a
                    href="/"
                    className="mt-6 inline-flex items-center gap-2 text-primary-500 hover:text-primary-400"
                  >
                    ← Back to home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}
