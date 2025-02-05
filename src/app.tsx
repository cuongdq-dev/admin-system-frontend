import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import 'src/global.css';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { Router } from 'src/routes/sections';
import { ThemeProvider } from 'src/theme/theme-provider';
import { useShallow } from 'zustand/react/shallow';
import { ButtonDismissNotify } from './components/button';
import { INotifyStore, useNotifyStore } from './store/notify';
import { ISetting, useSettingStore } from './store/setting';
import { socket } from './utils/socket';

export default function App() {
  useScrollToTop();
  const { setNotify } = useNotifyStore.getState();
  const { setSetting } = useSettingStore.getState();
  const notifyStore = useNotifyStore(useShallow((state) => state.notify as INotifyStore));
  const settingStore = useSettingStore(useShallow((state) => state as ISetting));

  useEffect(() => {
    if (!!notifyStore) {
      enqueueSnackbar(notifyStore.title, {
        action: (key) => {
          if (notifyStore.dismissAction)
            return <ButtonDismissNotify keyNotify={key} textColor="white" />;
          return <></>;
        },
        ...notifyStore.options,
        key: notifyStore.key,
      });
      return;
    }
  }, [notifyStore]);

  useEffect(() => {
    function handleMessage(socket: ISocket) {
      const notify = socket.notify;
      switch (socket?.type) {
        case 'MESSAGE':
          enqueueSnackbar(notify?.title, {
            action: (key) => {
              if (notify.dismissAction)
                return <ButtonDismissNotify keyNotify={key} textColor="white" />;
              return <></>;
            },
            key: notify.key,
          });
          return;
        case 'NOTIFY':
          setNotify(notify);
          return;
        case 'STORE':
          enqueueSnackbar(notify.title, {
            action: (key) => {
              if (notify.dismissAction)
                return <ButtonDismissNotify keyNotify={key} textColor="white" />;
              return <></>;
            },
            key: notify.key,
          });
          return;

        default:
          break;
      }
    }

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    // const requestPermission = async () => {
    //   try {
    //     const token = await requestFirebaseToken();
    //     if (token && settingStore.user && token !== settingStore.user?.firebase_token) {
    //       invokeRequest({
    //         baseURL: 'setting/firebase-token',
    //         method: HttpMethod.POST,
    //         params: { token: token },
    //         onSuccess: () => {
    //           setSetting({
    //             ...settingStore,
    //             user: { ...settingStore.user, firebase_token: token },
    //           });
    //         },
    //       });
    //     } else {
    //       console.log('No registration token available.');
    //     }
    //   } catch (err) {
    //     console.error('Error getting token:', err);
    //   }
    // };
    // requestPermission();
  }, [settingStore.user]);

  return (
    <SnackbarProvider
      preventDuplicate
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      maxSnack={5}
    >
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </SnackbarProvider>
  );
}
