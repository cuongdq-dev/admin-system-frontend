import { Box, Button, ButtonProps, Typography } from '@mui/material';
import { Iconify } from '../iconify';
import { useSettingStore } from 'src/store/setting';
import { useShallow } from 'zustand/react/shallow';
import { usePermissions } from 'src/hooks/use-permissions';

type Props = {
  title: string;
  subject: string;
  description?: string;
  buttonTitle?: string;
  onClickButton?: () => void;
  buttonProps?: ButtonProps;
};
export const HeadComponent = (props: Props) => {
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(props.subject!, 'create');

  return (
    <Box display="flex" alignItems="center" mb={1.5}>
      <Box flexGrow={1}>
        <Typography variant="h4">
          {props.title}

          <Typography fontSize={14} color="text.secondary">
            {props.description}
          </Typography>
        </Typography>
      </Box>
      <Box sx={{ cursor: !canCreate ? 'no-drop' : 'unset' }} display="flex" alignItems="center">
        {props.buttonTitle && (
          <Button
            disabled={!canCreate}
            onClick={props.onClickButton}
            color="inherit"
            size="medium"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            {...props.buttonProps}
          >
            {props.buttonTitle}
          </Button>
        )}
      </Box>
    </Box>
  );
};
