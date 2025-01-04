import { Box, styled } from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import type { ChartOptions } from 'src/components/chart';
import { Chart, useChart } from 'src/components/chart';
import { LanguageKey, StoreName } from 'src/constants';
import { usePageStore } from 'src/store/page';
import { varAlpha } from 'src/theme/styles';
import { fNumber } from 'src/utils/format-number';
import { useShallow } from 'zustand/react/shallow';

type Props = CardProps & {
  title?: string;
  subheader?: string;
  connectionId?: string;
  connected?: boolean;
  actived?: boolean;
};

type ChartType = {
  units?: string[];
  categories?: string[];
  values?: string[];
  used: number[];
  available: number[];
  options?: ChartOptions;
};

const StyleChipActive = styled(Box)(({ theme }) => {
  return {
    fontWeight: theme.typography.fontWeightBold,
    borderRadius: 6,
    fontSize: '0.75rem',
    height: 24,
    padding: '0 6px',
    alignContent: 'center',
  };
});

export function AnalyticsSystem(props: Props) {
  const storeName = StoreName.SERVER;
  const { title, subheader, connected, actived, connectionId, ...other } = props;
  const theme = useTheme();

  const { data } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  );
  const chart =
    data?.serverStatus?.value ||
    ({
      available: [0, 0, 0],
      used: [0, 0, 0],
      categories: ['', '', ''],
      units: ['', '', ''],
    } as ChartType);

  const totalValues = chart?.used.map(
    (used: number, index: number) => used + chart?.available[index]!
  );
  const percentageUsed = chart?.used.map(
    (used: number, index: number) => (used / totalValues![index]) * 100
  );
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
              ? chart?.used[opts.dataPointIndex]
              : chart?.available[opts.dataPointIndex];
          const unit = chart?.units![opts.dataPointIndex];
          return `${fNumber(originalValue, undefined, unit)}`;
        },
        title: { formatter: (seriesName: string) => `${seriesName}: ` },
      },
    },
    xaxis: { categories: chart?.categories || [] },

    dataLabels: {
      enabled: true,
      offsetX: -22,
      dropShadow: { enabled: false },
      formatter: (value: number, opts: any) => {
        const originalValue =
          opts.seriesIndex === 0
            ? chart?.used[opts.dataPointIndex]
            : chart?.available[opts.dataPointIndex]! + chart?.used[opts.dataPointIndex]!;

        return opts.seriesIndex === 0
          ? ''
          : `${fNumber(originalValue)}(${chart?.units![opts.dataPointIndex]})`;
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
    chart: { type: 'bar', stacked: true, stackType: '100%' },
    ...chart?.options,
  });

  return (
    <>
      <Box display="flex" justifyContent={'space-between'} paddingX={2} paddingY={2}>
        <Box></Box>

        <Box display="flex" alignItems="center">
          {connected ? (
            <StyleChipActive
              sx={(theme) => {
                return {
                  backgroundColor: varAlpha(theme.vars.palette.success.mainChannel, 0.16),
                  color: theme.vars.palette.success.dark,
                };
              }}
            >
              {t(LanguageKey.server.connected)}
            </StyleChipActive>
          ) : (
            <StyleChipActive
              sx={(theme) => {
                return {
                  backgroundColor: varAlpha(theme.vars.palette.error.mainChannel, 0.16),
                  color: theme.vars.palette.error.dark,
                };
              }}
            >
              {t(LanguageKey.server.disconnected)}
            </StyleChipActive>
          )}
        </Box>
      </Box>
      <Card sx={{ boxShadow: 'none' }} {...other}>
        <CardHeader
          titleTypographyProps={{ fontWeight: 'typography.fontWeightBold' }}
          title={title}
          subheader={subheader}
        />
        <Chart
          type="bar"
          series={[
            { name: t(LanguageKey.server.used), data: percentageUsed! },
            { name: t(LanguageKey.server.available), data: totalValues! },
          ]}
          minHeight={300}
          options={chartOptions}
        />
      </Card>
    </>
  );
}
