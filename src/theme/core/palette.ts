import type { ColorSystemOptions } from '@mui/material/styles';

import { createPaletteChannel, varAlpha } from '../styles';
import COLORS from './colors.json';

// ----------------------------------------------------------------------

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

// Grey

// Primary
export const primary = createPaletteChannel(COLORS.primary);

// Secondary
export const secondary = createPaletteChannel(COLORS.secondary);

// Info
export const info = createPaletteChannel(COLORS.info);

// Success
export const success = createPaletteChannel(COLORS.success);

// Warning
export const warning = createPaletteChannel(COLORS.warning);

// Error
export const error = createPaletteChannel(COLORS.error);

// Common
export const common = createPaletteChannel(COLORS.common);

// Text
export const text = {
  light: createPaletteChannel({
    primary: '#1C252E',
    secondary: '#637381',
    disabled: '#919EAB',
  }),

  dark: createPaletteChannel({
    primary: '#FFFFFF',
    secondary: '#919EAB',
    disabled: '#637381',
  }),
};

// Background
export const background = {
  light: createPaletteChannel({
    paper: '#FFFFFF',
    default: '#F4F6F8',
    neutral: '#F4F6F8',
    paperChannel: '#ffffff',
    defaultChannel: '#f4f6f8',
    neutralChannel: '#f4f6f8',
  }),
  dark: createPaletteChannel({
    paper: '#1C252E',
    default: '#141A21',
    neutral: '#28323D',
    paperChannel: '#1c252e',
    defaultChannel: '#141a21',
    neutralChannel: '#28323d',
  }),
};

export const grey = {
  light: createPaletteChannel({
    '50': '#FCFDFD',
    '100': '#F9FAFB',
    '200': '#F4F6F8',
    '300': '#DFE3E8',
    '400': '#C4CDD5',
    '500': '#919EAB',
    '600': '#637381',
    '700': '#454F5B',
    '800': '#1C252E',
    '900': '#141A21',
  }),
  dark: createPaletteChannel({
    '50': '#FCFDFD',
    '100': '#F9FAFB',
    '200': '#F4F6F8',
    '300': '#DFE3E8',
    '400': '#C4CDD5',
    '500': '#919EAB',
    '600': '#637381',
    '700': '#454F5B',
    '800': '#1C252E',
    '900': '#141A21',
  }),
};

// Action

export const baseActionLight = {
  hover: varAlpha(grey.light['500Channel'], 0.08),
  selected: varAlpha(grey.light['500Channel'], 0.16),
  focus: varAlpha(grey.light['500Channel'], 0.24),
  disabled: varAlpha(grey.light['500Channel'], 0.8),
  disabledBackground: varAlpha(grey.light['500Channel'], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

// Action
export const baseActionDark = {
  hover: varAlpha(grey.dark['500Channel'], 0.08),
  selected: varAlpha(grey.dark['500Channel'], 0.16),
  focus: varAlpha(grey.dark['500Channel'], 0.24),
  disabled: varAlpha(grey.dark['500Channel'], 0.8),
  disabledBackground: varAlpha(grey.dark['500Channel'], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

export const action = {
  light: { ...baseActionLight, active: grey.light[600] },
  dark: { ...baseActionDark, active: grey.dark[600] },
};

/*
 * Base palette
 */

export const basePalette = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  common,
  action,
};

export const lightPalette = {
  ...basePalette,
  text: text.light,
  background: background.light,
  divider: varAlpha(grey.light['500Channel'], 0.2),
  action: action.light,
  grey: grey.light,
};

export const darkPalette = {
  ...basePalette,
  text: text.dark,
  background: background.dark,
  divider: varAlpha(grey.dark['500Channel'], 0.2),
  action: action.dark,
  grey: grey.dark,
};

// ----------------------------------------------------------------------

export const colorSchemes: Partial<Record<string, ColorSystemOptions>> = {
  light: { palette: lightPalette },
  dark: { palette: darkPalette },
};
