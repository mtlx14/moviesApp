import { Redirect } from 'expo-router';
import { useAuth } from '../src/contextAuth';

const StartPage = () => {
  const { user, initializing } = useAuth();

  // Espera a saber si hay una sesión guardada antes de decidir a dónde ir
  if (initializing) return null;

  return <Redirect href={user ? '/new' : '/user'} />;
};

export default StartPage;
