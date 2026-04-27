import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Shield, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApp } from '../context/AppContext';

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [apiError, setApiError] = useState('');
  const { register: registerUser } = useApp();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormInputs>({
    mode: 'onChange'
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormInputs) => {
    setApiError('');
    try {
      const result = await registerUser(data.email, data.password, data.name, role);
      if (result.success) {
        navigate(role === 'admin' ? '/admin' : '/dashboard');
        return;
      }
      setApiError(result.message || 'Registration failed. Please try again.');
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
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
            <p className="text-gray-500 mt-2 font-medium">Join our scholarship community</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Register As</label>
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
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-bold">Admin</span>
                </button>
              </div>
            </div>

            {apiError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-lg px-4 py-3 flex items-center shadow-sm">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                {apiError}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Full name is required' })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    errors.name ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    errors.email ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    errors.password ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600 font-medium">{errors.confirmPassword.message}</p>}
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
                  Creating Account...
                </>
              ) : (
                `Create ${role === 'admin' ? 'Admin' : 'Student'} Account`
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 decoration-2 decoration-blue-200 hover:decoration-blue-600 transition-all">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
