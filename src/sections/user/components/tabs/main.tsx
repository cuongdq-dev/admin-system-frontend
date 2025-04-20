import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { NotFoundDataComponent } from 'src/components/no-found-data';
import ProfileCategories from '../profile-categories';
import ProfileInfoCard from '../profile-info';
import ProfilePosts from '../profile-posts';
import ProfileWebsites from '../profile-websites';
import { t } from 'i18next';
import { LanguageKey } from 'src/constants';
// ----------------------------------------------------------------------

export default function ProfileMainTab({
  data,
  handleChangeTab,
}: {
  data?: Record<string, any>;
  handleChangeTab?: (tab: number) => void;
}) {
  if (!data) return <NotFoundDataComponent />;
  return (
    <Container maxWidth="lg" sx={{ mb: 2, padding: 0 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5} lg={4}>
          <Card sx={{ mb: 1, borderRadius: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ pb: 1 }}>
              <ProfileInfoCard data={data} />
            </CardContent>
          </Card>

          <Card sx={{ mb: 1, borderRadius: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <ProfileWebsites data={data} />
            </CardContent>
          </Card>

          <Card sx={{ mb: 1, borderRadius: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <ProfileCategories data={data} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <Card sx={{ borderRadius: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t(LanguageKey.user.myPostTitle)}
              </Typography>
              <Box
                component="a"
                href="/blog/create"
                sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}
              >
                <Avatar src={data?.avatar.url} sx={{ width: 40, height: 40, mr: 1.5 }} />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {t(LanguageKey.user.inputPostTitle, { name: data?.name })}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Paper
            variant="outlined"
            component={'div'}
            onClick={() => handleChangeTab && handleChangeTab(1)}
            sx={(theme) => {
              return {
                m: 1,

                p: 2,
                borderRadius: 2,
                textAlign: 'center',
                fontWeight: 'bold',
                border: `1px solid ${theme.palette.divider}`,
              };
            }}
          >
            {t(LanguageKey.user.userManagePost)}
          </Paper>
          <ProfilePosts data={data} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button onClick={() => handleChangeTab && handleChangeTab(1)} variant="outlined">
              {t(LanguageKey.common.viewAll)}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
