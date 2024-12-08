import { yupResolver } from '@hookform/resolvers/yup';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_DOCKER } from 'src/api-core/path';
import { ButtonDismissNotify } from 'src/components/button';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { RefreshIcon } from 'src/components/icon';
import { Iconify } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { HeadLabelProps } from 'src/components/table/type';
import { LanguageKey } from 'src/constants';
import * as Yup from 'yup';
import { Transition } from '../../../components/dialog';
import { RunImageForm } from './image-form';

type ImagesDockerProps = { connectionId?: string };

export const ImagesDockerComponent = (props: ImagesDockerProps) => {
  const { connectionId } = props;
  const tableKey = 'images_docker_key';
  const [refreshNumber, setRefresh] = useState<number>(0);

  const refreshData = () => {
    setRefresh(refreshNumber + 1);
  };

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
  const [loading, setLoading] = useState(false);

  return (
    <Box sx={{ pointerEvents: loading ? 'none' : 'auto' }} display="flex">
      <Tooltip title={t(LanguageKey.docker.imageRun)}>
        <RunAction
          handleClick={(loading) => setLoading(loading)}
          row={row}
          baseUrl={`${PATH_DOCKER}/image/${connectionId}/run`}
          params={{ imageName: row.name }}
          action="POST"
          updateRowData={(rowId, values, action) => {
            updateRowData && updateRowData(rowId, values, action);
          }}
          icon="si:actions-fill"
        />
      </Tooltip>
      <DeleteAction
        row={row}
        handleClick={(loading) => setLoading(loading)}
        baseUrl={`${PATH_DOCKER}/image/${connectionId}/${row?.id}`}
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
  handleClick: (loading: boolean) => void;
  baseUrl: string;
  row?: Record<string, any>;
  params?: Record<string, any>;
  updateRowData?: (
    rowId: string,
    values: Record<string, any>,
    action: 'ADD' | 'REMOVE' | 'UPDATE'
  ) => void;
};

const DeleteAction = (props: IconActionProps) => {
  const { action, params, row, icon, baseUrl, handleClick, updateRowData } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleClick(loading);
  }, [loading]);

  const handleButtonClick = () => {
    if (!loading) {
      setLoading(true);

      invokeRequest({
        method: HttpMethod[action],
        baseURL: baseUrl,
        params: params,
        onHandleError: (response) => {
          setLoading(false);
        },
        onSuccess(res) {
          setLoading(false);
          updateRowData &&
            updateRowData(row?.id!, res?.result, action === 'DELETE' ? 'REMOVE' : 'UPDATE');

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
      <IconButton onClick={() => setOpen(true)}>
        <Iconify icon={icon} />
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
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{t(LanguageKey.form.deleteLabel)}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t(LanguageKey.form.deleteTitle)}</DialogContentText>
        </DialogContent>
        <DialogActions style={{ padding: 20 }}>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              handleButtonClick();
              setOpen(false);
            }}
          >
            {t(LanguageKey.button.delete)}
          </Button>
          <Button color="inherit" variant="outlined" onClick={() => setOpen(false)} autoFocus>
            {t(LanguageKey.button.cancel)}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const RunAction = (props: IconActionProps) => {
  const { row, icon, handleClick, baseUrl, updateRowData } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const descriptionElementRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    handleClick(loading);
  }, [loading]);

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton onClick={() => setOpen(true)}>
        <Iconify icon={icon} />
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
            <Iconify width={50} icon="catppuccin:devcontainer" />
            <Box marginLeft={2}>
              <Typography>Run a new container</Typography>
              <Typography variant="caption">
                {row?.name}:{row?.tag}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <RunImageForm
          row={row}
          id={row?.id}
          baseUrl={baseUrl}
          handleLoading={setLoading}
          handleOpen={setOpen}
          updateRowData={updateRowData}
        />
      </Dialog>
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
