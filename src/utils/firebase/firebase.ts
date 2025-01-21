import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { firebaseConfig } from '../../constants';
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestFirebaseToken = () => {
  return Notification.requestPermission()
    .then((value) => {
      if (value == 'granted') {
        return getToken(messaging, { vapidKey: import.meta.env.VITE_TOKEN_API_KEY });
      } else {
        return undefined;
      }
    })
    .catch(() => {
      return undefined;
    });
};
