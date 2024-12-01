import { LoadingButton, TabContext, TabList } from '@mui/lab';
import { Button, DialogActions, DialogContent, DialogTitle, Tab, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { HttpMethod } from 'src/api-core';
import { PATH_LANGUAGE } from 'src/api-core/path';
import { PopupFormTable } from 'src/components/form/form-table';
import { RHFTextField } from 'src/components/hook-form';
import { TableComponent } from 'src/components/table';
import { useAPI } from 'src/hooks/use-api';
import { DashboardContent } from 'src/layouts/dashboard';
import * as Yup from 'yup';

type State = { id: string; code: string; name: string; description: string }[];
type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: ITransition;
  action?: HttpMethod;
};
export function ListView() {
  const { t } = useTranslation();

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
    baseURL: PATH_LANGUAGE,
    onSuccess: (res) => setState(res),
  });

  const refreshData = () => {
    setRefresh(refreshNumber + 1);
    handleCloseForm();
  };
  const handleClickOpenForm = (row: ITransition, action: HttpMethod) => {
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
          {t('language_table_title')}
        </Typography>
      </Box>

      <Card>
        <TabContext value={queryParams.get('lang') || ''}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={(_, value) => navigate(value ? '?lang=' + value : '')}
              aria-label="lab API tabs example"
            >
              <Tab label={t('language_tab_all_label')} value={''} />
              {state?.map((s) => {
                return <Tab key={s.name + '_' + s.code} label={s.name} value={s.code} />;
              })}
            </TabList>
          </Box>
          <TableComponent
            tableKey={tableKey}
            refreshNumber={refreshNumber}
            url={PATH_LANGUAGE}
            indexCol={true}
            selectCol={true}
            refreshData={refreshData}
            handleClickOpenForm={handleClickOpenForm}
            actions={{ editBtn: false, deleteBtn: true, popupEdit: true }}
            headLabel={[
              { id: 'code', label: t('language_item_code'), sort: true, type: 'text' },
              { id: 'content', label: t('language_item_content'), sort: false },
            ]}
          />
        </TabContext>
      </Card>

      <PopupFormTable
        rowId={formConfig.defaultValues?.id}
        open={formConfig.open}
        handleCloseForm={handleCloseForm}
        refreshData={refreshData}
        defaultValues={formConfig.defaultValues}
        action={formConfig.action}
        baseUrl={PATH_LANGUAGE}
        schema={{
          content: Yup.string().required('content is required'),
        }}
        render={({ isSubmitting }: { isSubmitting: boolean }) => {
          return (
            <>
              <DialogTitle>{formConfig.title}</DialogTitle>
              <DialogContent>
                <Box
                  marginTop={1}
                  gap={2}
                  component={'div'}
                  display={'flex'}
                  flexDirection={'column'}
                >
                  <RHFTextField
                    disabled
                    value={formConfig.defaultValues?.lang?.name}
                    margin="dense"
                    id="lang"
                    name="lang"
                    label={t('language_item_language')}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <RHFTextField
                    disabled
                    value={formConfig.defaultValues?.code}
                    margin="dense"
                    id="code"
                    name="code"
                    label={t('language_item_code')}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <RHFTextField
                    defaultValue={formConfig.defaultValues?.content}
                    margin="dense"
                    id="content"
                    name="content"
                    label={t('language_item_content')}
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
                  {t('cancel_button')}
                </Button>
                <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
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
