import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { FormView } from 'src/sections/blog/view/form-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Blog - ${CONFIG.appName}`}</title>
      </Helmet>

      <FormView />
    </>
  );
}
