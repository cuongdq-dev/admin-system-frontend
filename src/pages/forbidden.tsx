import { Container, Typography, Box, Button } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { SimpleLayout } from 'src/layouts/simple';
import { RouterLink } from 'src/routes/components';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`404 forbidden error! | Error - ${CONFIG.appName}`}</title>
      </Helmet>
      <SimpleLayout content={{ compact: true }}>
        <Container>
          <Typography variant="h3" sx={{ mb: 2 }}>
            403 - Forbidden!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, You don't have permission to access this page.
          </Typography>

          <Box
            component="img"
            src="/assets/illustrations/illustration-404.svg"
            sx={{ width: 320, height: 'auto', my: { xs: 5, sm: 10 } }}
          />

          <Button component={RouterLink} href="/" size="large" variant="contained" color="inherit">
            Go to home
          </Button>
        </Container>
      </SimpleLayout>
    </>
  );
}
