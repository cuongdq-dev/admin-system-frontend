import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';

import { t } from 'i18next';
import { PATH_BLOG } from 'src/api-core/path';
import { HeadComponent } from 'src/components/page-head';
import { Scrollbar } from 'src/components/scrollbar';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';
import { BlogFilter } from '../components/blog-filter';
import { PostItem } from '../post-item';

// ----------------------------------------------------------------------

export function ListView() {
  const storeName = StoreName.BLOG;
  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
  };

  return (
    <Scrollbar sx={{ maxHeight: '100%', overflowX: 'hidden' }}>
      <DashboardContent
        breadcrumb={{ items: [{ href: '/blog', title: t(LanguageKey.common.listTitle) }] }}
      >
        <HeadComponent title={t(LanguageKey.blog.tableTitle)} />
        <BlogFilter storeName={storeName} />
        <Grid container spacing={3} mb={2}>
          <TableComponent
            storeName={storeName}
            component={'CARD'}
            url={PATH_BLOG}
            indexCol={true}
            selectCol={true}
            refreshData={refreshData}
            actions={{ editBtn: false, deleteBtn: true, popupEdit: true }}
            headLabel={[]}
            customCard={({ values, index }: { values: Record<string, any>; index: number }) => {
              const latestPostLarge = index === 0;
              const latestPost = index === 1 || index === 2;
              return (
                <Grid
                  key={values?.id}
                  xs={12}
                  sm={latestPostLarge ? 12 : 6}
                  md={latestPostLarge ? 6 : 3}
                >
                  <PostItem
                    post={values as any}
                    latestPost={latestPost}
                    latestPostLarge={latestPostLarge}
                  />
                </Grid>
              );
            }}
          />
        </Grid>
      </DashboardContent>
    </Scrollbar>
  );
}
