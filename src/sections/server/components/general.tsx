import { Box, CircularProgress, Grid, Paper, styled, Typography } from '@mui/material';
import { t } from 'i18next';
import { FieldValues, UseFormSetError } from 'react-hook-form';
import { Iconify } from 'src/components/iconify';
import { LanguageKey } from 'src/constants';
import { AnalyticsSystem } from './analytics-system';
import { BasicInformation } from './information';
import { StatusServer } from './status';
import { useAPI } from 'src/hooks/use-api';
import { PATH_SERVER } from 'src/api-core/path';
import { useState } from 'react';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ServiceItem = styled(Paper)(({ theme }) => ({
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderRadius: 16,
  height: 100,
  borderColor: theme.vars.palette.divider,
  borderStyle: 'solid',
  marginTop: 4,
  marginBottom: 16,
  boxShadow: 'none',
  alignContent: 'center',
  padding: theme.spacing(2),
  '&:hover': {
    backgroundColor: theme.vars.palette.background.paper,
  },
}));

type Props = {
  defaultData?: IServer;
  handleUpdate?: (setError: UseFormSetError<FieldValues>, values?: Record<string, any>) => void;
};
type Service = { name?: string; icon?: string; description: string; installed: boolean };
// const ServerService: Service[] = [
//   { name: 'Docker', icon: 'skill-icons:docker', description: '30mb', installed: false },
//   { name: 'Nginx', icon: 'devicon:nginx', description: '30mb', installed: false },
//   { name: 'Postgresql', icon: 'skill-icons:postgresql-dark', description: '30mb', installed: true },
// ];

export const GeneralComponent = (props: Props) => {
  const { defaultData, handleUpdate } = props;
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
          <Item sx={{ height: '100%' }}>
            <Box display="flex" justifyContent={'flex-end'} paddingX={2} paddingY={2}>
              <StatusServer status={defaultData?.is_active} />
            </Box>
            <AnalyticsSystem connectionId={defaultData?.connectionId} title={defaultData?.name} />
          </Item>
        </Grid>
        <Grid item xs={12} sm={12} md={8}>
          <Item sx={{ height: '100%' }}>
            <BasicInformation defaultData={defaultData} handleUpdate={handleUpdate} />
          </Item>
        </Grid>
        <Grid item xs={12} sm={12} marginTop={2}>
          <Typography variant="h6">{t(LanguageKey.server.allService)}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} marginTop={1}>
        <Grid item xs={12} sm={12} md={6}>
          {defaultData?.server_services?.map((service) => {
            return <ServiceComponent service={service} connectionId={defaultData.connectionId} />;
          })}
        </Grid>
      </Grid>
    </>
  );
};

type ServiceProps = { service?: IService; connectionId?: string };
const ServiceComponent = (props: ServiceProps) => {
  const { service, connectionId } = props;
  const [state, setState] = useState<{ loading: boolean; data?: IService }>({
    loading: true,
    data: service,
  });

  useAPI({
    baseURL: PATH_SERVER + `/service/${service?.id}/${connectionId}`,
    onSuccess: (res) => {
      setState({ loading: false, data: { ...service, ...res } });
    },
  });

  return (
    <ServiceItem>
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
                fontSize: theme.typography.caption,
                color: theme.vars.palette.text.secondary,
              };
            }}
          >
            Memory Usage - {state?.data?.memory_usage}
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
    </ServiceItem>
  );
};
