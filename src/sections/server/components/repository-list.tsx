import { yupResolver } from '@hookform/resolvers/yup';
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
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_REPOSITORY } from 'src/api-core/path';
import { ButtonDelete, ButtonDismissNotify } from 'src/components/button';
import { RefreshIcon } from 'src/components/icon';
import { Iconify, IconifyProps } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { HeadLabelProps } from 'src/components/table/type';
import { LanguageKey } from 'src/constants';
import * as Yup from 'yup';
import { Transition } from '../../../components/dialog';
import { FormProvider } from '../../../components/hook-form';
import { RepositoryForm } from './repository-form';
const FormTableSchema = {
  name: Yup.string().required('Name is required'),
  email: Yup.string().required('Email is required'),
  username: Yup.string().required('Username is required'),
  github_url: Yup.string().required('port is required'),
  fine_grained_token: Yup.string().required('Token is required'),
};

type RepositoryComponentProps = {
  serverId: string;
  connectionId?: string;
};

const HeadLabel: HeadLabelProps[] = [
  {
    id: 'name',
    label: t(LanguageKey.repository.nameItem),
    type: 'text',
    width: '10%',
  },
  {
    id: 'email',
    label: t(LanguageKey.repository.emailItem),
    width: '10%',
    type: 'text',
  },
  {
    id: 'username',
    label: t(LanguageKey.repository.usernameItem),
    width: '10%',
    type: 'text',
  },
  {
    id: 'server_path',
    label: t(LanguageKey.repository.serverPathItem),
    type: 'text',
    width: '20%',
  },
  {
    id: 'images',
    label: t(LanguageKey.repository.imagesItem),
    type: 'string-array',
    width: '20%',
  },
];

export const RepositoryComponent = (props: RepositoryComponentProps) => {
  const { serverId, connectionId } = props;
  const tableKey = 'repository_key';
  const [refreshNumber, setRefresh] = useState<number>(0);

  const refreshData = () => {
    setRefresh(refreshNumber + 1);
  };

  const headLabel = connectionId
    ? HeadLabel.concat({
        id: 'action',
        label: '',
        type: 'custom',
        render: ({ row, updateRowData }) => {
          return (
            <ActionGroup
              row={row as IRepository}
              updateRowData={updateRowData}
              connectionId={connectionId}
            />
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
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1}>
                  {t(LanguageKey.repository.repositoryListTitle)}

                  <RunAction
                    expanded="basic_information"
                    actionTitle={t(LanguageKey.button.clone)}
                    withBuild={false}
                    icon={{ icon: 'lets-icons:add-duotone', color: 'primary.main' }}
                    headerIcon={{ icon: 'catppuccin:devcontainer' }}
                    action={HttpMethod.POST}
                    baseUrl={PATH_REPOSITORY + `/${connectionId}/${serverId}/create`}
                    handleLoading={() => {}}
                    updateRowData={() => setRefresh(refreshNumber + 1)}
                    title={t(LanguageKey.repository.cloneRepositoryTitle)}
                    description={t(LanguageKey.repository.cloneRepositoryDescription)}
                  />
                </Box>

                <IconButton size="medium" sx={{ marginLeft: 1 }} onClick={refreshData}>
                  <RefreshIcon icon={'mdi:refresh'} />
                </IconButton>
              </Box>
            }
          />
          <CardContent style={{ paddingBottom: 0 }} sx={{ padding: 0, marginTop: 3 }}>
            <TableComponent
              refreshNumber={refreshNumber}
              refreshData={refreshData}
              component={'TABLE'}
              tableKey={tableKey}
              withSearch={false}
              url={PATH_REPOSITORY + `/${serverId}`}
              indexCol={true}
              selectCol={false}
              headLabel={headLabel}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

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
  row?: IRepository;
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
    withBuild = true,
    expanded,
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
    resolver: yupResolver(Yup.object().shape(FormTableSchema)),
  });
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset();
  }, [open]);

  const onSubmit = async (values: Record<string, any>) => {
    handleLoading(true);
    setLoading(true);
    setOpen(false);
    invokeRequest({
      method: action,
      baseURL: baseUrl,
      params: { ...values, repositoryId: row?.id },
      onHandleError: () => {
        handleLoading(false);
        setLoading(false);
      },
      onSuccess(res) {
        handleLoading(false);
        setLoading(false);
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
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <RepositoryForm withBuild={withBuild} defaultValues={row} expanded={expanded} />
            </FormProvider>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ paddingTop: 4 }}>
          <Button color="inherit" variant="outlined" onClick={() => setOpen(false)} autoFocus>
            {t(LanguageKey.button.cancel)}
          </Button>
          <LoadingButton onClick={handleSubmit(onSubmit)} color="inherit" variant="contained">
            {actionTitle}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

type ActionGroupProp = {
  connectionId?: string;
  row?: Record<string, any>;
  updateRowData?: (
    rowId: string,
    values: Record<string, any>,
    action: 'ADD' | 'REMOVE' | 'UPDATE'
  ) => void;
};
const ActionGroup = ({ connectionId, row, updateRowData }: ActionGroupProp) => {
  const [loading, setLoading] = useState(false);

  return (
    <Box
      sx={{
        pointerEvents: loading ? 'none' : 'auto',
        display: 'flex',
        gap: 1,
        justifyContent: 'flex-end',
      }}
    >
      {connectionId && row?.server_path && (
        <RunAction
          actionTitle={t(LanguageKey.button.submit)}
          handleLoading={(load) => setLoading(load)}
          connectionId={connectionId}
          title={t(LanguageKey.repository.buildRepositoryTitle)}
          description={t(LanguageKey.repository.buildRepositoryDescription)}
          action={HttpMethod.PATCH}
          updateRowData={updateRowData}
          baseUrl={`${PATH_REPOSITORY}/${connectionId}/build/${row?.id}`}
          row={{ ...row, with_env: true, with_docker_compose: true } as any}
          expanded="optional_settings"
          icon={{ icon: 'material-symbols:build-circle' }}
          headerIcon={{ icon: 'skill-icons:docker' }}
        />
      )}

      {connectionId && (
        <RunAction
          actionTitle={t(LanguageKey.button.pull)}
          handleLoading={(load) => setLoading(load)}
          connectionId={connectionId}
          title={t(LanguageKey.repository.pullRepositoryTitle)}
          description={t(LanguageKey.repository.pullRepositoryDescription)}
          action={HttpMethod.PATCH}
          withBuild={true}
          updateRowData={updateRowData}
          baseUrl={`${PATH_REPOSITORY}/${connectionId}/clone/${row?.id}`}
          row={{ ...row, with_env: false, with_docker_compose: false } as any}
          expanded="basic_information"
          icon={{ icon: 'octicon:feed-pull-request-open-16' }}
          headerIcon={{ icon: 'octicon:feed-pull-request-open-16' }}
        />
      )}

      <RunAction
        withBuild={false}
        actionTitle={t(LanguageKey.button.update)}
        handleLoading={(load) => setLoading(load)}
        connectionId={connectionId}
        title={t(LanguageKey.repository.updateFormTitle)}
        action={HttpMethod.PATCH}
        updateRowData={updateRowData}
        baseUrl={`${PATH_REPOSITORY}/update/${row?.id}`}
        row={row}
        expanded="basic_information"
        icon={{ icon: 'basil:edit-outline' }}
        headerIcon={{ icon: 'lucide:save-all' }}
      />

      <ButtonDelete
        baseUrl={`${PATH_REPOSITORY}/${connectionId}/delete/${row?.id}`}
        rowId={row?.id}
        handleLoading={(load) => setLoading(load)}
        handleDelete={() => {
          updateRowData && updateRowData(row?.id, {}, 'REMOVE');
        }}
      />
    </Box>
  );
};
