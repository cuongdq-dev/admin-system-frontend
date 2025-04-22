import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, CardContent, CardHeader, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { t } from 'i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_BLOG } from 'src/api-core/path';
import { FormProvider, RHFTextField, RHFUpload } from 'src/components/hook-form';
import {
  RHFAutocomplete,
  RHFEditor,
  RHFTextFieldWithSlug,
} from 'src/components/hook-form/RHFTextField';
import { PageLoading } from 'src/components/loading';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { useSettingStore } from 'src/store/setting';
import { varAlpha } from 'src/theme/styles';
import * as Yup from 'yup';
import { useShallow } from 'zustand/react/shallow';

// ----------------------------------------------------------------------
export function CreateView() {
  const [isLoading, setLoading] = useState(false);
  const { sites, categories } = useSettingStore(useShallow((state) => ({ ...state.dropdown })));

  const DetailSchema = Yup.object().shape({
    image: Yup.mixed<File>().optional(),
    title: Yup.string().optional(),
    meta_description: Yup.string().optional(),
    relatedQueries: Yup.string().optional(),
    content: Yup.string().optional(),
  });

  const methods = useForm({
    resolver: yupResolver(DetailSchema),
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = async (values: {
    title?: string;
    meta_description?: string;
    thumbnail?: File;
    categories?: { id: string; title: string }[];
    sites?: { id: string; title: string }[];
    relatedQueries?: string;
    content?: string;
    status?: IPostStatus;
  }) => {
    console.log(values);

    setLoading(true);
    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_BLOG,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
      params: values,
      onHandleError() {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      },
      onSuccess(res) {
        setTimeout(() => {
          // reset();
          setLoading(false);
          //   setDetail(storeName, { data: res, isFetching: false, isLoading: false });
        }, 1000);
      },
    });
  };

  return (
    <Scrollbar sx={{ maxHeight: '100%', overflowX: 'hidden' }}>
      <DashboardContent breadcrumb={{ items: [{ href: '/blog', title: 'Create' }] }}>
        <PageLoading isLoading={isLoading} />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid xs={12} sm={12} md={4}>
              <Card
                sx={(theme) => {
                  return {
                    height: 'calc(100vh - 110px)',
                    boxShadow: theme.shadows['1'],
                    border: theme.palette.divider,
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
                        <Button type="submit" variant="outlined" color="inherit" aria-label="draft">
                          {t(LanguageKey.blog.draftButton)}
                        </Button>
                        <Button type="submit" variant="contained" aria-label="public">
                          {t(LanguageKey.blog.publicButton)}
                        </Button>
                      </Box>
                    }
                    title={t(LanguageKey.blog.addNewButton)}
                  />

                  <CardContent>
                    <Grid container spacing={2} height={'100%'}>
                      <Grid xs={12} sm={12} md={6}>
                        <RHFTextFieldWithSlug
                          name="title"
                          variant="outlined"
                          label={t(LanguageKey.blog.titleItem)}
                          defaultValue={' '}
                        />
                      </Grid>

                      <Grid xs={12} sm={12} md={6}>
                        <RHFTextField
                          contentEditable={false}
                          disabled
                          name="slug"
                          variant="outlined"
                          label={t(LanguageKey.blog.slugItem)}
                          defaultValue={' '}
                        />
                      </Grid>

                      <Grid xs={12} sm={12} md={12}>
                        <RHFTextField
                          name="meta_description"
                          variant="outlined"
                          multiline
                          maxRows={5}
                          minRows={2}
                          label={t(LanguageKey.blog.descriptionItem)}
                          defaultValue={' '}
                        />
                      </Grid>
                      <Grid xs={12} sm={12} md={12}>
                        <RHFTextField
                          name="relatedQueries"
                          variant="outlined"
                          helperText="keyword-1, keyword-2,..."
                          label={t(LanguageKey.blog.keywordsItem)}
                        />
                      </Grid>

                      <Grid xs={12} sm={12} md={12}>
                        <RHFAutocomplete
                          name="categories"
                          options={categories || []}
                          title={t(LanguageKey.site.categoriesItem)}
                          renderInput={(params) => (
                            <TextField {...params} label={t(LanguageKey.blog.categoryItem)} />
                          )}
                        />
                      </Grid>
                      <Grid xs={12} sm={12} md={12}>
                        <RHFAutocomplete
                          options={sites || []}
                          name="sites"
                          title={t(LanguageKey.blog.siteItem)}
                          renderInput={(params) => (
                            <TextField {...params} label={t(LanguageKey.blog.siteItem)} />
                          )}
                        />
                      </Grid>
                      <Grid xs={12} sm={12} md={12}>
                        <RHFUpload name="thumbnail" label="Thubmnail" control={<></>} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Scrollbar>
              </Card>
            </Grid>
            <Grid xs={12} sm={12} md={8}>
              <Card
                sx={(theme) => {
                  return {
                    height: '100%',
                    boxShadow: theme.shadows['1'],
                    border: theme.palette.divider,
                  };
                }}
              >
                <CardHeader title={t(LanguageKey.blog.contentItem)} />
                <CardContent>
                  <Grid container spacing={2} sx={{ height: '100%' }}>
                    <Grid xs={12} sm={12} md={12}>
                      <Card
                        sx={(theme) => {
                          return {
                            p: 2,
                            boxShadow: theme.shadows[1],
                            border: `1px solid ${theme.palette.divider}`,
                          };
                        }}
                      >
                        <RHFEditor name="content" defaultValue="This is your content." />
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </DashboardContent>
    </Scrollbar>
  );
}
