import YamlEditor from '@focus-reactive/react-yaml';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Form } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { t } from 'i18next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Iconify, IconifyProps } from 'src/components/iconify';
import { LanguageKey } from 'src/constants';
import { generateJsonSchema } from 'src/utils/validation/form';

export const ServiceFormJson = ({
  json,
  title,
  icon,
  handleUpdateService,
}: {
  icon: IconifyProps;
  title: string;
  json: Record<string, any>;
  handleUpdateService: (value?: Record<string, any>) => void;
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Responsive check
  const [open, setOpen] = useState(false);
  const descriptionElementRef = useRef<HTMLElement>(null);
  const [formMode, setFormMode] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(true);
  const [value, setValue] = useState<Record<string, any> | undefined>();

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    } else {
      setValue(undefined);
      setError(true);
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setFormMode(true);
  };

  const handleSwitchChange = (event: ChangeEvent, checked: boolean) => {
    setFormMode(!checked);
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} size="small">
        <Iconify {...icon} icon={'cuida:edit-outline'} />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        variant="temporary"
        PaperProps={{
          sx: {
            width: isSmallScreen ? '90%' : '40%',
          },
        }}
      >
        <Box padding={2} display="flex" alignItems="center">
          <IconButton size="large" onClick={() => setOpen(false)}>
            <Iconify icon={'oi:chevron-right'} />
          </IconButton>

          <Box width={'100%'} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{title}</Typography>
            <LoadingButton
              disabled={!value}
              onClick={() => {
                value && !error && handleUpdateService(value);
              }}
              color="inherit"
              variant="contained"
            >
              {t(LanguageKey.button.submit)}
            </LoadingButton>
          </Box>
        </Box>
        <Divider />

        <Box padding={4}>
          <Box marginBottom={2} display="flex" alignItems="center" gap={1}>
            <Switch size="medium" onChange={handleSwitchChange} />
            <Typography>Edit with json</Typography>
          </Box>
          {formMode ? (
            <Box
              sx={(theme) => {
                return {
                  '.field >': {
                    backgroundColor: 'none',
                  },
                  '.rjsf > .field': {
                    '.MuiPaper-root': {
                      boxShadow: 'none',
                      backgroundColor: 'transparent',
                      border: 'none',
                    },
                  },
                  '.rjsf > .field > .MuiGrid-container': {
                    padding: 1,
                  },
                  '.rjsf > .field .field-object': {
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: theme.vars.shadows[5],
                    backgroundColor: theme.vars.palette.background.neutral,
                  },
                  '.rjsf > .field .field-array': {
                    backgroundColor: theme.vars.palette.background.neutral,
                    boxShadow: theme.vars.shadows[5],
                    borderRadius: 2,
                  },
                };
              }}
            >
              <Form
                schema={generateJsonSchema(json)}
                formData={json}
                validator={validator}
                disabled
                uiSchema={{
                  'ui:submitButtonOptions': { norender: true },
                  ...Object.keys(json).reduce((acc: Record<string, any>, key: string) => {
                    acc[key] = { 'ui:removable': false, 'ui:addable': false };
                    return acc;
                  }, {}),
                }}
              />
            </Box>
          ) : (
            <Box
              sx={(theme) => {
                return {
                  '.ͼz': { color: theme.vars.palette.text.secondary },
                  '.ͼb': { color: theme.vars.palette.text.secondary },
                };
              }}
            >
              <YamlEditor
                json={json}
                onError={() => {
                  setError(true);
                }}
                onChange={({ json, text }) => {
                  setValue(json);
                  setError(false);
                }}
              />
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};
