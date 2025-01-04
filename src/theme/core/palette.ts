import type { ColorSystemOptions } from '@mui/material/styles';
import { createPaletteChannel, varAlpha } from '../styles';
import COLORS_JSON from './colors.json';
import { useColorScheme } from './use-color-scheme';

// ----------------------------------------------------------------------
function getScheme(scheme: string) {
  return COLORS_JSON[scheme as keyof typeof COLORS_JSON];
}

const COLORS = getScheme(localStorage.getItem('color-scheme') || 'color_1');
// ----
declare module '@mui/material/styles/createPalette' {
  interface CommonColors {
    whiteChannel: string;
    blackChannel: string;
  }
  interface TypeText {
    disabledChannel: string;
  }
  interface TypeBackground {
    neutral: string;
    neutralChannel: string;
  }

  interface NavbarColors {
    lighter: string;
    darker: string;
    lighterChannel: string;
    darkerChannel: string;
  }

  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
    lighterChannel: string;
    darkerChannel: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
    lighterChannel: string;
    darkerChannel: string;
  }
}

declare module '@mui/material/styles' {
  interface ThemeVars {
    transitions: Theme['transitions'];
  }
}

declare module '@mui/material' {
  interface Color {
    ['50Channel']: string;
    ['100Channel']: string;
    ['200Channel']: string;
    ['300Channel']: string;
    ['400Channel']: string;
    ['500Channel']: string;
    ['600Channel']: string;
    ['700Channel']: string;
    ['800Channel']: string;
    ['900Channel']: string;
  }
}

export type ColorType = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

// ----------------------------------------------------------------------

export function useDynamicPalette() {
  const COLORS = useColorScheme();

  const primary = createPaletteChannel(COLORS.primary);
  const secondary = createPaletteChannel(COLORS.secondary);
  const info = createPaletteChannel(COLORS.info);
  const success = createPaletteChannel(COLORS.success);
  const warning = createPaletteChannel(COLORS.warning);
  const error = createPaletteChannel(COLORS.error);
  const common = createPaletteChannel(COLORS.common);

  const text = {
    light: createPaletteChannel(COLORS.text_light),
    dark: createPaletteChannel(COLORS.text_dark),
  };

  const background = {
    light: createPaletteChannel(COLORS.background_light),
    dark: createPaletteChannel(COLORS.background_dark),
  };

  const grey = {
    light: createPaletteChannel(COLORS.grey_light),
    dark: createPaletteChannel(COLORS.grey_dark),
  };

  const baseActionLight = {
    hover: varAlpha(grey.light['500Channel'], 0.08),
    selected: varAlpha(grey.light['500Channel'], 0.16),
    focus: varAlpha(grey.light['500Channel'], 0.24),
    disabled: varAlpha(grey.light['500Channel'], 0.8),
    disabledBackground: varAlpha(grey.light['500Channel'], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  };

  const baseActionDark = {
    hover: varAlpha(grey.dark['500Channel'], 0.08),
    selected: varAlpha(grey.dark['500Channel'], 0.16),
    focus: varAlpha(grey.dark['500Channel'], 0.24),
    disabled: varAlpha(grey.dark['500Channel'], 0.8),
    disabledBackground: varAlpha(grey.dark['500Channel'], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  };

  const action = {
    light: { ...baseActionLight, active: grey.light[600] },
    dark: { ...baseActionDark, active: grey.dark[600] },
  };

  const basePalette = {
    primary,
    secondary,
    info,
    success,
    warning,
    error,
    common,
    action,
  };

  const lightPalette = {
    ...basePalette,
    text: text.light,
    background: background.light,
    divider: varAlpha(grey.light['500Channel'], 0.2),
    action: action.light,
    grey: grey.light,
  };

  const darkPalette = {
    ...basePalette,
    text: text.dark,
    background: background.dark,
    divider: varAlpha(grey.dark['500Channel'], 0.2),
    action: action.dark,
    grey: grey.dark,
  };

  return {
    light: { palette: lightPalette },
    dark: { palette: darkPalette },
    common,
    error,
    grey,
    info,
    primary,
    secondary,
    success,
    warning,
  };
}
