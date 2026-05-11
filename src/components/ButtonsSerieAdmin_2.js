import { memo, use, useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { TextType2 } from './TextType2.js';
import db from '../conection.js';
import { arrayRemove, arrayUnion, doc, setDoc } from 'firebase/firestore';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { BookmarkerEmptyIcon, BookmarkerFullIcon, CheckIcon, CloseIcon, HeartEmptyIcon, HeartFullIcon, PopCornEmptyIcon, PopCornFullIcon } from '../SVGS.js';

const _imgSize = 13;
const _opacity = 0.8;

const imgSrc = {
  discard: <CloseIcon width={_imgSize} height={_imgSize} />,
  library: <BookmarkerEmptyIcon width={_imgSize} height={_imgSize} />,
  playlist: <HeartEmptyIcon width={_imgSize} height={_imgSize} />,
  watched: <CheckIcon width={_imgSize} height={_imgSize} />,
  watched_2: <CheckIcon width={_imgSize} height={_imgSize} />,
  watched_22: <CheckIcon width={_imgSize} height={_imgSize} />,
  playlist_2: <PopCornEmptyIcon width={_imgSize} height={_imgSize} />,
  discard2: <CloseIcon width={_imgSize} height={_imgSize} />,
  library2: <BookmarkerFullIcon width={_imgSize} height={_imgSize} />,
  playlist2: <HeartFullIcon width={_imgSize} height={_imgSize} />,
  watched2: <CheckIcon width={_imgSize} height={_imgSize} />,
  playlist_22: <PopCornFullIcon width={_imgSize} height={_imgSize} />,
};
const text = {
  discard: 'Descartar',
  library: 'Biblioteca',
  playlist: 'Playlist',
  watched: 'Ya la vi',
  watched_2: 'La vi con Aylin',
  playlist_2: 'La estoy viendo',
};

const colors = {
  watched: { background: 'rgba(0, 193, 97, 0.2)', color: 'rgba(0,193,97,1)' },
  watched_2: { background: 'rgba(193, 0, 30, 0.2)', color: 'rgb(193, 0, 30)' },
  library: { background: 'rgba(94, 51, 226, 0.2)', color: 'rgba(94,51,226,1)' },
  discard: { background: 'rgba(0, 72, 255, 0.2)', color: 'rgba(0,72,255,1)' },
  playlist: { background: 'rgba(255, 0, 111, 0.2)', color: 'rgba(255,0,111,1) ' },
  playlist_2: { background: 'rgba(0, 146, 199, 0.2)', color: 'rgba(0,146,199,1)' },
};

const ItemToRender = memo(({ renderName, pressed, handleOnPress, enableEntering }) => {
  const background_sv = useSharedValue(pressed ? colors[renderName].background : 'rgba(255,255,255,0.05)');
  const shadowColor_sv = useSharedValue(pressed ? colors[renderName].color : 'rgba(255,255,255,0.05)');
  const base_bg = useSharedValue(pressed ? 'rgba(100,100,100,0.1)' : 'rgba(255,255,255,0.1)');

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: background_sv.value,
      shadowColor: shadowColor_sv.value,
    };
  });

  const baseAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: base_bg.value,
    };
  });

  useEffect(() => {
    if (pressed) {
      background_sv.value = !enableEntering ? colors[renderName].background : withDelay(50, withTiming(colors[renderName].background, { duration: 200, dampingRatio: 1 }));
      shadowColor_sv.value = !enableEntering ? colors[renderName].color : withDelay(50, withTiming(colors[renderName].color, { duration: 200, dampingRatio: 1 }));
      base_bg.value = !enableEntering ? 'rgba(100,100,100,.1)' : withDelay(50, withTiming('rgba(100,100,100,.1)', { duration: 200, dampingRatio: 1 }));
    } else {
      background_sv.value = 'rgba(255,255,255,0.05)';
      shadowColor_sv.value = 'rgba(255,255,255,0.05)';
      base_bg.value = 'rgba(255,255,255,.1)';
    }
  }, [pressed, renderName]);

  let color = 'white';
  let image = imgSrc[renderName];
  let fontWeight = 400;
  let opacity = _opacity;
  let shadowOpacity = 0;

  if (pressed) {
    image = imgSrc[`${renderName}2`];
    fontWeight = 500;
    opacity = 0.9;
    shadowOpacity = 0.6;
  }
  return (
    <Pressable
      onPress={() => handleOnPress({ render: renderName })}
      pointerEvents="auto"
      style={[
        {
          flex: 1,
        },
      ]}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            borderRadius: 8,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: shadowOpacity,
            shadowRadius: 1,
          },
          backgroundAnimatedStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: 8,
            },
            baseAnimatedStyle,
          ]}
        ></Animated.View>
        <View style={{ opacity: opacity, marginTop: 5 }}>{image}</View>

        <TextType2 addStyle={{ fontSize: 12, color: color, opacity: opacity, fontWeight: fontWeight, marginBottom: 5 }}>{text[renderName]}</TextType2>
      </Animated.View>
    </Pressable>
  );
});

ItemToRender.displayName = 'ItemToRender';

const ButtonsSerieAdmin_2 = memo(({ spaces, movieId, imdbId, currentMovieDB, useData, handleOpenEpisodesButtons, enableEntering }) => {
  const [movieDB, setMovieDB] = useState(currentMovieDB);

  useEffect(() => {
    setMovieDB(currentMovieDB);
  }, [currentMovieDB]);
  const getMovieDB = useData();
  useEffect(() => {
    if (getMovieDB && 'data' in getMovieDB) {
      let found = getMovieDB.data.find((movie) => movie.imdbId === imdbId);
      if (found) {
        setMovieDB(found);
      }
    } else {
      if (getMovieDB?.list) {
        setMovieDB(getMovieDB);
      }
    }
  }, [getMovieDB]);

  const render =
    spaces === 3
      ? ['library', 'playlist', 'watched']
      : movieDB?.list?.includes('watched')
        ? movieDB?.list?.includes('playlist_2')
          ? ['library', 'playlist', 'playlist_2', 'watched']
          : ['library', 'playlist', 'playlist_2', 'watched']
        : movieDB?.list?.includes('library')
          ? ['library', 'playlist', 'playlist_2', 'watched']
          : ['discard', 'library', 'playlist', 'watched'];

  const handleOnPress = ({ render }) => {
    // console.log(render);
    // console.log(movieDB);

    const addToList = ({ render }) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      let renderListRemove = [];
      let renderList =
        render === 'watched_2'
          ? ['watched_2', 'watched', 'playlist', 'library']
          : render === 'watched'
            ? ['watched', 'playlist', 'library']
            : render === 'playlist_2'
              ? ['playlist_2', 'playlist', 'library']
              : render === 'playlist'
                ? ['playlist', 'library']
                : render === 'library'
                  ? ['library']
                  : render === 'discard' && ['discard'];

      let finalRender = movieDB && movieDB.list ? [...new Set([...renderList, ...movieDB.list])] : [...renderList];
      let renderListToList = [...finalRender];

      // if (finalRender.includes('watched')) {
      //   if (finalRender.includes('playlist_2')) {
      //     renderListRemove.push('late');
      //   } else {
      //     renderListToList.push('late');
      //   }
      // }
      if (finalRender.includes('playlist')) {
        if (finalRender.includes('playlist_2') || finalRender.includes('watched')) {
          renderListRemove.push('showInPlaylist');
        } else {
          renderListToList.push('showInPlaylist');
        }
      }

      if (finalRender.includes('watched')) {
        handleOpenEpisodesButtons({ val: true });
      }

      setDoc(
        doc(db, 'series', imdbId),
        {
          tmdb_id: movieId,
          imdbId: imdbId,
          list: finalRender,
          lastListChange: `add_${render}`,
          lastListChangeDate: Date.now(),
        },
        { merge: true },
      );

      for (let i = 0; i < renderListToList.length; i++) {
        setDoc(
          doc(db, 'lists', `tv_${renderListToList[i]}`),
          {
            tmdb_id: arrayUnion(movieId),
            imdbId: arrayUnion(imdbId),
          },
          { merge: true },
        );
      }
      for (let i = 0; i < renderListRemove.length; i++) {
        setDoc(
          doc(db, 'lists', `tv_${renderListRemove[i]}`),
          {
            tmdb_id: arrayRemove(movieId),
            imdbId: arrayRemove(imdbId),
          },
          { merge: true },
        );
      }
    };
    const removeFromList = ({ render }) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      let renderListRemove = [];
      let renderListAdd = [];
      renderListRemove.push(render);

      let currentList = movieDB.list;
      if (render === 'watched') {
        // renderListRemove.push('late');
        if (currentList.includes('playlist') && !currentList.includes('playlist_2')) {
          renderListAdd.push('showInPlaylist');
        }
      }
      if (render === 'playlist_2' && currentList.includes('watched')) {
        // renderListAdd.push('late');
        if (!currentList.includes('playlist') && currentList.includes('playlist_2')) {
          renderListAdd.push('showInPlaylist');
        }
      }
      if (render === 'playlist') {
        renderListRemove.push('showInPlaylist');
      }

      if (render == 'watched') {
        handleOpenEpisodesButtons({ val: false });
      }
      setDoc(
        doc(db, 'series', imdbId),
        {
          tmdb_id: movieId,
          imdbId: imdbId,
          list: arrayRemove(render),
          lastListChange: `remove_${render}`,
          lastListChangeDate: Date.now(),
        },
        { merge: true },
      );

      for (let i = 0; i < renderListRemove.length; i++) {
        setDoc(
          doc(db, 'lists', `tv_${renderListRemove[i]}`),
          {
            tmdb_id: arrayRemove(movieId),
            imdbId: arrayRemove(imdbId),
          },
          { merge: true },
        );
      }
      for (let i = 0; i < renderListAdd.length; i++) {
        setDoc(
          doc(db, 'lists', `tv_${renderListAdd[i]}`),
          {
            tmdb_id: arrayUnion(movieId),
            imdbId: arrayUnion(imdbId),
          },
          { merge: true },
        );
      }
    };

    if (!movieDB || !movieDB.list || movieDB.list.length === 0) {
      if (render === 'discard') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        Alert.alert(
          'Descartar película',
          '¿Estás seguro de que deseas descartar la película?',
          [
            {
              text: 'Descartar',
              onPress: () => addToList({ render }),
              style: 'destructive',
            },
            { text: 'Cancelar' },
          ],
          { cancelable: false },
        );
      } else {
        addToList({ render });
      }
      return;
    }
    if (movieDB.list.includes(render)) {
      if (render === 'library') {
        Alert.alert(
          'Eliminar de la biblioteca',
          '¿Estás seguro de que deseas eliminar la película?',
          [
            {
              text: 'Eliminar',
              onPress: () => removeFromList({ render }),
              style: 'destructive',
            },
            { text: 'Cancelar' },
          ],
          { cancelable: false },
        );
      } else {
        removeFromList({ render });
      }
    } else {
      addToList({ render });
    }
  };
  const itemRender = [];

  for (let i = 0; i < spaces; i++) {
    let pressed = false;

    if (movieDB?.list) {
      if (movieDB.list.includes(render[i])) {
        pressed = true;
      }
    }
    itemRender.push(<ItemToRender key={i} renderName={render[i]} pressed={pressed} handleOnPress={handleOnPress} movieDB={movieDB} enableEntering={enableEntering} />);
  }

  return <View style={{ flexDirection: 'row', width: '100%', gap: 5 }}>{itemRender}</View>;
});

ButtonsSerieAdmin_2.displayName = 'ButtonsSerieAdmin_2';

export { ButtonsSerieAdmin_2 };
