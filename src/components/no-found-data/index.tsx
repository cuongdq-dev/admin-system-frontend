import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Stack } from '@mui/material';

// ----------------------------------------------------------------------

export function NotFoundDataComponent() {
  return (
    <Stack sx={{ color: 'text.secondary', display: 'flex', textAlign: 'center', padding: 2 }}>
      <Container sx={{ alignContent: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Sorry, data not found!
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          Sorry, we couldn’t find the data you’re looking for. Perhaps you’ve mistyped the URL? Be
          sure to check your spelling.
        </Typography>
      </Container>
    </Stack>
  );
}
