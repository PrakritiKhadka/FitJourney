import React from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/user';

const ProtectedRoute = ({ children }) => {
  const { user, token } = useUserStore();
  
  if (!user || !token) {
    // Redirect to login if not authenticated
    return <Navigate to="/LoginPage" replace />;
  }
  
  return children;
};

export default ProtectedRoute;