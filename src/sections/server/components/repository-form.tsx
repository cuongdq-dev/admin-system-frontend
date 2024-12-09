import LoadingButton from '@mui/lab/LoadingButton';
import {
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
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HttpMethod } from 'src/api-core';
import { RHFTextField } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LanguageKey } from 'src/constants';

type RepositoryFormProps = {
  defaultValues?: IRepository;
  isSubmitting?: boolean;
  action?: HttpMethod;
  handleCloseForm: () => void;
};

export const RepositoryForm = (props: RepositoryFormProps) => {
  const { defaultValues, action = HttpMethod.PATCH, isSubmitting, handleCloseForm } = props;
  const { control, register, getValues } = useFormContext();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'services',
  });

  useEffect(() => {
    defaultValues?.services && append(defaultValues?.services);
  }, [defaultValues]);

  const addEnvironmentVariable = (index: number) => {
    const field: any = fields[index];
    update(index, {
      ...getValues('services')[index],
      environment: field['environment'].concat({ variable: '', value: '' }),
    });
  };
  const removeEnvironmentVariable = (fieldsIndex: number, envIndex: number) => {
    const field: any = fields[fieldsIndex];
    update(fieldsIndex, {
      ...getValues('services')[fieldsIndex],
      environment: field['environment'].filter((f: any, index: number) => index != envIndex),
    });
  };

  const addVolumeVariable = (index: number) => {
    const field: any = fields[index];
    update(index, {
      ...getValues('services')[index],
      volumes: field['volumes'].concat({ hostPath: '', containerPath: '' }),
    });
  };
  const removeVolumeVariable = (fieldsIndex: number, volumeIndex: number) => {
    const field: any = fields[fieldsIndex];
    update(fieldsIndex, {
      ...getValues('services')[fieldsIndex],
      volumes: field['volumes'].filter((f: any, index: number) => index != volumeIndex),
    });
  };

  return (
    <>
      <DialogContent>
        <Grid container columns={2} marginTop={1} spacing={2}>
          <Grid item xs={2} sm={1} md={1}>
            <RHFTextField
              defaultValue={defaultValues?.name}
              id="name"
              name="name"
              label={t(LanguageKey.repository.nameItem)}
              type="text"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={2} sm={1} md={1}>
            <RHFTextField
              defaultValue={defaultValues?.email}
              id="email"
              name="email"
              label={t(LanguageKey.repository.emailItem)}
              type="email"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={2} sm={1} md={1}>
            <RHFTextField
              defaultValue={defaultValues?.username}
              id="username"
              name="username"
              label={t(LanguageKey.repository.usernameItem)}
              type="text"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={2} sm={1} md={1}>
            <RHFTextField
              defaultValue={defaultValues?.github_url}
              id="github_url"
              name="github_url"
              label={t(LanguageKey.repository.githubUrlItem)}
              type="text"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2}>
            <RHFTextField
              defaultValue={defaultValues?.fine_grained_token}
              id="fine_grained_token"
              name="fine_grained_token"
              label={t(LanguageKey.repository.fineGrainedTokenItem)}
              type="text"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Box marginY={2}>
          <Typography variant="button">Services</Typography>
          <IconButton
            onClick={() =>
              append({
                serviceName: '',
                buildContext: '',
                envFile: '',
                environment: [{ variable: '', value: '' }],
                volumes: [{ hostPath: '', containerPath: '' }],
              })
            }
          >
            <Iconify icon="ic:baseline-plus" />
          </IconButton>
          {fields.map((field: any, index) => (
            <Box
              sx={(theme) => {
                return {
                  backgroundColor: theme.palette.background.neutral,
                  borderRadius: 2,
                  padding: 2,
                };
              }}
              key={field.id}
              marginBottom={2}
            >
              <Grid container spacing={1} columns={2}>
                <Grid item xs={2} sm={1} md={1}>
                  <TextField
                    {...register(`services.${index}.serviceName`)}
                    label="Service Name"
                    defaultValue={field.serviceName}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={2} sm={1} md={1}>
                  <TextField
                    {...register(`services.${index}.buildContext`)}
                    label="Build Context"
                    defaultValue={field.buildContext}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={2} sm={1} md={1}>
                  <TextField
                    {...register(`services.${index}.envFile`)}
                    label="Env File"
                    defaultValue={field.envFile}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Box marginTop={2}>
                <Typography variant="button">Environment Variables</Typography>
                {field.environment?.map(
                  (environment: { variable: string; value: string }, idx: number) => {
                    return (
                      <Grid
                        marginTop={2}
                        gap={2}
                        columns={1}
                        container
                        key={idx}
                        display="flex"
                        flexDirection="row"
                        flexWrap={'nowrap'}
                      >
                        <TextField
                          {...register(`services.${index}.environment.${idx}.variable`)}
                          label={`Key:`}
                          defaultValue={environment.variable}
                          variant="outlined"
                        />
                        <TextField
                          {...register(`services.${index}.environment.${idx}.value`)}
                          label={`value:`}
                          defaultValue={environment.value}
                          variant="outlined"
                        />

                        {idx < field.environment.length - 1 && (
                          <IconButton onClick={() => removeEnvironmentVariable(index, idx)}>
                            <Iconify icon="ic:baseline-remove" />
                          </IconButton>
                        )}
                        {idx === field.environment.length - 1 && (
                          <IconButton onClick={() => addEnvironmentVariable(index)}>
                            <Iconify icon="ic:baseline-plus" />
                          </IconButton>
                        )}
                      </Grid>
                    );
                  }
                )}
              </Box>
              <Box marginTop={2}>
                <Typography variant="button">Volumes</Typography>
                {field.volumes?.map(
                  (volume: { hostPath: string; containerPath: string }, idx: number) => {
                    return (
                      <Grid
                        marginTop={2}
                        gap={2}
                        columns={1}
                        container
                        key={idx}
                        display="flex"
                        flexDirection="row"
                        flexWrap={'nowrap'}
                      >
                        <TextField
                          {...register(`services.${index}.volumes.${idx}.hostPath`)}
                          label={`host:`}
                          defaultValue={volume.hostPath}
                          variant="outlined"
                        />
                        <TextField
                          {...register(`services.${index}.volumes.${idx}.containerPath`)}
                          label={`container:`}
                          defaultValue={volume.containerPath}
                          variant="outlined"
                        />

                        {idx < field.volumes.length - 1 && (
                          <IconButton onClick={() => removeVolumeVariable(index, idx)}>
                            <Iconify icon="ic:baseline-remove" />
                          </IconButton>
                        )}
                        {idx === field.volumes.length - 1 && (
                          <IconButton onClick={() => addVolumeVariable(index)}>
                            <Iconify icon="ic:baseline-plus" />
                          </IconButton>
                        )}
                      </Grid>
                    );
                  }
                )}
              </Box>
              <Button
                variant="outlined"
                color="error"
                sx={{ marginTop: 2 }}
                onClick={() => {
                  remove(index);
                }}
              >
                Remove Service
              </Button>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleCloseForm}>
          Cancel
        </Button>
        <LoadingButton type="submit" color="inherit" variant="contained" loading={isSubmitting}>
          {action === HttpMethod.PATCH ? 'Pull' : 'Clone'}
        </LoadingButton>
      </DialogActions>
    </>
  );
};
