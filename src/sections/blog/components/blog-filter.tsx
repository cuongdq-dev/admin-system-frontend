import { LoadingButton } from '@mui/lab';
import { Grid, TextField, Typography, useColorScheme } from '@mui/material';
import Box from '@mui/material/Box';
import { t } from 'i18next';
import { RHFMultiCheckbox } from 'src/components/hook-form';
import { RHFAutocomplete } from 'src/components/hook-form/RHFTextField';
import { TableFilter } from 'src/components/table';
import { LanguageKey } from 'src/constants';
import { usePageStore } from 'src/store/page';
import { useSettingStore } from 'src/store/setting';
import { varAlpha } from 'src/theme/styles';
import { useShallow } from 'zustand/react/shallow';

// ----------------------------------------------------------------------

type Props = { storeName: string };

export function BlogFilter(props: Props) {
  const { storeName } = props;
  const { meta } = usePageStore(useShallow((state) => ({ ...state.dataStore![storeName]?.list })));
  const { categories, sites } = useSettingStore(useShallow((state) => ({ ...state.dropdown })));
  const { mode } = useColorScheme();

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
          return {
            limit: values?.limit?.id,
            page: values?.page?.id,
            site_id: values?.site?.id,
            status: values?.status?.toString(),
            categories_id:
              values?.categories?.length > 0
                ? values?.categories?.map((cate?: Record<string, any>) => cate?.id)
                : undefined,
          };
        }}
        render={({ isSubmitting, defaultValues }) => (
          <>
            <RHFAutocomplete
              id="site"
              multiple={false}
              name="site"
              defaultValue={sites?.find((site) => site.id == defaultValues?.site_id)}
              options={sites || []}
              renderInput={(params) => {
                return <TextField {...params} margin="normal" label={'Site'} />;
              }}
            />

            <RHFAutocomplete
              id="categories"
              disableCloseOnSelect
              name="categories"
              options={categories || []}
              defaultValue={defaultValues?.categories_id?.split(',').map((cate: string) => {
                const value = categories?.find((c) => c.id == cate);
                return value;
              })}
              renderInput={(params) => {
                return <TextField {...params} margin="normal" label={'Categories'} />;
              }}
            />

            <Box
              sx={(theme) => {
                return {
                  my: 2,
                  border: 1,
                  borderColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
                  borderRadius: theme.spacing(2),
                  display: 'flex',
                  position: 'relative',
                  padding: theme.spacing(4),
                };
              }}
            >
              <Typography
                sx={(theme) => {
                  return {
                    position: 'absolute',
                    top: -12,
                    left: 20,
                    alignItems: 'center',
                    fontSize: 14,
                    borderRadius: theme.vars.shape.borderRadius,
                    paddingX: 1,
                    fontWeight: theme.typography.fontWeightBold,
                    color:
                      mode === 'dark'
                        ? theme.vars.palette.grey[800]
                        : theme.vars.palette.common.white,
                    backgroundColor: theme.vars.palette.text.primary,
                  };
                }}
              >
                Status
              </Typography>
              <Box component={'div'} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <RHFMultiCheckbox
                  name="status"
                  control={<></>}
                  defaultValue={
                    Array.isArray(defaultValues?.status)
                      ? defaultValues?.status
                      : defaultValues?.status?.split(',') || []
                  }
                  options={[
                    { value: 'NEW', label: 'NEW' },
                    { value: 'DRAFT', label: 'DRAFT' },
                    { value: 'PUBLISHED', label: 'PUBLISHED' },
                    { value: 'DELETED', label: 'DELETED' },
                  ]}
                  label="Status"
                />
              </Box>
            </Box>

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
