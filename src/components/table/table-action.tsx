import { IconButton, MenuItem, menuItemClasses, MenuList, Popover, TableCell } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { ActionProps } from './type';
import { HttpMethod } from 'src/api-core';

export const TableActionComponent = (props: ActionProps) => {
  const navigate = useNavigate();
  const { deleteBtn, editBtn, popupEdit, row, handleClickOpenForm } = props;
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
        {popupEdit && (
          <IconButton
            onClick={() => {
              handleClickOpenForm && handleClickOpenForm(row!, HttpMethod.PATCH);
            }}
          >
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        )}
        {(deleteBtn || editBtn) && (
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        )}
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
                navigate(row?.id);
              }}
            >
              <Iconify icon="solar:pen-bold" />
              Edit
            </MenuItem>
          )}
          {deleteBtn && (
            <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </>
  );
};
