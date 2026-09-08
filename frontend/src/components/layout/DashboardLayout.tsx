'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, KanbanSquare, Users, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth(); 
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, requiredRole: 'USER' },
    { name: 'Tasks Board', href: '/tasks', icon: KanbanSquare, requiredRole: 'USER' },
    { name: 'User Management', href: '/admin/users', icon: Users, requiredRole: 'ADMIN' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex flex-col w-64 bg-white/[0.025] backdrop-blur-xl border-r border-white/[0.07] fixed inset-y-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <span className="text-white font-bold text-lg leading-none mt-0.5">✦</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">TaskFlow</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <div className="text-[10px] uppercase tracking-[1.5px] text-slate-500 font-semibold mb-3 px-3">
            Overview
          </div>

          {navigation.map((item) => {
            if (item.requiredRole === 'ADMIN' && user.role !== 'ADMIN') return null;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white border border-indigo-500/20' 
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/[0.07]">
          <div className="flex items-center px-3 py-3 mb-3 bg-white/[0.03] border border-white/[0.05] rounded-xl backdrop-blur-sm">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold mr-3 uppercase text-sm shadow-md">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-white truncate">{user.name}</span>
              <span className="text-xs text-slate-400 mt-0.5">{user.role}</span>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center px-3 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-300 text-sm font-medium"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#070b16]/80 backdrop-blur-xl border-b border-white/[0.07] flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.4)]">
            <span className="text-white font-bold text-sm leading-none mt-0.5">✦</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">TaskFlow</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-300 hover:text-white focus:outline-none transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-[#070b16]/60 backdrop-blur-md pt-16">
          <div className="bg-[#070b16]/95 border-r border-white/[0.07] w-full max-w-sm h-full shadow-2xl flex flex-col">
            <div className="flex-1 py-6 px-4 space-y-2">
              <div className="text-[10px] uppercase tracking-[1.5px] text-slate-500 font-semibold mb-3 px-3">
                Overview
              </div>
              {navigation.map((item) => {
                if (item.requiredRole === 'ADMIN' && user.role !== 'ADMIN') return null;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white border border-indigo-500/20' 
                        : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            <div className="p-4 border-t border-white/[0.07]">
              <div className="flex items-center px-4 py-3 mb-3 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold mr-3 uppercase text-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{user.name}</span>
                  <span className="text-xs text-slate-400 mt-0.5">{user.role}</span>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors text-sm font-medium"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen relative z-0">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}