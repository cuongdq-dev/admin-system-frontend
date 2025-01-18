// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyAsq3up8q3FyBe-Veew21KbWwDQpTU-EtE',
  authDomain: 'admin-system-ck.firebaseapp.com',
  projectId: 'admin-system-ck',
  storageBucket: 'admin-system-ck.firebasestorage.app',
  messagingSenderId: '975169134727',
  appId: '1:975169134727:web:2a58404d150f2f7b56d822',
  measurementId: 'G-TYE37M3C6T',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
