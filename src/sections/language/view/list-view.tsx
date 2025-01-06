import { TabContext, TabList } from '@mui/lab';
import { DialogTitle, Tab, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { t } from 'i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HttpMethod } from 'src/api-core';
import { PATH_LANGUAGE } from 'src/api-core/path';
import { PopupFormTable } from 'src/components/form/form-table';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { useAPI } from 'src/hooks/use-api';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import * as Yup from 'yup';
import { useShallow } from 'zustand/react/shallow';
import { LanguageForm } from '../components/form-table';
import { getEmoji, getLanguage } from 'language-flag-colors';

type State = { id: string; code: string; name: string; description: string }[];
type FormConfigState = {
  open: boolean;
  title?: string;
  defaultValues?: ITransition;
  action?: HttpMethod;
};

const HeadLabel: HeadLabelProps[] = [
  { id: 'code', label: t(LanguageKey.language.codeItem), sort: true, type: 'text', width: '50%' },
  {
    id: 'content',
    label: t(LanguageKey.language.contentItem),
    sort: false,
    width: '50%',
    type: 'custom',
    render: ({ row }) => {
      const lang = getLanguage(row?.lang?.code! as string);
      return (
        <Box component="div" display="flex" justifyItems="center">
          <Typography>{getEmoji(lang?.country!)}</Typography>
          <Typography sx={{ marginX: 1 }}>-</Typography>
          {row.content}
        </Box>
      );
    },
  },
];

export function ListView() {
  const storeName = StoreName.LANGUAGE;
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [state, setState] = useState<State>();

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

  useAPI({ baseURL: PATH_LANGUAGE, onSuccess: (res) => setState(res) });

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

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/language', title: t(LanguageKey.common.listTitle) }] }}
    >
      <HeadComponent title={t(LanguageKey.language.tableTitle)} />
      <Card>
        <TabContext value={queryParams.get('lang') || ''}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
            <TabList
              onChange={(_, value) => navigate(value ? '?lang=' + value : '')}
              aria-label="lab API tabs example"
            >
              <Tab label={t(LanguageKey.language.tabAll)} value={''} />
              {state?.map((s) => {
                return <Tab key={s.name + '_' + s.code} label={s.name} value={s.code} />;
              })}
            </TabList>
          </Box>
          <TableComponent
            storeName={storeName}
            url={PATH_LANGUAGE}
            indexCol={true}
            selectCol={true}
            refreshData={refreshData}
            handleClickOpenForm={handleClickOpenForm}
            actions={{ editBtn: false, deleteBtn: true, popupEdit: true }}
            headLabel={HeadLabel}
          />
        </TabContext>
      </Card>

      <PopupFormTable
        storeName={storeName}
        rowId={formConfig.defaultValues?.id}
        open={formConfig.open}
        handleCloseForm={handleCloseForm}
        defaultValues={formConfig.defaultValues}
        action={formConfig.action}
        baseUrl={PATH_LANGUAGE}
        schema={{ content: Yup.string().required('content is required') }}
        render={({ isSubmitting }: { isSubmitting: boolean }) => {
          return (
            <>
              <DialogTitle>{formConfig.title}</DialogTitle>
              <LanguageForm
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
