// Import Firebase libraries
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAsq3up8q3FyBe-Veew21KbWwDQpTU-EtE',
  authDomain: 'admin-system-ck.firebaseapp.com',
  projectId: 'admin-system-ck',
  storageBucket: 'admin-system-ck.firebasestorage.app',
  messagingSenderId: '975169134727',
  appId: '1:975169134727:web:2a58404d150f2f7b56d822',
  measurementId: 'G-TYE37M3C6T',
};

firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  // Show the notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});
