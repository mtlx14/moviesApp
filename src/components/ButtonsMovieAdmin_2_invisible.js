import { memo } from 'react';
import { Alert, Pressable, View } from 'react-native';

import db from '../conection.js';
import { arrayRemove, arrayUnion, doc, setDoc } from 'firebase/firestore';
import * as Haptics from 'expo-haptics';

const ItemToRender = memo(({ render, handleOnPress }) => {
  return (
    <Pressable
      onPress={() => handleOnPress({ render: render })}
      pointerEvents="auto"
      style={[
        {
          flex: 1,
        },
      ]}
    >
      <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(1,1,1,0)' }}></View>
    </Pressable>
  );
});

ItemToRender.displayName = 'ItemToRender';

const ButtonsMovieAdmin_2_invisible = memo(({ spaces, movieId, imdbId, moviesDB }) => {
  const render =
    spaces === 3
      ? ['library', 'playlist', 'watched']
      : moviesDB?.list?.includes('watched_2')
        ? ['library', 'playlist', 'playlist_2', 'watched_2']
        : moviesDB?.list?.includes('watched')
          ? moviesDB?.list?.includes('playlist_2')
            ? ['playlist', 'playlist_2', 'watched_2', 'watched']
            : ['library', 'playlist', 'playlist_2', 'watched']
          : moviesDB?.list?.includes('library')
            ? ['library', 'playlist', 'playlist_2', 'watched']
            : ['discard', 'library', 'playlist', 'watched'];

  const handleOnPress = ({ render }) => {
    const addToList = ({ render }) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      let renderListRemove = [];
      let renderList =
        render === 'watched_2'
          ? ['watched_2', 'watched', 'playlist', 'playlist_2', 'library']
          : render === 'watched'
            ? ['watched', 'playlist', 'library']
            : render === 'playlist_2'
              ? ['playlist_2', 'playlist', 'library']
              : render === 'playlist'
                ? ['playlist', 'library']
                : render === 'library'
                  ? ['library']
                  : render === 'discard' && ['discard'];

      let finalRender = moviesDB && moviesDB.list ? [...new Set([...renderList, ...moviesDB.list])] : [...renderList];
      let renderListToList = [...finalRender];

      if (finalRender.includes('playlist')) {
        if (finalRender.includes('watched')) {
          renderListRemove.push('showInPlaylist');
        } else {
          renderListToList.push('showInPlaylist');
        }
      }
      if (finalRender.includes('playlist_2')) {
        if (finalRender.includes('watched_2')) {
          renderListRemove.push('showInPlaylist_2');
        } else {
          renderListToList.push('showInPlaylist_2');
        }
      }

      setDoc(
        doc(db, 'movies', imdbId),
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
          doc(db, 'lists', renderListToList[i]),
          {
            tmdb_id: arrayUnion(movieId),
            imdbId: arrayUnion(imdbId),
          },
          { merge: true },
        );
      }
      for (let i = 0; i < renderListRemove.length; i++) {
        setDoc(
          doc(db, 'lists', renderListRemove[i]),
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

      if (render === 'playlist') {
        renderListRemove.push('showInPlaylist');
      }
      if (render === 'playlist_2') {
        renderListRemove.push('showInPlaylist_2');
      }

      let currentList = moviesDB.list;

      if (render === 'watched' && currentList.includes('playlist')) {
        renderListAdd.push('showInPlaylist');
      }
      if (render === 'watched_2' && currentList.includes('playlist_2')) {
        renderListAdd.push('showInPlaylist_2');
      }

      setDoc(
        doc(db, 'movies', imdbId),
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
          doc(db, 'lists', renderListRemove[i]),
          {
            tmdb_id: arrayRemove(movieId),
            imdbId: arrayRemove(imdbId),
          },
          { merge: true },
        );
      }
      for (let i = 0; i < renderListAdd.length; i++) {
        setDoc(
          doc(db, 'lists', renderListAdd[i]),
          {
            tmdb_id: arrayUnion(movieId),
            imdbId: arrayUnion(imdbId),
          },
          { merge: true },
        );
      }
    };

    if (!moviesDB || !moviesDB.list || moviesDB.list.length === 0) {
      if (render === 'discard') {
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
    if (moviesDB.list.includes(render)) {
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

    if (moviesDB?.list) {
      if (moviesDB.list.includes(render[i])) {
        pressed = true;
      }
    }
    itemRender.push(<ItemToRender key={i} render={render[i]} pressed={pressed} handleOnPress={handleOnPress} />);
  }
  return <View style={{ flexDirection: 'row', width: '100%', gap: 5 }}>{itemRender}</View>;
});

ButtonsMovieAdmin_2_invisible.displayName = 'ButtonsMovieAdmin_2_invisible';

export { ButtonsMovieAdmin_2_invisible };
