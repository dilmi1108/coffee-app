import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCoffee, FaUser, FaEnvelope, FaLock, FaPhone, FaExclamationCircle } from 'react-icons/fa';
import { useAuthStore } from '../store/useAuthStore';

export const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const res = await register(name, email, password, phone);
    if (res.success) {
      setSuccessMsg('Account created successfully! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-6 py-12 md:px-8 bg-coffee-50/30">
      <div className="w-full max-w-md rounded-3xl bg-white border border-coffee-100 p-8 shadow-lg">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center mb-6">
          <div className="rounded-full bg-coffee-100 p-3.5 text-coffee-800">
            <FaCoffee className="text-3xl" />
          </div>
          <h2 className="font-display text-2xl font-bold text-coffee-950">Create Account</h2>
          <p className="text-xs text-coffee-600">Join the Kopi Kade club today</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-800 border border-red-150 mb-6 text-left">
            <FaExclamationCircle className="text-lg shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-xs font-medium text-green-800 border border-green-150 mb-6 text-left">
            <span className="shrink-0 text-lg">✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-coffee-800">Full Name *</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
              <input
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-coffee-200 bg-white py-3 pl-11 pr-4 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-coffee-800">Email Address *</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-coffee-200 bg-white py-3 pl-11 pr-4 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-coffee-800">Phone Number</label>
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
              <input
                type="tel"
                placeholder="+94 77 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-coffee-200 bg-white py-3 pl-11 pr-4 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-coffee-800">Password *</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
              <input
                type="password"
                placeholder="At least 6 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-coffee-200 bg-white py-3 pl-11 pr-4 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-coffee-800">Confirm Password *</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
              <input
                type="password"
                placeholder="Confirm password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-coffee-200 bg-white py-3 pl-11 pr-4 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500"
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
                Creating account...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className="text-xs text-coffee-600 mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-coffee-800 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
