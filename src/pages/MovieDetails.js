import { Dimensions, View, Pressable, Linking } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonGoBack } from '../components/ButtonGoBack';
import { MainFrame } from '../components/MainFrame';
import { SubTitleType1 } from '../components/SubTitleType1';
import { TextType1 } from '../components/TextType1';
import { TextType2 } from '../components/TextType2';
import { TagType1 } from '../components/TagType1';
import { RatingStars } from '../components/RatingStars';
import { ProviderContainer } from '../components/ProviderContainer';
import { Genres } from '../components/Genres';
import { CastContainer } from '../components/CastContainer';
import { CastContainer2 } from '../components/CastContainer2';
import { isDateInFuture } from '../function';
import { useState, useEffect, useRef, use } from 'react';
import { fetchMovieCollection, fetchMovieDetails, fetchMovieDirectorMovies, fetchMovieOscars, fetchMovieRatings, fetchMovieRelatedMovies } from '../tmdb';
import { styles } from '../style';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInRight,
  interpolate,
  LinearTransition,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Layout,
  runOnJS,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { TextType3 } from '../components/TextType3';
import { RatingContainer } from '../components/RatingContainer';
import { ProviderContainer2 } from '../components/ProviderContainer2';
import { PostersContainer } from '../components/PostersContainer';
import { CollectionContainer } from '../components/CollectionContainer';

import { OpenTrailer2 } from '../components/OpenTrailer2';
import db from '../conection';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

import { ButtonsMovieAdmin_2 } from '../components/ButtonsMovieAdmin_2';
import { NotificationBubble } from '../components/NotificationBubble';
import { ModalPoster } from '../components/ModalPoster';
import { DataProviderMovie, useDataMovie } from '../contextMovie';
import { DataProviderCollection, useDataCollection } from '../contextCollection';
import { BackgroundImg } from '../components/BackgroundImg';
import { BackdropImg } from '../components/BackdropImg';
import { PosterImg } from '../components/PosterImg';
import { MyRatingStars } from '../components/MyRatingStars';
import { RatingModal } from '../components/RatingModal';
import { OpenTrailer } from '../components/OpenTrailer';
import { useIsFocused } from '@react-navigation/core';
import { MovieAwards } from '../components/MovieAwards';

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const sectionStyle = styles.sectionNewMovieDetails;
  const [movie, setMovie] = useState([]);
  const navigation = useNavigation();
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const [movieDB, setMovieDB] = useState(null);
  const [idsForCollections, setIdsForCollections] = useState([]);
  const [openPoster, setOpenPoster] = useState({ open: false });
  const [openRating, setOpenRating] = useState(false);
  const isFocused = useIsFocused();
  const scrollBeforeUnmount = useSharedValue(0);
  const [enableAnimations, setEnableAnimations] = useState(false);
  const [enableEntering, setEnableEntering] = useState(true);
  const readyForCollections = useRef(0);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const fetchedMovie = await fetchMovieDetails({ movieId: id });
        setMovie(fetchedMovie);
      } catch (err) {
        console.error(`Error obteniendo fetchMovieDetails`, err);
      }
    };

    getMovie();
  }, [id]);

  useEffect(() => {
    if (readyForCollections.current === 3) {
      const idsForCollections = [...(movie.collectionMovies || []), ...(movie.directorMovies || []), ...(movie.relatedMovies || [])].map((item) => item.imdb_id);

      setIdsForCollections(idsForCollections);
    }
  }, [movie?.relatedMovies, movie?.directorMovies, movie?.collectionMovies]);

  const getRatings = async () => {
    try {
      const ratings = await fetchMovieRatings({ movie: movie });

      setMovie((prev) => ({
        ...prev,
        ...ratings,
      }));
    } catch (err) {
      console.error(`Error obteniendo ratings`, err);
    }
  };
  const getMovieDB = async () => {
    try {
      const docRef = doc(db, 'movies', movie.imdb_id);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const dataDB = snapshot.data();
        setMovieDB(dataDB);
      } else {
        setMovieDB([]);
      }
    } catch (error) {
      console.error('Error firebase', error);
    }
  };
  const getCollectionMovies = async () => {
    try {
      const fetchedCollection = await fetchMovieCollection({ movieId: id, collectionId: movie?.collection_id });
      setMovie((prev) => ({ ...prev, ...fetchedCollection }));
      readyForCollections.current += 1;
    } catch (err) {
      console.error(`Error obteniendo fetchMovieCollection`, err);
    }
  };
  const getDirectorMovies = async () => {
    try {
      const fetchedDirectorMovies = await fetchMovieDirectorMovies({ movieId: id, directorId: movie.director[0].id });
      setMovie((prev) => ({ ...prev, ...fetchedDirectorMovies }));
      readyForCollections.current += 1;
    } catch (err) {
      console.error(`Error obteniendo fetchDirectorMovies`, err);
    }
  };
  const getRelatedMovies = async () => {
    try {
      const fetchedRelatedMovies = await fetchMovieRelatedMovies({ movieId: id, collection: movie.collectionMovies });
      setMovie((prev) => ({ ...prev, ...fetchedRelatedMovies }));
      readyForCollections.current += 1;
    } catch (err) {
      console.error(`Error obteniendo fetchRelatedMovies`, err);
    }
  };
  const getMovieOscars = async () => {
    try {
      const fetchedMovieOscars = await fetchMovieOscars({ wikidata_MovieId: movie.wikidata_id });
      setMovie((prev) => ({ ...prev, ...fetchedMovieOscars }));
    } catch (err) {
      console.error(`Error obteniendo fetchMovieOscars`, err);
    }
  };

  const callFunctions = useRef(false);
  const callRelatedMovies = useRef(false);

  useEffect(() => {
    if (!movie?.imdb_id) return;

    if (callFunctions.current === false) {
      callFunctions.current = true;
      getMovieDB();
      getRatings();
      getDirectorMovies();
      if (movie?.collection_id) {
        getCollectionMovies();
      } else {
        readyForCollections.current += 1;
      }
    }
    if (!movie?.collection_id || (movie?.collection_id && (movie.collectionMovies || movie.collectionMovies === null))) {
      if (callRelatedMovies.current === false) {
        callRelatedMovies.current = true;
        getRelatedMovies();
      }
    }
  }, [movie]);
  useEffect(() => {
    if (!movieDB) return;
    getMovieOscars();
  }, [movieDB]);

  const handleOpenPoster = ({ open, img_url, type }) => {
    setOpenPoster({
      open: open,
      imdb_id: movie.imdb_id,
      img_url: img_url,
      current_img: type === 'posters' ? movieDB?.fixedPoster || '' : movieDB?.fixedBackdrop || '',
      original_img: type === 'posters' ? movie.poster : movie.backdrop,
      type: type,

      current_trailerImg: movieDB?.fixedTrailerImg || '',
    });
  };

  const handleOpenRating = ({ open }) => {
    setOpenRating(open);
  };

  const scrollViewRef = useRef(null);
  const opacityIn = useSharedValue(0);
  const opacityIn2 = useSharedValue(0);
  const opacityIn3 = useSharedValue(0);
  const opacityOut = useSharedValue(1);
  const opacityOut2 = useSharedValue(1);
  const opacityOut3 = useSharedValue(1);
  const opacityInFrom1 = useSharedValue(1);
  const imageOpacity = useSharedValue(1);
  const gradientOpacity = useSharedValue(1);
  const topContainerHeight = useSharedValue(0);
  const snapInterval = useSharedValue(297);
  const finalOverviewHeight = useSharedValue(0);
  const opacityInBlurBar = useSharedValue(0);
  const opacityOutBlurBar = useSharedValue(1);

  const handleOverviewLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    finalOverviewHeight.value = height + 1;
  };

  const Y_TARGET = 297;
  const HALF_Y_TARGET = 297 / 2;
  const handleScroll = useAnimatedScrollHandler((e) => {
    const { y } = e.contentOffset;
    scrollBeforeUnmount.value = y;
    if (y > 510) return;

    if (y <= 500) {
      if (y <= Y_TARGET && y >= 0) {
        let ceroOne = y / Y_TARGET;
        topContainerHeight.value = ceroOne;
        opacityIn2.value = ceroOne;
        opacityOut2.value = 1 - ceroOne;
        if (y > 90) {
          let ceroOne2 = (y - 90) / (Y_TARGET - 90);
          gradientOpacity.value = 1 - ceroOne2;
        }
      }
      if (y <= HALF_Y_TARGET && y >= 0) {
        let ceroOne = 1 - y / HALF_Y_TARGET;
        opacityOut.value = ceroOne;
      } else if (y > HALF_Y_TARGET) {
        opacityOut.value = 0;
      }

      if (y <= Y_TARGET && y >= HALF_Y_TARGET) {
        let ceroOne = (y - HALF_Y_TARGET) / HALF_Y_TARGET;
        opacityIn.value = ceroOne;
      } else if (y < HALF_Y_TARGET) {
        opacityIn.value = 0;
      }
      if (y <= Y_TARGET && y >= 230) {
        let ceroOne = (y - 230) / (Y_TARGET - 230);
        opacityIn3.value = ceroOne;
      } else if (y < 230) {
        opacityIn3.value = 0;
      }

      if (y <= 80 && y >= 0) {
        let ceroOne = 1 - y / 80;
        opacityOut3.value = ceroOne;
      } else if (y > 80) {
        opacityOut3.value = 0;
      }
      if (y < 0) {
        topContainerHeight.value = 0;
        opacityIn2.value = 0;
        opacityOut2.value = 1;
        opacityOut.value = 1;
        opacityOut3.value = 1;
        gradientOpacity.value = 1;
      } else if (y > Y_TARGET) {
        topContainerHeight.value = 1;
        opacityIn2.value = 1;
        opacityOut2.value = 0;
        opacityIn.value = 1;
        opacityIn3.value = 1;
      }
    }

    if (y >= 440 && y <= 500) {
      let ceroOne = (y - 440) / 60;
      opacityInBlurBar.value = ceroOne;
      opacityOutBlurBar.value = 1 - ceroOne;
    } else if (y > 500) {
      opacityInBlurBar.value = 1;
      opacityOutBlurBar.value = 0;
    } else if (y < 440) {
      opacityInBlurBar.value = 0;
      opacityOutBlurBar.value = 1;
    }

    if (y >= Y_TARGET && snapInterval.value !== 0) {
      snapInterval.value = 0;
    }
    if (y < Y_TARGET && snapInterval.value === 0) {
      snapInterval.value = Y_TARGET;
    }
  });

  const topContainerHeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(topContainerHeight.value, [0, 1], [0, 100]),
    };
  });
  const overviewHeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(topContainerHeight.value, [0, 1], [55, finalOverviewHeight.value]),
    };
  });
  const buttonAdmin2HeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(topContainerHeight.value, [0, 1], [0, 47]),
    };
  });
  const row3HeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(topContainerHeight.value, [0, 1], [92, 0]),
    };
  });
  const ratingsHeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(topContainerHeight.value, [0, 1], [0, 40]),
    };
  });
  const cast2HeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(topContainerHeight.value, [0, 1], [0, windowHeight * 0.14]),
    };
  });
  const marginIn0_10AnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: interpolate(topContainerHeight.value, [0, 1], [0, 10]),
    };
  });
  const marginOut0_10AnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: interpolate(topContainerHeight.value, [0, 1], [10, 0]),
    };
  });
  const marginOut0_5AnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: interpolate(topContainerHeight.value, [0, 1], [5, 0]),
    };
  });
  const marginOut10_5AnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: interpolate(topContainerHeight.value, [0, 1], [5, -10]),
    };
  });

  useEffect(() => {
    if (!isFocused) {
      if (snapInterval.value === 0) {
        setEnableEntering(false);
      } else {
        setEnableEntering(true);
      }
    }
  }, [isFocused]);

  // console.log(fetched);
  // console.log('movie', movie);
  // console.log('padre', movieDB);
  // console.log('movieDB', movieDB);

  return (
    <DataProviderCollection moviesIds={idsForCollections}>
      <DataProviderMovie imdb_id={movie.imdb_id}>
        <View style={{ backgroundColor: '#615E5B', minHeight: windowHeight, minWidth: windowWidth }}>
          {isFocused && (
            <Animated.View exiting={FadeOut.springify().damping(80).stiffness(50).delay(500)} entering={FadeIn.springify().damping(80).stiffness(50)}>
              {!openPoster.open && (
                <View style={{ position: 'absolute', top: insets.top - 5, left: 20, zIndex: 10 }}>
                  <ButtonGoBack
                    opacityBlur={opacityOutBlurBar}
                    onPress={() => {
                      navigation.goBack();
                    }}
                  />
                </View>
              )}

              <MainFrame>
                {movie.id && (
                  <>
                    <View style={{ width: '100%', height: windowHeight, position: 'absolute' }}>
                      <BackgroundImg defaultImg={movie.backdrop} initialMovieDB={movieDB} useData={useDataMovie} />
                      <BlurView intensity={100} style={[sectionStyle.fondoBlur, { height: windowHeight }]}></BlurView>
                    </View>
                    <View style={[sectionStyle.sliderFrame, { height: windowHeight }]}>
                      <Animated.ScrollView
                        contentOffset={{ x: 0, y: scrollBeforeUnmount.value }}
                        ref={scrollViewRef}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        snapToInterval={snapInterval}
                        disableIntervalMomentum={true}
                        contentContainerStyle={{ paddingBottom: windowHeight * 0.2 + 15 }}
                      >
                        <Animated.View
                          style={{
                            opacity: opacityOut3,
                            height: windowHeight * 0.55,
                            width: windowWidth,
                            position: 'absolute',
                          }}
                        >
                          <BackdropImg defaultImg={movie.backdrop} initialMovieDB={movieDB} useData={useDataMovie} />
                        </Animated.View>

                        <Animated.View style={{ opacity: gradientOpacity }}>
                          <LinearGradient
                            colors={['rgba(20,20,20,0)', 'rgba(20, 20, 20, .3)']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={[sectionStyle.gradient, { height: windowHeight * 0.15, top: 0 }]}
                            locations={[0, 1]}
                          ></LinearGradient>
                          <LinearGradient
                            colors={[
                              'rgba(20,20,20,0.0)',
                              'rgba(20,20,20,0.01)',
                              'rgba(20,20,20,.2)',
                              'rgba(20,20,20,.44)',
                              'rgba(20,20,20,.71)',
                              'rgba(20,20,20,.9)',
                              'rgba(20,20,20,.96)',
                              'rgba(20,20,20,1)',
                              'rgba(20, 20, 20,  1)',
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={[sectionStyle.gradient, { height: windowHeight * 0.65, top: windowHeight * 0.35 }]}
                            locations={[0, 0.01, 0.05, 0.1, 0.15, 0.2, 0.22, 0.25, 1]}
                          ></LinearGradient>
                          <LinearGradient
                            colors={['rgba(20,20,20,0.0)', 'rgba(20,20,20,.3)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={[sectionStyle.gradient, { height: windowHeight * 0.2, top: windowHeight * 0.3 }]}
                            locations={[0, 1]}
                          ></LinearGradient>
                          <View style={{ width: windowWidth, position: 'absolute', height: windowHeight * 0.5, top: windowHeight * 0.5, backgroundColor: 'rgb(20,20,20)' }}></View>
                          <View style={{ width: '100%', height: 2000, position: 'absolute', top: windowHeight, backgroundColor: 'rgba(20,20,20,1)', opacity: 1 }}></View>
                        </Animated.View>

                        <View style={{ top: windowHeight * 0.35 - 23 }}>
                          <Animated.View
                            style={[
                              sectionStyle.infoContainerTop,
                              {
                                opacity: opacityIn,
                                position: 'absolute',
                                flexDirection: 'row',
                                marginLeft: 20,
                                height: 200,
                                gap: 10,
                                alignItems: 'center',
                              },
                            ]}
                          >
                            <PosterImg defaultImg={movie.poster} useData={useDataMovie} />

                            <Animated.View style={{ alignItems: 'flex-start', width: windowWidth - 170 }} layout={LinearTransition.springify().damping(80).stiffness(200)}>
                              <SubTitleType1 addStyle={[sectionStyle.movieTitle, { textAlign: 'flex-start' }]}>{movie.title}</SubTitleType1>
                              <Genres genresData={movie.genres} addStyleContainer={[sectionStyle.genresContainer, { justifyContent: 'flex-start' }]} />
                              <View style={[sectionStyle.ratingRow]}>
                                <RatingStars addStyleImg={sectionStyle.starImg} addStyleContainer={sectionStyle.starContainer} rating={movie.rating} releaseDate={movie.release_date} />
                                <View style={{ flexDirection: 'row', gap: 5, height: 18 }}>
                                  <TextType1 addStyle={sectionStyle.textRating}>{movie.rating}</TextType1>
                                  <TextType3>(Tmdb)</TextType3>
                                </View>
                              </View>

                              <View style={[{ marginTop: 2, alignItems: 'flex-start', overflow: 'hidden' }]}>
                                <MyRatingStars sectionStyle={sectionStyle} openRating={handleOpenRating} color={'pink'} useData={useDataMovie} />
                              </View>
                            </Animated.View>
                          </Animated.View>
                          {/* {fetched.includes('details') && ( */}
                          <Animated.View entering={FadeInDown.springify().damping(80).stiffness(50)} pointerEvents="none">
                            <Animated.View style={[sectionStyle.infoContainerTop, { opacity: opacityOut, paddingHorizontal: 20 }]}>
                              <Animated.Image
                                contentFit="cover"
                                style={[
                                  {
                                    width: 100,
                                    opacity: 0,
                                  },
                                  topContainerHeightAnimatedStyle,
                                ]}
                              />
                              <View style={{ height: 32 + 46, justifyContent: 'flex-end', width: windowWidth - 40 }}>
                                <SubTitleType1 addStyle={sectionStyle.movieTitle}>{movie.title}</SubTitleType1>
                                <Genres genresData={movie.genres} />
                              </View>
                              <View style={sectionStyle.ratingRow}>
                                {isDateInFuture(movie.release_date) ? (
                                  <TagType1 addStyle={{ marginBottom: 5 }}>Próximamente</TagType1>
                                ) : (
                                  <>
                                    <RatingStars addStyleImg={sectionStyle.starImg} addStyleContainer={sectionStyle.starContainer} rating={movie.rating} />
                                    <TextType1 addStyle={sectionStyle.textRating}>{movie.rating}</TextType1>
                                  </>
                                )}
                              </View>
                            </Animated.View>
                          </Animated.View>
                          {/* )} */}

                          <View>
                            {/* {fetched.includes('details') && ( */}
                            <Animated.View style={[marginOut10_5AnimatedStyle]}>
                              <Animated.View style={[sectionStyle.rowDate]} entering={enableEntering ? FadeInDown.springify().damping(80).stiffness(50) : undefined}>
                                <TextType2 addStyle={{ marginTop: 1 }}>{movie.release_date}</TextType2>
                                <TagType1 addStyle={sectionStyle.tagDateRow}>{movie.runtime}</TagType1>
                                <TagType1 country={movie.country} addStyle={sectionStyle.tagDateRow}>
                                  {movie.original_language}
                                </TagType1>
                                <TagType1 addStyle={sectionStyle.tagDateRow}>{movie.certification}</TagType1>
                              </Animated.View>
                            </Animated.View>
                            {/* )} */}

                            {movieDB && (
                              <Animated.View
                                style={[
                                  {
                                    marginHorizontal: 20,
                                    opacity: opacityIn3,
                                  },
                                  buttonAdmin2HeightAnimatedStyle,
                                  marginIn0_10AnimatedStyle,
                                ]}
                              >
                                <ButtonsMovieAdmin_2 movieId={id} imdbId={movie.imdb_id} currentMovieDB={movieDB} spaces={4} useData={useDataMovie} enableEntering={enableEntering} />
                              </Animated.View>
                            )}
                            {/* {fetched.includes('translations') && ( */}
                            <Animated.View style={marginOut0_10AnimatedStyle}>
                              <Animated.View
                                entering={enableEntering ? FadeInDown.springify().damping(80).stiffness(50) : undefined}
                                style={{
                                  flexDirection: 'row',
                                  width: windowWidth,
                                  justifyContent: 'flex-start',
                                  paddingHorizontal: 22,
                                }}
                              >
                                <TextType2 addStyle={{}}>Título en español:</TextType2>
                                <TextType1 addStyle={{ flex: 1, textAlign: 'left', paddingLeft: 3 }}>{movie.spanishTitle}</TextType1>
                              </Animated.View>
                            </Animated.View>
                            {/* )} */}

                            {/* {fetched.includes('translations') && ( */}
                            <Animated.View entering={enableEntering ? FadeInDown.springify().damping(80).stiffness(50) : undefined}>
                              <Animated.View
                                style={[
                                  sectionStyle.rowOverview,
                                  {
                                    overflow: 'hidden',
                                  },
                                  overviewHeightAnimatedStyle,
                                ]}
                              >
                                <View style={{ height: 300 }}>
                                  <Animated.Text style={[styles.textType2, sectionStyle.overviewText, { opacity: opacityOut2 }]} numberOfLines={4}>
                                    {movie.overview}
                                  </Animated.Text>
                                  <Animated.Text style={[styles.textType2, sectionStyle.overviewText, { position: 'absolute', opacity: opacityIn2 }]} onLayout={handleOverviewLayout}>
                                    {movie.overview}
                                  </Animated.Text>
                                </View>
                              </Animated.View>
                            </Animated.View>
                            {/* )} */}

                            {/* {fetched.includes('provider') && ( */}
                            <Animated.View entering={FadeInDown.springify().damping(80).stiffness(50)}>
                              <Animated.View style={[{ opacity: opacityOut }, row3HeightAnimatedStyle]}>
                                <View style={[sectionStyle.row3, { marginTop: 10, height: 82 }]}>
                                  <ProviderContainer provider={movie.provider} providerType={movie.providerType} movieTitle={movie.title} addStyle={sectionStyle.providerContainer} />

                                  <OpenTrailer sectionStyle={sectionStyle} trailerLink={movie.trailerLink} defaultImg={movie.newTrailerImg} initialMovieDB={movieDB} useData={useDataMovie} />
                                </View>
                              </Animated.View>
                            </Animated.View>
                            {/* )} */}

                            {/* {movie.otherRatings && movie.otherRatings.length > 0 && ( */}
                            {/* // {fetched.includes('ratings') && movie.otherRatings && ( */}
                            {/* <Animated.View style={[sectionStyle.row5, { opacity: opacityIn3 }, ratingsHeightAnimatedStyle]}> */}
                            {/* <View style={{ marginTop: 8 }}></View> */}
                            <RatingContainer ratings={movie.otherRatings} containerStyle={[sectionStyle.row5, { opacity: opacityIn3 }]} heightValue={topContainerHeight} />

                            {movie?.awards && (
                              <Animated.View style={[{ opacity: opacityIn3 }, marginIn0_10AnimatedStyle]}>
                                <MovieAwards awards={movie?.awards} heightValue={topContainerHeight} animated_opacity={opacityIn3} />
                              </Animated.View>
                            )}
                            {/* </Animated.View> */}
                            {/* )} */}

                            <Animated.View style={[sectionStyle.row4, {}]}>
                              {/* {fetched.includes('cast') && ( */}

                              <Animated.View
                                style={[
                                  {
                                    opacity: opacityOut,
                                    height: windowHeight * 0.135,
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    width: '100%',
                                    paddingHorizontal: 20,
                                  },
                                  marginOut0_5AnimatedStyle,
                                ]}
                              >
                                <CastContainer director={movie.director} cast={movie.cast} castCant={5} sendBg={movieDB?.fixedBackdrop || movie.backdrop} />
                              </Animated.View>
                            </Animated.View>
                            {/* )} */}
                            {/* {fetched.includes('ratings') && ( */}
                            <Animated.View style={{ opacity: opacityIn, width: '100%', maxHeight: cast2HeightAnimatedStyle, marginTop: 0 }}>
                              <CastContainer2
                                director={movie.director}
                                cast={movie.cast}
                                movieId={movie.id}
                                movieSerie={'movie'}
                                sendBg={movieDB?.fixedBackdrop || movie.backdrop}
                                setEnableAnimations={setEnableAnimations}
                                enableEntering={enableEntering}
                              />
                            </Animated.View>
                            {/* )} */}

                            {/* {fetched.includes('ratings') && ( */}

                            <Animated.View style={[sectionStyle.row6, { opacity: opacityInFrom1 }]} {...(enableAnimations && { layout: Layout.springify().damping(200).stiffness(300) })}>
                              <ProviderContainer2 provider={movie.provider} providerType={movie.providerType} movieTitle={movie.title} />
                            </Animated.View>
                            {/* )} */}
                          </View>

                          {/* fetch images */}
                          {/* {fetched.includes('ratings') && */}
                          <Animated.View
                            entering={enableEntering ? FadeInDown.springify().damping(80).stiffness(50) : undefined}
                            {...(enableAnimations && { layout: Layout.springify().damping(200).stiffness(300) })}
                          >
                            <OpenTrailer2 sectionStyle={sectionStyle} trailerLink={movie.trailerLink} defaultImg={movie.newTrailerImg} mt={16} useData={useDataMovie} />
                          </Animated.View>
                          {/* } */}

                          <Animated.View {...(enableAnimations && { layout: Layout.springify().damping(200).stiffness(300) })}>
                            {movie.collectionMovies && <CollectionContainer type={'Colección'} mt={16} movie={movie} enableEntering={enableEntering} />}
                            {movie.directorMovies && <CollectionContainer type={'Director'} mt={16} movie={movie} enableEntering={enableEntering} />}
                            {movie.relatedMovies && <CollectionContainer type={'Relacionados'} mt={16} movie={movie} enableEntering={enableEntering} />}
                          </Animated.View>
                          <Animated.View {...(enableAnimations && { layout: Layout.springify().damping(200).stiffness(300) })}>
                            <PostersContainer type={'posters'} imgs={movie.posters} mt={16} openPoster={handleOpenPoster} enableEntering={enableEntering} />

                            <PostersContainer type={'backdrops'} imgs={movie.backdrops} mt={16} openPoster={handleOpenPoster} enableEntering={enableEntering} />
                          </Animated.View>
                        </View>

                        <Animated.View style={[sectionStyle.buttonsContainer, { top: windowHeight * 0.25, opacity: opacityOut }]}></Animated.View>

                        <View style={{ height: windowHeight * 0.23, width: '100%', backgroundColor: 'rgba(20,20,20,0)', top: windowHeight * 0.35 }}></View>
                      </Animated.ScrollView>
                    </View>

                    <Animated.View
                      style={{ height: windowHeight * 0.105, width: '100%', position: 'absolute', top: 0, left: 0, opacity: opacityInBlurBar, alignItems: 'center', justifyContent: 'flex-end' }}
                    >
                      <BlurView intensity={50} style={{ height: '100%', width: '100%', position: 'absolute' }}></BlurView>
                      <TextType1 addStyle={{ marginBottom: 5, fontSize: 18 }}>{movie.title}</TextType1>
                    </Animated.View>
                    {openPoster.open && <ModalPoster data={openPoster} openPoster={handleOpenPoster} />}
                    {openRating && <RatingModal imdb_id={movie.imdb_id} openRating={handleOpenRating} />}
                    <NotificationBubble top={55} useData={useDataMovie} />
                    <NotificationBubble top={windowHeight * 0.105 + 10} useData={useDataCollection} />
                  </>
                )}
              </MainFrame>
            </Animated.View>
          )}
        </View>
      </DataProviderMovie>
    </DataProviderCollection>
  );
}
