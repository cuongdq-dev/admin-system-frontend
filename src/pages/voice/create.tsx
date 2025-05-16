import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DetailView } from 'src/sections/book-voice/view/detail-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Voice - ${CONFIG.appName}`}</title>
      </Helmet>

      <DetailView />
    </>
  );
}
