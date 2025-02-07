import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ListView } from 'src/sections/site/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Sites - ${CONFIG.appName}`}</title>
      </Helmet>

      <ListView />
    </>
  );
}
