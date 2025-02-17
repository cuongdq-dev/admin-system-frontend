import { Box, Button, Theme, Typography, useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SITE } from 'src/api-core/path';
import { FetchingComponent } from 'src/components/progress';
import { StoreName } from 'src/constants';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';

type Props = {};
export const Categories = (props: Props) => {
  const { id: siteId } = useParams();
  const { setList, setLoadingDetail } = usePageStore();

  const storeName = StoreName.SITE_CATEGORIES;
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm')); // Check if screen size is small

  const { data, isLoading: loading = true } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const defaultData = data as IPostCategory[];

  const fetchListCategories = () => {
    invokeRequest({
      method: HttpMethod.GET,
      baseURL: `${PATH_SITE}/${siteId}/categories/list`,
      onSuccess: (res) => {
        setList(storeName, { data: res, isFetching: false, isLoading: false });
      },
      onHandleError: (error) => {
        setLoadingDetail(storeName, false);
      },
    });
  };

  useEffect(() => {
    siteId && fetchListCategories();
  }, [siteId]);

  if (loading && !defaultData) return <FetchingComponent />;

  return (
    <Box
      sx={(theme) => {
        return {
          p: theme.spacing(1, 2, 2, 2),
          maxHeight: isSmallScreen ? 'none' : 'calc(100vh - 280px)',
          overflow: isSmallScreen ? 'visible' : 'auto',
        };
      }}
    >
      {defaultData.map((category, index) => {
        return (
          <Box
            key={`${category?.id}-${category.slug}-${category.name}`}
            sx={(theme) => {
              return {
                p: theme.spacing(2, 0, 2, 0),
                borderTop: index != 0 ? `1px solid ${theme.vars.palette.divider}` : 'unset',
                display: 'flex',
                justifyContent: 'space-between',
                opacity: category.postCount == 0 ? 0.3 : 1,
              };
            }}
          >
            <Box>
              <Typography variant="subtitle1">{category.name}</Typography>
            </Box>
            <Typography variant="subtitle2">{category.postCount}</Typography>
          </Box>
        );
      })}

      <Box>
        <Button size="small" fullWidth variant="contained">
          Add New
        </Button>
      </Box>
    </Box>
  );
};
