import type { AutocompleteProps, TextFieldProps } from '@mui/material';

import { Controller, useFormContext } from 'react-hook-form';

import { Autocomplete, Checkbox, Chip, IconButton, InputAdornment, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import slugify from 'slugify';
import { HttpMethod, invokeRequest } from 'src/api-core';
import 'suneditor/dist/css/suneditor.min.css';
import { Iconify } from '../iconify';
import Editor from '../rich-editor/editor';

interface RHFTextFieldProps {
  name: string;
  copy?: boolean;
}

export const RHFTextField = ({
  name,
  copy = false,
  ...other
}: RHFTextFieldProps & TextFieldProps) => {
  const { control, formState, setValue, clearErrors, getValues } = useFormContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const value = getValues(name) || other.defaultValue;
    navigator.clipboard.writeText(value);
    setCopied(true);
  };

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
            InputProps={{
              endAdornment: copy ? (
                <InputAdornment position="end">
                  <Iconify
                    sx={{ cursor: 'copy' }}
                    color={copied ? 'green' : 'default'}
                    onClick={handleCopy}
                    icon="mynaui:copy"
                  />
                </InputAdornment>
              ) : undefined,
            }}
            {...other}
          />
        );
      }}
    />
  );
};

export const RHFTextFieldWithSlug = ({ name, ...other }: RHFTextFieldProps & TextFieldProps) => {
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
              clearErrors('slug');
            }}
            onBlur={(event) => {
              const value = event.target.value.trim();
              setValue(name, value, { shouldDirty: true });
              setValue(
                'slug',
                slugify(value, {
                  lower: true,
                  trim: true,
                  strict: true,
                  locale: 'vi',
                })
              );
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
export const RHFAutocomplete = ({
  name,
  loading = false,
  multiple = true,
  ...other
}: RHFAutocompleteProps) => {
  const { control, setValue, clearErrors } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={other.defaultValue ?? (multiple ? [] : null)} // ✅ xử lý defaultValue cho single select
      render={({ field, fieldState: { error } }) => {
        const { onBlur, value } = field;

        return (
          <Autocomplete
            {...field}
            id={name}
            disableCloseOnSelect={multiple}
            multiple={multiple} // ✅ dùng biến
            freeSolo={multiple}
            filterSelectedOptions={multiple}
            disabled={loading || other.disabled}
            options={other.options}
            value={value ?? (multiple ? [] : null)}
            onBlur={() => {
              onBlur();
              clearErrors(name);
            }}
            limitTags={3}
            onChange={(_, newValue) => {
              if (multiple) {
                const formattedValue = newValue.map((val: any) =>
                  typeof val === 'string' ? { title: val } : val
                );
                setValue(name, formattedValue, { shouldDirty: true });
              } else {
                const formattedValue =
                  typeof newValue === 'string' ? { title: newValue } : newValue;
                setValue(name, formattedValue, { shouldDirty: true });
              }
            }}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : (option?.title ?? '')
            }
            isOptionEqualToValue={(option, value) =>
              (option?.id && value?.id && option.id === value.id) ||
              (typeof option === 'string' && typeof value === 'string' && option === value) ||
              (typeof option === 'string' && typeof value === 'object' && option === value.title) ||
              (typeof option === 'object' && typeof value === 'string' && option.title === value)
            }
            renderTags={(tagValue, getTagProps) =>
              multiple
                ? tagValue.map((option, index) => (
                    <Chip
                      label={typeof option === 'string' ? option : option.title}
                      {...getTagProps({ index })}
                      key={(typeof option === 'string' ? option : option.title) + '_' + index}
                    />
                  ))
                : null
            }
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              const label = typeof option === 'string' ? option : option.title;

              return (
                <li key={key} {...optionProps}>
                  {multiple && (
                    <Checkbox
                      icon={<Iconify icon="bx:checkbox" />}
                      checkedIcon={<Iconify icon="mingcute:checkbox-fill" />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                  )}
                  {label}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={error?.message}
                error={!!error}
                label={other?.title}
              />
            )}
          />
        );
      }}
    />
  );
};

interface RHFAutocompleteWithApiProps extends AutocompleteProps<any, boolean, boolean, boolean> {
  name: string;
  baseUrl: string;
  loading?: boolean;
  dataSource?: any[];
}
export const RHFAutocompleteWithApi = ({
  name,
  baseUrl,
  loading = false,
  dataSource,
  multiple = true,
  defaultValue,
  ...other
}: RHFAutocompleteWithApiProps) => {
  const { control, setValue, clearErrors } = useFormContext();
  const [options, setOptions] = useState<any[] | undefined>(dataSource || []);
  const [defaultValues, setDefaultValues] = useState<any[] | undefined>(
    multiple
      ? options?.filter((o) => defaultValue?.some((val: any) => val?.id === o.id || val === o.id))
      : options?.find((o) => o.id == defaultValue?.id)
  );

  const [isLoading, setLoading] = useState(loading);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setValue(name, defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (!options || Number(options?.length) == 0) {
      setLoading(true);
      invokeRequest({
        baseURL: baseUrl,
        method: HttpMethod.GET,
        onSuccess: (res) => {
          setOptions(res);
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        },
        onHandleError: () => {
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        },
      });
    }
  }, [baseUrl]);

  useEffect(() => {
    if (Number(options?.length) > 0) {
      if (multiple) {
        setDefaultValues(
          options?.filter((o) => defaultValue?.some((val: any) => val?.id === o.id || val === o.id))
        );
      } else {
        setDefaultValues(options?.find((o) => o.id == defaultValue?.id));
      }
    }
  }, [options, defaultValue]);
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValues}
      render={({ field: { onBlur } }) => {
        return (
          <Autocomplete
            defaultValue={defaultValues || {}}
            value={defaultValues || {}}
            sx={{ width: '100%', border: 'none', boxShadow: 'none' }}
            id={name}
            loading={isLoading}
            multiple={multiple}
            disablePortal
            onBlur={() => {
              onBlur();
              clearErrors(name);
            }}
            onChange={(_, newValue) => {
              setDefaultValues(newValue);
              setValue(name, newValue, { shouldDirty: true });
            }}
            getOptionLabel={(option) => {
              return option.title || '';
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loadingText="Loading options..."
            noOptionsText="No options available"
            renderTags={(tagValue, getTagProps) => {
              const displayedOptions = showAll ? tagValue : tagValue?.slice(0, 3);
              return (
                <>
                  {displayedOptions.map((option, index) => (
                    <Chip
                      label={option.title}
                      {...getTagProps({ index })}
                      key={option?.title + '_' + index}
                      deleteIcon={<></>}
                    />
                  ))}

                  {tagValue?.length > 3 && !showAll && (
                    <Chip
                      label={'+' + Number(tagValue.length - 3)}
                      deleteIcon={<></>}
                      onClick={() => setShowAll(true)}
                    />
                  )}
                  {tagValue?.length > 3 && showAll && (
                    <Chip
                      label={'- Collapse'}
                      deleteIcon={<></>}
                      onClick={() => setShowAll(false)}
                    />
                  )}
                </>
              );
            }}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key + optionProps.id} {...optionProps}>
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
            options={options!}
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
  disabled?: boolean;
}
export const RHFEditor = ({ name, disabled, loading = false, defaultValue }: RHFEditorProps) => {
  const editorRef = useRef<any>();

  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      disabled={disabled}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => {
        return (
          <Editor
            ref={editorRef}
            contents={value}
            disabled={disabled}
            onSave={() => {
              const content = editorRef.current.editor.getContents();
              setValue(name, content, { shouldDirty: true });
            }}
            onBlur={(contents: string) => {
              setValue(name, contents, { shouldDirty: true });
            }}
          />
        );
      }}
    />
  );
};
