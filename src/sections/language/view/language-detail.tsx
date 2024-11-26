import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';
export function LanguageDetail() {
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Language Detail
        </Typography>
      </Box>

      <Card></Card>
    </DashboardContent>
  );
}
