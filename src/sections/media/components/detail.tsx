import {
  Article,
  ExpandLess,
  ExpandMore,
  Person,
  PostAdd,
  Image as ImageIcon,
  ShoppingBag,
  TrendingUp,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { PATH_IMAGE_LIST } from 'src/api-core/path';
import { useAPI } from 'src/hooks/use-api';
import { fDate } from 'src/utils/format-time';

export function DetailMedia({ image }: { image: { url: string; filename: string } }) {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState<IMedia | undefined>();
  const [expandedSections, setExpandedSections] = useState({
    avatars: true,
    banners: true,
    trendings: true,
    articles: true,
    posts: true,
    variants: true,
  });

  useEffect(() => {
    setLoading(true);
  }, [image]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  useAPI({
    clearRequest: !image,
    baseURL: PATH_IMAGE_LIST + '/' + image?.filename.split('.')[0],
    onSuccess: (res) => {
      setValue(res);
      setLoading(false);
    },
    onHandleError: () => {
      setLoading(false);
    },
  });

  const renderUsageSection = (
    title: string,
    icon: React.ReactNode,
    items: Record<string, any> | undefined,
    section: keyof typeof expandedSections,
    renderItem: (item: any) => React.ReactNode
  ) => {
    if (!items || items.length === 0) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <ListItemButton onClick={() => toggleSection(section)} sx={{ py: 1 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="subtitle2">
                {title} <Chip size="small" label={items.length} sx={{ ml: 1 }} />
              </Typography>
            }
          />
          {expandedSections[section] ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={expandedSections[section]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding dense>
            {items.map((item: Record<string, any>, index: number) => (
              <Box key={index} sx={{ pl: 4, py: 1 }}>
                {renderItem(item)}
              </Box>
            ))}
          </List>
        </Collapse>
      </Box>
    );
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress size={40} />
      </Box>
    );

  return (
    <Box sx={{ overflowX: 'hidden', p: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value?.filename}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {fDate(value?.created_at)}
      </Typography>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Media Usage
        </Typography>

        <Box>
          {/* Media metadata */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Media Information
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              <Chip size="small" label={`ID: ${value?.id}`} variant="outlined" />
              <Chip size="small" label={`Type: ${value?.minetype}`} variant="outlined" />
              <Chip size="small" label={`Storage: ${value?.storage_type}`} variant="outlined" />
              <Chip
                size="small"
                label={`Size: ${(value?.size! / 1024).toFixed(1)} KB`}
                variant="outlined"
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Usage sections */}
          {value?.avatars &&
            renderUsageSection(
              'User Avatars',
              <Person fontSize="small" />,
              value?.avatars,
              'avatars',
              (item: Record<string, any>) => (
                <ListItem dense>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Avatar src={value?.url} sx={{ width: 24, height: 24 }}></Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.username}
                    secondary={item.email}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              )
            )}

          {value?.banners &&
            renderUsageSection(
              'User Banners',
              <ImageIcon fontSize="small" />,
              value?.banners,
              'banners',
              (item: Record<string, any>) => (
                <ListItem dense>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Avatar src={value?.url} sx={{ width: 24, height: 24 }}></Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.username}
                    secondary={item.email}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              )
            )}

          {value?.trendings &&
            renderUsageSection(
              'Trending Items',
              <TrendingUp fontSize="small" />,
              value?.trendings,
              'trendings',
              (item: Record<string, any>) => (
                <ListItem dense>
                  <ListItemText
                    primary={item.title}
                    secondary={`ID: ${item.id}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              )
            )}

          {value?.articles &&
            renderUsageSection(
              'Articles',
              <Article fontSize="small" />,
              value?.articles,
              'articles',
              (item: Record<string, any>) => (
                <ListItem dense>
                  <ListItemText
                    primary={item.title}
                    secondary={`ID: ${item.id}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              )
            )}

          {value?.posts &&
            renderUsageSection(
              'Posts',
              <PostAdd fontSize="small" />,
              value?.posts,
              'posts',
              (item: Record<string, any>) => (
                <ListItem dense>
                  <ListItemText
                    primary={item.title}
                    secondary={`ID: ${item.id}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              )
            )}

          {value?.variants &&
            renderUsageSection(
              'Product Variants',
              <ShoppingBag fontSize="small" />,
              value?.variants,
              'variants',
              (item: Record<string, any>) => (
                <ListItem dense>
                  <ListItemText
                    primary={item.name}
                    secondary={`Product ID: ${item.product_id}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              )
            )}

          {!value?.avatars &&
            !value?.banners &&
            !value?.trendings &&
            !value?.articles &&
            !value?.posts &&
            !value?.variants && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 4 }}
              >
                This image is not currently used in any content.
              </Typography>
            )}
        </Box>
      </Box>
    </Box>
  );
}
