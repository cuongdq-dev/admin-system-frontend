// material
import { Button, Divider, Stack, Typography } from '@mui/material';

// component
import { t } from 'i18next';
import { Iconify } from '../../components/iconify';
import { LanguageKey } from 'src/constants';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  return (
    <>
      <Stack direction="row" justifyContent="center" spacing={2}>
        <Button size="large" color="inherit">
          <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
        </Button>

        <Button size="large" color="inherit">
          <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
        </Button>

        <Button size="large" color="inherit">
          <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t(LanguageKey.common.or)}
        </Typography>
      </Divider>
    </>
  );
}
