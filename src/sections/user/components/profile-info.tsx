import { yupResolver } from '@hookform/resolvers/yup';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import UserIcon from '@mui/icons-material/PeopleAlt';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { invokeRequest, HttpMethod } from 'src/api-core';
import { PATH_FIND_ME } from 'src/api-core/path';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { LanguageKey, StoreName } from 'src/constants';
import { usePageStore } from 'src/store/page';
import { GetValuesFormChange } from 'src/utils/validation/form';
import * as Yup from 'yup';
import { useShallow } from 'zustand/react/shallow';

// ----------------------------------------------------------------------

const DetailSchema = Yup.object().shape({
  name: Yup.string().optional(),
  email: Yup.string().optional(),
  address: Yup.string().optional(),
  phoneNumber: Yup.string().optional(),
});

export default function ProfileInfoCard({
  isEdit = false,
  handleClose,
}: {
  isEdit?: boolean;
  handleClose?: () => void;
}) {
  const storeName = StoreName.USER_DETAIL;
  const { setDetail, setLoadingDetail } = usePageStore();
  const { data, isLoading } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  );

  useEffect(() => {
    reset({
      name: data?.name,
      address: data?.address,
      phoneNumber: data?.phoneNumber,
      email: data?.email,
    });
  }, [data]);

  const methods = useForm({
    resolver: yupResolver(DetailSchema),
    defaultValues: {
      name: data?.name,
      address: data?.address,
      phoneNumber: data?.phoneNumber,
      email: data?.email,
    },
  });

  const { handleSubmit, reset } = methods;

  const [isEditingInfo, setIsEditingInfo] = useState(isEdit);

  useEffect(() => {
    setIsEditingInfo(isEdit);
  }, [isEdit]);

  const handleCancelEdit = () => {
    setIsEditingInfo(false);
    handleClose && handleClose();
  };

  const onSubmit = async (values: {
    name?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
  }) => {
    const defaultValues = {
      name: data?.name,
      address: data?.address,
      phoneNumber: data?.phoneNumber,
      email: data?.email,
    };

    const valuesChange = GetValuesFormChange(defaultValues, values);

    if (Object.keys(valuesChange).length == 0) {
      setIsEditingInfo(false);
      handleClose && handleClose();
      return;
    }

    setLoadingDetail(storeName, true);
    invokeRequest({
      method: HttpMethod.PATCH,
      baseURL: PATH_FIND_ME,
      params: valuesChange,
      onHandleError() {
        setTimeout(() => {
          setLoadingDetail(storeName, false);
        }, 1000);
      },
      onSuccess(res: IUser) {
        setTimeout(() => {
          reset({
            name: res?.name || '',
            address: res?.address || '',
            phoneNumber: res?.phoneNumber || '',
            email: res?.email || '',
          });
          setIsEditingInfo(false);
          handleClose && handleClose();
          setLoadingDetail(storeName, false);
          setDetail(storeName, { data: { ...data, ...res }, isFetching: false, isLoading: false });
        }, 1000);
      },
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {t(LanguageKey.user.profileTitle)}
        </Typography>
        {!isEditingInfo ? (
          <IconButton size="small" onClick={() => setIsEditingInfo(true)}>
            <EditIcon fontSize="small" />
          </IconButton>
        ) : null}
      </Box>

      {isEditingInfo ? (
        <Box sx={{ mt: 1 }}>
          <RHFTextField
            fullWidth
            label={t(LanguageKey.user.nameItem)}
            name="name"
            variant="outlined"
            size="small"
            margin="normal"
          />

          <RHFTextField
            fullWidth
            label={t(LanguageKey.user.emailItem)}
            name="email"
            variant="outlined"
            size="small"
            margin="normal"
          />
          <RHFTextField
            fullWidth
            label={t(LanguageKey.user.addressItem)}
            name="address"
            variant="outlined"
            size="small"
            margin="normal"
          />
          <RHFTextField
            fullWidth
            label={t(LanguageKey.user.phoneItem)}
            name="phoneNumber"
            variant="outlined"
            size="small"
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button variant="outlined" color="inherit" onClick={handleCancelEdit}>
              {t(LanguageKey.button.cancel)}
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
              variant="contained"
              aria-label="submit-profile"
            >
              {t(LanguageKey.button.save)}
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <UserIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{data?.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{data?.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{data?.address}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{data?.phoneNumber}</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </FormProvider>
  );
}
