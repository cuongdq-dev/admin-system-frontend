import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Link,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { t } from 'i18next';
import { PATH_GOOGLE_LOGS_LIST } from 'src/api-core/path';
import { Iconify } from 'src/components/iconify';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { fDate, formatStr, fRelativeTime } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';
import { IndexStatus } from '../components/index-status';
import { LogsFilters } from '../components/logs-filters';
import { AutocompleteComponent } from 'src/components/autocomplete';

export function GoogleLogsListView() {
  const storeName = StoreName.GOOGLE_LOGS;

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
  };

  const HeadLabel: HeadLabelProps[] = [
    {
      id: 'site_domain',
      label: 'Site Name',
      sort: false,
      type: 'custom',
      align: 'center',
      width: '10%',
      render: ({ row }) => {
        const domain = new URL(row.site_domain);
        return <>{domain.hostname}</>;
      },
    },
    {
      id: 'post_title',
      label: 'Post Slug',
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
            {row?.post_slug}
          </Link>
        );
      },
    },

    {
      id: 'google_index',
      label: 'GC URL',
      sort: false,
      type: 'custom',
      render: ({ row }) => {
        return (
          <Typography
            variant="caption"
            sx={{ cursor: 'pointer', textDecoration: 'underline', textWrap: 'nowrap' }}
            onClick={() =>
              window.open(
                row?.response?.inspectionResult?.inspectionResultLink ||
                  `${row.site_domain}/bai-viet/${row.post_slug}`,
                '_blank'
              )
            }
          >
            {row?.response?.inspectionResult?.inspectionResultLink ? 'GOOGLE URL' : 'SITE URL'}
          </Typography>
        );
      },
    },

    {
      id: 'type',
      label: 'Type',
      align: 'center',
      type: 'custom',
      render: ({ row }) => {
        return <Chip size="small" variant="filled" label={row.type} color="default" />;
      },
    },
    {
      id: 'status',
      label: 'Status',
      type: 'custom',
      align: 'center',
      render: ({ row }) => {
        if (row?.response?.inspectionResult?.indexStatusResult?.verdict)
          return (
            <Tooltip title={JSON.stringify(row?.response)}>
              <Typography component="div">
                <IndexStatus status={row?.response?.inspectionResult?.indexStatusResult?.verdict} />
              </Typography>
            </Tooltip>
          );
        if (row?.response?.urlNotificationMetadata?.url)
          return (
            <Tooltip title={JSON.stringify(row?.response)}>
              <Typography component="div">
                <IndexStatus status={'REQUESTED'} />
              </Typography>
            </Tooltip>
          );
        return (
          <Tooltip title={JSON.stringify(row?.response)}>
            <Typography component="div">
              <IndexStatus status={'MAX_QUOTA'} />
            </Typography>
          </Tooltip>
        );
      },
    },

    {
      id: 'requested_at',
      label: 'Requested At',
      type: 'custom',
      align: 'center',
      render: ({ row }) => {
        return (
          <Typography sx={{ textWrap: 'nowrap' }}>
            {fDate(row.requested_at, formatStr.split.dateTime)}
          </Typography>
        );
      },
    },
  ];

  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/indexing', title: t(LanguageKey.common.listTitle) }] }}
    >
      <HeadComponent title={'Google Logs '} />
      <LogsFilters storeName={storeName} />

      <TableComponent
        component={isMobile ? 'CARD' : 'TABLE'}
        storeName={storeName}
        url={PATH_GOOGLE_LOGS_LIST}
        indexCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
        customCard={({ values, index }: { values: Record<string, any>; index: number }) => {
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
