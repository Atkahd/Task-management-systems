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
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-blue-600 tracking-tight">TaskFlow</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            if (item.requiredRole === 'ADMIN' && user.role !== 'ADMIN') return null;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3 uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-gray-900 truncate">{user.name}</span>
              <span className="text-xs text-gray-500">{user.role}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20">
        <span className="text-xl font-bold text-blue-600 tracking-tight">TaskFlow</span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-gray-900/50 pt-16">
          <div className="bg-white w-full max-w-sm h-full shadow-xl flex flex-col">
            <div className="flex-1 py-4 px-3 space-y-1">
              {navigation.map((item) => {
                if (item.requiredRole === 'ADMIN' && user.role !== 'ADMIN') return null;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-lg ${
                      isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t border-gray-200">
              <button 
                onClick={logout}
                className="w-full flex items-center px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}