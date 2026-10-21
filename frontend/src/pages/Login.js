import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const finishSignIn = (user) => {
    toast.success('You are signed in.');
    navigate(user.role === 'admin' ? '/admin/dashboard' : '/', { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const result = await login(formData.email.trim(), formData.password);
    setLoading(false);

    if (result.success) {
      finishSignIn(result.user);
    } else {
      toast.error(result.error || 'Unable to sign in. Check your details and try again.');
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setLoading(true);
    const result = await loginWithGoogle(credential);
    setLoading(false);

    if (result.success) {
      finishSignIn(result.user);
    } else {
      toast.error(result.error || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <AuthPageLayout
      mode="login"
      title="Sign in to BLF"
      subtitle="Welcome back. Enter your details to continue your property journey."
    >
      <div className="space-y-6">
        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={(message) => toast.error(message)}
          disabled={loading}
        />

        <div className="flex items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">or with email</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                placeholder="you@example.com"
                className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-950/10"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                placeholder="Enter your password"
                className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-950/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#101b3d] px-4 text-sm font-semibold text-white transition hover:bg-blue-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing you in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          New to BLF Property?{' '}
          <Link to="/register" className="font-bold text-rose-700 no-underline hover:text-rose-800">Create an account</Link>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default Login;
