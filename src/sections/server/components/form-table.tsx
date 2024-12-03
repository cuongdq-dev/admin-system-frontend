import { LoadingButton } from '@mui/lab';
import { DialogTitle, DialogContent, Box, DialogActions, Button } from '@mui/material';
import { t } from 'i18next';
import { HttpMethod } from 'src/api-core';
import { RHFTextField } from 'src/components/hook-form';
import { PasswordText } from 'src/components/hook-form/RHFTextField';
import { LanguageKey } from 'src/constants';

type Props = {
  defaultValues?: IServer;
  isSubmitting?: boolean;
  action?: HttpMethod;
  handleCloseForm: () => void;
};
export const ServerForm = (props: Props) => {
  const { defaultValues, action = HttpMethod.PATCH, isSubmitting, handleCloseForm } = props;
  return (
    <>
      <DialogContent>
        <Box gap={4} paddingTop={1} component={'div'} display={'flex'} flexDirection={'column'}>
          <RHFTextField
            defaultValue={defaultValues?.name}
            id="name"
            name="name"
            label={t(LanguageKey.server.nameItem)}
            type="text"
            fullWidth
            variant="outlined"
          />

          <RHFTextField
            defaultValue={defaultValues?.host}
            id="host"
            name="host"
            label={t(LanguageKey.server.hostItem)}
            type="text"
            fullWidth
            variant="outlined"
          />

          <RHFTextField
            defaultValue={defaultValues?.port}
            id="port"
            name="port"
            label={t(LanguageKey.server.portItem)}
            type="text"
            fullWidth
            variant="outlined"
          />

          <RHFTextField
            defaultValue={defaultValues?.user}
            id="user"
            name="user"
            label={t(LanguageKey.server.userItem)}
            type="text"
            fullWidth
            variant="outlined"
          />

          <PasswordText
            defaultValue={defaultValues?.password}
            id="password"
            name="password"
            label={t(LanguageKey.server.passwordItem)}
            fullWidth
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleCloseForm}>
          {t(LanguageKey.button.cancel)}
        </Button>

        <LoadingButton type="submit" color="inherit" variant="contained" loading={isSubmitting}>
          {action === HttpMethod.PATCH
            ? t(LanguageKey.button.update)
            : t(LanguageKey.button.create)}
        </LoadingButton>
      </DialogActions>
    </>
  );
};
