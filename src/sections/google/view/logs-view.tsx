import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  GridSize,
  Link,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { t } from 'i18next';
import { PATH_GOOGLE_LOGS_LIST } from 'src/api-core/path';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { fDate, formatStr, fRelativeTime } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';
import { LogsFilters } from '../components/logs-filters';
import { Iconify } from 'src/components/iconify';
import { IndexStatus } from '../components/index-status';

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
              <Typography>
                <IndexStatus status={row?.response?.inspectionResult?.indexStatusResult?.verdict} />
              </Typography>
            </Tooltip>
          );
        if (row?.response?.urlNotificationMetadata?.url)
          return (
            <Tooltip title={JSON.stringify(row?.response)}>
              <Typography>
                <IndexStatus status={'REQUESTED'} />
              </Typography>
            </Tooltip>
          );
        return (
          <Tooltip title={JSON.stringify(row?.response)}>
            <Typography>
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
                  {values?.response?.inspectionResult?.indexStatusResult?.verdict ? (
                    <Tooltip title={JSON.stringify(values?.response)}>
                      <Typography>
                        <IndexStatus
                          status={values?.response?.inspectionResult?.indexStatusResult?.verdict}
                        />
                      </Typography>
                    </Tooltip>
                  ) : (
                    <>
                      {values?.response?.urlNotificationMetadata?.url ? (
                        <Tooltip title={JSON.stringify(values?.response)}>
                          <Typography>
                            <IndexStatus status={'REQUESTED'} />
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Tooltip title={JSON.stringify(values?.response)}>
                          <Typography>
                            <IndexStatus status={'MAX_QUOTA'} />
                          </Typography>
                        </Tooltip>
                      )}
                    </>
                  )}
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
                    {fRelativeTime(values.requested_at, formatStr.date)}
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ p: 0, mb: 0 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {new URL(values?.site_domain).hostname}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {values?.type} - {values.response}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {values.post_slug}
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
                  href={'/blog/' + values?.post_slug}
                  underline="always"
                  variant="body2"
                  color="text.primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  {t(LanguageKey.common.detailTitle)}
                </Link>

                <Link
                  target="_blank"
                  href={
                    values?.response?.inspectionResult?.inspectionResultLink ||
                    `${values.site_domain}/bai-viet/${values.post_slug}`
                  }
                  underline="always"
                  variant="body2"
                  color="text.primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  {values?.response?.inspectionResult?.inspectionResultLink
                    ? 'GOOGLE URL'
                    : 'SITE URL'}
                </Link>
              </Box>
            </Card>
          );
        }}
      />
    </DashboardContent>
  );
}
