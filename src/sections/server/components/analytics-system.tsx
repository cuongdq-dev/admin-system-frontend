import type { CardProps } from '@mui/material/Card';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import type { ChartOptions } from 'src/components/chart';
import { Chart, useChart } from 'src/components/chart';
import { varAlpha } from 'src/theme/styles';
import { fNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    units?: string[];
    categories?: string[];
    values?: string[];
    used: number[];
    available: number[];
    options?: ChartOptions;
  };
};

export function AnalyticsSystem({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const totalValues = chart.used.map((used, index) => used + chart.available[index]);
  const percentageUsed = chart.used.map((used, index) => (used / totalValues[index]) * 100);
  const chartOptions = useChart({
    colors: [
      theme.vars.palette.error['main'], //used
      varAlpha(theme.vars.palette.grey['500Channel'], 0.1), // available
    ],
    stroke: { show: false },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number, opts: any) => {
          const originalValue =
            opts.seriesIndex === 0
              ? chart.used[opts.dataPointIndex]
              : chart.available[opts.dataPointIndex];
          const unit = chart.units![opts.dataPointIndex];
          return `${fNumber(originalValue, undefined, unit)}`;
        },
        title: { formatter: (seriesName: string) => `${seriesName}: ` },
      },
    },
    xaxis: { categories: chart.categories },

    dataLabels: {
      enabled: true,
      offsetX: -22,
      dropShadow: { enabled: false },
      formatter: (value: number, opts: any) => {
        const originalValue =
          opts.seriesIndex === 0
            ? chart.used[opts.dataPointIndex]
            : chart.available[opts.dataPointIndex] + chart.used[opts.dataPointIndex];

        return opts.seriesIndex === 0
          ? ''
          : `${fNumber(originalValue)}(${chart.units![opts.dataPointIndex]})`;
      },
      style: { fontSize: '10px', colors: ['#FFFFFF', theme.palette.text.primary] },
    },

    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 2,
        barHeight: '48%',
        dataLabels: { position: 'top' },
      },
    },
    chart: {
      type: 'bar',
      stacked: true,
      stackType: '100%',
      height: 350,
    },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Chart
        type="bar"
        series={[
          { name: t('server_used'), data: percentageUsed },
          { name: t('server_available'), data: totalValues },
        ]}
        options={chartOptions}
        height={360}
      />
    </Card>
  );
}
