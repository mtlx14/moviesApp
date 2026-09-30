import { memo, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Text, View, ScrollView, Pressable, ContextMenu } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import Animated, { Easing, FadeIn, FadeInDown, FadeOut, Layout, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { SubTitleType1 } from './SubTitleType1';
import { Genres } from './Genres';
import { RatingStars } from './RatingStars';
import { TextType1 } from './TextType1';
import { TextType3 } from './TextType3';
import { LinearGradient } from 'expo-linear-gradient';
import { TextType2 } from './TextType2';
import { router, usePathname } from 'expo-router';
import { firebasePLaylistMovies } from '../tmdb';
import { ActivityIndicator } from 'react-native';
import { useIsFocused } from 'expo-router';
import { FlashList } from '@shopify/flash-list';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PlaylistMovie = memo(({ item, index, isActive }) => {
  const ITEMS_PER_PAGE = 30;
  const [visibleData, setVisibleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const noImagesRef = useRef(false);
  const [movieCant, setMovieCant] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    setLoading(true);
    firebasePLaylistMovies({ item: item, startIndex: 0, limit: ITEMS_PER_PAGE }).then(({ movies, cant }) => {
      setMovieCant(cant);
      setVisibleData(movies);
      setLoading(false);
      noImagesRef.current = true;
    });
  }, []);

  const loadMore = () => {
    if (loading) return;

    setLoading(true);
    const nextPage = page + 1;
    firebasePLaylistMovies({ item: item, startIndex: nextPage * ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE }).then(({ movies }) => {
      if (movies.length > 0) {
        const uniqueMovies = [...new Map([...visibleData, ...movies].map((movie) => [movie.id, movie])).values()];

        setVisibleData(uniqueMovies);
        setPage(nextPage);
      }
      setLoading(false);
    });
  };

  if (!isActive) {
    return (
      <Animated.View style={{ width: windowWidth, height: windowHeight, paddingHorizontal: 15, flexDirection: 'row' }} exiting={FadeOut.springify().damping(350).stiffness(40)}>
        <View style={{ width: (windowWidth - 30 - 12) / 2, gap: 12, paddingTop: windowHeight * 0.1 + 15 }}>
          <View
            style={{
              width: '100%',
              overflow: 'hidden',
              height: 230,
              borderRadius: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          ></View>
          <View
            style={{
              width: '100%',
              overflow: 'hidden',
              height: 240,
              borderRadius: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          ></View>
          <View
            style={{
              width: '100%',
              overflow: 'hidden',
              height: 240,
              borderRadius: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          ></View>
        </View>
        <View style={{ width: (windowWidth - 30 - 12) / 2, gap: 12, paddingTop: windowHeight * 0.1 + 15, marginLeft: 12 }}>
          <View
            style={{
              width: '100%',
              overflow: 'hidden',
              height: 250,
              borderRadius: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          ></View>
          <View
            style={{
              width: '100%',
              overflow: 'hidden',
              height: 250,
              borderRadius: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          ></View>
          <View
            style={{
              width: '100%',
              overflow: 'hidden',
              height: 300,
              borderRadius: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          ></View>
        </View>
      </Animated.View>
    );
  }

  if (visibleData?.length > 0) {
    return (
      <View style={{ flex: 1, width: '100%', height: windowHeight, position: 'absolute', top: 0 }}>
        <FlashList
          showsVerticalScrollIndicator={false}
          data={visibleData}
          extraData={isFocused}
          keyExtractor={(item) => item.id}
          numColumns={2}
          masonry
          estimatedItemSize={400}
          windowSize={1}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          onEndReachedThreshold={0.9}
          contentContainerStyle={{ paddingTop: windowHeight * 0.1 + 15, paddingHorizontal: 6 }}
          onEndReached={() => {
            loadMore();
          }}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => {
            const isLeftColumn = index % 2 === 0;

            return (
              <Animated.View entering={FadeInDown.springify().damping(350).stiffness(35)}>
                <Pressable
                  style={{
                    overflow: 'hidden',
                    borderRadius: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    marginHorizontal: 6,
                    marginBottom: 12,
                  }}
                  onPress={() => router.push(`movie/screenMovieDetails/${item.id}?placeholder=${encodeURIComponent(item?.lq_fixedBackdrop || item.lq_backdrop || '')}&placeholderLib=expo`)}
                >
                  <View style={{ width: 1, height: ((windowWidth - 30 - 12) / 2) * 0.7 }}>
                    {isFocused && (
                      <Animated.View exiting={FadeOut.springify().damping(80).stiffness(50).delay(500)}>
                        <Image
                          source={{ uri: item?.fixedBackdrop || item.backdrop, cache: 'force-cached' }}
                          contentFit="cover"
                          transition={300}
                          // placeholder={{ uri: item?.lq_fixedBackdrop || item.lq_backdrop }}
                          placeholderContentFit="cover"
                          style={{
                            width: ((windowWidth - 30 - 12) / 2) * 1.3,
                            height: ((windowWidth - 30 - 12) / 2) * 0.7,
                            position: 'relative',
                            left: item?.backdropXPosition ? -((windowWidth - 30 - 12) / 2) * 0.3 * item?.backdropXPosition : -((windowWidth - 30 - 12) / 2) * 0.4 * 0.5,
                          }}
                        />
                      </Animated.View>
                    )}
                  </View>

                  <Animated.View style={{ backgroundColor: 'rgba(255,255,255,.1)' }}>
                    {isFocused && (
                      <Animated.View
                        style={{
                          width: '100%',
                          position: 'absolute',
                          height: '100%',
                          top: 0,
                          left: 0,
                        }}
                        exiting={FadeOut.springify().damping(80).stiffness(50).delay(500)}
                      >
                        <Image
                          source={{ uri: item?.lq_fixedBackdrop || item.lq_backdrop, cache: 'force-cached' }}
                          contentFit="cover"
                          style={{
                            width: '100%',
                            height: '100%',
                            transform: [{ scaleY: -1 }],
                            opacity: 0.8,
                          }}
                          transition={1000}
                          blurRadius={15}
                        />
                      </Animated.View>
                    )}
                    <Animated.View style={{ paddingTop: 8, paddingHorizontal: 10, paddingBottom: 10, alignItems: 'center' }} entering={FadeIn.springify().damping(350).stiffness(35)}>
                      <TextType1 addStyle={[{ fontSize: 16, textAlign: 'center', marginLeft: 2 }]}>{item.title}</TextType1>
                      <View style={{ flexDirection: 'row', marginTop: 2 }}>
                        <TextType2 addStyle={{ fontSize: 14 }}>{item.director}</TextType2>
                        <TextType2 addStyle={{ fontSize: 14 }}>{` • ${item.release_year}`}</TextType2>
                      </View>
                      <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'flex-start', overflow: 'hidden', height: 15, marginLeft: 2 }}>
                        <RatingStars addStyleImg={{ width: 10, height: 10 }} addStyleContainer={{ marginTop: 1.5 }} rating={item.rating} releaseDate={item.release_date} />

                        <View style={{ flexDirection: 'row', gap: 5 }}>
                          <TextType1 addStyle={{ height: 21, marginLeft: 5, marginTop: 0.2, fontSize: 14 }}>{item.rating}</TextType1>
                          <TextType3 addStyle={{ fontSize: 14 }}>(Tmdb)</TextType3>
                        </View>
                      </View>
                      <Genres
                        genresData={item.genres}
                        addProvider={item.providers}
                        addStyleContainer={[{ justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: '5', marginTop: 5 }]}
                      />
                    </Animated.View>
                  </Animated.View>
                </Pressable>
              </Animated.View>
            );
          }}
          ListFooterComponent={() => {
            if (movieCant > visibleData) {
              return (
                <View
                  style={{
                    marginBottom: windowHeight * 0.1 + 15,
                    height: 50,
                    justifyContent: 'flex-start',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 10,
                    justifyContent: 'center',
                  }}
                >
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{
                      width: windowWidth - 30,
                      zIndex: 1,
                    }}
                  />
                </View>
              );
            } else {
              return <View style={{ width: '100%', height: windowHeight * 0.1 }} />;
            }
          }}
        />
        {movieCant && (
          <View style={{ backgroundColor: 'rgba(255, 255, 255,.2)', position: 'absolute', top: windowHeight * 0.1 + 15 + 20, right: -25, borderRadius: 15, overflow: 'hidden' }}>
            <BlurView intensity={10} style={{ height: 30, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10, paddingRight: 35 }}>
              <TextType1>{movieCant}</TextType1>
            </BlurView>
          </View>
        )}
      </View>
    );
  } else {
    return (
      <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        {noImagesRef.current ? (
          <TextType2>{`No hay películas en la playlist`}</TextType2>
        ) : (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [{ translateX: -10 }, { translateY: -10 }],
              zIndex: 1,
            }}
          />
        )}
      </View>
    );
  }
});

const dotStyle = {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: 'white',
  marginHorizontal: 5,
};

PlaylistMovie.displayName = 'PlaylistMovie';
export { PlaylistMovie };
