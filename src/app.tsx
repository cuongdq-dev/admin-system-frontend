import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { useEffect, useState } from 'react';
import 'src/global.css';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { Router } from 'src/routes/sections';
import { ThemeProvider } from 'src/theme/theme-provider';
import { useShallow } from 'zustand/react/shallow';
import { ButtonDismissNotify } from './components/button';
import { INotify, useNotifyStore } from './store/notify';
import { socket } from './utils/socket';

interface Message {
  text: string;
  type: number;
}

export default function App() {
  useScrollToTop();

  const notify = useNotifyStore(useShallow((state) => state.notify as INotify));

  useEffect(() => {
    if (!!notify) {
      enqueueSnackbar(notify.title, {
        action: (key) => {
          if (notify.dismissAction)
            return <ButtonDismissNotify keyNotify={key} textColor="white" />;
          return <></>;
        },
        ...notify.options,
        key: notify.key,
      });
      return;
    }
  }, [notify]);

  useEffect(() => {
    function handleMessage(value: any) {
      console.log(value);
    }

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
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
