import { DialogTitle, Typography, useMediaQuery } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { HttpMethod } from 'src/api-core';
import { PATH_SITE } from 'src/api-core/path';
import { PopupFormTable } from 'src/components/form/form-table';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName, SubjectConfig } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';
import { SiteForm } from '../components/form-table';
import { SiteItem } from '../components/site-item';

type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: ISite;
  action?: HttpMethod;
};

export function ListView() {
  const storeName = StoreName.SITE;

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
      label: t(LanguageKey.site.nameItem),
      sort: false,
      type: 'text',
      width: '20%',
    },
    {
      id: 'domain',
      label: t(LanguageKey.site.domainItem),
      sort: false,
      type: 'text',
      width: '30%',
    },
    {
      id: 'description',
      label: t(LanguageKey.site.descriptionItem),
      sort: false,
      type: 'text',
      width: '50%',
    },
    {
      id: 'indexing',
      label: t(LanguageKey.site.indexingItem),
      type: 'custom',
      align: 'center',
      width: '10%',
      render: ({ row }) => {
        return (
          <Typography
            sx={{ cursor: 'pointer' }}
            variant="caption"
            onClick={() => {
              window.open(`/google-index?site_id=${row.id}&site_name=${row.name}`);
            }}
          >
            Sitemap
          </Typography>
        );
      },
    },
  ];

  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/site', title: t(LanguageKey.common.listTitle) }] }}
    >
      <HeadComponent
        subject={SubjectConfig.SITES}
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
      <TableComponent
        subject={SubjectConfig.SITES}
        component={isMobile ? 'CARD' : 'TABLE'}
        storeName={storeName}
        url={PATH_SITE}
        indexCol={true}
        selectCol={true}
        refreshData={refreshData}
        handleClickOpenForm={handleClickOpenForm}
        actions={{ editBtn: true, deleteBtn: true, popupEdit: true }}
        headLabel={HeadLabel}
        customCard={({ values, index }: { values: ISite; index: number }) => {
          return (
            <SiteItem
              values={values}
              index={index}
              storeName={storeName}
              handleClickOpenForm={handleClickOpenForm}
            />
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
