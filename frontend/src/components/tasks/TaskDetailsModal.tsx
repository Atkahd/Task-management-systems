import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Trash2, UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { Task, deleteTask, assignTask } from '@/services/task.service';
import { getAllUsers } from '@/services/admin.service';
import { useAuth } from '@/contexts/AuthContext';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailsModal({ task, isOpen, onClose }: TaskDetailsModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);

  const { data: allUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
    enabled: !!user && user.role === 'ADMIN' && isOpen, 
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
    onError: (error: any) => {
      setApiError(error.response?.data?.message || 'Failed to delete task');
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ taskId, userId }: { taskId: string; userId: string | null }) => 
      assignTask(taskId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
    onError: (error: any) => {
      setApiError(error.response?.data?.message || 'Failed to assign task');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(task!._id);
    }
  };

  const handleClaim = () => {
    assignMutation.mutate({ taskId: task!._id, userId: user!._id });
  };

  const handleUnassign = () => {
    assignMutation.mutate({ taskId: task!._id, userId: null });
  };

  const handleAdminAssign = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = e.target.value;
    assignMutation.mutate({ 
      taskId: task!._id, 
      userId: selectedUserId === 'unassigned' ? null : selectedUserId 
    });
  };

  if (!isOpen || !task || !user) return null;

  const isCreator = task.creator._id === user._id;
  const isAssignedToMe = task.assignedUser?._id === user._id;
  const isAdmin = user.role === 'ADMIN';
  
  const canDelete = isCreator || isAdmin;
  const isUnassigned = task.assignedUser === null;
  const canClaim = isUnassigned && !isAdmin; 

  return (
    // Velora Glass Modal Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070b16]/60 backdrop-blur-md">
      {/* Velora Glass Modal Container */}
      <div className="bg-[#070b16]/80 backdrop-blur-[25px] border border-white/[0.09] shadow-[0_25px_80px_rgba(0,0,0,0.5)] rounded-[24px] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-white/[0.09] bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm bg-white/10 text-slate-300 border border-white/20">
                {task.status}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight leading-tight mt-1">{task.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6">
          {apiError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 backdrop-blur-sm">
              {apiError}
            </div>
          )}

          <div>
            <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Description</h4>
            <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed bg-white/[0.03] p-5 rounded-xl border border-white/[0.05]">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.05]">
              <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Created By</span>
              <span className="text-sm font-semibold text-white">{task.creator.name}</span>
            </div>
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.05]">
              <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Assignment</span>
              
              {isAdmin ? (
                loadingUsers ? (
                  <span className="text-sm text-slate-400 flex items-center"><Loader2 className="w-4 h-4 mr-1 animate-spin"/> Loading...</span>
                ) : (
                  <select 
                    className="w-full text-sm font-semibold text-white bg-transparent border-b border-white/20 focus:outline-none focus:border-indigo-400 pb-1 cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
                    value={task.assignedUser?._id || 'unassigned'}
                    onChange={handleAdminAssign}
                    disabled={assignMutation.isPending}
                  >
                    <option value="unassigned">-- Unassigned --</option>
                    {allUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                )
              ) : (
                <span className={`text-sm font-semibold ${task.assignedUser ? 'text-white' : 'text-slate-500 italic'}`}>
                  {task.assignedUser ? task.assignedUser.name : 'Unassigned'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/[0.09] flex items-center justify-between bg-white/[0.02]">
          
          {canDelete ? (
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1.5" />}
              Delete Task
            </button>
          ) : (
            <div></div> 
          )}

          <div className="flex gap-3">
            {isAssignedToMe && !isUnassigned && !isAdmin && (
              <button
                onClick={handleUnassign}
                disabled={assignMutation.isPending}
                className="flex items-center px-4 py-2.5 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                <UserMinus className="w-4 h-4 mr-2" />
                Unassign
              </button>
            )}

            {canClaim && (
              <button
                onClick={handleClaim}
                disabled={assignMutation.isPending}
                className="flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl hover:-translate-y-0.5 shadow-[0_10px_20px_rgba(99,102,241,0.3)] transition-all duration-200"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Claim Task
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}