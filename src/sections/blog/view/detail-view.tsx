import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Card,
  CircularProgress,
  Link,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { t } from 'i18next';
import { closeSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_BLOG } from 'src/api-core/path';
import { ButtonDelete } from 'src/components/button';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import {
  RHFAutocomplete,
  RHFAutocompleteWithApi,
  RHFEditor,
} from 'src/components/hook-form/RHFTextField';
import { PageLoading } from 'src/components/loading';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNotifyStore } from 'src/store/notify';
import { usePageStore } from 'src/store/page';
import * as Yup from 'yup';
import { useShallow } from 'zustand/react/shallow';

// ----------------------------------------------------------------------
export function DetailView() {
  const { setNotify } = useNotifyStore.getState();
  const storeName = StoreName.BLOG;
  const { id } = useParams();
  const navigate = useNavigate();

  const { setDetail, setLoadingDetail } = usePageStore();
  const { data, isLoading = true } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  ) as { data?: IPost; refreshNumber?: number; isLoading?: boolean };

  const fetchPost = () => {
    invokeRequest({
      method: HttpMethod.GET,
      baseURL: PATH_BLOG + '/' + id,
      onSuccess: (res) => {
        setDetail(storeName, { data: res, isFetching: false, isLoading: false });
      },
      onHandleError: (error) => {
        setLoadingDetail(storeName, false);
      },
    });
  };

  useEffect(() => {
    id && fetchPost();
  }, [id]);

  const drawerKeyword = Array.from(
    new Set(
      data?.article?.trending?.articles
        ?.flatMap((article) => article.relatedQueries)
        ?.map((item) => JSON.stringify(item))
    )
  ).map((item) => JSON.parse(item));

  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm')); // Check if screen size is small

  const DetailSchema = Yup.object().shape({
    title: Yup.string().optional(),
    meta_description: Yup.string().optional(),
    content: Yup.string().optional(),
    status: Yup.mixed<IPostStatus>()
      .oneOf(['NEW', 'DRAFT', 'PUBLISHED', 'DELETED'], 'Invalid status value')
      .optional(),
    relatedQueries: Yup.array()
      .of(Yup.object().shape({ query: Yup.string() }))
      .optional(),
  });

  const methods = useForm({
    resolver: yupResolver(DetailSchema),
    defaultValues: {
      title: data?.title,
      meta_description: data?.meta_description,
      relatedQueries: data?.relatedQueries,
      content: data?.content,
      status: data?.status,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = async (values: {
    title?: string;
    meta_description?: string;
    relatedQueries?: { query?: string; slug?: string }[];
    content?: string;
    status?: IPostStatus;
  }) => {
    setLoadingDetail(storeName, true);
    invokeRequest({
      method: HttpMethod.PATCH,
      baseURL: PATH_BLOG + '/' + data?.id,
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

  const updateStatus = (values: { status?: IPostStatus }) => {
    closeSnackbar(`update_status_${data?.status}_${data?.id}`);
    setLoadingDetail(storeName, true);
    invokeRequest({
      method: HttpMethod.PATCH,
      baseURL: PATH_BLOG + '/' + data?.id,
      params: values,
      onHandleError() {
        setTimeout(() => {
          setLoadingDetail(storeName, false);
        }, 1000);
      },
      onSuccess(res) {
        setTimeout(() => {
          setLoadingDetail(storeName, false);
          if (values.status === 'DELETED') {
            if (window.history.length > 1) navigate(-1);
            else navigate('/blog');
            return;
          }
          reset();
          setDetail(storeName, { data: res, isFetching: false, isLoading: false });
          setNotify({
            title: values.status === 'PUBLISHED' ? 'Published!' : 'Draft!',
            key: `update_status_${res?.status}_${data?.id}`,
            options: { variant: 'success' },
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
              <Box sx={{ position: 'relative', pt: 'calc(100% * 3 / 6)' }}>
                <Avatar
                  alt={data?.thumbnail?.slug}
                  src={data?.thumbnail?.url}
                  sx={{ left: 24, zIndex: 9, bottom: -24, position: 'absolute' }}
                />

                <Box
                  component="img"
                  alt={data?.title}
                  src={`${data?.thumbnail?.url}`}
                  sx={{ top: 0, width: 1, height: 1, objectFit: 'cover', position: 'absolute' }}
                />
              </Box>
              <Box
                sx={(theme) => {
                  return {
                    p: theme.spacing(5, 3, 3, 3),
                    maxHeight: isSmallScreen ? 'none' : 'calc(100vh - 280px)',
                    overflow: isSmallScreen ? 'visible' : 'auto',
                  };
                }}
              >
                <Box display="flex" gap={1} justifyContent="space-between">
                  <Box display="flex" gap={1}>
                    <LoadingButton
                      variant="contained"
                      disabled={data?.status == 'DRAFT'}
                      onClick={() => updateStatus({ status: 'DRAFT' })}
                      color="warning"
                      loading={isSubmitting}
                    >
                      {t(LanguageKey.blog.draftButton)}
                    </LoadingButton>

                    <LoadingButton
                      variant="contained"
                      disabled={data?.status == 'PUBLISHED'}
                      onClick={() => updateStatus({ status: 'PUBLISHED' })}
                      color="primary"
                      loading={isSubmitting}
                    >
                      {t(LanguageKey.blog.publicButton)}
                    </LoadingButton>
                  </Box>

                  <Box display="flex" gap={1}>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      color="inherit"
                      loading={isSubmitting}
                      disabled={!isDirty}
                    >
                      {t(LanguageKey.button.update)}
                    </LoadingButton>
                  </Box>
                </Box>
                <RHFTextField
                  name="title"
                  margin="normal"
                  multiline
                  maxRows={5}
                  label={t(LanguageKey.blog.titleItem)}
                  defaultValue={data?.title}
                />

                <RHFTextField
                  name="meta_description"
                  margin="normal"
                  multiline
                  maxRows={10}
                  label={t(LanguageKey.blog.descriptionItem)}
                  defaultValue={data?.meta_description}
                />
                <RHFAutocomplete
                  id={data?.id!}
                  name="relatedQueries"
                  defaultValue={
                    data?.relatedQueries?.map((query) => {
                      return { title: query?.query, id: query?.query };
                    })!
                  }
                  options={
                    drawerKeyword?.map((query) => {
                      return { title: query?.query, id: query?.query };
                    })!
                  }
                  title={t(LanguageKey.blog.keywordsItem)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      label={t(LanguageKey.blog.keywordsItem)}
                    />
                  )}
                />

                <RHFAutocompleteWithApi
                  baseUrl="/dropdown/categories"
                  options={[]}
                  defaultValue={data?.categories?.map((category) => {
                    return { id: category?.id, title: category.name };
                  })}
                  name="categories"
                  title={t(LanguageKey.site.categoriesItem)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      label={t(LanguageKey.blog.categoryItem)}
                    />
                  )}
                />
                <RHFAutocompleteWithApi
                  baseUrl="/dropdown/sites"
                  defaultValue={data?.sites?.map((site) => {
                    return { id: site?.id, title: site.name };
                  })}
                  options={[]}
                  name="sites"
                  title={t(LanguageKey.blog.siteItem)}
                  renderInput={(params) => (
                    <TextField {...params} margin="normal" label={t(LanguageKey.blog.siteItem)} />
                  )}
                />

                <Box
                  display={'flex'}
                  gap={1}
                  marginTop={1}
                  justifyContent="space-between"
                  alignItems={'center'}
                >
                  <Link
                    target="_blank"
                    href={data?.article?.url}
                    color="inherit"
                    underline="always"
                  >
                    <Typography
                      variant="caption"
                      sx={(theme) => {
                        return { color: theme.vars.palette.text.primary };
                      }}
                    >
                      {data?.article?.source}
                    </Typography>
                  </Link>
                  {data?.status != 'DELETED' && (
                    <ButtonDelete
                      title={t(LanguageKey.button.delete)}
                      size="small"
                      handleDelete={() => updateStatus({ status: 'DELETED' })}
                      variant="text"
                      color="error"
                    />
                  )}
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid xs={12} sm={12} md={8} sx={{ position: 'relative' }}>
            <RHFEditor name="content" defaultValue={data?.content} />
          </Grid>
        </Grid>
      </FormProvider>
    </DashboardContent>
  );
}
