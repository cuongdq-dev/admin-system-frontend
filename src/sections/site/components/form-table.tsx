import { LoadingButton } from '@mui/lab';
import { Box, Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { t } from 'i18next';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { HttpMethod } from 'src/api-core';
import { RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { RHFAutocomplete } from 'src/components/hook-form/RHFTextField';
import { LanguageKey } from 'src/constants';
import { useSettingStore } from 'src/store/setting';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  defaultValues?: ISite;
  isSubmitting?: boolean;
  action?: HttpMethod;
  handleCloseForm: () => void;
};
export const SiteForm = (props: Props) => {
  const { defaultValues, action = HttpMethod.PATCH, isSubmitting, handleCloseForm } = props;
  const { categories } = useSettingStore(useShallow((state) => ({ ...state.dropdown })));
  const defaultWorkspaces = (localStorage.getItem('workspaces') || 'wp_system') as workspacesType;

  const TypeOptions = [
    { id: 'POST', title: 'POST' },
    { id: 'BOOK', title: 'BOOK' },
  ];
  return (
    <>
      <DialogContent>
        <Box marginTop={1} gap={2} component={'div'} display={'flex'} flexDirection={'column'}>
          <RHFTextField
            name="name"
            label={t(LanguageKey.site.nameItem)}
            type="text"
            fullWidth
            defaultValue={defaultValues?.name}
          />
          <RHFTextField
            name="description"
            multiline
            maxRows={10}
            label={t(LanguageKey.site.descriptionItem)}
            defaultValue={defaultValues?.description || ''}
          />
          <RHFCheckbox
            name="autoPost"
            control={<></>}
            label={t(LanguageKey.site.autoPostItem)}
            defaultChecked={defaultValues?.autoPost}
          />
          <RHFTextField
            defaultValue={defaultValues?.domain}
            id="domain"
            name="domain"
            label={t(LanguageKey.site.domainItem)}
            type="text"
            fullWidth
          />
          {action != HttpMethod.POST && (
            <RHFTextField
              multiline
              disabled
              defaultValue={defaultValues?.token}
              id="token"
              name="token"
              label="API Token"
              type="text"
              fullWidth
              copy
            />
          )}
          <RHFAutocomplete
            options={categories || []}
            defaultValue={defaultValues?.categories?.map((category) => {
              return { id: category?.id, title: category.name };
            })}
            name="categories"
            title={t(LanguageKey.site.categoriesItem)}
            renderInput={(params) => (
              <TextField {...params} margin="normal" label={t(LanguageKey.site.categoriesItem)} />
            )}
          />
          {defaultWorkspaces == 'wp_system' && (
            <RHFAutocomplete
              multiple={false}
              options={TypeOptions}
              defaultValue={
                action == HttpMethod.PATCH
                  ? TypeOptions.find((t) => t.id == defaultValues?.type)
                  : TypeOptions[0]
              }
              name="type"
              title={t(LanguageKey.site.typeItem)}
              renderInput={(params) => (
                <TextField {...params} margin="normal" label={t(LanguageKey.site.typeItem)} />
              )}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions style={{ padding: 20 }}>
        <Button variant="outlined" color="inherit" onClick={handleCloseForm}>
          {t(LanguageKey.button.cancel)}
        </Button>
        <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
          {action === HttpMethod.PATCH
            ? t(LanguageKey.button.update)
            : t(LanguageKey.button.create)}
        </LoadingButton>
      </DialogActions>
    </>
  );
};
