import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
          Task Management System
        </h1>
        <p className="text-xl text-gray-600">
          A secure, full-stack Kanban board built for productivity.
        </p>
        
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link 
            href="/login" 
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-3 rounded-lg bg-white text-gray-700 border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}