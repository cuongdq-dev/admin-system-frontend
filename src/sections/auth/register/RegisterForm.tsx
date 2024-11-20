import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// @mui
import { LoadingButton } from '@mui/lab';
import { Link, Stack, IconButton, Typography, InputAdornment } from '@mui/material';

// components

import { Iconify } from '../../../components/iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
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

  const onSubmit = async () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="firstName" label="First name" />
        <RHFTextField name="lastName" label="Last name" />
        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
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
          Register
        </LoadingButton>
        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
          By registering, I agree to Minimal&nbsp;
          <Link underline="always" color="text.primary" href="#">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link underline="always" color="text.primary" href="#">
            Privacy Policy
          </Link>
          .
        </Typography>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link variant="subtitle2" to="/sign-in" component={RouterLink}>
            Login
          </Link>
        </Typography>
      </Stack>
    </FormProvider>
  );
}
