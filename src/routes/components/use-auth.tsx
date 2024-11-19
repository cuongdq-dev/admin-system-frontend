import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from 'src/utils/cookies';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = getCookie('token');
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }
  return <>{children}</>;
};


export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = getCookie('token');
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
