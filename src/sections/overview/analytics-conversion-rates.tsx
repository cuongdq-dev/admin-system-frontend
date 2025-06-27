import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { alpha as hexAlpha, useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Backdrop } from '@mui/material';
import { useEffect, useState } from 'react';
import { invokeRequest } from 'src/api-core';
import { Chart, useChart } from 'src/components/chart';
import { Iconify } from 'src/components/iconify';

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
  baseUrl?: string;
  title?: string;
  subheader?: string;
  workspace?: workspacesType;
};

export function AnalyticsConversionRates({
  baseUrl,
  title,
  subheader,
  workspace,
  ...other
}: Props) {
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

  const chartColors = chart?.colors ?? [
    theme.palette.primary.dark,
    hexAlpha(theme.palette.primary.dark, 0.24),
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 2, colors: ['transparent'] },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}: ` },
      },
    },
    xaxis: { categories: chart?.categories },
    dataLabels: {
      enabled: true,
      offsetX: -10,
      style: {
        fontSize: '10px',
        colors: ['#FFFFFF', theme.palette.text.primary],
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 2,
        barHeight: '48%',
        dataLabels: { position: 'top' },
      },
    },
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
        type="bar"
        series={chart?.series}
        options={chartOptions}
        height={Number(chart?.categories?.length) * 30}
        minHeight={430}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
