import { useTheme } from '@mui/material/styles';
import { varAlpha } from '../styles';
import { useDynamicPalette } from './palette';
import { useContrast } from './use-shadow';

// ----------------------------------------------------------------------

export interface CustomShadows {
  z1?: string;
  z4?: string;
  z8?: string;
  z12?: string;
  z16?: string;
  z20?: string;
  z24?: string;
  //
  primary?: string;
  secondary?: string;
  info?: string;
  success?: string;
  warning?: string;
  error?: string;
  //
  card?: string;
  dialog?: string;
  dropdown?: string;
}

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadows;
  }
  interface ThemeOptions {
    customShadows?: CustomShadows;
  }
  interface ThemeVars {
    customShadows: CustomShadows;
  }
}

// ----------------------------------------------------------------------

export function createShadowColor(colorChannel: string) {
  // Adjust opacity for contrast mode
  const contrast = useContrast();
  const alphaValue = contrast ? 0.24 : 0; // For example, more opacity in contrast mode
  return `0 8px 16px 0 ${varAlpha(colorChannel, alphaValue)}`;
}

export function customShadows() {
  const contrast = useContrast();
  const theme = useTheme();
  const { common, error, grey, info, primary, secondary, success, warning } = useDynamicPalette();
  const colorChannel = grey[theme.palette.mode]['500Channel'];

  return {
    z1: `0 1px 2px 0 ${varAlpha(colorChannel, contrast ? 0.16 : 0)}`,
    z4: `0 4px 8px 0 ${varAlpha(colorChannel, contrast ? 0.16 : 0)}`,
    z8: `0 8px 16px 0 ${varAlpha(colorChannel, contrast ? 0.16 : 0)}`,
    z12: `0 12px 24px -4px ${varAlpha(colorChannel, contrast ? 0.16 : 0)}`,
    z16: `0 16px 32px -4px ${varAlpha(colorChannel, contrast ? 0.16 : 0)}`,
    z20: `0 20px 40px -4px ${varAlpha(colorChannel, contrast ? 0.16 : 0)}`,
    z24: `0 24px 48px 0 ${varAlpha(colorChannel, contrast ? 0.16 : 0)}`,
    //
    dialog: `-40px 40px 80px -8px ${varAlpha(common.blackChannel, contrast ? 0.24 : 0)}`,
    card: `0 0 2px 0 ${varAlpha(colorChannel, contrast ? 0.2 : 0)}, 0 12px 24px -4px ${varAlpha(colorChannel, contrast ? 0.12 : 0)}`,
    dropdown: `0 0 2px 0 ${varAlpha(colorChannel, contrast ? 0.2 : 0)}, -20px 20px 40px -4px ${varAlpha(colorChannel, contrast ? 0.24 : 0)}`,
    //
    primary: createShadowColor(primary.mainChannel),
    secondary: createShadowColor(secondary.mainChannel),
    info: createShadowColor(info.mainChannel),
    success: createShadowColor(success.mainChannel),
    warning: createShadowColor(warning.mainChannel),
    error: createShadowColor(error.mainChannel),
  };
}
