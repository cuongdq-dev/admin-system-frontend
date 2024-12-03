import { DialogTitle, useMediaQuery } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { HttpMethod } from 'src/api-core';
import { PATH_SERVER } from 'src/api-core/path';
import { PopupFormTable } from 'src/components/form/form-table';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent } from 'src/components/table';
import { HeadLabelProps } from 'src/components/table/type';
import { LanguageKey } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import * as Yup from 'yup';
import { ServerItem } from '../components/card-item';
import { ServerForm } from '../components/form-table';
type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: IServer;
  action?: HttpMethod;
};

const HeadLabel: HeadLabelProps[] = [
  { id: 'name', label: t(LanguageKey.server.nameItem), sort: true, type: 'text', width: '20%' },
  { id: 'host', label: t(LanguageKey.server.hostItem), sort: true, type: 'text', width: '20%' },
  { id: 'port', label: t(LanguageKey.server.portItem), sort: false, type: 'text', width: '10%' },
  { id: 'user', label: t(LanguageKey.server.userItem), sort: true, type: 'text', width: '10%' },
  {
    id: 'created_at',
    label: t(LanguageKey.server.createdAtItem),
    sort: true,
    type: 'datetime',
    width: '40%',
    align: 'center',
  },
];

const FormTableSchema = {
  name: Yup.string().required('Email is required'),
  host: Yup.string().required('host is required'),
  port: Yup.string().required('port is required'),
  password: Yup.string().required('password is required'),
  user: Yup.string().required('user is required'),
};

export function ListView() {
  const tableKey = 'server_table';
  const [refreshNumber, setRefresh] = useState<number>(0);

  const [formConfig, setFormConfig] = useState<FormConfigState>({
    open: false,
    title: '',
    defaultValues: {},
    action: HttpMethod.PATCH,
  });

  const refreshData = () => {
    setRefresh(refreshNumber + 1);
    handleCloseForm();
  };
  const handleClickOpenForm = (row: Record<string, any>, action: HttpMethod) => {
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

  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <DashboardContent>
      <HeadComponent
        title={t(LanguageKey.server.tableTitle)}
        buttonTitle={t(LanguageKey.server.addNewButton)}
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
        tableKey={tableKey}
        refreshNumber={refreshNumber}
        url={PATH_SERVER}
        indexCol={true}
        selectCol={true}
        refreshData={refreshData}
        handleClickOpenForm={handleClickOpenForm}
        actions={{ editBtn: true, deleteBtn: true, popupEdit: true }}
        headLabel={HeadLabel}
        customCard={({ values }: { values: IServer }) => {
          return (
            <ServerItem
              item={values}
              handleClickOpenForm={handleClickOpenForm}
              refreshData={refreshData}
              baseUrl={PATH_SERVER}
            />
          );
        }}
      />

      <PopupFormTable
        rowId={formConfig.defaultValues?.id}
        open={formConfig.open}
        handleCloseForm={handleCloseForm}
        refreshData={refreshData}
        action={formConfig.action}
        defaultValues={formConfig.defaultValues}
        baseUrl={PATH_SERVER}
        schema={FormTableSchema}
        render={({ isSubmitting }: { isSubmitting: boolean }) => {
          return (
            <>
              <DialogTitle>{formConfig.title}</DialogTitle>
              <ServerForm
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
