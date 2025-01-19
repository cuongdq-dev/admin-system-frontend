import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import 'src/global.css';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { Router } from 'src/routes/sections';
import { ThemeProvider } from 'src/theme/theme-provider';
import { useShallow } from 'zustand/react/shallow';
import { ButtonDismissNotify } from './components/button';
import { INotifyStore, useNotifyStore } from './store/notify';
import { socket } from './utils/socket';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';

export default function App() {
  useScrollToTop();
  const { setNotify } = useNotifyStore.getState();
  const notifyStore = useNotifyStore(useShallow((state) => state.notify as INotifyStore));

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
    const requestPermission = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey:
            'BFc7OwysRTO8q65ATePs0DrlOdomr3ildSqUeU2ydezqSRoBjP1v8VuTGYcH1MLJtiJyO63OXeyeMBGwU1lfRJU',
        });

        if (token) {
          console.log('Token generated:', token);
          // Send this token to your server to store it for later use
        } else {
          console.log('No registration token available.');
        }
      } catch (err) {
        console.error('Error getting token:', err);
      }
    };
    requestPermission();

    onMessage(messaging, (payload: any) => {
      console.log('Message received. ', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
      };
      new Notification(notificationTitle, notificationOptions);
    });
  }, []);

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
