import { Stack } from 'expo-router';

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
    </Stack>
  );
};

export default Layout;
