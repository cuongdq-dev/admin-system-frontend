import { Box, IconButton, styled } from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import { useState } from 'react';
import { PATH_SERVER } from 'src/api-core/path';
import type { ChartOptions } from 'src/components/chart';
import { Chart, useChart } from 'src/components/chart';
import { RefreshIcon } from 'src/components/icon';
import { LanguageKey } from 'src/constants';
import { useAPI } from 'src/hooks/use-api';
import { varAlpha } from 'src/theme/styles';
import { fNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  connectionId?: string;
  connected?: boolean;
  actived?: boolean;
  handleReconnectServer?: () => void;
};

type State = {
  loading?: boolean;
  chart?: {
    units?: string[];
    categories?: string[];
    values?: string[];
    used: number[];
    available: number[];
    options?: ChartOptions;
  };
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
  const { title, subheader, connected, actived, connectionId, handleReconnectServer, ...other } =
    props;
  const theme = useTheme();

  const [state, setState] = useState<State>({
    loading: true,
    chart: { used: [], available: [] },
  });
  const [refreshNumber, setRefresh] = useState(0);

  useAPI({
    refreshNumber: refreshNumber,
    baseURL: PATH_SERVER + `/status/${connectionId}`,
    onSuccess: (res) => {
      setState({ loading: false, chart: res });
    },

    onHandleError: () => {
      setState((s) => ({ ...s, loading: false }));
    },
  });

  const totalValues = state?.chart?.used.map(
    (used, index) => used + state?.chart?.available[index]!
  );
  const percentageUsed = state?.chart?.used.map(
    (used, index) => (used / totalValues![index]) * 100
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
              ? state?.chart?.used[opts.dataPointIndex]
              : state?.chart?.available[opts.dataPointIndex];
          const unit = state?.chart?.units![opts.dataPointIndex];
          return `${fNumber(originalValue, undefined, unit)}`;
        },
        title: { formatter: (seriesName: string) => `${seriesName}: ` },
      },
    },
    xaxis: { categories: state?.chart?.categories },

    dataLabels: {
      enabled: true,
      offsetX: -22,
      dropShadow: { enabled: false },
      formatter: (value: number, opts: any) => {
        const originalValue =
          opts.seriesIndex === 0
            ? state?.chart?.used[opts.dataPointIndex]
            : state?.chart?.available[opts.dataPointIndex]! +
              state?.chart?.used[opts.dataPointIndex]!;

        return opts.seriesIndex === 0
          ? ''
          : `${fNumber(originalValue)}(${state?.chart?.units![opts.dataPointIndex]})`;
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
    ...state?.chart?.options,
  });

  return (
    <>
      <Box display="flex" justifyContent={'space-between'} paddingX={2} paddingY={2}>
        <IconButton
          onClick={() => {
            setRefresh(refreshNumber + 1);
            setState((s) => ({ ...s, loading: true }));
          }}
        >
          <RefreshIcon loading={state.loading} icon={'mdi:refresh'} />
        </IconButton>

        <Box display="flex" alignItems="center">
          <IconButton
            onClick={() => {
              handleReconnectServer && handleReconnectServer();
            }}
          >
            <RefreshIcon loading={state.loading} icon={'mdi:refresh'} />
          </IconButton>
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
                  color:
                    theme.palette.mode === 'dark'
                      ? theme.vars.palette.error.light
                      : theme.vars.palette.error.dark,
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
