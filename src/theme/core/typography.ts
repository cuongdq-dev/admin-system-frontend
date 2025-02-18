import type { TypographyOptions } from '@mui/material/styles/createTypography';

import { pxToRem, responsiveFontSizes, setFont } from '../styles/utils';

// ----------------------------------------------------------------------
// Extend MUI Typography
declare module '@mui/material/styles' {
  interface TypographyVariants {
    fontSecondaryFamily: React.CSSProperties['fontFamily'];
    fontWeightSemiBold: React.CSSProperties['fontWeight'];
  }
  interface TypographyVariantsOptions {
    fontSecondaryFamily?: React.CSSProperties['fontFamily'];
    fontWeightSemiBold?: React.CSSProperties['fontWeight'];
  }
  interface ThemeVars {
    typography: Theme['typography'];
  }
}

// ----------------------------------------------------------------------
// Cấu hình font
const defaultFont = `'DM Sans Variable', sans-serif`;
const secondaryFont = `'Barlow', sans-serif`;

const primaryFont = setFont(defaultFont);
const secondaryFontSet = setFont(secondaryFont);

// ----------------------------------------------------------------------
// Typography Config
export const typography: TypographyOptions = {
  fontFamily: primaryFont,
  fontSecondaryFamily: secondaryFontSet,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,

  h1: {
    fontWeight: 800,
    lineHeight: pxToRem(80),
    fontSize: pxToRem(40),
    fontFamily: secondaryFontSet,
    ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontWeight: 800,
    lineHeight: pxToRem(64),
    fontSize: pxToRem(32),
    fontFamily: secondaryFontSet,
    ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: pxToRem(48),
    fontSize: pxToRem(24),
    fontFamily: secondaryFontSet,
    ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
  },
  h4: {
    fontWeight: 700,
    lineHeight: pxToRem(36),
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
  },
  h5: {
    fontWeight: 700,
    lineHeight: pxToRem(28),
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
  },
  h6: {
    fontWeight: 600,
    lineHeight: pxToRem(28),
    fontSize: pxToRem(17),
    ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: pxToRem(24),
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: pxToRem(22),
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: pxToRem(24),
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: pxToRem(22),
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: pxToRem(18),
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: pxToRem(18),
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 700,
    lineHeight: pxToRem(24),
    fontSize: pxToRem(14),
    textTransform: 'none',
  },
};
