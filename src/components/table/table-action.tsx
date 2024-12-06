import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  menuItemClasses,
  MenuList,
  Popover,
  TableCell,
} from '@mui/material';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { Iconify } from 'src/components/iconify';
import { ButtonDismissNotify } from '../button';
import { Transition } from '../dialog';
import { TableActionComponentProps } from './type';
import { LanguageKey } from 'src/constants';

export const TableActionComponent = (props: TableActionComponentProps) => {
  const navigate = useNavigate();
  const { deleteBtn, editBtn, popupEdit, row, baseUrl } = props;
  const { refreshData, handleClickOpenForm } = props;
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  if (!deleteBtn && !editBtn && !popupEdit) return <></>;
  return (
    <>
      <TableCell align="right">
        <Box display="flex">
          {popupEdit && (
            <IconButton
              onClick={() => {
                handleClickOpenForm && handleClickOpenForm(row!, HttpMethod.PATCH);
              }}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          )}
          {!deleteBtn && editBtn && (
            <IconButton
              onClick={() => {
                handleClosePopover();
                navigate(row?.id, { replace: false });
              }}
            >
              <Iconify icon="icon-park-twotone:doc-search" />
            </IconButton>
          )}
          {deleteBtn && !editBtn && (
            <ButtonDelete refreshData={refreshData} rowId={row?.id} baseUrl={baseUrl} />
          )}

          {deleteBtn && editBtn && (
            <IconButton onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </Box>
      </TableCell>

      {}
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          {editBtn && (
            <MenuItem
              onClick={() => {
                handleClosePopover();
                navigate(row?.id, { replace: false });
              }}
            >
              <Iconify icon="solar:pen-bold" />
              {t(LanguageKey.button.detail)}
            </MenuItem>
          )}
          {deleteBtn && (
            <ButtonDelete
              title={t(LanguageKey.button.delete)}
              refreshData={refreshData}
              rowId={row?.id}
              baseUrl={baseUrl}
            />
          )}
        </MenuList>
      </Popover>
    </>
  );
};

type ButtonDeleteProps = {
  title?: string;
  baseUrl: string;
  rowId: string;
  refreshData?: () => void;
};
export const ButtonDelete = (props: ButtonDeleteProps) => {
  const { title = '', baseUrl, rowId, refreshData } = props;
  const [open, setOpen] = useState(false);

  const handleDeleteRow = () => {
    invokeRequest({
      method: HttpMethod.DELETE,
      baseURL: baseUrl + '/delete/' + rowId,
      onSuccess: () => {
        enqueueSnackbar(t(LanguageKey.notify.successDelete), {
          variant: 'success',
          action: (key) => <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />,
        });
        refreshData && refreshData();
      },
      onHandleError: (error) => {},
    });
  };
  return (
    <>
      <MenuItem onClick={() => setOpen(true)} sx={{ color: 'error.main' }}>
        <Iconify icon="solar:trash-bin-trash-bold" />
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
