import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem('role');
  const isAuthenticated = !!localStorage.getItem('accessToken');

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
