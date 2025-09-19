import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Prevent clipboard paste issues that might cause "pasted image" popup
  const handlePaste = (e) => {
    // Allow normal text pasting but prevent any image/file paste
    const clipboardData = e.clipboardData || window.clipboardData;
    const items = clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        toast.warning('Image pasting is not allowed in login fields');
        return;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clear any previous errors
      console.log('Attempting admin login with:', { email: formData.email });
      
      const result = await login(formData.email, formData.password);
      
      console.log('Login result:', result);
      
      if (result.success) {
        if (result.user.role !== 'admin') {
          toast.error('Access denied. Admin credentials required.');
          return;
        }
        
        toast.success('Admin login successful!');
        // Navigate to admin dashboard
        navigate('/admin/dashboard');
      } else {
        // Handle login failure
        toast.error(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Admin Access</h2>
            <p className="mt-2 text-gray-600">
              Sign in to access the administrative dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                onPaste={handlePaste}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Enter admin email"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                onPaste={handlePaste}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              } transition-colors`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In to Admin Panel'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Not an admin?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                User Login
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <Link
                to="/"
                className="hover:text-primary-600 transition-colors"
              >
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;