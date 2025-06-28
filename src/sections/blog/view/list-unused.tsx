import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Link,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { t } from 'i18next';
import { PATH_BLOG_UNUSED } from 'src/api-core/path';
import { IconButtonDelete } from 'src/components/button';
import { GuideList } from 'src/components/guide';
import { Iconify } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { fRelativeTime } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';
import { BlogFilter } from '../components/blog-filter';

export function ListUnusedView() {
  const storeName = StoreName.BLOG_UNUSED;

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
  };

  const HeadLabel: HeadLabelProps[] = [
    {
      id: 'title',
      label: t(LanguageKey.blog.titleItem),
      sort: false,
      type: 'custom',
      render: ({ row }) => {
        return (
          <Link
            target="_blank"
            href={'/blog/' + row?.slug}
            color="inherit"
            variant="subtitle2"
            underline="hover"
            sx={{
              cursor: 'pointer',
              overflow: 'hidden',
              WebkitLineClamp: 1,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {row?.title}
          </Link>
        );
      },
    },
    {
      id: 'status',
      label: t(LanguageKey.blog.publicButton),
      align: 'center',
      sort: false,
      width: '10%%',
      type: 'text',
    },

    {
      id: 'post_source',
      label: 'Source',
      align: 'center',
      sort: false,
      type: 'custom',
      width: '10%%',
      render: ({ row }) => {
        return (
          <Typography variant="inherit" sx={{ textWrap: 'nowrap' }}>
            {row?.article?.source}
          </Typography>
        );
      },
    },

    {
      id: 'created_at',
      label: t(LanguageKey.site.createdAtItem),
      type: 'custom',
      align: 'center',
      sort: true,
      width: '10%%',
      render: ({ row }) => {
        return <Typography sx={{ textWrap: 'nowrap' }}>{fRelativeTime(row.created_at)}</Typography>;
      },
    },
  ];

  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/indexing', title: t(LanguageKey.common.listTitle) }] }}
    >
      <GuideList text={t(LanguageKey.blog.blogUnusedDescription)} />
      <BlogFilter storeName={storeName} />
      <TableComponent
        component={isMobile ? 'CARD' : 'TABLE'}
        storeName={storeName}
        url={PATH_BLOG_UNUSED}
        indexCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
        actions={{ deleteBtn: true }}
        customCard={({ values, updateRowData }) => {
          return (
            <Card sx={{ borderRadius: 4, p: 3, mb: 2, width: '100%' }}>
              <Box
                sx={{
                  mb: 4,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Iconify icon="hugeicons:folder-edit" />
                  <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {values?.status}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'inline-flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Iconify icon="mdi-light:clock"></Iconify>

                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {fRelativeTime(values.created_at)}
                  </Typography>
                </Box>
              </Box>
              <CardMedia
                sx={{ borderRadius: 2, mb: 1 }}
                component="img"
                height="140"
                image={values?.thumbnail?.url}
                alt={values?.thumbnail?.slug}
              />

              <Link variant="body1" color="text.primary">
                <Typography variant="h5" sx={{ mb: 1 }} fontWeight="600">
                  {values.title}
                </Typography>
              </Link>
              <CardContent sx={{ p: 0, mb: 0 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {values?.categories?.map((cate?: { name?: string }) => cate?.name).join(', ')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {values.meta_description}
                </Typography>
              </CardContent>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <Button variant="outlined" color="error" sx={{ height: '35px', p: 0, ml: 1 }}>
                  <IconButtonDelete
                    handleDelete={updateRowData}
                    rowId={values?.id}
                    baseUrl={PATH_BLOG_UNUSED + '/delete/' + values?.id}
                  />
                </Button>
              </Box>
            </Card>
          );
        }}
      />
    </DashboardContent>
  );
}
