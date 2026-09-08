'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getAllUsers, getSystemStats, deleteUser } from '@/services/admin.service'; 
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldAlert, Users, LayoutList, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getSystemStats,
  });

 
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete user.');
    },
  });

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (!user) return null;

  if (user.role !== 'ADMIN') {
    return (
      <DashboardLayout>
        
        <div className="flex flex-col items-center justify-center h-[60vh] bg-white/[0.02] rounded-[24px] border border-white/[0.05] backdrop-blur-md">
          <ShieldAlert className="w-16 h-16 text-red-400 mb-4 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-slate-400 mt-2">You do not have permission to view this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  const isLoading = loadingUsers || loadingStats;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Manage system users and view global statistics.</p>
      </div>

      {isLoading ? (
         <div className="flex justify-center items-center h-64">
           <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
         </div>
      ) : (
        <div className="space-y-8">
          
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             
              <div className="bg-white/[0.04] border border-white/[0.07] rounded-[17px] p-6 flex items-center space-x-4 hover:-translate-y-1 hover:bg-white/[0.07] transition-all duration-300">
                <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-[10px]">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total System Users</p>
                  <h3 className="text-3xl font-bold text-white">{stats.users.total}</h3>
                </div>
              </div>
              
              
              <div className="bg-white/[0.04] border border-white/[0.07] rounded-[17px] p-6 flex items-center space-x-4 hover:-translate-y-1 hover:bg-white/[0.07] transition-all duration-300">
                <div className="p-3.5 bg-cyan-500/10 text-cyan-400 rounded-[10px]">
                  <LayoutList className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total System Tasks</p>
                  <h3 className="text-3xl font-bold text-white">{stats.tasks.total}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/[0.055] backdrop-blur-[25px] border border-white/[0.09] shadow-[0_25px_80px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)] rounded-[24px] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.09] bg-white/[0.02]">
              <h3 className="font-semibold text-white">Registered Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.09] text-xs uppercase tracking-wider text-slate-400 bg-white/[0.01]">
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Joined Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {users.map((u: any) => (
                    <tr key={u._id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">{u.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{u.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                          u.role === 'ADMIN' 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                            : 'bg-white/10 text-slate-300 border border-white/20'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={deleteUserMutation.isPending || u._id === user._id}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            u._id === user._id 
                              ? 'text-slate-600 cursor-not-allowed' 
                              : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                          }`}
                          title={u._id === user._id ? "You cannot delete yourself" : "Delete User"}
                        >
                          {deleteUserMutation.isPending && deleteUserMutation.variables === u._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      )}
    </DashboardLayout>
  );
}