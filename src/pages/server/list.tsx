import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { LanguageKey } from 'src/constants';
import { ListView } from 'src/sections/server';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`${t(LanguageKey.server.listPageTitle)} - ${CONFIG.appName}`}</title>
      </Helmet>

      <ListView />
    </>
  );
}
