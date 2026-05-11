import { Stack } from 'expo-router';
import { View } from 'react-native';

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerTitle: '',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen name="screenMovieDetails/[id]" options={{ animation: 'fade_from_bottom', headerBackVisible: false, headerBackTitleVisible: false }} />
      <Stack.Screen name="screenSerieDetails/[id]" options={{ animation: 'fade_from_bottom', headerBackVisible: false, headerBackTitleVisible: false }} />
      <Stack.Screen name="screenCastDetails/[id]" options={{ animation: 'fade_from_bottom', headerBackVisible: false, headerBackTitleVisible: false }} />
    </Stack>
  );
};

export default Layout;
