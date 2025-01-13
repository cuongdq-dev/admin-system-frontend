import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DetailView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Blog - ${CONFIG.appName}`}</title>
      </Helmet>

      <DetailView />
    </>
  );
}
