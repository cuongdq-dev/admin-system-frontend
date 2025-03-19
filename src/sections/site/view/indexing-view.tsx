import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { PATH_DROPDOWN, PATH_SITE } from 'src/api-core/path';
import { AutocompleteComponent, AutocompleteComponentWithUrl } from 'src/components/autocomplete';
import { Iconify } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { fDate, formatStr } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';

export function IndexingListView() {
  const storeName = StoreName.SITE_INDEXING;
  const [siteSelect, setSiteSelect] = useState<{ id: string; name?: string } | null>({
    id: new URLSearchParams(location.search).get('site_id')!,
  });

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const siteIdParam = queryParams.get('site_id');
    setSiteSelect({ id: siteIdParam! });
  }, [window.location.search]);

  const HeadLabel: HeadLabelProps[] = [
    {
      id: 'site_name',
      label: t(LanguageKey.site.nameItem),
      sort: false,
      type: 'custom',
      align: 'center',
      width: '10%',
      render: ({ row }) => {
        const postUrl = `${row.site_domain}/bai-viet/${row.post_slug}`;
        const googleSearchUrl = `https://www.google.com/search?q=site:${postUrl}`;

        return (
          <Box display="flex" flexDirection="column">
            <Typography
              variant="caption"
              sx={{ cursor: 'pointer', textDecoration: 'underline', textWrap: 'nowrap' }}
              onClick={() => window.open(postUrl, '_blank')}
            >
              {row.site_name}
            </Typography>

            <Typography
              variant="caption"
              sx={{ cursor: 'pointer', mt: 1, textWrap: 'nowrap' }}
              onClick={() => window.open(googleSearchUrl, '_blank')}
            >
              Google Search
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'post_title',
      label: t(LanguageKey.site.postTitleItem),
      sort: false,
      type: 'custom',
      render: ({ row }) => {
        return <Typography>{row.post_title}</Typography>;
      },
    },

    {
      id: 'created_at',
      label: t(LanguageKey.site.createdAtItem),
      type: 'custom',
      align: 'center',
      sort: true,
      render: ({ row }) => {
        return (
          <Typography sx={{ textWrap: 'nowrap' }}>
            {fDate(row.updated_at, formatStr.dateTime)}
          </Typography>
        );
      },
    },

    {
      id: 'indexing',
      label: t(LanguageKey.site.indexingItem),
      type: 'custom',
      align: 'center',
      width: '10%',
      sort: true,
      render: ({ row }) => {
        if (row.indexing)
          return (
            <IconButton>
              <Iconify icon={'raphael:checked'}></Iconify>
            </IconButton>
          );
        return (
          <IconButton>
            <Iconify icon={'ci:checkbox-unchecked'}></Iconify>
          </IconButton>
        );
      },
    },
    {
      id: 'indexStatus',
      label: 'Status',
      type: 'custom',
      align: 'center',
      render: ({ row }) => {
        return <IndexStatus status={row.indexStatus} />;
      },
    },
  ];
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/indexing', title: t(LanguageKey.common.listTitle) }] }}
    >
      <AutocompleteComponentWithUrl
        baseUrl={PATH_DROPDOWN + '/sites'}
        name="site_index"
        multiple={false}
        options={[]}
        sx={{ mb: 4 }}
        onChange={(_, value) => setSiteSelect(value)}
        renderInput={(params) => {
          return <TextField {...params} margin="normal" label={t(LanguageKey.site.indexingItem)} />;
        }}
      />

      {siteSelect?.id && (
        <TableComponent
          component={isMobile ? 'CARD' : 'TABLE'}
          storeName={storeName}
          url={PATH_SITE + '/indexing/' + siteSelect?.id}
          indexCol={true}
          refreshData={refreshData}
          headLabel={HeadLabel}
          customCard={({ values, index }: { values: Record<string, any>; index: number }) => {
            const postUrl = `${values.site_domain}/bai-viet/${values.post_slug}`;
            const googleSearchUrl = `https://www.google.com/search?q=site:${postUrl}`;
            return (
              <Card sx={{ width: '100%', mb: 2 }}>
                <CardHeader
                  avatar={<Avatar aria-label="recipe">{values.site_name?.slice(0, 1)}</Avatar>}
                  title={values.site_name}
                  subheader={fDate(values.created_at, formatStr.dateTime)}
                />

                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="body2">{values.site_domain}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">{values.post_title}</Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <AutocompleteComponent
                    size="small"
                    defaultValue={{ title: values.indexStatus, id: values.indexStatus }}
                    options={[
                      { title: 'NEW', id: 'NEW' },
                      { title: 'INDEXING', id: 'INDEXING' },
                      { title: 'INDEXED', id: 'INDEXED' },
                      { title: 'ERROR', id: 'ERROR' },
                      { title: 'DELETED', id: 'DELETED' },
                    ]}
                    renderInput={(params) => {
                      return <TextField {...params} margin="normal" />;
                    }}
                  />
                </CardActions>
                <CardActions>
                  <Button
                    color="error"
                    size="medium"
                    sx={{ textWrap: 'nowrap' }}
                    fullWidth
                    variant="outlined"
                    onClick={() => window.open(postUrl, '_blank')}
                  >
                    View Site
                  </Button>
                  <Button
                    color="warning"
                    size="medium"
                    sx={{ textWrap: 'nowrap' }}
                    fullWidth
                    variant="outlined"
                    onClick={() => window.open(googleSearchUrl, '_blank')}
                  >
                    Google Search
                  </Button>
                </CardActions>
              </Card>
            );
          }}
        />
      )}
    </DashboardContent>
  );
}

const IndexStatus = ({ status }: { status?: string }) => {
  switch (status) {
    case 'NEW':
      return <Chip size="small" variant="outlined" label={status} color="primary" />;
    case 'INDEXED':
      return <Chip size="small" variant="outlined" label={status} color="success" />;
    case 'ERROR':
      return <Chip size="small" variant="outlined" label={status} color="error" />;
    case 'DELETED':
      return <Chip size="small" variant="outlined" label={status} color="default" />;
    default:
      return <Chip size="small" variant="outlined" label={status} color="warning" />;
  }
};
