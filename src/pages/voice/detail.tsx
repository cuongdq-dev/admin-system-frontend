import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { DetailView } from 'src/sections/book-voice/view/detail-view';

// ----------------------------------------------------------------------

export default function Page() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const slug = pathSegments[pathSegments.length - 1];
  return (
    <>
      <Helmet>
        <title> {`Voice - ${CONFIG.appName}`}</title>
      </Helmet>

      <DetailView slug={slug} />
    </>
  );
}
