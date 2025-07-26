import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';
import type { ColorType } from 'src/theme/core/palette';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent, fShortenNumber } from 'src/utils/format-number';

import { bgGradient, varAlpha } from 'src/theme/styles';

import { Backdrop, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { invokeRequest } from 'src/api-core';
import { Chart, useChart } from 'src/components/chart';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

type ChartProps = {
  series: number[];
  categories: string[];
  options?: ChartOptions;
};

type Props = CardProps & {
  title: string;
  color?: ColorType;
  icon: React.ReactNode;
  baseUrl?: string;
  workspace?: workspacesType;
};

export function AnalyticsWidgetSummary({
  icon,
  title,
  color = 'primary',
  baseUrl,
  workspace,
  sx,
  ...other
}: Props) {
  const [{ total, chart, loading, percent, previousCount, recentCount }, setState] = useState<{
    loading?: boolean;
    percent?: number;
    total?: number;
    recentCount?: number;
    previousCount?: number;
    chart?: ChartProps;
  }>({
    loading: true,
    percent: 0,
    total: 0,
    previousCount: 0,
    recentCount: 0,
    chart: undefined,
  });

  useEffect(() => {
    baseUrl &&
      invokeRequest({
        baseURL: baseUrl!,
        onHandleError: () => {
          setState({ loading: false, chart: undefined });
        },
        onSuccess: (res) => {
          setState({ ...res, loading: false });
        },
      });
  }, [baseUrl, workspace]);

  const theme = useTheme();

  const chartColors = [theme.palette[color].dark];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    xaxis: { categories: chart?.categories },
    grid: { padding: { top: 6, left: 6, right: 6, bottom: 6 } },
    tooltip: {
      y: { formatter: (value: number) => fNumber(value), title: { formatter: () => '' } },
    },
    ...chart?.options,
  });

  const renderTrending = (
    <Box
      sx={{
        top: 16,
        gap: 0.5,
        right: 16,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
      }}
    >
      <Iconify
        width={20}
        icon={Number(percent) < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
      />
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {Number(percent) > 0 && '+'}
        {fPercent(percent)}
      </Box>
    </Box>
  );

  if (!loading && !chart) {
    return (
      <Card
        sx={{
          ...bgGradient({
            color: `135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)}`,
          }),
          p: 3,
          boxShadow: 'none',
          position: 'relative',
          color: `${color}.darker`,
          backgroundColor: 'common.white',
          ...sx,
        }}
        {...other}
      >
        <Backdrop
          sx={(theme) => ({
            position: 'absolute',
            color: theme.vars.palette.text.secondary,
            zIndex: theme.zIndex.drawer + 1,
          })}
          open={!loading && !chart}
        >
          <Iconify width={40} icon="fluent:shield-error-20-regular" />
        </Backdrop>
      </Card>
    );
  }
  return (
    <Card
      sx={{
        ...bgGradient({
          color: `135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)}`,
        }),
        p: 3,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxShadow: 'none',
        position: 'relative',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ width: 48, height: 48, mb: 3 }}>{icon}</Box>

      {!!percent && renderTrending}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>
          <Box sx={{ typography: 'h4', display: 'flex' }}>
            {fShortenNumber(total)}
            {!!recentCount && (
              <Typography color="common.error" variant="caption" fontWeight={500} ml={1}>
                (+{recentCount})
              </Typography>
            )}
          </Box>
        </Box>

        <Chart
          type="line"
          series={[{ data: chart?.series! }]}
          options={chartOptions}
          width={84}
          height={56}
        />
      </Box>

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: 'absolute',
          color: `${color}.main`,
        }}
      />
    </Card>
  );
}
