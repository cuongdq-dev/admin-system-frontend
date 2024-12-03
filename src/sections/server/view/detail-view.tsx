import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Paper, styled, Tab } from '@mui/material';
import Box from '@mui/material/Box';
import { t } from 'i18next';
import { useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { FetchingComponent } from 'src/components/progress';
import { LanguageKey } from 'src/constants';
import { GeneralComponent } from '../components/general';

const StyledTab = styled(Tab)(({ theme }) => ({
  marginRight: theme.spacing(1),
  transition: 'none',
  textTransform: 'none',
  fontWeight: 400,
  color: theme.vars.palette.text.disabled,
  padding: 0,
  '&.Mui-selected': {
    color: theme.vars.palette.text.primaryChannel,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export function DetailView(props: IDetail) {
  const { defaultData, loading, handleUpdate } = props;
  const [tabState, setTabState] = useState<{ value: string }>({ value: 'general' });

  if (loading) return <FetchingComponent />;
  return (
    <Box>
      <TabContext value={tabState.value}>
        <TabList
          onChange={(_, value) => setTabState((s) => ({ ...s, value: value }))}
          aria-label="tab_server"
        >
          <StyledTab
            label={t(LanguageKey.server.generalTab)}
            value={'general'}
            iconPosition="start"
            icon={<Iconify icon="fluent-mdl2:server-enviroment" />}
          />
          <StyledTab
            label={t(LanguageKey.server.statusTab)}
            value={'status'}
            iconPosition="start"
            icon={<Iconify icon="heroicons-solid:status-online" />}
          />
          <StyledTab
            label={t(LanguageKey.server.setupTab)}
            value={'config'}
            iconPosition="start"
            icon={<Iconify icon="icon-park-outline:config" />}
          />
        </TabList>

        <Box component={'div'} marginTop={3}>
          <TabPanel value="general" style={{ padding: 0, margin: 0 }}>
            <GeneralComponent handleUpdate={handleUpdate} defaultData={defaultData} />
          </TabPanel>
          <TabPanel value="status">Item Two</TabPanel>
          <TabPanel value="config">Item Three</TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
}
