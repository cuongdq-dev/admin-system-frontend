import {
  Box,
  IconButton,
  MenuItem,
  menuItemClasses,
  MenuList,
  Popover,
  TableCell,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HttpMethod } from 'src/api-core';
import { Iconify } from 'src/components/iconify';
import { LanguageKey } from 'src/constants';
import { ButtonDelete } from '../button';
import { TableActionComponentProps } from './type';

export const TableActionComponent = (props: TableActionComponentProps) => {
  const navigate = useNavigate();
  const { deleteBtn, editBtn, popupEdit, row, baseUrl } = props;
  const { handleClickOpenForm, updateRowData } = props;
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
            <ButtonDelete
              handleDelete={updateRowData}
              rowId={row?.id}
              baseUrl={baseUrl + '/delete/' + row?.id}
            />
          )}

          {deleteBtn && editBtn && (
            <IconButton onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </Box>
      </TableCell>

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
              handleDelete={updateRowData}
              title={t(LanguageKey.button.delete)}
              rowId={row?.id}
              baseUrl={baseUrl + '/delete/' + row?.id}
            />
          )}
        </MenuList>
      </Popover>
    </>
  );
};
