import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

import { t } from 'i18next';
import { Iconify } from 'src/components/iconify';
import { LanguageKey } from 'src/constants';
import { TableToolbarProps } from './type';
import { Badge, Box, Button, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export function TableToolbarComponent(props: TableToolbarProps) {
  const { filterName, onFilterName } = props;

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

export function CardToolbarComponent(props: TableToolbarProps) {
  const { filterName, onFilterName } = props;

  return (
    <Stack gap={3} alignItems="flex-end" sx={{ mb: 3 }}>
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
      />

      <Button
        disableRipple
        color="inherit"
        // sx={{ float: 'right',  }}
        endIcon={
          <Badge
            color="error"
            variant="dot"
            // invisible={!canReset}
          >
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        // onClick={onOpenFilter}
      >
        {t(LanguageKey.table.filterTitle)}
      </Button>
    </Stack>
  );
}
