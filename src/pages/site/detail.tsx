import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { LanguageKey } from 'src/constants';
import { DetailView } from 'src/sections/site';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`${t(LanguageKey.server.detailPageTitle)} - ${CONFIG.appName}`}</title>
      </Helmet>

      <DetailView />
    </>
  );
}
