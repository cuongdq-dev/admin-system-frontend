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
import { RepositoryForm } from './repository-form';

export const RunImageForm = (props: {
  id?: string;
  row?: Record<string, any>;
  expanded?: 'basic_information' | 'optional_settings';
  baseUrl: string;
  handleOpen: (open: boolean) => void;
  handleLoading: (loading: boolean) => void;
  updateRowData?: (
    rowId: string,
    values: Record<string, any>,
    action: 'ADD' | 'REMOVE' | 'UPDATE'
  ) => void;
}) => {
  const { row, handleLoading, expanded, baseUrl, id, handleOpen, updateRowData } = props;

  return (
    <>
      <DialogContent dividers={true}>
        <RepositoryForm defaultValues={row} expanded={expanded} />
      </DialogContent>
      <DialogActions sx={{ paddingTop: 4 }}>
        <Button color="error" variant="contained" type="submit">
          {t(LanguageKey.docker.imageRun)}
        </Button>
        <Button color="inherit" variant="outlined" onClick={() => handleOpen(false)} autoFocus>
          {t(LanguageKey.button.cancel)}
        </Button>
      </DialogActions>
    </>
  );
};
