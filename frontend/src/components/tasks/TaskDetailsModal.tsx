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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold px-2 py-1 bg-gray-200 text-gray-700 rounded-md">
                {task.status}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight mt-2">{task.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {apiError && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">
              {apiError}
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="block text-xs font-medium text-gray-500 mb-1">Created By</span>
              <span className="text-sm font-semibold text-gray-900">{task.creator.name}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="block text-xs font-medium text-gray-500 mb-1">Assignment</span>
              
              {isAdmin ? (
                loadingUsers ? (
                  <span className="text-sm text-gray-500 flex items-center"><Loader2 className="w-4 h-4 mr-1 animate-spin"/> Loading...</span>
                ) : (
                  <select 
                    className="w-full text-sm font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-1 cursor-pointer"
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
                <span className={`text-sm font-semibold ${task.assignedUser ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                  {task.assignedUser ? task.assignedUser.name : 'Unassigned'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          
          {canDelete ? (
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
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
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserMinus className="w-4 h-4 mr-2" />
                Unassign
              </button>
            )}

            {canClaim && (
              <button
                onClick={handleClaim}
                disabled={assignMutation.isPending}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
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