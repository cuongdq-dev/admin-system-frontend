import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_DOCKER, PATH_REPOSITORY } from 'src/api-core/path';
import { ButtonDismissNotify } from 'src/components/button';
import { PopupFormTable } from 'src/components/form/form-table';
import { RHFTextField } from 'src/components/hook-form';
import { RefreshIcon } from 'src/components/icon';
import { Iconify } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { HeadLabelProps } from 'src/components/table/type';
import { LanguageKey } from 'src/constants';
import * as Yup from 'yup';

type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: IRepository;
  action?: HttpMethod;
};

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
    width: '20%',
  },
  {
    id: 'email',
    label: t(LanguageKey.repository.emailItem),
    width: '20%',
    type: 'text',
  },

  {
    id: 'username',
    label: t(LanguageKey.repository.usernameItem),
    width: '20%',
    type: 'text',
  },
  {
    id: 'github_url',
    label: t(LanguageKey.repository.githubUrlItem),
    type: 'text',
  },
];

export const RepositoryComponent = (props: RepositoryComponentProps) => {
  const { serverId, connectionId } = props;
  const tableKey = 'repository_key';
  const [refreshNumber, setRefresh] = useState<number>(0);

  const [formConfig, setFormConfig] = useState<FormConfigState>({
    open: false,
    title: '',
    defaultValues: {},
    action: HttpMethod.PATCH,
  });

  const refreshData = () => {
    setRefresh(refreshNumber + 1);
    handleCloseForm();
  };
  const handleClickOpenForm = (row: Record<string, any>, action: HttpMethod) => {
    setFormConfig((s) => ({
      ...s,
      open: true,
      title:
        action == HttpMethod.POST
          ? t(LanguageKey.form.createLabel)
          : t(LanguageKey.form.updateLabel),
      defaultValues: row,
      action,
    }));
  };

  const handleCloseForm = () => {
    setFormConfig({ open: false, title: '' });
  };

  const headerColums = connectionId
    ? HeadLabel.concat({
        id: 'action',
        label: '',
        width: '5%',
        type: 'custom',
        render: ({ row, refreshData }) => {
          return (
            <GitCloneComponent row={row} refreshData={refreshData} connectionId={connectionId} />
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
                <Box>
                  {t(LanguageKey.repository.repositoryListTitle)}
                  <IconButton
                    size="medium"
                    sx={{ marginLeft: 1 }}
                    onClick={() => {
                      handleClickOpenForm({}, HttpMethod.POST);
                    }}
                  >
                    <Iconify color={'primary.main'} icon="simple-line-icons:plus" />
                  </IconButton>
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
              handleClickOpenForm={handleClickOpenForm}
              url={PATH_REPOSITORY + `/${serverId}`}
              indexCol={true}
              selectCol={false}
              actions={{ editBtn: false, deleteBtn: true, popupEdit: true }}
              headLabel={headerColums}
            />
          </CardContent>
        </Card>
      </Grid>

      <PopupFormTable
        rowId={formConfig.defaultValues?.id}
        open={formConfig.open}
        handleCloseForm={handleCloseForm}
        refreshData={refreshData}
        action={formConfig.action}
        defaultValues={formConfig.defaultValues}
        baseUrl={PATH_REPOSITORY + `/${serverId}`}
        schema={FormTableSchema}
        render={({ isSubmitting }: { isSubmitting: boolean }) => {
          return (
            <>
              <DialogTitle>{formConfig.title}</DialogTitle>
              <RepositoryForm
                defaultValues={formConfig.defaultValues}
                action={formConfig.action}
                handleCloseForm={handleCloseForm}
                isSubmitting={isSubmitting}
              />
            </>
          );
        }}
      />
    </Grid>
  );
};

type RepositoryFormProps = {
  defaultValues?: IRepository;
  isSubmitting?: boolean;
  action?: HttpMethod;
  handleCloseForm: () => void;
};
const RepositoryForm = (props: RepositoryFormProps) => {
  const { defaultValues, action = HttpMethod.PATCH, isSubmitting, handleCloseForm } = props;
  return (
    <>
      <DialogContent>
        <Box gap={4} paddingTop={1} component={'div'} display={'flex'} flexDirection={'column'}>
          <RHFTextField
            defaultValue={defaultValues?.name}
            id="name"
            name="name"
            label={t(LanguageKey.repository.nameItem)}
            type="text"
            fullWidth
            variant="outlined"
          />

          <RHFTextField
            defaultValue={defaultValues?.email}
            id="email"
            name="email"
            label={t(LanguageKey.repository.emailItem)}
            type="email"
            fullWidth
            variant="outlined"
          />

          <RHFTextField
            defaultValue={defaultValues?.username}
            id="username"
            name="username"
            label={t(LanguageKey.repository.usernameItem)}
            type="text"
            fullWidth
            variant="outlined"
          />

          <RHFTextField
            defaultValue={defaultValues?.github_url}
            id="github_url"
            name="github_url"
            label={t(LanguageKey.repository.githubUrlItem)}
            type="text"
            fullWidth
            variant="outlined"
          />

          <RHFTextField
            defaultValue={defaultValues?.fine_grained_token}
            id="fine_grained_token"
            name="fine_grained_token"
            label={t(LanguageKey.repository.fineGrainedTokenItem)}
            type="text"
            fullWidth
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleCloseForm}>
          {t(LanguageKey.button.cancel)}
        </Button>

        <LoadingButton type="submit" color="inherit" variant="contained" loading={isSubmitting}>
          {action === HttpMethod.PATCH
            ? t(LanguageKey.button.update)
            : t(LanguageKey.button.create)}
        </LoadingButton>
      </DialogActions>
    </>
  );
};

const GitCloneComponent = ({
  row,
  refreshData,
  connectionId,
}: {
  connectionId?: string;
  row?: IRepository;
  refreshData?: () => void;
}) => {
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
        method: HttpMethod.POST,
        baseURL: PATH_DOCKER + `/image/${connectionId}/build`,
        params: {},
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
    <Tooltip title={t(LanguageKey.repository.repositoryBuildImageButton)}>
      <Box sx={{ position: 'relative' }}>
        <IconButton onClick={handleButtonClick}>
          <Iconify color="" icon="codicon:git-pull-request-go-to-changes" />
        </IconButton>
        {loading && (
          <CircularProgress
            size={32}
            sx={{ color: 'primary.main', position: 'absolute', top: 2, left: 2, zIndex: 1 }}
          />
        )}
      </Box>
    </Tooltip>
  );
};
