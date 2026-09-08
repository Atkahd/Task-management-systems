import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/lib/ReactQueryProvider';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Management System',
  description: 'Full-stack Kanban board for task management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#070b16] text-slate-50 antialiased min-h-screen overflow-x-hidden relative`}>
        
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none">
          <div className="absolute top-[-250px] left-[-180px] w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[110px] opacity-30 animate-pulse"></div>
          <div className="absolute top-[20%] right-[-200px] w-[450px] h-[450px] bg-purple-600 rounded-full mix-blend-screen filter blur-[110px] opacity-30 animate-pulse delay-700"></div>
          <div className="absolute bottom-[-200px] left-[35%] w-[400px] h-[400px] bg-cyan-600 rounded-full mix-blend-screen filter blur-[110px] opacity-30 animate-pulse delay-1000"></div>
        </div>

        <ReactQueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}