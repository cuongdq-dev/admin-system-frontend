import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SERVER } from 'src/api-core/path';
import { ButtonDismissNotify } from 'src/components/button';
import { Iconify } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { HeadLabelProps } from 'src/components/table/type';
import { LanguageKey } from 'src/constants';

type ImagesDockerProps = { connectionId?: string };
export const ImagesDockerComponent = (props: ImagesDockerProps) => {
  const { connectionId } = props;
  const tableKey = 'images_docker_key';

  const HeadLabel: HeadLabelProps[] = [
    {
      id: 'id',
      label: t(LanguageKey.docker.imageIdItem),
      type: 'text',
      width: '20%',
    },
    {
      id: 'name',
      label: t(LanguageKey.docker.imageNameItem),
      type: 'text',
      width: '30%',
    },
    {
      id: 'tag',
      label: t(LanguageKey.docker.imageTagItem),
      align: 'center',
      width: '10%',
      type: 'text',
    },
    {
      id: 'size',
      label: t(LanguageKey.docker.imageSizeItem),
      type: 'text',
      align: 'center',
      width: '10%',
    },

    {
      id: 'status',
      label: t(LanguageKey.docker.imageStatusItem),
      type: 'text',
      align: 'center',
      width: '10%',
    },

    {
      id: 'created',
      label: t(LanguageKey.docker.imageCreatedItem),
      type: 'text',
      align: 'center',
      width: '30%',
    },

    {
      id: 'action',
      label: '',
      type: 'custom',
      align: 'center',
      width: '30%',
      render: ({ row, refreshData }) => {
        return <ImageAction connectionId={connectionId!} row={row} refreshData={refreshData} />;
      },
    },
  ];
  return (
    <Grid container spacing={2} marginTop={1}>
      <Grid item mt={2} xs={12} sm={12} md={12}>
        <Card sx={{ boxShadow: 'none' }}>
          <CardHeader sx={{ textAlign: 'left' }} title={t(LanguageKey.server.dockerImages)} />
          <CardContent style={{ paddingBottom: 0 }} sx={{ padding: 0, marginTop: 3 }}>
            <TableComponent
              component={'TABLE'}
              tableKey={tableKey}
              withSearch={false}
              url={PATH_SERVER + `/docker/${connectionId}/images`}
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

type ImageActionProps = {
  row: Record<string, any>;
  refreshData?: () => void;
  connectionId: string;
};
const ImageAction = ({ row, refreshData, connectionId }: ImageActionProps) => {
  const [data, setData] = useState(row);

  useEffect(() => {
    setData(row);
  }, [data]);

  return (
    <Box display="flex">
      <Tooltip title={t(LanguageKey.docker.imageRun)}>
        <IconAction
          baseUrl={PATH_SERVER + `/docker/image/${connectionId}/run`}
          params={{ imageName: data.name }}
          action="POST"
          refreshData={refreshData}
          icon="si:actions-fill"
        />
      </Tooltip>
      <IconAction
        baseUrl={PATH_SERVER + `/docker/image/${connectionId}/${data?.id}`}
        action="DELETE"
        refreshData={refreshData}
        icon="solar:trash-bin-trash-bold"
      />
    </Box>
  );
};

type IconActionProps = {
  action: 'POST' | 'DELETE';
  icon: string;
  baseUrl: string;
  params?: Record<string, any>;
  refreshData?: () => void;
};
const IconAction = (props: IconActionProps) => {
  const { action, params, icon, baseUrl, refreshData } = props;
  const [loading, setLoading] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setLoading(true);

      invokeRequest({
        method: HttpMethod[action],
        baseURL: baseUrl,
        params: params,
        onHandleError: (response) => {
          setLoading(false);
          console.error('Unexpected error format:', response);
        },
        onSuccess(res) {
          setLoading(false);
          enqueueSnackbar(t(LanguageKey.notify.successUpdate), {
            variant: 'success',
            action: (key) => (
              <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />
            ),
          });
          refreshData && refreshData();
        },
      });
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton onClick={handleButtonClick}>
        <Iconify icon={icon} />
      </IconButton>
      {loading && (
        <CircularProgress
          size={20}
          sx={{
            color: 'primary.main',
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};
