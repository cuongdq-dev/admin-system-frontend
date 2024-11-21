import 'src/global.css';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { enqueueSnackbar, SnackbarProvider } from 'notistack';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </SnackbarProvider>
  );
}
