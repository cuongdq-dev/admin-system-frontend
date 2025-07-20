import { LoadingButton, LoadingButtonProps } from '@mui/lab';
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
import { closeSnackbar, SnackbarKey } from 'notistack';
import { useState } from 'react';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { LanguageKey } from 'src/constants';
import { useNotifyStore } from 'src/store/notify';
import { Transition } from '../dialog';
import { Iconify } from '../iconify';
import { usePermissions } from 'src/hooks/use-permissions';

export const ButtonDismissNotify = (props: { textColor?: string; keyNotify: SnackbarKey }) => {
  const { textColor, keyNotify } = props;
  return (
    <IconButton style={{ color: textColor }} size="small" onClick={() => closeSnackbar(keyNotify)}>
      <Iconify icon={'fluent-color:dismiss-circle-32'} />
    </IconButton>
  );
};

type IconButtonDeleteProps = {
  title?: string;
  subject?: string;
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

export const IconButtonDelete = (props: IconButtonDeleteProps) => {
  const { title = '', baseUrl, rowId, subject, refreshData, handleLoading, handleDelete } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setNotify } = useNotifyStore.getState();
  const handleDeleteRow = () => {
    handleLoading && handleLoading(true);
    setLoading(true);
    setOpen(false);
    invokeRequest({
      method: HttpMethod.DELETE,
      baseURL: baseUrl,
      onSuccess: () => {
        handleLoading && handleLoading(false);
        setLoading(false);
        handleDelete && handleDelete(rowId!, {}, 'REMOVE');
        refreshData && refreshData();

        setNotify({
          title: t(LanguageKey.notify.successDelete),
          options: { variant: 'success' },
        });
      },
      onHandleError: () => {
        handleLoading && handleLoading(false);
        setLoading(false);
      },
    });
  };

  const { hasPermission } = usePermissions();
  const canDelete = hasPermission(props.subject!, 'delete');
  return (
    <>
      <MenuItem
        sx={{ cursor: !canDelete ? 'no-drop' : 'unset', color: 'error.main' }}
        disabled={!canDelete}
        onClick={() => setOpen(true)}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {loading && (
            <CircularProgress
              size={30}
              sx={{ color: 'primary.main', position: 'absolute', zIndex: 1 }}
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

type ButtonDeleteProps = {
  subject?: string;
  title?: string;
  withLoading?: boolean;
  handleDelete?: () => void;
};
export const ButtonDelete = (props: ButtonDeleteProps & LoadingButtonProps) => {
  const { title, withLoading, handleDelete, subject, ...other } = props;
  const [open, setOpen] = useState(false);

  const { hasPermission } = usePermissions();
  const canDelete = hasPermission(subject!, 'delete');
  return (
    <>
      {withLoading ? (
        <LoadingButton
          sx={{ cursor: !canDelete ? 'no-drop' : 'unset' }}
          disabled={!canDelete}
          onClick={() => setOpen(true)}
          {...other}
        >
          {title}
        </LoadingButton>
      ) : (
        <IconButton
          sx={{ cursor: !canDelete ? 'no-drop' : 'unset' }}
          disabled={!canDelete}
          onClick={() => {
            setOpen(true);
          }}
          {...other}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      )}
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
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setOpen(false);
              handleDelete && handleDelete();
            }}
          >
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
