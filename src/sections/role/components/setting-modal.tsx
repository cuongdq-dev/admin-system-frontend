import { Close as CloseIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Iconify } from 'src/components/iconify';
import { LanguageKey } from 'src/constants';

type ActionType = 'read' | 'update' | 'create' | 'delete' | 'publish';

interface PermissionSettingsData {
  action?: ActionType;
  permissionId?: string;
  conditions?: { ownerOnly?: boolean; asOwner?: boolean };
  collectionName?: string;
}

interface PermissionSettingsModalProps {
  onApply: (settings: PermissionSettingsData[]) => void;
  collectionName: string;
  currentSettings?: PermissionSettingsData[];
}

const conditionOptions = [
  { label: 'Default', key: 'all' },
  { label: 'Is creator', key: 'ownerOnly' },
  { label: 'Has same role as creator', key: 'asOwner' },
];

export const PermissionSettingsModal = ({
  onApply,
  collectionName,
  currentSettings,
}: PermissionSettingsModalProps) => {
  const [open, setOpen] = useState(false);

  const { control, handleSubmit, reset, watch } = useForm<Record<ActionType, string[]>>({
    defaultValues: {},
  });

  useEffect(() => {
    if (currentSettings) {
      const mapped: Record<string, any> = {};
      for (const setting of currentSettings) {
        mapped[setting.action!] = [];
        if (setting.conditions?.asOwner) mapped[setting.action!].push('asOwner');
        if (setting.conditions?.ownerOnly) mapped[setting.action!].push('ownerOnly');
        if (setting.conditions?.asOwner && setting.conditions.ownerOnly)
          mapped[setting.action!].push('ownerOnly');
      }
      reset(mapped);
    }
  }, [currentSettings, reset]);

  const handleApply = (data: Record<ActionType, string[]>) => {
    const transformed: PermissionSettingsData[] = Object.entries(data).map(
      ([action, conditions]) => {
        const permission = currentSettings?.find(
          (c) =>
            c.collectionName == collectionName &&
            action.toLocaleLowerCase() == c?.action?.toLocaleLowerCase()
        );

        const conditionsValues = conditions?.reduce((acc: Record<string, any>, c: string) => {
          acc[c] = true;
          return acc;
        }, {});
        return {
          action: action as ActionType,
          collectionName,
          permissionId: permission?.permissionId,
          conditions:
            Number(Object.keys(conditionsValues).length) > 0
              ? (conditionsValues as any)
              : undefined,
        };
      }
    );
    onApply(transformed);
    setOpen(false);
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        startIcon={<Iconify icon={'icon-park-outline:setting'} />}
      >
        {t(LanguageKey.role.settingType)}
      </Button>

      <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ mb: 1 }}
              >
                <Link variant="button" href="#" onClick={(e) => e.preventDefault()}>
                  {collectionName}
                </Link>
                <Typography variant="button" color="text.primary">
                  Conditions
                </Typography>
              </Breadcrumbs>
            </Box>
            <IconButton onClick={handleCancel} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider />

        <form onSubmit={handleSubmit(handleApply)}>
          <DialogContent sx={{ p: 2 }}>
            {currentSettings?.map(({ action }) => (
              <Box
                key={action}
                sx={(theme) => ({
                  backgroundColor: theme.palette.grey[100],
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                })}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                    mb: 1,
                    color: '#3f51b5',
                  }}
                >
                  {t(LanguageKey.role.canActionWhen).replace('{action}', action!)}
                </Typography>

                <Controller
                  name={action as ActionType}
                  control={control}
                  render={({ field }) => {
                    const handleSelectChange = (event: any) => {
                      const value = event.target.value as string[];
                      const prevValue = field.value || [];

                      const allKey = 'all';

                      const allOptionKeys = conditionOptions.map((o) => o.key);
                      const subOptionKeys = allOptionKeys.filter((k) => k !== allKey);

                      const isSelectingAll = value.includes(allKey) && !prevValue.includes(allKey);
                      const isUnselectingAll =
                        !value.includes(allKey) && prevValue.includes(allKey);

                      const isManuallySelectingAllSubOptions =
                        value.length === subOptionKeys.length && !value.includes(allKey);

                      let newValue: string[] = [];

                      if (isSelectingAll) {
                        // Case 1: User clicks "all" → select everything
                        newValue = allOptionKeys;
                      } else if (isUnselectingAll) {
                        // Case 2: User unchecks "all" → unselect everything
                        newValue = [];
                      } else if (isManuallySelectingAllSubOptions) {
                        // Case 3: All sub options selected → auto-add "all"
                        newValue = [...subOptionKeys, allKey];
                      } else {
                        // Case 4: Normal toggle → remove "all" if not all selected
                        newValue = value.filter((k) => k !== allKey);
                      }

                      field.onChange(newValue);
                    };

                    return (
                      <Select
                        {...field}
                        multiple
                        fullWidth
                        size="small"
                        value={Array.isArray(field.value) ? field.value : []}
                        onChange={handleSelectChange}
                        displayEmpty
                        renderValue={(selected) =>
                          selected.length === 0
                            ? '0 currently selected'
                            : `${selected.length} currently selected`
                        }
                      >
                        {conditionOptions.map((option) => (
                          <MenuItem key={option.key} value={option.key}>
                            <Box
                              sx={{
                                ml: option.key == 'all' ? 0 : 2,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <Checkbox
                                checked={
                                  field.value.length == 2 || field.value.includes(option.key)
                                }
                              />
                              <ListItemText primary={option.label} />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    );
                  }}
                />
              </Box>
            ))}
          </DialogContent>

          <Divider />

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCancel} variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button onClick={() => handleApply(watch())} variant="contained">
              Apply
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
