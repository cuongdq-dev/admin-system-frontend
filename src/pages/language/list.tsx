import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { LanguageKey } from 'src/constants';

import { ListView } from 'src/sections/language';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`${t(LanguageKey.language.tableTitle)} - ${CONFIG.appName}`}</title>
      </Helmet>
      <ListView />
    </>
  );
}
