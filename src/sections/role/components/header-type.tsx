import { Box, Checkbox, Typography } from '@mui/material';
import { t } from 'i18next';
import { LanguageKey } from 'src/constants';

type ActionType = 'read' | 'update' | 'create' | 'delete' | 'publish';

export const HeaderType = (props: {
  action: ActionType;

  handleClick: () => void;
  checked: boolean;
  disabled: boolean;
  indeterminate?: boolean;
}) => {
  const { action, checked, handleClick, indeterminate, disabled } = props;
  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        '&:hover': {
          backgroundColor: 'rgba(63, 81, 181, 0.04)',
        },
        p: 1,
        borderRadius: 1,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
        {t(LanguageKey.role[`${action}Type` as keyof typeof LanguageKey.role]) ||
          action.toUpperCase()}
      </Typography>
      <Box display="flex" justifyContent="center">
        <Checkbox
          disabled={disabled}
          checked={checked}
          indeterminate={indeterminate}
          onChange={handleClick}
          size="medium"
        />
      </Box>
    </Box>
  );
};
