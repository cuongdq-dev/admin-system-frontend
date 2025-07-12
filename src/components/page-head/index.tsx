import { Box, Button, ButtonProps, Typography } from '@mui/material';
import { Iconify } from '../iconify';

type Props = {
  title: string;
  description?: string;
  buttonTitle?: string;
  onClickButton?: () => void;
  buttonProps?: ButtonProps;
};
export const HeadComponent = (props: Props) => {
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
      <Box display="flex" alignItems="center">
        {props.buttonTitle && (
          <Button
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
