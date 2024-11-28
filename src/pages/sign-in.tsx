// @mui
// hooks
import { Link as RouterLink } from 'react-router-dom';

import { Box, Link, Typography } from '@mui/material';

import AuthSocial from '../sections/auth/AuthSocial';
import { SignInForm } from '../sections/auth/sign-in';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

export default function Login() {
  const { t } = useTranslation();

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">{t('signin_title')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('no_account')}
          <Link variant="subtitle2" sx={{ ml: 0.5 }} component={RouterLink} to="/register">
            {t('get_started')}
          </Link>
        </Typography>
      </Box>
      <AuthSocial />
      <SignInForm />
    </>
  );
}
