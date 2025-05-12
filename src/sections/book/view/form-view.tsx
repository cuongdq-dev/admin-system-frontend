import { yupResolver } from '@hookform/resolvers/yup';
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { t } from 'i18next';
import { closeSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_BOOK } from 'src/api-core/path';
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
import { LanguageKey, StoreName } from 'src/constants';
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
  description: Yup.string().optional(),
  content: Yup.string().optional(),
  keywords: Yup.array()
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
  const [chapter, setOpenChapter] = useState<IChapter | undefined>(undefined);
  const navigate = useNavigate();
  const storeName = StoreName.BOOK;
  const { sites, categories } = useSettingStore(useShallow((state) => ({ ...state.dropdown })));

  const { setDetail, setLoadingDetail } = usePageStore();
  const { data, isLoading = true } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  ) as { data?: IBook; refreshNumber?: number; isLoading?: boolean };

  const fetchPost = () => {
    invokeRequest({
      method: HttpMethod.GET,
      baseURL: PATH_BOOK + '/' + slug,
      onSuccess: (res: IBook) => {
        reset({
          content: res?.content,
          description: res?.description,
          meta_description: res?.meta_description,
          thumbnail: res?.thumbnail?.url,
          keywords: res?.keywords?.map((query) => {
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
      meta_description: data?.meta_description || '',
      thumbnail: data?.thumbnail?.url || '',
      keywords:
        data?.keywords?.map((query) => {
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
    keywords?: { id?: string; title?: string }[];
    status?: IBookStatus;
  }) => {
    const defaultValues = {
      content: data?.content,
      meta_description: data?.meta_description,
      thumbnail: data?.thumbnail?.url,
      keywords: data?.keywords?.map((query) => {
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
      baseURL: `${PATH_BOOK}${data?.id ? `/update/${data?.id}` : ''}`,
      config: valuesChange.thumbnail && { headers: { 'Content-Type': 'multipart/form-data' } },
      params: valuesChange,
      onHandleError() {
        setTimeout(() => {
          setLoadingDetail(storeName, false);
        }, 1000);
      },
      onSuccess(res: IBook) {
        setTimeout(() => {
          reset({
            content: res?.content,
            meta_description: res?.meta_description,
            thumbnail: res?.thumbnail?.url,
            keywords: res?.keywords?.map((query) => {
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
          navigate(`/book/${res?.slug}`);
          setLoadingDetail(storeName, false);
          setDetail(storeName, { data: res, isFetching: false, isLoading: false });
        }, 1000);
      },
    });
  };

  const handleFetchChapter = () => {
    setLoadingDetail(storeName, true);
    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_BOOK + '/crawler/' + data?.id,
      onHandleError() {
        setTimeout(() => {
          setLoadingDetail(storeName, false);
        }, 1000);
      },
      onSuccess(res) {
        setTimeout(() => {
          setLoadingDetail(storeName, false);
          reset();
          setDetail(storeName, { data: res, isFetching: false, isLoading: false });
        }, 1000);
      },
    });
  };

  const updateStatus = (values: { status?: IBookStatus }) => {
    closeSnackbar(`update_status_${data?.status}_${data?.id}`);
    setLoadingDetail(storeName, true);
    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_BOOK + '/update/' + data?.id,
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
            else navigate('/book');
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
      baseURL: PATH_BOOK + '/' + data?.id,
      onHandleError() {
        setTimeout(() => {
          setLoadingDetail(storeName, false);
        }, 1000);
      },
      onSuccess(res) {
        setTimeout(() => {
          setLoadingDetail(storeName, false);
          if (window.history.length > 1) navigate(-1);
          else navigate('/book');
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
    <Scrollbar sx={{ maxHeight: '100%', overflowX: 'hidden' }}>
      <DashboardContent breadcrumb={{ items: [{ href: '/book', title: 'Create' }] }}>
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
                              >
                                {t(LanguageKey.book.draftButton)}
                              </Button>
                            )}

                            {data?.status === 'DRAFT' && (
                              <Button
                                onClick={() => {
                                  updateStatus({ status: 'PUBLISHED' });
                                }}
                                variant="contained"
                                aria-label="public"
                                color="primary"
                              >
                                {t(LanguageKey.book.publicButton)}
                              </Button>
                            )}
                            <Button
                              color="inherit"
                              type="submit"
                              variant="outlined"
                              aria-label="public"
                            >
                              {t(LanguageKey.button.update)}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button type="submit" variant="contained" aria-label="public">
                              {t(LanguageKey.button.save)}
                            </Button>
                          </>
                        )}
                      </Box>
                    }
                    title={
                      slug ? t(LanguageKey.book.detailPageTitle) : t(LanguageKey.button.create)
                    }
                  />

                  <CardContent>
                    <Grid container spacing={2} height={'100%'}>
                      <Grid xs={12} sm={12} md={!slug ? 6 : 12}>
                        {!slug ? (
                          <RHFTextFieldWithSlug
                            name="title"
                            variant="outlined"
                            label={t(LanguageKey.book.titleItem)}
                          />
                        ) : (
                          <RHFTextField
                            name="title"
                            variant="outlined"
                            label={t(LanguageKey.book.titleItem)}
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
                            label={t(LanguageKey.book.slugItem)}
                          />
                        </Grid>
                      )}

                      <Grid xs={12} sm={12} md={12}>
                        <RHFTextField
                          name="meta_description"
                          variant="outlined"
                          multiline
                          maxRows={5}
                          minRows={2}
                          label={t(LanguageKey.book.metaDescriptionItem)}
                        />
                      </Grid>

                      <Grid xs={12} sm={12} md={12}>
                        <RHFAutocomplete
                          name="relatedQueries"
                          freeSolo
                          options={
                            data?.keywords?.map((query) => {
                              return { id: query.slug, title: query.query };
                            }) || []
                          }
                          title={t(LanguageKey.book.keywordItem)}
                          renderInput={(params) => (
                            <TextField {...params} label={t(LanguageKey.book.keywordItem)} />
                          )}
                        />
                      </Grid>

                      <Grid xs={12} sm={12} md={12}>
                        <RHFAutocomplete
                          name="categories"
                          options={categories || []}
                          title={t(LanguageKey.book.categoryItem)}
                          renderInput={(params) => (
                            <TextField {...params} label={t(LanguageKey.book.categoryItem)} />
                          )}
                        />
                      </Grid>
                      <Grid xs={12} sm={12} md={12}>
                        <RHFAutocomplete
                          options={sites || []}
                          name="sites"
                          title={t(LanguageKey.book.siteItem)}
                          renderInput={(params) => (
                            <TextField {...params} label={t(LanguageKey.book.siteItem)} />
                          )}
                        />
                      </Grid>
                      <Grid xs={12} sm={12} md={12} height={200}>
                        <RHFUpload
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

                      {slug && (
                        <Grid
                          xs={12}
                          sm={12}
                          md={12}
                          sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <Button
                            onClick={handleFetchChapter}
                            fullWidth
                            variant="contained"
                            color="primary"
                          >
                            <Iconify icon="hugeicons:download-01" />
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Scrollbar>
              </Card>
            </Grid>
            <Grid xs={12} sm={12} md={8}>
              {data?.description && (
                <Card
                  sx={(theme) => {
                    return {
                      border: `1px solid ${theme.palette.divider}`,
                      mb: 2,
                    };
                  }}
                >
                  <CardContent>
                    <div dangerouslySetInnerHTML={{ __html: data?.description! }}></div>
                  </CardContent>
                </Card>
              )}
              <Card
                sx={(theme) => {
                  return {
                    // height: '100%',
                    border: `1px solid ${theme.palette.divider}`,
                  };
                }}
              >
                <CardHeader title={t(LanguageKey.book.chapterItem)} />
                <CardContent>
                  <Grid container padding={1}>
                    <Grid md={6} sm={6} xs={12}>
                      {data?.chapters
                        ?.slice(0, Number(data.chapters.length / 2 + 1))
                        .map((chapter: IChapter) => {
                          return (
                            <Box onClick={() => setOpenChapter(chapter)} sx={{ mb: 1 }}>
                              <Typography>{chapter.title}</Typography>
                            </Box>
                          );
                        })}
                    </Grid>
                    <Grid md={6} sm={6} xs={12}>
                      {data?.chapters
                        ?.slice(Number(data.chapters.length / 2 + 1), Number(data.chapters.length))
                        .map((chapter: IChapter) => {
                          return (
                            <Box onClick={() => setOpenChapter(chapter)} sx={{ mb: 1 }}>
                              <Typography>{chapter.title}</Typography>
                            </Box>
                          );
                        })}
                    </Grid>
                  </Grid>
                  <Drawer
                    anchor="right"
                    open={!!chapter}
                    onClose={() => setOpenChapter(undefined)}
                    PaperProps={{ sx: { width: '80%', overflow: 'hidden' } }}
                  >
                    <Box display="flex" alignItems="center" sx={{ pl: 2.5, pr: 1.5, py: 2 }}>
                      <Typography variant="h6" flexGrow={1}>
                        {chapter?.title}
                      </Typography>

                      <IconButton onClick={() => setOpenChapter(undefined)}>
                        <Iconify icon="mingcute:close-line" />
                      </IconButton>
                    </Box>

                    <Divider />

                    <Scrollbar>
                      <Stack spacing={3} sx={{ p: 2.5 }}>
                        {chapter?.content && (
                          <div dangerouslySetInnerHTML={{ __html: chapter?.content! }}></div>
                        )}
                      </Stack>
                    </Scrollbar>
                  </Drawer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </DashboardContent>
    </Scrollbar>
  );
});
