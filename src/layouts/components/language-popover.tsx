import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import { t } from 'i18next';
import { getEmoji, getLanguage } from 'language-flag-colors';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageKey } from 'src/constants';
import { useNotifyStore } from 'src/store/notify';
import { useSettingStore } from 'src/store/setting';
import { useShallow } from 'zustand/react/shallow';

// ----------------------------------------------------------------------

export type LanguagePopoverProps = IconButtonProps;

export function LanguagePopover({ sx, ...other }: LanguagePopoverProps) {
  const { setNotify } = useNotifyStore.getState();
  const data = useSettingStore(useShallow((state) => state.lang));

  const { i18n } = useTranslation();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const defaultLanguage = getLanguage(i18n.language);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleChangeLang = async (newLang: string) => {
    i18n.changeLanguage(newLang);

    setNotify({ title: t(LanguageKey.notify.changedLanguage), options: { variant: 'success' } });

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          width: 40,
          height: 40,
          ...(openPopover && { bgcolor: 'action.selected' }),
          ...sx,
        }}
        {...other}
      >
        {getEmoji(defaultLanguage?.country!)}
      </IconButton>
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: {
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {data?.map((option) => {
            const optionLanguage = getLanguage(option.code);
            return (
              <MenuItem
                key={option.code}
                selected={option.code === i18n?.language}
                onClick={() => handleChangeLang(option.code)}
              >
                {getEmoji(optionLanguage?.country!)}
                <span>{optionLanguage?.country}</span>
              </MenuItem>
            );
          })}
        </MenuList>
      </Popover>
    </>
  );
}
