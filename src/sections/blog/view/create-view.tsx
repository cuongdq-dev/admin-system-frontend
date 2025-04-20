import { yupResolver } from '@hookform/resolvers/yup';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, TextField, Theme, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { t } from 'i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_BLOG } from 'src/api-core/path';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { RHFAutocomplete, RHFEditor } from 'src/components/hook-form/RHFTextField';
import { PageLoading } from 'src/components/loading';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { useSettingStore } from 'src/store/setting';
import * as Yup from 'yup';
import { useShallow } from 'zustand/react/shallow';
// ----------------------------------------------------------------------
export function CreateView() {
  const [isLoading, setLoading] = useState(false);
  const { sites, categories } = useSettingStore(useShallow((state) => ({ ...state.dropdown })));

  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md')); // Check if screen size is small

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
    setLoading(true);
    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_BLOG,
      params: values,
      onHandleError() {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      },
      onSuccess(res) {
        setTimeout(() => {
          reset();
          setLoading(false);
          //   setDetail(storeName, { data: res, isFetching: false, isLoading: false });
        }, 1000);
      },
    });
  };

  return (
    <Scrollbar sx={{ maxHeight: '100%', overflowX: 'hidden' }}>
      <DashboardContent
        sx={{ p: 0, maxHeight: '100%' }}
        breadcrumb={{ items: [{ href: '/blog', title: t(LanguageKey.common.detailTitle) }] }}
      >
        <PageLoading isLoading={isLoading} />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} m={0} height={'100%'}>
            <Grid xs={12} sm={12} md={4}>
              <Card sx={{ position: 'sticky', top: '0', padding: 0 }}>
                <Box sx={{ position: 'relative', pt: 'calc(100% * 3 / 6)' }}>
                  <Box
                    component="img"
                    alt="new-images"
                    sx={{ top: 0, width: 1, height: 1, objectFit: 'cover', position: 'absolute' }}
                    src="https://cdn.hottrending.asia/uploads/post-image-gia-vang-du-kien-tiep-tuc-da-tang-phan-tich-va-du-bao-tu-chuyen-gia.png"
                  />
                  <Button
                    variant="contained"
                    startIcon={<CameraAltIcon />}
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                  >
                    Edit Cover
                  </Button>
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
                    <Box display="flex" gap={1}></Box>

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
                  />
                  <RHFTextField
                    name="meta_description"
                    margin="normal"
                    multiline
                    maxRows={10}
                    label={t(LanguageKey.blog.descriptionItem)}
                  />

                  <RHFTextField
                    name="keywords"
                    margin="normal"
                    multiline
                    maxRows={10}
                    label={t(LanguageKey.blog.keywordsItem)}
                  />

                  <RHFAutocomplete
                    name="categories"
                    options={categories || []}
                    title={t(LanguageKey.site.categoriesItem)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        label={t(LanguageKey.blog.categoryItem)}
                      />
                    )}
                  />
                  <RHFAutocomplete
                    options={sites || []}
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
                  ></Box>
                </Box>
              </Card>
            </Grid>
            <Grid xs={12} sm={12} md={8} sx={{ position: 'relative', height: '100%' }}>
              <RHFEditor name="content" defaultValue="This is your content." />
            </Grid>
          </Grid>
        </FormProvider>
      </DashboardContent>
    </Scrollbar>
  );
}
