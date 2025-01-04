import { Box, CardHeader, IconButton } from '@mui/material';
import { RefreshIcon } from 'src/components/icon';
import { TimeAgo } from 'src/components/label';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';

export const CardHead = (props: {
  storeName: string;
  title: string;
  fetchOn?: Date;
  actionRender?: () => JSX.Element;
}) => {
  const { fetchOn, storeName, title, actionRender } = props;

  const { setRefreshList } = usePageStore();
  const { refreshNumber = 0, isFetching } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const refreshData = () => setRefreshList(storeName, refreshNumber + 1);

  return (
    <CardHeader
      sx={{ textAlign: 'left' }}
      title={
        <>
          <Box display="flex" justifyContent="space-between">
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1}>
              {title}
              {actionRender && actionRender()}
            </Box>

            <IconButton size="medium" sx={{ marginLeft: 1 }} onClick={refreshData}>
              <RefreshIcon icon={'mdi:refresh'} />
            </IconButton>
          </Box>
          <TimeAgo isFetching={isFetching} timestamp={fetchOn!} />
        </>
      }
    />
  );
};
