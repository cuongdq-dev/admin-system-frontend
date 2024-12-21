import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import 'src/global.css';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { Router } from 'src/routes/sections';
import { ThemeProvider } from 'src/theme/theme-provider';
import { useShallow } from 'zustand/react/shallow';
import { ButtonDismissNotify } from './components/button';
import { INotify, useNotifyStore } from './store/notify';

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
