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
      <div className="space-y-8">
        
        <div className="bg-white/[0.055] backdrop-blur-[25px] border border-white/[0.09] shadow-[0_25px_80px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)] rounded-[24px] p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Welcome back, {user.name} 
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Here is a summary of your tasks and current progress.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        )}

        {isError && (
          <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-sm text-red-400 p-4 rounded-xl text-sm">
            Failed to load tasks. Please try refreshing the page.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-[17px] p-6 flex items-center space-x-4 hover:-translate-y-1 hover:bg-white/[0.07] transition-all duration-300">
              <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-[10px]">
                <ListTodo className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total Tasks</p>
                <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.07] rounded-[17px] p-6 flex items-center space-x-4 hover:-translate-y-1 hover:bg-white/[0.07] transition-all duration-300">
              <div className="p-3.5 bg-slate-500/10 text-slate-300 rounded-[10px]">
                <CircleDashed className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">To Do</p>
                <h3 className="text-3xl font-bold text-white">{stats.todo}</h3>
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.07] rounded-[17px] p-6 flex items-center space-x-4 hover:-translate-y-1 hover:bg-white/[0.07] transition-all duration-300">
              <div className="p-3.5 bg-purple-500/10 text-purple-400 rounded-[10px]">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">In Progress</p>
                <h3 className="text-3xl font-bold text-white">{stats.doing}</h3>
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.07] rounded-[17px] p-6 flex items-center space-x-4 hover:-translate-y-1 hover:bg-white/[0.07] transition-all duration-300">
              <div className="p-3.5 bg-cyan-500/10 text-cyan-400 rounded-[10px]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Completed</p>
                <h3 className="text-3xl font-bold text-white">{stats.done}</h3>
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}