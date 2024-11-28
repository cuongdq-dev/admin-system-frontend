import { Box, Typography } from '@mui/material';

import { RegisterForm } from 'src/sections/auth/register';

import AuthSocial from '../sections/auth/AuthSocial';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation();
  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">{t('signup_title')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('signup_description')}
        </Typography>
      </Box>
      <RegisterForm />
    </>
  );
}
