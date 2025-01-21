import { Backdrop, CircularProgress } from '@mui/material';

export const PageLoading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={isLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
