import { Box } from '@mui/material';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { getCookie } from 'src/utils/cookies';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const isAuthenticated = getCookie('token');
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
  return <Box sx={{ height: '100%' }}>{children}</Box>;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = getCookie('token');
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
