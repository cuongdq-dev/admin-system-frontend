import { Link, Typography } from '@mui/material';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { PATH_TRENDINGS_SEARCH } from 'src/api-core/path';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';

export function ListTrendingView() {
  const navigate = useNavigate();

  const storeName = StoreName.BLOG_TRENDING;

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
  };

  const HeadLabel: HeadLabelProps[] = [
    {
      id: 'titleQuery',
      label: t(LanguageKey.blog.titleItem),
      sort: false,
      type: 'text',
    },

    {
      id: 'articleCount',
      label: 'Articles',
      type: 'text',
      align: 'center',
      width: '10%',
    },

    {
      id: 'postCount',
      label: 'Posts',
      type: 'custom',
      align: 'center',
      width: '10%',
      render: ({ row }) => {
        const postCount = row?.articles?.reduce((count: number, articles: any) => {
          return count + (Number(articles?.postCount) || 0);
        }, 0);

        return <>{Number(postCount) || 0}</>;
      },
    },

    {
      id: 'created_at',
      label: t(LanguageKey.site.createdAtItem),
      type: 'datetime',
      align: 'center',
      width: '15%',
    },
  ];

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/indexing', title: t(LanguageKey.common.listTitle) }] }}
    >
      <TableComponent
        component="TABLE"
        storeName={storeName}
        url={PATH_TRENDINGS_SEARCH}
        indexCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
        actions={{ refreshBtn: true }}
        children={{
          name: 'articles',
          children: {
            name: 'posts',
            columns: [
              {
                id: 'title',
                label: 'Title Post',
                sort: false,
                type: 'custom',
                render: ({ row }) => {
                  return (
                    <Link
                      href={'/blog/' + row?.slug}
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
                      {row?.title}
                    </Link>
                  );
                },
              },
              {
                id: 'created_at',
                label: t(LanguageKey.site.createdAtItem),
                type: 'datetime',
                align: 'center',
                width: '15%',
              },
            ],
          },
          columns: [
            {
              id: 'title',
              label: 'Title Article',
              sort: false,
              type: 'text',
            },
            { id: 'source', label: 'Source', sort: false, type: 'text' },
            {
              id: 'postCount',
              label: 'Posts',
              type: 'text',
              align: 'center',
              width: '10%',
            },

            {
              id: 'created_at',
              label: t(LanguageKey.site.createdAtItem),
              type: 'datetime',
              align: 'center',
              width: '15%',
            },
          ],
        }}
      />
    </DashboardContent>
  );
}
