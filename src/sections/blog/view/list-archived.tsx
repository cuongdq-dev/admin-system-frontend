import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { PATH_BLOG_ARCHIVED } from 'src/api-core/path';
import { AutocompleteComponent } from 'src/components/autocomplete';
import { IconButtonDelete } from 'src/components/button';
import { GuideList } from 'src/components/guide';
import { Iconify } from 'src/components/iconify';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { IndexStatus } from 'src/sections/google/components/index-status';
import { usePageStore } from 'src/store/page';
import { fDate, formatStr, fRelativeTime } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';

export function ListArchivedView() {
  const navigate = useNavigate();

  const storeName = StoreName.BLOG_ARCHIVED;

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
  };

  const HeadLabel: HeadLabelProps[] = [
    {
      id: 'site_name',
      label: t(LanguageKey.site.nameItem),
      sort: false,
      type: 'custom',
      align: 'center',
      width: '10%',
      render: ({ row }) => {
        const postUrl = `${row.site_domain}/bai-viet/${row.post_slug}`;
        const googleSearchUrl = `https://www.google.com/search?q=site:${postUrl}`;

        return (
          <Box display="flex" flexDirection="column">
            <Typography
              variant="caption"
              sx={{ cursor: 'pointer', textDecoration: 'underline', textWrap: 'nowrap' }}
              onClick={() => window.open(postUrl, '_blank')}
            >
              {row.site_name}
            </Typography>

            <Typography
              variant="caption"
              sx={{ cursor: 'pointer', mt: 1, textWrap: 'nowrap' }}
              onClick={() => window.open(googleSearchUrl, '_blank')}
            >
              Google Search
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'post_title',
      label: t(LanguageKey.site.postTitleItem),
      sort: false,
      type: 'custom',
      render: ({ row }) => {
        return (
          <Link
            href={'/blog/' + row?.post_slug}
            color="inherit"
            variant="subtitle2"
            underline="hover"
            sx={{
              cursor: 'pointer',
              overflow: 'hidden',
              WebkitLineClamp: 2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {row?.post_title}
          </Link>
        );
      },
    },

    {
      id: 'created_at',
      label: t(LanguageKey.site.createdAtItem),
      type: 'custom',
      align: 'center',
      sort: true,
      render: ({ row }) => {
        return (
          <Typography sx={{ textWrap: 'nowrap' }}>
            {fDate(row.created_at, formatStr.dateTime)}
          </Typography>
        );
      },
    },

    {
      id: 'indexStatus',
      label: 'Status',
      type: 'custom',
      align: 'center',
      render: ({ row }) => {
        return <IndexStatus status={row.indexStatus} />;
      },
    },
  ];
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/indexing', title: t(LanguageKey.common.listTitle) }] }}
    >
      <GuideList text={t(LanguageKey.blog.blogArchivedDescription)} />

      <TableComponent
        component={isMobile ? 'CARD' : 'TABLE'}
        storeName={storeName}
        url={PATH_BLOG_ARCHIVED}
        indexCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
        actions={{ deleteBtn: true }}
        customCard={({ values, updateRowData }) => {
          const postUrl = `${values.site_domain}/bai-viet/${values.post_slug}`;
          const googleSearchUrl = `https://www.google.com/search?q=site:${postUrl}`;
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
                  <IndexStatus status={values.indexStatus} />
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
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {values.post_title}
                </Typography>
                <CardMedia
                  sx={{ borderRadius: 3 }}
                  component="img"
                  height="140"
                  image={values?.thumbnail?.url}
                  alt={values?.thumbnail?.slug}
                />
              </Box>
              <CardContent sx={{ p: 0, mb: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                  {values?.categories?.map((cate?: { name?: string }) => cate?.name).join(', ')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {values.post_meta_description}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Grid display="flex" flexDirection="row">
                  <Link
                    href={postUrl}
                    underline="always"
                    variant="body1"
                    color="text.primary"
                    sx={{ fontWeight: 'bold', mr: 1 }}
                  >
                    {values.site_name}
                  </Link>
                  |
                  <Link
                    href={googleSearchUrl}
                    underline="always"
                    variant="body1"
                    color="text.primary"
                    sx={{ fontWeight: 'bold', ml: 1 }}
                  >
                    G-Search
                  </Link>
                </Grid>
                <IconButton aria-label="delete">
                  <IconButtonDelete
                    handleDelete={updateRowData}
                    rowId={values?.id}
                    baseUrl={PATH_BLOG_ARCHIVED + '/delete/' + values?.id}
                  />
                </IconButton>
              </Box>
            </Card>
          );
        }}
      />
    </DashboardContent>
  );
}
