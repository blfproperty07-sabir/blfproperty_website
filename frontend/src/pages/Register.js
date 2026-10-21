import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

const Register = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'buyer',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      toast.error('Enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    const { confirmPassword, ...userData } = formData;
    try {
      await authService.register({
        ...userData,
        name: userData.name.trim(),
        email: userData.email.trim(),
        phone: userData.phone.trim() || undefined,
      });
      toast.success('Your account is ready. Please sign in.');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setLoading(true);
    const result = await loginWithGoogle(credential);
    setLoading(false);

    if (result.success) {
      toast.success('Your account is ready.');
      navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/', { replace: true });
    } else {
      toast.error(result.error || 'Google sign-up failed. Please try again.');
    }
  };

  return (
    <AuthPageLayout
      mode="register"
      title="Create your account"
      subtitle="Join BLF Property to discover homes and connect with owners."
    >
      <div className="space-y-5">
        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={(message) => toast.error(message)}
          disabled={loading}
        />

        <div className="flex items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">or sign up with email</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
              <div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  minLength={2}
                  maxLength={50}
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-950/10"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-950/10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone <span className="font-normal text-slate-400">(optional)</span></label>
              <div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-950/10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="mb-2 block text-sm font-semibold text-slate-700">I want to</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-950/10"
              >
                <option value="buyer">Find a property</option>
                <option value="seller">List my property</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-950/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Type it again"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-950/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-700"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#101b3d] px-4 text-sm font-semibold text-white transition hover:bg-blue-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating your account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-rose-700 no-underline hover:text-rose-800">Sign in</Link>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default Register;
