import { memo, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Pressable, View, ScrollView, Text } from 'react-native';
import { styles } from '../style.js';
import { TextType1 } from './TextType1.js';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { doc, setDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import db from '../conection.js';
import { useDataMovie } from '../contextMovie.js';
import { RatingStars } from './RatingStars.js';
import { BlurView } from 'expo-blur';
import { TextType2 } from './TextType2.js';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const EpisodesModal = memo(({ info, serie, handleOpenEpisodesModal_open, mainScrollPosition, useData, opacityIn }) => {
  const serieId = serie.id;
  const imdbId = serie.imdb_id;
  const serieDB = useData();
  let seasonsOpen = info.open.seasons;
  let episodesOpen = info.open.episodes;
  let seasonsCant = info.cant?.seasons || 0;
  let episodesCant = info.cant?.episodes || 0;
  let seasonsInfo = info.divInfo?.seasons || {};
  let episodesInfo = info.divInfo?.episodes || {};
  let lastSeasonsEmittedEpisodes = serie.lastEpisodeNumber;

  const seasonsWatched = serieDB?.season;

  // const updateToLate = async () => {
  //   await Promise.all([
  //     setDoc(doc(db, 'lists', 'tv_onTime'), {
  //       tmdb_id: arrayRemove(serieId),
  //       imdbId: arrayRemove(imdbId),
  //     }),
  //     { merge: true },
  //     setDoc(
  //       doc(db, 'lists', 'tv_late'),
  //       {
  //         tmdb_id: arrayUnion(serieId),
  //         imdbId: arrayUnion(imdbId),
  //       },
  //       { merge: true },
  //     ),
  //   ]);
  // };
  // const updateToOnTime = async () => {
  //   await Promise.all([
  //     setDoc(
  //       doc(db, 'lists', 'tv_late'),
  //       {
  //         tmdb_id: arrayRemove(serieId),
  //         imdbId: arrayRemove(imdbId),
  //       },
  //       { merge: true },
  //     ),
  //     setDoc(
  //       doc(db, 'lists', 'tv_onTime'),
  //       {
  //         tmdb_id: arrayUnion(serieId),
  //         imdbId: arrayUnion(imdbId),
  //       },
  //       { merge: true },
  //     ),
  //   ]);
  // };

  const handleOnPressSeasons = ({ season }) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleOpenEpisodesModal_open({ open: { seasons: false, episodes: false } });

    // updateToLate();
    setDoc(
      doc(db, 'series', serie.imdb_id),
      {
        season: season,
        episodes: 0,
      },
      { merge: true },
    );
  };
  const handleOnPressEpisodes = ({ episodes }) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleOpenEpisodesModal_open({ open: { seasons: false, episodes: false } });

    // if (lastSeasonsEmittedEpisodes === episodes && seasonsWatched === seasonsCant) {
    //   updateToOnTime();
    // } else {
    //   updateToLate();
    // }
    setDoc(
      doc(db, 'series', serie.imdb_id),
      {
        ...(seasonsCant == 1 && { season: 1 }),
        episodes: episodes,
      },
      { merge: true },
    );
  };

  const seasonHeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(seasonsOpen ? (seasonsCant >= 5 ? 175 : seasonsCant * 35) : 0, { duration: 200, dumpingRatio: 1 }),
    };
  });
  const episodesHeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(episodesOpen ? (episodesCant >= 5 ? 175 : episodesCant * 35) : 0, { duration: 200, dumpingRatio: 1 }),
    };
  });
  const seasonTopAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: seasonsInfo?.top - seasonsInfo?.height - 3 - (mainScrollPosition.value - info.currentY),
    };
  });

  const itemToRenderSeasons = [];
  const itemToRenderEpisodes = [];

  for (let i = 0; i < seasonsCant; i++) {
    itemToRenderSeasons.push(
      <Pressable
        key={i}
        style={{ height: 35, justifyContent: 'center', backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,0)' }}
        onPress={() => handleOnPressSeasons({ season: i + 1 })}
      >
        <TextType1 addStyle={{ fontSize: 14 }}>{`Temporada ${i + 1}`}</TextType1>
      </Pressable>,
    );
  }
  for (let i = 0; i < episodesCant; i++) {
    itemToRenderEpisodes.push(
      <Pressable
        key={i}
        style={{ height: 35, justifyContent: 'center', backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,0)' }}
        onPress={() => handleOnPressEpisodes({ episodes: i + 1 })}
      >
        <TextType1 addStyle={{ fontSize: 14 }}>{`Episodio ${i + 1}`}</TextType1>
      </Pressable>,
    );
  }

  return (
    // <View style={{ flexDirection: 'row', position: 'relative', backgroundColor: 'green' }}>
    <>
      <Animated.View
        style={[
          {
            alignItems: 'center',
            width: seasonsInfo.width,
            // width: 500,
            left: seasonsInfo.left,
            // left: 0,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            overflow: 'hidden',
            // top: seasonsInfo.top - seasonsInfo.height,
            opacity: opacityIn,
          },
          seasonHeightAnimatedStyle,
          seasonTopAnimatedStyle,
        ]}
      >
        <BlurView intensity={20} style={{ width: 200, height: 175 }}>
          <ScrollView style={{ width: '100%', height: 175, backgroundColor: 'rgba(255,255,255,.05)' }} showsVerticalScrollIndicator={false}>
            {itemToRenderSeasons}
          </ScrollView>
        </BlurView>
      </Animated.View>
      <Animated.View
        style={[
          {
            alignItems: 'center',
            width: episodesInfo.width,
            // left: episodesInfo.left - windowWidth - seasonsInfo.width,
            left: episodesInfo.left,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            overflow: 'hidden',
            // top: seasonsInfo.top - seasonsInfo.height,
            opacity: opacityIn,
          },
          episodesHeightAnimatedStyle,
          seasonTopAnimatedStyle,
        ]}
      >
        <BlurView intensity={20} style={{ width: 200, height: 175 }}>
          <ScrollView style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,.05)' }} showsVerticalScrollIndicator={false}>
            {itemToRenderEpisodes}
          </ScrollView>
        </BlurView>
      </Animated.View>
      {/* </View> */}
    </>
  );
});

EpisodesModal.displayName = 'EpisodesModal';

export { EpisodesModal };
