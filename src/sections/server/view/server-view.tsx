import { Button, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { HttpMethod } from 'src/api-core';
import { PATH_SERVER_LIST } from 'src/api-core/path';
import { PopupFormTable } from 'src/components/form/form-table';
import { Iconify } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { DashboardContent } from 'src/layouts/dashboard';

type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: Record<string, any>;
  action?: HttpMethod;
};
export function ServerView() {
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
    setFormConfig((s) => ({ ...s, open: true, title: 'Quick Update', defaultValues: row, action }));
  };

  const handleCloseForm = () => {
    setFormConfig({ open: false, title: '' });
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Servers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setFormConfig((s) => ({
              ...s,
              open: true,
              title: 'Create a new Server',
              action: HttpMethod.POST,
            }));
          }}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Server
        </Button>
      </Box>

      <Card>
        <TableComponent
          tableKey={tableKey}
          refreshNumber={refreshNumber}
          url={PATH_SERVER_LIST}
          indexCol={true}
          selectCol={true}
          handleClickOpenForm={handleClickOpenForm}
          actions={{ editBtn: false, deleteBtn: false, popupEdit: true }}
          headLabel={[
            { id: 'code', label: 'Code', sort: true, type: 'text' },
            { id: 'content', label: 'Content', sort: false },
          ]}
        />
      </Card>

      <PopupFormTable
        baseUrl={`${PATH_SERVER_LIST}/update/${formConfig?.defaultValues?.id}`}
        open={formConfig.open}
        handleCloseForm={handleCloseForm}
        refreshData={refreshData}
        render={() => {
          return (
            <>
              <DialogTitle>{formConfig?.title}</DialogTitle>
              <DialogContent>
                <Box gap={2} component={'div'} display={'flex'} flexDirection={'column'}>
                  <TextField
                    disabled
                    value={formConfig?.defaultValues?.lang?.name}
                    margin="dense"
                    id="lang"
                    name="lang"
                    label="Language"
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <TextField
                    disabled
                    value={formConfig?.defaultValues?.code}
                    margin="dense"
                    id="code"
                    name="code"
                    label="Code"
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <TextField
                    defaultValue={formConfig?.defaultValues?.content}
                    margin="dense"
                    id="content"
                    name="content"
                    label="Content"
                    multiline
                    maxRows={5}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />
                </Box>
              </DialogContent>
              <DialogActions style={{ padding: 20 }}>
                <Button variant="outlined" color="inherit" onClick={handleCloseForm}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  {formConfig?.action === HttpMethod.PATCH ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </>
          );
        }}
      />
    </DashboardContent>
  );
}
