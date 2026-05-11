import { memo, useRef } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Pressable, ActionSheetIOS, findNodeHandle, UIManager } from 'react-native';
import { SubTitleType1 } from './SubTitleType1';
import { TextType2 } from './TextType2';
import { TextType1 } from './TextType1';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { doc, setDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import db from '../conection.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ButtonsEpisodes = memo(({ useData, serie, handleOpenEpisodesModal, open, getNextEpisode }) => {
  const divSeasonRef = useRef(null);
  const divEpisodesRef = useRef(null);
  const getSerieDB = useData();
  const serieDB = getSerieDB ? ('changes' in getSerieDB ? getSerieDB.changes : getSerieDB) : [];

  let seasons = serie.seasons;

  let watchedEpisodes = serieDB?.episodes || 0;
  let currentSeason = serieDB?.season || 1;
  let seasonEpisodes = serie.episodesForSeasons[currentSeason - 1];
  let remainingSeasons = seasons - currentSeason + (watchedEpisodes === 0 ? 1 : 0);
  let remainingEpisodes = seasonEpisodes - watchedEpisodes;
  let lastSeasonsEmittedEpisodes = serie.lastEpisodeNumber;
  let totalRemainingEpisodes = remainingEpisodes;
  let emittedRemainingEpisodes = remainingEpisodes - (seasonEpisodes - lastSeasonsEmittedEpisodes);
  let nextEpisodeSeason = serie.nextEpisodeSeason || null;

  for (let i = 0; i < seasons - currentSeason; i++) {
    totalRemainingEpisodes += serie.episodesForSeasons[i + currentSeason];
  }
  let episodesThisSeason = currentSeason === seasons ? lastSeasonsEmittedEpisodes : seasonEpisodes;

  let seasonStatusText = remainingSeasons > 0 && totalRemainingEpisodes > 0 ? `${remainingSeasons} temporada${remainingSeasons > 1 ? 's' : ''}, ` : '';
  let episodesStatusText = totalRemainingEpisodes >= 1 ? `${totalRemainingEpisodes} episodio${totalRemainingEpisodes > 1 ? 's' : ''} por ver ` : '';
  let emittedStatusText = emittedRemainingEpisodes && nextEpisodeSeason === currentSeason ? ` (${emittedRemainingEpisodes} emitido)` : '';

  let statusText = seasonStatusText + episodesStatusText;

  statusText = statusText || 'Todos los episodios vistos';

  const sendRef = {
    seasons: {},
    episodes: {},
  };

  const sendCant = {};
  const sendOpen = {};

  const handlePress = ({ type }) => {
    sendCant.seasons = seasons;
    sendCant.episodes = seasonEpisodes;
    sendOpen.seasons = type == 'seasons' && !open.seasons && seasons > 1;
    sendOpen.episodes = type == 'episodes' && !open.episodes;
    const getRef = findNodeHandle(divSeasonRef.current);
    const getRef2 = findNodeHandle(divEpisodesRef.current);

    if (getRef && getRef2) {
      let refsReady = 0;

      const trySend = () => {
        refsReady++;
        if (refsReady === 2) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          handleOpenEpisodesModal({
            open: sendOpen,
            cant: sendCant,
            divInfo: sendRef,
          });
        }
      };

      requestAnimationFrame(() => {
        UIManager.measureInWindow(getRef, (x, y, width, height) => {
          sendRef.seasons = { width, height, left: x, top: y };
          trySend();
        });
        UIManager.measureInWindow(getRef2, (x, y, width, height) => {
          sendRef.episodes = { width, height, left: x, top: y };
          trySend();
        });
      });
    }
  };

  const handleOnPressPlusOne = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    let sendEpisode = null;
    let sendSeason = null;

    if (watchedEpisodes < episodesThisSeason) {
      sendEpisode = watchedEpisodes + 1;
      sendSeason = currentSeason;
    } else {
      if (currentSeason < seasons) {
        sendEpisode = 1;
        sendSeason = currentSeason + 1;
      }
    }

    setDoc(
      doc(db, 'series', serie.imdb_id),
      {
        ...(sendEpisode !== null && { episodes: sendEpisode }),
        ...(sendSeason !== null && { season: sendSeason }),
      },
      { merge: true },
    );
    getNextEpisode({ season: sendSeason, episode: sendEpisode });
  };

  let s_changingBorders = open.seasons ? 0 : 5;
  let e_changingBorders = open.episodes ? 0 : 5;

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mainScroll} snapToInterval={windowWidth} disableIntervalMomentum={true} decelerationRate={'fast'}>
        <View style={styles.sectionContainers}>
          <View style={[styles.buttons, { width: '100%' }]}>
            <TextType1>{statusText}</TextType1>
            <TextType2>{emittedStatusText}</TextType2>
          </View>
        </View>
        <View style={styles.sectionContainers}>
          {/* <TextType1>Episodios vistos:</TextType1> */}
          <View style={styles.leftButtonsContainer}>
            <View style={[styles.buttons, { paddingHorizontal: 10, backgroundColor: 'rgba(255,255,255,.05)' }]}>
              <TextType1>Vistos:</TextType1>
            </View>
            <Pressable
              style={[styles.buttons, { flex: 1, borderBottomLeftRadius: s_changingBorders, borderBottomRightRadius: s_changingBorders }]}
              onPress={() => handlePress({ type: 'seasons' })}
              ref={divSeasonRef}
            >
              <TextType1>{`Temporada: ${currentSeason}`}</TextType1>
              <TextType2 addStyle={{ fontSize: 10, marginTop: -3 }}>{`/${seasons}`}</TextType2>
            </Pressable>
            <Pressable
              style={[styles.buttons, { flex: 1, borderBottomLeftRadius: e_changingBorders, borderBottomRightRadius: e_changingBorders }]}
              onPress={() => handlePress({ type: 'episodes' })}
              ref={divEpisodesRef}
            >
              <TextType1>{`Episodio: ${watchedEpisodes}`}</TextType1>
              <TextType2 addStyle={{ fontSize: 10, marginTop: -3 }}>{`/${seasonEpisodes}`}</TextType2>
            </Pressable>
            <Pressable onPress={handleOnPressPlusOne} style={[styles.buttons, { flex: 0.3 }]}>
              <TextType1>+ 1</TextType1>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
});

ButtonsEpisodes.displayName = 'ButtonsEpisodes';

export { ButtonsEpisodes };

const styles = StyleSheet.create({
  mainScroll: {
    width: windowWidth,
    marginTop: 0,
  },
  sectionContainers: {
    alignItems: 'flex-start',
    width: windowWidth,
    paddingHorizontal: 20,
  },
  leftButtonsContainer: { height: 26, width: '100%', flexDirection: 'row', gap: 5 },
  buttons: { backgroundColor: 'rgba(255,255,255,.1)', height: 26, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderRadius: 5 },
});
