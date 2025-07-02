import { t } from 'i18next';
import { PATH_USER_LIST } from 'src/api-core/path';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';

export function ListView() {
  const storeName = StoreName.BATCH_LOGS;

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
  };

  const HeadLabel: HeadLabelProps[] = [
    {
      id: 'name',
      label: t(LanguageKey.user.nameItem),
      sort: false,
      type: 'text',
      width: '20%',
    },
    {
      id: 'email',
      label: t(LanguageKey.user.emailItem),
      sort: false,
      type: 'text',
      width: '30%',
    },
    {
      id: 'phoneNumber',
      label: t(LanguageKey.user.phoneItem),
      sort: false,
      type: 'text',
      width: '40%',
    },

    {
      id: 'created_at',
      label: t(LanguageKey.user.createdItem),
      sort: false,
      type: 'datetime',
      width: '10%',
    },
  ];

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/user', title: t(LanguageKey.common.listTitle) }] }}
    >
      <TableComponent
        component="TABLE"
        storeName={storeName}
        url={PATH_USER_LIST}
        indexCol={true}
        selectCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
      />
    </DashboardContent>
  );
}
