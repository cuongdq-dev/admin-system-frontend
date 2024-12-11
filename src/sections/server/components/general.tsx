import { Grid, Paper, styled } from '@mui/material';
import { FieldValues, UseFormSetError } from 'react-hook-form';
import { AnalyticsSystem } from './analytics-system';
import { ContainerDockerComponent } from './container-list';
import { ImagesDockerComponent } from './images-list';
import { BasicInformation } from './information';
import { RepositoryComponent } from './repository-list';
import { ServiceList } from './service-list';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

type Props = {
  defaultData?: IServer;
  handleReconnectServer?: () => void;
  handleUpdate?: (setError: UseFormSetError<FieldValues>, values?: Record<string, any>) => void;
};

export const GeneralComponent = (props: Props) => {
  const { defaultData, handleUpdate, handleReconnectServer } = props;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
          <Item sx={{ height: '100%' }}>
            <AnalyticsSystem
              handleReconnectServer={handleReconnectServer}
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

      {defaultData?.connectionId && defaultData.server_services && (
        <ServiceList
          connectionId={defaultData?.connectionId!}
          services={defaultData?.server_services}
        />
      )}
      <RepositoryComponent serverId={defaultData?.id!} connectionId={defaultData?.connectionId!} />
      {defaultData?.connectionId && (
        <ContainerDockerComponent connectionId={defaultData?.connectionId} />
      )}

      {defaultData?.connectionId && (
        <ImagesDockerComponent connectionId={defaultData?.connectionId} />
      )}
    </>
  );
};
