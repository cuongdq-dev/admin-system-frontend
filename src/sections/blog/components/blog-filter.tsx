import { Grid, TextField, Typography, useColorScheme } from '@mui/material';
import Box from '@mui/material/Box';
import { t } from 'i18next';

import { LoadingButton } from '@mui/lab';
import { PATH_DROPDOWN } from 'src/api-core/path';
import { RHFAutocomplete, RHFAutocompleteWithApi } from 'src/components/hook-form/RHFTextField';
import { TableFilter } from 'src/components/table';
import { LanguageKey } from 'src/constants';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';

// ----------------------------------------------------------------------

type Props = { storeName: string };

export function BlogFilter(props: Props) {
  const { storeName } = props;
  const { meta } = usePageStore(useShallow((state) => ({ ...state.dataStore![storeName]?.list })));
  return (
    <Box
      display="flex"
      alignItems="center"
      flexWrap="wrap-reverse"
      justifyContent="space-between"
      sx={(theme) => {
        return {
          border: `1px solid ${theme.vars.palette.divider}`,
          borderRadius: 2,
          mb: 2,
          px: 2,
          py: 1,
        };
      }}
    >
      <Box>
        {meta && Number(meta?.totalItems) > 0 && (
          <Typography variant="inherit" color={'grey'} noWrap>
            {Number(meta?.itemsPerPage) * Number(meta?.currentPage) -
              Number(meta?.itemsPerPage) +
              1}
            -{Number(meta?.itemsPerPage) * Number(meta?.currentPage)}{' '}
            {t(LanguageKey.common.of).toLocaleLowerCase()} {meta?.totalItems}
          </Typography>
        )}{' '}
      </Box>
      <TableFilter
        convertValue={(values) => {
          console.log(values);
          return {
            limit: values?.limit?.id,
            page: values?.page?.id,
            site_id: values?.site?.id,
            site_name: values?.site?.title,
            type: values?.type?.toString() || undefined,
          };
        }}
        render={({ isSubmitting, defaultValues }) => (
          <>
            <RHFAutocompleteWithApi
              id="site"
              multiple={false}
              name="site"
              baseUrl={PATH_DROPDOWN + '/sites'}
              defaultValue={
                defaultValues?.site_id
                  ? { id: defaultValues?.site_id, title: defaultValues?.site_name }
                  : undefined
              }
              options={[]}
              renderInput={(params) => {
                return <TextField {...params} margin="normal" label={'Site'} />;
              }}
            />

            <RHFAutocompleteWithApi
              id="categories"
              disableCloseOnSelect
              name="categories"
              baseUrl={PATH_DROPDOWN + '/categories'}
              defaultValue={
                defaultValues?.site_id
                  ? { id: defaultValues?.site_id, title: defaultValues?.site_name }
                  : undefined
              }
              options={[]}
              renderInput={(params) => {
                return <TextField {...params} margin="normal" label={'Categories'} />;
              }}
            />

            <Grid sx={{ width: '100%' }} container columns={2} spacing={1}>
              <Grid item md={1} sx={{ width: '100%' }}>
                <RHFAutocomplete
                  id="limit"
                  fullWidth
                  multiple={false}
                  name="limit"
                  defaultValue={{
                    id: meta?.itemsPerPage?.toString(),
                    title: meta?.itemsPerPage?.toString(),
                  }}
                  options={[
                    { id: '10', title: '10' },
                    { id: '20', title: '20' },
                    { id: '30', title: '30' },
                    { id: '50', title: '50' },
                    { id: '100', title: '100' },
                    { id: '200', title: '200' },
                    { id: '500', title: '500' },
                  ]}
                  renderInput={(params) => {
                    return <TextField {...params} margin="normal" label={'Page Size'} />;
                  }}
                />
              </Grid>
              <Grid item md={1} sx={{ width: '100%' }}>
                <RHFAutocomplete
                  id="page"
                  fullWidth
                  multiple={false}
                  name="page"
                  defaultValue={{
                    id: meta?.currentPage?.toString(),
                    title: `Page ${meta?.currentPage}`,
                  }}
                  options={Array.from({ length: meta?.totalPages || 0 }, (_, index) => ({
                    id: (index + 1).toString(), // hoặc để là số cũng được
                    title: `Page ${index + 1}`,
                  }))}
                  renderInput={(params) => {
                    return <TextField {...params} margin="normal" label={'Page Number'} />;
                  }}
                />
              </Grid>
            </Grid>

            <Box mt={2}>
              <LoadingButton loading={isSubmitting} type="submit" fullWidth variant="contained">
                {t(LanguageKey.button.submit)}
              </LoadingButton>
            </Box>
          </>
        )}
      ></TableFilter>
    </Box>
  );
}
