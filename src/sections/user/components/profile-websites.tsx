import { Avatar, Box, Typography } from '@mui/material';
// ----------------------------------------------------------------------

export default function ProfileWebsites({ data }: { data?: Record<string, any> }) {
  return (
    <>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Websites
      </Typography>
      {data?.sites?.map((website: ISite) => (
        <Box key={website.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 36, height: 36, mr: 1.5, bgcolor: '#1877f2' }}>
            {website?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight="medium">
              {website.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component="a"
              href={website.domain}
              target="_blank"
            >
              {website.domain}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
}
