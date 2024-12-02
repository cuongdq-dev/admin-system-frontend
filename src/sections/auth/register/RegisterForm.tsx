import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Link, Stack, Typography } from '@mui/material';

// components

import { t } from 'i18next';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_REGISTER } from 'src/api-core/path';
import { LanguageKey } from 'src/constants';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { Iconify } from '../../../components/iconify';

// ----------------------------------------------------------------------

export function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('User name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    name: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values: { email?: string; password?: string; remember?: boolean }) => {
    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_REGISTER,
      params: values,
      onHandleError: (response) => {
        if (response?.errors && typeof response.errors === 'object') {
          Object.keys(response.errors).forEach((key) => {
            methods.setError(key as any, {
              type: 'server',
              message: response?.errors![key],
            });
          });
        } else {
          console.error('Unexpected error format:', response);
        }
      },
      onSuccess(res) {
        navigate('/sign-in', { replace: true });
      },
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="name" label={t(LanguageKey.signup.usernameItem)} />
        <RHFTextField name="email" label={t(LanguageKey.signup.emailItem)} />

        <RHFTextField
          name="password"
          label={t(LanguageKey.signup.passwordItem)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {t(LanguageKey.button.register)}
        </LoadingButton>
        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
          {t(LanguageKey.signup.agreeTo)}&nbsp;
          <Link underline="always" color="text.primary" href="#">
            {t(LanguageKey.signup.termsOfService)}
          </Link>{' '}
          {t(LanguageKey.common.and)}{' '}
          <Link underline="always" color="text.primary" href="#">
            {t(LanguageKey.signup.privacyPolicy)}
          </Link>
          .
        </Typography>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          {t(LanguageKey.signin.allreadyAccount)}{' '}
          <Link variant="subtitle2" to="/sign-in" component={RouterLink}>
            {t(LanguageKey.button.login)}
          </Link>
        </Typography>
      </Stack>
    </FormProvider>
  );
}
