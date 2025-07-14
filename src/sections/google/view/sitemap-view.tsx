import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_GOOGLE_SITEMAP_LIST } from 'src/api-core/path';
import { Transition } from 'src/components/dialog';
import { PopupFormTable } from 'src/components/form/form-table';
import { RHFTextField } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { fDate, formatStr, fRelativeTime } from 'src/utils/format-time';
import * as Yup from 'yup';
import { useShallow } from 'zustand/react/shallow';
import { SitemapFilters } from '../components/sitemap-filters';

type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: { id?: string; siteUrl?: string; sitemapUrl?: string };
  action?: HttpMethod;
};

const HeadLabel: HeadLabelProps[] = [
  {
    id: 'path',
    label: 'PATH',
    sort: false,
    type: 'custom',
    render: ({ row }) => {
      return (
        <Box display="flex" flexDirection="column">
          <Typography
            sx={{ cursor: 'pointer', textWrap: 'nowrap' }}
            onClick={() => window.open(row.path, '_blank')}
          >
            {row.path}
          </Typography>
        </Box>
      );
    },
  },
  {
    id: 'lastSubmitted',
    label: 'Submitted',
    sort: false,
    type: 'custom',
    render: ({ row }) => {
      return <Typography>{fDate(row.lastSubmitted, formatStr.split.dateTime)}</Typography>;
    },
  },

  {
    id: 'isSitemapsIndex',
    label: 'Index',
    type: 'custom',
    align: 'center',
    sort: true,
    render: ({ row }) => {
      if (row.isSitemapsIndex) return <Iconify icon="ci:checkbox-checked"></Iconify>;
      return <Iconify icon="ci:checkbox-unchecked"></Iconify>;
    },
  },
  {
    id: 'isPending',
    label: 'Pending',
    type: 'custom',
    align: 'center',
    sort: true,
    render: ({ row }) => {
      if (row.isPending)
        return (
          <Chip
            sx={(theme) => ({ color: theme.vars.palette.Chip.defaultIconColor })}
            size="small"
            variant="outlined"
            label={'Pending'}
            color="warning"
          />
        );
      return (
        <Chip
          sx={(theme) => ({ color: theme.vars.palette.Chip.defaultIconColor })}
          size="small"
          variant="outlined"
          label={'Pass'}
          color="primary"
        />
      );
    },
  },
];

const FormTableSchema = {
  siteUrl: Yup.string().required('Domain is required'),
  sitemapUrl: Yup.string().required('Sitemap XML is required'),
};
export function SiteMapListView() {
  const storeName = StoreName.GOOGLE_SITEMAP;
  new URLSearchParams(location.search).get('site_id')
    ? {
        id: new URLSearchParams(location.search).get('site_id')!,
        title: new URLSearchParams(location.search).get('site_name')!,
      }
    : undefined;

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
  };

  const [formConfig, setFormConfig] = useState<FormConfigState>({
    open: false,
    title: '',
    defaultValues: {},
    action: HttpMethod.POST,
  });

  const handleCloseForm = () => {
    setFormConfig({ open: false, title: '' });
  };

  const ActionLabel: HeadLabelProps[] = [
    {
      id: 'action',
      label: 'Action',
      type: 'custom',
      align: 'center',
      sort: true,
      render: ({ row }) => {
        return (
          <Box display="flex" justifyContent="center">
            <IconButtonConfirm
              icon="iconoir:submit-document"
              btnText="Re-Submit"
              title="Re-submit Sitemap?"
              description={row?.path}
              handleAction={(setOpen) => {
                invokeRequest({
                  baseURL: PATH_GOOGLE_SITEMAP_LIST + '/create',
                  method: HttpMethod.POST,
                  onSuccess: () => {
                    refreshData();
                    setOpen && setOpen(false);
                  },
                  params: { sitemapUrl: row.path, siteUrl: new URL(row.path).origin },
                });
              }}
            />
            <IconButtonConfirm
              btnText="Delete"
              title="Delete Sitemap?"
              icon="mingcute:delete-fill"
              description={row?.path}
              handleAction={(setOpen) => {
                invokeRequest({
                  baseURL: PATH_GOOGLE_SITEMAP_LIST + '/delete',
                  method: HttpMethod.DELETE,
                  onSuccess: () => {
                    refreshData();
                    setOpen && setOpen(false);
                  },
                  params: { sitemapUrl: row.path, siteUrl: new URL(row.path).origin },
                });
              }}
            />
          </Box>
        );
      },
    },
  ];

  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/indexing', title: t(LanguageKey.common.listTitle) }] }}
    >
      <HeadComponent
        subject=""
        title={'Sitemap XML'}
        buttonTitle={t(LanguageKey.button.create)}
        onClickButton={() =>
          setFormConfig({
            open: true,
            title: 'Submit Sitemap XML',
            action: HttpMethod.POST,
          })
        }
      />
      <SitemapFilters storeName={storeName} />
      <TableComponent
        component={isMobile ? 'CARD' : 'TABLE'}
        storeName={storeName}
        url={PATH_GOOGLE_SITEMAP_LIST}
        indexCol={true}
        refreshData={refreshData}
        headLabel={[...HeadLabel, ...ActionLabel]}
        customCard={({ values, index }: { values: Record<string, any>; index: number }) => {
          return (
            <Card sx={{ borderRadius: 4, p: 3, mb: 2, width: '100%' }}>
              <Box
                sx={{
                  mb: 4,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={(theme) => {
                    return {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      backgroundColor: values.isSitemapsIndex
                        ? theme.palette.success.main
                        : theme.palette.warning.main,
                      color: theme.palette.grey.A200,
                    };
                  }}
                >
                  <Iconify icon="hugeicons:folder-edit" />
                  <Typography fontSize={12} ml={1}>
                    {values.isSitemapsIndex ? 'INDEXED' : 'PENDING'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'inline-flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Iconify icon="mdi-light:clock"></Iconify>

                  <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                    {fRelativeTime(values.lastSubmitted, formatStr.date)}
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ p: 0, mb: 0 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {new URL(values?.path).pathname.replace('/', '')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {new URL(values?.path).hostname}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {values.path}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <IconButtonConfirm
                  icon="iconoir:submit-document"
                  btnText="Re-Submit"
                  title="Re-submit Sitemap?"
                  description={values?.path}
                  handleAction={(setOpen) => {
                    invokeRequest({
                      baseURL: PATH_GOOGLE_SITEMAP_LIST + '/create',
                      method: HttpMethod.POST,
                      onSuccess: () => {
                        refreshData();
                        setOpen && setOpen(false);
                      },
                      params: { sitemapUrl: values.path, siteUrl: new URL(values.path).origin },
                    });
                  }}
                />
                <IconButtonConfirm
                  btnText="Delete"
                  title="Delete Sitemap?"
                  icon="mingcute:delete-fill"
                  description={values?.path}
                  handleAction={(setOpen) => {
                    invokeRequest({
                      baseURL: PATH_GOOGLE_SITEMAP_LIST + '/delete',
                      method: HttpMethod.DELETE,
                      onSuccess: () => {
                        refreshData();
                        setOpen && setOpen(false);
                      },
                      params: { sitemapUrl: values.path, siteUrl: new URL(values.path).origin },
                    });
                  }}
                />
              </Box>
            </Card>
          );
        }}
      />

      <PopupFormTable
        storeName={storeName}
        rowId={formConfig?.defaultValues?.id!}
        open={formConfig.open}
        handleCloseForm={handleCloseForm}
        action={formConfig.action}
        defaultValues={formConfig.defaultValues}
        baseUrl={PATH_GOOGLE_SITEMAP_LIST}
        schema={FormTableSchema}
        handleSuccess={() => {
          refreshData();
        }}
        render={({ isSubmitting }: { isSubmitting: boolean }) => {
          return (
            <>
              <DialogTitle>{formConfig.title}</DialogTitle>
              <DialogContent>
                <Box
                  gap={4}
                  paddingTop={1}
                  component={'div'}
                  display={'flex'}
                  flexDirection={'column'}
                >
                  <RHFTextField
                    defaultValue={formConfig?.defaultValues?.siteUrl}
                    id="siteUrl"
                    name="siteUrl"
                    label={'Site URL'}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />

                  <RHFTextField
                    defaultValue={formConfig?.defaultValues?.sitemapUrl}
                    id="sitemapUrl"
                    name="sitemapUrl"
                    label={'Sitemap URL'}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button variant="outlined" color="inherit" onClick={handleCloseForm}>
                  {t(LanguageKey.button.cancel)}
                </Button>

                <LoadingButton
                  type="submit"
                  color="inherit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  {t(LanguageKey.button.create)}
                </LoadingButton>
              </DialogActions>
            </>
          );
        }}
      />
    </DashboardContent>
  );
}

type IconButtonConfirmProps = {
  icon?: string;
  title?: string;
  btnText?: string;
  description?: string;
  handleAction?: (setOpen?: (value: boolean) => void) => void;
};
export const IconButtonConfirm = (props: IconButtonConfirmProps) => {
  const { title = '', btnText, icon, description, handleAction } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <MenuItem
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
        onClick={() => setOpen(true)}
      >
        <Box display="flex">{icon && <Iconify icon={icon} />}</Box>
      </MenuItem>
      <Dialog
        PaperProps={{ sx: { borderRadius: 3 } }}
        TransitionComponent={Transition}
        maxWidth={'sm'}
        open={open}
        fullWidth
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
        <DialogActions style={{ padding: 20 }}>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              handleAction && handleAction(setOpen);
            }}
          >
            {btnText}
          </Button>
          <Button color="inherit" variant="outlined" onClick={() => setOpen(false)} autoFocus>
            {t(LanguageKey.button.cancel)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
