import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Tooltip,
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
import { Transition } from 'src/components/dialog';
import { FormProvider, RHFTextField, RHFUpload } from 'src/components/hook-form';
import { RHFAutocomplete, RHFTextFieldWithSlug } from 'src/components/hook-form/RHFTextField';
import { Iconify } from 'src/components/iconify';
import { CollapsibleText } from 'src/components/label/collapsible-text';
import { PageLoading } from 'src/components/loading';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey, StoreName, SubjectConfig } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNotifyStore } from 'src/store/notify';
import { usePageStore } from 'src/store/page';
import { useSettingStore } from 'src/store/setting';
import { varAlpha } from 'src/theme/styles';
import { fNumber } from 'src/utils/format-number';
import { GetValuesFormChange } from 'src/utils/validation/form';
import * as Yup from 'yup';
import { useShallow } from 'zustand/react/shallow';
import { usePermissions } from 'src/hooks/use-permissions';
const DetailSchema = Yup.object().shape({
  thumbnail: Yup.mixed<File | string>().optional(),
  title: Yup.string().optional(),
  slug: Yup.string().optional(),
  meta_description: Yup.string().optional(),
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

  const { hasPermission } = usePermissions();

  const canUpdate = hasPermission(SubjectConfig.BOOKS, slug ? 'update' : 'create');
  const canPublish = hasPermission(SubjectConfig.BOOKS, 'publish');

  const fetchPost = () => {
    invokeRequest({
      method: HttpMethod.GET,
      baseURL: PATH_BOOK + '/' + slug,
      onSuccess: (res: IBook) => {
        reset({
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

  const handleGenerateGemini = (chapterSlug?: string) => {
    closeSnackbar(`generate_gemini_${data?.status}_${data?.id}`);
    setLoadingDetail(storeName, true);
    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_BOOK + '/generate-gemini/' + data?.id,
      params: { chapterSlug },
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
          setNotify({
            title: 'Generate....',
            key: `generate_gemini_${res?.status}_${data?.id}`,
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
                            <ButtonGemini disabled={!canUpdate} onClick={handleGenerateGemini} />

                            {data?.status === 'PUBLISHED' && (
                              <Button
                                onClick={() => {
                                  updateStatus({ status: 'DRAFT' });
                                }}
                                variant="contained"
                                color="warning"
                                aria-label="draft"
                                disabled={!canPublish}
                              >
                                {t(LanguageKey.book.draftButton)}
                              </Button>
                            )}

                            {data?.status === 'DRAFT' && (
                              <Button
                                disabled={!canPublish}
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
                              disabled={!canUpdate}
                              aria-label="update"
                            >
                              {t(LanguageKey.button.update)}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              disabled={!canUpdate}
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
                    title={
                      slug ? t(LanguageKey.book.detailPageTitle) : t(LanguageKey.button.create)
                    }
                  />

                  <CardContent>
                    <Grid container spacing={2} height={'100%'}>
                      <Grid xs={12} sm={12} md={!slug ? 6 : 12}>
                        {!slug ? (
                          <RHFTextFieldWithSlug
                            disabled={!canUpdate}
                            name="title"
                            variant="outlined"
                            label={t(LanguageKey.book.titleItem)}
                          />
                        ) : (
                          <RHFTextField
                            disabled={!canUpdate}
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
                          disabled={!canUpdate}
                          multiline
                          maxRows={5}
                          minRows={2}
                          label={t(LanguageKey.book.metaDescriptionItem)}
                        />
                      </Grid>

                      <Grid xs={12} sm={12} md={12}>
                        <RHFAutocomplete
                          name="keywords"
                          disabled={!canUpdate}
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
                          disabled
                          options={categories || []}
                          title={t(LanguageKey.book.categoryItem)}
                          renderInput={(params) => (
                            <TextField {...params} label={t(LanguageKey.book.categoryItem)} />
                          )}
                        />
                      </Grid>
                      <Grid xs={12} sm={12} md={12}>
                        <RHFAutocomplete
                          disabled={!canUpdate}
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
                            withLoading
                            subject={SubjectConfig.BOOKS}
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

                      {data?.source_url && (
                        <Grid
                          xs={12}
                          sm={12}
                          md={12}
                          gap={2}
                          sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <Chip label={new URL(data.source_url).hostname} />
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Scrollbar>
              </Card>
            </Grid>
            <Grid xs={12} sm={12} md={8}>
              {data?.description && (
                <Card sx={{ mb: 2 }}>
                  <CardHeader
                    avatar={<Iconify icon="material-symbols:description" />}
                    sx={(theme) => {
                      return {
                        padding: theme.spacing(2),
                        backgroundColor: varAlpha(theme.palette.background.neutralChannel, 0.5),
                      };
                    }}
                    title={t(LanguageKey.book.descriptionItem)}
                  />
                  <CardContent>
                    <CollapsibleText text={data.description} maxLines={20} />
                  </CardContent>
                </Card>
              )}

              {data?.social_description && (
                <Card
                  sx={(theme) => {
                    return { border: `1px solid ${theme.palette.divider}`, mb: 2 };
                  }}
                >
                  <CardHeader
                    sx={(theme) => {
                      return {
                        padding: theme.spacing(2),
                        backgroundColor: varAlpha(theme.palette.background.neutralChannel, 0.5),
                      };
                    }}
                    title={'SEO with AI'}
                    avatar={<Iconify icon="carbon:ai-generate" />}
                  />
                  <CardContent sx={{ mx: 1 }}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      multiline
                      disabled
                      margin="normal"
                      label={t(LanguageKey.book.titleItem)}
                      defaultValue={data?.social_description?.title_social}
                      sx={{
                        cursor: 'copy',
                        '& .MuiInputBase-input.Mui-disabled': {
                          cursor: 'copy',
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            edge="end"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(
                                data?.social_description?.title_social!
                              );
                            }}
                            size="small"
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        ),
                      }}
                    />
                    <TextField
                      variant="outlined"
                      fullWidth
                      multiline
                      disabled
                      margin="normal"
                      label={t(LanguageKey.book.descriptionItem)}
                      defaultValue={data?.social_description?.description_social}
                      sx={{
                        cursor: 'copy',
                        '& .MuiInputBase-input.Mui-disabled': {
                          cursor: 'copy',
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            edge="end"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(
                                data?.social_description?.description_social!
                              );
                            }}
                            size="small"
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        ),
                      }}
                    />

                    <TextField
                      variant="outlined"
                      fullWidth
                      multiline
                      disabled
                      margin="normal"
                      label={t(LanguageKey.book.keywordItem)}
                      defaultValue={data?.social_description?.keywords?.join(', ')}
                      sx={{
                        cursor: 'copy',
                        '& .MuiInputBase-input.Mui-disabled': {
                          cursor: 'copy',
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            edge="end"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(
                                data?.social_description?.keywords?.join(', ')!
                              );
                            }}
                            size="small"
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              <Card
                sx={(theme) => {
                  return { border: `1px solid ${theme.palette.divider}`, mb: 2 };
                }}
              >
                <CardHeader
                  avatar={<Iconify icon="grommet-icons:chapter-add" />}
                  sx={(theme) => {
                    return {
                      padding: theme.spacing(2),
                      backgroundColor: varAlpha(theme.palette.background.neutralChannel, 0.5),
                    };
                  }}
                  title={t(LanguageKey.book.chapterItem)}
                />
                <CardContent sx={{ mx: 1 }}>
                  <ChapterList chapters={data?.chapters!} openChapter={setOpenChapter} />
                </CardContent>
              </Card>

              <Card
                sx={(theme) => {
                  return { border: `1px solid ${theme.palette.divider}`, mb: 2 };
                }}
              >
                <CardHeader
                  avatar={<Iconify icon="icon-park-solid:voice-one" />}
                  sx={(theme) => {
                    return {
                      padding: theme.spacing(2),
                      backgroundColor: varAlpha(theme.palette.background.neutralChannel, 0.5),
                    };
                  }}
                  title={t(LanguageKey.book.voiceItem)}
                />
                <CardContent sx={{ mx: 1 }}>
                  <ChapterList
                    chapters={data?.chapters?.map((chapter) => {
                      return {
                        id: chapter.id,
                        chapter_number: chapter.chapter_number,
                        content: chapter.voice_content,
                        slug: chapter.slug,
                        title: chapter.title,
                        word_count: chapter?.voice_count,
                        type: 'voice',
                      };
                    })}
                    openChapter={setOpenChapter}
                  />
                </CardContent>
              </Card>

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
                    <ChapterDetail content={chapter?.content!} />
                  </Stack>
                </Scrollbar>
              </Drawer>
            </Grid>
          </Grid>
        </FormProvider>
      </DashboardContent>
    </Scrollbar>
  );
});

const ChapterList = ({
  chapters,
  openChapter,
}: {
  chapters?: IChapter[];
  openChapter: (chapter: IChapter) => void;
}) => {
  if (!chapters || Number(chapters?.length) == 0) return <></>;

  const [copied, setCopied] = useState<string | undefined>(undefined);

  function copyToClipboard(html: string, slug: string) {
    const tmpEl = typeof window !== 'undefined' ? document.createElement('div') : null;
    const plainText = tmpEl
      ? ((tmpEl.innerHTML = html), tmpEl.textContent || '')
      : html.replace(/<[^>]*>/g, '');

    navigator.clipboard.writeText(plainText!).then(() => {
      setCopied(slug);
    });
  }

  return (
    <Grid container>
      <Grid md={6} sm={6} xs={12}>
        {chapters?.slice(0, Number(chapters.length / 2 + 1)).map((chapter: IChapter) => {
          const word = chapter?.word_count;
          return (
            <Box display="flex" gap={2}>
              <Box
                onClick={() => {
                  openChapter(chapter);
                  setCopied(undefined);
                }}
                sx={{ color: !word ? 'grey' : 'unset', cursor: 'pointer' }}
              >
                <Typography>
                  {chapter.title}
                  {word ? ` - (${fNumber(word)})` : ''}
                </Typography>
              </Box>
              {Number(chapter?.content?.length) > 0 && (
                <Tooltip
                  title={
                    copied == chapter.slug
                      ? `${t(LanguageKey.common.copied)}!`
                      : t(LanguageKey.common.copyClipboard)
                  }
                  arrow
                >
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(chapter?.content!, chapter.slug!)}
                  >
                    <Iconify icon={copied == chapter.slug ? 'mdi:check-bold' : 'si:copy-duotone'} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          );
        })}
      </Grid>
      <Grid md={6} sm={6} xs={12}>
        {chapters
          ?.slice(Number(chapters.length / 2 + 1), Number(chapters.length))
          .map((chapter: IChapter) => {
            const word = chapter.word_count;
            return (
              <Box display="flex" gap={2}>
                <Box
                  onClick={() => openChapter(chapter)}
                  sx={{ mb: 1, color: !word ? 'grey' : 'unset', cursor: 'pointer' }}
                >
                  <Typography>
                    {chapter.title}
                    {word ? ` - (${fNumber(word)})` : ''}
                  </Typography>
                </Box>
                {Number(chapter?.content?.length) > 0 && (
                  <Tooltip
                    title={
                      copied == chapter.slug
                        ? `${t(LanguageKey.common.copied)}!`
                        : t(LanguageKey.common.copyClipboard)
                    }
                    arrow
                  >
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(chapter?.content!, chapter.slug!)}
                    >
                      <Iconify
                        icon={copied == chapter.slug ? 'mdi:check-bold' : 'si:copy-duotone'}
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            );
          })}
      </Grid>
    </Grid>
  );
};
const ChapterDetail = ({
  content,
  handleGenerateGemini,
}: {
  content: string;
  handleGenerateGemini?: () => void;
}) => {
  const [copied, setCopied] = useState(false);

  function copyToClipboard(html: string) {
    const tmpEl = typeof window !== 'undefined' ? document.createElement('div') : null;
    const plainText = tmpEl
      ? ((tmpEl.innerHTML = html), tmpEl.textContent || '')
      : html.replace(/<[^>]*>/g, '');

    navigator.clipboard.writeText(plainText!).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset sau 2 giây
    });
  }

  if (!content)
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography color="grey" variant="subtitle2">
          {t(LanguageKey.common.dataNotFound)}
        </Typography>

        {handleGenerateGemini && (
          <Button
            onClick={handleGenerateGemini}
            variant="contained"
            sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap', flexDirection: 'row' }}
          >
            <Iconify icon="carbon:ai-generate" />
            {t(LanguageKey.book.generateGeminiButton)}
          </Button>
        )}
      </Box>
    );

  return (
    <Box>
      <Box sx={{ whiteSpace: 'pre-line' }}>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </Box>

      <Tooltip
        title={copied ? `${t(LanguageKey.common.copied)}!` : t(LanguageKey.common.copyClipboard)}
        arrow
      >
        <IconButton
          size="large"
          onClick={() => copyToClipboard(content)}
          sx={{
            position: 'fixed',
            backgroundColor: 'primary.main',
            color: 'text.primary',
            ':hover': {
              backgroundColor: 'primary.main',
              color: 'text.primary',
            },
            bottom: 20,
            right: 20,
            zIndex: 999,
          }}
        >
          <Iconify icon={copied ? 'mdi:check-bold' : 'si:copy-duotone'} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const ButtonGemini = ({ disabled, onClick }: { disabled?: boolean; onClick: () => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip title={t(LanguageKey.book.gemimiGenerate)}>
      <Button disabled={disabled} onClick={() => setOpen(true)} variant="contained" color="primary">
        <Iconify icon="carbon:ai-generate" />
        <Dialog
          PaperProps={{ sx: { borderRadius: 3 } }}
          TransitionComponent={Transition}
          maxWidth={'sm'}
          open={open}
          fullWidth
          onClose={() => setOpen(false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {/* TODO UPDATE LANGUAGE */}
            Generate Data With Gemini AI
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Dữ liệu sẽ bị thay đổi, bạn có chắc chắn?</DialogContentText>
          </DialogContent>
          <DialogActions style={{ padding: 20 }}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                onClick();
                setOpen(false);
              }}
            >
              {t(LanguageKey.button.accept)}
            </Button>
            <Button color="inherit" variant="outlined" onClick={() => setOpen(false)} autoFocus>
              {t(LanguageKey.button.cancel)}
            </Button>
          </DialogActions>
        </Dialog>
      </Button>
    </Tooltip>
  );
};
