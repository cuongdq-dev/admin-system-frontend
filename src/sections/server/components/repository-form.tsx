import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useEffect } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LanguageKey } from 'src/constants';
import { varAlpha } from 'src/theme/styles';

type RepositoryFormProps = {
  defaultValues?: IRepository;
  withBuild?: boolean;
  expanded?: 'basic_information' | 'optional_settings';
};

export const RepositoryForm = (props: RepositoryFormProps) => {
  const { defaultValues, expanded, withBuild = true } = props;
  const { control, register, getValues, setValue } = useFormContext();
  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: 'services',
  });

  useEffect(() => {
    replace(
      Number(defaultValues?.services?.length) > 0
        ? defaultValues?.services
        : {
            serviceName: '',
            buildContext: '',
            envFile: '',
            ports: '',
            environment: [{ variable: '', value: '' }],
            volumes: [{ hostPath: '', containerPath: '' }],
          }
    );
  }, []);

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
    <Box>
      <Accordion
        defaultExpanded={expanded == 'basic_information'}
        sx={(theme) => {
          return {
            paddingX: 1,
            backgroundColor: varAlpha(theme.vars.palette.background.neutralChannel, 0.4),
          };
        }}
      >
        <AccordionSummary
          expandIcon={<Iconify icon={'flat-color-icons:expand'} />}
          aria-controls="repository-basic-formation-content"
          id="repository-basic-formation-header"
        >
          <Typography variant="body2">{t(LanguageKey.repository.basicInformation)}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0, paddingBottom: 2 }}>
          <Box>
            <Grid container columns={2} marginTop={1} spacing={2}>
              <Grid item xs={2} sm={1} md={1}>
                <RHFTextField
                  disabled={withBuild}
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
                  disabled={withBuild}
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
                  disabled={withBuild}
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
                  disabled={withBuild}
                  id="github_url"
                  name="github_url"
                  label={t(LanguageKey.repository.githubUrlItem)}
                  type="url"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={2} sm={2} md={2}>
                <RHFTextField
                  defaultValue={defaultValues?.fine_grained_token}
                  disabled={withBuild}
                  id="fine_grained_token"
                  name="fine_grained_token"
                  label={t(LanguageKey.repository.fineGrainedTokenItem)}
                  type=""
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion
        onChange={(_, expanded) => {
          if (expanded == true) {
            setValue('with_env', true);
            setValue('with_docker_compose', true);
            replace(
              Number(defaultValues?.services?.length) > 0
                ? defaultValues?.services
                : {
                    serviceName: '',
                    buildContext: '',
                    envFile: '',
                    ports: '',
                    environment: [{ variable: '', value: '' }],
                    volumes: [{ hostPath: '', containerPath: '' }],
                  }
            );
          }
        }}
        defaultExpanded={expanded == 'optional_settings'}
        sx={(theme) => {
          return {
            marginTop: 2,
            paddingX: 1,
            backgroundColor: varAlpha(theme.vars.palette.background.neutralChannel, 0.4),
          };
        }}
      >
        <AccordionSummary
          expandIcon={<Iconify icon={'flat-color-icons:expand'} />}
          aria-controls="run-image-content"
          id="run-image-header"
        >
          <Typography variant="body2">{t(LanguageKey.repository.optionalSettings)}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <Box marginY={2}>
            <Grid container columns={2} gap={1}>
              {withBuild && (
                <Grid xs={2} sm={2} md={2}>
                  <Controller
                    {...register('with_env', { value: true })}
                    control={control}
                    defaultValue={true}
                    render={({ field }) => {
                      return (
                        <Box>
                          <Checkbox
                            {...field}
                            defaultChecked={field.value}
                            onChange={(_, checked) => {
                              setValue('with_env', checked);
                              if (withBuild) return;
                              if (checked == false) setValue('repo_env', undefined);
                              else setValue('repo_env', defaultValues?.repo_env || '');
                            }}
                          />
                          <Typography marginLeft={1} variant="caption">
                            {t(LanguageKey.repository.buildWithEnv)}
                          </Typography>
                        </Box>
                      );
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={2} sm={2} md={2}>
                <RHFTextField
                  disabled={withBuild}
                  multiline
                  label={t(LanguageKey.repository.repoEnv)}
                  maxRows={3}
                  defaultValue={defaultValues?.repo_env}
                  id="repo_env"
                  name="repo_env"
                  placeholder={'KEY=value\nKEY_@=@'}
                  type="text"
                  variant="outlined"
                />
                {withBuild && (
                  <Typography variant="caption">
                    {t(LanguageKey.repository.repoEnvGuide)}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Grid container columns={2} gap={1}>
              {withBuild && (
                <Grid xs={2} sm={2} md={2}>
                  <Controller
                    {...register('with_docker_compose', { value: true })}
                    control={control}
                    defaultValue={true}
                    render={({ field }) => {
                      return (
                        <Box>
                          <Checkbox
                            {...field}
                            defaultChecked={field.value}
                            onChange={(_, checked) => {
                              setValue('with_docker_compose', checked);
                              if (withBuild) return;
                              if (!checked) {
                                remove();
                                setValue('services', undefined);
                              } else {
                                replace(
                                  Number(defaultValues?.services?.length) > 0
                                    ? defaultValues?.services
                                    : {
                                        serviceName: '',
                                        buildContext: '',
                                        envFile: '',
                                        ports: '',
                                        environment: [{ variable: '', value: '' }],
                                        volumes: [{ hostPath: '', containerPath: '' }],
                                      }
                                );
                              }
                            }}
                          />
                          <Typography marginLeft={1} variant="caption">
                            {t(LanguageKey.repository.buildWithDockerCompose)}
                          </Typography>
                        </Box>
                      );
                    }}
                  />
                </Grid>
              )}

              <Grid xs={2} sm={2} md={2}>
                {fields.length > 0 && (
                  <Box>
                    <Typography variant="button">{t(LanguageKey.repository.services)}</Typography>
                    {!withBuild && (
                      <IconButton
                        onClick={() =>
                          append({
                            serviceName: '',
                            buildContext: '',
                            envFile: '',
                            port: '',
                            environment: [{ variable: '', value: '' }],
                            volumes: [{ hostPath: '', containerPath: '' }],
                          })
                        }
                      >
                        <Iconify icon="ic:baseline-plus" />
                      </IconButton>
                    )}
                    {fields.map((field: any, index) => (
                      <Box
                        sx={(theme) => {
                          return {
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 2,
                            padding: 2,
                          };
                        }}
                        key={field.id}
                        marginBottom={2}
                        marginTop={1}
                      >
                        <Grid container spacing={2} columns={2}>
                          <Grid item xs={2} sm={1} md={1}>
                            <TextField
                              {...register(`services.${index}.serviceName`)}
                              disabled={withBuild}
                              label="Service Name"
                              defaultValue={field.serviceName}
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={2} sm={1} md={1}>
                            <TextField
                              {...register(`services.${index}.buildContext`)}
                              disabled={withBuild}
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
                              disabled={withBuild}
                              defaultValue={field.envFile}
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={2} sm={1} md={1}>
                            <TextField
                              {...register(`services.${index}.ports`)}
                              label="Port"
                              disabled={withBuild}
                              defaultValue={field.ports}
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>

                        <Box marginTop={2}>
                          <Typography variant="button">
                            {t(LanguageKey.repository.environment)}
                          </Typography>
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
                                    disabled={withBuild}
                                    label={`Key:`}
                                    defaultValue={environment.variable}
                                    variant="outlined"
                                  />
                                  <TextField
                                    {...register(`services.${index}.environment.${idx}.value`)}
                                    disabled={withBuild}
                                    label={`value:`}
                                    defaultValue={environment.value}
                                    variant="outlined"
                                  />

                                  {!withBuild && idx < field.environment.length - 1 && (
                                    <IconButton
                                      onClick={() => removeEnvironmentVariable(index, idx)}
                                    >
                                      <Iconify icon="ic:baseline-remove" />
                                    </IconButton>
                                  )}
                                  {!withBuild && idx === field.environment.length - 1 && (
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
                          <Typography variant="button">
                            {t(LanguageKey.repository.volumes)}
                          </Typography>

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
                                    disabled={withBuild}
                                    label={`host:`}
                                    defaultValue={volume.hostPath}
                                    variant="outlined"
                                  />
                                  <TextField
                                    {...register(`services.${index}.volumes.${idx}.containerPath`)}
                                    label={`container:`}
                                    disabled={withBuild}
                                    defaultValue={volume.containerPath}
                                    variant="outlined"
                                  />

                                  {!withBuild && idx < field.volumes.length - 1 && (
                                    <IconButton onClick={() => removeVolumeVariable(index, idx)}>
                                      <Iconify icon="ic:baseline-remove" />
                                    </IconButton>
                                  )}
                                  {!withBuild && idx === field.volumes.length - 1 && (
                                    <IconButton onClick={() => addVolumeVariable(index)}>
                                      <Iconify icon="ic:baseline-plus" />
                                    </IconButton>
                                  )}
                                </Grid>
                              );
                            }
                          )}
                        </Box>
                        {!withBuild && Number(fields.length) > 1 && (
                          <Button
                            variant="outlined"
                            color="error"
                            sx={{ marginTop: 2 }}
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            {t(LanguageKey.button.delete)}
                          </Button>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
