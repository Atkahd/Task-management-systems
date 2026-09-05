'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getTasks } from '@/services/task.service';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  CheckCircle2, 
  CircleDashed, 
  Clock, 
  ListTodo,
  Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'TODO').length,
    doing: tasks.filter((t) => t.status === 'DOING').length,
    done: tasks.filter((t) => t.status === 'DONE').length,
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here is a summary of your tasks and current progress.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
            Failed to load tasks. Please try refreshing the page.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <ListTodo className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-gray-50 text-gray-600 rounded-lg">
                <CircleDashed className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">To Do</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.todo}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.doing}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.done}</h3>
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}