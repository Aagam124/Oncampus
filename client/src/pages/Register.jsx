import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { useToast } from '@/hooks/useToast';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    university: z.string().min(1, 'University is required'),
    department: z.string().optional(),
    year: z.string().optional(),
    terms: z.boolean().refine((v) => v === true, { message: 'You must accept the terms' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      university: '',
      department: '',
      year: '',
      terms: false,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError('');
    try {
      const { confirmPassword, terms, ...payload } = data;
      if (payload.year && payload.year !== '') {
        const parsedYear = parseInt(payload.year, 10);
        if (!isNaN(parsedYear)) {
          payload.year = parsedYear;
        } else {
          delete payload.year;
        }
      } else {
        delete payload.year;
      }
      await registerUser(payload);
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-surface-900">
              On<span className="text-brand-600">Campus</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-surface-900">Create your account</h1>
          <p className="mt-1 text-surface-500">Join the student marketplace today</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6 sm:p-8">
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Account Section */}
            <div>
              <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">
                Account Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-surface-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.firstName ? 'border-red-300' : 'border-surface-300'} focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors`}
                    placeholder="John"
                    {...register('firstName')}
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-surface-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.lastName ? 'border-red-300' : 'border-surface-300'} focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors`}
                    placeholder="Doe"
                    {...register('lastName')}
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-300' : 'border-surface-300'} focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors`}
                placeholder="you@university.edu"
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-2.5 pr-10 rounded-lg border ${errors.password ? 'border-red-300' : 'border-surface-300'} focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors`}
                  placeholder="Min. 8 characters"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-700 mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-300' : 'border-surface-300'} focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors`}
                placeholder="Re-enter password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            {/* Academic Section */}
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">
                Academic Info
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-surface-700 mb-1.5">
                    University
                  </label>
                  <input
                    id="university"
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.university ? 'border-red-300' : 'border-surface-300'} focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors`}
                    placeholder="e.g., MIT, Stanford"
                    {...register('university')}
                  />
                  {errors.university && <p className="mt-1 text-xs text-red-500">{errors.university.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-surface-700 mb-1.5">
                      Department
                    </label>
                    <input
                      id="department"
                      className="w-full px-4 py-2.5 rounded-lg border border-surface-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors"
                      placeholder="e.g., Computer Science"
                      {...register('department')}
                    />
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-surface-700 mb-1.5">
                      Year
                    </label>
                    <select
                      id="year"
                      className="w-full px-4 py-2.5 rounded-lg border border-surface-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors"
                      {...register('year')}
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                      <option value="6">6th Year / Postgrad</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
                  {...register('terms')}
                />
                <span className="text-sm text-surface-500">
                  I agree to the{' '}
                  <Link to="#" className="text-brand-600 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="#" className="text-brand-600 hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-surface-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
