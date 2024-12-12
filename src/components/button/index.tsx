import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
} from '@mui/material';
import { t } from 'i18next';
import { closeSnackbar, enqueueSnackbar, SnackbarKey } from 'notistack';
import { useState } from 'react';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { LanguageKey } from 'src/constants';
import { Iconify } from '../iconify';
import { Transition } from '../dialog';

export const ButtonDismissNotify = (props: {
  textLabel?: string;
  textColor?: string;
  key: SnackbarKey;
}) => {
  const { textColor, key, textLabel = 'Dismiss' } = props;
  return (
    <Button style={{ color: textColor }} size="small" onClick={() => closeSnackbar(key)}>
      {textLabel}
    </Button>
  );
};

type ButtonDeleteProps = {
  title?: string;
  baseUrl: string;
  rowId?: string;
  refreshData?: () => void;
  handleLoading?: (load: boolean) => void;
  handleDelete?: (
    id: string,
    updatedData: Record<string, any>,
    action: 'ADD' | 'UPDATE' | 'REMOVE'
  ) => void;
};

export const ButtonDelete = (props: ButtonDeleteProps) => {
  const { title = '', baseUrl, rowId, refreshData, handleLoading, handleDelete } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteRow = () => {
    handleLoading && handleLoading(true);
    setLoading(true);
    setOpen(false);
    invokeRequest({
      method: HttpMethod.DELETE,
      baseURL: baseUrl,
      onSuccess: () => {
        handleLoading && handleLoading(false);
        enqueueSnackbar(t(LanguageKey.notify.successDelete), {
          variant: 'success',
          action: (key) => <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />,
        });
        setLoading(false);
        handleDelete && handleDelete(rowId!, {}, 'REMOVE');
        refreshData && refreshData();
      },
      onHandleError: (error) => {
        handleLoading && handleLoading(false);
        setLoading(false);
      },
    });
  };

  return (
    <>
      <MenuItem sx={{ color: 'error.main' }} onClick={() => setOpen(true)}>
        <Box sx={{ position: 'relative', display: 'flex' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          {loading && (
            <CircularProgress
              size={25}
              sx={{ color: 'primary.main', position: 'absolute', left: -2, top: -2, zIndex: 1 }}
            />
          )}
        </Box>
        {title}
      </MenuItem>
      <Dialog
        PaperProps={{ sx: { borderRadius: 3 } }}
        TransitionComponent={Transition}
        maxWidth={'sm'}
        open={open}
        fullWidth
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{t(LanguageKey.form.deleteLabel)}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t(LanguageKey.form.deleteTitle)}</DialogContentText>
        </DialogContent>
        <DialogActions style={{ padding: 20 }}>
          <Button color="error" variant="contained" onClick={handleDeleteRow}>
            {t(LanguageKey.button.delete)}
          </Button>
          <Button color="inherit" variant="outlined" onClick={() => setOpen(false)} autoFocus>
            {t(LanguageKey.button.cancel)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
