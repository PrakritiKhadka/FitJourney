import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/user';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth, isLoading } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/LoginPage" replace />;
  }

  return children;
};

export default ProtectedRoute;