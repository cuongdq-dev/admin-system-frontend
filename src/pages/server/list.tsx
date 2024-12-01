import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ListView } from 'src/sections/server';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`${t('server_list_page')} - ${CONFIG.appName}`}</title>
      </Helmet>

      <ListView />
    </>
  );
}
