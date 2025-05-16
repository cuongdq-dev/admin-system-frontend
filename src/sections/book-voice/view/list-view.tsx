import { Avatar, Box, Card, Chip, Link, Typography, useMediaQuery } from '@mui/material';
import { t } from 'i18next';
import { PATH_BOOK } from 'src/api-core/path';
import { HeadComponent } from 'src/components/page-head';
import { TableComponent, timeAgo } from 'src/components/table';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { fNumber } from 'src/utils/format-number';
import { useShallow } from 'zustand/react/shallow';
import { BookFilter } from '../components/book-filter';

// ----------------------------------------------------------------------

export function ListView() {
  const storeName = StoreName.BOOK;
  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => {
    setRefreshList(storeName, refreshNumber + 1);
  };

  const HeadLabel: HeadLabelProps[] = [
    {
      id: 'thumbnail',
      label: t(LanguageKey.book.titleItem),
      sort: false,
      type: 'custom',
      width: '100%',
      render: ({ row }) => {
        return (
          <Box width="100%" display="flex" gap={2}>
            <Avatar
              sx={{ width: '90px', height: '80px' }}
              src={row?.thumbnail?.url}
              variant="rounded"
            />
            <Box display="flex" gap={0.4} flexDirection="column">
              <Link
                href={`voice/${row?.id}`}
                target="_blank"
                variant="subtitle2"
                sx={{ cursor: 'pointer' }}
              >
                {row?.title}
              </Link>

              <Typography
                sx={{
                  '& p': { margin: 0, padding: 0 },
                  padding: 0,
                  margin: 0,
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1, // số dòng muốn hiển thị
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  height: 'auto',
                  fontSize: 12,
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: row?.description }}></span>
              </Typography>
              <Box display="flex" gap={1}>
                {row?.is_new && (
                  <Chip
                    variant="outlined"
                    color="secondary"
                    size="small"
                    label={t(LanguageKey.book.newStatus)}
                  ></Chip>
                )}
                {row?.is_hot && (
                  <Chip
                    variant="outlined"
                    size="small"
                    color="primary"
                    label={t(LanguageKey.book.hotStatus)}
                  ></Chip>
                )}
                {row?.is_full && (
                  <Chip
                    variant="outlined"
                    size="small"
                    color="info"
                    label={t(LanguageKey.book.fullStatus)}
                  ></Chip>
                )}

                {row?.total_chapter && (
                  <Chip
                    variant="filled"
                    size="small"
                    color="default"
                    label={`${t(LanguageKey.book.chapterItem)} ${row?.chapter_count}/${row?.total_chapter}`}
                  ></Chip>
                )}

                {row?.author?.name && (
                  <Chip
                    variant="outlined"
                    size="small"
                    color="success"
                    label={row?.author?.name}
                  ></Chip>
                )}
              </Box>
            </Box>
          </Box>
        );
      },
    },

    {
      id: 'word_count',
      label: 'Word',
      type: 'number',
      align: 'center',
      sort: true,
    },
    {
      id: 'created_at',
      label: t(LanguageKey.common.createdAtItem),
      type: 'datetime',
      align: 'center',
      sort: true,
    },
  ];

  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/book', title: t(LanguageKey.common.listTitle) }] }}
    >
      <HeadComponent title={t(LanguageKey.book.listPageTitle)} />
      <BookFilter storeName={storeName} />
      <TableComponent
        component={isMobile ? 'CARD' : 'TABLE'}
        storeName={storeName}
        url={PATH_BOOK}
        indexCol={true}
        selectCol={true}
        refreshData={refreshData}
        actions={{ editBtn: true, deleteBtn: true }}
        headLabel={HeadLabel}
        customCard={({ values, index }: { values: Record<string, any>; index: number }) => {
          return (
            <Card
              key={index + '_' + (values?.id || values?.slug)}
              sx={{ borderRadius: 1, p: 1, mb: 2, width: '100%' }}
            >
              <Box width="100%" display="flex" gap={1}>
                <Avatar
                  sx={{ width: '60px', height: '100%' }}
                  src={values?.thumbnail?.url}
                  variant="rounded"
                />
                <Box display="flex" gap={0.4} flexDirection="column" width={'100%'}>
                  <Link
                    href={`voice/${values?.id}`}
                    target="_blank"
                    variant="subtitle2"
                    sx={{ cursor: 'pointer' }}
                  >
                    {values?.title}
                  </Link>

                  <Typography
                    sx={{
                      '& p': { margin: 0, padding: 0 },
                      padding: 0,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 1, // số dòng muốn hiển thị
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      height: 'auto',
                      fontSize: 12,
                    }}
                  >
                    <span dangerouslySetInnerHTML={{ __html: values?.description }}></span>
                  </Typography>

                  <Box display="flex" gap={1}>
                    {values?.is_new && (
                      <Chip
                        variant="outlined"
                        color="secondary"
                        size="small"
                        sx={{ fontSize: 10 }}
                        label={t(LanguageKey.book.newStatus)}
                      ></Chip>
                    )}
                    {values?.is_hot && (
                      <Chip
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: 10 }}
                        color="primary"
                        label={t(LanguageKey.book.hotStatus)}
                      ></Chip>
                    )}
                    {values?.is_full && (
                      <Chip
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: 10 }}
                        color="info"
                        label={t(LanguageKey.book.fullStatus)}
                      ></Chip>
                    )}
                    {values?.total_chapter && (
                      <Chip
                        variant="filled"
                        size="small"
                        sx={{ fontSize: 10 }}
                        color="default"
                        label={`${values?.chapter_count}/${values?.total_chapter}`}
                      ></Chip>
                    )}

                    {values?.author?.name && (
                      <Chip
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: 10 }}
                        color="success"
                        label={values?.author?.name}
                      ></Chip>
                    )}
                  </Box>
                  <Box display="flex" gap={1} justifyContent="flex-end">
                    <Typography sx={{ fontSize: 12, padding: 0, margin: 0 }} color="grey">
                      {Number(values?.chapter_count!) / Number(values?.total_chapter!)} |{' '}
                      {timeAgo(values.created_at)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          );
        }}
      />
    </DashboardContent>
  );
}
