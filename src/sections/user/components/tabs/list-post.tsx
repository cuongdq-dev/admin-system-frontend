import { Container } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { PATH_USER_LIST_POST } from 'src/api-core/path';
import { TableComponent } from 'src/components/table';
import { StoreName } from 'src/constants';
import { BlogFilter } from 'src/sections/blog/components/blog-filter';
import { PostItem } from 'src/sections/blog/post-item';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';

// ----------------------------------------------------------------------

export default function ListPostTab() {
  const storeName = StoreName.USER_LIST_POST;
  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
  };

  return (
    <Container maxWidth="lg">
      <BlogFilter storeName={storeName} />
      <Grid container spacing={3}>
        <TableComponent
          storeName={storeName}
          component={'CARD'}
          url={PATH_USER_LIST_POST}
          indexCol={true}
          selectCol={true}
          refreshData={refreshData}
          actions={{ editBtn: false, deleteBtn: true, popupEdit: true }}
          headLabel={[]}
          customCard={({ values }) => {
            return (
              <Grid key={values?.id} xs={12} sm={12} md={4}>
                <PostItem post={values as IPost} latestPost={false} latestPostLarge={false} />
              </Grid>
            );
          }}
        />
      </Grid>
    </Container>
  );
}
