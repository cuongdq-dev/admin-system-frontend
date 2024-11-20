// form
// @mui
import type { FormControlLabelProps} from '@mui/material';

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
          render={({ field }) => <Checkbox {...field} checked={field.value} />}
        />
      }
    />
  );
};

// ----------------------------------------------------------------------

interface RHFMultiCheckboxProps {
  name: string;
  options: any[];
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
      render={({ field }) => {
        const onSelected = (option: any) =>
          field.value.includes(option)
            ? field.value.filter((value: any) => value !== option)
            : [...field.value, option];

        return (
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                {...other}
                key={option.value}
                control={
                  <Checkbox
                    checked={field.value.includes(option.value)}
                    onChange={() => field.onChange(onSelected(option.value))}
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
