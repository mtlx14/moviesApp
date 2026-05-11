import { View, Pressable, Linking } from 'react-native';
import { Image } from 'expo-image';
import { TextType1 } from './TextType1';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { memo, useEffect, useState } from 'react';
import Animated, { FadeInDown, withSpring, useSharedValue } from 'react-native-reanimated';

import { doc, getDoc } from 'firebase/firestore';
import db from '../conection';

const OpenTrailer = memo(({ defaultImg, trailerLink, initialMovieDB, useData }) => {
  const defaultImg2 = require('../../assets/images/icon--noImg.png');

  const movieDB = useData();

  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    if (initialMovieDB) {
      if (initialMovieDB?.fixedTrailerImg) {
        setImageUri(initialMovieDB?.fixedTrailerImg);
      } else {
        setImageUri(defaultImg);
      }
    }
  }, [initialMovieDB]);

  useEffect(() => {
    if (movieDB?.fixedTrailerImg) {
      if (movieDB.fixedTrailerImg !== imageUri) {
        setImageUri(movieDB.fixedTrailerImg);
      }
    }
  }, [movieDB]);

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
  const imageOpacity = useSharedValue(0);
  const imageMargin = useSharedValue(5);
  const handleStartImageLoad = () => {
    imageOpacity.value = withSpring(1, { duration: 1000, dampingRatio: 0.8 });
    imageMargin.value = withSpring(0, { duration: 1000, dampingRatio: 1.2 });
  };

  return (
    <Animated.View style={{ width: '40%', height: '100%' }}>
      <Animated.View
        style={{
          position: 'relative',

          marginLeft: 8,
        }}
      >
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
            <Animated.Image
              source={{ uri: imageUri?.replace('original', 'w342'), cache: 'force-cached' }}
              contentFit="cover"
              style={{
                width: '100%',
                position: 'relative',
                height: '100%',
                opacity: imageOpacity,
                top: imageMargin,

                borderRadius: 10,
              }}
              onLoad={handleStartImageLoad}
            />

            <LinearGradient
              colors={['rgba(20,20,20,0.0)', 'rgba(0, 0, 0, 0.7)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 0, y: 1 }}
              style={[{ height: '100%', position: 'absolute', width: '100%', alignItems: 'center' }]}
              locations={[0, 1]}
            ></LinearGradient>
            <View style={{ position: 'absolute', bottom: 8, right: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 3 }}>
              <BlurView style={{ position: 'absolute', borderRadius: 40, overflow: 'hidden', width: '100%', height: 20, backgroundColor: 'rgba(255,255,255,0.3)' }} intensity={15}></BlurView>
              <TextType1 addStyle={{ marginLeft: 8, fontSize: 12 }}>Ver trailer</TextType1>
              <Image style={{ width: 10, height: 10, paddingLeft: 1, marginRight: 6 }} source={require('../../assets/images/icon--play.png')}></Image>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
});

OpenTrailer.displayName = 'OpenTrailer';
export { OpenTrailer };
