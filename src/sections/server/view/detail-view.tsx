import { TabContext, TabList, TabPanel } from '@mui/lab';
import { IconButton, styled, Tab } from '@mui/material';
import Box from '@mui/material/Box';
import { t } from 'i18next';
import { useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { NotFoundComponent } from 'src/components/no-found-data';
import { FetchingComponent } from 'src/components/progress';
import { LanguageKey } from 'src/constants';
import { usePageStore } from 'src/store/store';
import { useShallow } from 'zustand/react/shallow';
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

export function DetailView(
  props: IDetail & { storeName: string; handleReconnectServer?: () => void }
) {
  const { handleUpdate, handleReconnectServer, storeName } = props;

  const { data: defaultData, isLoading: loading = true } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  );
  const [tabState, setTabState] = useState<{ value: string }>({ value: 'general' });

  if (loading && !defaultData) return <FetchingComponent />;
  return (
    <Box>
      <TabContext value={tabState.value}>
        <TabList
          onChange={(_, value) => setTabState((s) => ({ ...s, value: value }))}
          aria-label="tab_server"
          allowScrollButtonsMobile
        >
          <StyledTab
            label={t(LanguageKey.server.generalTab)}
            value={'general'}
            iconPosition="start"
            icon={<Iconify icon="fluent-mdl2:server-enviroment" />}
          />
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={handleReconnectServer}
              size="small"
              color={defaultData?.is_connected ? 'success' : 'warning'}
            >
              <Iconify
                icon={
                  defaultData?.is_connected
                    ? 'icomoon-free:connection'
                    : 'material-symbols:signal-wifi-statusbar-not-connected'
                }
              />
            </IconButton>
          </Box>
        </TabList>

        <Box component={'div'} marginTop={3}>
          <TabPanel value="general" style={{ padding: 0, margin: 0 }}>
            <GeneralComponent handleUpdate={handleUpdate} defaultData={defaultData} />
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
}
