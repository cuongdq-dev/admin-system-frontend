import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { t } from 'i18next';
import { Iconify } from 'src/components/iconify';
import { TableToolbarProps } from './type';
import { LanguageKey } from 'src/constants';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export function TableToolbarComponent(props: TableToolbarProps) {
  const { numSelected, filterName, onFilterName } = props;

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
      }}
    >
      <OutlinedInput
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder={t(LanguageKey.form.searchItem) + '...'}
        startAdornment={
          <InputAdornment position="start">
            <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
        sx={{ maxWidth: 320 }}
      />

      <Tooltip title={t(LanguageKey.table.filterTitle)}>
        <IconButton>
          <Iconify icon="ic:round-filter-list" />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}
