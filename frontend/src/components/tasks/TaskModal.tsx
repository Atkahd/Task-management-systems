import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { createTask } from '@/services/task.service';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ isOpen, onClose }: TaskModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      reset(); 
      onClose();
    },
    onError: (error: any) => {
      setApiError(error.response?.data?.message || 'Failed to create task');
    },
  });

  const onSubmit = (data: TaskFormData) => {
    setApiError(null);
    createMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    // Velora Glass Modal Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070b16]/60 backdrop-blur-md">
      {/* Velora Glass Modal Container */}
      <div className="bg-[#070b16]/80 backdrop-blur-[25px] border border-white/[0.09] shadow-[0_25px_80px_rgba(0,0,0,0.5)] rounded-[24px] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.09] bg-white/[0.02]">
          <h2 className="text-xl font-bold text-white tracking-tight">Create New Task</h2>
          <button 
            onClick={() => { reset(); onClose(); }}
            className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body & Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
          {apiError && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 backdrop-blur-sm">
              {apiError}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Task Title</label>
              <input
                {...register('title')}
                type="text"
                placeholder="E.g., Design homepage UI"
                className={`w-full px-4 py-3 bg-white/5 text-white placeholder-slate-500 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all backdrop-blur-sm ${
                  errors.title 
                    ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50' 
                    : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/50'
                }`}
              />
              {errors.title && <p className="mt-1.5 text-sm text-red-400">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Description (Optional)</label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Add more details about this task..."
                className={`w-full px-4 py-3 bg-white/5 text-white placeholder-slate-500 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all backdrop-blur-sm ${
                  errors.description 
                    ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50' 
                    : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/50'
                }`}
              />
              {errors.description && <p className="mt-1.5 text-sm text-red-400">{errors.description.message}</p>}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => { reset(); onClose(); }}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl hover:-translate-y-0.5 shadow-[0_10px_20px_rgba(99,102,241,0.3)] transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}