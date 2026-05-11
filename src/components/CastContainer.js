import { Dimensions, View, Image, ScrollView, Pressable } from 'react-native';

import { TextType1 } from './TextType1';
import { TextType2 } from './TextType2';
import { memo } from 'react';
import Animated, { useSharedValue, withSpring, FadeInDown } from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';

function CastItem({ cast, castCant, sendBg }) {
  const pathname = usePathname();
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;
  const castReturn = [];

  const imageOpacity = useSharedValue(0);
  const imageMargin = useSharedValue(30);
  const handleImageLoad = () => {
    imageOpacity.value = withSpring(1, { duration: 1000, dampingRatio: 0.8 });
    imageMargin.value = withSpring(0, { duration: 1000, dampingRatio: 1.2 });
  };
  const handleOnPress = ({ cast_id }) => {
    router.push({
      pathname: `${pathname.split('/')[1]}/screenCastDetails/[id]`,
      params: {
        id: cast_id,
        bg: sendBg,
      },
    });
  };

  const itemWidth = castCant ? ((windowWidth - 40) * 0.82) / 5 : (windowWidth - 40) * 0.18;
  for (let i = 0; i < cast.length && i < (castCant || 1); i++) {
    castReturn.push(
      <Pressable key={i} style={{ width: itemWidth, alignItems: 'center' }} onPress={() => handleOnPress({ cast_id: cast[i].id })}>
        {cast[i].img &&
          (cast[i].img.includes('null') ? (
            <View style={{ width: 55, height: 70, borderRadius: 8, marginBottom: 5, backgroundColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <Image source={require('../../assets/images/icon--userFull.png')} style={{ width: 30, height: 30, opacity: 0.3 }} />
            </View>
          ) : (
            <Animated.Image
              source={{ uri: `${cast[i].img.replace('w500', 'w185')}` }}
              contentFit="cover"
              style={{ position: 'relative', width: 55, height: 70, borderRadius: 8, marginBottom: 5, top: imageMargin, opacity: imageOpacity }}
              onLoad={handleImageLoad}
            />
          ))}

        <TextType2 numberOfLines={2}>{cast[i].name}</TextType2>
      </Pressable>,
    );
  }
  return <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>{castReturn}</View>;
}
const CastContainer = memo(({ director = [], cast = [], addStyle, castCant, sendBg }) => {
  let directorText = director[0]?.job === 'creator' ? 'Creador:' : director[0]?.job === 'writer' ? 'Escritor:' : 'Director:';
  return (
    <Animated.View style={{ flexDirection: 'row' }} entering={FadeInDown.springify().damping(80).stiffness(50)}>
      {director.length > 0 && (
        <View>
          <TextType1 addStyle={{ textAlign: 'flex-start', marginLeft: 5 }}>{directorText}</TextType1>
          <CastItem cast={director} sendBg={sendBg} />
        </View>
      )}
      {cast.length > 0 && (
        <View>
          <TextType1 addStyle={{ textAlign: 'flex-start', marginLeft: 5 }}>Reparto:</TextType1>
          {castCant > 5 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <CastItem cast={cast} castCant={castCant} sendBg={sendBg} />
            </ScrollView>
          ) : (
            <CastItem cast={cast} castCant={castCant} sendBg={sendBg} />
          )}
        </View>
      )}
    </Animated.View>
  );
});

CastContainer.displayName = 'CastContainer';

export { CastContainer };
