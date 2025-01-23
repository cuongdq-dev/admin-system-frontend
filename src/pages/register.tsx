import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { LanguageKey } from 'src/constants';

import { RegisterForm } from 'src/sections/auth/register';

export const Register = () => {
  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">{t(LanguageKey.signup.title)}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t(LanguageKey.signup.description)}
        </Typography>
      </Box>
      <RegisterForm />
    </>
  );
};
