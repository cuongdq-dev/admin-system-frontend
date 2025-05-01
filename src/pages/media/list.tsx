import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ListView } from 'src/sections/media';

// ----------------------------------------------------------------------
export default function Page() {
  return (
    <>
      <Helmet>
        <title>{CONFIG.appName}</title>
      </Helmet>
      <ListView />
    </>
  );
}
