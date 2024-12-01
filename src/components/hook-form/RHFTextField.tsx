// form
// @mui
import type { TextFieldProps } from '@mui/material';

import { Controller, useFormContext } from 'react-hook-form';

import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

interface RHFTextFieldProps {
  name: string;
}

export const RHFTextField = ({ name, ...other }: RHFTextFieldProps & TextFieldProps) => {
  const { control, setValue } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={other.defaultValue}
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            {...field}
            fullWidth
            onBlur={(event) => {
              setValue(name, event.target.value.trim());
            }}
            value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
            error={!!error}
            helperText={error?.message}
            {...other}
          />
        );
      }}
    />
  );
};

export const PasswordText = ({ name, ...other }: RHFTextFieldProps & TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      defaultValue={other.defaultValue}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type={showPassword ? 'text' : 'password'}
          error={!!error}
          onBlur={(event) => {
            setValue(name, event.target.value.trim());
          }}
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          helperText={error?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...other}
        />
      )}
    />
  );
};
