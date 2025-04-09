import { Link, Typography } from '@mui/material';
import { t } from 'i18next';
import { PATH_BLOG_UNUSED } from 'src/api-core/path';
import { GuideList } from 'src/components/guide';
import { TableComponent } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { fRelativeTime } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';

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

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/indexing', title: t(LanguageKey.common.listTitle) }] }}
    >
      <GuideList text={t(LanguageKey.blog.blogUnusedDescription)} />
      <TableComponent
        component="TABLE"
        storeName={storeName}
        url={PATH_BLOG_UNUSED}
        indexCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
        actions={{ deleteBtn: true }}
      />
    </DashboardContent>
  );
}
