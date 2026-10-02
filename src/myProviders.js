import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import db from './conection';
import { constantsAndInfo } from './constantsAndInfo';

// mis suscripciones se guardan en la colección 'settings', documento 'subscriptions' → { providers: [...] }
const myProvidersRef = doc(db, 'settings', 'subscriptions');

// valor por defecto hasta que llega la db (y con el que se crea el documento si no existe)
let myProviders = [...constantsAndInfo.myProviders];
const listeners = new Set();

export const getMyProviders = () => myProviders;

export const listenMyProviders = () =>
  onSnapshot(
    myProvidersRef,
    (snap) => {
      if (snap.exists()) {
        myProviders = snap.data().providers ?? [];
        listeners.forEach((listener) => listener(myProviders));
      } else {
        setDoc(myProvidersRef, { providers: myProviders });
      }
    },
    (error) => console.warn('Error al obtener mis suscripciones:', error),
  );

export const saveMyProviders = (providers) => setDoc(myProvidersRef, { providers });

// para componentes que deben volver a renderizarse cuando cambian mis suscripciones
export function useMyProviders() {
  const [providers, setProviders] = useState(myProviders);
  useEffect(() => {
    listeners.add(setProviders);
    setProviders(myProviders);
    return () => listeners.delete(setProviders);
  }, []);
  return providers;
}
