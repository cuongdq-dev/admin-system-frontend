import { LoadingButton } from '@mui/lab';
import { DialogTitle, DialogContent, Box, DialogActions, Button } from '@mui/material';
import { t } from 'i18next';
import { HttpMethod } from 'src/api-core';
import { RHFTextField } from 'src/components/hook-form';
import { PasswordText } from 'src/components/hook-form/RHFTextField';
import { LanguageKey } from 'src/constants';

type Props = {
  defaultValues?: ITransition;
  isSubmitting?: boolean;
  action?: HttpMethod;
  handleCloseForm: () => void;
};
export const LanguageForm = (props: Props) => {
  const { defaultValues, action = HttpMethod.PATCH, isSubmitting, handleCloseForm } = props;
  return (
    <>
      <DialogContent>
        <Box marginTop={1} gap={2} component={'div'} display={'flex'} flexDirection={'column'}>
          <RHFTextField
            disabled
            value={defaultValues?.lang?.name}
            margin="dense"
            id="lang"
            name="lang"
            label={t(LanguageKey.language.languageItem)}
            type="text"
            fullWidth
            variant="outlined"
          />

          <RHFTextField
            disabled
            value={defaultValues?.code}
            margin="dense"
            id="code"
            name="code"
            label={t(LanguageKey.language.codeItem)}
            type="text"
            fullWidth
            variant="outlined"
          />

          <RHFTextField
            defaultValue={defaultValues?.content}
            margin="dense"
            id="content"
            name="content"
            label={t(LanguageKey.language.contentItem)}
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
