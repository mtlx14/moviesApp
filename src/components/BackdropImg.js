import { memo, useEffect, useState } from 'react';
import Animated, { FadeInDown, useSharedValue, withSpring } from 'react-native-reanimated';

import { Dimensions, Image } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Si Firestore no responde en este tiempo, se usa la imagen de TMDB igual
const FIRESTORE_TIMEOUT = 2000;

const BackdropImg = memo(({ defaultImg, initialMovieDB, useData, placeholderImg, placeholderLib }) => {
  const [imageUri, setImageUri] = useState(null);

  const movieDB = useData();

  const startImageOpacity = useSharedValue(0);
  const startImageMargin = useSharedValue(20);
  const handleStartImageLoad = () => {
    startImageOpacity.value = withSpring(1, { duration: 1000, dampingRatio: 0.8 });
    startImageMargin.value = withSpring(0, { duration: 1000, dampingRatio: 1.2 });
  };

  // La foto grande se pide recién cuando se sabe si hay un fondo guardado en Firestore,
  // así no aparece la de TMDB para luego cambiar de golpe a la guardada
  useEffect(() => {
    if (initialMovieDB) {
      if (initialMovieDB?.fixedBackdrop) {
        setImageUri(initialMovieDB?.fixedBackdrop);
      } else {
        setImageUri(defaultImg);
      }
      return;
    }
    const timeout = setTimeout(() => setImageUri((prev) => prev || defaultImg), FIRESTORE_TIMEOUT);
    return () => clearTimeout(timeout);
  }, [initialMovieDB]);

  useEffect(() => {
    if (movieDB?.fixedBackdrop) {
      if (movieDB.fixedBackdrop !== imageUri) {
        setImageUri(movieDB.fixedBackdrop);
      }
    }
  }, [movieDB]);

  const backdropLeft = movieDB?.backdropXPosition != null ? -windowWidth * movieDB.backdropXPosition : -windowWidth * 0.5;

  // Fondo desenfocado inmediato: la imagen que ya se vio en la lista (está en caché).
  // Se dibuja con el mismo componente que usó la lista, porque cada uno tiene su propia caché.
  const placeholderStyle = { position: 'absolute', left: 0, top: 0, width: windowWidth, height: windowHeight * 0.55 };
  let placeholder = null;
  if (placeholderImg && placeholderLib === 'expo') {
    placeholder = <ExpoImage source={{ uri: placeholderImg }} blurRadius={10} contentFit="cover" style={placeholderStyle} />;
  } else if (placeholderImg) {
    placeholder = <Image source={{ uri: placeholderImg, cache: 'force-cached' }} blurRadius={10} resizeMode="cover" style={placeholderStyle} />;
  } else if (imageUri?.includes('/original/')) {
    // sin imagen de la lista: versión liviana de la foto
    placeholder = (
      <Image
        source={{ uri: imageUri.replace('/original/', '/w300/') }}
        blurRadius={10}
        resizeMode="cover"
        style={{ left: backdropLeft, position: 'absolute', height: windowHeight * 0.55, width: windowWidth * 2, top: 0 }}
      />
    );
  }

  return (
    <>
      {placeholder && (
        // entra igual que el resto del contenido de la página
        <Animated.View entering={FadeInDown.springify().damping(80).stiffness(50)} style={{ position: 'absolute', left: 0, top: 0, width: windowWidth, height: windowHeight * 0.55 }}>
          {placeholder}
        </Animated.View>
      )}
      {imageUri && (
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
      )}
    </>
  );
});

BackdropImg.displayName = 'BackdropImg';
export { BackdropImg };
