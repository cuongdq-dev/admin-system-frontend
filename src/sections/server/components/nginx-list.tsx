import MonacoEditor from '@monaco-editor/react';
import { LoadingButton } from '@mui/lab';

import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  ListItemText,
  Paper,
  Skeleton,
  styled,
  TextField,
  Typography,
  useColorScheme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SERVER } from 'src/api-core/path';
import { ButtonDelete, ButtonDismissNotify } from 'src/components/button';
import { Iconify } from 'src/components/iconify';
import { LanguageKey } from 'src/constants';
import { useAPI } from 'src/hooks/use-api';
import { rgbaToHex, stringAvatar } from 'src/theme/styles';

type NginxListProps = {
  serverId: string;
  connectionId?: string;
};

const PaperCustom = styled(Paper)(({ theme }) => ({
  borderWidth: 1,
  borderRadius: 16,
  height: 'fit-content',
  borderColor: theme.vars.palette.divider,
  borderStyle: 'solid',
  boxShadow: 'none',
  alignContent: 'center',
  padding: theme.spacing(2),
  '&:hover': {
    backgroundColor: theme.vars.palette.background.paperChannel,
  },
}));

export const NginxList = (props: NginxListProps) => {
  const { serverId, connectionId } = props;
  const [refreshNumber, setRefresh] = useState(0);
  const [state, setState] = useState<{
    loading: boolean;
    data?: { name: string; content?: string }[];
  }>({
    loading: true,
  });

  useAPI({
    refreshNumber: refreshNumber,
    baseURL: PATH_SERVER + `/nginx/${serverId}/${connectionId}`,
    onSuccess: (res) => {
      setState({ loading: false, data: res });
    },
    onHandleError: (res) => {
      setState((state) => ({ ...state, loading: false }));
    },
  });

  if (state?.loading)
    return (
      <PaperCustom>
        <Box width={'100%'} display="flex" flexDirection="row">
          <Skeleton variant="rounded" width={60} height={60} />
          <Box width={'100%'} marginX={1}>
            <Typography
              sx={(theme) => {
                return {
                  fontSize: theme.typography.button,
                  fontWeight: theme.typography.fontWeightBold,
                };
              }}
            >
              <Skeleton variant="text" />
            </Typography>
            <Typography
              sx={(theme) => {
                return {
                  fontSize: theme.typography.caption,
                  color: theme.vars.palette.text.secondary,
                };
              }}
            >
              <Skeleton variant="text" />
            </Typography>

            <Typography
              sx={(theme) => {
                return {
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1,
                  fontSize: theme.typography.caption,
                  color: theme.vars.palette.text.secondary,
                };
              }}
            >
              <Skeleton variant="text" />
            </Typography>
          </Box>
        </Box>
      </PaperCustom>
    );
  return (
    <Box gap={2} display="flex" flexDirection="column">
      <AddComponent
        title={t(LanguageKey.nginx.addFileTitle)}
        refreshData={() => setRefresh(refreshNumber + 1)}
        connectionId={connectionId!}
      />

      {state?.data?.map((item, index) => {
        return (
          <PaperCustom key={`nginx_${index}`}>
            <Box sx={{ px: 1, gap: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar {...stringAvatar(item.name)} />
              <ListItemText
                primary={item?.name}
                secondary={`www.${item.name.split('.conf')[0]}`}
                primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
                secondaryTypographyProps={{ mt: 0.5, noWrap: true, component: 'span' }}
              />
              <Box>
                <EditComponent
                  refreshData={() => setRefresh(refreshNumber + 1)}
                  connectionId={connectionId!}
                  title={item.name}
                  json={item.content}
                />
              </Box>
            </Box>
          </PaperCustom>
        );
      })}
    </Box>
  );
};

const EditComponent = ({
  title,
  json,
  connectionId,
  refreshData,
}: {
  title?: string;
  connectionId: string;
  json?: string;
  refreshData: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValue] = useState({ name: title, content: json });
  const theme = useTheme();
  const { mode } = useColorScheme();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Responsive check
  const parentRef = useRef<HTMLDivElement | null>(null);

  const handleUpdateFile = () => {
    setOpen(false);
    setLoading(true);
    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_SERVER + `/update/nginx/${connectionId}`,
      params: { fileName: values.name, fileContent: values.content },
      onSuccess: (res) => {
        setLoading(false);
        refreshData();
        setValue((s) => ({ ...s, content: res }));
        enqueueSnackbar(t(LanguageKey.notify.successDelete), {
          variant: 'success',
          action: (key) => <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />,
        });
      },
      onHandleError: (error) => {
        setLoading(false);
      },
    });
  };

  const handleDeleteFile = () => {
    setOpen(false);
    setLoading(true);
    invokeRequest({
      method: HttpMethod.DELETE,
      baseURL: PATH_SERVER + `/delete/nginx/${connectionId}`,
      params: { fileName: values.name },
      onSuccess: (res) => {
        setLoading(false);
        refreshData();
        enqueueSnackbar(t(LanguageKey.notify.successDelete), {
          variant: 'success',
          action: (key) => <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />,
        });
      },
      onHandleError: (error) => {
        setLoading(false);
      },
    });
  };

  return (
    <Box>
      <IconButton disabled={loading} onClick={() => setOpen(true)}>
        <Iconify icon={'cuida:edit-outline'} />
        {loading && (
          <CircularProgress
            size={30}
            sx={{ color: 'primary.main', position: 'absolute', zIndex: 1 }}
          />
        )}
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        variant="temporary"
        PaperProps={{
          sx: {
            width: isSmallScreen ? '90%' : '40%',
          },
        }}
      >
        <Box padding={2} display="flex" alignItems="center">
          <IconButton size="large" onClick={() => setOpen(false)}>
            <Iconify icon={'oi:chevron-right'} />
          </IconButton>

          <Box width={'100%'} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{title}</Typography>
            <Box display="flex" gap={1}>
              <ButtonDelete
                color="error"
                variant="outlined"
                handleDelete={handleDeleteFile}
                title={t(LanguageKey.button.delete)}
              />
              <LoadingButton
                onClick={handleUpdateFile}
                disabled={values.content == json}
                color="inherit"
                variant="contained"
              >
                {t(LanguageKey.button.submit)}
              </LoadingButton>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box
          ref={parentRef}
          id="drawer-editor-file"
          sx={(theme) => {
            return {
              backgroundColor: theme.vars.palette.background.paper,
              color: theme.vars.palette.text.primary,
            };
          }}
          height="100%"
        >
          <MonacoEditor
            language="nginx"
            beforeMount={(monaco) => {
              const parentBackgroundColor = rgbaToHex(
                window.getComputedStyle(parentRef?.current!).backgroundColor
              );
              const parentColor = rgbaToHex(window.getComputedStyle(parentRef?.current!).color);
              monaco?.editor?.defineTheme('myCustomTheme', {
                base: 'vs-dark',
                inherit: false,
                rules: [
                  { token: 'keyword', foreground: '#ff0000' },
                  { token: 'variable', foreground: '#00ff00' },
                  { token: 'comment', foreground: '#808080', fontStyle: 'italic' },
                ],
                colors: {
                  'editor.background': parentBackgroundColor,
                  'editor.foreground': parentColor,
                  'editor.lineHighlightBackground': mode == 'dark' ? '#333333' : '#bcb7b7',
                  'editor.selectionBackground': mode == 'dark' ? '#3e9ce9' : '#3e9ce9',
                  'editorCursor.foreground': mode == 'dark' ? '#ffcc00' : 'ffcc00',
                },
              });
            }}
            height={'100%'}
            value={json}
            onChange={(value) => setValue((s) => ({ ...s, content: value }))}
            theme="myCustomTheme"
            options={{
              minimap: { enabled: false },
              automaticLayout: true,
              lineHeight: 1.5,
              wordWrap: 'on',
              padding: { top: 20 },
              lineNumbers: 'off',
              formatOnPaste: true,
            }}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

const AddComponent = ({
  refreshData,
  connectionId,
  title,
}: {
  connectionId: string;
  title: string;
  refreshData: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValue] = useState<{ name?: string; content?: string } | undefined>();
  const theme = useTheme();
  const { mode } = useColorScheme();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Responsive check
  const parentRef = useRef<HTMLDivElement | null>(null);

  const handleUpdateFile = () => {
    setOpen(false);
    setLoading(true);
    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_SERVER + `/update/nginx/${connectionId}`,
      params: { fileName: values?.name, fileContent: values?.content },
      onSuccess: (res) => {
        setLoading(false);
        refreshData();
        enqueueSnackbar(t(LanguageKey.notify.successDelete), {
          variant: 'success',
          action: (key) => <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />,
        });
      },
      onHandleError: (error) => {
        setLoading(false);
      },
    });
  };

  return (
    <Paper
      sx={(theme) => {
        return { textAlign: 'center', padding: 2, color: theme.vars.palette.grey[600] };
      }}
    >
      <IconButton onClick={() => setOpen(true)}>
        <Iconify width={30} icon="lets-icons:file-dock-add-fill" />
        {loading && (
          <CircularProgress
            size={45}
            sx={{ color: 'primary.main', position: 'absolute', zIndex: 1 }}
          />
        )}
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        variant="temporary"
        PaperProps={{
          sx: {
            width: isSmallScreen ? '90%' : '40%',
          },
        }}
      >
        <Box padding={2} display="flex" alignItems="center">
          <IconButton size="large" onClick={() => setOpen(false)}>
            <Iconify icon={'oi:chevron-right'} />
          </IconButton>

          <Box width={'100%'} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{title}</Typography>
            <Box display="flex" gap={1}>
              <LoadingButton
                onClick={handleUpdateFile}
                disabled={!values?.content}
                color="inherit"
                variant="contained"
              >
                {t(LanguageKey.button.submit)}
              </LoadingButton>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box
          ref={parentRef}
          id="drawer-editor-file"
          sx={(theme) => {
            return {
              backgroundColor: theme.vars.palette.background.paper,
              color: theme.vars.palette.text.primary,
            };
          }}
        >
          <Box padding={2}>
            <TextField
              variant="outlined"
              label={t(LanguageKey.nginx.nameFileItem)}
              fullWidth
              onChange={(event) => setValue((s) => ({ ...s, name: event.target.value }))}
              name="fileName"
            />
          </Box>
          <Box
            height="90%"
            sx={(theme) => {
              return {
                margin: 2,
                marginTop: 0,
                padding: 2,
                border: 0.1,
                borderRadius: 2,
                borderColor: theme.vars.palette.grey[700],
              };
            }}
          >
            <Typography variant="subtitle1">{t(LanguageKey.nginx.contentFileItem)}</Typography>
            <Divider sx={{ marginTop: 2 }} />
            <MonacoEditor
              language="nginx"
              beforeMount={(monaco) => {
                const parentBackgroundColor = rgbaToHex(
                  window.getComputedStyle(parentRef?.current!).backgroundColor
                );
                const parentColor = rgbaToHex(window.getComputedStyle(parentRef?.current!).color);
                monaco?.editor?.defineTheme('myCustomTheme', {
                  base: 'vs-dark',
                  inherit: false,
                  rules: [
                    { token: 'keyword', foreground: '#ff0000' },
                    { token: 'variable', foreground: '#00ff00' },
                    { token: 'comment', foreground: '#808080', fontStyle: 'italic' },
                  ],
                  colors: {
                    'editor.background': parentBackgroundColor,
                    'editor.foreground': parentColor,
                    'editor.lineHighlightBackground': mode == 'dark' ? '#333333' : '#bcb7b7',
                    'editor.selectionBackground': mode == 'dark' ? '#3e9ce9' : '#3e9ce9',
                    'editorCursor.foreground': mode == 'dark' ? '#ffcc00' : 'ffcc00',
                  },
                });
              }}
              height={'90%'}
              onChange={(value) => setValue((s) => ({ ...s, content: value }))}
              theme="myCustomTheme"
              options={{
                minimap: { enabled: false },
                automaticLayout: true,
                lineHeight: 1.5,
                padding: { top: 10 },
                wordWrap: 'on',
                lineNumbers: 'off',
                formatOnPaste: true,
              }}
            />
          </Box>
        </Box>
      </Drawer>
    </Paper>
  );
};
