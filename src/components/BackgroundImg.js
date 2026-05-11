import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';

const BackgroundImg = ({ defaultImg, initialMovieDB, useData }) => {
  const movieDB = useData();
  const windowHeight = Dimensions.get('window').height;

  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    if (initialMovieDB) {
      if (initialMovieDB?.fixedBackdrop) {
        setImageUri(initialMovieDB?.fixedBackdrop);
      } else {
        setImageUri(defaultImg);
      }
    }
  }, [initialMovieDB]);

  useEffect(() => {
    if (movieDB?.fixedBackdrop) {
      if (movieDB.fixedBackdrop !== imageUri) {
        setImageUri(movieDB.fixedBackdrop);
      }
    }
  }, [movieDB]);

  return (
    <View style={{ width: '100%', position: 'absolute', height: windowHeight }}>
      <Image
        source={{ uri: imageUri?.replace('original', 'w92'), cache: 'force-cached' }}
        contentFit="cover"
        transition={1000}
        style={[
          {
            width: '100%',
            height: windowHeight,
          },
        ]}
      />
      {/* <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(1, 1, 1, 0.25)' }}></View> */}
    </View>
  );
};
BackgroundImg.displayName = 'BackgroundImg';
export { BackgroundImg };
