import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_BLOG_ARCHIVED } from 'src/api-core/path';
import { AutocompleteComponent } from 'src/components/autocomplete';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { fDate, formatStr } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';

export function ListArchivedView() {
  const navigate = useNavigate();

  const storeName = StoreName.BLOG_ARCHIVED;

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

  const indexS = new URLSearchParams(location.search).get('indexStatus')!;

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/indexing', title: t(LanguageKey.common.listTitle) }] }}
    >
      <TableComponent
        component={isMobile ? 'CARD' : 'TABLE'}
        storeName={storeName}
        url={PATH_BLOG_ARCHIVED}
        indexCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
        actions={{ deleteBtn: true }}
        customCard={({ values }: { values: Record<string, any>; index: number }) => {
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
                    { title: 'DELETED', id: 'DELETED' },
                    { title: 'VERDICT_UNSPECIFIED', id: 'VERDICT_UNSPECIFIED' },
                    { title: 'PASS', id: 'PASS' },
                    { title: 'PARTIAL', id: 'PARTIAL' },
                    { title: 'FAIL', id: 'FAIL' },
                    { title: 'NEUTRAL', id: 'NEUTRAL' },
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
    </DashboardContent>
  );
}

const IndexStatus = ({ status }: { status?: string }) => {
  switch (status) {
    case 'NEW':
      return <Chip size="small" variant="outlined" label={status} color="primary" />; // Xanh dương - mới
    case 'INDEXING':
      return <Chip size="small" variant="outlined" label={status} color="info" />; // Xanh nhạt - đang index
    case 'DELETED':
      return <Chip size="small" variant="outlined" label={status} color="default" />; // Xám - đã xóa
    case 'PASS':
      return <Chip size="small" variant="outlined" label={status} color="success" />; // Xanh lá - index thành công
    case 'FAIL':
      return <Chip size="small" variant="outlined" label={status} color="error" />; // Đỏ - lỗi
    case 'PARTIAL':
      return <Chip size="small" variant="outlined" label={status} color="warning" />; // Vàng - chưa hoàn chỉnh
    case 'NEUTRAL':
      return <Chip size="small" variant="outlined" label={status} color="secondary" />; // Tím - bị loại trừ
    case 'VERDICT_UNSPECIFIED':
      return <Chip size="small" variant="outlined" label={status} color="default" />; // Xám - không rõ trạng thái
    default:
      return <Chip size="small" variant="outlined" label={status} color="warning" />; // Mặc định vàng - không xác định
  }
};
