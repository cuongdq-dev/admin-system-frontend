import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import { alpha as hexAlpha, useTheme } from '@mui/material/styles';

import { Clear, ExpandMore, FilterList } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  CardContent,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { invokeRequest } from 'src/api-core';
import { Iconify } from 'src/components/iconify';
import CustomChart from './custom-chart';
import { t } from 'i18next';
import { LanguageKey } from 'src/constants';

// ----------------------------------------------------------------------

type ChartProps = {
  colors?: string[];
  categories?: string[];
  series: {
    name: string;
    data: number[];
  }[];
  options?: ChartOptions;
};
type Props = CardProps & {
  title: string;
  description?: string;
  baseUrl?: string;
  subheader?: string;
  workspace?: workspacesType;
};

interface ChartData {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

interface FilterState {
  searchTerm: string;
  valueRange: [number, number];
  sortBy: 'name' | 'value' | 'original';
  sortOrder: 'asc' | 'desc';
  selectedCategories: string[];
}

export function AnalyticsConversionRates({
  baseUrl,
  title,
  subheader,
  workspace,
  description,
  ...other
}: Props) {
  const theme = useTheme();

  const [{ loading, chart }, setState] = useState<{ loading?: boolean; chart: ChartProps }>({
    loading: false,
    chart: { series: [{ data: [], name: '' }], categories: [] },
  });

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    valueRange: [0, 150],
    sortBy: 'original',
    sortOrder: 'desc',
    selectedCategories: [],
  });

  useEffect(() => {
    baseUrl &&
      invokeRequest({
        baseURL: baseUrl!,
        onHandleError: () => setState({ loading: false, chart: chart }),
        onSuccess: (res) => setState({ ...res, loading: false }),
      });
  }, [baseUrl, workspace]);

  if (!loading && !chart)
    return (
      <Card
        {...other}
        sx={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          borderRadius: 2,
          border: `1px solid ${hexAlpha(theme.palette.grey[500], 0.08)}`,
        }}
      >
        <Backdrop
          sx={(theme) => ({
            position: 'absolute',
            color: theme.vars.palette.text.secondary,
            zIndex: theme.zIndex.drawer + 1,
            borderRadius: 2,
          })}
          open={!loading && !chart}
        >
          <Iconify width={40} icon="fluent:shield-error-20-regular" />
        </Backdrop>
      </Card>
    );

  // Get min and max values for slider
  const minValue = Math.min(...chart.series?.[0].data);
  const maxValue = Math.max(...chart.series?.[0].data);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = chart?.categories?.map((category, index) => ({
      category,
      value: chart?.series[0].data[index],
    }));

    // Apply search filter
    if (filters.searchTerm) {
      filtered = filtered?.filter((item) =>
        item.category.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Apply value range filter
    filtered = filtered?.filter(
      (item) => item.value >= filters.valueRange[0] && item.value <= filters.valueRange[1]
    );

    // Apply category selection filter
    if (filters.selectedCategories.length > 0) {
      filtered = filtered?.filter((item) => filters.selectedCategories.includes(item.category));
    }

    // Apply sorting
    if (filters.sortBy === 'name') {
      filtered?.sort((a, b) => {
        const comparison = a.category.localeCompare(b.category, 'vi');
        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });
    } else if (filters.sortBy === 'value') {
      filtered?.sort((a, b) => {
        const comparison = a.value - b.value;
        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });
    }
    // 'original' keeps the original order

    return {
      categories: filtered?.map((item) => item.category) || [],
      series: [
        {
          name: chart?.series[0].name || '',
          data: filtered?.map((item) => item.value) || [],
        },
      ],
    };
  }, [chart, filters]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      valueRange: [minValue, maxValue],
      sortBy: 'original',
      sortOrder: 'desc',
      selectedCategories: [],
    });
  };

  // Handle category selection
  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }));
  };

  return (
    <Card elevation={3} sx={{ maxWidth: '100%', margin: 'auto' }}>
      <CardContent>
        <Box sx={{ my: 1 }}>
          <Typography variant="h5" component="h2" gutterBottom color="primary">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>

        {/* Filter Section */}
        <Accordion
          sx={(theme) => {
            return {
              mt: 3,
              backgroundColor: theme.palette.background.default,
              borderRadius: 2,
              '&.MuiAccordionSummary-root': { borderRadius: 2 },
              '&::before': { display: 'none' },
            };
          }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList fontSize={'small'} />
              <Typography variant="button">{t(LanguageKey.chart.filter)}</Typography>
              {(filters.searchTerm ||
                filters.selectedCategories.length > 0 ||
                filters.valueRange[0] !== minValue ||
                filters.valueRange[1] !== maxValue) && (
                <Chip
                  label={`${filteredData?.categories?.length}/${chart?.categories?.length}`}
                  size="small"
                  sx={{ fontSize: '9px' }}
                  color="primary"
                />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              {/* Search Filter */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t(LanguageKey.chart.searchLabel)}
                  value={filters.searchTerm}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
                  variant="outlined"
                  size="small"
                  margin="none"
                />
              </Grid>

              {/* Sort Options */}
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t(LanguageKey.chart.sortBy)}</InputLabel>
                  <Select
                    margin="none"
                    value={filters.sortBy}
                    label={t(LanguageKey.chart.sortBy)}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value as 'name' | 'value' | 'original',
                      }))
                    }
                  >
                    <MenuItem value="original">{t(LanguageKey.chart.sortByStt)}</MenuItem>
                    <MenuItem value="name">{t(LanguageKey.chart.sortByType)}</MenuItem>
                    <MenuItem value="value">{t(LanguageKey.chart.sortByNumber)}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t(LanguageKey.chart.sortOrderTitle)}</InputLabel>
                  <Select
                    margin="none"
                    value={filters.sortOrder}
                    label={t(LanguageKey.chart.sortOrderTitle)}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortOrder: e.target.value as 'asc' | 'desc',
                      }))
                    }
                  >
                    <MenuItem value="asc">{t(LanguageKey.chart.ascTitle)}</MenuItem>
                    <MenuItem value="desc">{t(LanguageKey.chart.descTitle)}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={1}>
                <Tooltip title={t(LanguageKey.chart.clearFilterTitle)}>
                  <IconButton onClick={resetFilters} color="primary">
                    <Clear />
                  </IconButton>
                </Tooltip>
              </Grid>

              {/* Value Range Filter */}
              <Grid item xs={12}>
                <Typography gutterBottom>
                  {t(LanguageKey.chart.rangeTitle)
                    .replace('{min}', filters.valueRange[0].toString())
                    .replace('{max}', filters?.valueRange[1].toString())}
                </Typography>
                <Slider
                  value={filters.valueRange}
                  onChange={(_, newValue) =>
                    setFilters((prev) => ({
                      ...prev,
                      valueRange: newValue as [number, number],
                    }))
                  }
                  valueLabelDisplay="auto"
                  min={minValue}
                  max={maxValue}
                  marks={[
                    { value: minValue, label: minValue.toString() },
                    { value: maxValue, label: maxValue.toString() },
                  ]}
                />
              </Grid>

              {/* Category Selection */}
              <Grid item xs={12}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {chart?.categories?.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => handleCategoryToggle(category)}
                      color={filters.selectedCategories.includes(category) ? 'primary' : 'default'}
                      variant={
                        filters.selectedCategories.includes(category) ? 'filled' : 'outlined'
                      }
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Chart Component */}
        <CustomChart
          categories={filteredData.categories}
          series={filteredData.series}
          title="Thống Kê Thể Loại Truyện/Sách"
          onRefresh={resetFilters}
          showToolbar={true}
          chartType="bar"
          horizontal={true}
          dataLabelFormatter={(value: number) => value.toString()}
          tooltipFormatter={(value: number) => `${value} truyện/sách`}
        />

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {t(LanguageKey.chart.totalTitle).replace(
              '{number}',
              `${Number(filteredData?.categories?.length)}/${Number(chart.categories?.length!)}`
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
