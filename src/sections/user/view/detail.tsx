import { yupResolver } from '@hookform/resolvers/yup';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_USER_LIST } from 'src/api-core/path';
import { ButtonDelete } from 'src/components/button';
import {
  FormProvider,
  PasswordText,
  RHFAutocomplete,
  RHFTextField,
} from 'src/components/hook-form';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey, StoreName } from 'src/constants';
import { useNotifyStore } from 'src/store/notify';
import { usePageStore } from 'src/store/page';
import { useSettingStore } from 'src/store/setting';
import * as Yup from 'yup';
import { useShallow } from 'zustand/react/shallow';

export function DetailView() {
  const storeName = StoreName.USER_DETAIL;
  const { id } = useParams();
  const navigate = useNavigate();
  const { setNotify } = useNotifyStore.getState();

  // Determine if we're in create or update mode
  const isCreateMode = !id || id === 'create';
  const isUpdateMode = !isCreateMode;

  // Detail Store
  const { setDetail, setLoadingDetail } = usePageStore();
  const { data, isLoading = true } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  ) as { data?: IUser; refreshNumber?: number; isLoading?: boolean };

  // Get available roles from settings store
  const availableRoles = useSettingStore(useShallow((state) => state.roles)) as IRole[];

  // Form validation schema
  const DetailSchema = Yup.object().shape({
    name: Yup.string().required('User name required'),
    email: Yup.string().email('Invalid email format').required('Email required'),
    address: Yup.string().optional().nullable(),
    phoneNumber: Yup.string().optional().nullable(),
    password: isCreateMode
      ? Yup.string().min(6, 'Password must be at least 6 characters').required('Password required')
      : Yup.string().min(6, 'Password must be at least 6 characters').optional().nullable(),

    confirmPassword: isCreateMode
      ? Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .required('Please confirm your password')
      : Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .optional()
          .nullable(),

    is_active: Yup.boolean().optional(),
    roles: Yup.array()
      .of(Yup.object().shape({ id: Yup.string() }))
      .min(1, 'At least one role is required')
      .required('Roles are required'),
  });

  const methods = useForm({
    resolver: yupResolver(DetailSchema),
    defaultValues: {
      address: '',
      name: '',
      email: '',
      phoneNumber: '',
      password: undefined,
      confirmPassword: undefined,
      is_active: true,
      roles: undefined,
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty, isSubmitting },
  } = methods;

  // Fetch user detail (only in update mode)
  const fetchUserDetail = () => {
    if (isCreateMode) return;

    invokeRequest({
      method: HttpMethod.GET,
      baseURL: PATH_USER_LIST + '/' + id,
      onSuccess: (res) => {
        setDetail(storeName, { data: res, isFetching: false, isLoading: false });
        reset({
          ...res,
          roles: res?.roles?.map((role: IRole) => {
            return { id: role?.id, title: role?.name };
          }),
        });
      },
      onHandleError: (error) => {
        setLoadingDetail(storeName, false);
        setNotify({
          title: t(LanguageKey.notify.errorInvalidData),
          options: { variant: 'error' },
        });
      },
    });
  };

  useEffect(() => {
    if (isUpdateMode) {
      fetchUserDetail();
    } else {
      // Create mode - initialize with empty form
      reset({
        address: '',
        name: '',
        email: '',
        phoneNumber: '',
        password: undefined,
        confirmPassword: undefined,
        is_active: true,
        roles: [],
      });
      setDetail(storeName, { data: undefined, isFetching: false, isLoading: false });
    }
  }, [id]);

  // Form submission
  const onSubmit = async (formData: Record<string, any>) => {
    try {
      const method = isCreateMode ? HttpMethod.POST : HttpMethod.PATCH;
      const url = isCreateMode ? PATH_USER_LIST + '/create' : PATH_USER_LIST + '/update/' + id;

      // Remove password fields if empty in update mode
      const submitData = { ...formData };
      if (isUpdateMode && !submitData.password) {
        delete submitData.password;
        delete submitData.confirmPassword;
      }

      // Convert roles to IDs for API if needed

      await invokeRequest({
        method,
        baseURL: url,
        params: submitData,
        onSuccess: (res) => {
          if (isCreateMode) {
            setNotify({
              title: t(LanguageKey.notify.successUpdate),
              options: { variant: 'success' },
            });
            navigate('/users/' + res.id); // Navigate to edit mode after creation
          } else {
            setDetail(storeName, { data: res, isFetching: false, isLoading: false });
            reset({
              name: res.name || '',
              email: res.email || '',
              address: res.address || '',
              phoneNumber: res.phoneNumber || '',
              password: undefined,
              confirmPassword: undefined,
              is_active: res.is_active ?? true,
              roles:
                res?.roles?.map((role: IRole) => {
                  return { id: role?.id, title: role?.name };
                }) || [],
            });

            setNotify({
              title: t(LanguageKey.notify.successUpdate),
              options: { variant: 'success' },
            });
          }
        },
        onHandleError: (error) => {
          console.error('Save failed:', error);
          setNotify({
            title: isCreateMode
              ? t(LanguageKey.notify.errorInvalidData)
              : t(LanguageKey.notify.errorInvalidData),
            options: { variant: 'error' },
          });
        },
      });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  // Handle discard changes
  const handleDiscardChanges = () => {
    if (isCreateMode) {
      navigate('/users');
    } else {
      reset({
        name: data?.name || '',
        address: data?.address || '',
        confirmPassword: undefined,
        password: undefined,
        is_active: data?.is_active || false,
        phoneNumber: data?.phoneNumber || '',
        email: data?.email || '',
        roles:
          data?.roles?.map((role) => {
            return { id: role.id, title: role.name };
          }) || undefined,
      });
    }
  };

  // Handle delete user (only in update mode)
  const handleDeleteUser = () => {
    invokeRequest({
      method: HttpMethod.DELETE,
      baseURL: PATH_USER_LIST + '/delete/' + id,
      onSuccess: () => {
        navigate('/users');
        setNotify({
          title: t(LanguageKey.notify.successDelete),
          options: { variant: 'success' },
        });
      },
      onHandleError: (error) => {
        console.error('Delete failed:', error);
        setNotify({
          title: t(LanguageKey.notify.errorInvalidData),
          options: { variant: 'error' },
        });
      },
    });
  };

  // Handle active status change
  const handleActiveStatusChange = (value: boolean) => {
    setValue('is_active', value, { shouldDirty: true });
  };

  if (isUpdateMode && isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Scrollbar sx={{ maxHeight: '100%', overflowX: 'hidden' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {isCreateMode
                    ? t(LanguageKey.user.createPageTitle)
                    : t(LanguageKey.user.detailPageTitle)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isCreateMode
                    ? t(LanguageKey.user.createPageDescription)
                    : t(LanguageKey.user.detailPageDescription)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignSelf: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleDiscardChanges}
                disabled={(!isDirty && isUpdateMode) || isSubmitting}
                startIcon={<CloseIcon />}
                type="button"
              >
                {isCreateMode ? t(LanguageKey.button.cancel) : t(LanguageKey.button.discard)}
              </Button>
              <Button
                variant="contained"
                disabled={(!isDirty && isUpdateMode) || isSubmitting}
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
              {isUpdateMode && (
                <ButtonDelete
                  startIcon={<DeleteIcon />}
                  variant="contained"
                  color="error"
                  withLoading
                  title={t(LanguageKey.button.delete)}
                  disabled={isSubmitting}
                  type="button"
                  handleDelete={handleDeleteUser}
                />
              )}
            </Box>
          </Box>

          {/* User Profile Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                {t(LanguageKey.user.profileTitle)}
              </Typography>

              {/* Avatar Section - Only show in update mode */}
              {isUpdateMode && data && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Avatar src={data?.avatar?.url} sx={{ width: 80, height: 80 }}>
                      <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                  </Badge>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {data?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data?.email}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 3,
                  mb: 3,
                }}
              >
                <Box>
                  <RHFTextField
                    name="name"
                    label={t(LanguageKey.user.nameItem)}
                    placeholder="Enter full name"
                  />
                </Box>
                <Box>
                  <RHFTextField
                    name="email"
                    type="email"
                    label={t(LanguageKey.user.emailItem)}
                    placeholder="Enter email address"
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 3,
                  mb: 3,
                }}
              >
                <Box>
                  <RHFTextField
                    name="phoneNumber"
                    label={t(LanguageKey.user.phoneItem)}
                    placeholder="Enter phone number"
                  />
                </Box>
                <Box>
                  <RHFTextField
                    name="address"
                    label={t(LanguageKey.user.addressItem)}
                    placeholder="Enter address"
                  />
                </Box>
              </Box>

              {/* Password Fields */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 3,
                  mb: 3,
                }}
              >
                <Box>
                  <PasswordText
                    name="password"
                    label={t(LanguageKey.form.passwordItem)}
                    placeholder={
                      isUpdateMode ? 'Leave empty to keep current password' : 'Enter password'
                    }
                    fullWidth
                  />
                </Box>
                <Box>
                  <PasswordText
                    name="confirmPassword"
                    label={t(LanguageKey.form.confirmPasswordItem)}
                    placeholder="Confirm password"
                    fullWidth
                  />
                </Box>
              </Box>

              {/* Active Status */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  {t(LanguageKey.user.activeItem)}
                </Typography>
                <ToggleButtonGroup
                  value={watch('is_active')}
                  exclusive
                  onChange={(event, newValue) => {
                    if (newValue !== null) {
                      handleActiveStatusChange(newValue);
                    }
                  }}
                  aria-label="user active status"
                >
                  <ToggleButton value={false} aria-label="inactive">
                    {t(LanguageKey.common.false)}
                  </ToggleButton>
                  <ToggleButton value={true} aria-label="active">
                    {t(LanguageKey.common.true)}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </CardContent>
          </Card>

          {/* Roles Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                {t(LanguageKey.user.roleDataTitle)}
              </Typography>

              <Box>
                <RHFAutocomplete
                  name="roles"
                  title={t(LanguageKey.user.roleItem)}
                  defaultValue={data?.roles?.map((role) => {
                    return { id: role.id, title: role.name };
                  })}
                  options={
                    availableRoles?.map((role) => ({
                      id: role.id,
                      title: role.name,
                    })) || []
                  }
                  renderInput={(params) => (
                    <TextField {...params} margin="normal" label="Select Roles" />
                  )}
                />
              </Box>

              {isUpdateMode && data && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    {t(LanguageKey.user.associatedData)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${data.posts?.length || 0} Posts`}
                      variant="outlined"
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={`${data.sites?.length || 0} Sites`}
                      variant="outlined"
                      size="small"
                      color="secondary"
                    />
                    <Chip
                      label={`${data.servers?.length || 0} Servers`}
                      variant="outlined"
                      size="small"
                      color="info"
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </FormProvider>
      </Container>
    </Scrollbar>
  );
}
