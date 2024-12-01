import { Box, Chip, styled, Theme } from '@mui/material';
import { t } from 'i18next';
import { varAlpha } from 'src/theme/styles';

const getDefaultStyles = (theme: Theme) => ({
  fontWeight: theme.typography.fontWeightBold,
  borderRadius: 6,
  fontSize: '0.75rem',
  height: 24,
  padding: '0 6px',
  alignContent: 'center',
});

const StyleChipActive = styled(Box)(({ theme }) => {
  return {
    ...getDefaultStyles(theme),
    backgroundColor: varAlpha(theme.vars.palette.success.mainChannel, 0.16),
    color: theme.vars.palette.success.dark,
  };
});

const StyleChipInactive = styled(Box)(({ theme }) => {
  return {
    ...getDefaultStyles(theme),
    backgroundColor: varAlpha(theme.vars.palette.error.mainChannel, 0.16),
    color:
      theme.palette.mode === 'dark'
        ? theme.vars.palette.error.light
        : theme.vars.palette.error.dark,
  };
});

export const StatusServer = ({ status }: { status?: boolean }) => {
  if (!status) return <StyleChipInactive>{t('server_inactive_status')}</StyleChipInactive>;
  return <StyleChipActive>{t('server_active_status')}</StyleChipActive>;
};
