import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ListView } from 'src/sections/book/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Book - ${CONFIG.appName}`}</title>
      </Helmet>

      <ListView />
    </>
  );
}
