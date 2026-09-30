import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './conection';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // true hasta que Firebase termina de leer la sesión guardada en el dispositivo
  const [initializing, setInitializing] = useState(true);
  // aumenta cada vez que se intenta abrir otra pestaña sin sesión
  const [blockedAttempts, setBlockedAttempts] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setInitializing(false);
      if (newUser) setBlockedAttempts(0);
    });
    return unsubscribe;
  }, []);

  const notifyBlocked = () => setBlockedAttempts((prev) => prev + 1);

  return <AuthContext.Provider value={{ user, initializing, blockedAttempts, notifyBlocked }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
