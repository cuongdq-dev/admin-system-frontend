import {
  Avatar,
  Box,
  BoxProps,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  ListItemText,
  Paper,
  Skeleton,
  styled,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SERVER } from 'src/api-core/path';
import { RefreshIcon } from 'src/components/icon';
import { Iconify } from 'src/components/iconify';
import { TimeAgo } from 'src/components/label';
import { LanguageKey, StoreName } from 'src/constants';
import { useAPI } from 'src/hooks/use-api';
import { useNotifyStore } from 'src/store/notify';
import { usePageStore } from 'src/store/store';
import { stringAvatar } from 'src/theme/styles/utils';
import { useShallow } from 'zustand/react/shallow';
import { ServiceFormJson } from './service-form';

const PaperCustom = styled(Paper)(({ theme }) => ({
  borderWidth: 1,
  borderRadius: 16,
  height: 'fit-content',
  borderColor: theme.vars.palette.divider,
  borderStyle: 'solid',
  boxShadow: 'none',
  alignContent: 'center',
  padding: theme.spacing(2),
  '&:hover': {
    backgroundColor: theme.vars.palette.background.paper,
  },
}));

type ServerListProps = { services?: IService[]; connectionId: string };
export const ServiceList = ({ connectionId }: ServerListProps) => {
  return (
    <Grid container columns={4} spacing={2}>
      <Grid item xs={4} sm={4} md={4}>
        <ServiceItem connectionId={connectionId} />
      </Grid>
    </Grid>
  );
};

const ServiceItem = (props: { connectionId?: string }) => {
  const { setNotify } = useNotifyStore.getState();
  const { connectionId } = props;
  const storeName = StoreName.SERVICE;
  const { setRefreshList, setLoadingList, setList } = usePageStore();

  const {
    refreshNumber = 0,
    data,
    fetchOn,
    isLoading: loading,
  } = usePageStore(useShallow((state) => ({ ...state.dataStore![storeName]?.list })));

  const refreshData = () => setRefreshList(storeName, refreshNumber + 1);

  useAPI({
    clearRequest:
      !loading &&
      data &&
      fetchOn &&
      new Date().getTime() - new Date(fetchOn).getTime() < 5 * 60 * 1000,

    refreshNumber: refreshNumber,
    baseURL: PATH_SERVER + `/service/${data?.id}/${connectionId}`,
    onSuccess: (res) => {
      setList(storeName, { data: res?.data, isLoading: false, isFetching: false });
    },
    onHandleError: (res) => {
      setLoadingList(storeName, false);
    },
  });

  const handleSetupService = () => {
    setLoadingList(storeName, true);

    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_SERVER + `/setup/service/${data?.id}/${connectionId}`,
      onSuccess: () => {
        setLoadingList(storeName, false);
        setNotify({ title: t(LanguageKey.notify.successUpdate), options: { variant: 'success' } });
      },
      onHandleError: (error) => {
        setLoadingList(storeName, false);
      },
    });
  };

  const handleUpdateService = (value?: Record<string, any>) => {
    setLoadingList(storeName, true);

    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_SERVER + `/update/docker-compose/${connectionId}`,
      params: { values: value },
      onSuccess: () => {
        setLoadingList(storeName, false);
        refreshData();
        setNotify({ title: t(LanguageKey.notify.successUpdate), options: { variant: 'success' } });
      },
      onHandleError: (error) => {
        setLoadingList(storeName, false);
      },
    });
  };

  if (loading && !data)
    return (
      <PaperCustom>
        <Box width={'100%'} display="flex" flexDirection="row">
          <Skeleton variant="rounded" width={60} height={60} />
          <Box width={'100%'} marginX={1}>
            <Typography
              sx={(theme) => {
                return {
                  fontSize: theme.typography.button,
                  fontWeight: theme.typography.fontWeightBold,
                };
              }}
            >
              <Skeleton variant="text" />
            </Typography>
            <Typography
              sx={(theme) => {
                return {
                  fontSize: theme.typography.caption,
                  color: theme.vars.palette.text.secondary,
                };
              }}
            >
              <Skeleton variant="text" />
            </Typography>

            <Typography
              sx={(theme) => {
                return {
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1,
                  fontSize: theme.typography.caption,
                  color: theme.vars.palette.text.secondary,
                };
              }}
            >
              <Skeleton variant="text" />
            </Typography>
          </Box>
        </Box>
      </PaperCustom>
    );

  return (
    <PaperCustom>
      <Box height={'fit-content'} width={'100%'} display="flex" flexDirection="row">
        <Iconify width={40} icon={data?.icon!} />
        <Box width={'100%'} marginX={1}>
          <Typography
            sx={(theme) => {
              return {
                fontSize: theme.typography.h6,
                fontWeight: theme.typography.fontWeightBold,
              };
            }}
          >
            {data?.name}
            <IconButton
              sx={{ marginLeft: 1, padding: 0 }}
              onClick={() => {
                setLoadingList(storeName, true);
                refreshData();
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Typography>
          <TimeAgo timestamp={fetchOn!} />
          <Typography
            sx={(theme) => {
              return {
                fontSize: theme.typography.caption,
                color: theme.vars.palette.text.secondary,
              };
            }}
          >
            {data?.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignSelf: 'flex-start', alignItems: 'center', gap: 2 }}>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <ServiceFormJson
                icon={{ icon: 'cuida:edit-outline' }}
                handleUpdateService={handleUpdateService}
                json={data?.service_docker || []}
                title="Edit Docker Compose"
              />
              {data?.is_installed ? (
                <Iconify
                  sx={{ color: 'primary.main', cursor: 'unset' }}
                  icon="icon-park-solid:folder-success"
                />
              ) : (
                <IconButton onClick={handleSetupService}>
                  <Iconify sx={{ color: 'grey', cursor: 'pointer' }} icon="line-md:download-loop" />
                </IconButton>
              )}
            </>
          )}
        </Box>
      </Box>

      <Card
        sx={(theme) => {
          return {
            marginTop: 2,
            boxShadow: theme.customShadows.z1,
            backgroundColor: theme.vars.palette.background.neutral,
          };
        }}
      >
        {data?.service_docker &&
          Object.keys(data?.service_docker?.services!)?.map((name, index) => {
            return (
              <DockerServiceItem
                key={name + '_' + index}
                sx={{
                  borderTop: (theme) =>
                    index != 0 ? `dashed 1px ${theme.vars.palette.divider}` : 'none',
                }}
                name={name}
                handleUpdateService={(value) => {
                  const new_data = data?.service_docker || {};
                  new_data.services[name] = value;
                  handleUpdateService(new_data);
                }}
                item={data?.service_docker?.services[name]}
              />
            );
          })}
      </Card>
    </PaperCustom>
  );
};

type DockerServiceItemProps = BoxProps & {
  handleUpdateService: (value?: Record<string, any>) => void;
  name: string;
  item: Record<string, any>;
};
function DockerServiceItem(props: DockerServiceItemProps) {
  const { sx, item, name, handleUpdateService, ...other } = props;
  return (
    <Box sx={{ py: 2, px: 3, gap: 2, display: 'flex', alignItems: 'center', ...sx }} {...other}>
      <Avatar {...stringAvatar(name)} />

      <ListItemText
        primary={name.toLocaleUpperCase()}
        secondary={`Container: ${item.container_name}`}
        primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
        secondaryTypographyProps={{ mt: 0.5, noWrap: true, component: 'span' }}
      />
      <Box>
        <ServiceFormJson
          icon={{ icon: 'cuida:edit-outline' }}
          handleUpdateService={handleUpdateService}
          json={item}
          title={name.toLocaleUpperCase()}
        />
      </Box>
    </Box>
  );
}
