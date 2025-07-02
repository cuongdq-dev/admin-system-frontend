import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { LanguageKey } from 'src/constants';
import { ListView } from 'src/sections/logs/view/list';

// ----------------------------------------------------------------------
export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`${t(LanguageKey.batchLogs.listPageTitle)} - ${CONFIG.appName}`}</title>
      </Helmet>
      <ListView />
    </>
  );
}
