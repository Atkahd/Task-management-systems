'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext'; 

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { login } = useAuth(); 
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setApiError(null);
      const response = await api.post('/auth/register', data);
      
      login(response.data.data.token);

      window.location.href = '/dashboard';

    } catch (error: any) {
      setApiError(
        error.response?.data?.message || 'An error occurred during registration. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white/[0.055] backdrop-blur-[25px] border border-white/[0.09] shadow-[0_25px_80px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)] p-8 sm:p-10 rounded-[24px]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">Create an account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Or{' '}
            <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {apiError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
              <p className="text-sm text-center text-red-400">{apiError}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                {...register('name')}
                type="text"
                className={`block w-full px-4 py-3 bg-white/5 text-white placeholder-slate-500 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all backdrop-blur-sm ${
                  errors.name 
                    ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50' 
                    : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/50'
                }`}
                placeholder="Atheek Ahamed"
              />
              {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input
                {...register('email')}
                type="email"
                className={`block w-full px-4 py-3 bg-white/5 text-white placeholder-slate-500 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all backdrop-blur-sm ${
                  errors.email 
                    ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50' 
                    : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/50'
                }`}
                placeholder="atheek@example.com"
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                {...register('password')}
                type="password"
                className={`block w-full px-4 py-3 bg-white/5 text-white placeholder-slate-500 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all backdrop-blur-sm ${
                  errors.password 
                    ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50' 
                    : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/50'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_15px_40px_rgba(99,102,241,0.3)] text-sm font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-500 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              'Sign up'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}