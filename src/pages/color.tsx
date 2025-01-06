import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';
import { default as colors } from '../theme/core/colors.json';
import { Breadcrumbs, LanguageKey } from 'src/constants';
import { t } from 'i18next';

// Kiểu màu cho từng color
type ColorKey =
  | 'color_1'
  | 'color_2'
  | 'color_3'
  | 'color_4'
  | 'color_5'
  | 'color_6'
  | 'color_7'
  | 'color_8';

const isLightColor = (color: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 128;
};
const getBorderColor = (color: string) => {
  const lightColor = '#FFFFFF';
  const darkColor = '#000000';
  return isLightColor(color) ? darkColor : lightColor;
};
const renderColor = (color: any, colorKey: string): any => {
  if (typeof color === 'string') {
    const textColor = isLightColor(color) ? '#000000' : '#FFFFFF';
    return (
      <Box
        key={colorKey}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: color,
          padding: '4px',
          borderRadius: '5px',
          color: textColor,
          border: `1px solid ${getBorderColor(color)}`,
        }}
      >
        <Typography>{colorKey}</Typography>
        <Typography>{color}</Typography>
      </Box>
    );
  } else if (typeof color === 'object') {
    return (
      <Box
        component={'div'}
        key={colorKey}
        sx={(theme) => {
          return {
            border: 1,
            borderColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
            borderRadius: theme.spacing(2),
            display: 'flex',
            position: 'relative',
            padding: 1,
            paddingTop: theme.spacing(2),
            backgroundColor: theme.vars.palette.background.neutral,
          };
        }}
      >
        <Typography
          sx={(theme) => {
            return {
              fontSize: theme.typography.pxToRem(12),
              position: 'absolute',
              top: -10,
              left: 8,
              px: 1,
              borderRadius: theme.vars.shape.borderRadius,
              backgroundColor: theme.vars.palette.success.main,
              color: varAlpha(theme.vars.palette.success.contrastTextChannel, 0.9),
            };
          }}
        >
          {colorKey.replaceAll('_', ' ').toUpperCase()}
        </Typography>
        <Grid container spacing={0.5} columns={4}>
          {Object.keys(color).map((nestedColorKey) => {
            const nestedColor = color[nestedColorKey];
            return (
              <Grid item xs={4} sm={2} md={2} key={nestedColorKey}>
                {renderColor(nestedColor, nestedColorKey)}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  }
  return null;
};

export default function Page() {
  return (
    <DashboardContent breadcrumb={Breadcrumbs.COLOR}>
      <Box>
        {Object.keys(colors).map((key: string, index: number) => {
          const colorSystem = colors[key as ColorKey] || {};
          return (
            <Accordion key={key + index} defaultExpanded={index == 0} sx={{ marginBottom: 2 }}>
              <AccordionSummary
                sx={(theme) => {
                  return {
                    backgroundColor: theme.vars.palette.background.paper,
                  };
                }}
                expandIcon={<Iconify icon={'flat-color-icons:expand'} />}
                id={key}
              >
                {key.replaceAll('_', ' ').toLocaleUpperCase()}
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 2 }}>
                <Grid container spacing={2} columns={12}>
                  {Object.keys(colorSystem).map((colorKey) => {
                    const color = colorSystem[colorKey as keyof typeof colorSystem];
                    return (
                      <Grid item xs={6} sm={6} md={4} key={colorKey}>
                        {renderColor(color, colorKey)}
                      </Grid>
                    );
                  })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </DashboardContent>
  );
}
