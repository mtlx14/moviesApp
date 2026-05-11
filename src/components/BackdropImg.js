import { memo, useEffect, useState } from 'react';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

import { Dimensions } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import db from '../conection';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BackdropImg = memo(({ defaultImg, initialMovieDB, useData }) => {
  const [imageUri, setImageUri] = useState(null);

  const movieDB = useData();

  const startImageOpacity = useSharedValue(0);
  const startImageMargin = useSharedValue(20);
  const handleStartImageLoad = () => {
    startImageOpacity.value = withSpring(1, { duration: 1000, dampingRatio: 0.8 });
    startImageMargin.value = withSpring(0, { duration: 1000, dampingRatio: 1.2 });
  };

  useEffect(() => {
    if (initialMovieDB) {
      if (initialMovieDB?.fixedBackdrop) {
        setImageUri(initialMovieDB?.fixedBackdrop);
      } else {
        setImageUri(defaultImg);
      }
    } else {
      setImageUri(defaultImg);
    }
  }, [initialMovieDB]);

  useEffect(() => {
    if (movieDB?.fixedBackdrop) {
      if (movieDB.fixedBackdrop !== imageUri) {
        setImageUri(movieDB.fixedBackdrop);
      }
    }
  }, [movieDB]);

  const backdropLeft = movieDB?.backdropXPosition != null ? -windowWidth * movieDB.backdropXPosition : -windowWidth * 0.5;
  return (
    <Animated.Image
      source={{ uri: imageUri }}
      resizeMode="cover"
      onLoad={handleStartImageLoad}
      style={{
        // top: 0,
        left: backdropLeft,
        position: 'absolute',
        height: windowHeight * 0.55,
        width: windowWidth * 2,
        opacity: startImageOpacity,
        top: startImageMargin,
        objectFit: 'cover',
      }}
    ></Animated.Image>
  );
});

BackdropImg.displayName = 'BackdropImg';
export { BackdropImg };
