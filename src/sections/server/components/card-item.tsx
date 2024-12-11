import {
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  menuItemClasses,
  MenuList,
  Link,
  Popover,
} from '@mui/material';
import { t } from 'i18next';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HttpMethod } from 'src/api-core';
import { ButtonDelete } from 'src/components/button';
import { Iconify } from 'src/components/iconify';
import { LanguageKey } from 'src/constants';
import { remToPx } from 'src/theme/styles';
import { fDateTime, formatStr } from 'src/utils/format-time';

type Props = {
  item: IServer;
  refreshData?: () => void;
  baseUrl: string;
  handleClickOpenForm: (row: Record<string, any>, action: HttpMethod) => void;
};
export const ServerItem = (props: Props) => {
  const { item, refreshData, handleClickOpenForm, baseUrl } = props;
  const navigate = useNavigate();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);
  return (
    <Card sx={{ padding: 0 }}>
      <Button
        disableRipple
        sx={{ position: 'absolute', zIndex: 1, top: remToPx('1.2'), right: 0 }}
        endIcon={<Iconify color="grey" icon="eva:more-vertical-fill" />}
        onClick={handleOpenPopover}
      ></Button>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleClickOpenForm(item!, HttpMethod.PATCH);
            }}
          >
            <Iconify icon="solar:pen-bold" />
            {t(LanguageKey.button.update)}
          </MenuItem>
          <ButtonDelete
            refreshData={refreshData}
            rowId={item?.id!}
            baseUrl={baseUrl + '/delete/' + item?.id}
          />
        </MenuList>
      </Popover>

      <List sx={{ width: '100%', bgcolor: 'background.paper', marginBottom: 1 }}>
        <ListItem sx={{ padding: 0 }} alignItems="flex-start">
          <ListItemText
            sx={(theme) => {
              return {
                borderBottomStyle: 'dashed',
                borderBottomWidth: 0.5,
                borderBottomColor: theme.vars.palette.divider,
                paddingX: 3,
                paddingY: 2,
                marginBottom: 2,
              };
            }}
            primaryTypographyProps={{ fontWeight: 'fontWeightBold' }}
            primary={
              <Link onClick={() => navigate(item?.id!)} sx={{ color: 'text.primary' }}>
                {item.name}
              </Link>
            }
            secondaryTypographyProps={{ color: 'text.secondary', fontSize: 'typography.caption' }}
            secondary={fDateTime(item.created_at?.toString(), formatStr.paramCase.dateTime)}
          />
        </ListItem>

        <Grid
          sx={(theme) => {
            return {
              color: theme.vars.palette.text.secondary,
              fontWeight: theme.typography.fontWeightRegular,
              fontSize: theme.typography.caption,
            };
          }}
          paddingX={3}
          container
          spacing={1}
          columns={2}
        >
          <Grid spacing={0.2} item xs={1} sm={2}>
            <Box gap={1} alignItems={'center'} display="flex">
              <Iconify icon={'solar:user-bold-duotone'} />
              {item.user}
            </Box>
          </Grid>
          <Grid item xs={1} sm={2}>
            <Box gap={1} alignItems={'center'} display="flex">
              <Iconify icon={'zondicons:network'} />
              {item.host}
            </Box>
          </Grid>
          <Grid item xs={1} sm={2}>
            <Box gap={1} alignItems={'center'} display="flex">
              <Iconify icon={'tabler:plug-connected'} />
              {item.port}
            </Box>
          </Grid>
        </Grid>
      </List>
    </Card>
  );
};
