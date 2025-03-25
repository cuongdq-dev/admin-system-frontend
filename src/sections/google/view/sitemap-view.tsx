import { Box, Chip, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_DROPDOWN, PATH_GOOGLE_SITEMAP_LIST } from 'src/api-core/path';
import { AutocompleteComponentWithUrl } from 'src/components/autocomplete';
import { Iconify } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { fDate, formatStr } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';

export function SiteMapListView() {
  const navigate = useNavigate();

  const storeName = StoreName.GOOGLE_SITEMAP;
  const [siteSelect, setSiteSelect] = useState<{ id: string; title?: string } | undefined | null>(
    new URLSearchParams(location.search).get('site_id')
      ? {
          id: new URLSearchParams(location.search).get('site_id')!,
          title: new URLSearchParams(location.search).get('site_name')!,
        }
      : undefined
  );

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
  };

  const updateUrl = useCallback(
    (newParams: Record<string, string | undefined>) => {
      const queryParams = new URLSearchParams(location.search);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
        else queryParams.delete(key);
      });
      navigate(`?${queryParams.toString()}`, { replace: true });
    },
    [location.search, navigate]
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const siteIdParam = queryParams.get('site_id');
    const siteNameParam = queryParams.get('site_name');
    setSiteSelect({ id: siteIdParam!, title: siteNameParam! });
  }, [window.location.search]);

  const HeadLabel: HeadLabelProps[] = [
    {
      id: 'path',
      label: 'PATH',
      sort: false,
      type: 'custom',
      width: '10%',
      render: ({ row }) => {
        return (
          <Box display="flex" flexDirection="column">
            <Typography
              sx={{ cursor: 'pointer', textWrap: 'nowrap' }}
              onClick={() => window.open(row.path, '_blank')}
            >
              {row.path}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'lastSubmitted',
      label: 'Submitted',
      sort: false,
      type: 'custom',
      render: ({ row }) => {
        return <Typography>{fDate(row.lastSubmitted, formatStr.split.dateTime)}</Typography>;
      },
    },

    {
      id: 'isSitemapsIndex',
      label: 'Index',
      type: 'custom',
      align: 'center',
      sort: true,
      render: ({ row }) => {
        if (row.isSitemapsIndex) return <Iconify icon="ci:checkbox-checked"></Iconify>;
        return <Iconify icon="ci:checkbox-unchecked"></Iconify>;
      },
    },
    {
      id: 'isPending',
      label: 'Pending',
      type: 'custom',
      align: 'center',
      sort: true,
      render: ({ row }) => {
        if (row.isPending)
          return <Chip size="small" variant="outlined" label={'Pending'} color="warning" />;
        return <Chip size="small" variant="outlined" label={'Pass'} color="primary" />;
      },
    },
  ];

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/indexing', title: t(LanguageKey.common.listTitle) }] }}
    >
      <AutocompleteComponentWithUrl
        baseUrl={PATH_DROPDOWN + '/sites'}
        name="site_index"
        multiple={false}
        sx={{ mb: 2 }}
        options={[]}
        defaultValue={siteSelect}
        onChange={(_, value) => {
          if (!value) {
            setSiteSelect(undefined);
            updateUrl({
              site_id: undefined,
              site_name: undefined,
            });
          } else {
            setSiteSelect(value);
            updateUrl({
              site_id: value?.id,
              site_name: value?.title,
              indexStatus: undefined,
              limit: undefined,
              page: undefined,
            });
          }
        }}
        renderInput={(params) => {
          return <TextField {...params} margin="normal" label={t(LanguageKey.site.indexingItem)} />;
        }}
      />

      <TableComponent
        component="TABLE"
        storeName={storeName}
        url={PATH_GOOGLE_SITEMAP_LIST}
        indexCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
      />
    </DashboardContent>
  );
}
