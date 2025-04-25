import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Avatar, Box, Card, CardContent, IconButton, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function ProfilePosts({ data }: { data?: Record<string, any> }) {
  const { posts: articles, ...user } = data || {};
  return (
    <>
      {articles?.map((article: IPost) => (
        <Card
          key={article.id}
          sx={{ mb: 1, borderRadius: { xs: 0, sm: 1 }, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src={user?.avatar?.url} sx={{ width: 40, height: 40, mr: 1.5 }} />
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {user?.name}
                </Typography>
                {Number(article?.categories?.length) > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {new Date(article?.created_at!).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    ·{' '}
                    <span style={{ color: '#1877f2' }}>
                      {article?.categories?.map((cate) => cate.name).join(', ')}
                    </span>
                  </Typography>
                )}
              </Box>
              <IconButton sx={{ ml: 'auto' }}>
                <MoreHorizIcon />
              </IconButton>
            </Box>

            <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 'medium' }}>
              {article?.title}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {article?.meta_description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
