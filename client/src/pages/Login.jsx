import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { useToast } from '@/hooks/useToast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError('');
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      setServerError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-surface-900 dark:text-white">
              On<span className="text-brand-600">Campus</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Welcome back</h1>
          <p className="mt-1 text-surface-500 dark:text-surface-400">Sign in to your account to continue</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#161617] rounded-2xl border border-surface-200 dark:border-white/[0.1] shadow-apple-card p-6 sm:p-8 transition-colors">
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-sm text-red-600 dark:text-red-400">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500 ${
                  errors.email ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-surface-300 dark:border-white/[0.12] focus:ring-brand-500 focus:border-brand-500'
                } focus:ring-2 focus:outline-none transition-colors`}
                placeholder="you@university.edu"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl border bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500 ${
                    errors.password ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-surface-300 dark:border-white/[0.12] focus:ring-brand-500 focus:border-brand-500'
                  } focus:ring-2 focus:outline-none transition-colors`}
                  placeholder="Enter your password"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-surface-300 dark:border-surface-600 bg-white dark:bg-[#1c1c1e] text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm text-surface-600 dark:text-surface-400">Remember me</span>
              </label>
              <Link to="#" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
