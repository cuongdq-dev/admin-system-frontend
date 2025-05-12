import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { FormView } from 'src/sections/book/view/form-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Book - ${CONFIG.appName}`}</title>
      </Helmet>

      <FormView />
    </>
  );
}
