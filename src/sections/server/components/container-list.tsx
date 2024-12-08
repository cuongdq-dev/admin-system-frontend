import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_DOCKER } from 'src/api-core/path';
import { ButtonDismissNotify } from 'src/components/button';
import { RefreshIcon } from 'src/components/icon';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { TableComponent } from 'src/components/table';
import { HeadLabelProps } from 'src/components/table/type';
import { LanguageKey } from 'src/constants';

const HeadLabel: HeadLabelProps[] = [
  { id: 'id', label: t(LanguageKey.docker.containerIdItem), type: 'text', width: '10%' },
  { id: 'name', label: t(LanguageKey.docker.containerNameItem), type: 'text' },
  { id: 'image', label: t(LanguageKey.docker.containerImagesItem), type: 'text' },
  { id: 'state', label: t(LanguageKey.docker.containerStateItem), type: 'text', width: '5%' },
  {
    id: 'port',
    label: t(LanguageKey.docker.containerPortsItem),
    type: 'custom',
    width: '5%',
    align: 'center',
    render: ({ row }) => {
      const ports = row.ports.split(',');
      return (
        <Stack display="flex" alignItems="center" spacing={1}>
          {ports[0] && <Label width="fit-content">{ports[0]}</Label>}
          {ports[1] && <Label width="fit-content">{ports[1]}</Label>}
        </Stack>
      );
    },
  },
  { id: 'status', label: t(LanguageKey.docker.containerStatusItem), type: 'text', align: 'center' },
];

type ContainerDockerProps = { connectionId?: string };
export const ContainerDockerComponent = ({ connectionId }: ContainerDockerProps) => {
  const tableKey = 'container_docker_key';
  const [refreshNumber, setRefresh] = useState<number>(0);
  const refreshData = () => setRefresh(refreshNumber + 1);

  const headerColums = connectionId
    ? [
        ...HeadLabel,
        {
          id: 'UP',
          label: '',
          width: '5%',
          type: 'custom',
          render: ({ row, updateRowData }) => (
            <ContainerAction
              connectionId={connectionId}
              row={row as IContainerDocker}
              updateRowData={updateRowData}
            />
          ),
        } as HeadLabelProps,
      ]
    : HeadLabel;

  return (
    <Grid container spacing={2} marginTop={1}>
      <Grid item mt={2} xs={12}>
        <Card sx={{ boxShadow: 'none' }}>
          <CardHeader
            sx={{ textAlign: 'left' }}
            title={
              <Box display="flex" justifyContent="space-between">
                <Box>{t(LanguageKey.server.dockerContainer)}</Box>
                <IconButton size="medium" sx={{ marginLeft: 1 }} onClick={refreshData}>
                  <RefreshIcon icon={'mdi:refresh'} />
                </IconButton>
              </Box>
            }
          />
          <CardContent style={{ paddingBottom: 0 }} sx={{ padding: 0, marginTop: 3 }}>
            <TableComponent
              component="TABLE"
              tableKey={tableKey}
              withSearch={false}
              refreshNumber={refreshNumber}
              refreshData={refreshData}
              url={`${PATH_DOCKER}/containers/${connectionId}`}
              indexCol={true}
              selectCol={false}
              actions={{ editBtn: false, deleteBtn: false, popupEdit: false }}
              headLabel={headerColums}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

type ContainerActionProps = {
  row: IContainerDocker;
  updateRowData?: (
    rowId: string,
    values: Record<string, any>,
    action: 'ADD' | 'REMOVE' | 'UPDATE'
  ) => void;
  connectionId: string;
};

const ContainerAction = ({ row, updateRowData, connectionId }: ContainerActionProps) => {
  const [loading, setLoading] = useState(false);

  const renderActions = (state: string) => {
    const actions: { [key: string]: ActionType[] } = {
      running: ['pause', 'stop', 'restart'],
      paused: ['resume', 'stop', 'restart'],
      exited: ['restart', 'remove'],
      created: ['remove'],
    };

    return actions[state]?.map((action) => (
      <IconAction
        key={action}
        action={action}
        row={row}
        handleClick={(loading: boolean) => {
          setLoading(loading);
        }}
        connectionId={connectionId}
        updateRowData={updateRowData}
      />
    ));
  };

  return (
    <Box
      sx={{ pointerEvents: loading ? 'none' : 'auto' }}
      display="flex"
      justifyContent="flex-end"
      gap={1}
    >
      {renderActions(row.state)}
    </Box>
  );
};

type ActionType = 'play' | 'pause' | 'stop' | 'restart' | 'resume' | 'remove';
type IconActionProps = {
  action: 'play' | 'pause' | 'stop' | 'restart' | 'resume' | 'remove';
  row: IContainerDocker;
  connectionId: string;
  handleClick?: (loading: boolean) => void;
  updateRowData?: (
    rowId: string,
    values: Record<string, any>,
    action: 'ADD' | 'REMOVE' | 'UPDATE'
  ) => void;
};

const containerActionIcons = {
  play: 'material-symbols:play-arrow',
  pause: 'material-symbols:pause',
  stop: 'material-symbols:stop',
  restart: 'material-symbols:restart-alt',
  resume: 'material-symbols:play-arrow',
  remove: 'material-symbols:delete',
} as const;

const IconAction = ({ action, row, connectionId, updateRowData, handleClick }: IconActionProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleClick && handleClick(loading);
  }, [loading]);
  const handleButtonClick = () => {
    if (!loading) {
      setLoading(true);
      handleClick && handleClick(true);
      invokeRequest({
        method: HttpMethod.POST,
        baseURL: `${PATH_DOCKER}/container/${connectionId}/${row.id}/${action}`,
        params: {},
        onHandleError: () => setLoading(false),
        onSuccess(res) {
          setLoading(false);
          updateRowData &&
            updateRowData(row?.id!, res?.result, action === 'remove' ? 'REMOVE' : 'UPDATE');

          enqueueSnackbar(t(LanguageKey.notify.successUpdate), {
            variant: 'success',
            action: (key) => (
              <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />
            ),
          });
        },
      });
    }
  };

  return (
    <Tooltip title={action}>
      <Box sx={{ position: 'relative' }}>
        <IconButton onClick={handleButtonClick}>
          <Iconify icon={containerActionIcons[action]} />
        </IconButton>
        {loading && (
          <CircularProgress
            size={20}
            sx={{ color: 'primary.main', position: 'absolute', top: 8, left: 8, zIndex: 1 }}
          />
        )}
      </Box>
    </Tooltip>
  );
};
