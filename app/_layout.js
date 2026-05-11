import { Stack } from 'expo-router';
import { View } from 'react-native';
import { MainMenu } from '../src/components/MainMenu';

const Layout = () => {
  return (
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
  );
};

export default Layout;
