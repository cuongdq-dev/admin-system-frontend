import { Box, Grid, Paper, styled } from '@mui/material';
import { FieldValues, UseFormSetError } from 'react-hook-form';
import { AnalyticsSystem } from './analytics-system';
import { ContainerDockerComponent } from './container-list';
import { BasicInformation } from './information';
import { ServiceList } from './service-list';
import { StatusServer } from './status';
import { ImagesDockerComponent } from './images-list';

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
      </Grid>
      {defaultData?.connectionId && defaultData.server_services && (
        <ServiceList
          connectionId={defaultData?.connectionId!}
          services={defaultData?.server_services}
        />
      )}
      {defaultData?.connectionId && (
        <ContainerDockerComponent connectionId={defaultData?.connectionId} />
      )}

      {defaultData?.connectionId && (
        <ImagesDockerComponent connectionId={defaultData?.connectionId} />
      )}
    </>
  );
};
