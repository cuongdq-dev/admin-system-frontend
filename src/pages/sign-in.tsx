import { Box, Link, Typography } from '@mui/material';
import { t } from 'i18next';
import { Link as RouterLink } from 'react-router-dom';
import { LanguageKey } from 'src/constants';
import AuthSocial from '../sections/auth/AuthSocial';
import { SignInForm } from '../sections/auth/sign-in';

export default function Login() {
  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">{t(LanguageKey.signin.title)}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t(LanguageKey.signin.noAccount)}
          <Link variant="subtitle2" sx={{ ml: 0.5 }} component={RouterLink} to="/register">
            {t(LanguageKey.signin.getStarted)}
          </Link>
        </Typography>
      </Box>
      <AuthSocial />
      <SignInForm />
    </>
  );
}
