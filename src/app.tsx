import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import 'src/global.css';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { Router } from 'src/routes/sections';
import { ThemeProvider } from 'src/theme/theme-provider';
import { INotify, useNotifyStore } from './store/notify';
import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';
import { ButtonDismissNotify } from './components/button';

export default function App() {
  useScrollToTop();

  const notify = useNotifyStore(useShallow((state) => state.notify as INotify));

  useEffect(() => {
    if (!!notify) {
      enqueueSnackbar(notify.title, {
        ...notify.options,
        action: (key) => {
          if (notify) return <ButtonDismissNotify keyNotify={key} textColor="white" />;
          return <></>;
        },
      });
      return;
    }
  }, [notify]);

  return (
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }} maxSnack={5}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </SnackbarProvider>
  );
}
