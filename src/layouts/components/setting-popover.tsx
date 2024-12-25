import { Button, styled, Switch, useColorScheme } from '@mui/material';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Mode } from '@mui/system/cssVars/useCurrentColorScheme';
import { t } from 'i18next';
import { useState } from 'react';

import { SpinIconAnimation } from 'src/components/icon';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey } from 'src/constants';
import { colorSchemes } from 'src/theme/core';
import { varAlpha } from 'src/theme/styles';
import COLORS from '../../theme/core/colors.json';
// ----------------------------------------------------------------------

type SettingProps = { mode?: Mode; contrast?: boolean; font?: string; presets?: string };
const defaultSetting: SettingProps = { mode: 'light', contrast: false };

const ButtonCustom = styled(Button)(({ theme }) => {
  return {
    display: 'inline-flex',
    justifyContent: 'center',
    boxSizing: 'border-box',
    outline: 0,
    margin: 0,
    userSelect: 'none',
    verticalAlign: 'middle',
    color: 'inherit',
    padding: '20px 16px',
    borderRadius: '16px',
    cursor: 'pointer',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
  };
});

const SwitchBustom = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': { width: 15 },
    '& .MuiSwitch-switchBase.Mui-checked': { transform: 'translateX(9px)' },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': { transform: 'translateX(12px)', color: '#fff' },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], { duration: 200 }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

export function SettingPopover() {
  const { mode, setMode, colorScheme } = useColorScheme();

  const [openSetting, setOpenSetting] = useState(false);
  const settings = { ...defaultSetting, mode };
  const canReset = Object.keys(settings).some(
    (key) => settings[key as keyof SettingProps] !== defaultSetting[key as keyof SettingProps]
  );
  const scheme = localStorage.getItem('color-scheme');

  const handleChangeColor = (value: string) => {
    console.log(colorScheme);
    if (colorSchemes) {
      // TODO UPDATE CHANGE SCHEMES
      localStorage.setItem('color-scheme', value);
      window.dispatchEvent(new Event('storage'));
      window.location.reload();
    }
  };

  return (
    <>
      <IconButton color={openSetting ? 'primary' : 'default'} onClick={() => setOpenSetting(true)}>
        <Badge color="error">
          <SpinIconAnimation width={24} icon="ic:outline-settings" />
        </Badge>
      </IconButton>
      <Drawer
        anchor="right"
        open={openSetting}
        onClose={() => setOpenSetting(false)}
        PaperProps={{ sx: { width: 360, overflow: 'hidden' } }}
      >
        <Box display="flex" alignItems="center" sx={{ pl: 2.5, pr: 1.5, py: 2 }}>
          <Typography variant="h6" flexGrow={1}>
            {t(LanguageKey.common.settingTitle)}
          </Typography>

          <IconButton
            onClick={() => {
              setMode(defaultSetting.mode!);
            }}
          >
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:refresh-linear" />
            </Badge>
          </IconButton>

          <IconButton onClick={() => setOpenSetting(false)}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 2.5 }}>
            <Box gap={2} display={'grid'} gridTemplateColumns={'repeat(2, 1fr)'}>
              <ButtonCustom
                onClick={() => {
                  mode == 'dark' ? setMode('light') : setMode('dark');
                }}
              >
                <Box
                  width={1}
                  mb={1.2}
                  component={'span'}
                  display="flex"
                  justifyContent={'space-between'}
                >
                  <Iconify icon="mdi:theme-light-dark"></Iconify>
                  <SwitchBustom checked={mode == 'dark'} />
                </Box>
                <Box>{t(LanguageKey.common.darkModeTitle)}</Box>
              </ButtonCustom>
              {/* <ButtonCustom
                onClick={() => {
                  setMode('system');
                }}
              >
                <Box
                  width={1}
                  mb={1.2}
                  component={'span'}
                  display="flex"
                  justifyContent={'space-between'}
                >
                  <Iconify icon="icon-park:system"></Iconify>
                  <SwitchBustom checked={mode == 'dark'} />
                </Box>
                <Box>{t(LanguageKey.common.systemModeTitle)}</Box>
              </ButtonCustom> */}
            </Box>
            <Box
              sx={(theme) => {
                return {
                  border: 1,
                  borderColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
                  borderRadius: theme.spacing(2),
                  display: 'flex',
                  position: 'relative',
                  padding: theme.spacing(4),
                };
              }}
            >
              <Typography
                sx={(theme) => {
                  return {
                    position: 'absolute',
                    top: -12,
                    left: 20,
                    alignItems: 'center',
                    borderRadius: theme.vars.shape.borderRadius,
                    paddingX: 1,
                    fontWeight: theme.typography.fontWeightBold,
                    color:
                      mode === 'dark'
                        ? theme.vars.palette.grey[800]
                        : theme.vars.palette.common.white,
                    backgroundColor: theme.vars.palette.text.primary,
                  };
                }}
              >
                Preset
              </Typography>
              <Box component={'div'} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {Object.keys(COLORS).map((key: string, index: number) => {
                  const json = COLORS;
                  const colors = json[key as keyof typeof COLORS];
                  return (
                    <Box
                      onClick={() => {
                        handleChangeColor(key);
                      }}
                      component={'span'}
                      key={key + '_' + index}
                      sx={(theme) => {
                        return {
                          cursor: 'pointer',
                          borderRadius: theme.vars.shape.borderRadius,
                          marginRight: 1,
                          paddingX: 3,
                          paddingY: 2,
                          display: 'flex',

                          backgroundColor:
                            scheme == key
                              ? varAlpha(theme.vars.palette.primary.mainChannel, 0.05)
                              : 'transparent',
                        };
                      }}
                    >
                      <Iconify
                        color={mode == 'dark' ? colors.primary.dark : colors?.primary.light}
                        width={28}
                        icon="solar:siderbar-outline"
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
