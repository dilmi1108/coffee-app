import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCoffee, FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import { useAuthStore } from '../store/useAuthStore';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      if (res.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        // Redirect to previous page or home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } else {
      setErrorMsg(res.error || 'Invalid credentials.');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12 md:px-8 bg-coffee-50/30">
      <div className="w-full max-w-md rounded-3xl bg-white border border-coffee-100 p-8 shadow-lg">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center mb-8">
          <div className="rounded-full bg-coffee-100 p-3.5 text-coffee-800">
            <FaCoffee className="text-3xl" />
          </div>
          <h2 className="font-display text-2xl font-bold text-coffee-950">Welcome Back</h2>
          <p className="text-xs text-coffee-600">Sign in to your කෝපි කඩේ account</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-800 border border-red-150 mb-6 text-left">
            <FaExclamationCircle className="text-lg shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-coffee-800">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-coffee-200 bg-white py-3.5 pl-11 pr-4 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-coffee-800">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-semibold text-coffee-700 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-coffee-200 bg-white py-3.5 pl-11 pr-4 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-coffee-700 py-3.5 text-xs font-bold text-white hover:bg-coffee-800 transition shadow-md disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-xs text-coffee-600 mt-8 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-coffee-800 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
