import { Box, Card, Grid, Paper, styled, Typography } from '@mui/material';
import { t } from 'i18next';
import { FieldValues, UseFormSetError } from 'react-hook-form';
import { LanguageKey } from 'src/constants';
import { AnalyticsSystem } from './analytics-system';
import { BasicInformation } from './information';
import { StatusServer } from './status';
import { Iconify } from 'src/components/iconify';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ServiceItem = styled(Paper)(({ theme }) => ({
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderRadius: 16,
  height: 80,
  borderColor: theme.vars.palette.divider,
  borderStyle: 'solid',
  marginTop: 4,
  marginBottom: 16,
  boxShadow: 'none',
  alignContent: 'center',
  padding: theme.spacing(2),
  '&:hover': {
    backgroundColor: theme.vars.palette.background.paper,
  },
}));

type Props = {
  defaultData?: IServer;
  handleUpdate?: (setError: UseFormSetError<FieldValues>, values?: Record<string, any>) => void;
};

type Service = { name?: string; icon?: string; description: string; installed: boolean };
const ServerService: Service[] = [
  {
    name: 'Docker',
    icon: 'skill-icons:docker',
    description: '30mb',
    installed: false,
  },

  {
    name: 'Nginx',
    icon: 'devicon:nginx',
    description: '30mb',
    installed: false,
  },
  {
    name: 'Postgresql',
    icon: 'skill-icons:postgresql-dark',
    description: '30mb',
    installed: true,
  },
];
export const GeneralComponent = (props: Props) => {
  const { defaultData, handleUpdate } = props;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Item sx={{ height: '100%' }}>
            <Box display="flex" justifyContent={'flex-end'} paddingX={2} paddingY={2}>
              <StatusServer status={defaultData?.is_active} />
            </Box>
            <AnalyticsSystem
              title={defaultData?.name}
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
        <Grid item xs={12} sm={12} marginTop={2}>
          <Typography variant="h6">{t(LanguageKey.server.allService)}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} marginTop={1}>
        <Grid item xs={12} sm={6}>
          {ServerService.map((service: Service) => {
            return (
              <ServiceItem>
                <Box width={'100%'} display="flex" flexDirection="row">
                  <Iconify width={36} icon={service.icon!} />
                  <Box width={'100%'} marginX={1}>
                    <Typography
                      sx={(theme) => {
                        return {
                          fontSize: theme.typography.caption,
                          fontWeight: theme.typography.fontWeightBold,
                        };
                      }}
                    >
                      {service.name}
                    </Typography>
                    <Typography
                      sx={(theme) => {
                        return {
                          fontSize: theme.typography.caption,
                          color: theme.vars.palette.grey[200],
                        };
                      }}
                    >
                      {service.description}
                    </Typography>
                  </Box>

                  <Box sx={{ float: 'right', alignContent: 'center' }}>
                    {service.installed ? (
                      <Iconify
                        sx={{ color: 'primary.main' }}
                        icon="icon-park-solid:folder-success"
                      />
                    ) : (
                      <Iconify
                        sx={{ color: 'grey', cursor: '' }}
                        icon="icon-park-solid:folder-success"
                      />
                    )}
                  </Box>
                </Box>
              </ServiceItem>
            );
          })}
        </Grid>
      </Grid>
    </>
  );
};
