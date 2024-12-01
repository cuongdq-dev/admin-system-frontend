import { LoadingButton } from '@mui/lab';
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HttpMethod } from 'src/api-core';
import { PATH_SERVER } from 'src/api-core/path';
import { PopupFormTable } from 'src/components/form/form-table';
import { PasswordText, RHFTextField } from 'src/components/hook-form/RHFTextField';
import { Iconify } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { DashboardContent } from 'src/layouts/dashboard';
import * as Yup from 'yup';

type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: IServer;
  action?: HttpMethod;
};
export function ListView() {
  const { t } = useTranslation();

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
      title: t('update_form_label'),
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
          {t('server_table_title')}
        </Typography>
        <Button
          onClick={() =>
            setFormConfig({ open: true, title: t('create_form_label'), action: HttpMethod.POST })
          }
          color="inherit"
          size="medium"
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          {t('new_server_button')}
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
            { id: 'name', label: t('server_item_name'), sort: true, type: 'text' },
            { id: 'host', label: t('server_item_host'), sort: true, type: 'text' },
            { id: 'port', label: t('server_item_port'), sort: false, type: 'text' },
            { id: 'user', label: t('server_item_user'), sort: true, type: 'text' },
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
          host: Yup.string().required('Password is required'),
          port: Yup.string().required('Password is required'),
          password: Yup.string().required('Password is required'),
          user: Yup.string().required('Password is required'),
        }}
        render={({ isSubmitting }: { isSubmitting: boolean }) => {
          return (
            <>
              <DialogTitle>{formConfig.title}</DialogTitle>
              <DialogContent>
                <Box
                  gap={2}
                  marginTop={1}
                  component={'div'}
                  display={'flex'}
                  flexDirection={'column'}
                >
                  <RHFTextField
                    defaultValue={formConfig.defaultValues?.name}
                    id="name"
                    name="name"
                    label={t('server_item_name')}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <RHFTextField
                    defaultValue={formConfig.defaultValues?.host}
                    id="host"
                    name="host"
                    label={t('server_item_host')}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <RHFTextField
                    defaultValue={formConfig.defaultValues?.port}
                    id="port"
                    name="port"
                    label={t('server_item_port')}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <RHFTextField
                    defaultValue={formConfig.defaultValues?.user}
                    id="user"
                    name="user"
                    label={t('server_item_user')}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <PasswordText
                    defaultValue={formConfig.defaultValues?.password}
                    id="password"
                    name="password"
                    label={t('server_item_password')}
                    fullWidth
                    variant="outlined"
                  />
                </Box>
              </DialogContent>
              <DialogActions style={{ padding: 20 }}>
                <Button variant="outlined" color="inherit" onClick={handleCloseForm}>
                  {t('cancel_button')}
                </Button>

                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {formConfig.action === HttpMethod.PATCH ? t('update_button') : t('create_button')}
                </LoadingButton>
              </DialogActions>
            </>
          );
        }}
      />
    </DashboardContent>
  );
}
