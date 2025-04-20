import { Avatar, Box, Typography } from '@mui/material';
// ----------------------------------------------------------------------

export default function ProfileCategories({ data }: { data?: Record<string, any> }) {
  return (
    <>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Categories
      </Typography>
      {data?.categories?.map((category: IPostCategory) => (
        <Box key={category.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 36, height: 36, mr: 1.5 }}>{category?.name?.charAt(0)}</Avatar>
          <Box>
            <Typography variant="body1" fontWeight="medium">
              {category.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {category?.postCount} articles
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
}
