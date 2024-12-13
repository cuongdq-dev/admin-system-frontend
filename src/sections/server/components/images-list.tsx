import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_DOCKER } from 'src/api-core/path';
import { ButtonDismissNotify, IconButtonDelete } from 'src/components/button';
import { FormProvider } from 'src/components/hook-form';
import { RefreshIcon } from 'src/components/icon';
import { Iconify, IconifyProps } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { HeadLabelProps } from 'src/components/table/type';
import { LanguageKey, StoreName } from 'src/constants';
import { usePageStore } from 'src/store/store';
import { useShallow } from 'zustand/react/shallow';
import { Transition } from '../../../components/dialog';
import { ImageForm } from './image-form';

type ImagesDockerProps = { connectionId?: string };

export const ImagesDockerComponent = (props: ImagesDockerProps) => {
  const { connectionId } = props;
  const storeName = StoreName.IMAGES;

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => setRefreshList(storeName, refreshNumber + 1);

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
              storeName={storeName}
              component={'TABLE'}
              refreshData={refreshData}
              withSearch={false}
              url={PATH_DOCKER + `/images/${connectionId}`}
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

type ImageActionProps = {
  row: IImageDocker;
  updateRowData?: (
    rowId: string,
    values: Record<string, any>,
    action: 'ADD' | 'REMOVE' | 'UPDATE'
  ) => void;
  connectionId: string;
};
const ImageAction = ({ row, updateRowData, connectionId }: ImageActionProps) => {
  const [loading, setLoading] = useState(false);

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![StoreName.REPOSIROTY]?.list }))
  );

  return (
    <Box
      sx={{
        pointerEvents: loading ? 'none' : 'auto',
        display: 'flex',
        gap: 1,
        justifyContent: 'flex-end',
      }}
    >
      {row.id && !row.name?.includes('<none>') && (
        <>
          {row.container_id ? (
            <RunAction
              expanded="optional_settings"
              actionTitle={t(LanguageKey.docker.imageStop)}
              connectionId={connectionId}
              withBuild={true}
              icon={{ icon: 'solar:pause-bold', color: 'primary.main' }}
              headerIcon={{ icon: 'skill-icons:docker' }}
              action={HttpMethod.POST}
              baseUrl={PATH_DOCKER + `/image/${connectionId}/down`}
              handleLoading={setLoading}
              updateRowData={updateRowData}
              row={row}
              title={t(LanguageKey.repository.downRepositoryTitle)}
              description={t(LanguageKey.repository.downRepositoryDescription)}
            />
          ) : (
            <RunAction
              expanded="optional_settings"
              actionTitle={t(LanguageKey.docker.imageRun)}
              withBuild={true}
              connectionId={connectionId}
              icon={{ icon: 'solar:play-bold', color: 'primary.main' }}
              headerIcon={{ icon: 'skill-icons:docker' }}
              row={row}
              action={HttpMethod.POST}
              baseUrl={PATH_DOCKER + `/image/${connectionId}/up`}
              handleLoading={setLoading}
              updateRowData={updateRowData}
              title={t(LanguageKey.repository.upRepositoryTitle)}
              description={t(LanguageKey.repository.upRepositoryDescription)}
            />
          )}
        </>
      )}
      <IconButtonDelete
        baseUrl={`${PATH_DOCKER}/image/${connectionId}/${row?.id}`}
        rowId={row?.id}
        handleLoading={setLoading}
        handleDelete={(id, updateData, action) => {
          updateRowData && updateRowData(id, updateData, action);
          setRefreshList(StoreName.REPOSIROTY, refreshNumber + 1);
        }}
      />
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
    id: 'server_path',
    label: t(LanguageKey.repository.serverPathItem),
    type: 'custom',
    align: 'left',
    render: ({ row }) => {
      const values = row?.server_path?.split('/');
      return (
        <Tooltip title={row?.server_path || ''}>
          <Typography noWrap>{values[values?.length - 1] || '-'}</Typography>
        </Tooltip>
      );
    },
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
    width: '20%',
    render: ({ row }) => {
      return (
        <Tooltip title={row?.container_name || ''}>
          <Typography noWrap>{row?.container_id || '-'}</Typography>
        </Tooltip>
      );
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

type IconActionProps = {
  title: string;
  description?: string;
  expanded?: 'basic_information' | 'optional_settings';
  connectionId?: string;
  withBuild?: boolean;
  action: HttpMethod;
  icon: IconifyProps;
  headerIcon: IconifyProps;
  actionTitle: string;
  handleLoading: (loading: boolean) => void;
  baseUrl: string;
  row?: IImageDocker;
  updateRowData?: (
    rowId: string,
    values: Record<string, any>,
    action: 'ADD' | 'REMOVE' | 'UPDATE'
  ) => void;
};

const RunAction = (props: IconActionProps) => {
  const {
    row,
    action,
    title,
    description = row?.name,
    icon,
    headerIcon,
    actionTitle = t(LanguageKey.button.create),
    handleLoading,
    baseUrl,
    updateRowData,
  } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  const descriptionElementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const methods = useForm({
    defaultValues: row as any,
  });

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![StoreName.CONTAINER]?.list }))
  );

  const onSubmit = async () => {
    handleLoading(true);
    setLoading(true);
    setOpen(false);
    invokeRequest({
      method: action,
      baseURL: baseUrl,
      params: {
        imageId: row?.id,
        iamgeName: row?.name,
        serverPath: row?.server_path,
        serviceName: row?.service?.serviceName,
      },
      onHandleError: () => {
        handleLoading(false);
        setLoading(false);
      },
      onSuccess(res) {
        handleLoading(false);
        setLoading(false);
        setRefreshList(StoreName.CONTAINER, refreshNumber + 1);
        updateRowData && updateRowData(row?.id!, res, 'UPDATE');
        enqueueSnackbar(t(LanguageKey.notify.successUpdate), {
          variant: 'success',
          action: (key) => <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />,
        });
      },
    });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton onClick={() => setOpen(true)}>
        <Iconify {...icon} />
      </IconButton>
      {loading && (
        <CircularProgress
          size={20}
          sx={{ color: 'primary.main', position: 'absolute', top: 8, left: 8, zIndex: 1 }}
        />
      )}

      <Dialog
        PaperProps={{ sx: { borderRadius: 3 } }}
        TransitionComponent={Transition}
        maxWidth={'sm'}
        open={open}
        fullWidth
        onClose={() => setOpen(false)}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <Stack marginBottom={2} display="flex" flexDirection="row" justifyItems="center">
            <Iconify width={50} {...headerIcon} />
            <Box marginLeft={2}>
              <Typography>{title}</Typography>
              <Typography variant="caption">{description}</Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <FormProvider methods={methods}>
              <ImageForm
                defaultValues={{
                  ...row,
                  repository: { ...row?.repository, services: [row?.service!] },
                }}
              />
            </FormProvider>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ paddingTop: 4 }}>
          <Button color="inherit" variant="outlined" onClick={() => setOpen(false)} autoFocus>
            {t(LanguageKey.button.cancel)}
          </Button>
          <LoadingButton onClick={onSubmit} color="inherit" variant="contained">
            {actionTitle}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
