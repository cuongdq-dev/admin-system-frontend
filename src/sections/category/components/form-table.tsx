import { LoadingButton } from '@mui/lab';
import { Box, Button, DialogActions, DialogContent } from '@mui/material';
import { t } from 'i18next';
import { HttpMethod } from 'src/api-core';
import { RHFTextField } from 'src/components/hook-form';
import { RHFTextFieldWithSlug } from 'src/components/hook-form/RHFTextField';
import { LanguageKey } from 'src/constants';

type Props = {
  defaultValues?: IPostCategory;
  isSubmitting?: boolean;
  action?: HttpMethod;
  handleCloseForm: () => void;
};
export const CategoryForm = (props: Props) => {
  const { defaultValues, action = HttpMethod.PATCH, isSubmitting, handleCloseForm } = props;

  return (
    <>
      <DialogContent>
        <Box marginTop={1} gap={2} component={'div'} display={'flex'} flexDirection={'column'}>
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
