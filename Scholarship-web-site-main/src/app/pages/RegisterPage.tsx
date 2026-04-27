import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Shield, AlertCircle, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApp } from '../context/AppContext';

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
};

const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [apiError, setApiError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const { register: registerUser, sendOtp } = useApp();
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
  const email = watch('email');

  const handleSendOtp = async () => {
    setApiError('');
    if (!email) {
      setApiError('Please enter your email first.');
      return;
    }
    setIsSendingOtp(true);
    try {
      const result = await sendOtp(email);
      if (result.success) {
        setIsOtpSent(true);
      } else {
        setApiError(result.message || 'Failed to send OTP.');
      }
    } catch (err: any) {
      setApiError(err.message || 'Error connection to mail server');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    setApiError('');
    if (!isOtpSent) {
        setApiError('Please verify your email with OTP first.');
        return;
    }
    try {
      const result = await registerUser(data.email, data.password, data.name, role, data.otp);
      if (result.success) {
        navigate(role === 'admin' ? '/admin' : '/dashboard');
        return;
      }
      setApiError(result.message || 'Registration failed.');
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
            <p className="text-gray-500 mt-2 font-medium uppercase tracking-widest text-[10px]">Scholarship Management Portal</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Register As</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                    role === 'student' ? 'border-blue-600 bg-blue-50 text-blue-600 ring-4 ring-blue-100' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs font-bold">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                    role === 'admin' ? 'border-blue-600 bg-blue-50 text-blue-600 ring-4 ring-blue-100' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <Shield className="h-5 w-5" />
                  <span className="text-xs font-bold">Admin</span>
                </button>
              </div>
            </div>

            {apiError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] rounded-lg px-4 py-3 flex items-start shadow-sm leading-relaxed">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  placeholder="Full Name"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  placeholder="Email Address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="password"
                    {...register('password', { required: true, minLength: 6 })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm"
                    placeholder="Password"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="password"
                    {...register('confirmPassword', { validate: v => v === password })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm"
                    placeholder="Confirm"
                  />
                </div>
              </div>

              {isOtpSent && (
                <div className="relative animate-slide">
                  <div className="flex items-center gap-2 mb-2 ml-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-bold text-green-600 uppercase tracking-tighter">Enter the 6-digit code sent to your mail</span>
                  </div>
                  <Shield className="absolute left-3 top-[38px] text-blue-600 h-5 w-5" />
                  <input
                    {...register('otp', { required: true })}
                    className="w-full pl-10 pr-4 py-4 bg-blue-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all font-black text-xl tracking-[0.3em] text-center"
                    placeholder="000000"
                  />
                </div>
              )}
            </div>

            {!isOtpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl transition-all font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-black active:scale-95 disabled:opacity-50"
              >
                {isSendingOtp ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Send className="h-4 w-4" /> Send OTP to Mail</>}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-3.5 rounded-xl transition-all font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-black active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : `Register as ${role}`}
              </button>
            )}
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 decoration-2 decoration-blue-100">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
