import { Dimensions } from 'react-native';
import { memo, useEffect, useState } from 'react';
import Animated, { LinearTransition, useSharedValue, withDelay, withSequence, withSpring } from 'react-native-reanimated';
import { TextType2 } from './TextType2';
import { BlurView } from 'expo-blur';

const windowWidth = Dimensions.get('window').width;

const texts = {
  add_discard: 'Película descartada',
  add_library: 'Película agregada a la biblioteca',
  add_playlist: 'Película agregada a la playlist',
  add_watched: 'Agregada a películas vistas',
  add_watched_2: 'Agregada a películas vistas con Aylin',
  add_playlist_2: `Película agregada a 'Ver con Aylin'`,
  remove_discard: '---',
  remove_library: 'Película quitada de la biblioteca',
  remove_playlist: 'Película quitada de la playlist',
  remove_watched: 'Quitada de películas vistas',
  remove_watched_2: 'Quitada de películas vistas con Aylin',
  remove_playlist_2: `Película quitada de 'Ver con Aylin'`,
};

const isRecent = (date) => Date.now() - date <= 2000;

const NotificationBubble = memo(({ top, useData }) => {
  const getMovieDB = useData();

  const movieDB = getMovieDB ? ('changes' in getMovieDB ? getMovieDB.changes : getMovieDB) : [];

  const [metaData, setMetaData] = useState(['', 'Película agregada a la biblioteca']);

  const opacityR = useSharedValue(0);
  const opacityR2 = useSharedValue(0);
  const marginLeftR = useSharedValue(50);

  let backgroundColor = metaData[0] === 'success' ? 'rgba(0, 255, 128, 0.6)' : metaData[0] === 'error' ? 'rgba(255, 0, 0, 0.6)' : 'rgba(1,1,1,0)';
  useEffect(() => {
    if (movieDB) {
      // if (movieDB && (movieDB?.lastListChange || movieDB?.lastPosterChangeDate)) {
      if (isRecent(movieDB?.lastListChangeDate)) {
        setMetaData([
          (movieDB.lastListChange.includes('add') || movieDB.lastListChange === 'remove_discard') && movieDB.lastListChange !== 'add_discard' ? 'success' : 'error',
          texts[movieDB.lastListChange],
        ]);
      } else if (isRecent(movieDB?.lastPosterChangeDate)) {
        setMetaData(['success', `${movieDB.lastPosterChangeType === 'poster' ? 'Poster' : 'Fondo'} fijado`]);
      } else if (isRecent(movieDB?.lastTrailerImgChangeDate)) {
        setMetaData(['success', `Imagen de trailer fijada`]);
      } else {
        return;
      }

      opacityR.value = withSequence(withSpring(1, { duration: 400 }), withDelay(1200, withSpring(0, { duration: 400 })));
      marginLeftR.value = withSequence(withDelay(50, withSpring(0, { duration: 500 })), withDelay(1100, withSpring(-50, { duration: 500 })), withSpring(50));
      opacityR2.value = withSpring(10, { duration: 1 });
    }
  }, [movieDB]);
  return (
    <Animated.View
      style={{
        opacity: opacityR,
        marginLeft: marginLeftR,
        position: 'absolute',
        top: top,
        left: 0,
        width: windowWidth,
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          opacity: opacityR2,
          backgroundColor: backgroundColor,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 20,
        }}
        // layout={LinearTransition.springify().damping(80).stiffness(200)}
      >
        <BlurView
          intensity={60}
          style={{
            opacity: 1,
            backgroundColor: 'rgba(1, 1, 1, 0.1)',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        ></BlurView>
        <Animated.View style={{ opacity: opacityR2 }}>
          <TextType2
            addStyle={{
              color: 'white',
              paddingVertical: 6,
              paddingHorizontal: 10,
              textShadowColor: 'rgba(1,1,1,0.3)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            }}
          >
            {metaData[1]}
          </TextType2>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
});

NotificationBubble.displayName = 'NotificationBubble';
export { NotificationBubble };
