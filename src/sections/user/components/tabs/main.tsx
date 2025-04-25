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
      <Grid container columnSpacing={3}>
        <Grid sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }} item xs={12} md={5} lg={4}>
          <Card
            sx={{
              mb: 1,
              display: { xs: 'none', sm: 'none', md: 'block' },
              borderRadius: { xs: 0, sm: 0, md: 1 },
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent sx={{ pb: 1 }}>
              <ProfileInfoCard />
            </CardContent>
          </Card>

          <Card
            sx={{
              display: { xs: 'none', sm: 'none', md: 'block' },
              mb: 1,
              borderRadius: { xs: 0, sm: 0, md: 1 },
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <ProfileWebsites data={data} />
            </CardContent>
          </Card>

          <Card
            sx={{
              display: { xs: 'none', sm: 'none', md: 'block' },
              mb: 1,
              borderRadius: { xs: 0, sm: 0, md: 1 },
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <ProfileCategories data={data} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <Card
            sx={{
              backgroundColor: { xs: 'transparent', sm: 'background.paper' },
              borderRadius: { xs: 0, sm: 1 },
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              mb: { xs: 0, sm: 1 },
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t(LanguageKey.user.myPostTitle)}
              </Typography>
              <Box
                component="a"
                href="/blog/create"
                sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}
              >
                <Avatar src={data?.avatar?.url} sx={{ width: 40, height: 40, mr: 1.5 }} />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {t(LanguageKey.user.inputPostTitle, { name: data?.name })}
                  </Typography>
                </Box>
              </Box>
              <Button
                fullWidth
                onClick={() => handleChangeTab && handleChangeTab(1)}
                variant="contained"
                sx={{ mt: 2 }}
              >
                {t(LanguageKey.user.userManagePost)}
              </Button>
            </CardContent>
          </Card>

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
