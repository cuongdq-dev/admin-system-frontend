import { Chip, Link, TextField, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_DROPDOWN, PATH_GOOGLE_LOGS_LIST } from 'src/api-core/path';
import { AutocompleteComponent, AutocompleteComponentWithUrl } from 'src/components/autocomplete';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { fDate, formatStr } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';

export function GoogleLogsListView() {
  const navigate = useNavigate();

  const storeName = StoreName.GOOGLE_LOGS;
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
      label: 'Post Title',
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

  const logType = new URLSearchParams(location.search).get('type')!;

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/indexing', title: t(LanguageKey.common.listTitle) }] }}
    >
      <AutocompleteComponentWithUrl
        baseUrl={PATH_DROPDOWN + '/sites'}
        name="site_index"
        multiple={false}
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
          return <TextField {...params} margin="normal" label={t(LanguageKey.site.domainItem)} />;
        }}
      />

      <AutocompleteComponent
        sx={{ my: 2 }}
        multiple
        disableCloseOnSelect
        defaultValue={logType?.split(',').map((i) => {
          return { id: i, title: i };
        })}
        onChange={(event, values) => {
          const typeValues = values.map((value: { id: string; title: string }) => {
            return value.id;
          });

          updateUrl({ type: typeValues.toString(), limit: undefined, page: undefined });
        }}
        clearIcon
        options={[
          { title: 'URL_UPDATED', id: 'URL_UPDATED' },
          { title: 'URL_METADATA', id: 'URL_METADATA' },
        ]}
        renderInput={(params) => {
          return <TextField {...params} label="Filter Status" />;
        }}
      />

      <TableComponent
        component={'TABLE'}
        storeName={storeName}
        url={PATH_GOOGLE_LOGS_LIST}
        indexCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
      />
    </DashboardContent>
  );
}

const IndexStatus = ({ status }: { status?: string }) => {
  switch (status) {
    case 'NEW':
      return <Chip size="small" variant="outlined" label={status} color="primary" />; // Xanh dương - mới

    case 'INDEXING':
    case 'REQUESTED':
      return <Chip size="small" variant="outlined" label={status} color="info" />; // Xanh nhạt - đang index

    case 'DELETED':
      return <Chip size="small" variant="outlined" label={status} color="default" />; // Xám - đã xóa
    case 'PASS':
      return <Chip size="small" variant="outlined" label={status} color="success" />; // Xanh lá - index thành công
    case 'FAIL':
      return <Chip size="small" variant="outlined" label={status} color="error" />; // Đỏ - lỗi

    case 'PARTIAL':
    case 'MAX_QUOTA':
      return <Chip size="small" variant="outlined" label={status} color="warning" />; // Vàng - chưa hoàn chỉnh

    case 'NEUTRAL':
      return <Chip size="small" variant="outlined" label={status} color="secondary" />; // Tím - bị loại trừ
    case 'VERDICT_UNSPECIFIED':
      return <Chip size="small" variant="outlined" label={status} color="default" />; // Xám - không rõ trạng thái

    default:
      return <Chip size="small" variant="outlined" label={status} color="warning" />; // Mặc định vàng - không xác định
  }
};
