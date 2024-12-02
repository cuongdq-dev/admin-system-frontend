import { LoadingButton } from '@mui/lab';
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { t } from 'i18next';
import { useState } from 'react';
import { HttpMethod } from 'src/api-core';
import { PATH_SERVER } from 'src/api-core/path';
import { PopupFormTable } from 'src/components/form/form-table';
import { PasswordText, RHFTextField } from 'src/components/hook-form/RHFTextField';
import { Iconify } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { LanguageKey } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import * as Yup from 'yup';
type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: IServer;
  action?: HttpMethod;
};
export function ListView() {
  const tableKey = 'server_table';
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
      title: t(LanguageKey.form.updateLabel),
      defaultValues: row,
      action,
    }));
  };

  const handleCloseForm = () => {
    setFormConfig({ open: false, title: '' });
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          {t(LanguageKey.server.tableTitle)}
        </Typography>
        <Button
          onClick={() =>
            setFormConfig({
              open: true,
              title: t(LanguageKey.form.createLabel),
              action: HttpMethod.POST,
            })
          }
          color="inherit"
          size="medium"
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          {t(LanguageKey.server.addNewButton)}
        </Button>
      </Box>

      <Card>
        <TableComponent
          tableKey={tableKey}
          refreshNumber={refreshNumber}
          url={PATH_SERVER}
          indexCol={true}
          selectCol={true}
          refreshData={refreshData}
          handleClickOpenForm={handleClickOpenForm}
          actions={{ editBtn: true, deleteBtn: true, popupEdit: true }}
          headLabel={[
            {
              id: 'name',
              label: t(LanguageKey.server.nameItem),
              sort: true,
              type: 'text',
              width: '30%',
            },
            {
              id: 'host',
              label: t(LanguageKey.server.hostItem),
              sort: true,
              type: 'text',
              width: '30%',
            },
            {
              id: 'port',
              label: t(LanguageKey.server.portItem),
              sort: false,
              type: 'text',
              width: '20%',
            },
            {
              id: 'user',
              label: t(LanguageKey.server.userItem),
              sort: true,
              type: 'text',
              width: '20%',
            },
          ]}
        />
      </Card>

      <PopupFormTable
        rowId={formConfig.defaultValues?.id}
        open={formConfig.open}
        handleCloseForm={handleCloseForm}
        refreshData={refreshData}
        action={formConfig.action}
        defaultValues={formConfig.defaultValues}
        baseUrl={PATH_SERVER}
        schema={{
          name: Yup.string().required('Email is required'),
          host: Yup.string().required('host is required'),
          port: Yup.string().required('port is required'),
          password: Yup.string().required('password is required'),
          user: Yup.string().required('user is required'),
        }}
        render={({ isSubmitting }: { isSubmitting: boolean }) => {
          return (
            <>
              <DialogTitle>{formConfig.title}</DialogTitle>
              <DialogContent>
                <Box
                  gap={4}
                  paddingTop={1}
                  component={'div'}
                  display={'flex'}
                  flexDirection={'column'}
                >
                  <RHFTextField
                    defaultValue={formConfig.defaultValues?.name}
                    id="name"
                    name="name"
                    label={t(LanguageKey.server.nameItem)}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <RHFTextField
                    defaultValue={formConfig.defaultValues?.host}
                    id="host"
                    name="host"
                    label={t(LanguageKey.server.hostItem)}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <RHFTextField
                    defaultValue={formConfig.defaultValues?.port}
                    id="port"
                    name="port"
                    label={t(LanguageKey.server.portItem)}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <RHFTextField
                    defaultValue={formConfig.defaultValues?.user}
                    id="user"
                    name="user"
                    label={t(LanguageKey.server.userItem)}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <PasswordText
                    defaultValue={formConfig.defaultValues?.password}
                    id="password"
                    name="password"
                    label={t(LanguageKey.server.passwordItem)}
                    fullWidth
                    variant="outlined"
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button variant="outlined" color="inherit" onClick={handleCloseForm}>
                  {t(LanguageKey.button.cancel)}
                </Button>

                <LoadingButton
                  type="submit"
                  color="inherit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  {formConfig.action === HttpMethod.PATCH
                    ? t(LanguageKey.button.update)
                    : t(LanguageKey.button.create)}
                </LoadingButton>
              </DialogActions>
            </>
          );
        }}
      />
    </DashboardContent>
  );
}
