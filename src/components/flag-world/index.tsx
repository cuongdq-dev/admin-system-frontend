import { Grid, Paper, Typography } from '@mui/material';
import Flag from 'react-world-flags';

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
];

export const FlagComponent = () => {
  return (
    <Grid container spacing={2}>
      {countries.map((country) => (
        <Grid item key={country.code} xs={6} sm={4} md={2}>
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 2,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Flag code={country.code} style={{ width: 60, height: 40 }} />
            <Typography variant="subtitle1" mt={1}>
              {country.name}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
