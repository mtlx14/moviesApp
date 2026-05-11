import { Dimensions, View, Pressable, Linking } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
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
import { useState, useEffect, useRef } from 'react';
import { fetchSerieDetails, fetchMovieRatings, fetchCurrentEpisodeSerie } from '../tmdb';
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
  runOnJS,
  Layout,
  FadeOut,
  FadeIn,
} from 'react-native-reanimated';
import { TextType3 } from '../components/TextType3';
import { RatingContainer } from '../components/RatingContainer';
import { ProviderContainer2 } from '../components/ProviderContainer2';
import { PostersContainer } from '../components/PostersContainer';

import { OpenTrailer2 } from '../components/OpenTrailer2';
import db from '../conection';
import { collection, doc, getDoc } from 'firebase/firestore';
import { ButtonsSerieAdmin_2 } from '../components/ButtonsSerieAdmin_2';
import { NotificationBubble } from '../components/NotificationBubble';
import { ModalPoster } from '../components/ModalPoster';
import { DataProviderSerie, useDataSerie } from '../contextSerie';

import { BackgroundImg } from '../components/BackgroundImg';
import { BackdropImg } from '../components/BackdropImg';
import { PosterImg } from '../components/PosterImg';
import { MyRatingStars } from '../components/MyRatingStars';
import { RatingModal } from '../components/RatingModal';

import { OpenTrailer } from '../components/OpenTrailer';
import { ButtonsEpisodes } from '../components/ButtonsEpisodes';
import { EpisodesModal } from '../components/EpisodesModal';
import { SerieModalPoster } from '../components/SerieModalPoster';
import { SerieRatingModal } from '../components/SerieRatingModal';
import { useIsFocused } from '@react-navigation/core';
import { NextEpisodeSerie } from '../components/NextEpisodeSerie';

const openTrailer = async (trailerLink) => {
  try {
    const supported = await Linking.canOpenURL(trailerLink);
    if (supported) {
      await Linking.openURL(trailerLink);
      return;
    }
  } catch (err) {
    console.error(`Error al intentar abrir`, err);
  }

  console.error('No se pudo abrir el enlace');
};
export default function SerieDetails() {
  const { id } = useLocalSearchParams();
  const sectionStyle = styles.sectionNewMovieDetails;
  const [movie, setMovie] = useState([]);

  const navigation = useNavigation();
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const [serieDB, setSerieDB] = useState(null);
  const [openPoster, setOpenPoster] = useState({ open: false });
  const [openRating, setOpenRating] = useState(false);
  const [openEpisodesButtons, setEpisodesButton] = useState(false);
  const [openEpisodesModal, setOpenEpisodesModal] = useState({ open: false, type: null });
  const isFocused = useIsFocused();
  const scrollBeforeUnmount = useRef(0);
  const [enableAnimations, setEnableAnimations] = useState(false);
  const [enableEntering, setEnableEntering] = useState(true);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const fetchedMovie = await fetchSerieDetails({ movieId: id });
        setMovie(fetchedMovie);
      } catch (err) {
        console.error(`Error obteniendo fetchSerieDetails`, err);
      }
    };

    getMovie();
  }, [id]);

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

  const getSerieDB = async () => {
    try {
      const docRef = doc(db, 'series', movie.imdb_id);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const dataDB = snapshot.data();
        setSerieDB(dataDB);
      } else {
        setSerieDB([]);
      }
    } catch (error) {
      console.error('Error firebase', error);
    } finally {
    }
  };
  const getNextEpisode = async ({ season, episode } = {}) => {
    try {
      const nextEpisode = await fetchCurrentEpisodeSerie({ season, episode, serieDB });

      setMovie((prev) => ({
        ...prev,
        ...nextEpisode,
      }));
    } catch (err) {
      console.error(`Error obteniendo next episode`, err);
    }
  };

  const callFunctions = useRef(false);

  useEffect(() => {
    if (!movie?.imdb_id) return;

    if (callFunctions.current === false) {
      callFunctions.current = true;
      getSerieDB();
      getRatings();
    }
  }, [movie]);

  const handleOpenPoster = ({ open, img_url, type }) => {
    setOpenPoster({
      open: open,
      imdb_id: movie.imdb_id,
      img_url: img_url,
      current_img: type === 'posters' ? serieDB?.fixedPoster || '' : serieDB?.fixedBackdrop || '',
      original_img: type === 'posters' ? movie.poster : movie.backdrop,
      type: type,

      current_trailerImg: serieDB?.fixedTrailerImg || '',
    });
  };

  const handleOpenEpisodesButtons = ({ val }) => {
    setEpisodesButton(val);
  };

  const episodesButtons = useSharedValue(0);

  useEffect(() => {
    if (serieDB) {
      setEpisodesButton(serieDB?.list?.includes('watched'));
      if (serieDB?.episodes) {
        getNextEpisode();
      }
    }
  }, [serieDB]);

  useEffect(() => {
    if (openEpisodesButtons) {
      episodesButtons.value = withTiming(29, { duration: 200, dampingRatio: 1 });
    } else {
      episodesButtons.value = withTiming(0, { duration: 200, dampingRatio: 1 });
    }
  }, [openEpisodesButtons]);

  const handleOpenEpisodesModal = ({ open, cant, divInfo }) => {
    setOpenEpisodesModal({ open: open, cant: cant, divInfo: divInfo, currentY: mainScrollPosition.value });
  };
  const handleOpenEpisodesModal_open = (open) => {
    setOpenEpisodesModal((prev) => ({
      ...prev,
      open: open,
    }));
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
  const mainScrollPosition = useSharedValue(0);

  const handleOverviewLayout = (event) => {
    const { height } = event.nativeEvent.layout;

    finalOverviewHeight.value = height + 1;
  };

  const Y_TARGET = 297;
  const HALF_Y_TARGET = 297 / 2;
  const handleScroll = useAnimatedScrollHandler((e) => {
    const { y } = e.contentOffset;

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
      // runOnJS(setEnableLayout)(true);
    }
    if (y < Y_TARGET && snapInterval.value === 0) {
      snapInterval.value = Y_TARGET;
      // runOnJS(setEnableLayout)(false);
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
      height: interpolate(topContainerHeight.value, [0, 1], [0, 44]),
    };
  });
  const buttonEpisodesHeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(topContainerHeight.value, [0, 1], [0, episodesButtons.value]),
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
  const nEpisodeHeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(topContainerHeight.value, [0, 1], [0, (windowWidth - 40) * 0.25]),
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
  const marginOut5_10AnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: interpolate(topContainerHeight.value, [0, 1], [10, 5]),
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
      scrollBeforeUnmount.current = snapInterval.value === 0 ? Y_TARGET : 0;
      if (snapInterval.value === 0) {
        setEnableEntering(false);
      } else {
        setEnableEntering(true);
      }
    }
  }, [isFocused]);

  return (
    <DataProviderSerie imdb_id={movie.imdb_id}>
      <View style={{ backgroundColor: '#615E5B', minHeight: windowHeight, minWidth: windowWidth }}>
        {isFocused && (
          <Animated.View exiting={FadeOut.springify().damping(80).stiffness(50).delay(500)} entering={FadeIn.springify().damping(80).stiffness(50)}>
            <Stack.Screen
              options={{
                headerBackVisible: false,
                headerLeft: !openPoster.open
                  ? () => (
                      <ButtonGoBack
                        opacityBlur={opacityOutBlurBar}
                        onPress={() => {
                          navigation.goBack();
                        }}
                      />
                    )
                  : () => <></>,
              }}
            />

            <MainFrame>
              {movie.id && (
                <>
                  <View style={{ width: '100%', height: windowHeight, position: 'absolute' }}>
                    {<BackgroundImg defaultImg={movie.backdrop} initialMovieDB={serieDB} useData={useDataSerie} />}
                    <BlurView intensity={100} style={[sectionStyle.fondoBlur, { height: windowHeight * 2 }]}></BlurView>
                  </View>
                  <View style={[sectionStyle.sliderFrame, { height: windowHeight }]}>
                    <Animated.ScrollView
                      contentOffset={{ x: 0, y: scrollBeforeUnmount.current }}
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
                        <BackdropImg defaultImg={movie.backdrop} initialMovieDB={serieDB} useData={useDataSerie} />
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
                          <PosterImg defaultImg={movie.poster} useData={useDataSerie} />

                          <Animated.View style={{ alignItems: 'flex-start', width: windowWidth - 170 }} layout={LinearTransition.springify().damping(80).stiffness(200)}>
                            <SubTitleType1 addStyle={[sectionStyle.movieTitle, { textAlign: 'flex-start', fontSize: 20 }]}>{movie.title}</SubTitleType1>
                            <TextType2
                              addStyle={{ marginLeft: 1, marginTop: 2, marginBottom: 1 }}
                            >{`${movie.seasons} temporada${movie.seasons > 1 ? 's' : ''} · ${movie.episodes} episodios`}</TextType2>
                            {movie.nextEpisodeDate && (
                              <TagType1
                                addStyle={{ marginTop: 3, marginLeft: 0 }}
                              >{`${movie.nextEpisodeNumber === 1 ? 'Próxima temporada: ' : 'Próximo episodio: '}${movie.nextEpisodeDate}`}</TagType1>
                            )}
                            <Genres genresData={movie.genres} addStyleContainer={[sectionStyle.genresContainer, { justifyContent: 'flex-start' }]} />

                            <View style={[sectionStyle.ratingRow, { marginTop: 6 }]}>
                              <RatingStars addStyleImg={sectionStyle.starImg} addStyleContainer={sectionStyle.starContainer} rating={movie.rating} releaseDate={movie.release_date} />
                              <View style={{ flexDirection: 'row', gap: 5, height: 18 }}>
                                <TextType1 addStyle={sectionStyle.textRating}>{movie.rating}</TextType1>
                                <TextType3>(Tmdb)</TextType3>
                              </View>
                            </View>

                            <View style={[{ marginTop: 2, alignItems: 'flex-start', overflow: 'hidden' }]}>
                              <MyRatingStars sectionStyle={sectionStyle} openRating={handleOpenRating} color={'pink'} useData={useDataSerie} />
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
                            <View style={{ height: 32 + 46, justifyContent: 'flex-end' }}>
                              <SubTitleType1 addStyle={sectionStyle.movieTitle}>{movie.title}</SubTitleType1>
                              <Genres genresData={movie.genres} addStyleContainer={sectionStyle.genresContainer} />
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

                              <TagType1 country={movie.country} addStyle={sectionStyle.tagDateRow}>
                                {movie.original_language}
                              </TagType1>
                              <TagType1 addStyle={sectionStyle.tagDateRow}>{movie.certification}</TagType1>
                            </Animated.View>
                          </Animated.View>
                          {/* )} */}

                          {/* {fetched.includes('details') && ( */}
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
                            <ButtonsSerieAdmin_2
                              spaces={4}
                              movieId={id}
                              imdbId={movie.imdb_id}
                              currentMovieDB={serieDB}
                              useData={useDataSerie}
                              handleOpenEpisodesButtons={handleOpenEpisodesButtons}
                              enableEntering={enableEntering}
                            />
                          </Animated.View>

                          <Animated.View
                            style={[
                              {
                                width: '100%',
                                opacity: opacityIn3,
                              },
                              buttonEpisodesHeightAnimatedStyle,
                              // marginIn0_10AnimatedStyle,
                            ]}
                          >
                            <ButtonsEpisodes serie={movie} handleOpenEpisodesModal={handleOpenEpisodesModal} open={openEpisodesModal.open} useData={useDataSerie} getNextEpisode={getNextEpisode} />
                          </Animated.View>

                          {/* )} */}
                          {/* {fetched.includes('translations') && ( */}
                          <Animated.View style={marginOut5_10AnimatedStyle}>
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

                                <OpenTrailer sectionStyle={sectionStyle} trailerLink={movie.trailerLink} defaultImg={movie.newTrailerImg} initialMovieDB={serieDB} useData={useDataSerie} />
                              </View>
                            </Animated.View>
                          </Animated.View>
                          {/* )} */}

                          {/* {movie.otherRatings && movie.otherRatings.length > 0 && ( */}
                          {/* // {fetched.includes('ratings') && movie.otherRatings && ( */}
                          <RatingContainer ratings={movie.otherRatings} containerStyle={[sectionStyle.row5, { opacity: opacityIn3 }]} heightValue={topContainerHeight} />
                          {/* )} */}

                          <View style={sectionStyle.row4}>
                            {/* {fetched.includes('cast') && ( */}
                            <Animated.View entering={FadeInDown.springify().damping(80).stiffness(50)}>
                              <Animated.View
                                style={[
                                  { opacity: opacityOut, height: windowHeight * 0.135, justifyContent: 'center', position: 'absolute', width: '100%', paddingHorizontal: 20 },
                                  marginOut0_5AnimatedStyle,
                                ]}
                              >
                                <CastContainer director={movie.director} cast={movie.cast} castCant={5} sendBg={serieDB?.fixedBackdrop || movie.backdrop} />
                              </Animated.View>
                            </Animated.View>
                            {/* )} */}
                            {/* {fetched.includes('ratings') && ( */}

                            <Animated.View style={{ opacity: opacityIn, width: '100%', maxHeight: cast2HeightAnimatedStyle, marginTop: 8 }}>
                              <CastContainer2
                                director={movie.director}
                                cast={movie.cast}
                                movieId={movie.id}
                                movieSerie={'serie'}
                                sendBg={serieDB?.fixedBackdrop || movie.backdrop}
                                setEnableAnimations={setEnableAnimations}
                                enableEntering={enableEntering}
                              />
                            </Animated.View>
                            {/* )} */}
                          </View>
                          {/* {fetched.includes('ratings') && ( */}
                          <Animated.View style={[sectionStyle.row6, { opacity: opacityInFrom1 }]} {...(enableAnimations && { layout: Layout.springify().damping(200).stiffness(300) })}>
                            <ProviderContainer2 provider={movie.provider} providerType={movie.providerType} movieTitle={movie.title} />
                          </Animated.View>
                          {/* )} */}
                        </View>

                        {/* fetch images */}
                        {/* {fetched.includes('ratings') && */}
                        <Animated.View style={{ opacity: opacityIn, width: '100%', maxHeight: cast2HeightAnimatedStyle }}>
                          <NextEpisodeSerie movie={movie} useData={useDataSerie} />
                        </Animated.View>
                        {!movie?.currentEpisodeInfo?.name && (
                          <Animated.View
                            entering={enableEntering ? FadeInDown.springify().damping(80).stiffness(50) : undefined}
                            {...(enableAnimations && { layout: Layout.springify().damping(200).stiffness(300) })}
                          >
                            <OpenTrailer2 sectionStyle={sectionStyle} trailerLink={movie.trailerLink} defaultImg={movie.newTrailerImg} mt={16} useData={useDataSerie} />
                          </Animated.View>
                        )}

                        <Animated.View {...(enableAnimations && { layout: Layout.springify().damping(200).stiffness(300) })}>
                          <PostersContainer type={'posters'} imgs={movie.posters} mt={16} openPoster={handleOpenPoster} />

                          <PostersContainer type={'backdrops'} imgs={movie.backdrops} mt={16} openPoster={handleOpenPoster} />
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

                  {openPoster.open && <SerieModalPoster data={openPoster} openPoster={handleOpenPoster} />}
                  {openRating && <SerieRatingModal imdb_id={movie.imdb_id} openRating={handleOpenRating} />}
                  {/* <Animated.View style={{ opacity: opacityIn3 }}> */}
                  <EpisodesModal
                    info={openEpisodesModal}
                    handleOpenEpisodesModal_open={handleOpenEpisodesModal_open}
                    serie={movie}
                    mainScrollPosition={mainScrollPosition}
                    useData={useDataSerie}
                    opacityIn={opacityIn3}
                  />
                  {/* </Animated.View> */}

                  <NotificationBubble top={55} useData={useDataSerie} />
                </>
              )}
            </MainFrame>
          </Animated.View>
        )}
      </View>
    </DataProviderSerie>
  );
}
