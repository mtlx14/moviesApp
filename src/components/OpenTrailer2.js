import { View, Pressable, Linking } from 'react-native';
import { Image } from 'expo-image';
import { TextType1 } from './TextType1';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { memo, useEffect } from 'react';
import Animated, { FadeInDown, withSpring, useSharedValue } from 'react-native-reanimated';

const OpenTrailer2 = memo(({ defaultImg, trailerLink, mt, useData }) => {
  const defaultImg2 = require('../../assets/images/icon--noImg.png');

  const movieDB = useData();

  const img_url = `${movieDB?.fixedTrailerImg || defaultImg || defaultImg2}`.replace('original', 'w780');
  const lq_img_url = `${movieDB?.fixedTrailerImg || defaultImg || defaultImg2}`.replace('original', 'w92');

  const openTrailer = async (trailerLink) => {
    try {
      const supported = await Linking.canOpenURL(trailerLink);
      if (supported) {
        await Linking.openURL(trailerLink);
        return;
      }
    } catch (err) {
      console.error(`Error al intentar abrir`, err);
    }

    console.error('No se pudo abrir el enlace');
  };

  return (
    <Animated.View style={{ width: '100%', paddingHorizontal: 20 }}>
      <Animated.View style={{ marginTop: mt }}>
        <Animated.View style={{ position: 'relative' }}>
          <Pressable onPress={() => openTrailer(trailerLink)}>
            <View
              style={{
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <Image
                source={{ uri: img_url, cache: 'force-cached' }}
                contentFit="cover"
                placeholder={{ uri: lq_img_url, cache: 'force-cached' }}
                placeholderContentFit="cover"
                style={{
                  width: '100%',
                  aspectRatio: 16 / 6.5,

                  borderRadius: 10,
                }}
                // onLoad={handleStartImageLoad}
              />

              <LinearGradient
                colors={['rgba(20,20,20,0.0)', 'rgba(0, 0, 0, 0.7)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0, y: 1 }}
                style={[{ height: '100%', position: 'absolute', width: '100%', alignItems: 'center' }]}
                locations={[0, 1]}
              ></LinearGradient>
              <View style={{ position: 'absolute', bottom: 10, right: 5, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 }}>
                <BlurView style={{ position: 'absolute', borderRadius: 40, overflow: 'hidden', width: '100%', height: 25, backgroundColor: 'rgba(255,255,255,0.3)' }} intensity={15}></BlurView>
                <TextType1 addStyle={{ marginLeft: 8 }}>Ver trailer</TextType1>
                <Image style={{ width: 12, height: 12, paddingLeft: 2, marginRight: 8 }} source={require('../../assets/images/icon--play.png')}></Image>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
});

OpenTrailer2.displayName = 'OpenTrailer2';
export { OpenTrailer2 };
