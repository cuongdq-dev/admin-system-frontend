import { TextField, Typography, useColorScheme } from '@mui/material';
import Box from '@mui/material/Box';
import { t } from 'i18next';

import { LoadingButton } from '@mui/lab';
import { PATH_DROPDOWN } from 'src/api-core/path';
import { RHFAutocompleteWithApi } from 'src/components/hook-form/RHFTextField';
import { TableFilter } from 'src/components/table';
import { LanguageKey } from 'src/constants';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';

// ----------------------------------------------------------------------

type Props = { storeName: string };

export function SitemapFilters(props: Props) {
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
