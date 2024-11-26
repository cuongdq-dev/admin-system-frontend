import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LanguageView } from 'src/sections/language/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Languages - ${CONFIG.appName}`}</title>
      </Helmet>
      <LanguageView />
    </>
  );
}
