import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  requireEmailVerified?: boolean; // new optional prop
}

const ProtectedRoute = ({
  children,
  adminOnly = false,
  requireEmailVerified = true, // default true for most protected routes
}: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-lg">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.warn('[ProtectedRoute] User not logged in - redirecting to signin');
    return <Navigate to="/signin" replace />;
  }

  // Check email verification only if required
  if (requireEmailVerified && !user.emailVerified) {
    console.warn('[ProtectedRoute] Email not verified - redirecting to verify page');
    return <Navigate to="/verify" replace />;
  }

  if (adminOnly && !isAdmin) {
    console.warn('[ProtectedRoute] Access denied - non-admin user tried to access admin-only route');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
