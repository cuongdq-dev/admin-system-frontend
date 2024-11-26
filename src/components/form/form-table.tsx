import { Dialog } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { ButtonDismissNotify } from 'src/components/button';

type FormProps = {
  open: boolean;
  baseUrl: string;
  action?: HttpMethod;
  handleCloseForm: () => void;
  refreshData?: () => void;
  render?: () => JSX.Element;
};
export const PopupFormTable = (props: FormProps) => {
  const { action, baseUrl, render, open, handleCloseForm, refreshData } = props;

  return (
    <Dialog
      maxWidth={'sm'}
      open={open}
      onClose={handleCloseForm}
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          invokeRequest({
            method: action,
            baseURL: baseUrl,
            params: formJson,
            onSuccess: () => {
              enqueueSnackbar('Updated!', {
                variant: 'success',
                action: (key) => (
                  <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />
                ),
              });
              refreshData && refreshData();
            },
            onHandleError: (error) => {},
          });
        },
      }}
    >
      {render && render()}
    </Dialog>
  );
};
