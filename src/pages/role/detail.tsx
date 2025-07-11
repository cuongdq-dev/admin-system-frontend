import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { LanguageKey } from 'src/constants';
import { DetailView } from 'src/sections/role/view/index';

// ----------------------------------------------------------------------
export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`${t(LanguageKey.site.listPageTitle)} - ${CONFIG.appName}`}</title>
      </Helmet>

      <DetailView />
    </>
  );
}
