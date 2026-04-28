import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Shield, AlertCircle, CheckCircle } from 'lucide-react';
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
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { register: registerUser, sendOtp } = useApp();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormInputs>({
    mode: 'onChange'
  });

  const password = watch('password');

  const handleSendOtp = async () => {
    const email = getValues('email');
    if (!email) {
      setApiError('Please enter your email first.');
      return;
    }
    setApiError('');
    try {
      const result = await sendOtp(email);
      if (result.success) {
        setOtpSent(true);
      } else {
        setApiError(result.message || 'Failed to send OTP.');
      }
    } catch (err: any) {
      setApiError(err.message || 'Error sending OTP');
    }
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    if (otp.length !== 6) {
      setApiError('Please enter a valid 6-digit OTP.');
      return;
    }

    setApiError('');
    try {
      const result = await registerUser(data.email, data.password, data.name, role.toUpperCase() as 'student' | 'admin', otp);
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
            {!otpSent ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Register As</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${role === 'student' ? 'border-blue-600 bg-blue-50 text-blue-600 ring-4 ring-blue-100' : 'border-gray-200 text-gray-600'
                        }`}
                    >
                      <User className="h-5 w-5" />
                      <span className="text-xs font-bold">Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${role === 'admin' ? 'border-blue-600 bg-blue-50 text-blue-600 ring-4 ring-blue-100' : 'border-gray-200 text-gray-600'
                        }`}
                    >
                      <Shield className="h-5 w-5" />
                      <span className="text-xs font-bold">Admin</span>
                    </button>
                  </div>
                </div>

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
                </div>
              </>
            ) : (
              <div className="space-y-6 py-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 text-green-600 rounded-full mb-3">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900">Verify your email</h3>
                  <p className="text-xs text-gray-500 mt-1">We've sent a 6-digit code to <span className="font-bold text-gray-900">{getValues('email')}</span></p>
                </div>

                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-center text-2xl font-black tracking-[0.5em]"
                    placeholder="000000"
                  />
                </div>

                <button 
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                >
                  ← Edit registration details
                </button>
              </div>
            )}

            {apiError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] rounded-lg px-4 py-3 flex items-start shadow-sm leading-relaxed">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl transition-all font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-black active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                otpSent ? 'Complete Registration' : `Send OTP & Register`
              )}
            </button>
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
