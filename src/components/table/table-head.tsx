import { IconButton, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { t } from 'i18next';
import { LanguageKey } from 'src/constants';
import { Iconify } from '../iconify';
import { visuallyHidden } from './utils';

// ----------------------------------------------------------------------

export function TableHeadComponent(props: TableHeadProps) {
  const {
    order,
    orderBy,
    rowCount,
    headLabel,
    numSelected,
    selectCol,
    indexCol,
    actionCol,
    onSort,
    onSelectAllRows,
  } = props;
  return (
    <TableHead sx={{ height: 80 }}>
      <TableRow>
        {selectCol && (
          <TableCell
            sx={{
              ...(numSelected > 0 && { color: 'primary.main', bgcolor: 'primary.lighter' }),
            }}
            padding="checkbox"
          >
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onSelectAllRows(event.target.checked)
              }
            />
          </TableCell>
        )}

        {numSelected > 0 ? (
          <TableCell
            sx={{
              ...(numSelected > 0 && { color: 'primary.main', bgcolor: 'primary.lighter' }),
            }}
            colSpan={
              headLabel.length + (selectCol ? 1 : 0) + (indexCol ? 1 : 0) + (actionCol ? 1 : 0)
            }
          >
            <Box display="flex" justifyContent={'space-between'} alignItems="center">
              {t(LanguageKey.table.numberSelected).replace('{count}', numSelected.toString())}
              <Tooltip arrow title={t(LanguageKey.button.delete)}>
                <IconButton size="large">
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            </Box>
          </TableCell>
        ) : (
          <>
            {indexCol && (
              <TableCell width={50} align="center">
                STT
              </TableCell>
            )}
            {headLabel.map((headCell) => (
              <TableCell
                key={headCell.id}
                align={headCell.align || 'left'}
                sortDirection={orderBy === headCell.id ? order : false}
                sx={{ width: headCell.width, minWidth: headCell.minWidth }}
              >
                <TableSortLabel
                  disabled={!headCell.sort}
                  hideSortIcon
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={() => onSort(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box sx={{ ...visuallyHidden }}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
            {actionCol && <TableCell></TableCell>}
          </>
        )}
      </TableRow>
    </TableHead>
  );
}
