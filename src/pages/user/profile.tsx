import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { LanguageKey } from 'src/constants';
import ProfileView from 'src/sections/user/view/profile-view';
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`${t(LanguageKey.user.profileTitle)} - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProfileView />
    </>
  );
}
