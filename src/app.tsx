import { SnackbarProvider } from 'notistack';
import 'src/global.css';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { Router } from 'src/routes/sections';
import { ThemeProvider } from 'src/theme/theme-provider';

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
