import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  // If loading user details, show a small loader
  if (loading && !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-coffee-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-coffee-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};
