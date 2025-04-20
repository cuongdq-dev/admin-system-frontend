import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CreateView } from 'src/sections/blog/view/create-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Blog - ${CONFIG.appName}`}</title>
      </Helmet>

      <CreateView />
    </>
  );
}
