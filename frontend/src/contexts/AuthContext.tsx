// ============================================
// ANSELMO - Auth Context
// ============================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { authApi } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  username: string;
  avatar?: string | null;
  banner?: string | null;
  bio?: string | null;
  role: string;
  level: number;
  xp: number;
  reputation: number;
  title?: string | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('techconnect-token');
      if (!token) {
        setUser(null);
        return;
      }

      const { data } = await authApi.me();
      setUser(data.user);
    } catch {
      setUser(null);
      localStorage.removeItem('techconnect-token');
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setIsLoading(false);
    };
    init();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });

    if (data.requiresTwoFactor) {
      return { requiresTwoFactor: true, userId: data.userId };
    }

    localStorage.setItem('techconnect-token', data.accessToken);
    setUser(data.user);
    return data;
  };

  const register = async (registerData: any) => {
    const { data } = await authApi.register(registerData);
    localStorage.setItem('techconnect-token', data.accessToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('techconnect-token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
