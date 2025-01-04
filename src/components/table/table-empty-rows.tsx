import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// ----------------------------------------------------------------------

export function TableEmptyRows({ emptyRows, height, sx, ...other }: TableEmptyRowsProps) {
  // if (!emptyRows) return null;
  return (
    <TableRow sx={{ ...(height && { height: height * emptyRows }), ...sx }} {...other}>
      <TableCell colSpan={9} />
    </TableRow>
  );
}
