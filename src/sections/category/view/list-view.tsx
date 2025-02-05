import {
  Box,
  CardContent,
  Chip,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Card from '@mui/material/Card';
import { t } from 'i18next';
import { useState } from 'react';
import { HttpMethod } from 'src/api-core';
import { PATH_CATEGORY } from 'src/api-core/path';
import { IconButtonDelete } from 'src/components/button';
import { PopupFormTable } from 'src/components/form/form-table';
import { Iconify } from 'src/components/iconify';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';
import { CategoryForm } from '../components/form-table';

type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: IPostCategory;
  action?: HttpMethod;
};

export function ListView() {
  const storeName = StoreName.CATEGORY;

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const [formConfig, setFormConfig] = useState<FormConfigState>({
    open: false,
    title: '',
    defaultValues: {},
    action: HttpMethod.PATCH,
  });

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
    handleCloseForm();
  };

  const handleClickOpenForm = (row: ITransition, action: HttpMethod) => {
    setFormConfig((s) => ({
      ...s,
      open: true,
      title: t(LanguageKey.form.updateLabel),
      defaultValues: row,
      action,
    }));
  };

  const handleCloseForm = () => {
    setFormConfig({ open: false, title: '' });
  };

  const HeadLabel: HeadLabelProps[] = [
    {
      id: 'name',
      label: t(LanguageKey.category.nameItem),
      sort: false,
      type: 'text',
      width: '60%',
    },
    {
      id: 'description',
      label: t(LanguageKey.category.descriptionItem),
      sort: false,
      type: 'text',
      width: '20%',
    },
    {
      id: 'posts',
      label: t(LanguageKey.category.postsItem),
      type: 'custom',
      align: 'center',
      render: ({ row }) => <>{row?.posts?.length || 0}</>,
      width: '10%',
    },

    {
      id: 'sites',
      label: t(LanguageKey.category.sitesItem),
      type: 'custom',
      align: 'center',
      render: ({ row }) => <>{row?.sites?.length || 0}</>,
      width: '10%',
    },
  ];

  const { deleteItem } = usePageStore.getState();

  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/category', title: t(LanguageKey.common.listTitle) }] }}
    >
      <HeadComponent
        title={t(LanguageKey.category.listPageTitle)}
        buttonTitle={t(LanguageKey.category.addNewButton)}
        onClickButton={() =>
          setFormConfig({
            open: true,
            title: t(LanguageKey.form.createLabel),
            action: HttpMethod.POST,
          })
        }
      />
      <TableComponent
        component={isMobile ? 'CARD' : 'TABLE'}
        storeName={storeName}
        url={PATH_CATEGORY}
        indexCol={true}
        selectCol={true}
        refreshData={refreshData}
        handleClickOpenForm={handleClickOpenForm}
        actions={{ editBtn: false, deleteBtn: true, popupEdit: true }}
        headLabel={HeadLabel}
        customCard={({ values, index }: { values: IPostCategory; index: number }) => {
          return (
            <Card key={values.id} sx={{ width: '100%', mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      textWrap: 'nowrap',
                    }}
                    fontWeight="bold"
                  >
                    {values?.name}
                  </Typography>
                  <Box display="flex" flexDirection="row">
                    <IconButton onClick={() => handleClickOpenForm(values, HttpMethod.PATCH)}>
                      <Iconify icon="material-symbols:edit-outline" />
                    </IconButton>

                    <IconButtonDelete
                      handleDelete={() => {
                        deleteItem(storeName, values?.id, index);
                      }}
                      rowId={values?.id}
                      baseUrl={'category/delete/' + values?.id}
                    />
                  </Box>
                </Box>

                <Typography variant="caption" color="inherit" mb={1}>
                  {values.description || 'No description provided'}
                </Typography>
                <Box display="flex" mt={2} gap={1} flexWrap="wrap">
                  <Chip
                    label={`Posts: ${values?.posts?.length || 0}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`Sites: ${values?.sites?.length || 0}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          );
        }}
      />

      <PopupFormTable
        storeName={storeName}
        rowId={formConfig.defaultValues?.id}
        open={formConfig.open}
        handleCloseForm={handleCloseForm}
        defaultValues={formConfig.defaultValues}
        action={formConfig.action}
        baseUrl={PATH_CATEGORY}
        render={({ isSubmitting }: { isSubmitting: boolean }) => {
          return (
            <>
              <DialogTitle>{formConfig.title}</DialogTitle>
              <CategoryForm
                defaultValues={formConfig.defaultValues}
                action={formConfig.action}
                handleCloseForm={handleCloseForm}
                isSubmitting={isSubmitting}
              />
            </>
          );
        }}
      />
    </DashboardContent>
  );
}
