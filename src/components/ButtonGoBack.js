import { Pressable, StyleSheet } from 'react-native';
import { styles } from '../style';
import { BlurView } from 'expo-blur';
import Animated from 'react-native-reanimated';
import { memo } from 'react';
import { BackIcon } from '../SVGS';

const ButtonGoBack = memo(({ onPress, opacityBlur = 1 }) => {
  return (
    <Pressable onPress={onPress} style={styles.buttonGoBack}>
      <Animated.View
        style={{
          opacity: opacityBlur,
          ...StyleSheet.absoluteFill,
          backgroundColor: 'rgba(255,255,255,0.3)',
        }}
      >
        <BlurView style={{ width: '100%', height: '100%' }} intensity={20} />
      </Animated.View>
      <BackIcon width={35} height={35} fill="#ffffff" />
    </Pressable>
  );
});

ButtonGoBack.displayName = 'ButtonGoBack';
export { ButtonGoBack };
