import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();

  // While auth state is loading, show a spinner or loading message
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-lg">
        Loading...
      </div>
    );
  }

  // If user is not logged in, redirect to signin
  if (!user) {
    console.warn('User not logged in - redirecting to signin');
    return <Navigate to="/signin" replace />;
  }

  // If adminOnly route and user is not admin, redirect to home
  if (adminOnly && !isAdmin) {
    console.warn('Access denied: user is not admin - redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Otherwise render the children (protected content)
  return <>{children}</>;
};

export default ProtectedRoute;
