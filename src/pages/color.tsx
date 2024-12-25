import { Box, Card, Grid, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { default as colors } from '../theme/core/colors.json';

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

  // Công thức tính độ sáng của màu
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 128; // Nếu độ sáng > 128, thì là màu sáng
};

const getBorderColor = (color: string) => {
  const lightColor = '#FFFFFF';
  const darkColor = '#000000';
  return isLightColor(color) ? darkColor : lightColor;
};
// Hàm đệ quy để render màu
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
          padding: '10px',
          borderRadius: '5px',
          color: textColor,
          marginBottom: '8px',
          border: `2px solid ${getBorderColor(color)}`,
        }}
      >
        <Typography>{colorKey}</Typography>
        <Typography>{color}</Typography>
      </Box>
    );
  } else if (typeof color === 'object') {
    // Render key của object khi gặp object
    return (
      <Card
        key={colorKey}
        sx={(theme) => {
          return { padding: 2, backgroundColor: theme.vars.palette.background.neutral };
        }}
      >
        <Typography variant="h6">{colorKey}</Typography>
        {/* Lặp qua các key trong object */}
        <Grid container spacing={0.5}>
          {Object.keys(color).map((nestedColorKey) => {
            const nestedColor = color[nestedColorKey];
            return (
              <Grid item xs={6} sm={6} md={6} key={nestedColorKey}>
                {renderColor(nestedColor, nestedColorKey)}
              </Grid>
            );
          })}
        </Grid>
      </Card>
    );
  }
  return null;
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Dashboard - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>
      <DashboardContent>
        <Box>
          {/* Lặp qua tất cả màu */}
          {Object.keys(colors).map((key: string) => {
            const colorSystem = colors[key as ColorKey] || {};
            return (
              <Card key={key} sx={{ padding: 3, margin: 2 }}>
                <Typography paddingBottom={2} variant="h6">
                  {key}
                </Typography>
                <Grid container spacing={2}>
                  {Object.keys(colorSystem).map((colorKey) => {
                    const color = colorSystem[colorKey as keyof typeof colorSystem];
                    return (
                      <Grid item xs={4} sm={4} md={4} key={colorKey}>
                        {renderColor(color, colorKey)} {/* Gọi hàm renderColor đệ quy */}
                      </Grid>
                    );
                  })}
                </Grid>
              </Card>
            );
          })}
        </Box>
      </DashboardContent>
    </>
  );
}
