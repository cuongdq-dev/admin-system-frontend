import { TabContext, TabList } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_LANGUAGE_CODE, PATH_LANGUAGE_CONTENT, PATH_LANGUAGE_UPDATE } from 'src/api-core/path';
import { TableComponent } from 'src/components/table';
import { useAPI } from 'src/hooks/use-api';
import { DashboardContent } from 'src/layouts/dashboard';

type State = { id: string; code: string; name: string; description: string }[];
type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: Record<string, any>;
  action?: HttpMethod;
};
export function LanguageView() {
  const tableKey = 'language_table';
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [state, setState] = useState<State>();
  const [refreshNumber, setRefresh] = useState<number>(0);

  const [formConfig, setFormConfig] = useState<FormConfigState>({
    open: false,
    title: '',
    defaultValues: {},
    action: HttpMethod.PATCH,
  });

  useAPI({
    key: 'languaage_content_tab',
    baseURL: PATH_LANGUAGE_CODE,
    onSuccess: (res) => setState(res),
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
          Languages
        </Typography>
      </Box>

      <Card>
        <TabContext value={queryParams.get('lang') || ''}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={(_, value) => navigate(value ? '?lang=' + value : '')}
              aria-label="lab API tabs example"
            >
              <Tab label={'All'} value={''} />
              {state?.map((s) => {
                return <Tab key={s.name + '_' + s.code} label={s.name} value={s.code} />;
              })}
            </TabList>
          </Box>
          <TableComponent
            tableKey={tableKey}
            refreshNumber={refreshNumber}
            url={PATH_LANGUAGE_CONTENT}
            indexCol={true}
            selectCol={true}
            handleClickOpenForm={handleClickOpenForm}
            actions={{ editBtn: true, deleteBtn: false, popupEdit: true }}
            headLabel={[
              { id: 'code', label: 'Code', sort: true, type: 'text' },
              { id: 'content', label: 'Content', sort: false },
            ]}
          />
        </TabContext>
      </Card>

      <Dialog
        open={formConfig.open}
        onClose={handleCloseForm}
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            invokeRequest({
              method: HttpMethod.POST,
              baseURL: PATH_LANGUAGE_UPDATE.replace(':id', formConfig.defaultValues?.id),
              params: formJson,
              onSuccess: () => {
                refreshData();
              },
              onHandleError: (error) => {},
            });
          },
        }}
      >
        <DialogTitle>{formConfig.title}</DialogTitle>
        <DialogContent>
          <Box gap={2} component={'div'} display={'flex'} flexDirection={'column'}>
            <TextField
              disabled
              value={formConfig.defaultValues?.lang?.name}
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
              value={formConfig.defaultValues?.code}
              margin="dense"
              id="code"
              name="code"
              label="Code"
              type="text"
              fullWidth
              variant="outlined"
            />

            <TextField
              defaultValue={formConfig.defaultValues?.content}
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
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleCloseForm}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            {formConfig.action === HttpMethod.PATCH ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
