// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: 'AIzaSyCUNb8K-VrsgSz19KrapixfEzx-5lAX6vo',
  authDomain: 'movieapp-9ab40.firebaseapp.com',
  projectId: 'movieapp-9ab40',
  storageBucket: 'movieapp-9ab40.firebasestorage.app',
  messagingSenderId: '916453898403',
  appId: '1:916453898403:web:905d0cfcbf316b09b52716',
  measurementId: 'G-LCNGP49DQT',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();
