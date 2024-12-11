import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, CardHeader, Box, CardContent, Grid } from '@mui/material';
import { t } from 'i18next';
import { FieldValues, useForm, UseFormSetError } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { PasswordText } from 'src/components/hook-form/RHFTextField';
import { LanguageKey } from 'src/constants';
import { GetValuesFormChange } from 'src/utils/validation/form';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  name: Yup.string().nonNullable('name is required'),
  host: Yup.string().nonNullable('host is required'),
  port: Yup.string().nonNullable('port is required'),
  password: Yup.string().nonNullable('password is required'),
  user: Yup.string().nonNullable('user is required'),
});

type Props = {
  defaultData?: IServer;
  handleUpdate?: (setError: UseFormSetError<FieldValues>, values?: Record<string, any>) => void;
};

export const BasicInformation = (props: Props) => {
  const methods = useForm({ resolver: yupResolver(schema) });
  const { defaultData, handleUpdate } = props;

  const {
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values: typeof defaultData) => {
    const valuesChange = GetValuesFormChange(defaultData!, values!);
    if (Object.keys(valuesChange).length == 0) {
      reset();
      return;
    }
    handleUpdate && handleUpdate(setError, values);
    reset();
  };

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Card sx={{ boxShadow: 'none' }}>
        <CardHeader
          sx={{ textAlign: 'left', marginBottom: 2 }}
          title={t(LanguageKey.server.informationTitle)}
          action={
            <>
              <Box display="flex" justifyContent="flex-end">
                <LoadingButton
                  color="inherit"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  {t(LanguageKey.button.saveChanges)}
                </LoadingButton>
              </Box>
            </>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item sm={12} md={6} xs={12}>
              <RHFTextField
                id="name"
                name="name"
                defaultValue={defaultData?.name}
                label={t(LanguageKey.server.nameItem)}
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item sm={12} md={6} xs={12}>
              <RHFTextField
                id="host"
                name="host"
                defaultValue={defaultData?.host}
                label={t(LanguageKey.server.hostItem)}
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item sm={12} md={6} xs={12}>
              <RHFTextField
                id="port"
                name="port"
                defaultValue={defaultData?.port}
                label={t(LanguageKey.server.portItem)}
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item sm={12} md={6} xs={12}>
              <RHFTextField
                id="user"
                name="user"
                defaultValue={defaultData?.user}
                label={t(LanguageKey.server.userItem)}
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item sm={12} md={6} xs={12}>
              <PasswordText
                id="password"
                name="password"
                defaultValue={defaultData?.password}
                label={t(LanguageKey.server.passwordItem)}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </FormProvider>
  );
};
