import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { Grid, Paper, styled, Tab } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { PasswordText } from 'src/components/hook-form/RHFTextField';
import { Iconify } from 'src/components/iconify';
import { FetchingComponent } from 'src/components/progress';
import * as Yup from 'yup';
import { AnalyticsSystem } from '../components/analytics-system';
import { StatusServer } from '../components/status';

const StyledTab = styled(Tab)(({ theme }) => ({
  marginRight: theme.spacing(1),
  transition: 'none',
  textTransform: 'none',
  fontWeight: 400,
  color: theme.vars.palette.text.disabled,
  padding: 0,
  '&.Mui-selected': {
    color: theme.vars.palette.text.primaryChannel,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export function DetailView(props: IDetail) {
  const { t } = useTranslation();

  const { defaultData, loading, schema = {}, handleUpdate } = props;
  const [tabState, setTabState] = useState<{ value: string }>({ value: 'general' });
  const methods = useForm({
    resolver: yupResolver(Yup.object().shape(schema)),
    defaultValues: defaultData,
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values: typeof defaultData) => {
    handleUpdate && handleUpdate(setError, values);
  };

  if (loading) return <FetchingComponent />;
  return (
    <Box height={10}>
      <TabContext value={tabState.value}>
        <TabList
          onChange={(_, value) => setTabState((s) => ({ ...s, value: value }))}
          aria-label="tab_server"
        >
          <StyledTab
            label={t('general_server_tab')}
            value={'general'}
            iconPosition="start"
            icon={<Iconify icon="fluent-mdl2:server-enviroment" />}
          />
          <StyledTab
            label={t('status_server_tab')}
            value={'status'}
            iconPosition="start"
            icon={<Iconify icon="heroicons-solid:status-online" />}
          />
          <StyledTab
            label={t('setup_server_tab')}
            value={'config'}
            iconPosition="start"
            icon={<Iconify icon="icon-park-outline:config" />}
          />
        </TabList>

        <Box component={'div'} marginTop={3}>
          <TabPanel value="general" style={{ padding: 0, margin: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Item>
                  <Box display="flex" justifyContent={'flex-end'} paddingX={2} paddingY={2}>
                    <StatusServer status={defaultData?.is_active} />
                  </Box>
                  <AnalyticsSystem
                    title="Monitoring Server"
                    chart={{
                      categories: ['RAM', 'ROOM', 'NETWORK', 'DISK'],
                      used: [10, 20, 30, 40],
                      available: [22, 100, 100, 720],
                      units: ['Gb', 'Gb', 'Mb/s', 'Gb'],
                    }}
                  />
                </Item>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Item>
                  <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
                    <Grid padding={2} container spacing={2}>
                      <Grid item sm={12} md={6} xs={12}>
                        <RHFTextField
                          id="name"
                          name="name"
                          defaultValue={defaultData?.name}
                          label={t('server_item_name')}
                          type="text"
                          fullWidth
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item sm={12} md={6} xs={12}>
                        <RHFTextField
                          id="host"
                          name="host"
                          defaultValue={defaultData?.host}
                          label={t('server_item_host')}
                          type="text"
                          fullWidth
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item sm={12} md={6} xs={12}>
                        <RHFTextField
                          id="port"
                          name="port"
                          defaultValue={defaultData?.port}
                          label={t('server_item_port')}
                          type="text"
                          fullWidth
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item sm={12} md={6} xs={12}>
                        <RHFTextField
                          id="user"
                          name="user"
                          defaultValue={defaultData?.user}
                          label={t('server_item_user')}
                          type="text"
                          fullWidth
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item sm={12} md={6} xs={12}>
                        <PasswordText
                          id="password"
                          name="password"
                          defaultValue={defaultData?.password}
                          label={t('server_item_password')}
                          fullWidth
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    <Box padding={2} display="flex" justifyContent="flex-end">
                      <LoadingButton
                        color="inherit"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                      >
                        {t('save_changes_button')}
                      </LoadingButton>
                    </Box>
                  </FormProvider>
                </Item>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value="status">Item Two</TabPanel>
          <TabPanel value="config">Item Three</TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
}
