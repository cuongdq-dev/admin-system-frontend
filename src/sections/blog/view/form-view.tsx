import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, CardContent, CardHeader, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { t } from 'i18next';
import { closeSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_BLOG } from 'src/api-core/path';
import { ButtonDelete } from 'src/components/button';
import { FormProvider, RHFTextField, RHFUpload } from 'src/components/hook-form';
import {
  RHFAutocomplete,
  RHFEditor,
  RHFTextFieldWithSlug,
} from 'src/components/hook-form/RHFTextField';
import { Iconify } from 'src/components/iconify';
import { PageLoading } from 'src/components/loading';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey, StoreName, SubjectConfig } from 'src/constants';
import { usePermissions } from 'src/hooks/use-permissions';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNotifyStore } from 'src/store/notify';
import { usePageStore } from 'src/store/page';
import { useSettingStore } from 'src/store/setting';
import { varAlpha } from 'src/theme/styles';
import { GetValuesFormChange } from 'src/utils/validation/form';
import * as Yup from 'yup';
import { useShallow } from 'zustand/react/shallow';

const DetailSchema = Yup.object().shape({
  thumbnail: Yup.mixed<File | string>().optional(),
  title: Yup.string().optional(),
  slug: Yup.string().optional(),
  meta_description: Yup.string().optional(),
  content: Yup.string().optional(),
  relatedQueries: Yup.array()
    .of(Yup.object().shape({ id: Yup.string(), title: Yup.string() }))
    .optional(),
  categories: Yup.array()
    .of(Yup.object().shape({ id: Yup.string(), title: Yup.string() }))
    .optional(),
  sites: Yup.array()
    .of(Yup.object().shape({ id: Yup.string(), title: Yup.string() }))
    .optional(),
});

// ----------------------------------------------------------------------
export const FormView = React.memo(({ slug }: { slug?: string }) => {
  const { setNotify } = useNotifyStore.getState();
  const navigate = useNavigate();
  const storeName = StoreName.BLOG;
  const { sites, categories } = useSettingStore(useShallow((state) => ({ ...state.dropdown })));

  const { setDetail, setLoadingDetail } = usePageStore();
  const { data, isLoading = true } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  ) as { data?: IPost; refreshNumber?: number; isLoading?: boolean };

  const { hasPermission } = usePermissions();

  const canUpdate = hasPermission(SubjectConfig.POSTS, slug ? 'update' : 'create');
  const canPublish = hasPermission(SubjectConfig.POSTS, 'publish');

  const fetchPost = () => {
    invokeRequest({
      method: HttpMethod.GET,
      baseURL: PATH_BLOG + '/' + slug,
      onSuccess: (res: IPost) => {
        reset({
          content: res?.content,
          meta_description: res?.meta_description,
          thumbnail: res?.thumbnail?.url,
          relatedQueries: res?.relatedQueries?.map((query) => {
            return { title: query?.query, id: query?.slug };
          }),
          categories: res?.categories?.map((cate) => {
            return { id: cate.id, title: cate.name };
          }),
          sites: res?.sites?.map((site) => {
            return { id: site.id, title: site.name };
          }),
          title: res?.title,
          slug: res.slug,
        });

        setDetail(storeName, { data: res, isFetching: false, isLoading: false });
      },
      onHandleError: (error) => {
        setLoadingDetail(storeName, false);
      },
    });
  };

  useEffect(() => {
    if (!!slug) fetchPost();
    else setLoadingDetail(storeName, false);
  }, [slug]);

  const methods = useForm({
    resolver: yupResolver(DetailSchema),
    defaultValues: {
      content: data?.content || '',
      meta_description: data?.meta_description || '',
      thumbnail: data?.thumbnail?.url || '',
      relatedQueries:
        data?.relatedQueries?.map((query) => {
          return { title: query?.query, id: query?.slug };
        }) || [],
      categories:
        data?.categories?.map((cate) => {
          return { id: cate.id, title: cate.name };
        }) || [],
      sites:
        data?.sites?.map((site) => {
          return { id: site.id, title: site.name };
        }) || [],
      title: data?.title || '',
      slug: data?.slug || '',
    },
  });

  const { handleSubmit, reset } = methods;
  const onSubmit = async (values: {
    title?: string;
    meta_description?: string;
    thumbnail?: File | string;
    categories?: { id?: string; title?: string }[];
    sites?: { id?: string; title?: string }[];
    relatedQueries?: { id?: string; title?: string }[];
    content?: string;
    status?: IPostStatus;
  }) => {
    const defaultValues = {
      content: data?.content,
      meta_description: data?.meta_description,
      thumbnail: data?.thumbnail?.url,
      relatedQueries: data?.relatedQueries?.map((query) => {
        return { title: query?.query, id: query?.slug };
      }),
      categories: data?.categories?.map((cate) => {
        return { id: cate.id, title: cate.name };
      }),
      sites: data?.sites?.map((site) => {
        return { id: site.id, title: site.name };
      }),
      title: data?.title,
      slug: data?.slug,
    };

    const valuesChange = GetValuesFormChange(defaultValues, values);
    setLoadingDetail(storeName, true);
    invokeRequest({
      method: HttpMethod.PATCH,
      baseURL: `${PATH_BLOG}${data?.id ? `/update/${data?.id}` : ''}`,
      config: valuesChange.thumbnail && { headers: { 'Content-Type': 'multipart/form-data' } },
      params: valuesChange,
      onHandleError() {
        setTimeout(() => {
          setLoadingDetail(storeName, false);
        }, 1000);
      },
      onSuccess(res: IPost) {
        setTimeout(() => {
          reset({
            content: res?.content,
            meta_description: res?.meta_description,
            thumbnail: res?.thumbnail?.url,
            relatedQueries: res?.relatedQueries?.map((query) => {
              return { title: query?.query, id: query?.slug };
            }),
            categories: res?.categories?.map((cate) => {
              return { id: cate.id, title: cate.name };
            }),
            sites: res?.sites?.map((site) => {
              return { id: site.id, title: site.name };
            }),
            title: res?.title,
            slug: res.slug,
          });
          navigate(`/blog/${res?.slug}`);
          setLoadingDetail(storeName, false);
          setDetail(storeName, { data: res, isFetching: false, isLoading: false });
        }, 1000);
      },
    });
  };

  const updateStatus = (values: { status?: IPostStatus }) => {
    closeSnackbar(`update_status_${data?.status}_${data?.id}`);
    setLoadingDetail(storeName, true);
    invokeRequest({
      method: HttpMethod.PATCH,
      baseURL: PATH_BLOG + '/publish/' + data?.id,
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

  const deletePost = () => {
    closeSnackbar(`update_status_${data?.status}_${data?.id}`);
    setLoadingDetail(storeName, true);
    invokeRequest({
      method: HttpMethod.DELETE,
      baseURL: PATH_BLOG + '/' + data?.id,
      onHandleError() {
        setTimeout(() => {
          setLoadingDetail(storeName, false);
        }, 1000);
      },
      onSuccess(res) {
        setTimeout(() => {
          setLoadingDetail(storeName, false);
          if (window.history.length > 1) navigate(-1);
          else navigate('/blog');
          reset();
          setNotify({
            title: 'Deleted',
            key: `update_status_${res?.status}_${data?.id}`,
            options: { variant: 'success' },
          });
        }, 1000);
      },
    });
  };

  return (
    <DashboardContent breadcrumb={{ items: [{ href: '/blog', title: 'Create' }] }}>
      <PageLoading isLoading={isLoading} />

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={12} md={4}>
            <Card
              sx={(theme) => {
                return {
                  height: { xs: '100%', sm: 'calc(100vh - 110px)' },
                  border: `1px solid ${theme.palette.divider}`,
                };
              }}
            >
              <Scrollbar sx={{ height: '100%', overflowX: 'hidden' }}>
                <CardHeader
                  sx={(theme) => {
                    return {
                      padding: theme.spacing(3),
                      backgroundColor: varAlpha(theme.palette.background.neutralChannel, 0.5),
                    };
                  }}
                  action={
                    <Box display="flex" gap={1} flexDirection="row" flexWrap={'nowrap'}>
                      {slug ? (
                        <>
                          {data?.status === 'PUBLISHED' && (
                            <Button
                              onClick={() => {
                                updateStatus({ status: 'DRAFT' });
                              }}
                              variant="contained"
                              color="warning"
                              aria-label="draft"
                              disabled={!canPublish}
                              sx={{ cursor: !canPublish ? 'no-drop' : 'unset' }}
                            >
                              {t(LanguageKey.blog.draftButton)}
                            </Button>
                          )}

                          {data?.status === 'DRAFT' && (
                            <Button
                              onClick={() => {
                                updateStatus({ status: 'PUBLISHED' });
                              }}
                              variant="contained"
                              aria-label="public"
                              disabled={!canPublish}
                              sx={{ cursor: !canPublish ? 'no-drop' : 'unset' }}
                              color="primary"
                            >
                              {t(LanguageKey.blog.publicButton)}
                            </Button>
                          )}
                          <Button
                            color="inherit"
                            type="submit"
                            variant="outlined"
                            aria-label="public"
                            disabled={!canUpdate}
                            sx={{ cursor: !canUpdate ? 'no-drop' : 'unset' }}
                          >
                            {t(LanguageKey.button.update)}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            disabled={!canUpdate}
                            sx={{ cursor: !canUpdate ? 'no-drop' : 'unset' }}
                            type="submit"
                            variant="contained"
                            aria-label="public"
                          >
                            {t(LanguageKey.button.save)}
                          </Button>
                        </>
                      )}
                    </Box>
                  }
                  title={slug ? t(LanguageKey.blog.detailTitle) : t(LanguageKey.blog.addNewButton)}
                />

                <CardContent>
                  <Grid container spacing={2} height={'100%'}>
                    <Grid xs={12} sm={12} md={!slug ? 6 : 12}>
                      {!slug ? (
                        <RHFTextFieldWithSlug
                          disabled={!canUpdate}
                          name="title"
                          variant="outlined"
                          label={t(LanguageKey.blog.titleItem)}
                        />
                      ) : (
                        <RHFTextField
                          name="title"
                          disabled={!canUpdate}
                          variant="outlined"
                          label={t(LanguageKey.blog.titleItem)}
                        />
                      )}
                    </Grid>

                    {!slug && (
                      <Grid xs={12} sm={12} md={6}>
                        <RHFTextField
                          contentEditable={false}
                          disabled
                          name="slug"
                          variant="outlined"
                          label={t(LanguageKey.blog.slugItem)}
                        />
                      </Grid>
                    )}

                    <Grid xs={12} sm={12} md={12}>
                      <RHFTextField
                        disabled={!canUpdate}
                        name="meta_description"
                        variant="outlined"
                        multiline
                        maxRows={5}
                        minRows={2}
                        label={t(LanguageKey.blog.descriptionItem)}
                      />
                    </Grid>

                    <Grid xs={12} sm={12} md={12}>
                      <RHFAutocomplete
                        name="relatedQueries"
                        disabled={!canUpdate}
                        freeSolo
                        options={
                          data?.relatedQueries?.map((query) => {
                            return { id: query.slug, title: query.query };
                          }) || []
                        }
                        title={t(LanguageKey.blog.keywordsItem)}
                        renderInput={(params) => (
                          <TextField {...params} label={t(LanguageKey.blog.keywordsItem)} />
                        )}
                      />
                    </Grid>

                    <Grid xs={12} sm={12} md={12}>
                      <RHFAutocomplete
                        disabled={!canUpdate}
                        name="categories"
                        options={categories || []}
                        title={t(LanguageKey.blog.categoryItem)}
                        renderInput={(params) => (
                          <TextField {...params} label={t(LanguageKey.blog.categoryItem)} />
                        )}
                      />
                    </Grid>
                    <Grid xs={12} sm={12} md={12}>
                      <RHFAutocomplete
                        disabled={!canUpdate}
                        options={sites || []}
                        name="sites"
                        title={t(LanguageKey.blog.siteItem)}
                        renderInput={(params) => (
                          <TextField {...params} label={t(LanguageKey.blog.siteItem)} />
                        )}
                      />
                    </Grid>
                    <Grid xs={12} sm={12} md={12} height={200}>
                      <RHFUpload
                        disabled={!canUpdate}
                        defaultValue={data?.thumbnail?.url}
                        name="thumbnail"
                        label="Thubmnail"
                        control={<></>}
                      />
                    </Grid>
                    {slug && (
                      <Grid
                        xs={12}
                        sm={12}
                        md={12}
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <ButtonDelete
                          subject={SubjectConfig.POSTS}
                          withLoading
                          variant="outlined"
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                          title={t(LanguageKey.button.delete)}
                          size="small"
                          handleDelete={() => deletePost()}
                          color="error"
                          fullWidth
                        />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Scrollbar>
            </Card>
          </Grid>
          <Grid xs={12} sm={12} md={8}>
            <RHFEditor disabled={!canUpdate} name="content" />
          </Grid>
        </Grid>
      </FormProvider>
    </DashboardContent>
  );
});
