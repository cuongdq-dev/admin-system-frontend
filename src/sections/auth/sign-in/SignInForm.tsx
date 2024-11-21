import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Link, Stack } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

// import { postApi } from 'src/api-core';
// import { PATH_SIGN_IN } from 'src/api-core/path';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SIGN_IN } from 'src/api-core/path';
import { FormProvider, RHFCheckbox, RHFTextField } from '../../../components/hook-form';
import { Iconify } from '../../../components/iconify';

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

  const onSubmit = async (values: { email?: string; password?: string; remember?: boolean }) => {
    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_SIGN_IN,
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
      },
    });
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
