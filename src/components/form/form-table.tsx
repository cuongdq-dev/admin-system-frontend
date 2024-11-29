import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from '@mui/material';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { ButtonDismissNotify } from 'src/components/button';
import * as Yup from 'yup';
import { Transition } from '../dialog';
import { FormProvider } from '../hook-form';

type FormProps = {
  open: boolean;
  baseUrl: string;
  action?: HttpMethod;
  handleCloseForm: () => void;
  refreshData?: () => void;
  render?: ({ isSubmitting }: { isSubmitting: boolean }) => JSX.Element;
  rowId?: string;
  defaultValues?: Record<string, any>;
  formItems?: Record<string, any>;
  schema?: Record<string, Yup.StringSchema<string, Yup.AnyObject, undefined, ''>>;
};
export const PopupFormTable = (props: FormProps) => {
  const { action, baseUrl, defaultValues, schema = {}, rowId, open } = props;
  const { render, handleCloseForm, refreshData } = props;
  const url = baseUrl + (action === HttpMethod.PATCH ? '/update/' + rowId : '/create');
  const methods = useForm({ resolver: yupResolver(Yup.object().shape(schema)), defaultValues });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  const onSubmit = async (values: { email?: string; password?: string; remember?: boolean }) => {
    invokeRequest({
      method: action,
      baseURL: url,
      params: values,
      onHandleError: (response) => {
        if (response?.errors && typeof response.errors === 'object') {
          Object.keys(response.errors).forEach((key) => {
            methods.setError(key as any, {
              type: 'server',
              message: response?.errors![key],
            });
          });
        } else {
          console.error('Unexpected error format:', response);
        }
      },
      onSuccess(res) {
        enqueueSnackbar(t('notify_success_update'), {
          variant: 'success',
          action: (key) => <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />,
        });
        refreshData && refreshData();
      },
    });
  };

  return (
    <Dialog
      maxWidth={'sm'}
      open={open}
      onClose={handleCloseForm}
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {render && render({ isSubmitting })}
      </FormProvider>
    </Dialog>
  );
};
