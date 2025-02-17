import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Theme, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { t } from 'i18next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SITE } from 'src/api-core/path';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { PageLoading } from 'src/components/loading';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { PostItem } from 'src/sections/blog/post-item';
import { useNotifyStore } from 'src/store/notify';
import { usePageStore } from 'src/store/page';
import * as Yup from 'yup';
import { useShallow } from 'zustand/react/shallow';
import { Categories } from '../components/categories';

// ----------------------------------------------------------------------
export function DetailView() {
  const { setNotify } = useNotifyStore.getState();
  const storeName = StoreName.SITE;
  const { id } = useParams();

  const { setDetail, setLoadingDetail } = usePageStore();
  const { data, isLoading = true } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  ) as { data?: ISite; refreshNumber?: number; isLoading?: boolean };

  const fetchDetail = () => {
    invokeRequest({
      method: HttpMethod.GET,
      baseURL: PATH_SITE + '/' + id,
      onSuccess: (res) => {
        setDetail(storeName, { data: res, isFetching: false, isLoading: false });
      },
      onHandleError: (error) => {
        setLoadingDetail(storeName, false);
      },
    });
  };

  useEffect(() => {
    id && fetchDetail();
  }, [id]);

  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm')); // Check if screen size is small

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
    setLoadingDetail(storeName, true);
    invokeRequest({
      method: HttpMethod.PATCH,
      baseURL: PATH_SITE + '/update/' + data?.id,
      params: values,
      onHandleError() {
        setTimeout(() => {
          setLoadingDetail(storeName, false);
        }, 1000);
      },
      onSuccess(res) {
        setTimeout(() => {
          reset();
          setLoadingDetail(storeName, false);
          setDetail(storeName, { data: res, isFetching: false, isLoading: false });
          setNotify({
            title: t(LanguageKey.notify.successUpdate),
            key: 'update' + data?.id,
            options: { variant: 'success', key: 'update' + data?.id },
          });
        }, 1000);
      },
    });
  };

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/blog', title: t(LanguageKey.common.detailTitle) }] }}
    >
      <PageLoading isLoading={isLoading} />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid key={data?.id} xs={12} sm={12} md={4}>
            <Card sx={{ position: 'sticky', top: '80px' }}>
              <Box
                sx={(theme) => {
                  return {
                    p: theme.spacing(2, 2, 2, 2),
                    maxHeight: isSmallScreen ? 'none' : 'calc(100vh - 100px)',
                    overflow: isSmallScreen ? 'visible' : 'auto',
                  };
                }}
              >
                <Box display="flex" gap={1} justifyContent="space-between">
                  <RHFCheckbox
                    name="autoPost"
                    control={<></>}
                    label={t(LanguageKey.site.autoPostItem)}
                    defaultChecked={data?.autoPost}
                  />
                </Box>
                <RHFTextField
                  name="name"
                  margin="normal"
                  label={t(LanguageKey.site.nameItem)}
                  defaultValue={data?.name}
                />

                <RHFTextField
                  name="domain"
                  margin="normal"
                  label={t(LanguageKey.site.domainItem)}
                  defaultValue={data?.domain}
                />

                <RHFTextField
                  name="description"
                  margin="normal"
                  multiline
                  maxRows={10}
                  label={t(LanguageKey.site.descriptionItem)}
                  defaultValue={data?.description}
                />

                <RHFTextField
                  name="token"
                  margin="normal"
                  disabled
                  label={t(LanguageKey.site.tokenItem)}
                  defaultValue={data?.token}
                />
                <LoadingButton
                  type="submit"
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                  loading={isSubmitting}
                  disabled={!isDirty}
                >
                  {t(LanguageKey.button.update)}
                </LoadingButton>
                <Card
                  sx={(theme) => {
                    return {
                      mt: 3,
                      boxShadow: 'none',
                      border: `1px solid ${theme.vars.palette.divider}`,
                    };
                  }}
                >
                  <Categories />
                </Card>
              </Box>
            </Card>
          </Grid>
          <Grid xs={12} sm={12} md={8} sx={{ position: 'relative' }}>
            <Grid container spacing={3}>
              <TableComponent
                storeName={StoreName.SITE_BLOG}
                component={'CARD'}
                url={`${PATH_SITE}/${id}/posts`}
                headLabel={[]}
                customCard={({ values }: { values: Record<string, any>; index: number }) => {
                  return (
                    <Grid key={values?.id} xs={12} sm={4} md={4}>
                      <PostItem post={values as any} latestPost={false} latestPostLarge={false} />
                    </Grid>
                  );
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </FormProvider>
    </DashboardContent>
  );
}
