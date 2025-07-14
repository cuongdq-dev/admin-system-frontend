import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CircularProgress,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SITE } from 'src/api-core/path';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { PageLoading } from 'src/components/loading';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName, SubjectConfig } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { PostItem } from 'src/sections/blog/post-item';
import { useNotifyStore } from 'src/store/notify';
import { usePageStore } from 'src/store/page';
import * as Yup from 'yup';
import { useShallow } from 'zustand/react/shallow';
import { Categories } from '../components/categories';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function DetailView() {
  const { setNotify } = useNotifyStore.getState();
  const storeName = StoreName.SITE;
  const { id } = useParams();
  const [selectCategory, setCategory] = useState<
    IPostCategory | { id: 'all'; slug: 'all'; name: 'All Post' }
  >({ slug: 'all', name: 'All Post' });
  const { setDetail, setLoadingDetail, setFetchingList, setLoadingList } = usePageStore();
  const { data, isLoading = true } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  ) as { data?: ISite; refreshNumber?: number; isLoading?: boolean };

  const fetchDetail = () => {
    invokeRequest({
      method: HttpMethod.GET,
      baseURL: PATH_SITE + '/' + id,
      onSuccess: (res) => {
        setDetail(storeName, { data: res, isFetching: false, isLoading: false });
      },
      onHandleError: (error) => {
        setLoadingDetail(storeName, false);
      },
    });
  };

  useEffect(() => {
    id && fetchDetail();
  }, [id]);

  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md')); // Check if screen size is small

  const DetailSchema = Yup.object().shape({
    name: Yup.string().optional(),
    email: Yup.string().email(),
  });

  const methods = useForm({
    resolver: yupResolver(DetailSchema),
    defaultValues: data,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = async (values: { name?: string; description?: string }) => {
    setLoadingDetail(storeName, true);
    invokeRequest({
      method: HttpMethod.PATCH,
      baseURL: PATH_SITE + '/update/' + data?.id,
      params: values,
      onHandleError() {
        setTimeout(() => {
          setLoadingDetail(storeName, false);
        }, 1000);
      },
      onSuccess(res) {
        setTimeout(() => {
          reset();
          setLoadingDetail(storeName, false);
          setDetail(storeName, { data: res, isFetching: false, isLoading: false });
          setNotify({
            title: t(LanguageKey.notify.successUpdate),
            key: 'update' + data?.id,
            options: { variant: 'success', key: 'update' + data?.id },
          });
        }, 1000);
      },
    });
  };

  return (
    <Scrollbar sx={{ height: '100%', overflowX: 'hidden' }}>
      <DashboardContent
        breadcrumb={{ items: [{ href: '/blog', title: t(LanguageKey.common.detailTitle) }] }}
      >
        <PageLoading isLoading={isLoading} />
        <Grid container spacing={3}>
          <Grid key={data?.id} xs={12} sm={12} md={4}>
            <Card sx={{ position: 'sticky', top: '0' }}>
              <Box
                sx={(theme) => {
                  return {
                    p: theme.spacing(2, 2, 2, 2),
                    maxHeight: isSmallScreen ? 'none' : 'calc(100vh - 100px)',
                    overflow: isSmallScreen ? 'visible' : 'auto',
                  };
                }}
              >
                <Card
                  sx={(theme) => {
                    return {
                      mt: 2,
                      boxShadow: 'none',
                      border: `1px solid ${theme.vars.palette.divider}`,
                    };
                  }}
                >
                  <Categories
                    selected={selectCategory}
                    handleClick={(category: IPostCategory) => {
                      setCategory(category);
                      setFetchingList(StoreName.SITE_BLOG, true);
                      setLoadingList(StoreName.SITE_BLOG, true);
                    }}
                  />
                </Card>

                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                  <RHFTextField
                    name="name"
                    margin="normal"
                    label={t(LanguageKey.site.nameItem)}
                    defaultValue={data?.name}
                  />

                  <RHFTextField
                    name="domain"
                    margin="normal"
                    label={t(LanguageKey.site.domainItem)}
                    defaultValue={data?.domain}
                  />

                  <RHFTextField
                    name="description"
                    margin="normal"
                    multiline
                    maxRows={10}
                    label={t(LanguageKey.site.descriptionItem)}
                    defaultValue={data?.description || ''}
                  />
                  <RHFCheckbox
                    name="autoPost"
                    control={<></>}
                    label={t(LanguageKey.site.autoPostItem)}
                    defaultChecked={data?.autoPost}
                  />

                  <LoadingButton
                    type="submit"
                    variant={isDirty ? 'contained' : 'outlined'}
                    fullWidth
                    sx={{ mt: 1, mb: 2 }}
                    loading={isSubmitting}
                    disabled={!isDirty}
                  >
                    {t(LanguageKey.button.update)}
                  </LoadingButton>

                  <RHFTextField
                    multiline
                    disabled
                    defaultValue={data?.token}
                    margin="normal"
                    id="token"
                    name="token"
                    label="API Token"
                    type="text"
                    fullWidth
                    variant="outlined"
                    copy
                  />
                </FormProvider>

                {/* <TelegramTokenInput
                  siteId={id}
                  defaultToken={data?.teleToken!}
                  defaultValues={{
                    botId: data?.teleChatId,
                    botName: data?.teleChatName,
                    botUsername: data?.teleBotName,
                    chatId: data?.teleChatId,
                  }}
                /> */}
              </Box>
            </Card>
          </Grid>
          <Grid xs={12} sm={12} md={8} sx={{ position: 'relative' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                mb: 2,
                alignItems: 'center',
              }}
            >
              <Typography variant="h4">{selectCategory.name}</Typography>
              {selectCategory.id != 'all' && (
                <Typography
                  onClick={() => {
                    setCategory({ id: 'all', slug: 'all', name: 'All Post' });
                    setFetchingList(StoreName.SITE_BLOG, true);
                    setLoadingList(StoreName.SITE_BLOG, true);
                  }}
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                  variant="caption"
                >
                  View All
                </Typography>
              )}
            </Box>
            <Grid container spacing={3}>
              <TableComponent
                subject={SubjectConfig.SITES}
                updateUrlEnabled={false}
                storeName={StoreName.SITE_BLOG}
                component={'CARD'}
                url={`${PATH_SITE}/${id}/${selectCategory.slug || selectCategory.id}/posts`}
                headLabel={[]}
                customCard={({ values }: { values: Record<string, any>; index: number }) => {
                  return (
                    <Grid key={values?.id} xs={12} sm={4} md={4}>
                      <PostItem
                        post={values as any}
                        latestPost={false}
                        latestPostLarge={false}
                        siteId={id}
                      />
                    </Grid>
                  );
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </DashboardContent>
    </Scrollbar>
  );
}

// const TelegramTokenInput = ({
//   defaultValues,
//   defaultToken,
//   siteId,
// }: {
//   siteId?: string;
//   defaultToken?: string;
//   defaultValues: { chatId?: string; botName?: string; botUsername?: string; botId?: string };
// }) => {
//   const [token, setToken] = useState(defaultToken);
//   const [botInfo, setBotInfo] = useState<{
//     chatId?: string;
//     botName?: string;
//     botUsername?: string;
//     botId?: string;
//   } | null>(defaultValues);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setToken(defaultToken);
//     setBotInfo(defaultValues);
//   }, [defaultToken, defaultValues]);

//   const handleBlur = () => {
//     if (!token) return;

//     setLoading(true);
//     setError(null);
//     setBotInfo(null);

//     invokeRequest({
//       baseURL: PATH_SITE + '/telegram/' + siteId,
//       method: HttpMethod.POST,
//       params: { token: token },
//       onSuccess: (res) => {
//         setBotInfo(res);
//         setLoading(false);
//       },
//       onHandleError: (err) => {
//         setLoading(false);
//         setBotInfo(null);
//         setError((err as Error).message);
//       },
//     });
//   };

//   return (
//     <Box>
//       <Box display={'flex'} gap={2}>
//         <TextField
//           label={t(LanguageKey.site.tokenItem)}
//           variant="outlined"
//           fullWidth
//           disabled={loading}
//           margin="dense"
//           value={token}
//           onChange={(e) => setToken(e.target.value)}
//           onBlur={handleBlur}
//           error={!!error}
//           helperText={error || 'Nhập token bot của bạn để kiểm tra và lưu lại'}
//         />

//         {loading && (
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <CircularProgress size={20} />
//           </Box>
//         )}
//       </Box>

//       {botInfo?.chatId && (
//         <Box>
//           <TextField
//             label={t(LanguageKey.site.teleChatName)}
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={botInfo.botName}
//             disabled
//           />
//           <TextField
//             label={t(LanguageKey.site.teleBotName)}
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={botInfo.botUsername}
//             disabled
//           />
//           <TextField
//             label={t(LanguageKey.site.teleChatId)}
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={botInfo.chatId}
//             disabled
//           />
//         </Box>
//       )}
//     </Box>
//   );
// };
