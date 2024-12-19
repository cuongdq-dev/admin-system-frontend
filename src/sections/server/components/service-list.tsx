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
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SERVER } from 'src/api-core/path';
import { ButtonDismissNotify } from 'src/components/button';
import { RefreshIcon } from 'src/components/icon';
import { Iconify } from 'src/components/iconify';
import { LanguageKey } from 'src/constants';
import { useAPI } from 'src/hooks/use-api';
import { ServiceFormJson } from './service-form';
import { stringAvatar } from 'src/theme/styles/utils';

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
export const ServiceList = ({ services, connectionId }: ServerListProps) => {
  return (
    <Grid container columns={4} spacing={2}>
      {services?.map((service: IServer) => {
        return (
          <Grid key={service.id} item xs={4} sm={4} md={4}>
            <ServiceItem service={service} connectionId={connectionId} />
          </Grid>
        );
      })}
    </Grid>
  );
};

type ServiceProps = { service?: IService; connectionId?: string };
const ServiceItem = (props: ServiceProps) => {
  const { service, connectionId } = props;
  const [refreshNumber, setRefresh] = useState(0);
  const [state, setState] = useState<{ loading: boolean; data?: IService }>({
    loading: true,
    data: service,
  });

  useAPI({
    refreshNumber: refreshNumber,
    baseURL: PATH_SERVER + `/service/${service?.id}/${connectionId}`,
    onSuccess: (res) => {
      setState({ loading: false, data: { ...service, ...res } });
    },
    onHandleError: (res) => {
      setState((state) => ({ ...state, loading: false }));
    },
  });

  const handleSetupService = () => {
    setState((s) => ({ ...s, loading: true }));

    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_SERVER + `/setup/service/${service?.id}/${connectionId}`,
      onSuccess: () => {
        setState((s) => ({ ...s, loading: false }));

        enqueueSnackbar(t(LanguageKey.notify.successDelete), {
          variant: 'success',
          action: (key) => <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />,
        });
      },
      onHandleError: (error) => {
        setState((s) => ({ ...s, loading: false }));
      },
    });
  };

  const handleUpdateService = (value?: Record<string, any>) => {
    setState((s) => ({ ...s, loading: true }));
    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_SERVER + `/update/docker-compose/${connectionId}`,
      params: { values: value },
      onSuccess: () => {
        setState((s) => ({ ...s, loading: false }));
        setRefresh(refreshNumber + 1);
        enqueueSnackbar(t(LanguageKey.notify.successDelete), {
          variant: 'success',
          action: (key) => <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />,
        });
      },
      onHandleError: (error) => {
        setState((s) => ({ ...s, loading: false }));
      },
    });
  };

  if (state.loading && !state.data)
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
        <Iconify width={40} icon={state?.data?.icon!} />
        <Box width={'100%'} marginX={1}>
          <Typography
            sx={(theme) => {
              return {
                fontSize: theme.typography.button,
                fontWeight: theme.typography.fontWeightBold,
              };
            }}
          >
            {state?.data?.name}
            <IconButton
              sx={{ marginLeft: 1, padding: 0 }}
              onClick={() => {
                setState((state) => ({ ...state, loading: true }));
                setRefresh(refreshNumber + 1);
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Typography>
          <Typography
            sx={(theme) => {
              return {
                fontSize: theme.typography.caption,
                color: theme.vars.palette.text.secondary,
              };
            }}
          >
            {state?.data?.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignSelf: 'flex-start', alignItems: 'center', gap: 2 }}>
          {state.loading ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <ServiceFormJson
                icon={{ icon: 'cuida:edit-outline' }}
                handleUpdateService={handleUpdateService}
                json={state.data?.service_docker || []}
                title="Edit Docker Compose"
              />
              {state?.data?.is_installed ? (
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
        {state.data?.service_docker &&
          Object.keys(state.data?.service_docker?.services!)?.map((name, index) => {
            return (
              <DockerServiceItem
                key={name + '_' + index}
                sx={{
                  borderTop: (theme) =>
                    index != 0 ? `dashed 1px ${theme.vars.palette.divider}` : 'none',
                }}
                name={name}
                handleUpdateService={(value) => {
                  const new_data = state.data?.service_docker || {};
                  new_data.services[name] = value;
                  handleUpdateService(new_data);
                }}
                item={state.data?.service_docker?.services[name]}
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
