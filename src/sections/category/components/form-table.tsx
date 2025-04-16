import { LoadingButton } from '@mui/lab';
import { Box, Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { t } from 'i18next';
import { HttpMethod } from 'src/api-core';
import { RHFTextField } from 'src/components/hook-form';
import { RHFAutocomplete, RHFTextFieldWithSlug } from 'src/components/hook-form/RHFTextField';
import { LanguageKey } from 'src/constants';
import { useSettingStore } from 'src/store/setting';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  defaultValues?: IPostCategory;
  isSubmitting?: boolean;
  action?: HttpMethod;
  handleCloseForm: () => void;
};
export const CategoryForm = (props: Props) => {
  const { defaultValues, action = HttpMethod.PATCH, isSubmitting, handleCloseForm } = props;
  const { posts, sites } = useSettingStore(useShallow((state) => ({ ...state.dropdown })));

  return (
    <>
      <DialogContent>
        <Box marginTop={1} gap={2} component={'div'} display={'flex'} flexDirection={'column'}>
          <RHFTextFieldWithSlug
            defaultValue={defaultValues?.name}
            margin="dense"
            id="name"
            name="name"
            label={t(LanguageKey.category.nameItem)}
            type="text"
            fullWidth
            variant="outlined"
          />

          <RHFTextField
            margin="dense"
            disabled
            id="slug"
            name="slug"
            label={t(LanguageKey.category.slugItem)}
            type="text"
            fullWidth
            defaultValue={defaultValues?.slug || ' '}
            variant="outlined"
          />

          <RHFTextField
            defaultValue={defaultValues?.description}
            margin="dense"
            id="description"
            name="description"
            label={t(LanguageKey.category.descriptionItem)}
            multiline
            maxRows={5}
            type="text"
            fullWidth
            variant="outlined"
          />

          <RHFAutocomplete
            options={posts || []}
            defaultValue={defaultValues?.posts?.map((post) => {
              return { id: post?.id, title: post.title };
            })}
            name="posts"
            title={t(LanguageKey.category.postsItem)}
            renderInput={(params) => (
              <TextField {...params} margin="normal" label={t(LanguageKey.category.postsItem)} />
            )}
          />

          <RHFAutocomplete
            defaultValue={defaultValues?.sites?.map((site) => {
              return { id: site?.id, title: site.domain };
            })}
            options={sites || []}
            name="sites"
            title={t(LanguageKey.category.sitesItem)}
            renderInput={(params) => (
              <TextField {...params} margin="normal" label={t(LanguageKey.category.sitesItem)} />
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
