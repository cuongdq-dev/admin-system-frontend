import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { FormView } from 'src/sections/book/view/form-view';

// ----------------------------------------------------------------------

export default function Page() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const slug = pathSegments[pathSegments.length - 1];
  return (
    <>
      <Helmet>
        <title> {`Book - ${CONFIG.appName}`}</title>
      </Helmet>

      <FormView slug={slug} />
    </>
  );
}
