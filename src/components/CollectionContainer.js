import { View, Dimensions, FlatList, Pressable } from 'react-native';
import { TextType1 } from './TextType1';
import { TextType2 } from './TextType2';
import { TextType3 } from './TextType3';
import { TagType2 } from './TagType2.js';
import { TagType1 } from './TagType1.js';
import { RatingStars } from './RatingStars.js';
import { memo, use, useEffect, useRef, useState } from 'react';
import Animated, { interpolate, runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useDataCollection } from '../contextCollection.js';
import { ButtonsMovieAdmin_2 } from './ButtonsMovieAdmin_2.js';
import { fetchMovieCollection, fetchMovieDirectorMovies, fetchMovieRelatedMovies } from '../tmdb.js';
import { ButtonsMovieAdmin_2_invisible } from './ButtonsMovieAdmin_2_invisible.js';
import { ButtonsMovieAdmin_2_noPress } from './ButtonsMovieAdmin_2_noPress.js';
import * as Haptics from 'expo-haptics';
import { useRouter, usePathname } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';

const windowWidth = Dimensions.get('window').width;
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

function DotsToRender({ scrollX, i }) {
  const dotStylez = useAnimatedStyle(() => {
    return {
      opacity: withTiming(interpolate(scrollX.value, [i - 1, i, i + 1], [0.4, 1, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), { duration: 1 }),
      width: withTiming(interpolate(scrollX.value, [i - 1, i, i + 1], [5, 8, 5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), { duration: 1 }),
      height: withTiming(interpolate(scrollX.value, [i - 1, i, i + 1], [5, 8, 5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), { duration: 1 }),
    };
  });
  return <Animated.Image key={i} source={require('../../assets/images/icon--dot.png')} style={[{ width: 5, height: 5, opacity: 0.4 }, dotStylez]}></Animated.Image>;
}

const CollectionContainer = memo(({ type, mt, movie, enableEntering }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [moviesDB, setMoviesDB] = useState([]);
  const cMovies = useRef([]);
  const cName = useRef('');
  const [visibleData, setVisibleData] = useState([]);

  const getMoviesDB = useDataCollection();
  useEffect(() => {
    if (getMoviesDB && 'data' in getMoviesDB) {
      setMoviesDB(getMoviesDB.data);
    }
  }, [getMoviesDB]);

  useEffect(() => {
    if (type === 'Colección') {
      cMovies.current.push(...movie.collectionMovies);
      cName.current = movie.collectionName;
    }
    if (type === 'Director') {
      cMovies.current.push(...movie.directorMovies);
      cName.current = movie.director[0].name;
    }
    if (type === 'Relacionados') {
      cMovies.current.push(...movie.relatedMovies);
      cName.current = 'Te puede interesar';
    }

    setVisibleData(cMovies.current.slice(0, 2));
  }, []);
  // const { data: moviesDB } = useDataCollection();

  // const containerHeight = useSharedValue(0);

  // const containerHeightAnimatedStyle = useAnimatedStyle(() => {
  //   return {
  //     height: containerHeight.value,
  //   };
  // });

  // useEffect(() => {
  //   if (cMovies && cMovies.length > 0) {
  //     containerHeight.value = withSpring(type === 'Relacionados' ? 235 : 248);
  //   } else {
  //     containerHeight.value = withSpring(0);
  //   }
  // }, [cMovies]);
  const imageOpacity = useSharedValue(enableEntering ? 0 : 1);
  const imageMargin = useSharedValue(enableEntering ? 30 : 0);
  const handleStartImageLoad = () => {
    imageOpacity.value = withSpring(1, { duration: 1000, dampingRatio: 0.8 });
    imageMargin.value = withSpring(0, { duration: 1000, dampingRatio: 1.2 });
  };
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    const X = e.contentOffset.x / windowWidth;
    scrollX.value = X;

    const newCurrentIndex = Math.round(X);

    if (newCurrentIndex !== currentIndex) {
      runOnJS(setCurrentIndex)(newCurrentIndex);
    }
    if (currentIndex === 1 && visibleData.length <= 2) {
      runOnJS(setVisibleData)(cMovies.current);
    }
  });

  const handleOnPress = ({ movie_id }) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push(`${pathname.split('/')[1]}/screenMovieDetails/${movie_id}`);
  };

  const moviesToRender = [];
  const dotsToRender = [];

  if (visibleData && visibleData.length > 0) {
    for (let i = 0; i < cMovies.current.length; i++) {
      dotsToRender.push(<DotsToRender key={i} scrollX={scrollX} i={i} />);
    }
  }

  return (
    <Animated.View
      style={[
        {
          width: '100%',
          overflow: 'hidden',
          // , height: type === 'Relacionados' ? 235 : 248
        },
      ]}
    >
      <Animated.View style={{ borderRadius: 10, position: 'relative', opacity: imageOpacity, top: imageMargin, marginTop: mt }}>
        <View style={{ position: 'absolute', width: windowWidth - 40, height: '100%', paddingHorizontal: 35, backgroundColor: 'rgba(1,1,1,.1)', left: 20, borderRadius: 12 }}></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextType1 addStyle={{ fontSize: 20, alignSelf: 'flex-start', marginLeft: 35, marginTop: 15, width: '50%', textAlign: 'flex-start' }}>{cName.current}</TextType1>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', marginRight: 35, marginTop: 15 }}>
            <TagType2 type={type} />
            {type === 'Colección' && <TagType1 addStyleText={{ opacity: 0.7 }}>{cMovies && cMovies.length > 0 ? `${cMovies.length + 1} películas` : ''}</TagType1>}
          </View>
        </View>

        {type === 'Colección' || type === 'Director' ? (
          <TextType2
            addStyle={{ paddingHorizontal: 35, marginTop: 3, marginBottom: 3, alignSelf: 'flex-start' }}
          >{`${type === 'Colección' ? 'Más de la colección:' : type === 'Director' && 'Más del director:'}`}</TextType2>
        ) : (
          <View style={{ height: 5 }}></View>
        )}

        <View>
          {/* {moviesToRender} */}
          <Animated.View
            style={[
              {
                alignItems: 'flex-start',
                width: windowWidth - 180,
                position: 'absolute',
                left: 150,
                height: 160,
                justifyContent: 'center',
              },
            ]}
          >
            <TextType1 addStyle={[{ textAlign: 'flex-start', fontSize: 18 }]}>{visibleData[currentIndex]?.title}</TextType1>
            {visibleData[currentIndex]?.spanishTitle && <TextType2 addStyle={[{ textAlign: 'flex-start' }]}>{visibleData[currentIndex]?.spanishTitle}</TextType2>}

            <View style={{ marginTop: 2, flexDirection: 'row', alignItems: 'flex-start', marginLeft: -2 }}>
              <RatingStars
                addStyleImg={{ width: 12, height: 12 }}
                addStyleContainer={{ marginTop: 1, height: 15 }}
                rating={visibleData[currentIndex]?.rating}
                releaseDate={visibleData[currentIndex]?.release_date}
              />
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <TextType1 addStyle={{ marginLeft: 5, marginTop: 0.2 }}>{visibleData[currentIndex]?.rating}</TextType1>
                <TextType3>(Tmdb)</TextType3>
              </View>
            </View>
            <TextType2 addStyle={{ marginTop: 1 }}>{visibleData[currentIndex]?.release_date}</TextType2>
            {moviesDB && (
              <View style={{ width: '100%', marginTop: 5 }}>
                <ButtonsMovieAdmin_2_noPress
                  movieId={visibleData[currentIndex]?.id}
                  imdbId={visibleData[currentIndex]?.imdb_id}
                  spaces={3}
                  moviesDB={moviesDB.find((item) => item.tmdb_id == visibleData[currentIndex]?.id)}
                />
              </View>
            )}
          </Animated.View>
          {visibleData && visibleData.length > 0 && (
            <View
              style={{
                marginTop: 5,
                marginBottom: 0,
                width: windowWidth,
              }}
            >
              <AnimatedFlashList
                data={visibleData}
                extraData={moviesDB}
                horizontal
                pagingEnabled
                decelerationRate={'fast'}
                scrollEventThrottle={16}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                estimatedItemSize={windowWidth * 2}
                initialNumToRender={2}
                maxToRenderPerBatch={2}
                windowSize={2}
                removeClippedSubviews={true}
                renderItem={({ item, index }) => (
                  <Pressable style={{ width: windowWidth, paddingHorizontal: 35 }} onPress={() => handleOnPress({ movie_id: item.id })}>
                    <Image source={{ uri: item.poster }} style={{ height: 160, width: 105, borderRadius: 8 }} onLoad={index === 0 ? handleStartImageLoad : null} />
                    <View
                      style={{
                        alignItems: 'flex-start',
                        width: windowWidth - 180,
                        position: 'absolute',
                        left: 150,
                        height: 160,
                        justifyContent: 'center',
                        marginTop: -5,
                      }}
                    >
                      {moviesDB && <ButtonsMovieAdmin_2_invisible movieId={item.id} imdbId={item.imdb_id} spaces={3} moviesDB={moviesDB.find((movie) => movie.tmdb_id == item.id)} />}
                    </View>
                  </Pressable>
                )}
              />
            </View>
          )}
        </View>
        <View style={{ justifyContent: 'center', flexDirection: 'row', gap: 1, alignItems: 'center', height: 15 }}>{dotsToRender}</View>
      </Animated.View>
    </Animated.View>
  );
});

CollectionContainer.displayName = 'CollectionContainer';
export { CollectionContainer };
