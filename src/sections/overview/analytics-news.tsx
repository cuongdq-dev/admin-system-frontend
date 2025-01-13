import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import {
  Autocomplete,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_CRAWLER, PATH_TRENDINGS_SEARCH } from 'src/api-core/path';
import { timeAgo } from 'src/components/table/utils';

// ----------------------------------------------------------------------

type Props = CardProps & { title?: string; subheader?: string };

export function AnalyticsNews({ title, subheader, ...other }: Props) {
  const [trendings, setTrendings] = useState<ITrending[]>([]);

  const getProfile = () => {
    invokeRequest({
      baseURL: PATH_TRENDINGS_SEARCH,
      onSuccess: (res) => {
        setTrendings(res);
      },
      onHandleError: (error) => {},
    });
  };
  useEffect(() => {
    getProfile();
  }, []);

  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Responsive check

  const [drawer, setDrawer] = useState<{ open: boolean; values?: ITrending }>({
    open: false,
  });
  const handleCloseDrawer = () => {
    setDrawer((s) => ({ ...s, open: false, values: undefined }));
  };

  const drawerKeyword = drawer?.values?.articles
    ?.map((article) => {
      return article.relatedQueries;
    })
    .flat();
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} />

      <Scrollbar sx={{ height: 600 }}>
        <Box sx={{ minWidth: 640 }}>
          {trendings.map((trending, index: number) => (
            <TrendingItem
              handleClick={() => setDrawer((s) => ({ ...s, open: true, values: trending }))}
              key={'trending_' + index}
              item={trending}
            />
          ))}
        </Box>
      </Scrollbar>

      <Drawer
        anchor="right"
        open={drawer.open}
        onClose={handleCloseDrawer}
        variant="temporary"
        PaperProps={{
          sx: {
            width: isSmallScreen ? '90%' : '40%',
          },
        }}
      >
        <Box padding={2} display="flex" alignItems="center">
          <IconButton size="large" onClick={handleCloseDrawer}>
            <Iconify icon={'oi:chevron-right'} />
          </IconButton>

          <Box width={'100%'} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{title}</Typography>
          </Box>
        </Box>
        <Divider />

        <Box padding={2}>
          <Stack spacing={2}>
            <Paper sx={{ border: 'none', boxShadow: 'none' }}>
              <Box
                sx={(theme) => {
                  return {
                    py: 2,
                    gap: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                  };
                }}
              >
                <Avatar
                  variant="rounded"
                  alt={drawer?.values?.thumbnail?.slug}
                  src={`data:image/png;base64,${drawer?.values?.thumbnail?.data}`}
                  sx={{ width: 60, height: 60, flexShrink: 0 }}
                />

                <ListItemText
                  primary={drawer?.values?.titleQuery}
                  secondary={drawer?.values?.formattedTraffic}
                  primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
                  secondaryTypographyProps={{ mt: 0.5, noWrap: true, component: 'span' }}
                />
              </Box>

              {Number(drawerKeyword?.length) > 0 && (
                <Box
                  sx={() => {
                    return {
                      py: 2,
                      gap: 2,
                      alignItems: 'center',
                      borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                    };
                  }}
                >
                  <Autocomplete
                    multiple
                    disabled
                    id="relate-queries"
                    value={
                      (drawerKeyword?.map((query) => {
                        return { title: query?.query, id: query?.query };
                      }) as any) || []
                    }
                    options={
                      (drawerKeyword?.map((query) => {
                        return { title: query?.query, id: query?.query };
                      }) as any) || []
                    }
                    getOptionLabel={(option) => option.title}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option: any, index: number) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return <Chip key={key} label={option?.title} {...tagProps} />;
                      })
                    }
                    sx={{ width: '100%', border: 'none', boxShadow: 'none' }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Relate Queries"
                        sx={{ border: 'none', boxShadow: 'none' }}
                        variant="outlined"
                      />
                    )}
                  />
                </Box>
              )}
              <Box sx={{ py: 2, gap: 2, alignItems: 'center' }}>
                <ListItemText
                  primary={'Articles'}
                  secondary={Number(drawer.values?.articles?.length || 0) + ' Posts'}
                  primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
                  secondaryTypographyProps={{ mt: 0.5, noWrap: true, component: 'span' }}
                />

                {drawer.values?.articles?.map((article) => {
                  return <ArticleItem item={article} />;
                })}
              </Box>
            </Paper>
          </Stack>
        </Box>
      </Drawer>
    </Card>
  );
}

// ----------------------------------------------------------------------

function TrendingItem({
  sx,
  item,
  handleClick,
  ...other
}: BoxProps & { item: ITrending; handleClick: () => void }) {
  return (
    <Box
      onClick={() => handleClick()}
      sx={(theme) => {
        return {
          py: 2,
          px: 3,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
          ...sx,
          ':hover': {
            backgroundColor: theme.vars.palette.background.neutral,
            cursor: 'pointer',
          },
        };
      }}
      {...other}
    >
      <Avatar
        variant="rounded"
        alt={item.thumbnail?.slug}
        src={`data:image/png;base64,${item?.thumbnail?.data}`}
        sx={{ width: 48, height: 48, flexShrink: 0 }}
      />

      <ListItemText
        primary={item.titleQuery}
        secondary={
          <span>
            {`${item.articles?.length} articles`} ({timeAgo(item?.trendDate!)})
          </span>
        }
        primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
        secondaryTypographyProps={{ mt: 0.5, noWrap: true, component: 'span' }}
      />
    </Box>
  );
}

function ArticleItem({ sx, item, ...other }: BoxProps & { item: ITrendingArticle }) {
  const handleCrawler = () => {
    invokeRequest({
      baseURL: PATH_CRAWLER,
      method: HttpMethod.POST,
      params: item,
      onSuccess: (res) => {},
      onHandleError: (error) => {},
    });
  };
  return (
    <Box
      sx={() => {
        return {
          gap: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        };
      }}
      {...other}
    >
      <Box
        onClick={handleCrawler}
        sx={{
          position: 'relative',
          display: 'flex',
          opacity: 0.8,
          paddingY: 1,
          ':hover': {
            cursor: 'pointer',
            '.image-article': { opacity: 0.5 },
            '.icon-crawler': { animation: 'none' },
          },
        }}
      >
        <Avatar
          className="image-article"
          variant="rounded"
          alt={item.thumbnail?.slug}
          src={`data:image/png;base64,${item?.thumbnail?.data}`}
          sx={{ width: 80, height: 80, flexShrink: 0 }}
        />
      </Box>

      <ListItemText
        primary={
          <Link target="_blank" href={item.url} sx={{ cursor: 'pointer' }}>
            <span dangerouslySetInnerHTML={{ __html: item.title! }} />
          </Link>
        }
        secondary={
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="caption"
              sx={(theme) => {
                return { color: theme.vars.palette.text.primary, display: 'flex', gap: 1 };
              }}
            >
              <Iconify width={16} color={'text.disabled'} icon="fluent-mdl2:source" />
              {item.source}{' '}
            </Typography>

            <Typography
              variant="caption"
              sx={(theme) => {
                return { color: theme.vars.palette.text.primary, display: 'flex', gap: 1 };
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: item.meta_description! }} />
            </Typography>
          </Box>
        }
        primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
        secondaryTypographyProps={{
          mt: 0.5,
          noWrap: false,
          component: 'span',
          fontSize: 12,
        }}
      />
    </Box>
  );
}
