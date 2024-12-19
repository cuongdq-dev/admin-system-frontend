import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { RHFTextField } from 'src/components/hook-form';
import { LanguageKey } from 'src/constants';
import { varAlpha } from 'src/theme/styles';

type ImageFormProps = {
  defaultValues?: IImageDocker;
};

export const ImageForm = (props: ImageFormProps) => {
  const { defaultValues } = props;

  return (
    <Box>
      <Accordion
        expanded
        sx={(theme) => {
          return {
            paddingX: 1,
            backgroundColor: varAlpha(theme.vars.palette.background.neutralChannel, 0.4),
          };
        }}
      >
        <AccordionSummary
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
                  disabled={true}
                  defaultValue={defaultValues?.repository?.name}
                  id="name"
                  name="name"
                  label={t(LanguageKey.repository.nameItem)}
                  type="text"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={2} sm={1} md={1}>
                <RHFTextField
                  disabled={true}
                  defaultValue={defaultValues?.repository?.email}
                  id="email"
                  name="email"
                  label={t(LanguageKey.repository.emailItem)}
                  type="email"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={2} sm={1} md={1}>
                <RHFTextField
                  disabled={true}
                  defaultValue={defaultValues?.repository?.username}
                  id="username"
                  name="username"
                  label={t(LanguageKey.repository.usernameItem)}
                  type="text"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={2} sm={1} md={1}>
                <RHFTextField
                  disabled={true}
                  defaultValue={defaultValues?.repository?.github_url}
                  id="github_url"
                  name="github_url"
                  label={t(LanguageKey.repository.githubUrlItem)}
                  type="url"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded
        sx={(theme) => {
          return {
            marginTop: 2,
            paddingX: 1,
            backgroundColor: varAlpha(theme.vars.palette.background.neutralChannel, 0.4),
          };
        }}
      >
        <AccordionSummary aria-controls="run-image-content" id="run-image-header">
          <Typography variant="body2">{t(LanguageKey.repository.optionalSettings)}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <Box marginY={2}>
            <Grid container columns={2} gap={1}>
              <Grid item xs={2} sm={2} md={2}>
                <RHFTextField
                  disabled={true}
                  multiline
                  label={t(LanguageKey.repository.repoEnv)}
                  maxRows={3}
                  defaultValue={defaultValues?.repository?.repo_env}
                  id="repo_env"
                  name="repo_env"
                  placeholder={'KEY=value\nKEY_@=@'}
                  type="text"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Grid container columns={2} gap={1}>
              <Grid item xs={2} sm={2} md={2}>
                <Box>
                  <Typography variant="button">{t(LanguageKey.repository.services)}</Typography>

                  {defaultValues?.repository?.services?.map((field: any) => {
                    return (
                      <Box
                        sx={(theme) => {
                          return {
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 2,
                            padding: 2,
                          };
                        }}
                        key={field?.id}
                        marginBottom={2}
                        marginTop={1}
                      >
                        <Grid container spacing={2} columns={2}>
                          <Grid item xs={2} sm={2} md={2}>
                            <TextField
                              disabled={true}
                              label="Image Name"
                              defaultValue={field?.image}
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={2} sm={1} md={1}>
                            <TextField
                              disabled={true}
                              label="Service Name"
                              defaultValue={field?.serviceName}
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={2} sm={1} md={1}>
                            <TextField
                              disabled={true}
                              label="Build Context"
                              defaultValue={field?.buildContext}
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item xs={2} sm={1} md={1}>
                            <TextField
                              label="Env File"
                              disabled={true}
                              defaultValue={field?.envFile}
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={2} sm={1} md={1}>
                            <TextField
                              label="Port"
                              disabled={true}
                              defaultValue={field?.ports}
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>

                        <Box marginTop={2}>
                          <Typography variant="button">
                            {t(LanguageKey.repository.environment)}
                          </Typography>
                          {field?.environment?.map(
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
                                    disabled={true}
                                    label={`Key:`}
                                    defaultValue={environment?.variable}
                                    variant="outlined"
                                  />
                                  <TextField
                                    disabled={true}
                                    label={`value:`}
                                    defaultValue={environment?.value}
                                    variant="outlined"
                                  />
                                </Grid>
                              );
                            }
                          )}
                        </Box>
                        <Box marginTop={2}>
                          <Typography variant="button">
                            {t(LanguageKey.repository.volumes)}
                          </Typography>
                          {field?.volumes?.map(
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
                                    disabled={true}
                                    label={`host:`}
                                    defaultValue={volume.hostPath}
                                    variant="outlined"
                                  />
                                  <TextField
                                    label={`container:`}
                                    disabled={true}
                                    defaultValue={volume.containerPath}
                                    variant="outlined"
                                  />
                                </Grid>
                              );
                            }
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
