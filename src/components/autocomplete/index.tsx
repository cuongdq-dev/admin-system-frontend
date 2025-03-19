import { Autocomplete, AutocompleteProps, Checkbox, Chip, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { invokeRequest, HttpMethod } from 'src/api-core';
import { Iconify } from '../iconify';

interface AutocompleteComponentWithUrlProps
  extends AutocompleteProps<any, boolean, boolean, boolean> {
  name: string;
  baseUrl: string;
  loading?: boolean;
}
export const AutocompleteComponentWithUrl = ({
  name,
  baseUrl,
  onChange,
  loading,
  ...props
}: AutocompleteComponentWithUrlProps) => {
  const [options, setOptions] = useState<any[] | undefined>([]);
  const [isLoading, setLoading] = useState(loading);

  return (
    <Autocomplete
      sx={{ width: '100%', border: 'none', boxShadow: 'none' }}
      id={name}
      disablePortal
      loading={isLoading}
      onFocus={() => {
        setLoading(true);
        (!options || options?.length == 0) &&
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
      }}
      onChange={onChange}
      getOptionLabel={(option) => option.title}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loadingText={<CircularProgress size={20} />}
      noOptionsText="No options available"
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<Iconify icon="bx:checkbox" />}
            checkedIcon={<Iconify icon="mingcute:checkbox-fill" />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.title}
        </li>
      )}
      {...props}
      options={options!}
    />
  );
};

interface RHFAutocompleteProps extends AutocompleteProps<any, boolean, boolean, boolean> {
  options: any[];
  loading?: boolean;
}
export const AutocompleteComponent = ({ loading = false, ...other }: RHFAutocompleteProps) => {
  return (
    <Autocomplete
      sx={{ width: '100%', border: 'none', boxShadow: 'none' }}
      disableClearable
      disabled={loading}
      // onChange={(event, newValue) => {}}
      getOptionLabel={(option) => option.title}
      isOptionEqualToValue={(option, value) => option.id === value.id}
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
};
