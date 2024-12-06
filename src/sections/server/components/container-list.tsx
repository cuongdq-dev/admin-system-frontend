import { Box, Card, CardContent, CardHeader, Grid, IconButton } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { PATH_SERVER } from 'src/api-core/path';
import { Iconify } from 'src/components/iconify';
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

  const [refreshNumber, setRefresh] = useState<number>(0);

  const refreshData = () => {
    setRefresh(refreshNumber + 1);
  };

  const headerColums = connectionId ? HeadLabel : HeadLabel;

  return (
    <Grid container spacing={2} marginTop={1}>
      <Grid item mt={2} xs={12} sm={12} md={12}>
        <Card sx={{ boxShadow: 'none' }}>
          <CardHeader
            sx={{ textAlign: 'left' }}
            title={
              <Box display="flex" justifyContent="space-between">
                <Box>{t(LanguageKey.server.dockerContainer)}</Box>
                <IconButton size="medium" sx={{ marginLeft: 1 }} onClick={refreshData}>
                  <Iconify icon="prime:refresh" />
                </IconButton>
              </Box>
            }
          />
          <CardContent style={{ paddingBottom: 0 }} sx={{ padding: 0, marginTop: 3 }}>
            <TableComponent
              component={'TABLE'}
              tableKey={tableKey}
              withSearch={false}
              refreshNumber={refreshNumber}
              refreshData={refreshData}
              url={PATH_SERVER + `/docker/${connectionId}/containers`}
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
