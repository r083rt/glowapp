// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCBh87AC_s9CDsd7qKcYsTq-DHYChPohWQ',
  authDomain: 'rn-glow-app.firebaseapp.com',
  projectId: 'rn-glow-app',
  storageBucket: 'rn-glow-app.appspot.com',
  messagingSenderId: '930098300182',
  appId: '1:930098300182:web:4bb07827ac2f7902f07c37',
  measurementId: 'G-SP6QZ8SNYP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
