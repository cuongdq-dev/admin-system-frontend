import { Box, Grid, Paper, styled } from '@mui/material';
import { t } from 'i18next';
import { FieldValues, UseFormSetError } from 'react-hook-form';
import { LanguageKey } from 'src/constants';
import { AnalyticsSystem } from './analytics-system';
import { BasicInformation } from './information';
import { StatusServer } from './status';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

type Props = {
  defaultData?: IServer;
  handleUpdate?: (setError: UseFormSetError<FieldValues>, values?: Record<string, any>) => void;
};

export const GeneralComponent = (props: Props) => {
  const { defaultData, handleUpdate } = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Item sx={{ height: '100%' }}>
          <Box display="flex" justifyContent={'flex-end'} paddingX={2} paddingY={2}>
            <StatusServer status={defaultData?.is_active} />
          </Box>
          <AnalyticsSystem
            title="Monitoring Server"
            chart={{
              categories: [
                t(LanguageKey.server.ram),
                t(LanguageKey.server.room),
                t(LanguageKey.server.network),
                t(LanguageKey.server.disk),
              ],
              used: [10, 20, 30, 40],
              available: [22, 100, 100, 720],
              units: ['Gb', 'Gb', 'Mb/s', 'Gb'],
            }}
          />
        </Item>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Item sx={{ height: '100%' }}>
          <BasicInformation defaultData={defaultData} handleUpdate={handleUpdate} />
        </Item>
      </Grid>

      <Grid item xs={12} sm={12}>
        <Item sx={{ height: '100%' }}>
          <BasicInformation defaultData={defaultData} handleUpdate={handleUpdate} />
        </Item>
      </Grid>
    </Grid>
  );
};
