import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { View, FlatList, Dimensions, Pressable } from 'react-native';
import { TextType1 } from './TextType1';
import { Image } from 'expo-image';
import { TextType2 } from './TextType2';
import Animated, { FadeInDown, LinearTransition, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { usePathname, useRouter } from 'expo-router';
import { useDataLists } from '../contextLists';
import { useIsFocused } from '@react-navigation/core';
import { Asset } from 'expo-asset';
import { BookmarkerFullIcon, CheckIcon, HeartFullIcon } from '../SVGS';

function Button_playlist({ entering }) {
  return (
    <Animated.View
      entering={entering ? FadeInDown.springify().damping(80).stiffness(150) : undefined}
      style={{
        width: 20,
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 3,
      }}
    >
      <HeartFullIcon width={11} height={11} fill="#ffffffE6" />
    </Animated.View>
  );
}
function Button_watched({ entering }) {
  return (
    <Animated.View
      entering={entering ? FadeInDown.springify().damping(80).stiffness(150) : undefined}
      style={{
        width: 20,
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 3,
      }}
    >
      <CheckIcon width={10} height={10} fill="#ffffffE6" />
    </Animated.View>
  );
}
function Button_library({ entering }) {
  return (
    <Animated.View
      entering={entering ? FadeInDown.springify().damping(80).stiffness(150) : undefined}
      style={{
        width: 20,
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 3,
      }}
    >
      <BookmarkerFullIcon width={10} height={10} fill="#ffffffE6" />
    </Animated.View>
  );
}

const CastMovies = memo(({ movies, type, watchedMovies, prevWatchedMovies }) => {
  const router = useRouter();
  const pathname = usePathname();

  const windowWidth = Dimensions.get('window').width;
  const [moviesOpen, setMoviesOpen] = useState(false);

  const [toPrint, setToPrint] = useState([]);

  let excludeTextCharacter = ['narrator', 'archive footage', 'self'];

  useEffect(() => {
    if (watchedMovies?.library?.length === 0 || !watchedMovies.library) return;

    if (type == 'movies') {
      setToPrint(
        movies
          .filter(
            (item) =>
              item.media_type == 'movie' &&
              !watchedMovies?.discard?.includes(String(item.id)) &&
              !excludeTextCharacter.some((word) => item.character.toLowerCase().includes(word)) &&
              item.release_date &&
              item.order < 20 &&
              item.vote_count > 100 &&
              item.poster_path,
          )
          .sort((a, b) => b.release_date.split('-')[0] - a.release_date.split('-')[0]),
      );
    }
    if (type == 'series') {
      let filtered = [];
      for (const item of movies) {
        if (!filtered.some((el) => el.id === item.id)) {
          filtered.push(item);
        }
      }
      setToPrint(
        filtered
          .filter(
            (item) =>
              item.media_type == 'tv' &&
              item.episode_count > 3 &&
              item.poster_path &&
              item.genre_ids.length > 0 &&
              !item.genre_ids.includes(10763) &&
              !item.genre_ids.includes(10767) &&
              !excludeTextCharacter.some((word) => item.character.toLowerCase().includes(word)),
          )
          .sort((a, b) => b.first_air_date.split('-')[0] - a.first_air_date.split('-')[0]),
      );
    }
    if (type == 'director') {
      setToPrint(
        movies.filter((item) => item.job == 'Director' && item.release_date && item.poster_path && item.vote_count > 100).sort((a, b) => b.release_date.split('-')[0] - a.release_date.split('-')[0]),
      );
    }
  }, [watchedMovies]);

  const item_h = 50;
  const item_g = 5;
  const itemCant_start = toPrint.length >= 3 ? 3 : toPrint.length;
  let start_h = 16 + item_h * itemCant_start + item_g * (itemCant_start - 1);
  let end_h = 16 + item_h * toPrint.length + item_g * (toPrint.length - 1);

  const moviesHeight = useSharedValue(start_h);
  const moviesOpacity = useSharedValue(0);

  useEffect(() => {
    const next_h = moviesOpen ? end_h : start_h;

    moviesHeight.value = withSpring(next_h, { duration: 1000, dampingRatio: 1.2 });
    moviesOpacity.value = withSpring(moviesOpen ? 1 : 0, { duration: 300, dampingRatio: 1.2 });
  }, [moviesOpen]);

  useEffect(() => {
    if (toPrint.length === 0) return;
    moviesHeight.value = moviesOpen ? end_h : start_h;
  }, [toPrint]);
  const handleOnPressShowMore = () => {
    setMoviesOpen((prev) => !prev);
  };

  const handleOnPress = ({ movie_id }) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (type === 'series') {
      router.push(`${pathname.split('/')[1]}/screenSerieDetails/${movie_id}`);
    } else {
      router.push(`${pathname.split('/')[1]}/screenMovieDetails/${movie_id}`);
    }
  };

  if (toPrint.length > 0)
    return (
      <Animated.View key={toPrint[0].id} entering={FadeInDown.springify().damping(80).stiffness(150)} layout={LinearTransition.springify().damping(300).stiffness(500)}>
        <View style={{ marginTop: 15, alignItems: 'flex-start', marginLeft: 22 }}>
          <TextType1 addStyle={{}}>{type === 'movies' ? 'Películas:' : type == 'series' ? 'Series:' : 'Películas como director:'}</TextType1>
        </View>
        <Animated.FlatList
          data={toPrint}
          keyExtractor={(movie) => movie.id}
          style={{
            height: moviesHeight,
            padding: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            width: windowWidth - 40,
            marginHorizontal: 20,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: toPrint.length <= 3 ? 10 : 0,
            borderBottomRightRadius: toPrint.length <= 3 ? 10 : 0,
            marginTop: 3,
            overflow: 'hidden',
          }}
          contentContainerStyle={[
            {
              gap: 5,
            },
          ]}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => {
                handleOnPress({ movie_id: item.id });
              }}
            >
              <Animated.View
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: index % 2 === 0 && 'rgba(255, 255, 255, 0.02)',
                    opacity: index > 2 ? moviesOpacity : 1,
                    borderRadius: 5,
                  },
                ]}
              >
                <Image style={{ width: 34, height: 50, borderRadius: 5 }} source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster_path}` }} transition={500} />
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 10 }}>
                  <View style={{ width: windowWidth - 150 }}>
                    <TextType1 addStyle={{ textAlign: 'flex-start' }}>{item.release_date?.split('-')[0] || item.first_air_date.split('-')[0]}</TextType1>
                    <TextType2 addStyle={{ textAlign: 'flex-start' }}>{item.title || item.name}</TextType2>
                  </View>
                  {type === 'series' ? (
                    watchedMovies?.tv_watched?.includes(String(item.id)) ? (
                      <Button_watched entering={!prevWatchedMovies.current?.tv_watched?.includes(String(item.id))} />
                    ) : watchedMovies?.tv_playlist?.includes(String(item.id)) ? (
                      <Button_playlist entering={!prevWatchedMovies.current?.tv_playlist?.includes(String(item.id))} />
                    ) : (
                      watchedMovies?.tv_library?.includes(String(item.id)) && <Button_library entering={!prevWatchedMovies.current?.tv_library?.includes(String(item.id))} />
                    )
                  ) : watchedMovies?.watched?.includes(String(item.id)) ? (
                    <Button_watched entering={!prevWatchedMovies.current?.watched?.includes(String(item.id))} />
                  ) : watchedMovies?.playlist?.includes(String(item.id)) ? (
                    <Button_playlist entering={!prevWatchedMovies.current?.playlist?.includes(String(item.id))} />
                  ) : (
                    watchedMovies?.library?.includes(String(item.id)) && <Button_library entering={!prevWatchedMovies.current?.library?.includes(String(item.id))} />
                  )}
                </View>
              </Animated.View>
            </Pressable>
          )}
        />
        {toPrint.length > 3 && (
          <View style={{ width: windowWidth - 40, marginLeft: 20, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <View style={{ width: '90%', height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginHorizontal: '5%' }} />
            <Pressable style={{ paddingVertical: 5 }} onPress={handleOnPressShowMore}>
              <TextType2>{moviesOpen ? (type === 'series' ? 'Ocultar series' : 'Ocultar películas') : type === 'series' ? 'Mostrar todas las series' : 'Mostrar todas las películas'}</TextType2>
            </Pressable>
          </View>
        )}
      </Animated.View>
    );
});

CastMovies.displayName = 'CastMovies';

export { CastMovies };
