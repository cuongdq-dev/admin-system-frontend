import { yupResolver } from '@hookform/resolvers/yup';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { ButtonDismissNotify } from 'src/components/button';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LanguageKey } from 'src/constants';
import * as Yup from 'yup';

export const RunImageForm = (props: {
  id?: string;
  row?: Record<string, any>;
  baseUrl: string;
  handleOpen: (open: boolean) => void;
  handleLoading: (loading: boolean) => void;
  updateRowData?: (
    rowId: string,
    values: Record<string, any>,
    action: 'ADD' | 'REMOVE' | 'UPDATE'
  ) => void;
}) => {
  const { row, handleLoading, baseUrl, id, handleOpen, updateRowData } = props;
  const methods = useForm({
    defaultValues: {
      name: '',
      hostPort: '',
      containerPort: '',
      volumes: [{ hostPath: '', containerPath: '' }],
      envVariables: [{ key: '', value: '' }],
    },
  });

  const { handleSubmit } = methods;

  const [envVariables, setEnvVariables] = useState([{ key: '', value: '' }]);
  const [volumes, setVolumes] = useState([{ hostPath: '', containerPath: '' }]);

  const handleAddEnv = () => setEnvVariables([...envVariables, { key: '', value: '' }]);
  const handleRemoveEnv = (index: number) => {
    setEnvVariables(envVariables.filter((_, i) => i !== index));
  };

  const handleAddVolume = () => setVolumes([...volumes, { hostPath: '', containerPath: '' }]);
  const handleRemoveVolume = (index: number) => {
    setVolumes(volumes.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: Record<string, any>) => {
    handleLoading(true);
    handleOpen(false);

    invokeRequest({
      method: HttpMethod.POST,
      baseURL: baseUrl,
      params: {
        imageName: row?.name,
        imageTag: row?.tag,
        imageId: row?.id,
        containerName: values.name,
        hostPort: values.hostPort,
        containerPort: values.containerPort,
        volumes: volumes,
        envVariables: envVariables,
      },
      onHandleError: () => handleLoading(false),
      onSuccess(res) {
        handleLoading(false);
        updateRowData && updateRowData(id!, res?.result, 'UPDATE');
        enqueueSnackbar(t(LanguageKey.notify.successUpdate), {
          variant: 'success',
          action: (key) => <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />,
        });
      },
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <DialogContent dividers={true}>
        <Accordion sx={{ boxShadow: 'none' }}>
          <AccordionSummary
            sx={{ padding: 0 }}
            expandIcon={<Iconify icon={'flat-color-icons:expand'} />}
            aria-controls="run-image-content"
            id="run-image-header"
          >
            <Typography variant="h5">Optional Settings</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <Box gap={1} paddingTop={1} component={'div'} display={'flex'} flexDirection={'column'}>
              <Box>
                <RHFTextField
                  id="name"
                  name="name"
                  label={t(LanguageKey.docker.containerNameItem)}
                  type="string"
                  required
                  fullWidth
                  variant="outlined"
                />
                <Typography variant="caption">
                  A random name is generated if you do not provide one.
                </Typography>
              </Box>
              <Grid spacing={3} container columns={5}>
                <Grid item md={2} xl={2} xs={4}>
                  <RHFTextField
                    id="hostPort"
                    name="hostPort"
                    required
                    label={t(LanguageKey.server.portItem)}
                    type="text"
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={2} xl={2} xs={4}>
                  <RHFTextField
                    id="containerPort"
                    name="containerPort"
                    required
                    label={'Container Port'}
                    type="text"
                    variant="standard"
                  />
                </Grid>
              </Grid>

              <Typography variant="button">Volumes</Typography>
              {volumes.map((volume, index) => (
                <Grid container spacing={2} key={index} columns={5}>
                  <Grid item md={2} xl={2} xs={4}>
                    <TextField
                      label="Host Path"
                      value={volume.hostPath}
                      onChange={(e) => {
                        const newVolumes = [...volumes];
                        newVolumes[index].hostPath = e.target.value;
                        setVolumes(newVolumes);
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={2} xl={2} xs={4}>
                    <TextField
                      label="Container Path"
                      value={volume.containerPath}
                      onChange={(e) => {
                        const newVolumes = [...volumes];
                        newVolumes[index].containerPath = e.target.value;
                        setVolumes(newVolumes);
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid alignContent={'center'} item md={1} xl={1} xs={1}>
                    {index < volumes.length - 1 && (
                      <IconButton onClick={() => handleRemoveVolume(index)}>
                        <Iconify icon="ic:baseline-remove" />
                      </IconButton>
                    )}
                    {index === volumes.length - 1 && (
                      <IconButton onClick={handleAddVolume}>
                        <Iconify icon="ic:baseline-plus" />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
              <Typography variant="button">Environment variables</Typography>
              {envVariables.map((env, index) => (
                <Grid container spacing={2} key={index} columns={5}>
                  <Grid item md={2} xl={2} xs={4}>
                    <TextField
                      label="Key"
                      value={env.key}
                      onChange={(e) => {
                        const newEnv = [...envVariables];
                        newEnv[index].key = e.target.value;
                        setEnvVariables(newEnv);
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={2} xl={2} xs={4}>
                    <TextField
                      label="Value"
                      value={env.value}
                      onChange={(e) => {
                        const newEnv = [...envVariables];
                        newEnv[index].value = e.target.value;
                        setEnvVariables(newEnv);
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid alignContent={'center'} item md={1} xl={1} xs={1}>
                    {index < envVariables.length - 1 && (
                      <IconButton onClick={() => handleRemoveEnv(index)}>
                        <Iconify icon="ic:baseline-remove" />
                      </IconButton>
                    )}
                    {index === envVariables.length - 1 && (
                      <IconButton onClick={handleAddEnv}>
                        <Iconify icon="ic:baseline-plus" />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions sx={{ paddingTop: 4 }}>
        <Button color="error" variant="contained" type="submit">
          {t(LanguageKey.docker.imageRun)}
        </Button>
        <Button color="inherit" variant="outlined" onClick={() => handleOpen(false)} autoFocus>
          {t(LanguageKey.button.cancel)}
        </Button>
      </DialogActions>
    </FormProvider>
  );
};
