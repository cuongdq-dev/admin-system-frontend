import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
    <DashboardLayout>
      <Container
        component="div"
        maxWidth="xl"
        sx={{ py: 10, alignItems: 'center', display: 'flex', flexDirection: 'column' }}
      >
        <Typography variant="h3" sx={{ mb: 2 }}>
          Sorry, page not found!
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
          sure to check your spelling.
        </Typography>

        <Box
          component="img"
          src="/assets/illustrations/illustration-404.svg"
          sx={{ width: '30%', height: 'auto', my: { xs: 5, sm: 10 } }}
        />

        <Button component={RouterLink} href="/" size="large" variant="contained" color="inherit">
          Go to home
        </Button>
      </Container>
    </DashboardLayout>
  );
}
