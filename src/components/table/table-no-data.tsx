import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { TableNoDataProps } from './type';

export function TableNoData({ searchQuery, colSpan, ...other }: TableNoDataProps) {
  return (
    <TableRow {...other} sx={{ width: '100%' }}>
      <TableCell align="center" colSpan={colSpan}>
        <Box sx={{ py: 2, width: '100%', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Not found
          </Typography>

          <Typography variant="body2">
            No results found for &nbsp;
            <strong>&quot;{searchQuery}&quot;</strong>.
            <br /> Try checking for typos or using complete words.
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
