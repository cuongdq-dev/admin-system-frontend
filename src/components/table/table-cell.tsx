import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { ReactNode } from 'react';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { Align, CellType } from './type';

interface CommonTableCellProps {
  type: CellType;
  value?: ReactNode;
  checked?: boolean;
  onChange?: () => void;
  avatarUrl?: string;
  name?: string;
  status?: string;
  icon?: string;
  align?: Align;
  width?: string | number;
  minWidth?: string | number;
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function CommonTableCell({
  type,
  value,
  checked,
  onChange,
  avatarUrl,
  name,
  status,
  icon,
  align,
  minWidth,
  width,
  onActionClick,
}: CommonTableCellProps) {
  switch (type) {
    case 'checkbox':
      return (
        <TableCell width={width} sx={{ minWidth: minWidth }} padding="checkbox">
          <Checkbox disableRipple checked={checked} onChange={onChange} />
        </TableCell>
      );

    case 'text':
      return (
        <TableCell width={width} sx={{ minWidth: minWidth }} align={align}>
          {value}
        </TableCell>
      );

    case 'avatar':
      return (
        <TableCell width={width} sx={{ minWidth: minWidth }}>
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={name} src={avatarUrl} />
            {name}
          </Box>
        </TableCell>
      );

    case 'status':
      return (
        <TableCell width={width} sx={{ minWidth: minWidth }}>
          <Label color={(status === 'banned' && 'error') || 'success'}>{status}</Label>
        </TableCell>
      );

    case 'icon':
      return (
        <TableCell width={width} sx={{ minWidth: minWidth }} align="center">
          {value ? <Iconify width={22} icon={icon!} sx={{ color: 'success.main' }} /> : '-'}
        </TableCell>
      );

    case 'action':
      return (
        <TableCell align="right">
          <IconButton onClick={(event) => onActionClick?.(event)}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
          {/* <Iconify icon="eva:more-vertical-fill" onClick={onActionClick} /> */}
        </TableCell>
      );

    default:
      return (
        <TableCell width={width} sx={{ minWidth: minWidth }}>
          {value}
        </TableCell>
      );
  }
}
