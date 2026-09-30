import { Tabs } from 'expo-router';

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: 'none' },
        headerShown: false,
        // unmountOnBlur: true,
      }}
    >
      <Tabs.Screen name="new" />
      <Tabs.Screen name="movie" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="serie" />
      <Tabs.Screen name="user" />
    </Tabs>
  );
};

export default Layout;
