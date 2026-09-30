import { Dimensions, View, Image, ScrollView, Text } from 'react-native';

import { TextType1 } from './TextType1';
import { TextType2 } from './TextType2';
import { useRef, memo, useCallback, useState, useEffect } from 'react';
import Animated, {
  FadeInDown,
  FadeInRight,
  interpolate,
  LinearTransition,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { constantsAndInfo } from '../constantsAndInfo';
import { fetchMovieRatings } from '../tmdb';

const RatingContainer = memo(({ addStyle, ratings, containerStyle, heightValue }) => {
  const ratingsOrder = [];
  // null/undefined = todavía cargando: se reserva el espacio para que lo de abajo no salte al llegar
  const loading = ratings == null;
  const heightMax = useSharedValue(loading || ratings.length > 0 ? 48 : 0);
  useEffect(() => {
    const newHeight = loading || ratings.length > 0 ? 48 : 0;
    heightMax.value = withTiming(newHeight, { duration: 500 });
  }, [ratings]);

  // brillo suave de las cajitas mientras cargan
  const pulse = useSharedValue(0.5);
  useEffect(() => {
    if (loading) pulse.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [loading]);
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  const ratingsHeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(heightValue.value, [0, 1], [0, heightMax.value]),
    };
  });
  for (let i = 0; i < ratings?.length && i < 3; i++) {
    let order = ratings[i].Source === 'Internet Movie Database' ? 0 : ratings[i].Source === 'Rotten Tomatoes' ? 1 : ratings[i].Source === 'Metacritic' ? 2 : 10 + i;
    ratingsOrder.push({
      order: order,
      source: order === 0 ? 'IMDb' : ratings[i].Source,
      rating: order === 0 || order === 2 ? ratings[i].Value.split('/')[0] : order === 1 ? ratings[i].Value.replace('%', '') : ratings[i].Value,
      ratingComp: order === 0 ? '/10' : order === 1 ? '%' : order === 2 ? '/100' : '',
    });
  }

  ratingsOrder.sort((a, b) => a.order - b.order);

  const renderRatings = [];

  for (let i = 0; i < ratingsOrder.length; i++) {
    renderRatings.push(
      <View key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,.1)', height: 40, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {ratingsOrder[i].order === 0 && <Image key={i} style={{ width: 11, height: 11, marginRight: 2, marginTop: -0.5 }} source={require('../../assets/images/icon--starFull.png')}></Image>}
          {ratingsOrder[i].order === 1 &&
            (ratingsOrder[i].rating < 60 ? (
              <Image key={i} style={{ width: 11, height: 11, marginRight: 2, marginTop: 0 }} source={require('../../assets/images/logo--splat.png')}></Image>
            ) : (
              <Image key={i} style={{ width: 11, height: 11, marginRight: 2, marginTop: -1 }} source={require('../../assets/images/logo--fresh.png')}></Image>
            ))}
          {ratingsOrder[i].order === 2 && <Image key={i} style={{ width: 11, height: 11, marginRight: 2, marginTop: 0.5 }} source={require('../../assets/images/logo--metacritic.png')}></Image>}
          <TextType1>{ratingsOrder[i].rating}</TextType1>
          <TextType2 addStyle={{ fontSize: 10, marginTop: 0.5 }}>{ratingsOrder[i].ratingComp}</TextType2>
        </View>
        <TextType2 addStyle={{ color: 'rgba(255,255,255,.8)' }}>{ratingsOrder[i].source}</TextType2>
      </View>,
    );
  }

  const loadingBoxes = [0, 1, 2].map((i) => <Animated.View key={i} style={[{ flex: 1, backgroundColor: 'rgba(255,255,255,.1)', height: 40, borderRadius: 5 }, pulseStyle]} />);

  return (
    <Animated.View style={[containerStyle, ratingsHeightAnimatedStyle, { overflow: 'hidden' }]}>
      <View style={{ flexDirection: 'row', width: '100%', gap: '2%', paddingTop: 8 }}>{loading ? loadingBoxes : renderRatings}</View>
    </Animated.View>
  );
});

RatingContainer.displayName = 'RatingContainer';

export { RatingContainer };
