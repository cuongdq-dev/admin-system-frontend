import { Box, CardHeader, IconButton } from '@mui/material';
import { RefreshIcon } from 'src/components/icon';
import { usePageStore } from 'src/store/store';
import { useShallow } from 'zustand/react/shallow';

export const CardHead = (props: {
  storeName: string;
  title: string;
  actionRender?: () => JSX.Element;
}) => {
  const { storeName, title, actionRender } = props;

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => setRefreshList(storeName, refreshNumber + 1);

  return (
    <CardHeader
      sx={{ textAlign: 'left' }}
      title={
        <Box display="flex" justifyContent="space-between">
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1}>
            {title}
            {actionRender && actionRender()}
          </Box>

          <IconButton size="medium" sx={{ marginLeft: 1 }} onClick={refreshData}>
            <RefreshIcon icon={'mdi:refresh'} />
          </IconButton>
        </Box>
      }
    />
  );
};
