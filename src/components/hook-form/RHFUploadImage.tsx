import type { FormControlLabelProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { ImageUpload } from '../image/upload-thumbnail';

// ----------------------------------------------------------------------

interface RHFUploadProps {
  name: string;
}

export const RHFUpload = ({ name, defaultValue }: RHFUploadProps & FormControlLabelProps) => {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value: file } }) => {
        const fileUrl = file instanceof File ? URL.createObjectURL(file) : file;

        return (
          <ImageUpload
            value={fileUrl}
            defaultValue={defaultValue as File | string}
            onChange={(value) => {
              setValue(name, value, { shouldDirty: true });
            }}
          />
        );
      }}
    />
  );
};
