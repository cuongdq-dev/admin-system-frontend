import {
  Download,
  Fullscreen,
  Image,
  Refresh,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Box, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import type { ApexOptions } from 'apexcharts';
import { t } from 'i18next';
import { useState } from 'react';
import { Chart } from 'src/components/chart';
import { LanguageKey } from 'src/constants';

// Dynamically import ApexCharts to avoid SSR issues

interface ChartSeries {
  name: string;
  data: number[];
}

interface CustomChartProps {
  categories: string[];
  series: ChartSeries[];
  title?: string;
  height?: number;
  onRefresh?: () => void;
  showToolbar?: boolean;
  chartType?: 'bar' | 'line' | 'area';
  horizontal?: boolean;
  colors?: string[];
  dataLabelFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
}

export default function CustomChart({
  categories,
  series,
  title = 'Chart',
  height = 400,
  onRefresh,
  showToolbar = true,
  chartType = 'bar',
  horizontal = true,
  colors,
  dataLabelFormatter = (value: number) => value.toString(),
  tooltipFormatter = (value: number) => `${value}`,
}: CustomChartProps) {
  const theme = useTheme();

  // Custom toolbar state
  const [showDataLabels, setShowDataLabels] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Custom toolbar handlers
  const handleDownloadChart = () => {
    // This will trigger ApexCharts' built-in download
    const chartElement = document.querySelector('.apexcharts-toolbar .apexcharts-menu-icon');
    if (chartElement) {
      (chartElement as HTMLElement).click();
    }
  };

  const handleRefreshChart = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const toggleDataLabels = () => {
    setShowDataLabels(!showDataLabels);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Category', ...series.map((s) => s.name)],
      ...categories.map((category, index) => [category, ...series.map((s) => s.data[index] || 0)]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate dynamic height based on number of categories for horizontal bar charts
  const calculateChartHeight = (categoryCount: number) => {
    if (!horizontal || chartType !== 'bar') return height;

    const minHeight = 300;
    const maxHeight = 800;
    const heightPerCategory = 20;
    const baseHeight = 150;

    const calculatedHeight = baseHeight + categoryCount * heightPerCategory;
    return Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
  };

  const chartHeight = calculateChartHeight(categories.length);

  const chartOptions: ApexOptions = {
    chart: {
      type: chartType,
      height: chartHeight,
      toolbar: {
        show: false, // We use custom toolbar
      },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal: horizontal,
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: showDataLabels,
      offsetX: horizontal ? 10 : 0,
      offsetY: horizontal ? 0 : -10,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: [theme.palette.text.primary],
      },
      formatter: (value: number) => dataLabelFormatter(value),
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px',
        },
        maxWidth: horizontal ? 120 : undefined,
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    colors: colors || [theme.palette.primary.main],
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (value: number) => tooltipFormatter(value),
      },
    },
    legend: {
      show: series.length > 1,
      position: 'top',
      horizontalAlign: 'left',
      labels: {
        colors: theme.palette.text.primary,
      },
    },
    stroke: {
      curve: 'smooth',
      width: chartType === 'line' || chartType === 'area' ? 2 : 0,
    },
    fill: {
      opacity: chartType === 'area' ? 0.6 : 1,
    },
  };

  return (
    <>
      {/* Custom Toolbar */}
      {showToolbar && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            top: 20,
            right: 20,
          }}
        >
          <Stack direction="row" spacing={1}>
            <Tooltip title={t(LanguageKey.chart.exportCsv)}>
              <IconButton size="small" onClick={exportToCSV} color="primary">
                <Download />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={
                showDataLabels ? t(LanguageKey.chart.hideLabel) : t(LanguageKey.chart.showLabel)
              }
            >
              <IconButton size="small" onClick={toggleDataLabels} color="primary">
                {showDataLabels ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </Tooltip>

            {onRefresh && (
              <Tooltip title={t(LanguageKey.chart.resetButton)}>
                <IconButton size="small" onClick={handleRefreshChart} color="primary">
                  <Refresh />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>
      )}

      <Box sx={{ width: '100%' }}>
        <Chart options={chartOptions} series={series} type={chartType} height={chartHeight} />
      </Box>
    </>
  );
}
