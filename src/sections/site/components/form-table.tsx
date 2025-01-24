import { LoadingButton } from '@mui/lab';
import { Box, Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { t } from 'i18next';
import { HttpMethod } from 'src/api-core';
import { RHFTextField } from 'src/components/hook-form';
import {
  RHFAutocompleteWithApi,
  RHFTextFieldWithSlug,
} from 'src/components/hook-form/RHFTextField';
import { LanguageKey } from 'src/constants';

type Props = {
  defaultValues?: ISite;
  isSubmitting?: boolean;
  action?: HttpMethod;
  handleCloseForm: () => void;
};
export const SiteForm = (props: Props) => {
  const { defaultValues, action = HttpMethod.PATCH, isSubmitting, handleCloseForm } = props;

  return (
    <>
      <DialogContent>
        <Box marginTop={1} gap={2} component={'div'} display={'flex'} flexDirection={'column'}>
          <RHFTextField
            margin="dense"
            id="name"
            name="name"
            label={t(LanguageKey.site.nameItem)}
            type="text"
            fullWidth
            defaultValue={defaultValues?.name}
            variant="outlined"
          />

          <RHFTextField
            defaultValue={defaultValues?.domain}
            margin="dense"
            id="domain"
            name="domain"
            label={t(LanguageKey.site.domainItem)}
            type="text"
            fullWidth
            variant="outlined"
          />

          <RHFAutocompleteWithApi
            baseUrl="/dropdown/categories"
            options={[]}
            defaultValue={defaultValues?.categories?.map((category) => {
              return { id: category?.id, title: category.name };
            })}
            name="categories"
            title={t(LanguageKey.site.categoriesItem)}
            renderInput={(params) => (
              <TextField {...params} margin="normal" label={t(LanguageKey.site.categoriesItem)} />
            )}
          />

          <RHFAutocompleteWithApi
            baseUrl="/dropdown/posts"
            defaultValue={defaultValues?.posts?.map((post) => {
              return { id: post?.id, title: post.title };
            })}
            options={[]}
            name="posts"
            title={t(LanguageKey.site.postsItem)}
            renderInput={(params) => (
              <TextField {...params} margin="normal" label={t(LanguageKey.site.postsItem)} />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions style={{ padding: 20 }}>
        <Button variant="outlined" color="inherit" onClick={handleCloseForm}>
          {t(LanguageKey.button.cancel)}
        </Button>
        <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
          {action === HttpMethod.PATCH
            ? t(LanguageKey.button.update)
            : t(LanguageKey.button.create)}
        </LoadingButton>
      </DialogActions>
    </>
  );
};
