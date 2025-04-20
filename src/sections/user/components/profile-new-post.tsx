import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardContent, Container, Grid, TextField } from '@mui/material';
import { t } from 'i18next';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_BLOG } from 'src/api-core/path';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { RHFAutocomplete, RHFEditor } from 'src/components/hook-form/RHFTextField';
import Editor from 'src/components/rich-editor/editor';
import { LanguageKey } from 'src/constants';
import { useSettingStore } from 'src/store/setting';
import { useShallow } from 'zustand/react/shallow';
// ----------------------------------------------------------------------

export default function ProfileNewPost() {
  const { sites, categories } = useSettingStore(useShallow((state) => ({ ...state.dropdown })));

  const methods = useForm({
    defaultValues: {
      title: '',
      meta_description: '',
      content: '',
      relatedQueries: '',
      categories: [],
      sites: [],
      status: undefined,
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
    content?: string;
    status?: IPostStatus;
    relatedQueries?: string;
    sites?: { id?: string; name?: string }[];
    categories?: { id?: string; name?: string }[];
  }) => {
    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_BLOG,
      params: values,
      onHandleError() {
        // setTimeout(() => {}, 1000);
      },
      onSuccess(res) {
        setTimeout(() => {
          reset();
          //   setDetail(storeName, { data: res, isFetching: false, isLoading: false });
          //   setNotify({
          //     title: t(LanguageKey.notify.successUpdate),
          //     key: 'update' + data?.id,
          //     options: { variant: 'success', key: 'update' + data?.id },
          //   });
        }, 1000);
      },
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField
        fullWidth
        label="Title"
        name="title"
        required
        variant="outlined"
        size="small"
        margin="dense"
      />

      <RHFTextField
        fullWidth
        label="Description"
        name="meta_description"
        variant="outlined"
        size="small"
        margin="dense"
      />

      <RHFTextField
        fullWidth
        label="Keywords"
        name="relatedQueries"
        helperText="Separate keywords with commas"
        variant="outlined"
        size="small"
        margin="dense"
      />

      <RHFAutocomplete
        name="categories"
        options={categories || []}
        title={t(LanguageKey.site.categoriesItem)}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            margin="dense"
            label={t(LanguageKey.blog.categoryItem)}
          />
        )}
      />
      <RHFAutocomplete
        options={sites || []}
        name="sites"
        title={t(LanguageKey.blog.siteItem)}
        renderInput={(params) => (
          <TextField {...params} size="small" margin="dense" label={t(LanguageKey.blog.siteItem)} />
        )}
      />
      <Box sx={{ mt: 2 }}>
        <RHFEditor name="content" defaultValue="" />
      </Box>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <LoadingButton size="medium" type="submit" variant="contained" loading={isSubmitting}>
          {t(LanguageKey.button.submit)}
        </LoadingButton>
      </Box>
    </FormProvider>
  );
}
