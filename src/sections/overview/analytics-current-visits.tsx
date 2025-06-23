import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { useEffect, useState } from 'react';
import { Chart, ChartLegends, useChart } from 'src/components/chart';
import { invokeRequest } from 'src/api-core';
import { Backdrop } from '@mui/material';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ChartProps = {
  colors?: string[];
  series: {
    label: string;
    value: number;
  }[];
  options?: ChartOptions;
};
type Props = CardProps & {
  baseUrl?: string;
  title?: string;
  subheader?: string;
  workspace?: workspacesType;
};

export function AnalyticsCurrentVisits({ title, subheader, baseUrl, workspace, ...other }: Props) {
  const theme = useTheme();
  const [{ loading, chart }, setState] = useState<{ loading?: boolean; chart?: ChartProps }>({
    loading: false,
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

  const chartSeries = chart?.series.map((item) => item.value);

  const chartColors = chart?.colors ?? [
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.secondary.dark,
    theme.palette.error.main,
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart?.series.map((item) => item.label),
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: { pie: { donut: { labels: { show: false } } } },
    ...chart?.options,
  });

  if (!loading && !chart)
    return (
      <Card {...other}>
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
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="pie"
        series={chartSeries}
        options={chartOptions}
        width={{ xs: 240, xl: 260 }}
        height={{ xs: 240, xl: 260 }}
        sx={{ my: 6, mx: 'auto' }}
      />

      <Divider sx={{ borderStyle: 'dashed' }} />

      <ChartLegends
        labels={chartOptions?.labels}
        colors={chartOptions?.colors}
        sx={{ p: 3, justifyContent: 'center' }}
      />
    </Card>
  );
}
