import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_DOCKER } from 'src/api-core/path';
import { ButtonDismissNotify } from 'src/components/button';
import { PopupFormTable } from 'src/components/form/form-table';
import { RefreshIcon } from 'src/components/icon';
import { Iconify } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { HeadLabelProps } from 'src/components/table/type';
import { LanguageKey } from 'src/constants';
import * as Yup from 'yup';
import { ServerForm } from './form-table';

type ImagesDockerProps = { connectionId?: string };

const FormTableSchema = {
  name: Yup.string().required('Email is required'),
  host: Yup.string().required('host is required'),
  port: Yup.string().required('port is required'),
  password: Yup.string().required('password is required'),
  user: Yup.string().required('user is required'),
};

type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: IServer;
  action?: HttpMethod;
};

export const ImagesDockerComponent = (props: ImagesDockerProps) => {
  const { connectionId } = props;
  const tableKey = 'images_docker_key';
  const [refreshNumber, setRefresh] = useState<number>(0);

  const refreshData = () => {
    setRefresh(refreshNumber + 1);
  };

  const [formConfig, setFormConfig] = useState<FormConfigState>({
    open: false,
    title: '',
    defaultValues: {},
    action: HttpMethod.PATCH,
  });

  const headerColums = connectionId
    ? HeadLabel.concat({
        id: 'action',
        label: '',
        width: '5%',
        type: 'custom',
        render: ({ row, updateRowData }) => {
          return (
            <ImageAction connectionId={connectionId!} row={row} updateRowData={updateRowData} />
          );
        },
      })
    : HeadLabel;

  return (
    <Grid container spacing={2} marginTop={1}>
      <Grid item mt={2} xs={12} sm={12} md={12}>
        <Card sx={{ boxShadow: 'none' }}>
          <CardHeader
            sx={{ textAlign: 'left' }}
            title={
              <Box display="flex" justifyContent="space-between">
                <Box>{t(LanguageKey.server.dockerImages)}</Box>
                <IconButton size="medium" sx={{ marginLeft: 1 }} onClick={refreshData}>
                  <RefreshIcon icon={'mdi:refresh'} />
                </IconButton>
              </Box>
            }
          />
          <CardContent style={{ paddingBottom: 0 }} sx={{ padding: 0, marginTop: 3 }}>
            <TableComponent
              component={'TABLE'}
              tableKey={tableKey}
              refreshNumber={refreshNumber}
              refreshData={refreshData}
              withSearch={false}
              url={PATH_DOCKER + `/images/${connectionId}`}
              indexCol={true}
              selectCol={false}
              actions={{ editBtn: false, deleteBtn: false, popupEdit: false }}
              headLabel={headerColums}
            />
          </CardContent>

          {/* <PopupFormTable
            rowId={formConfig.defaultValues?.id}
            open={formConfig.open}
            handleCloseForm={handleCloseForm}
            refreshData={refreshData}
            action={formConfig.action}
            defaultValues={formConfig.defaultValues}
            baseUrl={PATH_SERVER}
            schema={FormTableSchema}
            render={({ isSubmitting }: { isSubmitting: boolean }) => {
              return (
                <>
                  <DialogTitle>{formConfig.title}</DialogTitle>
                  <ServerForm
                    defaultValues={formConfig.defaultValues}
                    action={formConfig.action}
                    handleCloseForm={handleCloseForm}
                    isSubmitting={isSubmitting}
                  />
                </>
              );
            }}
          /> */}
        </Card>
      </Grid>
    </Grid>
  );
};

type ImageActionProps = {
  row: Record<string, any>;
  updateRowData?: (
    rowId: string,
    values: Record<string, any>,
    action: 'ADD' | 'REMOVE' | 'UPDATE'
  ) => void;
  connectionId: string;
};
const ImageAction = ({ row, updateRowData, connectionId }: ImageActionProps) => {
  const [data, setData] = useState(row);

  useEffect(() => {
    setData(row);
  }, [data]);

  return (
    <Box display="flex">
      <Tooltip title={t(LanguageKey.docker.imageRun)}>
        <IconAction
          rowId={data?.id!}
          baseUrl={`${PATH_DOCKER}/image/${connectionId}/run`}
          params={{ imageName: data.name }}
          action="POST"
          updateRowData={(rowId, values, action) => {
            updateRowData && updateRowData(rowId, values, action);
          }}
          icon="si:actions-fill"
        />
      </Tooltip>
      <IconAction
        rowId={data?.id!}
        baseUrl={`${PATH_DOCKER}/image/${connectionId}/${data?.id}`}
        action="DELETE"
        updateRowData={(rowId, values, action) => {
          updateRowData && updateRowData(rowId, values, action);
        }}
        icon="solar:trash-bin-trash-bold"
      />
    </Box>
  );
};

type IconActionProps = {
  action: 'POST' | 'DELETE';
  icon: string;
  rowId: string;
  baseUrl: string;
  params?: Record<string, any>;
  updateRowData?: (
    rowId: string,
    values: Record<string, any>,
    action: 'ADD' | 'REMOVE' | 'UPDATE'
  ) => void;
};

const IconAction = (props: IconActionProps) => {
  const { rowId, action, params, icon, baseUrl, updateRowData } = props;
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
          updateRowData &&
            updateRowData(rowId!, res?.result, action === 'DELETE' ? 'REMOVE' : 'UPDATE');

          enqueueSnackbar(t(LanguageKey.notify.successUpdate), {
            variant: 'success',
            action: (key) => (
              <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />
            ),
          });
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
          sx={{ color: 'primary.main', position: 'absolute', top: 8, left: 8, zIndex: 1 }}
        />
      )}
    </Box>
  );
};

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
    id: 'container',
    label: t(LanguageKey.docker.containerNameItem),
    type: 'custom',
    align: 'center',
    width: '10%',
    render: ({ row }) => {
      return <>{row?.container_name || row?.container_id || '-'}</>;
    },
  },

  {
    id: 'created',
    label: t(LanguageKey.docker.imageCreatedItem),
    type: 'text',
    align: 'center',
    width: '30%',
  },
];
