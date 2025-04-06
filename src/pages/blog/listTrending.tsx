import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ListTrendingView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Blog - ${CONFIG.appName}`}</title>
      </Helmet>

      <ListTrendingView />
    </>
  );
}
