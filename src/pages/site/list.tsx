import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { LanguageKey } from 'src/constants';
import { ListView } from 'src/sections/site';

// ----------------------------------------------------------------------
export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`${t(LanguageKey.site.listPageTitle)} - ${CONFIG.appName}`}</title>
      </Helmet>
      <ListView />
    </>
  );
}
