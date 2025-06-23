import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  open: boolean;
  data?: {
    id: workspacesType;
    name: string;
    logo: string;
    plan: string;
  }[];
};

export function WorkspacesPopover({ open, data = [], sx, ...other }: WorkspacesPopoverProps) {
  const defaultWorkspaces = localStorage.getItem('workspaces') || 'wp_system';
  const findIndex = data.findIndex((d) => d.id == defaultWorkspaces) || 0;
  const [workspace, setWorkspace] = useState(data[findIndex]);

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleChangeWorkspace = useCallback(
    (newValue: (typeof data)[number]) => {
      setWorkspace(newValue);
      localStorage.setItem('workspaces', newValue.id);
      window.dispatchEvent(new Event('storage'));
      handleClosePopover();
    },
    [handleClosePopover]
  );

  const renderAvatar = (alt: string, src: string) => (
    <Box
      component="img"
      alt={alt}
      src={src}
      sx={{ width: open ? 30 : 40, height: open ? 30 : 40, borderRadius: '50%' }}
    />
  );

  return (
    <>
      <ButtonBase
        disableRipple
        onClick={handleOpenPopover}
        sx={{
          py: 1.5,
          gap: 1.5,
          ...(open && {
            py: 2,
            pl: 2,
            pr: 1.5,
          }),

          width: 1,
          borderRadius: 1.5,
          textAlign: 'center',
          justifyContent: 'center',
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
          ...sx,
        }}
        {...other}
      >
        {renderAvatar(workspace?.name, workspace?.logo)}
        {open && (
          <>
            <Box
              gap={1}
              flexGrow={1}
              display="flex"
              alignItems="center"
              sx={{ typography: 'body2', fontWeight: 'fontWeightSemiBold' }}
            >
              {workspace?.name}
            </Box>

            <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
          </>
        )}
      </ButtonBase>

      <Popover open={!!openPopover} anchorEl={openPopover} onClose={handleClosePopover}>
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 260,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              p: 1.5,
              gap: 1.5,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: {
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {data.map((option) => (
            <MenuItem
              key={option.id}
              selected={option.id === workspace?.id}
              onClick={() => handleChangeWorkspace(option)}
            >
              {renderAvatar(option.name, option.logo)}

              <Box component="span" sx={{ flexGrow: 1 }}>
                {option.name}
              </Box>
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}
