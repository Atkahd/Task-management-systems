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
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <ReactQueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}