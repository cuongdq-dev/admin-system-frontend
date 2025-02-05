import { DialogTitle } from '@mui/material';
import Card from '@mui/material/Card';
import { t } from 'i18next';
import { useState } from 'react';
import { HttpMethod } from 'src/api-core';
import { PATH_SITE } from 'src/api-core/path';
import { PopupFormTable } from 'src/components/form/form-table';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';
import { SiteForm } from '../components/form-table';

type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: ISite;
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
    { id: 'name', label: t(LanguageKey.site.nameItem), sort: false, type: 'text' },
    {
      id: 'domain',
      label: t(LanguageKey.site.domainItem),
      sort: false,
      type: 'text',
      width: '60%',
    },
    {
      id: 'description',
      label: t(LanguageKey.site.descriptionItem),
      sort: false,
      type: 'text',
      width: '10%',
    },
    {
      id: 'posts',
      label: t(LanguageKey.site.postsItem),
      type: 'custom',
      align: 'center',
      render: ({ row }) => {
        return <>{row?.posts?.length}</>;
      },
      width: '10%',
    },
    {
      id: 'categories',
      label: t(LanguageKey.site.categoriesItem),
      type: 'custom',
      align: 'center',
      width: '10%',
      render: ({ row }) => {
        return <>{row?.categories?.length}</>;
      },
    },
  ];

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/site', title: t(LanguageKey.common.listTitle) }] }}
    >
      <HeadComponent
        title={t(LanguageKey.site.listPageTitle)}
        buttonTitle={t(LanguageKey.site.addNewButton)}
        onClickButton={() =>
          setFormConfig({
            open: true,
            title: t(LanguageKey.form.createLabel),
            action: HttpMethod.POST,
          })
        }
      />
      <Card>
        <TableComponent
          storeName={storeName}
          url={PATH_SITE}
          indexCol={true}
          selectCol={true}
          refreshData={refreshData}
          handleClickOpenForm={handleClickOpenForm}
          actions={{ editBtn: false, deleteBtn: true, popupEdit: true }}
          headLabel={HeadLabel}
        />
      </Card>

      <PopupFormTable
        storeName={storeName}
        rowId={formConfig.defaultValues?.id}
        open={formConfig.open}
        handleCloseForm={handleCloseForm}
        defaultValues={formConfig.defaultValues}
        action={formConfig.action}
        baseUrl={PATH_SITE}
        render={({ isSubmitting }: { isSubmitting: boolean }) => {
          return (
            <>
              <DialogTitle>{formConfig.title}</DialogTitle>
              <SiteForm
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
