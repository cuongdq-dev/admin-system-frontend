import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Link,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { t } from 'i18next';
import { PATH_BLOG_ARCHIVED, PATH_GOOGLE_INDEXING_LIST } from 'src/api-core/path';
import { Iconify } from 'src/components/iconify';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { fDate, formatStr, fRelativeTime } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';
import { IndexStatus } from '../components/index-status';
import { IndexingFilters } from '../components/indexing-filters';
import { IconButtonDelete } from 'src/components/button';

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
        customCard={({ values, updateRowData, index }) => {
          const postUrl = `${values.site_domain}/bai-viet/${values.post_slug}`;
          const googleSearchUrl = `https://www.google.com/search?q=site:${postUrl}`;
          return (
            <Card sx={{ borderRadius: 4, p: 3, mb: 2, width: '100%' }}>
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <IndexStatus status={values.indexStatus} />
                </Box>
                <Box
                  sx={{
                    display: 'inline-flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Iconify icon="mdi-light:clock"></Iconify>

                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {fRelativeTime(values.created_at)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Link href={postUrl} variant="caption" color="text.secondary">
                  {values.site_name}
                </Link>
                <Typography variant="h6" sx={{ fontWeight: '600', lineHeight: 1.5 }}>
                  {values.post_title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {values?.post_categories
                    ?.map((cate?: { name?: string }) => cate?.name)
                    .join(', ')}
                </Typography>
                <CardMedia
                  sx={{ borderRadius: 1, mt: 1 }}
                  component="img"
                  height="140"
                  image={values?.post_thumbnail?.url}
                  alt={values?.post_thumbnail?.slug}
                />
              </Box>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="caption">{values.post_meta_description}</Typography>
              </CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  mt: 2,
                }}
              >
                <Button variant="contained" LinkComponent={'a'} href={googleSearchUrl}>
                  G-Search
                </Button>
              </Box>
            </Card>
          );
        }}
      />
    </DashboardContent>
  );
}
