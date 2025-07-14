import {
  Timeline,
  TimelineContent,
  TimelineItem,
  timelineItemClasses,
  TimelineSeparator,
} from '@mui/lab';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  dividerClasses,
  Link,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { t } from 'i18next';
import React, { Fragment } from 'react';
import { PATH_TRENDINGS_SEARCH } from 'src/api-core/path';
import { IconButtonDelete } from 'src/components/button';
import { GuideList } from 'src/components/guide';
import { Iconify } from 'src/components/iconify';
import { TableActionComponent, TableComponent } from 'src/components/table';
import { LanguageKey, StoreName, SubjectConfig } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { formatStr, fRelativeTime } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';

export function ListTrendingView() {
  const storeName = StoreName.BLOG_TRENDING;

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0, meta } = usePageStore(
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

    {
      id: 'delete',
      label: ' ',
      type: 'custom',
      width: '5%',
      render: ({ row, updateRowData }) => {
        const totalSiteCount = row?.articles?.reduce((total: number, article: any) => {
          const siteCountInArticle = article?.posts?.reduce((count: number, post: any) => {
            return count + (Number(post?.siteCount) || 0);
          }, 0);
          return total + siteCountInArticle;
        }, 0);

        if (!totalSiteCount)
          return (
            <TableActionComponent
              subject={SubjectConfig.POSTS}
              baseUrl={PATH_TRENDINGS_SEARCH}
              deleteBtn
              row={row}
              updateRowData={updateRowData}
            />
          );
        return <></>;
      },
    },
  ];

  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/indexing', title: t(LanguageKey.common.listTitle) }] }}
    >
      <GuideList text={t(LanguageKey.blog.blogTrendingDescription)} />

      <TableComponent
        component={isMobile ? 'CARD' : 'TABLE'}
        storeName={storeName}
        subject={SubjectConfig.POSTS}
        url={PATH_TRENDINGS_SEARCH}
        indexCol={true}
        refreshData={refreshData}
        headLabel={HeadLabel}
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
                id: 'site',
                label: 'Site',
                sort: false,
                align: 'center',
                type: 'custom',
                render: ({ row }) => {
                  if (row.sitePosts <= 0) return <></>;
                  return (
                    <Box display="flex" flexDirection="column" alignItems="center">
                      {row?.sitePosts?.map((st: any) => {
                        return (
                          <Typography
                            sx={(theme) => {
                              return {
                                border: `1px solid ${theme.palette.grey[400]}`,
                                py: 0.5,
                                px: 1,
                                borderRadius: 2,
                              };
                            }}
                            variant="caption"
                          >
                            {st.site.name}
                          </Typography>
                        );
                      })}
                    </Box>
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
        customCard={({ index, values, updateRowData }) => {
          return (
            <TrendingCard
              index={
                Number(index) +
                1 +
                (Number(meta?.currentPage || 1) - 1) *
                  Number(meta?.itemsPerPage || meta?.totalItems)
              }
              values={values}
              updateRowData={updateRowData}
            />
          );
        }}
      />
    </DashboardContent>
  );
}

const TrendingCard = ({
  values,
  updateRowData,
}: {
  index: number;
  values?: Record<string, any>;
  updateRowData?:
    | ((rowId: string, values: Record<string, any>, action: 'ADD' | 'REMOVE' | 'UPDATE') => void)
    | undefined;
}) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const postCount = values?.articles?.reduce((count: number, articles: any) => {
    return count + (Number(articles?.postCount) || 0);
  }, 0);

  const totalSiteCount = values?.articles?.reduce((total: number, article: any) => {
    const siteCountInArticle = article?.posts?.reduce((count: number, post: any) => {
      return count + (Number(post?.siteCount) || 0);
    }, 0);
    return total + siteCountInArticle;
  }, 0);

  return (
    <Box sx={{ mb: 2, width: '100%' }}>
      <Accordion expanded={expanded === values?.id} onChange={handleChange(values?.id)}>
        <AccordionSummary
          expandIcon={<Iconify icon="ic:outline-expand-more" />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Box
            sx={{
              color: 'text.primary',
              '& svg': { m: 1 },
              [`& .${dividerClasses.root}`]: { mx: 1 },
            }}
          >
            <Typography>{values?.titleQuery}</Typography>

            <Box display="flex" flexDirection="row" mt={1}>
              <Typography color="grey" variant="caption">
                {fRelativeTime(values?.created_at, formatStr.paramCase.date)}
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography color="grey" variant="caption">
                Articles: {values?.articleCount}
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography color="grey" variant="caption">
                Posts: {postCount}
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Timeline
            sx={(theme) => {
              return {
                padding: 0,
                [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 },
              };
            }}
          >
            {values?.articles?.map((article: any, index: number) => {
              return (
                <Fragment key={article?.id + '_' + index}>
                  <TimelineItem
                    sx={(theme) => {
                      return { p: 1, mb: 1, borderRadius: 2 };
                    }}
                  >
                    <TimelineSeparator sx={{ pt: 0.2 }}>
                      <Iconify icon="ic:round-article" />

                      <Divider variant="fullWidth" orientation="vertical" />
                    </TimelineSeparator>
                    <TimelineContent sx={{ pt: 0 }}>
                      <Typography>{article?.title}</Typography>
                      <Box
                        display="flex"
                        sx={{
                          [`& .${dividerClasses.root}`]: { mx: 1 },
                        }}
                      >
                        <Typography color="grey" variant="caption">
                          {fRelativeTime(article?.created_at)}
                        </Typography>

                        <Divider orientation="vertical" flexItem />

                        <Typography color="grey" variant="caption">
                          {article.source}
                        </Typography>
                      </Box>
                      {article?.posts?.map((post: any, index: number) => {
                        return (
                          <TimelineItem key={post.id + '_' + index} sx={{ mt: 1 }}>
                            {index !== 0 && <Divider orientation="horizontal" flexItem />}

                            <TimelineSeparator sx={{ pt: 0.2 }}>
                              <Iconify icon="fluent:news-16-regular" />
                              <Divider variant="fullWidth" orientation="vertical" />
                            </TimelineSeparator>
                            <TimelineContent sx={{ pt: 0 }}>
                              <Typography>{post.title}</Typography>
                              <Typography
                                noWrap
                                color="grey"
                                variant="caption"
                                sx={{
                                  flexShrink: 0,
                                  overflow: 'hidden',
                                  WebkitLineClamp: 1,
                                  display: '-webkit-box',
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {fRelativeTime(article?.created_at)}
                              </Typography>
                              <Typography color="grey" variant="caption">
                                {post?.sitePosts?.map((sp: any) => sp.site.name).join(', ')}
                              </Typography>
                            </TimelineContent>
                          </TimelineItem>
                        );
                      })}
                    </TimelineContent>
                  </TimelineItem>
                </Fragment>
              );
            })}
          </Timeline>
        </AccordionDetails>
        {Number(totalSiteCount) == 0 && (
          <AccordionActions
            sx={(theme) => {
              return {
                li: {
                  width: '100%',
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.common.white,
                  justifyContent: 'center',
                  borderRadius: 1,
                },
              };
            }}
          >
            <IconButtonDelete
              handleDelete={updateRowData}
              rowId={values?.id}
              baseUrl={PATH_TRENDINGS_SEARCH + '/delete/' + values?.id}
            />
          </AccordionActions>
        )}
      </Accordion>
    </Box>
  );
};
