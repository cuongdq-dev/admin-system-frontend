import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import { t } from 'i18next';
import { PATH_SERVER } from 'src/api-core/path';
import { TableComponent } from 'src/components/table';
import { HeadLabelProps } from 'src/components/table/type';
import { LanguageKey } from 'src/constants';

const HeadLabel: HeadLabelProps[] = [
  {
    id: 'id',
    label: t(LanguageKey.docker.containerIdItem),
    type: 'text',
    width: '20%',
  },
  {
    id: 'name',
    label: t(LanguageKey.docker.containerNameItem),
    type: 'text',
  },
  {
    id: 'image',
    label: t(LanguageKey.docker.containerImagesItem),
    type: 'text',
  },
  {
    id: 'status',
    label: t(LanguageKey.docker.containerStatusItem),
    type: 'text',
    width: '10%',
  },
];

type ContainerDockerProps = { connectionId?: string };
export const ContainerDockerComponent = (props: ContainerDockerProps) => {
  const { connectionId } = props;
  const tableKey = 'container_docker_key';

  return (
    <Grid container spacing={2} marginTop={1}>
      <Grid item mt={2} xs={12} sm={12} md={12}>
        <Card sx={{ boxShadow: 'none' }}>
          <CardHeader sx={{ textAlign: 'left' }} title={t(LanguageKey.server.dockerContainer)} />
          <CardContent style={{ paddingBottom: 0 }} sx={{ padding: 0, marginTop: 3 }}>
            <TableComponent
              component={'TABLE'}
              tableKey={tableKey}
              withSearch={false}
              url={PATH_SERVER + `/docker/${connectionId}/containers`}
              indexCol={true}
              selectCol={false}
              actions={{ editBtn: false, deleteBtn: false, popupEdit: false }}
              headLabel={HeadLabel}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
