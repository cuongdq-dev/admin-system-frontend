import { DashboardContent } from 'src/layouts/dashboard';

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  styled,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { invokeRequest } from 'src/api-core';
import { PATH_FIND_ME } from 'src/api-core/path';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey, StoreName } from 'src/constants';
import { usePageStore } from 'src/store/page';
import { useSettingStore } from 'src/store/setting';
import { useShallow } from 'zustand/react/shallow';

import { t } from 'i18next';
import ListCategoryTab from '../components/tabs/list-category';
import ListPostTab from '../components/tabs/list-post';
import ListSiteTab from '../components/tabs/list-site';
import ProfileMainTab from '../components/tabs/main';

// ----------------------------------------------------------------------

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: '0.9rem',
  marginRight: theme.spacing(1),
  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 1,
  },
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState(0);

  const storeName = StoreName.USER_DETAIL;
  const { setDetail } = usePageStore.getState();
  const { user } = useSettingStore(useShallow((state) => state));
  const { data = user } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  );

  const getProfile = () => {
    invokeRequest({
      baseURL: PATH_FIND_ME,
      onSuccess: (res) => {
        setDetail(storeName, { data: { ...res } });
      },
      onHandleError: () => {},
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Scrollbar sx={{ maxHeight: '100%', overflowX: 'hidden' }}>
      <DashboardContent
        sx={{ p: 'unset!important', mb: 4 }}
        breadcrumb={{ items: [{ href: '/blog', title: t(LanguageKey.common.listTitle) }] }}
      >
        <Box sx={{ position: 'relative', mb: { xs: 4, md: 4 } }}>
          <Box
            sx={{
              height: { xs: 200, sm: 250, md: 350 },
              width: '100%',
              position: 'relative',
              bgcolor: '#e1e4e8',
              backgroundImage: `url(${data?.avatar.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Button
              variant="contained"
              startIcon={<CameraAltIcon />}
              sx={{ position: 'absolute', bottom: 16, right: 16 }}
            >
              Edit Cover
            </Button>
          </Box>

          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-end' },
                mt: { xs: -8, sm: -10, md: -9 },
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Avatar
                src={data?.avatar?.url}
                alt={data?.avatar?.slug}
                sx={{
                  width: { xs: 120, sm: 150, md: 168 },
                  height: { xs: 120, sm: 150, md: 168 },
                  border: '4px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
              <Box
                sx={{
                  ml: { xs: 0, md: 3 },
                  mt: { xs: 2, md: 0 },
                  mb: { xs: 1, md: 2 },
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                <Typography variant="h4" component="h1" fontWeight="bold">
                  {data?.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {data?.email}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mt: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'space-between' } }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => {
                  setActiveTab(newValue);
                }}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                    height: 3,
                  },
                }}
              >
                <StyledTab label="Profile" />
                <StyledTab label="Blogs" />
                <StyledTab label="Sites" />
                <StyledTab label="Categories" />
              </Tabs>
            </Box>
          </Container>
        </Box>
        <CustomTabPanel value={activeTab} index={0}>
          <ProfileMainTab handleChangeTab={(value) => value && setActiveTab(value)} data={data} />
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={1}>
          <ListPostTab />
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={2}>
          <ListSiteTab />
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={3}>
          <ListCategoryTab />
        </CustomTabPanel>
      </DashboardContent>
    </Scrollbar>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};
