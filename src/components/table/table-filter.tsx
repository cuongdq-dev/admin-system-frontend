import { Stack, useMediaQuery } from '@mui/material';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { t } from 'i18next';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormProvider } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey } from 'src/constants';

type TableFilterProps = {
  convertValue?: (values?: Record<string, any>) => Record<string, any>;
  render?: ({
    isSubmitting,
    defaultValues,
  }: {
    isSubmitting: boolean;
    defaultValues?: Record<string, any>;
  }) => JSX.Element;
};
export function TableFilter(props: TableFilterProps) {
  const navigate = useNavigate();
  const { render, convertValue } = props;

  const isMobile = useMediaQuery('(max-width:600px)');

  const methods = useForm({});
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, defaultValues },
  } = methods;

  const [isLoading, setLoading] = useState(isSubmitting);
  const defaultFilters = Object.fromEntries(new URLSearchParams(window.location.search));

  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<any>(defaultFilters);

  useEffect(() => {
    setFilters(Object.fromEntries(new URLSearchParams(window.location.search)));
  }, [window.location.search]);

  const canReset = Object.keys(filters).length > 0;

  const onOpenFilter = () => {
    setOpenFilter(true);
  };
  const onCloseFilter = () => {
    setOpenFilter(false);
  };
  const onResetFilter = () => {
    setFilters({});
    navigate('', { replace: true });
    onCloseFilter();
  };

  useEffect(() => {
    reset();
  }, [openFilter]);

  const onSubmit = async (data: Record<string, any>) => {
    setLoading(true);

    const values = (convertValue && convertValue(data)) || data;
    const queryParams = new URLSearchParams(window.location.search);
    Object.entries(values).forEach(([key, value]) => {
      if (value) queryParams.set(key, value?.toString());
      else queryParams.delete(key);
    });

    navigate(`?${queryParams.toString()}`, { replace: true });

    setTimeout(() => {
      // onCloseFilter();
      setLoading(false);
    }, 200);
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpenFilter}
      >
        {t(LanguageKey.table.filterTitle)}
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: isMobile ? '90%' : 400, overflow: 'hidden' },
        }}
      >
        <Box display="flex" alignItems="center" sx={{ pl: 2.5, pr: 1.5, py: 2 }}>
          <Typography variant="h6" flexGrow={1}>
            {t(LanguageKey.table.filterTitle)}
          </Typography>

          <IconButton onClick={onResetFilter}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:refresh-linear" />
            </Badge>
          </IconButton>

          <IconButton onClick={onCloseFilter}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>
        <Divider />
        <Scrollbar>
          <Stack spacing={3} sx={{ p: 2.5 }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              {render && render({ isSubmitting: isLoading, defaultValues: filters })}
            </FormProvider>
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
