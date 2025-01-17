// form
// @mui
import type { AutocompleteProps, TextFieldProps } from '@mui/material';

import { Controller, useFormContext } from 'react-hook-form';

import { Autocomplete, Checkbox, Chip, IconButton, InputAdornment, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Iconify } from '../iconify';
import Editor from '../rich-editor/editor';

// ----------------------------------------------------------------------

interface RHFTextFieldProps {
  name: string;
}

export const RHFTextField = ({ name, ...other }: RHFTextFieldProps & TextFieldProps) => {
  const { control, setValue, clearErrors } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            {...field}
            fullWidth
            onChange={(event) => {
              setValue(name, event.target.value, { shouldDirty: true });
              clearErrors(name);
            }}
            onBlur={(event) => {
              setValue(name, event.target.value.trim(), { shouldDirty: true });
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
  const { control, setValue, clearErrors } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type={showPassword ? 'text' : 'password'}
          error={!!error}
          onChange={(event) => {
            if (field.value !== event.target.value) {
              setValue(name, event.target.value, { shouldDirty: true }); // Set value only if it's changed
              clearErrors(name);
            }
          }}
          onBlur={(event) => {
            if (field.value !== event.target.value.trim()) {
              setValue(name, event.target.value.trim(), { shouldDirty: true });
            }
          }}
          value={field.value}
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

interface RHFAutocompleteProps extends AutocompleteProps<any, boolean, boolean, boolean> {
  name: string;
  options: any[];
  loading?: boolean;
}
export const RHFAutocomplete = ({ name, loading = false, ...other }: RHFAutocompleteProps) => {
  const { control, setValue, clearErrors } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur } }) => {
        return (
          <Autocomplete
            sx={{ width: '100%', border: 'none', boxShadow: 'none' }}
            multiple
            id={name}
            disableClearable
            disableCloseOnSelect
            disabled={loading}
            onBlur={(event) => {
              onBlur();
              clearErrors(name);
            }}
            onChange={(event, newValue) => {
              setValue(name, newValue, { shouldDirty: true });
            }}
            getOptionLabel={(option) => option.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderTags={(tagValue, getTagProps) => {
              return (
                <>
                  {tagValue.map((option, index) => (
                    <Chip label={option.title} {...getTagProps({ index })} deleteIcon={<></>} />
                  ))}
                </>
              );
            }}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  <Checkbox
                    icon={<Iconify icon="bx:checkbox" />}
                    checkedIcon={<Iconify icon="mingcute:checkbox-fill" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.title}
                </li>
              );
            }}
            {...other}
          />
        );
      }}
    />
  );
};

interface RHFEditorProps {
  loading?: boolean;
  name: string;
  defaultValue?: string;
}
export const RHFEditor = ({ name, loading = false, defaultValue, ...other }: RHFEditorProps) => {
  const editorRef = useRef<any>();
  const { control, setValue, resetField } = useFormContext();
  useEffect(() => {
    if (defaultValue) {
      resetField(name);
    }
  }, [defaultValue, name, setValue]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => {
        return (
          <Editor
            ref={editorRef}
            contents={defaultValue}
            onSave={() => {
              const content = editorRef.current.editor.getContents();
              setValue(name, content, { shouldDirty: true });
            }}
            onChange={(contents: string) => {
              setValue(name, contents, { shouldDirty: true });
            }}
          />
        );
      }}
    />
  );
};
