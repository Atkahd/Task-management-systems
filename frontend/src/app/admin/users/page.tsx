'use client';

import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getAllUsers, getSystemStats } from '@/services/admin.service';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldAlert, Users, LayoutList } from 'lucide-react';

export default function AdminUsersPage() {
  const { user } = useAuth();

  
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  });

 
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getSystemStats,
  });

  if (!user) return null;

  
  if (user.role !== 'ADMIN') {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  const isLoading = loadingUsers || loadingStats;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage system users and view global statistics.</p>
      </div>

      {isLoading ? (
         <div className="flex justify-center items-center h-64">
           <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
         </div>
      ) : (
        <div className="space-y-8">
          
          
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total System Users</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.users.total}</h3>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                  <LayoutList className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total System Tasks</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.tasks.total}</h3>
                </div>
              </div>
            </div>
          )}

          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Registered Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-sm text-gray-500">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
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