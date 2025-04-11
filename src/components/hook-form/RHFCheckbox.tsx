// form
// @mui
import type { FormControlLabelProps } from '@mui/material';

import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox, FormGroup, FormControlLabel } from '@mui/material';

// ----------------------------------------------------------------------

interface RHFCheckboxProps {
  name: string;
  label: React.ReactNode;
}

export const RHFCheckbox = ({ name, ...other }: RHFCheckboxProps & FormControlLabelProps) => {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      {...other}
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            return (
              <Checkbox {...field} defaultChecked={other.defaultChecked} checked={other.checked} />
            );
          }}
        />
      }
    />
  );
};

// ----------------------------------------------------------------------

interface RHFMultiCheckboxProps {
  name: string;
  options: { value: string; label: string }[];
}

export const RHFMultiCheckbox = ({
  name,
  options,
  ...other
}: RHFMultiCheckboxProps & FormControlLabelProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={other.defaultValue} // Luôn đảm bảo đây là array
      render={({ field }) => {
        const currentValue: string[] = field.value || [];

        return (
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                {...other}
                key={option.value}
                control={
                  <Checkbox
                    checked={currentValue?.includes(option.value)}
                    onChange={(event, checked) => {
                      const updatedValues = checked
                        ? [...currentValue, option.value]
                        : currentValue?.filter((value) => value !== option.value);
                      field.onChange(updatedValues);
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
        );
      }}
    />
  );
};
