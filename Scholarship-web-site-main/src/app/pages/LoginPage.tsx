import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApp } from '../context/AppContext';

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [apiError, setApiError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormInputs>({
    mode: 'onChange'
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setApiError('');
    try {
      const result = await login(data.email, data.password, role.toUpperCase() as 'student' | 'admin');
      if (result.success) {
        navigate(role === 'admin' ? '/admin' : '/dashboard');
        return;
      }
      setApiError(result.message || 'Login failed. Please try again.');
    } catch (err: any) {
      setApiError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg shadow-blue-200">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 mt-2 font-medium">Sign in to your account</p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Login As</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                  role === 'student'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 ring-4 ring-blue-100'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-bold">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                  role === 'admin'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 ring-4 ring-blue-100'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Lock className="h-5 w-5" />
                <span className="text-sm font-bold">Admin</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {apiError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-lg px-4 py-3 flex items-center shadow-sm">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                {apiError}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    errors.email 
                      ? 'border-red-300 bg-red-50 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 font-medium flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    errors.password 
                      ? 'border-red-300 bg-red-50 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 font-medium flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white py-3.5 rounded-xl transition-all font-bold text-lg shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 decoration-2 decoration-blue-200 hover:decoration-blue-600 transition-all">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
