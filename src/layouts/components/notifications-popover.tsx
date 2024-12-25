import type { IconButtonProps } from '@mui/material/IconButton';

import { useCallback, useEffect, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { fToNow } from 'src/utils/format-time';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  CircularProgress,
  Drawer,
  Icon,
  LinearProgress,
  styled,
  Tab,
  useMediaQuery,
} from '@mui/material';
import { t } from 'i18next';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_NOTIFICATION } from 'src/api-core/path';
import { BellIconShakeAnimation, RefreshIcon } from 'src/components/icon';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey } from 'src/constants';
import { useSettingStore } from 'src/store/setting';
import { remToPx, varAlpha } from 'src/theme/styles';
import { useShallow } from 'zustand/react/shallow';

enum TypeEnum {
  MESSAGE = 'MESSAGE',
  SYSTEM = 'SYSTEM',
  COMMENT = 'COMMENT',
  ORDER = 'ORDER',
  DELIVERY = 'DELIVERY',
  PROMOTION = 'PROMOTION', // Sales or discount notifications
  PAYMENT = 'PAYMENT', // Payment-related updates
  REFUND = 'REFUND', // Refund processing notifications
  FEEDBACK = 'FEEDBACK', // Feedback requests or updates
  REMINDER = 'REMINDER', // Scheduled reminders
  ACCOUNT = 'ACCOUNT', // Account-related notifications
}

enum StatusEnum {
  NEW = 'NEW', // Just created
  RECEIVED = 'RECEIVED', // Acknowledged by the system
  READED = 'READED', // Marked as read by the user
  PENDING = 'PENDING', // Queued but not yet delivered
  FAILED = 'FAILED', // Delivery failed
  ARCHIVED = 'ARCHIVED', // Archived for reference
}

export type NotificationsPopoverProps = IconButtonProps & {
  data?: NotificationItem[];
};

const CustomTabs = styled(TabList)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.neutral,
  minHeight: 'fit-content',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),

  '& .MuiTabs-indicator': {
    height: '100%',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: varAlpha(theme.vars.palette.background.paperChannel, 1),
  },
  '& .MuiTabs-flexContainer': {
    display: 'flex',
    justifyContent: 'center',
  },
}));
const CustomTabsPannel = styled(TabPanel)(({ theme }) => ({
  padding: 0,
}));

const CustomTab = styled(Tab)(({ theme }) => ({
  minHeight: 'auto',
  textTransform: 'none',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  flexWrap: 'nowrap',
  '& span': {
    marginLeft: theme.spacing(1),
    fontSize: theme.typography.caption.fontSize,
    padding: theme.spacing(2, 2),
    borderRadius: theme.spacing(0.5),
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    fontWeight: theme.typography.fontWeightMedium,
  },

  '&.MuiTab-textColorPrimary': {
    fontSize: theme.typography.button.fontSize,
  },
  '&.Mui-selected': {
    color: theme.vars.palette.text.primary,
    fontWeight: theme.typography.fontWeightBold,
    zIndex: 1,
  },
}));

export function NotificationsPopover({ sx, ...other }: NotificationsPopoverProps) {
  const isMobile = useMediaQuery('(max-width:600px)');

  const { notifications, notifyNew = 0 } = useSettingStore(useShallow((state) => state));
  const {
    setNotifyNew,
    setNotifications,
    setNotificationsAll,
    setNotificationsNew,
    setNotificationsArchived,
  } = useSettingStore.getState();
  const [tabValue, setTabValue] = useState<StatusEnum | ''>();
  const [openPopover, setOpenPopover] = useState(false);
  const [loading, setLoading] = useState(false);
  const newNotifications = notifications?.new?.data;
  const archivedNotifications = notifications?.archived?.data;

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(true);
  }, []);

  const handleMarkAllAsRead = () => {
    setLoading(true);

    invokeRequest({
      baseURL: PATH_NOTIFICATION + '/read-all',
      method: HttpMethod.PATCH,
      onSuccess: (res) => {
        handleRefresh();
      },
      onHandleError: () => {
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    if (!openPopover) return;
    if (notifications) return;
    setLoading(true);
    invokeRequest({
      baseURL: PATH_NOTIFICATION,
      method: HttpMethod.GET,
      onSuccess: (res) => {
        setNotifications(res);
        setLoading(false);
      },
      onHandleError: () => {
        setLoading(false);
      },
    });
  }, [openPopover]);

  const handleRefresh = () => {
    setLoading(true);
    invokeRequest({
      baseURL: PATH_NOTIFICATION,
      method: HttpMethod.GET,
      onSuccess: (res) => {
        setNotifications(res);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      },
      onHandleError: () => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      },
    });
  };

  const handleLoadMore = (link: string) => {
    setLoading(true);
    invokeRequest({
      baseURL: link!,
      method: HttpMethod.GET,
      onSuccess: (res) => {
        setTimeout(() => {
          switch (tabValue) {
            case StatusEnum.NEW:
              setNotificationsNew({ ...res, data: [...newNotifications!, ...res?.data] });
              break;
            case StatusEnum.ARCHIVED:
              setNotificationsArchived({ ...res, data: [...archivedNotifications!, ...res?.data] });
              break;
            default:
              setNotificationsAll({ ...res, data: [...notifications?.all?.data!, ...res?.data] });
              break;
          }
          setLoading(false);
        }, 1000);
      },
      onHandleError: () => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      },
    });
  };

  return (
    <>
      <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={notifyNew} color="error">
          <BellIconShakeAnimation icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={openPopover}
        onClose={() => {
          setOpenPopover(false);
          setTabValue('');
        }}
        PaperProps={{
          sx: {
            width: isMobile ? '90%' : 400,
            overflow: 'hidden',
            boxShadow: 'none',
          },
        }}
      >
        <Box display="flex" alignItems="center" sx={{ pr: 1.5, py: 2 }}>
          <IconButton
            onClick={() => {
              setOpenPopover(false);
              setTabValue('');
            }}
          >
            <Iconify icon="ri:arrow-right-s-line" />
          </IconButton>
          <Typography variant="h6" flexGrow={1}>
            {t(LanguageKey.notification.title)}
          </Typography>
          {notifyNew > 0 && (
            <Tooltip title={t(LanguageKey.notification.readAll)}>
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="solar:check-read-outline" />
              </IconButton>
            </Tooltip>
          )}

          <IconButton onClick={handleRefresh}>
            <RefreshIcon loading={loading} />
          </IconButton>
        </Box>
        {loading && <LinearProgress color="inherit" />}

        <TabContext value={tabValue || ''}>
          <CustomTabs
            sx={{
              animation: 'tab-custom 1s ease-in-out',
              '@keyframes tab-custom': {
                '0%': { opacity: 0, transform: 'translateX(200px)' },
                '100%': { opacity: 1, transform: 'translateX(0px)' },
              },
            }}
            onChange={(_, value) => setTabValue(value)}
            aria-label="tab_notification"
          >
            <CustomTab
              disableRipple
              label={t(LanguageKey.notification.tab_all)}
              iconPosition="end"
              icon={
                <CountComponent
                  value={notifications?.all?.data?.length || 0}
                  type={'ALL'}
                  active={!tabValue}
                />
              }
              value=""
            />
            <CustomTab
              disableRipple
              label={t(LanguageKey.notification.tab_new)}
              icon={
                <CountComponent
                  value={newNotifications?.length || 0}
                  type={StatusEnum.NEW}
                  active={tabValue == StatusEnum.NEW}
                />
              }
              iconPosition="end"
              value={StatusEnum.NEW}
            />
            <CustomTab
              disableRipple
              label={t(LanguageKey.notification.tab_archived)}
              iconPosition="end"
              icon={
                <CountComponent
                  value={archivedNotifications?.length || 0}
                  type={StatusEnum.ARCHIVED}
                  active={tabValue == StatusEnum.ARCHIVED}
                />
              }
              value={StatusEnum.ARCHIVED}
            />
          </CustomTabs>
          <Scrollbar>
            <CustomTabsPannel value="">
              <NotificationList
                loading={loading}
                data={notifications?.all?.data!}
                next={notifications?.all?.links?.next}
                handleLoadMore={handleLoadMore}
                handleArchived={(id: string) => {
                  const findRecord = notifications?.all?.data?.find(
                    (n) => n.id == id
                  ) as NotificationItem;

                  if (findRecord) {
                    setLoading(true);
                    invokeRequest({
                      baseURL: PATH_NOTIFICATION + '/archived/' + id,
                      method: HttpMethod.PATCH,
                      onSuccess: (res) => {
                        setNotificationsArchived({
                          ...notifications?.archived,
                          data: [res, ...archivedNotifications!],
                        });

                        setNotificationsAll({
                          ...notifications?.all,
                          data: notifications?.all?.data?.filter(
                            (notification) => notification.id != id
                          ),
                        });

                        if (findRecord.status === StatusEnum.NEW && notifyNew > 0) {
                          setNotifyNew(notifyNew - 1);
                        }

                        setTimeout(() => {
                          setLoading(false);
                        }, 1000);
                      },
                      onHandleError: () => {
                        setTimeout(() => {
                          setLoading(false);
                        }, 1000);
                      },
                    });
                  }
                }}
                handleRead={(id: string) => {
                  const findRecord = notifications?.all?.data?.find(
                    (n) => n.id == id
                  ) as NotificationItem;

                  if (findRecord) {
                    setLoading(true);
                    invokeRequest({
                      baseURL: PATH_NOTIFICATION + '/read/' + id,
                      method: HttpMethod.PATCH,
                      onSuccess: (res) => {
                        const allData = notifications?.all?.data?.map((notification) => {
                          if (notification.id === res?.id) return res;
                          return notification;
                        });

                        const newData = notifications?.new?.data?.map((notification) => {
                          if (notification.id === res?.id) return res;
                          return notification;
                        });
                        setNotificationsAll({ ...notifications?.all, data: allData });
                        setNotificationsNew({ ...notifications?.new, data: newData });

                        if (findRecord.status === StatusEnum.NEW && notifyNew > 0) {
                          setNotifyNew(notifyNew - 1);
                        }

                        setTimeout(() => {
                          setLoading(false);
                        }, 1000);
                      },
                      onHandleError: () => {
                        setTimeout(() => {
                          setLoading(false);
                        }, 1000);
                      },
                    });
                  }
                }}
              />
            </CustomTabsPannel>
            <CustomTabsPannel value={StatusEnum.NEW}>
              <NotificationList
                loading={loading}
                data={newNotifications!}
                next={notifications?.new?.links?.next}
                handleLoadMore={handleLoadMore}
                handleRead={(id: string) => {
                  const findRecord = notifications?.all?.data?.find(
                    (n) => n.id == id
                  ) as NotificationItem;

                  if (findRecord) {
                    setLoading(true);
                    invokeRequest({
                      baseURL: PATH_NOTIFICATION + '/read/' + id,
                      method: HttpMethod.PATCH,
                      onSuccess: (res) => {
                        const allData = notifications?.all?.data?.map((notification) => {
                          if (notification.id === res?.id) return res;
                          return notification;
                        });

                        const newData = notifications?.new?.data?.map((notification) => {
                          if (notification.id === res?.id) return res;
                          return notification;
                        });
                        setNotificationsAll({ ...notifications?.all, data: allData });
                        setNotificationsNew({ ...notifications?.new, data: newData });

                        if (findRecord.status === StatusEnum.NEW && notifyNew > 0) {
                          setNotifyNew(notifyNew - 1);
                        }

                        setTimeout(() => {
                          setLoading(false);
                        }, 1000);
                      },
                      onHandleError: () => {
                        setTimeout(() => {
                          setLoading(false);
                        }, 1000);
                      },
                    });
                  }
                }}
                handleArchived={(id: string) => {
                  const findRecord = notifications?.new?.data?.find(
                    (n) => n.id == id
                  ) as NotificationItem;

                  if (findRecord) {
                    setLoading(true);
                    invokeRequest({
                      baseURL: PATH_NOTIFICATION + '/archived/' + id,
                      method: HttpMethod.PATCH,
                      onSuccess: (res) => {
                        setNotificationsArchived({
                          ...notifications?.archived,
                          data: [res, ...archivedNotifications!],
                        });

                        setNotificationsNew({
                          ...notifications?.all,
                          data: notifications?.new?.data?.filter(
                            (notification) => notification.id != id
                          ),
                        });

                        if (findRecord.status === StatusEnum.NEW && notifyNew > 0) {
                          setNotifyNew(notifyNew - 1);
                        }
                        setTimeout(() => {
                          setLoading(false);
                        }, 1000);
                      },
                      onHandleError: () => {
                        setTimeout(() => {
                          setLoading(false);
                        }, 1000);
                      },
                    });
                  }
                }}
              />
            </CustomTabsPannel>
            <CustomTabsPannel value={StatusEnum.ARCHIVED}>
              <NotificationList
                loading={loading}
                data={archivedNotifications!}
                next={notifications?.archived?.links?.next}
                handleLoadMore={handleLoadMore}
                handleRead={(id: string) => {}}
                handleUnArchived={(id: string) => {
                  const findRecord = notifications?.archived?.data?.find(
                    (n) => n.id == id
                  ) as NotificationItem;

                  if (findRecord) {
                    setLoading(true);
                    invokeRequest({
                      baseURL: PATH_NOTIFICATION + '/un-archived/' + id,
                      method: HttpMethod.PATCH,
                      onSuccess: (res) => {
                        setNotificationsArchived({
                          ...notifications?.archived,
                          data: notifications?.archived?.data?.filter(
                            (notification) => notification.id != id
                          ),
                        });

                        setTimeout(() => {
                          setLoading(false);
                        }, 1000);
                      },
                      onHandleError: () => {
                        setTimeout(() => {
                          setLoading(false);
                        }, 1000);
                      },
                    });
                  }
                }}
              />
            </CustomTabsPannel>
          </Scrollbar>
        </TabContext>

        <Box sx={{ p: 1 }}>
          <Button fullWidth color="inherit">
            {t(LanguageKey.notification.viewAll)}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------
type NotificationListProps = {
  loading?: boolean;
  data?: NotificationItem[];
  next?: string;
  handleLoadMore: (link: string) => void;
  handleArchived?: (id: string) => void;
  handleRead?: (id: string) => void;
  handleUnArchived?: (id: string) => void;
};
const NotificationList = (props: NotificationListProps) => {
  const {
    loading = false,
    data,
    next,
    handleLoadMore,
    handleArchived,
    handleRead,
    handleUnArchived,
  } = props;

  return (
    <List disablePadding>
      {data?.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          index={index}
          handleArchived={handleArchived}
          handleUnArchived={handleUnArchived}
          handleRead={handleRead}
        />
      ))}
      {next && (
        <IconButton
          onClick={() => handleLoadMore(next)}
          sx={{ marginY: 2, display: 'flex', justifyContent: 'center', justifySelf: 'center' }}
        >
          <Iconify icon="line-md:download-loop" />
          {loading && <CircularProgress size={30} sx={{ position: 'absolute', zIndex: 1 }} />}
        </IconButton>
      )}
    </List>
  );
};

type ItemProps = {
  notification: NotificationItem;
  index: number;
  handleArchived?: (id: string) => void;
  handleUnArchived?: (id: string) => void;
  handleRead?: (id: string) => void;
};
function NotificationItem(props: ItemProps) {
  const { notification, index, handleRead, handleArchived, handleUnArchived } = props;
  const { avatarUrl, title } = renderContent(notification);
  return (
    <ListItemButton
      onClick={() => {
        if (notification.status !== StatusEnum.NEW) return;
        handleRead && handleRead(notification?.id!);
      }}
      sx={(theme) => {
        return {
          animation: 'fadeIn-list-notification 1s ease-in-out',
          '@keyframes fadeIn-list-notification': {
            '0%': {
              opacity: 0,
              transform: `translateY(${15 + index * 10}px)`,
              marginBottom: 2 + index * 3,
            },
            '100%': { opacity: 1, transform: 'translateY(0)', marginBottom: 0 },
          },
          py: 1.5,
          px: 2.5,
          borderTop:
            index == 0
              ? 'unset'
              : `0.2px dashed ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
          ...(notification.status == StatusEnum.NEW && {
            bgcolor: 'action.selected',
          }),
        };
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatarUrl}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify width={14} icon="solar:clock-circle-outline" />
            {fToNow(notification.created_at)}
          </Typography>
        }
      />
      {notification.status !== StatusEnum.ARCHIVED ? (
        <IconButton
          sx={{ zIndex: 1 }}
          onClick={(event) => {
            event.stopPropagation();
            handleArchived && handleArchived(notification.id!);
          }}
        >
          <Iconify icon={'material-symbols-light:archive-sharp'} />
        </IconButton>
      ) : (
        <IconButton
          sx={{ zIndex: 1 }}
          onClick={(event) => {
            event.stopPropagation();
            handleUnArchived && handleUnArchived(notification.id!);
          }}
        >
          <Iconify icon={'mdi:file-revert'} />
        </IconButton>
      )}
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItem) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.message}
      </Typography>
    </Typography>
  );

  if (notification.type === TypeEnum.ORDER) {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic-notification-package.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === TypeEnum.DELIVERY) {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic-notification-shipping.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === TypeEnum.FEEDBACK) {
    return {
      avatarUrl: (
        <img alt={notification.title} src="/assets/icons/notification/ic-notification-mail.svg" />
      ),
      title,
    };
  }
  if (notification.type === TypeEnum.COMMENT) {
    return {
      avatarUrl: (
        <img alt={notification.title} src="/assets/icons/notification/ic-notification-chat.svg" />
      ),
      title,
    };
  }
  return {};
  // return {
  //   avatarUrl: notification.avatarUrl ? (
  //     <img alt={notification.title} src={notification.avatarUrl} />
  //   ) : null,
  //   title,
  // };
}

const CountComponent = (props: { value: number; type?: StatusEnum | 'ALL'; active: boolean }) => {
  const { value: defaultValue, type, active } = props;
  if (defaultValue <= 0) return <></>;
  const value = defaultValue > 10 ? `${10}+` : defaultValue;
  switch (type) {
    case StatusEnum.NEW:
      return (
        <Icon
          sx={(theme) => {
            if (active) {
              return {
                backgroundColor: theme.vars.palette.info.main,
                color: theme.vars.palette.info.contrastText,
              };
            }
            return {
              backgroundColor: varAlpha(theme.vars.palette.info.mainChannel, 0.16),
              color: theme.vars.palette.info.main,
            };
          }}
        >
          {value}
        </Icon>
      );
    case StatusEnum.ARCHIVED:
      return (
        <Icon
          sx={(theme) => {
            if (active) {
              return {
                backgroundColor: theme.vars.palette.success.main,
                color: theme.vars.palette.success.contrastText,
              };
            }
            return {
              backgroundColor: varAlpha(theme.vars.palette.success.mainChannel, 0.16),
              color: theme.vars.palette.success.main,
            };
          }}
        >
          {value}
        </Icon>
      );
    case 'ALL':
      return (
        <Icon
          sx={(theme) => {
            if (active) {
              return {
                backgroundColor: theme.vars.palette.primary.main,
                color: theme.vars.palette.primary.contrastText,
              };
            }

            return {
              backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
              color: theme.vars.palette.primary.main,
            };
          }}
        >
          {value}
        </Icon>
      );

    default:
      break;
  }
};
