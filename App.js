import { View } from 'react-native';
import { SectionNew } from './src/pages/New';
import { StatusBar } from 'expo-status-bar';
import { MainMenu } from './src/components/MainMenu';

export default function App() {
  return (
    <View>
      <StatusBar style="light" />
      <SectionNew />
    </View>
  );
}
