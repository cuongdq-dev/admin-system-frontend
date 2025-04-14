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
import { PATH_DROPDOWN, PATH_GOOGLE_WEBSITE_LIST } from 'src/api-core/path';
import { AutocompleteComponent, AutocompleteComponentWithUrl } from 'src/components/autocomplete';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { fDate, formatStr } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';

export function WebsiteListView() {
  const navigate = useNavigate();

  const storeName = StoreName.GOOGLE_WEBSITE;
  const [siteSelect, setSiteSelect] = useState<{ id: string; title?: string } | undefined | null>(
    new URLSearchParams(location.search)
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
      <AutocompleteComponentWithUrl
        baseUrl={PATH_DROPDOWN + '/sites'}
        name="site_index"
        multiple={false}
        options={[]}
        defaultValue={siteSelect || undefined}
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
        renderInput={() => <></>}
      />

      <Box>
        <AutocompleteComponent
          sx={{ my: 2 }}
          multiple
          disableCloseOnSelect
          defaultValue={indexS?.split(',').map((i) => {
            return { id: i, title: i };
          })}
          onChange={(event, values) => {
            const statuValues = values.map((value: { id: string; title: string }) => {
              return value.id;
            });

            updateUrl({ indexStatus: statuValues.toString(), limit: undefined, page: undefined });
          }}
          clearIcon
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
          renderInput={() => <></>}
        />
      </Box>

      <TableComponent
        component={isMobile ? 'CARD' : 'TABLE'}
        storeName={storeName}
        url={PATH_GOOGLE_WEBSITE_LIST}
        indexCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
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
                  renderInput={() => <></>}
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
