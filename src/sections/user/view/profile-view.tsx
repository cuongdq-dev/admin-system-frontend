import CameraAltRounded from '@mui/icons-material/CameraAltRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DashboardContent } from 'src/layouts/dashboard';

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  styled,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_FIND_ME } from 'src/api-core/path';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey, StoreName } from 'src/constants';
import { usePageStore } from 'src/store/page';
import { useSettingStore } from 'src/store/setting';
import { useShallow } from 'zustand/react/shallow';

import { t } from 'i18next';
import React from 'react';
import { ButtonUpload } from 'src/components/image/upload-thumbnail';
import ProfileInfoCard from '../components/profile-info';
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
  const { data = user as IUser } = usePageStore(
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
        <Box sx={{ position: 'relative', mb: { xs: 0, md: 4 } }}>
          <CustomUploadBanner storeName={storeName} defautlValue={data?.banner} />
          <Container
            maxWidth="lg"
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'flex-end' },
                mt: { xs: -8, sm: -10, md: -9 },
                position: 'relative',
                width: { xs: '100%', md: 'fit-content' },
                flexWrap: 'nowrap',
              }}
            >
              <CustomUploadAvatar storeName={storeName} defautlValue={data?.avatar} />

              <Box
                sx={{
                  ml: { xs: 0, md: 3 },
                  mt: { xs: 2, md: 0 },
                  mb: { xs: 1, md: 2 },
                  textAlign: { xs: 'left', md: 'left' },
                  width: { xs: '100%' },
                }}
              >
                <Typography variant="h4" component="h1" fontWeight="bold">
                  {data?.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {data?.email}
                </Typography>
                <CustomUpdateProfile />
              </Box>
            </Box>

            <Divider sx={{ mt: 2, width: '100%  ' }} />

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

const CustomUpdateProfile = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <Button
        fullWidth
        onClick={() => setOpen(true)}
        variant="outlined"
        sx={(theme) => {
          return {
            mt: 1,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.background.paper}`,
            color: theme.palette.text.primary,
            display: { md: 'none' },
          };
        }}
      >
        {t(LanguageKey.user.editProfileTitle)}
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="update-user-avatar"
        fullWidth
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <ProfileInfoCard handleClose={() => setOpen(false)} isEdit={open} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
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

const CustomUploadBanner = ({
  defautlValue,
  storeName,
}: {
  defautlValue?: IMedia;
  storeName: string;
}) => {
  const [banner, setBanner] = useState<File | undefined>(undefined);
  const { setDetail } = usePageStore.getState();
  const { data } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  );

  const handleUploadBanner = () => {
    invokeRequest({
      baseURL: PATH_FIND_ME + '/banner',
      method: HttpMethod.PATCH,
      params: { banner: banner },
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
      onSuccess: (res) => {
        setBanner(undefined);
        setDetail(storeName, { data: { ...data, banner: res?.banner } });
      },
    });
  };
  return (
    <>
      {banner && (
        <Box
          sx={(theme) => {
            return {
              zIndex: 100,
              padding: 2,
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              backgroundColor: theme.palette.background.default,
              gap: 2,
            };
          }}
        >
          <Button
            onClick={() => {
              setBanner(undefined);
            }}
            variant="outlined"
          >
            {t(LanguageKey.button.cancel)}
          </Button>
          <Button onClick={handleUploadBanner} variant="contained">
            {t(LanguageKey.button.save)}
          </Button>
        </Box>
      )}
      <Box
        sx={(theme) => {
          return {
            height: { xs: 200, sm: 250, md: 350 },
            width: '100%',
            position: 'relative',
            bgcolor: 'background.paper',
            backgroundImage: `url(${banner instanceof File ? URL.createObjectURL(banner) : defautlValue?.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          };
        }}
      >
        {!banner && (
          <Box sx={{ position: 'absolute', right: 20, bottom: 20, zIndex: 1 }}>
            <ButtonUpload
              upload={(file) => {
                setBanner(file);
              }}
              title={
                <Typography
                  sx={{ display: { xs: 'none', sm: 'block', md: 'block' }, ml: 1 }}
                  variant="subtitle2"
                >
                  Edit Cover
                </Typography>
              }
            />
          </Box>
        )}
      </Box>
    </>
  );
};

const CustomUploadAvatar = ({
  defautlValue,
  storeName,
}: {
  defautlValue?: IMedia;
  storeName: string;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [avatar, setAvatar] = useState<File | undefined>(undefined);
  const { setDetail } = usePageStore.getState();
  const { data } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  );

  const handleClickUpload = () => {
    if (!isUploading) inputRef.current?.click();
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setIsUploading(true);
      setTimeout(() => {
        setAvatar(selectedFile);
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleUploadAvatar = () => {
    invokeRequest({
      baseURL: PATH_FIND_ME + '/avatar',
      method: HttpMethod.PATCH,
      params: { avatar: avatar },
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
      onSuccess: (res) => {
        setAvatar(undefined);
        setDetail(storeName, { data: { ...data, avatar: res?.avatar } });
      },
    });
  };
  return (
    <Box sx={{ position: 'relative' }}>
      <Avatar
        src={avatar instanceof File ? URL.createObjectURL(avatar) : defautlValue?.url}
        alt={data?.avatar?.slug}
        sx={(theme) => {
          return {
            width: { xs: 120, sm: 150, md: 168 },
            height: { xs: 120, sm: 150, md: 168 },
            border: `4px solid ${theme.palette.background.default}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          };
        }}
      />
      <DialogAvatar
        defaultOpen={!!avatar}
        file={avatar}
        user={data as IUser}
        handleCancel={() => setAvatar(undefined)}
        handleSave={handleUploadAvatar}
      />
      <input ref={inputRef} type="file" hidden onChange={handleUpload} accept="image/*" />
      {isUploading ? (
        <CircularProgress
          sx={(theme) => {
            return {
              cursor: 'pointer',
              height: 40,
              width: 40,
              backgroundColor: 'background.neutral',
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.primary',
              borderRadius: 20,
              padding: 1.2,
              position: 'absolute',
              bottom: 0,
              right: { xs: 0, md: 15 },
              zIndex: 100,
            };
          }}
          size={32}
          color="inherit"
        />
      ) : (
        <CameraAltRounded
          onClick={handleClickUpload}
          sx={(theme) => {
            return {
              cursor: 'pointer',
              height: 40,
              width: 40,
              backgroundColor: 'background.neutral',
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.primary',
              borderRadius: 20,
              padding: 1.2,
              position: 'absolute',
              bottom: 0,
              right: { xs: 0, md: 15 },
              zIndex: 100,
            };
          }}
        />
      )}
    </Box>
  );
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DialogAvatar({
  defaultOpen = false,
  file,
  user,
  handleCancel,
  handleSave,
}: {
  user?: IUser;
  defaultOpen: boolean;
  file?: File | IMedia;
  handleCancel: () => void;
  handleSave: () => void;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="update-user-avatar"
        fullWidth
      >
        <DialogTitle>{t(LanguageKey.user.uploadAvatar)}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-end' },
              }}
            >
              <Avatar
                src={file instanceof File ? URL.createObjectURL(file) : file?.url}
                sx={(theme) => {
                  return {
                    width: { xs: 120, sm: 150, md: 168 },
                    height: { xs: 120, sm: 150, md: 168 },
                    border: `4px solid ${theme.palette.background.default}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  };
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
                  {user?.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleCancel}>
            {t(LanguageKey.button.cancel)}
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {t(LanguageKey.button.save)}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
