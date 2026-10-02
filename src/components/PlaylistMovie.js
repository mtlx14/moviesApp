import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Text, View, ScrollView, Pressable, ContextMenu } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import Animated, {
  Easing,
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeOut,
  cancelAnimation,
  interpolate,
  Layout,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
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
import { SubscriptionFilterModal } from './SubscriptionFilterModal';
import { useMyProviders } from '../myProviders';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PULL_THRESHOLD = 70;
const FILTERS_HEADER_HEIGHT = 46;

const FilterIcon = ({ progressStyles }) => (
  <View style={{ alignItems: 'center', gap: 3 }}>
    {[18, 12, 6].map((width, i) => (
      <Animated.View key={i} style={[{ width, height: 2, borderRadius: 1, backgroundColor: 'white' }, progressStyles?.[i]]} />
    ))}
  </View>
);

const PlaylistMovie = memo(({ item, index, isActive }) => {
  const ITEMS_PER_PAGE = 30;
  const [visibleData, setVisibleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const noImagesRef = useRef(false);
  const [movieCant, setMovieCant] = useState(null);
  const isFocused = useIsFocused();

  //   pull para mostrar filtros
  //   ------------------------------------------------------------------------------------------------
  const [showFilters, setShowFilters] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [filterKey, setFilterKey] = useState(0);
  const pullY = useSharedValue(0);
  const pullReady = useSharedValue(false);
  const isDragging = useSharedValue(false);
  const filtersOpen = useSharedValue(false);
  const filtersHeight = useSharedValue(0);
  const movieCantOffset = useSharedValue(0);
  const linesCycle = useSharedValue(0);

  const pullHaptic = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  const openFilters = () => {
    setShowFilters(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // FlashList v2 envuelve onScroll en JS, así que un useAnimatedScrollHandler no recibe eventos: se usan handlers JS
  const handleScroll = (e) => {
    pullY.value = Math.max(0, -e.nativeEvent.contentOffset.y);

    if (filtersOpen.value || !isDragging.value) return;

    const ready = pullY.value >= PULL_THRESHOLD;
    if (ready !== pullReady.value) {
      pullReady.value = ready;
      if (ready) pullHaptic();
    }
  };
  const handleBeginDrag = () => {
    isDragging.value = true;
  };
  const handleEndDrag = () => {
    isDragging.value = false;
    if (pullReady.value) {
      pullReady.value = false;
      filtersOpen.value = true;
      // el header crece mientras la lista rebota, así el contenido baja suave en vez de saltar
      filtersHeight.value = withTiming(FILTERS_HEADER_HEIGHT, { duration: 300, easing: Easing.out(Easing.cubic) });
      movieCantOffset.value = withTiming(FILTERS_HEADER_HEIGHT, { duration: 500, easing: Easing.out(Easing.cubic) });
      openFilters();
    }
  };

  const pullIndicatorStyle = useAnimatedStyle(() => {
    const progress = interpolate(pullY.value, [0, PULL_THRESHOLD], [0, 1], Extrapolation.CLAMP);
    return {
      opacity: filtersOpen.value ? 0 : interpolate(progress, [0.15, 0.6], [0, 1], Extrapolation.CLAMP),
      backgroundColor: withTiming(pullReady.value ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', { duration: 150 }),
      transform: [{ translateY: (15 + pullY.value) / 2 - 20 }, { scale: withSpring(pullReady.value ? 1.1 : interpolate(progress, [0, 1], [0.6, 1])) }],
    };
  });
  const filtersHeaderStyle = useAnimatedStyle(() => ({ height: filtersHeight.value }));
  // el contador baja la misma distancia que el espacio nuevo del botón de filtros, un poco más lento
  const movieCantStyle = useAnimatedStyle(() => ({ transform: [{ translateY: movieCantOffset.value }] }));

  // loop de las líneas del ícono mientras hay pull (corre en el hilo de UI)
  useAnimatedReaction(
    () => pullY.value > 1 && !filtersOpen.value,
    (active, wasActive) => {
      if (active && !wasActive) {
        linesCycle.value = 0;
        linesCycle.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.linear }), -1, false);
      } else if (!active && wasActive) {
        cancelAnimation(linesCycle);
        linesCycle.value = 0;
      }
    },
  );
  // cada línea entra (desde la derecha) de a una, se queda, sale (hacia la izquierda) y el ciclo se repite
  const lineStyle1 = useAnimatedStyle(() => {
    const range = [0, 0.15, 0.55, 0.7];
    return {
      opacity: interpolate(linesCycle.value, range, [0, 1, 1, 0], Extrapolation.CLAMP),
      transform: [{ translateX: interpolate(linesCycle.value, range, [8, 0, 0, -8], Extrapolation.CLAMP) }],
    };
  });
  const lineStyle2 = useAnimatedStyle(() => {
    const range = [0.1, 0.25, 0.65, 0.8];
    return {
      opacity: interpolate(linesCycle.value, range, [0, 1, 1, 0], Extrapolation.CLAMP),
      transform: [{ translateX: interpolate(linesCycle.value, range, [8, 0, 0, -8], Extrapolation.CLAMP) }],
    };
  });
  const lineStyle3 = useAnimatedStyle(() => {
    const range = [0.2, 0.35, 0.75, 0.9];
    return {
      opacity: interpolate(linesCycle.value, range, [0, 1, 1, 0], Extrapolation.CLAMP),
      transform: [{ translateX: interpolate(linesCycle.value, range, [8, 0, 0, -8], Extrapolation.CLAMP) }],
    };
  });
  //   ------------------------------------------------------------------------------------------------

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
      }
      // avanza aunque la página venga vacía, así la carga automática del filtro no pide la misma página en bucle
      setPage(nextPage);
      setLoading(false);
    });
  };

  //   filtro por suscripción
  //   ------------------------------------------------------------------------------------------------
  // los proveedores vienen de TMDB página por página, así que se filtra sobre lo ya cargado
  const hasMorePages = movieCant !== null && (page + 1) * ITEMS_PER_PAGE < movieCant;
  // plataformas del filtro que no son mis suscripciones: solo mientras se filtra por ellas se muestran sus etiquetas
  const myProviders = useMyProviders();
  const filterOnlyProviders = useMemo(() => selectedProviders.filter((provider) => !myProviders.includes(provider)), [selectedProviders, myProviders]);
  const getTagProviders = (movie) => {
    if (filterOnlyProviders.length === 0) return movie.providers;
    return [...movie.providers, ...filterOnlyProviders.filter((provider) => movie.filterProviders?.includes(provider))];
  };
  const filteredData = useMemo(() => {
    if (!visibleData || selectedProviders.length === 0) return visibleData;
    return visibleData.filter((movie) => movie.filterProviders?.some((provider) => selectedProviders.includes(provider)));
  }, [visibleData, selectedProviders]);

  // al aplicar filtros la lista se vuelve a montar desde cero al instante con lo ya cargado; el resto llega con el scroll
  const applyFilters = (providers) => {
    if ([...providers].sort().join() === [...selectedProviders].sort().join()) return;
    setSelectedProviders(providers);
    setFilterKey((prev) => prev + 1);
  };

  // si con lo cargado no hay ninguna coincidencia, se siguen cargando páginas (con el loading de la lista vacía)
  useEffect(() => {
    if (selectedProviders.length > 0 && filteredData?.length === 0 && hasMorePages && !loading) {
      loadMore();
    }
  }, [selectedProviders, filteredData, hasMorePages, loading]);
  //   ------------------------------------------------------------------------------------------------

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
          key={filterKey}
          showsVerticalScrollIndicator={false}
          data={filteredData}
          ListEmptyComponent={
            <View style={{ paddingTop: 60, alignItems: 'center' }}>
              {hasMorePages ? <ActivityIndicator size="small" color="#fff" /> : <TextType2>No hay películas en las suscripciones seleccionadas</TextType2>}
            </View>
          }
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
          onScroll={handleScroll}
          onScrollBeginDrag={handleBeginDrag}
          onScrollEndDrag={handleEndDrag}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <Animated.View style={[{ overflow: 'hidden' }, filtersHeaderStyle]}>
              {showFilters && (
                <Animated.View style={{ paddingHorizontal: 6, flexDirection: 'row' }} entering={FadeInDown.springify().damping(80).stiffness(200)}>
                  <Pressable
                    style={{ borderRadius: 17, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,.2)' }}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setFiltersModalOpen(true);
                    }}
                  >
                    <BlurView intensity={10} style={{ height: 34, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14 }}>
                      <FilterIcon />
                      <TextType1 addStyle={{ fontSize: 15 }}>Filtros</TextType1>
                      {selectedProviders.length > 0 && (
                        <Animated.View
                          entering={FadeIn.duration(150)}
                          exiting={FadeOut.duration(150)}
                          style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(255,255,255,.25)', alignItems: 'center', justifyContent: 'center', marginRight: -6 }}
                        >
                          <TextType1 addStyle={{ fontSize: 12 }}>{selectedProviders.length}</TextType1>
                        </Animated.View>
                      )}
                    </BlurView>
                  </Pressable>
                </Animated.View>
              )}
            </Animated.View>
          }
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
                        addProvider={getTagProviders(item)}
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
        <Animated.View
          pointerEvents="none"
          style={[{ position: 'absolute', top: windowHeight * 0.1, alignSelf: 'center', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }, pullIndicatorStyle]}
        >
          <FilterIcon progressStyles={[lineStyle1, lineStyle2, lineStyle3]} />
        </Animated.View>
        {movieCant && (
          <Animated.View
            style={[{ backgroundColor: 'rgba(255, 255, 255,.2)', position: 'absolute', top: windowHeight * 0.1 + 15 + 20, right: -25, borderRadius: 15, overflow: 'hidden' }, movieCantStyle]}
          >
            <BlurView intensity={10} style={{ height: 30, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10, paddingRight: 35 }}>
              <TextType1>{movieCant}</TextType1>
            </BlurView>
          </Animated.View>
        )}
        <SubscriptionFilterModal visible={filtersModalOpen} selected={selectedProviders} onChange={applyFilters} onClose={() => setFiltersModalOpen(false)} />
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
