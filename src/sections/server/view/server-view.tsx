import { Button, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { HttpMethod } from 'src/api-core';
import { PATH_SERVER } from 'src/api-core/path';
import { PopupFormTable } from 'src/components/form/form-table';
import { PasswordText } from 'src/components/hook-form/RHFTextField';
import { Iconify } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { DashboardContent } from 'src/layouts/dashboard';

type State = { id: string; code: string; name: string; description: string }[];
type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: {
    id?: string;
    host?: string;
    name?: string;
    port?: string;
    password?: string;
    user?: string;
  };
  action?: HttpMethod;
};
export function ServerView() {
  const { t } = useTranslation();

  const tableKey = 'server_table';
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
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
        open={formConfig.open}
        handleCloseForm={handleCloseForm}
        refreshData={refreshData}
        action={formConfig.action}
        baseUrl={
          PATH_SERVER +
          (formConfig.action === HttpMethod.PATCH
            ? '/update/' + formConfig.defaultValues?.id
            : '/create')
        }
        render={() => {
          return (
            <>
              <DialogTitle>{formConfig.title}</DialogTitle>
              <DialogContent>
                <Box gap={2} component={'div'} display={'flex'} flexDirection={'column'}>
                  <TextField
                    defaultValue={formConfig.defaultValues?.name}
                    id="name"
                    name="name"
                    label={t('server_item_name')}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <TextField
                    defaultValue={formConfig.defaultValues?.host}
                    id="host"
                    name="host"
                    label={t('server_item_host')}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <TextField
                    defaultValue={formConfig.defaultValues?.port}
                    id="port"
                    name="port"
                    label={t('server_item_port')}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <TextField
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
                <Button variant="contained" type="submit">
                  {formConfig.action === HttpMethod.PATCH ? t('update_button') : t('create_button')}
                </Button>
              </DialogActions>
            </>
          );
        }}
      />
    </DashboardContent>
  );
}
