// @mui
import type { Breakpoint } from '@mui/material/styles';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------

type ResponsiveType = {
  query?: 'up' | 'down' | 'between' | 'only';
  key?: Breakpoint | number;
  start?: Breakpoint | number;
  end?: Breakpoint | number;
};

export function useResponsive({ end, key, query, start }: ResponsiveType) {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(key!));

  const mediaDown = useMediaQuery(theme.breakpoints.down(key!));

  const mediaBetween = useMediaQuery(theme.breakpoints.between(start!, end!));

  const mediaOnly = useMediaQuery(theme.breakpoints.only(key as Breakpoint));

  if (query === 'up') {
    return mediaUp;
  }

  if (query === 'down') {
    return mediaDown;
  }

  if (query === 'between') {
    return mediaBetween;
  }

  if (query === 'only') {
    return mediaOnly;
  }
  return null;
}
