import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import type React from 'react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_USER_ROLES } from 'src/api-core/path';
import { ButtonDelete } from 'src/components/button';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey, StoreName, SubjectConfig } from 'src/constants';
import { usePermissions } from 'src/hooks/use-permissions';
import { useNotifyStore } from 'src/store/notify';
import { usePageStore } from 'src/store/page';
import { useSettingStore } from 'src/store/setting';
import { useShallow } from 'zustand/react/shallow';
import { HeaderType } from '../components/header-type';
import { PermissionSettingsModal } from '../components/setting-modal';

type ActionType = 'read' | 'update' | 'create' | 'delete' | 'publish';

interface RoleFormData {
  name: string;
  description: string;
  permissions: {
    collectionName?: string;
    permissionId?: string;
    action?: ActionType;
    conditions?: { ownerOnly?: boolean; asOwner?: boolean };
  }[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`permissions-tabpanel-${index}`}
      aria-labelledby={`permissions-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export function DetailView() {
  const storeName = StoreName.ROLE_DETAIL;
  const { id } = useParams();
  const navigate = useNavigate();
  const { setDetail, setLoadingDetail } = usePageStore();
  const { setNotify } = useNotifyStore.getState();
  const { hasPermission } = usePermissions();

  // Determine if we're in create or update mode
  const isCreateMode = !id || id === 'create';
  const isUpdateMode = !isCreateMode;

  const canDelete = hasPermission(SubjectConfig.ROLES, 'delete');
  const canUpdate = hasPermission(SubjectConfig.ROLES, isCreateMode ? 'create' : 'update');

  const { data, isLoading = true } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  ) as { data?: IRole; refreshNumber?: number; isLoading?: boolean };

  const collectionPermission = useSettingStore(
    useShallow((state) => state.collectionPermission)
  ) as ICollectionPermission[];

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm<RoleFormData>({
    defaultValues: { name: '', description: '', permissions: [] },
  });

  const watchedValues = watch();
  const fetchRoleDetail = () => {
    if (isCreateMode) return;

    invokeRequest({
      method: HttpMethod.GET,
      baseURL: PATH_USER_ROLES + '/' + id,
      onSuccess: (res: IRole) => {
        setDetail(storeName, { data: res, isFetching: false, isLoading: false });
        reset({
          name: res.name || '',
          description: res.description || '',
          permissions: res?.role_permissions?.map((rp: IRolePermission) => {
            return {
              permissionId: rp?.permission?.id,
              action: rp?.permission?.action,
              collectionName: rp?.permission?.subject,
              conditions: rp?.conditions,
            };
          }),
        });
      },
      onHandleError: (error) => {
        setLoadingDetail(storeName, false);
      },
    });
  };

  useEffect(() => {
    if (collectionPermission) {
      if (isUpdateMode) {
        fetchRoleDetail();
      } else {
        // Create mode - initialize with empty form
        reset({
          name: '',
          description: '',
          permissions: [],
        });
        setDetail(storeName, { data: undefined, isFetching: false, isLoading: false });
      }
    }
  }, [id, collectionPermission]);
  const handlePermissionToggle = (collectionName: string, permissionId: string) => {
    const currentPermissions = [...watchedValues.permissions];

    const permission = currentPermissions.find(
      (p) => p.collectionName === collectionName && p.permissionId === permissionId
    );

    if (!!permission) {
      setValue(
        'permissions',
        currentPermissions.filter((cp) => cp.permissionId != permission.permissionId),
        { shouldDirty: true }
      );
    } else {
      const collectionDefault = collectionPermission.find((c) => c.name == collectionName);
      const permissionDefault = collectionDefault?.permissions?.find((p) => p.id == permissionId);
      setValue(
        'permissions',
        [
          ...currentPermissions,
          {
            // enabled: true,
            collectionName: collectionName,
            action: permissionDefault?.action,
            permissionId: permissionDefault?.id!,
          },
        ],
        {
          shouldDirty: true,
        }
      );
    }
  };

  // Handle column header click to toggle all permissions for an action
  const handleColumnHeaderClick = (action: ActionType) => {
    let currentPermissions = [...watchedValues.permissions];

    // Get all collections that have this action
    const collectionsWithAction = collectionPermission.filter((collection) =>
      collection.permissions?.some((p) => p.action === action)
    );

    // Check if all permissions for this action are currently enabled
    const allEnabled = collectionsWithAction.every((collection) => {
      const permission = collection.permissions?.find((p) => p.action === action);
      return permission && currentPermissions.some((cp) => cp.permissionId === permission.id);
    });

    if (allEnabled) {
      // Remove all permissions for this action
      collectionsWithAction.forEach((collection) => {
        const permission = collection.permissions?.find((p) => p.action === action);
        if (permission) {
          currentPermissions = currentPermissions.filter((cp) => cp.permissionId !== permission.id);
        }
      });
    } else {
      // Add all missing permissions for this action
      collectionsWithAction.forEach((collection) => {
        const permission = collection.permissions?.find((p) => p.action === action);
        if (permission && !currentPermissions.some((cp) => cp.permissionId === permission.id)) {
          currentPermissions.push({
            // enabled: true,
            collectionName: collection.name || '',
            action: permission.action,
            permissionId: permission.id,
          });
        }
      });
    }

    setValue('permissions', currentPermissions, { shouldDirty: true });
  };

  // Handle row header click to toggle all permissions for a collection
  const handleRowHeaderClick = (collectionName: string) => {
    let currentPermissions = [...watchedValues.permissions];

    // Get all permissions for this collection
    const collection = collectionPermission.find((c) => c.name === collectionName);
    if (!collection?.permissions) return;

    // Check if all permissions for this collection are currently enabled
    const allEnabled = collection.permissions.every((permission) =>
      currentPermissions.some((cp) => cp.permissionId === permission.id)
    );

    if (allEnabled) {
      // Remove all permissions for this collection
      collection.permissions.forEach((permission) => {
        currentPermissions = currentPermissions.filter((cp) => cp.permissionId !== permission.id);
      });
    } else {
      // Add all missing permissions for this collection
      collection.permissions.forEach((permission) => {
        if (!currentPermissions.some((cp) => cp.permissionId === permission.id)) {
          currentPermissions.push({
            // enabled: true,
            collectionName: collectionName,
            action: permission.action,
            permissionId: permission.id,
          });
        }
      });
    }

    setValue('permissions', currentPermissions, { shouldDirty: true });
  };

  // Check if all permissions for an action are enabled
  const areAllActionPermissionsEnabled = (action: ActionType): boolean => {
    const collectionsWithAction = collectionPermission.filter((collection) =>
      collection.permissions?.some((p) => p.action === action)
    );

    return collectionsWithAction.every((collection) => {
      const permission = collection.permissions?.find((p) => p.action === action);
      return (
        permission && watchedValues?.permissions?.some((cp) => cp?.permissionId === permission?.id)
      );
    });
  };

  // Check if some permissions for an action are enabled
  const areSomeActionPermissionsEnabled = (action: ActionType): boolean => {
    const collectionsWithAction = collectionPermission.filter((collection) =>
      collection.permissions?.some((p) => p.action === action)
    );

    return collectionsWithAction.some((collection) => {
      const permission = collection?.permissions?.find((p) => p.action === action);
      return (
        permission && watchedValues?.permissions?.some((cp) => cp?.permissionId === permission?.id)
      );
    });
  };

  // Check if all permissions for a collection are enabled
  const areAllCollectionPermissionsEnabled = (collectionName: string): boolean => {
    const collection = collectionPermission.find((c) => c.name === collectionName);
    if (!collection?.permissions) return false;

    return collection.permissions.every((permission) =>
      watchedValues?.permissions?.some((cp) => cp?.permissionId === permission?.id)
    );
  };

  // Check if some permissions for a collection are enabled
  const areSomeCollectionPermissionsEnabled = (collectionName: string): boolean => {
    const collection = collectionPermission.find((c) => c.name === collectionName);
    if (!collection?.permissions) return false;

    return collection.permissions.some((permission) =>
      watchedValues?.permissions?.some((cp) => cp?.permissionId === permission?.id)
    );
  };

  // Get permission state for display
  const getPermissionState = (collectionName: string, permissionId: string): boolean => {
    const permission = watchedValues?.permissions?.find(
      (p) => p?.collectionName === collectionName && p?.permissionId === permissionId
    );

    return !!permission || false;
  };

  // Check if collection has specific action
  const hasAction = (collectionName: string, action: string): boolean => {
    const collection = collectionPermission?.find((c) => c.name === collectionName);
    return collection?.permissions?.some((p) => p.action === action) || false;
  };

  // Form submission
  const onSubmit = async (formData: RoleFormData) => {
    try {
      const method = isCreateMode ? HttpMethod.POST : HttpMethod.PATCH;
      const url = isCreateMode ? PATH_USER_ROLES + '/create' : PATH_USER_ROLES + '/update/' + id;

      await invokeRequest({
        method,
        baseURL: url,
        params: formData,
        onSuccess: (res: IRole) => {
          if (isCreateMode) {
            setNotify({
              title: t(LanguageKey.notify.successUpdate),
              options: { variant: 'success' },
            });
            navigate('/roles/' + res.id); // Navigate to edit mode after creation
          } else {
            setDetail(storeName, { data: res, isFetching: false, isLoading: false });
            reset({
              name: res.name || '',
              description: res.description || '',
              permissions: res?.role_permissions?.map((rp: IRolePermission) => {
                return {
                  permissionId: rp?.permission?.id,
                  action: rp?.permission?.action,
                  collectionName: rp?.permission?.subject,
                  conditions: rp?.conditions,
                };
              }),
            });
            setNotify({
              title: t(LanguageKey.notify.successUpdate),
              options: { variant: 'success' },
            });
          }
        },
      });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  // Handle discard changes
  const handleDiscardChanges = () => {
    if (isCreateMode) {
      navigate('/roles');
    } else {
      reset();
    }
  };

  // Handle delete role (only in update mode)
  const handleDeleteRole = () => {
    invokeRequest({
      method: HttpMethod.DELETE,
      baseURL: PATH_USER_ROLES + '/delete/' + id,
      onSuccess: () => {
        navigate('/roles');
        setNotify({
          title: t(LanguageKey.notify.successDelete),
          options: { variant: 'success' },
        });
      },
    });
  };

  if ((isUpdateMode && isLoading) || !collectionPermission) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const headerRow = ['read', 'create', 'update', 'delete', 'publish'] as ActionType[];

  return (
    <Scrollbar sx={{ maxHeight: '100%', overflowX: 'hidden' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {isCreateMode
                  ? t(LanguageKey.role.createPagetitle)
                  : t(LanguageKey.role.detailPagetitle)}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {isCreateMode
                  ? t(LanguageKey.role.createPageDescription)
                  : t(LanguageKey.role.detailPageDescription)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignSelf: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleDiscardChanges}
                disabled={!canUpdate || (!isDirty && isUpdateMode) || isSubmitting}
                startIcon={<CloseIcon />}
                type="button"
              >
                {isCreateMode ? t(LanguageKey.button.cancel) : t(LanguageKey.button.discard)}
              </Button>
              <Button
                variant="contained"
                disabled={!canUpdate || (!isDirty && isUpdateMode) || isSubmitting}
                sx={{
                  cursor:
                    !canUpdate || (!isDirty && isUpdateMode) || isSubmitting ? 'no-drop' : 'unset',
                }}
                startIcon={<SaveIcon />}
                type="submit"
              >
                {isSubmitting
                  ? isCreateMode
                    ? 'Creating...'
                    : 'Saving...'
                  : isCreateMode
                    ? t(LanguageKey.button.create)
                    : t(LanguageKey.button.save)}
              </Button>
              {isUpdateMode && data?.type !== 'system' && (
                <ButtonDelete
                  startIcon={<DeleteIcon />}
                  variant="contained"
                  color="error"
                  withLoading
                  title={t(LanguageKey.button.delete)}
                  disabled={!canDelete || isSubmitting}
                  sx={{ cursor: !canDelete || isSubmitting ? 'no-drop' : 'unset' }}
                  type="button"
                  handleDelete={handleDeleteRole}
                />
              )}
            </Box>
          </Box>

          {/* Role Information Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography variant="h6" component="h2">
                  {isCreateMode ? 'New Role' : data?.name || watchedValues.name}
                </Typography>
                {isUpdateMode && (
                  <Chip
                    label={`${data?.user_roles?.length} users with this role`}
                    variant="outlined"
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {isCreateMode
                  ? 'Define the rights for the new role'
                  : data?.description || watchedValues.description}
              </Typography>

              <Box
                sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    {t(LanguageKey.role.nameItem)}
                  </Typography>
                  <Controller
                    name="name"
                    disabled={!canUpdate}
                    control={control}
                    rules={{ required: 'Name is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        size="small"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        placeholder="Enter role name"
                      />
                    )}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    {t(LanguageKey.role.descriptionItem)}
                  </Typography>
                  <Controller
                    disabled={!canUpdate}
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        size="small"
                        placeholder="Enter role description"
                      />
                    )}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Permissions Section */}
          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={0} aria-label="permissions tabs">
                  <Tab
                    icon={<FolderIcon />}
                    label={t(LanguageKey.role.collectionType)}
                    iconPosition="start"
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  />
                </Tabs>
              </Box>

              <TabPanel value={0} index={0}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, width: '200px' }}>
                          {t(LanguageKey.role.collectionType)}
                        </TableCell>
                        {headerRow.map((action) => {
                          const checked = areAllActionPermissionsEnabled(action);
                          const indeterminate = !checked && areSomeActionPermissionsEnabled(action);
                          return (
                            <TableCell key={action} align="center" sx={{ fontWeight: 600 }}>
                              <HeaderType
                                disabled={!canUpdate}
                                action={action}
                                handleClick={() => handleColumnHeaderClick(action)}
                                checked={checked}
                                indeterminate={indeterminate}
                              />
                            </TableCell>
                          );
                        })}

                        <TableCell
                          key={'setting-modal'}
                          align="center"
                          sx={{ fontWeight: 600 }}
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {collectionPermission.map((collection) => (
                        <TableRow
                          key={collection.name}
                          hover
                          sx={{
                            '& .setting-button': {
                              opacity: 0,
                              transition: 'opacity 0.2s ease-in-out',
                            },
                            '&:hover .setting-button': { opacity: 1 },
                          }}
                        >
                          <TableCell sx={{ cursor: 'pointer', userSelect: 'none' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Checkbox
                                checked={areAllCollectionPermissionsEnabled(collection.name || '')}
                                indeterminate={
                                  !areAllCollectionPermissionsEnabled(collection.name || '') &&
                                  areSomeCollectionPermissionsEnabled(collection.name || '')
                                }
                                size="small"
                                sx={{ p: 0.5 }}
                                disabled={!canUpdate}
                                onClick={() => handleRowHeaderClick(collection.name || '')}
                              />
                              <FolderIcon sx={{ color: '#3f51b5', fontSize: 20 }} />
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {collection?.name?.toUpperCase()}
                              </Typography>
                            </Box>
                          </TableCell>

                          {headerRow?.map((action) => {
                            const cl_per = collection.permissions?.find(
                              (cp) => cp.action == action
                            );

                            const permissionsValues = watch('permissions').find(
                              (p) => p.permissionId == cl_per?.id
                            );

                            return (
                              <TableCell key={`${collection.name}-${action}`} align="center">
                                {hasAction(collection.name || '', action) ? (
                                  <Box
                                    position="relative"
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="center"
                                    justifyItems="center"
                                    justifySelf="center"
                                  >
                                    {Number(
                                      Object.keys(permissionsValues?.conditions || {}).length
                                    ) > 0 && (
                                      <Box
                                        sx={(theme) => {
                                          return {
                                            width: 7,
                                            height: 7,
                                            borderRadius: 10,
                                            backgroundColor: 'red',
                                            position: 'absolute',
                                            left: 3,
                                            top: 3,
                                          };
                                        }}
                                      />
                                    )}

                                    <Checkbox
                                      disabled={!canUpdate}
                                      checked={getPermissionState(
                                        collection.name || '',
                                        cl_per?.id!
                                      )}
                                      onChange={() => {
                                        handlePermissionToggle(collection.name || '', cl_per?.id!);
                                      }}
                                      size="medium"
                                    />
                                  </Box>
                                ) : (
                                  <Box sx={{ width: 24, height: 24 }} />
                                )}
                              </TableCell>
                            );
                          })}

                          <TableCell
                            key={`${collection.name}-setting`}
                            align="center"
                            sx={{ cursor: 'pointer', position: 'relative' }}
                          >
                            <Box className="setting-button">
                              <PermissionSettingsModal
                                onApply={(newConditions) => {
                                  const currentPermissions = watch('permissions');
                                  const updatedPermissions = currentPermissions.map(
                                    (permission) => {
                                      // Chỉ cập nhật nếu điều kiện thuộc cùng collection
                                      if (permission.collectionName === collection.name) {
                                        const matched = newConditions?.find(
                                          (c) => c.permissionId === permission.permissionId
                                        );
                                        if (matched) {
                                          return {
                                            ...permission,
                                            conditions: matched.conditions, // Cập nhật điều kiện mới
                                          };
                                        }
                                      }
                                      return permission; // Giữ nguyên nếu không có thay đổi
                                    }
                                  );
                                  setValue('permissions', updatedPermissions);
                                }}
                                collectionName={collection.name!}
                                currentSettings={watchedValues?.permissions?.filter(
                                  (p) => p.collectionName == collection.name
                                )}
                              />
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </CardContent>
          </Card>
        </form>
      </Container>
    </Scrollbar>
  );
}
