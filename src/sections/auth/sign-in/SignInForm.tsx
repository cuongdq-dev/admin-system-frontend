import * as Yup from 'yup';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';

import { postApi } from 'src/api-core';
import { PATH_SIGN_IN } from 'src/api-core/path';

import { Iconify } from '../../../components/iconify';
import { RHFCheckbox, FormProvider, RHFTextField } from '../../../components/hook-form';

export type JwtPayload = {
  id: string;
  type: 'ACCESS' | 'REFRESH';
  iat: number;
  exp: number;
};

export const SignInForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const SignInSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: false,
  };

  const methods = useForm({
    resolver: yupResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  console.log(import.meta.env);

  const onSubmit = async (values: { email?: string; password?: string; remember?: boolean }) => {
    await postApi(import.meta.env.VITE_API_URL + PATH_SIGN_IN, JSON.stringify(values))
      .then((res) => {
        const { accessToken, refreshToken, email, name, isActive, avatar } = res;
        const { exp, iat, type } = jwtDecode(accessToken) as JwtPayload;

        const expires = values.remember
          ? {
              expires: new Date(exp * 1000),
            }
          : undefined;
        const loginInfo = { name, email, avatar, exp, type, iat, isActive };
        Cookies.set('user-info', JSON.stringify(loginInfo), expires);
        Cookies.set('token', accessToken, expires);
        Cookies.set('refresh-token', refreshToken, expires);
        navigate('/', { replace: true });
      })
      .catch((e) => {});
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" control={<></>} />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        SignIn
      </LoadingButton>
    </FormProvider>
  );
};
