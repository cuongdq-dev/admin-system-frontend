import { Box, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { PATH_BATCH_LOGS_LIST } from 'src/api-core/path';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';

enum LogStatus {
  PENDING = 'pending',
  RUNING = 'runing',
  SUCCESS = 'success',
  FAILED = 'failed',
}
export function ListView() {
  const storeName = StoreName.BATCH_LOGS;

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
  };

  const HeadLabel: HeadLabelProps[] = [
    {
      id: 'job_name',
      label: t(LanguageKey.batchLogs.jobNameItem),
      sort: false,
      type: 'text',
    },

    {
      id: 'message',
      label: t(LanguageKey.batchLogs.messageItem),
      sort: false,
      type: 'custom',
      width: '10%',
      align: 'center',
      render: ({ row }) => {
        return (
          <Tooltip
            title={
              <Box
                sx={{
                  maxHeight: 400,
                  maxWidth: 600,
                  overflow: 'auto',
                  padding: 1,
                }}
              >
                {row?.message?.map((m: string, idx: number) => {
                  return (
                    <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                      {m}
                    </Typography>
                  );
                })}
              </Box>
            }
            enterTouchDelay={0}
            leaveTouchDelay={3000}
          >
            <Typography variant="inherit">{row?.message?.length} Message</Typography>
          </Tooltip>
        );
      },
    },

    {
      id: 'scheduled_at',
      label: t(LanguageKey.batchLogs.scheduledAtItem),
      sort: false,
      type: 'datetime',
      width: '10%',
    },
    {
      id: 'status',
      label: t(LanguageKey.batchLogs.statusItem),
      sort: false,
      type: 'custom',
      align: 'center',
      width: '10%',
      render: ({ row }) => {
        switch (row.status) {
          case LogStatus.FAILED:
            return <Label color="error">{row?.status}</Label>;
          case LogStatus.SUCCESS:
            return <Label color="success">{row?.status}</Label>;
          case LogStatus.RUNING:
            return <Label color="info">{row?.status}</Label>;
          case LogStatus.PENDING:
          default:
            return <Label color="warning">{row?.status}</Label>;
        }
      },
    },

    {
      id: 'started_at',
      label: t(LanguageKey.batchLogs.startedAtItem),
      sort: false,
      type: 'datetime',
      width: '10%',
    },
    {
      id: 'finished_at',
      label: t(LanguageKey.batchLogs.finishedAtItem),
      sort: false,
      type: 'datetime',
      width: '10%',
    },
  ];

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/user', title: t(LanguageKey.common.listTitle) }] }}
    >
      <TableComponent
        component="TABLE"
        storeName={storeName}
        url={PATH_BATCH_LOGS_LIST}
        indexCol={true}
        selectCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
      />
    </DashboardContent>
  );
}
