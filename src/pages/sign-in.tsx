// @mui
// hooks
import { Link as RouterLink } from 'react-router-dom';

import { Box, Link, Typography } from '@mui/material';

import AuthSocial from '../sections/auth/AuthSocial';
import { SignInForm } from '../sections/auth/sign-in';

// ----------------------------------------------------------------------

export default function Login() {

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} component={RouterLink} to="/register">
            Get started
          </Link>
        </Typography>
      </Box>
      <AuthSocial />
      <SignInForm />
    </>
  );
}
