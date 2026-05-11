import { Pressable, Image } from 'react-native';
import { styles } from '../style';
import { BlurView } from 'expo-blur';
import Animated from 'react-native-reanimated';
import { memo } from 'react';
import { BackIcon } from '../SVGS';

const ButtonGoBack = memo(({ onPress, opacityBlur = 1 }) => {
  return (
    // <Link href="/" asChild>
    <Pressable onPress={onPress} style={styles.buttonGoBack}>
      <Animated.View style={{ opacity: opacityBlur, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.3)' }}>
        <BlurView style={{ width: '100%', height: '100%' }} intensity={20}>
          <BackIcon width={35} height={35} fill="#ffffff" />
        </BlurView>
      </Animated.View>
    </Pressable>
    // </Link>
  );
});

ButtonGoBack.displayName = 'ButtonGoBack';
export { ButtonGoBack };
