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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Create New Task</h2>
          <button 
            onClick={() => { reset(); onClose(); }}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {apiError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">
              {apiError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input
                {...register('title')}
                type="text"
                placeholder="E.g., Design homepage UI"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Add more details about this task..."
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => { reset(); onClose(); }}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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