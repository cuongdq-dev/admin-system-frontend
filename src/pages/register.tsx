import { Box, Typography } from '@mui/material';
import { RegisterForm } from 'src/sections/auth/register';
import AuthSocial from '../sections/auth/AuthSocial';

export default function Register() {

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Get started absolutely free.</Typography>
        <Typography variant="body2" color="text.secondary">
          Free forever. No credit card needed.
        </Typography>
      </Box>
      <AuthSocial />
      <RegisterForm />
    </>

  );
}
