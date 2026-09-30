import { Stack } from 'expo-router';
import { View } from 'react-native';
import { MainMenu } from '../src/components/MainMenu';
import { AuthProvider } from '../src/contextAuth';

const Layout = () => {
  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
        <MainMenu />
      </View>
    </AuthProvider>
  );
};

export default Layout;
