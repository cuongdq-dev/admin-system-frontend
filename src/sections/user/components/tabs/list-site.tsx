import { Card, CardContent, Container, Grid } from '@mui/material';
import ProfileCategories from '../profile-categories';
import ProfileInfoCard from '../profile-info';
import ProfilePosts from '../profile-posts';
import ProfileWebsites from '../profile-websites';
// ----------------------------------------------------------------------

export default function ListSiteTab({ data }: { data?: Record<string, any> }) {
  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5} lg={4}>
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ pb: 1 }}>
              <ProfileInfoCard data={data} />
            </CardContent>
          </Card>

          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <ProfileWebsites data={data} />
            </CardContent>
          </Card>

          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <ProfileCategories data={data} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7} lg={8}>
          <ProfilePosts data={data} />
        </Grid>
      </Grid>
    </Container>
  );
}
