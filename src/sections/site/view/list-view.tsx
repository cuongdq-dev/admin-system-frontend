import {
  CardContent,
  CardHeader,
  DialogTitle,
  IconButton,
  IconButtonProps,
  styled,
  useMediaQuery,
} from '@mui/material';
import Card from '@mui/material/Card';
import { t } from 'i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HttpMethod } from 'src/api-core';
import { PATH_SITE } from 'src/api-core/path';
import { IconButtonDelete } from 'src/components/button';
import { PopupFormTable } from 'src/components/form/form-table';
import { Iconify } from 'src/components/iconify';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';
import { SiteForm } from '../components/form-table';
import { fRelativeTime } from 'src/utils/format-time';
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

  const isMobile = useMediaQuery('(max-width:600px)');
  const { deleteItem } = usePageStore.getState();

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
      <TableComponent
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

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));
