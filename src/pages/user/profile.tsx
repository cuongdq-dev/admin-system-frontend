import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Card,
  Grid,
  ListItemText,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_PROFILE, PATH_SITE } from 'src/api-core/path';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { Scrollbar } from 'src/components/scrollbar';
import { CONFIG } from 'src/config-global';
import { Breadcrumbs, LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { useSettingStore } from 'src/store/setting';
import * as Yup from 'yup';
import { useShallow } from 'zustand/react/shallow';

// ----------------------------------------------------------------------

export default function Page() {
  const storeName = StoreName.PROFILE;
  const { setDetail } = usePageStore.getState();
  const { user } = useSettingStore(useShallow((state) => state));

  const { data = user } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  );

  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md')); // Check if screen size is small

  const getProfile = () => {
    invokeRequest({
      baseURL: PATH_PROFILE,
      onSuccess: (res) => {
        console.log(res);
        setDetail(storeName, { data: { ...res } });
      },
      onHandleError: (error) => {},
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  console.log(data);

  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  const DetailSchema = Yup.object().shape({
    name: Yup.string().optional(),
    description: Yup.string().optional(),
  });

  const methods = useForm({
    resolver: yupResolver(DetailSchema),
    defaultValues: data,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = async (values: { name?: string; description?: string }) => {
    // setLoadingDetail(storeName, true);
    invokeRequest({
      method: HttpMethod.PATCH,
      baseURL: PATH_SITE + '/update/' + data?.id,
      params: values,
      onHandleError() {
        setTimeout(() => {
          // setLoadingDetail(storeName, false);
        }, 1000);
      },
      onSuccess(res) {
        setTimeout(() => {
          reset();
          // setLoadingDetail(storeName, false);
          setDetail(storeName, { data: res, isFetching: false, isLoading: false });
        }, 1000);
      },
    });
  };

  return (
    <>
      <Helmet>
        <title> {`${t(LanguageKey.user.profileTitle)} - ${CONFIG.appName}`}</title>
      </Helmet>

      <Scrollbar sx={{ height: '100%', overflowX: 'hidden' }}>
        <DashboardContent
          breadcrumb={{ items: [...Breadcrumbs.PROFILE.items, { title: data?.name }] }}
        >
          <Box display="flex" alignItems="center" mb={5}>
            <Typography variant="h4" flexGrow={1}>
              {t(LanguageKey.user.profileTitle)}
            </Typography>
          </Box>
          <Box>
            <Card sx={{ height: '290px', position: 'relative' }}>
              <Box
                sx={(theme) => {
                  return {
                    height: '100%',
                    position: 'relative',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPositionX: 'center',
                    backgroundPositionY: 'center',
                    backgroundImage: `linear-gradient(0deg, rgba(var(--palette-primary-darkerChannel) / 0.8), rgba(var(--palette-primary-darkerChannel) / 0.8)),url(https://assets.minimals.cc/public/assets/images/mock/cover/cover-4.webp)`,
                    color: theme.vars.palette.common.white,
                  };
                }}
              >
                <Box
                  sx={(theme) => {
                    return {
                      position: 'absolute',
                      left: theme.spacing(3),
                      bottom: theme.spacing(3),
                      display: 'flex',
                      flexDirection: 'row',
                      zIndex: 1,
                    };
                  }}
                >
                  <Avatar
                    variant="circular"
                    sx={{ width: '128px', height: '128px' }}
                    alt={user?.name}
                    src={user?.avatar.url}
                  />
                  <ListItemText
                    sx={(theme) => {
                      return { marginTop: theme.spacing(3), marginLeft: theme.spacing(3) };
                    }}
                    primaryTypographyProps={{
                      sx: (theme) => {
                        return {
                          fontSize: theme.breakpoints.up('md')
                            ? theme.typography.h4
                            : theme.typography.body1,
                          fontWeight: theme.typography.fontWeightBold,
                        };
                      },
                    }}
                    secondaryTypographyProps={{ sx: { opacity: 0.8, color: 'text.white' } }}
                    primary={user?.name}
                    secondary={user?.email}
                  />
                </Box>
              </Box>
            </Card>
            <Grid container mt={4}>
              <Grid key={data?.id} xs={12} sm={12} md={4}>
                <Card sx={{}}>
                  <Box
                    sx={(theme) => {
                      return {
                        p: theme.spacing(2, 2, 2, 2),
                        maxHeight: isSmallScreen ? 'none' : 'calc(100vh - 100px)',
                        overflow: isSmallScreen ? 'visible' : 'auto',
                      };
                    }}
                  >
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                      <RHFTextField
                        name="name"
                        margin="normal"
                        label={t(LanguageKey.user.nameItem)}
                        defaultValue={data?.name}
                      />

                      <RHFTextField
                        name="email"
                        margin="normal"
                        label={t(LanguageKey.user.emailItem)}
                        defaultValue={data?.email}
                      />

                      <LoadingButton
                        type="submit"
                        variant={isDirty ? 'contained' : 'outlined'}
                        fullWidth
                        sx={{ mt: 1, mb: 2 }}
                        loading={isSubmitting}
                        disabled={!isDirty}
                      >
                        {t(LanguageKey.button.update)}
                      </LoadingButton>
                    </FormProvider>
                  </Box>
                </Card>
              </Grid>
              <Grid xs={12} sm={12} md={8} sx={{ position: 'relative' }}>
                <Grid container spacing={3}>
                  {/* TODDO */}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DashboardContent>
      </Scrollbar>
    </>
  );
}
