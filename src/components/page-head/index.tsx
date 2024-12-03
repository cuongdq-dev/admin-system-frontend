import { Box, Typography, Button, ButtonProps } from '@mui/material';
import { t } from 'i18next';
import { HttpMethod } from 'src/api-core';
import { LanguageKey } from 'src/constants';
import { Iconify } from '../iconify';

type Props = {
  title: string;
  buttonTitle?: string;
  onClickButton?: () => void;
  buttonProps?: ButtonProps;
};
export const HeadComponent = (props: Props) => {
  return (
    <Box display="flex" alignItems="center" mb={5}>
      <Typography variant="h4" flexGrow={1}>
        {props.title}
      </Typography>
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
  );
};
