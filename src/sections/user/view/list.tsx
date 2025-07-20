import { Chip } from '@mui/material';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { PATH_USER_LIST } from 'src/api-core/path';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName, SubjectConfig } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';

export function ListView() {
  const storeName = StoreName.USER_LIST;
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
      width: '20%',
    },

    {
      id: 'roles',
      label: t(LanguageKey.user.roleItem),
      sort: false,
      type: 'custom',
      align: 'center',
      width: '100%',
      render: ({ row }) => {
        return (
          <>
            {row?.user_roles?.map((ur: IUserRole) => {
              return (
                <Chip
                  sx={{ mx: 0.5 }}
                  color="info"
                  size="small"
                  variant="filled"
                  key={ur.role.id}
                  label={ur.role.name}
                />
              );
            })}
          </>
        );
      },
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
      breadcrumb={{ items: [{ href: '/users', title: t(LanguageKey.common.listTitle) }] }}
    >
      <HeadComponent
        subject={SubjectConfig.USERS}
        title={t(LanguageKey.user.listPageTitle)}
        description={t(LanguageKey.user.listPageDescription)}
        buttonTitle={t(LanguageKey.user.addNewButton)}
        buttonProps={{ color: 'primary' }}
        onClickButton={() => {
          navigate('create');
        }}
      />
      <TableComponent
        component="TABLE"
        subject={SubjectConfig.USERS}
        storeName={storeName}
        url={PATH_USER_LIST}
        indexCol={true}
        selectCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
        actions={{ deleteBtn: true, editBtn: true }}
      />
    </DashboardContent>
  );
}
