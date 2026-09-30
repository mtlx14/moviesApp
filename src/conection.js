// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
// Guarda la sesión en el dispositivo para no tener que iniciar sesión cada vez que se abre la app
export const auth = Platform.OS === 'web' ? getAuth(app) : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
export default getFirestore();
