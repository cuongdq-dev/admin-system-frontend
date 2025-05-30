import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { t } from 'i18next';
import React, { useEffect } from 'react';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_BOOK } from 'src/api-core/path';
import { Iconify } from 'src/components/iconify';
import { CollapsibleText } from 'src/components/label/collapsible-text';
import { PageLoading } from 'src/components/loading';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { varAlpha } from 'src/theme/styles';
import { fNumber } from 'src/utils/format-number';
import { fRelativeTime } from 'src/utils/format-time';
import { useShallow } from 'zustand/react/shallow';

// ----------------------------------------------------------------------
export const DetailView = React.memo(({ slug }: { slug?: string }) => {
  const storeName = StoreName.BOOK;
  const [copiedChapterSlug, setCopiedChapterSlug] = React.useState<string | null>(null);

  const { setDetail, setLoadingDetail } = usePageStore();
  const { data, isLoading = true } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  ) as { data?: IBook; refreshNumber?: number; isLoading?: boolean };

  const fetchPost = async () => {
    await invokeRequest({
      method: HttpMethod.GET,
      baseURL: PATH_BOOK + '/' + slug,
      onSuccess: (res: IBook) => {
        setDetail(storeName, { data: res, isFetching: false, isLoading: false });
      },
      onHandleError: (error) => {
        setLoadingDetail(storeName, false);
      },
    });
  };

  useEffect(() => {
    if (!!slug) fetchPost();
    else setLoadingDetail(storeName, false);
  }, [slug]);

  function coppyToClipboard(html: string, chapterSlug: string) {
    const tmpEl = typeof window !== 'undefined' ? document.createElement('div') : null;
    const plainText = tmpEl
      ? ((tmpEl.innerHTML = html), tmpEl.textContent || '')
      : html.replace(/<[^>]*>/g, '');

    navigator.clipboard.writeText(plainText!).then(() => {
      setCopiedChapterSlug(chapterSlug);

      setTimeout(() => {
        setCopiedChapterSlug(null);
      }, 2000);
    });
  }

  return (
    <Scrollbar sx={{ maxHeight: '100%', overflowX: 'hidden' }}>
      <DashboardContent breadcrumb={{ items: [{ href: '/book', title: 'Create' }] }}>
        <PageLoading isLoading={isLoading} />
        <Grid container spacing={2}>
          <Grid xs={12} sm={12} md={4}>
            <Card
              sx={(theme) => {
                return {
                  height: { xs: '100%', sm: 'calc(100vh - 110px)' },
                  border: `1px solid ${theme.palette.divider}`,
                };
              }}
            >
              <Scrollbar sx={{ height: '100%', overflowX: 'hidden' }}>
                <CardHeader
                  sx={(theme) => {
                    return {
                      padding: theme.spacing(3),
                      backgroundColor: varAlpha(theme.palette.background.neutralChannel, 0.5),
                    };
                  }}
                  title={slug ? t(LanguageKey.book.detailPageTitle) : t(LanguageKey.button.create)}
                />

                <CardContent>
                  <Grid container spacing={2} height={'100%'}>
                    <Grid xs={12} sm={12} md={!slug ? 6 : 12}>
                      <Typography variant="h5">{data?.title}</Typography>
                      <Typography variant="caption">
                        {data?.chapters?.length} Chương | {fRelativeTime(data?.created_at)}
                      </Typography>
                    </Grid>

                    <Grid
                      xs={12}
                      sm={12}
                      md={!slug ? 6 : 12}
                      display={'flex'}
                      flexWrap={'wrap'}
                      gap={1}
                    >
                      {data?.categories?.map((category) => (
                        <Chip key={category.id} label={category?.name}></Chip>
                      ))}
                    </Grid>

                    <Grid xs={12} sm={12} md={12}>
                      <Typography variant="subtitle2">Giới Thiệu: </Typography>

                      <CollapsibleText text={data?.description!} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Scrollbar>
            </Card>
          </Grid>
          <Grid xs={12} sm={12} md={8}>
            {data?.chapters?.map((chapter, index) => {
              return (
                <Accordion key={index + '_' + chapter.slug}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${chapter.slug}-content`}
                    id={`${chapter.slug}-header`}
                  >
                    <Typography component="span">
                      {chapter.title} ({fNumber(chapter.content?.length)})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Card
                      key={index + '_' + chapter.slug}
                      sx={{
                        mb: 2,
                        backgroundColor: index % 2 ? 'background.default' : 'background.neutral',
                      }}
                    >
                      <CardContent
                        sx={{ cursor: 'copy' }}
                        onClick={() => {
                          coppyToClipboard(chapter.content!, chapter?.slug!);
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          color={copiedChapterSlug == chapter?.slug ? 'primary' : 'inherit'}
                          onClick={() => {
                            coppyToClipboard(chapter.content!, chapter?.slug!);
                          }}
                          sx={{
                            gap: 1,
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            fontSize: 10,
                            p: 0,
                            color: copiedChapterSlug == chapter?.slug ? 'grey' : 'unset',
                          }}
                        >
                          <Iconify
                            sx={{ width: 10, height: 10 }}
                            icon={
                              copiedChapterSlug == chapter.slug
                                ? 'lets-icons:done-all-round-duotone-line'
                                : 'si:copy-duotone'
                            }
                          />
                          Copy
                        </Button>
                        <span dangerouslySetInnerHTML={{ __html: chapter?.content! }}></span>
                      </CardContent>
                    </Card>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Grid>
        </Grid>
      </DashboardContent>
    </Scrollbar>
  );
});

function splitHtmlIntoChunks(html: string, maxLength = 2000) {
  // 1. Chuyển HTML thành text thuần
  const tmpEl = typeof window !== 'undefined' ? document.createElement('div') : null;

  const plainText = tmpEl
    ? ((tmpEl.innerHTML = html), tmpEl.textContent || '')
    : html.replace(/<[^>]*>/g, ''); // fallback nếu không có DOM

  // 2. Làm sạch văn bản và thay dấu nháy kép
  const cleanedText = plainText
    // .replace(/[\r\n]+/g, '.')
    .replace(/[“”"]/g, "'") // thay dấu ngoặc kép tiếng Việt và " thành '
    .replace(/[’]/g, "'") // nếu cần thay luôn dấu nháy đơn uốn ’ thành '
    .replace(/\s+/g, ' ') // gom nhiều khoảng trắng thành 1 space
    .trim();

  // 3. Chia thành câu theo dấu chấm/kết thúc
  const sentences = cleanedText.match(/[^.!?。]+[.!?。]?/g) || [];

  const chunks: string[] = [];
  let currentChunk = '';

  for (let sentence of sentences) {
    sentence = sentence.trim();
    if ((currentChunk + ' ' + sentence).trim().length <= maxLength) {
      currentChunk += ' ' + sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }

      if (sentence.length > maxLength) {
        // Nếu một câu dài hơn maxLength → chia nhỏ
        for (let i = 0; i < sentence.length; i += maxLength) {
          chunks.push(sentence.slice(i, i + maxLength).trim());
        }
        currentChunk = '';
      } else {
        currentChunk = sentence;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
