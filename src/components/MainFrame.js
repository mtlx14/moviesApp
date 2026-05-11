import { View } from 'react-native';
import { styles } from '../style';
import { LinearGradient } from 'expo-linear-gradient';
import { constantsAndInfo } from '../constantsAndInfo';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

export function MainFrame({ children }) {
  return (
    <View style={styles.mainFrame}>
      <StatusBar style="light" />

      <LinearGradient colors={[constantsAndInfo.backgroundColor1, constantsAndInfo.backgroundColor2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.background} pointerEvents="auto">
        {children}
      </LinearGradient>
    </View>
  );
}
