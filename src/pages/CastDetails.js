import { useLocalSearchParams, Stack, useNavigation } from 'expo-router';
import { TextType1 } from '../components/TextType1';
import { MainFrame } from '../components/MainFrame';
import { ButtonGoBack } from '../components/ButtonGoBack';
import Animated, { useSharedValue, FadeInDown, FadeOut } from 'react-native-reanimated';
import { useState, useEffect, useMemo, useRef } from 'react';
import { fetchCastAwards, fetchCastDetails } from '../tmdb';
import { Image } from 'expo-image';
import { View, Dimensions, ScrollView, Pressable } from 'react-native';
import { SubTitleType1 } from '../components/SubTitleType1';
import { TextType2 } from '../components/TextType2';
import { BlurView } from 'expo-blur';
import { TagType1 } from '../components/TagType1';
import { CastAwardsContainer } from '../components/CastAwardsContainer';
import { CastMovies } from '../components/CastMovies';
import { arrayRemove, arrayUnion, doc, getDoc, setDoc } from 'firebase/firestore';
import { DataProviderLists, useDataLists } from '../contextLists';
import { useIsFocused } from '@react-navigation/native';
import { BookmarkerEmptyIcon, BookmarkerFullIcon } from '../SVGS';
import db from '../conection.js';
import * as Haptics from 'expo-haptics';

function Button_library({ entering }) {
  return (
    <Animated.View
      entering={entering ? FadeInDown.springify().damping(80).stiffness(150) : undefined}
      style={{
        width: 30,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 3,
      }}
    >
      <BookmarkerEmptyIcon width={13} height={13} fill="#ffffff9f" />
    </Animated.View>
  );
}
function Button_libraryFull({ entering }) {
  return (
    <Animated.View
      entering={entering ? FadeInDown.springify().damping(80).stiffness(150) : undefined}
      style={{
        width: 30,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 3,
      }}
    >
      <BookmarkerFullIcon width={13} height={13} fill="#ffffff9f" />
    </Animated.View>
  );
}

export default function CastDetails() {
  const { id, bg } = useLocalSearchParams();
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  const [cast, setCast] = useState(null);
  const isFocused = useIsFocused();
  const [newBG, setNewBG] = useState('');

  const prevWatchedMovies = useRef(null);

  const watchedMovies = useDataLists();

  useEffect(() => {
    if (watchedMovies) {
      setTimeout(() => {
        prevWatchedMovies.current = watchedMovies;
      }, 1000);
    }
  }, [watchedMovies]);
  useEffect(() => {
    const getCast = async () => {
      try {
        const fetchedCast = await fetchCastDetails({ castId: id });
        setCast(fetchedCast);
        if (!bg) {
          setNewBG(
            fetchedCast.credits?.cast[0] ? `https://image.tmdb.org/t/p/w92/${fetchedCast.credits.cast[0].poster_path}` : `https://image.tmdb.org/t/p/w92/${fetchedCast.credits.crew[0].poster_path}`,
          );
        } else {
          setNewBG(bg);
        }
      } catch (err) {
        console.error(`Error obteniendo fetchSerieDetails`, err);
      }
    };

    getCast();
  }, [id]);

  useEffect(() => {
    const getCastAwards = async () => {
      try {
        const fetchedCastAwards = await fetchCastAwards({ wikidata_CastId: cast.wikidata_id });
        setCast((prev) => ({ ...prev, ...fetchedCastAwards }));
      } catch (err) {
        console.error('Error obteniendo cast awards', err);
      }
    };

    if (cast && !cast?.awards) {
      setTimeout(() => {
        getCastAwards();
      }, 1000);
    }
  }, [cast]);

  const opacityOutBlurBar = useSharedValue(1);

  const jobs = [];
  for (let i = 0; i < cast?.jobs?.length; i++) {
    jobs.push(<TagType1 key={i}>{cast.jobs[i]}</TagType1>);
  }

  const handleOnPressCastList = () => {
    const onList = watchedMovies.castLists.includes(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (onList) {
      setDoc(
        doc(db, 'castLists', 'checked'),
        {
          tmdb_id: arrayRemove(id),
          imdb_id: arrayRemove(cast.imdb_id),
        },
        { merge: true },
      );
    } else {
      setDoc(
        doc(db, 'castLists', 'checked'),
        {
          tmdb_id: arrayUnion(id),
          imdb_id: arrayUnion(cast.imdb_id),
        },
        { merge: true },
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerBackTitleVisible: false,
          headerLeft: () => (
            <ButtonGoBack
              opacityBlur={opacityOutBlurBar}
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        }}
      />
      <MainFrame>
        <View style={{ position: 'absolute', width: '100%', overflow: 'hidden', height: windowHeight }}>
          {isFocused && (
            <Animated.View
              exiting={FadeOut.springify().damping(80).stiffness(50).delay(500)}
              entering={FadeInDown.springify().damping(350).stiffness(35)}
              style={{
                width: '100%',
                position: 'absolute',
                height: windowHeight,
              }}
            >
              <Image
                source={{ uri: newBG?.replace('original', 'w92'), cache: 'force-cached' }}
                contentFit="cover"
                transition={1000}
                style={[
                  {
                    width: '100%',
                    height: windowHeight,
                  },
                ]}
              />
              <BlurView intensity={100} style={{ width: windowWidth, position: 'absolute', backgroundColor: 'rgba(1,1,1,.6)', height: windowHeight }}></BlurView>
            </Animated.View>
          )}

          <ScrollView>
            {cast && (
              <View style={{ marginTop: 110, width: windowWidth, height: 180 }}>
                {isFocused && (
                  <Animated.View
                    exiting={FadeOut.springify().damping(80).stiffness(50).delay(500)}
                    entering={FadeInDown.springify().damping(350).stiffness(35)}
                    style={{
                      height: 180,
                      gap: 10,
                      width: windowWidth,
                      paddingHorizontal: 20,
                      flexDirection: 'row',
                    }}
                  >
                    {cast?.profile_img?.includes('null') ? (
                      <View style={{ width: 120, height: 180, borderRadius: 10, backgroundColor: 'rgba(0, 0, 0, 0.3)', alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={require('../../assets/images/icon--userFull.png')} style={{ width: 50, height: 50, opacity: 0.5 }} />
                      </View>
                    ) : (
                      <Animated.Image source={{ uri: cast.profile_img }} style={{ width: 120, height: 180, borderRadius: 10 }} entering={FadeInDown.springify().damping(80).stiffness(150)} />
                    )}

                    <Animated.View style={{ height: 180, justifyContent: 'center', alignItems: 'flex-start', width: windowWidth - 160 }} entering={FadeInDown.springify().damping(80).stiffness(150)}>
                      <SubTitleType1>{cast.name}</SubTitleType1>
                      <View style={{ marginTop: 3, flexDirection: 'row', justifyContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: '5' }}>{jobs}</View>
                      <View style={{ flexDirection: 'row' }}>
                        {cast.birthday && <TextType2 addStyle={{ marginTop: 5, marginLeft: 2 }}>{cast.birthday}</TextType2>}
                        {cast.deathday && <TextType2 addStyle={{ marginTop: 5 }}>{` - ${cast.deathday}`}</TextType2>}
                      </View>
                      {cast.place && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 2 }}>
                          <TextType2>{cast.place}</TextType2>
                          <TextType2 addStyle={{ fontSize: 18 }}>{` ${cast.flag}`}</TextType2>
                        </View>
                      )}
                    </Animated.View>
                    {watchedMovies && (
                      <Pressable style={{ position: 'absolute', left: 105, bottom: 5 }} onPress={handleOnPressCastList}>
                        {watchedMovies?.castLists?.includes(id) ? <Button_libraryFull /> : <Button_library />}
                      </Pressable>
                    )}
                  </Animated.View>
                )}
              </View>
            )}
            {cast?.awards?.length > 0 && (
              <>
                <CastAwardsContainer cast={cast} />
              </>
            )}
            {cast?.credits?.cast?.length > 0 && (
              <>
                <CastMovies movies={cast.credits.cast} type={'movies'} prevWatchedMovies={prevWatchedMovies} watchedMovies={watchedMovies} />
                <CastMovies movies={cast.credits.cast} type={'series'} prevWatchedMovies={prevWatchedMovies} watchedMovies={watchedMovies} />
              </>
            )}
            {cast?.credits?.crew?.length > 0 && (
              <>
                <CastMovies movies={cast.credits.crew} type={'director'} prevWatchedMovies={prevWatchedMovies} watchedMovies={watchedMovies} />
              </>
            )}

            <View style={{ height: windowHeight * 0.12, width: '100%', backgroundColor: 'rgba(20,20,20,0)', top: windowHeight * 0.35 }}></View>
          </ScrollView>
        </View>
      </MainFrame>
    </>
  );
}
