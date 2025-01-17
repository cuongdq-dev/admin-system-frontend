import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Card,
  Link,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_BLOG } from 'src/api-core/path';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { RHFAutocomplete, RHFEditor } from 'src/components/hook-form/RHFTextField';
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

  const { setDetail, setLoadingDetail } = usePageStore();
  const { data } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  ) as { data?: IPost; refreshNumber?: number };

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

  useEffect(() => fetchPost(), [id]);

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
    relatedQueries?: { query?: string }[];
    content?: string;
    status?: IPostStatus;
  }) => {
    invokeRequest({
      method: HttpMethod.PATCH,
      baseURL: PATH_BLOG + '/' + data?.id,
      params: values,
      onHandleError: (error) => {},
      onSuccess(res) {
        reset();
        setDetail(storeName, { data: res, isFetching: false, isLoading: false });
        setNotify({
          title: t(LanguageKey.notify.successUpdate),
          key: 'update' + data?.id,
          options: { variant: 'success', key: 'update' + data?.id },
        });
      },
    });
  };
  const updateStatus = (values: { status?: IPostStatus }) => {
    invokeRequest({
      method: HttpMethod.PATCH,
      baseURL: PATH_BLOG + '/' + data?.id,
      params: values,
      onHandleError: (error) => {},
      onSuccess(res) {
        reset();
        setDetail(storeName, { data: res, isFetching: false, isLoading: false });
        setNotify({
          title: t(LanguageKey.notify.successUpdate),
          key: 'update_status_' + data?.id,
          options: { variant: 'success', key: 'update' + data?.id },
        });
      },
    });
  };

  const [indexDiv, setIndexDiv] = useState(1);
  const fetchContent = () => {
    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_BLOG + '/fetch-content/' + data?.id,
      params: { index: indexDiv },
      onHandleError: (error) => {},
      onSuccess(res) {
        setDetail(storeName, {
          data: { ...data, content: res?.content },
          isFetching: false,
          isLoading: false,
        });
        setIndexDiv(indexDiv + 1);
        setNotify({
          title: t(LanguageKey.notify.successApiCall),
          key: 'update_status_' + data?.id,
          options: { variant: 'success', key: 'update' + data?.id },
        });
      },
    });
  };

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/blog', title: t(LanguageKey.common.detailTitle) }] }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid key={data?.id} xs={12} sm={12} md={4}>
            <Card sx={{ position: 'sticky', top: '80px' }}>
              <Box sx={{ position: 'relative', pt: 'calc(100% * 3 / 6)' }}>
                <Avatar
                  alt={data?.thumbnail?.data}
                  src={data?.thumbnail?.url}
                  sx={{ left: 24, zIndex: 9, bottom: -24, position: 'absolute' }}
                />

                <Box
                  component="img"
                  alt={data?.title}
                  src={`data:image/png;base64,${data?.thumbnail?.data}`}
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
                <Box display={'flex'} gap={1} justifyContent="space-between">
                  <Box>
                    {data?.status == 'PUBLISHED' && (
                      <LoadingButton
                        size="small"
                        variant="contained"
                        onClick={() => updateStatus({ status: 'DRAFT' })}
                        color="warning"
                        loading={isSubmitting}
                      >
                        {t(LanguageKey.blog.draftButton)}
                      </LoadingButton>
                    )}

                    {(data?.status == 'DRAFT' || data?.status == 'NEW') && (
                      <LoadingButton
                        size="small"
                        onClick={() => updateStatus({ status: 'PUBLISHED' })}
                        variant="contained"
                        loading={isSubmitting}
                      >
                        {t(LanguageKey.blog.publicButton)}
                      </LoadingButton>
                    )}
                  </Box>

                  <Box>
                    <LoadingButton
                      size="small"
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
                <Box display={'flex'} gap={1} marginTop={1} justifyContent="flex-end">
                  {data?.status != 'DELETED' && (
                    <LoadingButton
                      size="small"
                      onClick={() => updateStatus({ status: 'DELETED' })}
                      variant="outlined"
                      color="error"
                      loading={isSubmitting}
                    >
                      {t(LanguageKey.button.delete)}
                    </LoadingButton>
                  )}
                </Box>

                <Link target="_blank" href={data?.article?.url} color="inherit" underline="hover">
                  <Typography
                    variant="caption"
                    sx={(theme) => {
                      return {
                        paddingTop: 1,
                        color: theme.vars.palette.text.primary,
                        float: 'right',
                      };
                    }}
                  >
                    {data?.article?.source}
                  </Typography>
                </Link>
              </Box>
            </Card>
          </Grid>
          <Grid xs={12} sm={12} md={8} sx={{ position: 'relative' }}>
            <LoadingButton
              size="small"
              sx={{ mb: 1 }}
              fullWidth
              variant="contained"
              onClick={() => fetchContent()}
              color="warning"
              loading={isSubmitting}
            >
              Fetch Content (div :{indexDiv})
            </LoadingButton>
            <RHFEditor name="content" defaultValue={data?.content} />
          </Grid>
        </Grid>
      </FormProvider>
    </DashboardContent>
  );
}
