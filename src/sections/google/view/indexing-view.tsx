import { Box, Card, CardContent, Chip, Link, Typography, useMediaQuery } from '@mui/material';
import { t } from 'i18next';
import { PATH_GOOGLE_INDEXING_LIST } from 'src/api-core/path';
import { Iconify } from 'src/components/iconify';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { fDate, formatStr, fRelativeTime } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';
import { IndexingFilters } from '../components/indexing-filters';
import { IndexStatus } from '../components/index-status';

export function IndexingListView() {
  const storeName = StoreName.GOOGLE_INDEXING;
  new URLSearchParams(location.search).get('site_id')
    ? {
        id: new URLSearchParams(location.search).get('site_id')!,
        title: new URLSearchParams(location.search).get('site_name')!,
      }
    : undefined;

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
  };

  const HeadLabel: HeadLabelProps[] = [
    {
      id: 'site_name',
      label: 'Link',
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
        return (
          <Link
            href={'/blog/' + row?.post_slug}
            color="inherit"
            variant="subtitle2"
            underline="hover"
            sx={{
              cursor: 'pointer',
              overflow: 'hidden',
              WebkitLineClamp: 2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {row?.post_title}
          </Link>
        );
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
            {fDate(row.created_at, formatStr.dateTime)}
          </Typography>
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
      <HeadComponent title={'Google Index '} />
      <IndexingFilters storeName={storeName} />

      <TableComponent
        component={isMobile ? 'CARD' : 'TABLE'}
        storeName={storeName}
        url={PATH_GOOGLE_INDEXING_LIST}
        indexCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
        customCard={({ values }: { values: Record<string, any>; index: number }) => {
          const postUrl = `${values.site_domain}/bai-viet/${values.post_slug}`;
          const googleSearchUrl = `https://www.google.com/search?q=site:${postUrl}`;
          return (
            <Card sx={{ borderRadius: 4, p: 3, mb: 2, width: '100%' }}>
              <Box
                sx={{
                  mb: 4,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={(theme) => {
                    return {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      color: theme.palette.grey.A200,
                    };
                  }}
                >
                  <IndexStatus status={values?.indexStatus} />
                </Box>
                <Box
                  sx={{
                    display: 'inline-flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Iconify icon="mdi-light:clock"></Iconify>

                  <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                    {fRelativeTime(values.created_at, formatStr.date)}
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ p: 0, mb: 0 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {new URL(values?.site_domain).hostname}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {values?.site_domain}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {values.post_title}s
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Link
                  target="_blank"
                  href={postUrl}
                  underline="always"
                  variant="body2"
                  color="text.primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  Post Url
                </Link>

                <Link
                  target="_blank"
                  href={googleSearchUrl}
                  underline="always"
                  variant="body2"
                  color="text.primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  Google Console
                </Link>
              </Box>
            </Card>
          );
        }}
      />
    </DashboardContent>
  );
}
