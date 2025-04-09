import { Box, Typography } from '@mui/material';
import { Iconify } from '../iconify';

export const GuideList = ({ text }: { text: string }) => {
  if (!text) return <></>;
  return (
    <Box
      sx={(theme) => {
        return {
          px: 2,
          py: 1,
          mb: 2,
          borderRadius: theme.vars.shape.borderRadius,
          display: 'flex',
          flexDirection: 'row',
          border: `1px solid ${theme.vars.palette.divider}`,
          alignItems: 'center',
          backgroundColor: theme.vars.palette.background.paper,
        };
      }}
    >
      <Box
        sx={(theme) => {
          return { color: theme.vars.palette.warning.main };
        }}
      >
        <Iconify icon="mage:light-bulb" width={30} height={30} />
      </Box>
      <Typography
        variant="caption"
        sx={(theme) => {
          return {
            ml: 1,
            color: theme.vars.palette.text.secondary,
          };
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};
