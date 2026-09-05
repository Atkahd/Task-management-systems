'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/services/api';
import { User } from '@/types';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data.user);
    } catch (error) {
      console.error('Failed to fetch user session', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isPublicPage = pathname === '/login' || pathname === '/register' || pathname === '/';
      
      if (!user && !isPublicPage) {
        router.push('/login');
      } else if (user && isPublicPage) {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    fetchUser(); 
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};