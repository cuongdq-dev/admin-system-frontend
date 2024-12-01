import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ListView } from 'src/sections/language';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`${t('language_table_title')} - ${CONFIG.appName}`}</title>
      </Helmet>
      <ListView />
    </>
  );
}
