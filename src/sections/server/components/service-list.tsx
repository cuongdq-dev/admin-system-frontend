import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  styled,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { PATH_SERVER } from 'src/api-core/path';
import { RefreshIcon } from 'src/components/icon';
import { Iconify } from 'src/components/iconify';
import { LanguageKey } from 'src/constants';
import { useAPI } from 'src/hooks/use-api';

const PaperCustom = styled(Paper)(({ theme }) => ({
  borderWidth: 1,
  borderRadius: 16,
  height: 100,
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
    <Grid container spacing={2} marginTop={1}>
      <Grid item xs={12} sm={12} marginTop={2}>
        <Typography variant="h6">{t(LanguageKey.server.allService)}</Typography>
      </Grid>
      <Grid mt={2} item xs={12} sm={12} md={12}>
        <Grid container columns={4} spacing={2}>
          {services?.map((service: IServer) => {
            return (
              <Grid item xs={4} sm={4} md={2}>
                <ServiceItem service={service} connectionId={connectionId} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
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
      <Box width={'100%'} display="flex" flexDirection="row">
        <Iconify width={60} icon={state?.data?.icon!} />
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
              <RefreshIcon loading={state.loading} />
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
            {state?.data?.memory_usage}
          </Typography>
        </Box>

        <Box sx={{ float: 'right', alignContent: 'center' }}>
          {state.loading ? (
            <CircularProgress size={20} />
          ) : (
            <>
              {state?.data?.is_installed ? (
                <Iconify
                  sx={{ color: 'primary.main', cursor: 'unset' }}
                  icon="icon-park-solid:folder-success"
                />
              ) : (
                <Iconify sx={{ color: 'grey', cursor: 'pointer' }} icon="line-md:download-loop" />
              )}
            </>
          )}
        </Box>
      </Box>
    </PaperCustom>
  );
};
