import { Divider, Grid, Paper, styled, Typography } from '@mui/material';
import { FieldValues, UseFormSetError } from 'react-hook-form';
import { AnalyticsSystem } from './analytics-system';
import { ContainerDockerComponent } from './container-list';
import { ImagesDockerComponent } from './images-list';
import { BasicInformation } from './information';
import { RepositoryComponent } from './repository-list';
import { ServiceList } from './service-list';
import { t } from 'i18next';
import { LanguageKey } from 'src/constants';
import { NginxList } from './nginx-list';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

type Props = {
  defaultData?: IServer;
  handleUpdate?: (setError: UseFormSetError<FieldValues>, values?: Record<string, any>) => void;
};

export const GeneralComponent = (props: Props) => {
  const { defaultData, handleUpdate } = props;
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
          <Item sx={{ height: '100%' }}>
            <AnalyticsSystem
              connectionId={defaultData?.connectionId}
              connected={defaultData?.is_connected}
              actived={defaultData?.is_active}
              title={defaultData?.name}
            />
          </Item>
        </Grid>
        <Grid item xs={12} sm={12} md={8}>
          <Item sx={{ height: '100%' }}>
            <BasicInformation defaultData={defaultData} handleUpdate={handleUpdate} />
          </Item>
        </Grid>
      </Grid>

      <Grid container spacing={2} columns={2} marginTop={2}>
        <Grid item xs={2} sm={2} md={1}>
          <ServiceList
            connectionId={defaultData?.connectionId!}
            services={defaultData?.server_services}
          />
        </Grid>
        <Grid item xs={2} sm={2} md={1}>
          <NginxList connectionId={defaultData?.connectionId!} serverId={defaultData?.id!} />
        </Grid>
      </Grid>

      <Divider sx={{ marginTop: 5 }} />
      <RepositoryComponent serverId={defaultData?.id!} connectionId={defaultData?.connectionId!} />
      <ContainerDockerComponent connectionId={defaultData?.connectionId} />
      <ImagesDockerComponent connectionId={defaultData?.connectionId} />
    </>
  );
};
