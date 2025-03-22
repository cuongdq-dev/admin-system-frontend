import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { LanguageKey } from 'src/constants';
import { IndexingListView } from 'src/sections/google/index';

// ----------------------------------------------------------------------
export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`${t(LanguageKey.common.listTitle)} - ${CONFIG.appName}`}</title>
      </Helmet>
      <IndexingListView />
    </>
  );
}
