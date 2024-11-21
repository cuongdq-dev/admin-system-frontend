import { Button } from '@mui/material';
import { closeSnackbar, SnackbarKey } from 'notistack';

export const ButtonDismissNotify = (props: {
  textLabel?: string;
  textColor?: string;
  key: SnackbarKey;
}) => {
  const { textColor, key, textLabel = 'Dismiss' } = props;
  return (
    <Button style={{ color: textColor }} size="small" onClick={() => closeSnackbar(key)}>
      {textLabel}
    </Button>
  );
};
