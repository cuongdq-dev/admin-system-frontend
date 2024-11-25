import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { SiteView } from 'src/sections/site/view';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Sites - ${CONFIG.appName}`}</title>
      </Helmet>

      <SiteView />
    </>
  );
}
