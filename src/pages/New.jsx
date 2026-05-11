import { useEffect, useState, useRef } from 'react';
import { View, Image, FlatList, ScrollView, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';

import { MainFrame } from '../components/MainFrame';
import { TitleType1 } from '../components/TitleType1';
import { TextType1 } from '../components/TextType1';
import { TagType1 } from '../components/TagType1';
import { RatingStars } from '../components/RatingStars';
import { isDateInFuture } from '../function';
import { fetchNewMovies, fetchNewSeries } from '../tmdb';
import { Link, router, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import db from '../conection';

import Animated, { runOnUI, useAnimatedStyle, useSharedValue, withSpring, withTiming, FadeInLeft, FadeInUp, FadeInDown } from 'react-native-reanimated';

import * as Haptics from 'expo-haptics';

import { styles } from '../style';
import { useIsFocused } from '@react-navigation/core';
import { FlashList } from '@shopify/flash-list';

const windowHeight = Dimensions.get('window').height;

export function SectionNew() {
  const sectionStyle = styles.sectionNew;
  const router = useRouter();
  const [movies, setMovies] = useState(null);
  const [hideMovies, setHideMovies] = useState(null);
  const [moviesToShow, setMoviesToShow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [moviesOrSeries, setMoviesOrSeries] = useState('movies');
  const flatListRef = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const getMovies = async () => {
      const movieList = await fetchNewMovies();
      setMovies(movieList);
    };

    const getWatchedMovies = async () => {
      try {
        const watchedRef = doc(db, 'lists', 'library');
        const discardRef = doc(db, 'lists', 'discard');

        const [watchedSnap, discardSnap] = await Promise.all([getDoc(watchedRef), getDoc(discardRef)]);

        const watchedIds = watchedSnap.exists() ? watchedSnap.data().tmdb_id : [];
        const discardIds = discardSnap.exists() ? discardSnap.data().tmdb_id : [];

        const combined = [...new Set([...watchedIds, ...discardIds])];

        setHideMovies(combined);
      } catch (error) {
        console.error('Error al obtener el documento:', error);
      }
    };

    getWatchedMovies();
    getMovies();
  }, []);

  useEffect(() => {
    if (moviesOrSeries == 'movies') {
      if (movies && hideMovies) {
        loadMoreMovies();
      }
    } else {
      loadMoreSeries();
    }
  }, [movies, hideMovies]);

  const loadMoreMovies = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    // console.log(movies[0].id);

    const newMovies = movies.filter((item) => !hideMovies.includes(String(item.id))).slice((page - 1) * 20, page * 20);

    if (newMovies.length > 0) {
      setMoviesToShow((prevMovies) => [...prevMovies, ...newMovies]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };
  const loadMoreSeries = () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const newMovies = movies.slice((page - 1) * 20, page * 20);

    if (newMovies.length > 0) {
      setMoviesToShow((prevMovies) => [...prevMovies, ...newMovies]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  const openMovie = ({ movie_id }) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push(`new/${moviesOrSeries == 'movies' ? 'screenMovieDetails' : 'screenSerieDetails'}/${movie_id}`);
  };

  useEffect(() => {
    setLoading(false);
    setPage(1);
    setHasMore(true);
    const getSeries = async () => {
      const serieList = await fetchNewSeries();
      setMovies(serieList);
    };
    const getMovies = async () => {
      const serieList = await fetchNewMovies();
      setMovies(serieList);
    };
    if (moviesOrSeries == 'series') {
      getSeries();
    } else {
      getMovies();
    }
  }, [moviesOrSeries]);

  const indicatorMargin = useSharedValue(0);

  const changeMoviesOrSeries = () => {
    setMoviesToShow([]);

    flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });

    if (indicatorMargin.value == 0) {
      setMoviesOrSeries('series');
      indicatorMargin.value = withSpring(40, { duration: 1000, dampingRatio: 0.6 });
    } else {
      setMoviesOrSeries('movies');
      indicatorMargin.value = withSpring(0, { duration: 1000, dampingRatio: 0.6 });
    }
  };

  const indicatorMarginAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginLeft: indicatorMargin.value,
    };
  });

  return (
    <>
      <MainFrame style={{ flex: 1, height: windowHeight }}>
        <TitleType1 addStyle={{ marginBottom: 10, marginTop: 20 }}>{moviesOrSeries == 'movies' ? 'Nuevas películas:' : 'Series en Emisión'}</TitleType1>

        {moviesToShow.length > 0 ? (
          <View style={{ flex: 1, width: '96%', alignSelf: 'center', height: windowHeight }}>
            <FlashList
              ref={flatListRef}
              data={moviesToShow}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: windowHeight * 0.1 + 15,
              }}
              numColumns={3}
              windowSize={1}
              initialNumToRender={4}
              maxToRenderPerBatch={6}
              estimatedItemSize={300}
              renderItem={({ item }) => {
                return (
                  <>
                    {isFocused && (
                      <Pressable style={{ margin: 5 }} onPress={() => openMovie({ movie_id: item.id })}>
                        <Animated.View
                          style={{
                            backgroundColor: 'rgba(1,1,1,0.2)',
                            borderRadius: 6,

                            // paddingBottom: 10,
                            alignItems: 'center',
                          }}
                          entering={FadeInDown.springify().damping(80).stiffness(150)}
                        >
                          <Image source={{ uri: `${item.poster}` }} resizeMode="cover" style={sectionStyle.moviePoster}></Image>
                          <TextType1 addStyle={sectionStyle.movieTitle} numberOfLines={1}>
                            {item.title}
                          </TextType1>

                          {isDateInFuture(item.release_date) ? (
                            <TagType1 addStyle={{ marginBottom: 5, marginTop: 2 }}>Próximamente</TagType1>
                          ) : (
                            <RatingStars addStyleImg={sectionStyle.starImg} addStyleContainer={sectionStyle.starContainer} rating={item.rating} />
                          )}
                        </Animated.View>
                      </Pressable>
                    )}
                  </>
                );
              }}
              onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 400) {
                  loadMoreMovies();
                }
              }}
              scrollEventThrottle={16}
              ListFooterComponent={
                loading ? (
                  <View style={{ padding: 20 }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                  </View>
                ) : null
              }
            />
          </View>
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
        <Pressable onPress={changeMoviesOrSeries}>
          <BlurView
            intensity={10}
            style={{
              height: 42,
              borderRadius: 21,
              overflow: 'hidden',
              position: 'absolute',
              bottom: windowHeight * 0.1 + 10,
              right: 10,
              alignItems: 'center',
              flexDirection: 'row',

              backgroundColor: 'rgba(255,255,255,.2)',
              paddingLeft: 5,
              paddingRight: 5,
            }}
          >
            <View style={{ width: 40, alignItems: 'center' }}>
              <Image
                source={require('../../assets/images/icon--movieEmpty.png')}
                resizeMode="cover"
                style={{
                  width: 22,
                  height: 22,
                  opacity: 0.5,
                }}
              ></Image>
            </View>
            <View style={{ width: 40, alignItems: 'center' }}>
              <Image
                source={require('../../assets/images/icon--tvEmpty.png')}
                resizeMode="cover"
                style={{
                  width: 22,
                  height: 22,
                  opacity: 0.5,
                }}
              ></Image>
            </View>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: '50%',
                  height: 100,
                  backgroundColor: 'rgba(169, 86, 86, 0)',
                  alignItems: 'center',
                  top: 26,
                  left: 5,
                },
                indicatorMarginAnimatedStyle,
              ]}
            >
              <View
                style={{
                  width: 8,
                  height: 1.5,
                  backgroundColor: 'rgba(255, 255, 255,.3)',
                  marginTop: 8,
                  borderRadius: 2,
                }}
              ></View>
            </Animated.View>
          </BlurView>
        </Pressable>

        {/* <BlurView
          intensity={10}
          style={{
            width: 80,
            height: 42,
            borderRadius: 21,
            overflow: 'hidden',
            position: 'absolute',
            bottom: windowHeight * 0.1 + 10,
            right: -21,
            alignItems: 'left',
            justifyContent: 'center',

            backgroundColor: 'rgba(255,255,255,.2)',
          }}
        >
          <Image
            source={require('../../assets/images/icon--tvEmpty.png')}
            resizeMode="cover"
            style={{
              width: 25,
              height: 25,
              marginLeft: 15,
            }}
          ></Image>
        </BlurView> */}
      </MainFrame>
    </>
  );
}
