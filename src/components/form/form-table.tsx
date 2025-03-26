import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { LanguageKey } from 'src/constants';
import { useNotifyStore } from 'src/store/notify';
import { usePageStore } from 'src/store/page';
import { GetValuesFormChange } from 'src/utils/validation/form';
import * as Yup from 'yup';
import { Transition } from '../dialog';
import { FormProvider } from '../hook-form';

type FormProps = {
  storeName: string;
  open: boolean;
  baseUrl: string;
  action?: HttpMethod;
  handleCloseForm: () => void;
  handleSuccess?: () => void;
  render?: ({ isSubmitting }: { isSubmitting: boolean }) => JSX.Element;
  rowId?: string;
  defaultValues?: Record<string, any>;
  formItems?: Record<string, any>;
  schema?: Record<string, any>;
};
export const PopupFormTable = (props: FormProps) => {
  const { editItem, addItem, deleteItem } = usePageStore.getState();
  const { action, baseUrl, defaultValues, schema = {}, rowId, open, storeName } = props;
  const { setNotify } = useNotifyStore.getState();
  const { render, handleSuccess, handleCloseForm } = props;
  const url = baseUrl + (action === HttpMethod.PATCH ? '/update/' + rowId : '/create');
  const methods = useForm({ resolver: yupResolver(Yup.object().shape(schema)) });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const [isLoading, setLoading] = useState(isSubmitting);

  useEffect(() => {
    reset();
  }, [open]);

  const onSubmit = async (values: Record<string, any>) => {
    setLoading(true);
    const valuesChange = GetValuesFormChange(defaultValues as typeof values, values);
    if (Object.keys(valuesChange).length == 0) {
      reset();
      handleCloseForm();
      setLoading(false);
      return;
    }
    invokeRequest({
      method: action,
      baseURL: url,
      params: values,
      onHandleError: (response) => {
        setLoading(false);
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
        setLoading(false);
        setNotify({ title: t(LanguageKey.notify.successUpdate), options: { variant: 'success' } });
        reset();
        handleCloseForm();
        if (handleSuccess) {
          handleSuccess();
          return;
        }
        if (action === HttpMethod.POST) addItem(storeName, res);
        if (action === HttpMethod.PATCH) {
          editItem(storeName, res);
        }
        if (action === HttpMethod.DELETE) {
          deleteItem(storeName, rowId);
        }
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseForm}
      scroll={'paper'}
      fullWidth
      TransitionComponent={Transition}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {render && render({ isSubmitting: isLoading })}
      </FormProvider>
    </Dialog>
  );
};
