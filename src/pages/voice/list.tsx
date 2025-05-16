import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ListView } from 'src/sections/book-voice/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Voice - ${CONFIG.appName}`}</title>
      </Helmet>

      <ListView />
    </>
  );
}
