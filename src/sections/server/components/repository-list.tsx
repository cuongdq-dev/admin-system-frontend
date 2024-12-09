import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material';
import { t } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import { HttpMethod } from 'src/api-core';
import { PATH_REPOSITORY } from 'src/api-core/path';
import { PopupFormTable } from 'src/components/form/form-table';
import { RefreshIcon } from 'src/components/icon';
import { Iconify } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { HeadLabelProps } from 'src/components/table/type';
import { LanguageKey } from 'src/constants';
import * as Yup from 'yup';

import { Dialog, Stack, Typography } from '@mui/material';
import { Transition } from '../../../components/dialog';
import { RunImageForm } from './image-form';
import { RepositoryForm } from './repository-form';

type FormConfigState = {
  open: boolean;
  title?: string;
  description?: string;
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
    width: '100%',
  },
];

export const RepositoryComponent = (props: RepositoryComponentProps) => {
  const { serverId, connectionId } = props;
  const tableKey = 'repository_key';
  const [refreshNumber, setRefresh] = useState<number>(0);

  const [formConfig, setFormConfig] = useState<FormConfigState>({
    open: false,
    title: '',
    description: '',
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
          ? t(LanguageKey.repository.createFormTitle)
          : t(LanguageKey.repository.updateFormTitle),
      description:
        action == HttpMethod.POST
          ? t(LanguageKey.repository.createFormDescription)
          : t(LanguageKey.repository.updateFormDescription),
      defaultValues: row,
      action,
    }));
  };

  const handleCloseForm = () => {
    setFormConfig({ open: false, title: '' });
  };

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
              headLabel={HeadLabel}
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
              <DialogTitle id="scroll-dialog-title">
                <Stack marginBottom={2} display="flex" flexDirection="row" justifyItems="center">
                  <Iconify width={50} icon="mdi:source-repositories" />
                  <Box marginLeft={2}>
                    <Typography>{formConfig.title}</Typography>
                    <Typography>{formConfig.description}</Typography>
                  </Box>
                </Stack>
              </DialogTitle>
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

type IconActionProps = {
  action: 'POST' | 'DELETE';
  icon: string;
  handleClick: (loading: boolean) => void;
  baseUrl: string;
  row?: Record<string, any>;
  updateRowData?: (
    rowId: string,
    values: Record<string, any>,
    action: 'ADD' | 'REMOVE' | 'UPDATE'
  ) => void;
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
              <Typography variant="caption">{row?.name}</Typography>
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
