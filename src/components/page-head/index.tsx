import { Box, Button, ButtonProps, Typography } from '@mui/material';
import { Iconify } from '../iconify';

type Props = {
  title: string;
  buttonTitle?: string;
  onClickButton?: () => void;
  buttonProps?: ButtonProps;
};
export const HeadComponent = (props: Props) => {
  return (
    <Box display="flex" alignItems="center" mb={2}>
      <Typography variant="h4" flexGrow={1}>
        {props.title}
      </Typography>
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
