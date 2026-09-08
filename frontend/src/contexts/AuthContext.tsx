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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b16]">
        <div className="bg-white/[0.05] p-6 rounded-[20px] backdrop-blur-xl border border-white/[0.07] shadow-[0_0_40px_rgba(99,102,241,0.15)] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-3" />
          <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">Authenticating...</p>
        </div>
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