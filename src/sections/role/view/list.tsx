import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { PATH_USER_ROLES } from 'src/api-core/path';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';

export function ListView() {
  const storeName = StoreName.ROLE_LIST;
  const navigate = useNavigate();

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
      label: t(LanguageKey.role.nameItem),
      sort: false,
      type: 'text',
      width: '10%',
    },

    {
      id: 'description',
      label: t(LanguageKey.role.descriptionItem),
      sort: false,
      type: 'text',
      width: '20%',
    },

    {
      id: 'users',
      label: t(LanguageKey.role.userItem),
      sort: false,
      type: 'custom',
      width: '10%',
      render: ({ row }) => {
        return (
          <>
            {row?.user?.length || 0} {t(LanguageKey.role.userItem)}
          </>
        );
      },
    },

    {
      id: 'created_at',
      label: t(LanguageKey.role.createdAtItem),
      sort: false,
      type: 'datetime',
      width: '100%',
    },
  ];

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/role', title: t(LanguageKey.common.listTitle) }] }}
    >
      <HeadComponent
        title={t(LanguageKey.role.listPagetitle)}
        buttonTitle={t(LanguageKey.role.addNewButton)}
        buttonProps={{ color: 'primary' }}
        onClickButton={() => {
          navigate('create');
        }}
      />
      <TableComponent
        component="TABLE"
        storeName={storeName}
        url={PATH_USER_ROLES}
        indexCol={true}
        selectCol={true}
        actions={{ deleteBtn: true, editBtn: true, popupEdit: false }}
        refreshData={refreshData}
        headLabel={HeadLabel}
      />
    </DashboardContent>
  );
}
