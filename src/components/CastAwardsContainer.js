import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { TextType1 } from './TextType1';
import { Pressable, View } from 'react-native';
import { TextType2 } from './TextType2';
import { Image } from 'expo-image';
import Animated, { FadeInDown, FadeInLeft, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { usePathname, useRouter } from 'expo-router';
import { useDataLists } from '../contextLists';
import { BookmarkerFullIcon, CheckIcon, HeartFullIcon } from '../SVGS';

function Button_playlist({ entering }) {
  return (
    <Animated.View
      entering={entering ? FadeInDown.springify().damping(80).stiffness(150) : undefined}
      style={{
        width: 20,
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 3,
      }}
    >
      <HeartFullIcon width={11} height={11} fill="#ffffffE6" />
    </Animated.View>
  );
}
function Button_watched({ entering }) {
  return (
    <Animated.View
      entering={entering ? FadeInDown.springify().damping(80).stiffness(150) : undefined}
      style={{
        width: 20,
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 3,
      }}
    >
      <CheckIcon width={10} height={10} fill="#ffffffE6" />
    </Animated.View>
  );
}
function Button_library({ entering }) {
  return (
    <Animated.View
      entering={entering ? FadeInDown.springify().damping(80).stiffness(150) : undefined}
      style={{
        width: 20,
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 3,
      }}
    >
      <BookmarkerFullIcon width={10} height={10} fill="#ffffffE6" />
    </Animated.View>
  );
}

const CastAwardsContainer = memo(({ cast }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [nominationsOpen, setNominationsOpen] = useState(false);
  const [watchedMovies, setWatchedMovies] = useState({});
  const prevWatchedMovies = useRef(null);

  const getWatchedMovies = useDataLists();

  useEffect(() => {
    if (getWatchedMovies) {
      if (prevWatchedMovies.current === null) {
        prevWatchedMovies.current = getWatchedMovies;
      } else {
        prevWatchedMovies.current = watchedMovies;
      }
      setWatchedMovies(getWatchedMovies);
    }
  }, [getWatchedMovies]);
  const awardsWon = useMemo(() => {
    return cast.awards.filter((item) => item.type == 'Won').sort((a, b) => b.year - a.year);
  }, [cast]);
  const nominations = useMemo(() => {
    return cast.awards.filter((item) => item.type == 'Nominated').sort((a, b) => b.year - a.year);
  }, [cast]);

  const itemsToShow = {
    total: [awardsWon.length, nominations.length],
    start: [awardsWon.length, awardsWon.length == 0 ? (nominations.length >= 2 ? 2 : nominations.length) : 0],
  };

  let wonRender = [];
  let nominationsRender = [];

  let gender_a = cast.gender === 1 ? 'a' : '';

  let textColor = 'rgba(255, 246, 224, .9)';
  let textColor2 = 'rgba(255, 246, 224, 0.7)';

  const handleOnPress = ({ movie_id }) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push(`${pathname.split('/')[1]}/screenMovieDetails/${movie_id}`);
  };

  const n_height = 46;
  const start_height = itemsToShow.start[1] * n_height;
  const total_height = itemsToShow.total[1] * n_height;
  const height_nominations = useSharedValue(start_height);
  const handleOnPress_showNominations = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    let nextHeight = nominationsOpen ? start_height : total_height;
    setNominationsOpen((prev) => !prev);
    height_nominations.value = withSpring(nextHeight, { duration: 1000, dampingRatio: 1.2 });
  };

  for (let i = 0; i < awardsWon.length; i++) {
    wonRender.push(
      <View key={i}>
        <Pressable
          style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 8, backgroundColor: i % 2 != 0 && 'rgba(255, 191, 42, 0.05)', borderRadius: 10, marginHorizontal: 8 }}
          onPress={() => handleOnPress({ movie_id: awardsWon[i].movie_tmdbId })}
        >
          <Image style={{ width: 30, height: 30, opacity: 0.7 }} source={require('../../assets/images/icon--oscar.png')} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center', paddingRight: 10 }}>
            <View style={{ alignItems: 'flex-start' }}>
              <TextType1 addStyle={{ color: textColor }}>{`Ganador${gender_a && 'a'} del ${awardsWon[i].award}`}</TextType1>

              <TextType2 addStyle={{ color: textColor2 }}>{`${awardsWon[i].movie} • ${awardsWon[i].year}`}</TextType2>
            </View>
            {watchedMovies?.watched?.includes(String(awardsWon[i].movie_tmdbId)) ? (
              <Button_watched entering={!prevWatchedMovies.current?.watched?.includes(String(awardsWon[i].movie_tmdbId))} />
            ) : watchedMovies?.playlist?.includes(String(awardsWon[i].movie_tmdbId)) ? (
              <Button_playlist entering={!prevWatchedMovies.current?.playlist?.includes(String(awardsWon[i].movie_tmdbId))} />
            ) : (
              watchedMovies?.library?.includes(String(awardsWon[i].movie_tmdbId)) && <Button_library entering={!prevWatchedMovies.current?.library?.includes(String(awardsWon[i].movie_tmdbId))} />
            )}
          </View>
        </Pressable>
      </View>,
    );
  }
  for (let i = 0; i < nominations.length; i++) {
    nominationsRender.push(
      <View key={i}>
        <Pressable
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            paddingVertical: 8,
            backgroundColor: (i + wonRender?.length) % 2 != 0 && 'rgba(255, 191, 42, 0.05)',
            borderRadius: 10,
            marginHorizontal: 8,
          }}
          onPress={() => handleOnPress({ movie_id: nominations[i].movie_tmdbId })}
        >
          <Image style={{ width: 30, height: 30, opacity: 0.2 }} source={require('../../assets/images/icon--oscar.png')} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center', paddingRight: 10, width: '100%' }}>
            <View style={{ alignItems: 'flex-start', flex: 1 }}>
              <TextType1 addStyle={{ color: textColor }}>{`Nominad${gender_a ? 'a' : 'o'} al ${nominations[i].award}`}</TextType1>
              <View style={{ flexDirection: 'row', width: '95%', justifyContent: 'flex-start' }}>
                <TextType2 addStyle={{ color: textColor2, flexShrink: 1, minWidth: 0, textAlign: 'left' }} numberOfLines={1} ellipsizeMode="tail">{`${nominations[i].movie}`}</TextType2>
                <TextType2 addStyle={{ color: textColor2 }}>{` • ${nominations[i].year}`}</TextType2>
              </View>
            </View>
            {watchedMovies?.watched?.includes(String(nominations[i].movie_tmdbId)) ? (
              <Button_watched />
            ) : watchedMovies?.playlist?.includes(String(nominations[i].movie_tmdbId)) ? (
              <Button_playlist />
            ) : (
              watchedMovies?.library?.includes(String(nominations[i].movie_tmdbId)) && <Button_library />
            )}
          </View>
        </Pressable>
      </View>,
    );
  }

  return (
    <Animated.View style={{ width: '100%', paddingHorizontal: 20, marginTop: 20 }} entering={FadeInLeft.springify().damping(80).stiffness(150).delay(200)}>
      <View
        style={{
          width: '100%',
          backgroundColor: 'rgba(255, 191, 42, 0.2)',
          borderColor: 'rgba(255, 191, 42, 0.2)',
          borderWidth: 1,
          // paddingHorizontal: 10,
          borderRadius: 10,
          //   gap: 8,
          overflow: 'hidden',
        }}
      >
        {wonRender}
        <Animated.View style={{ height: height_nominations, overflow: 'hidden' }}>{nominationsRender}</Animated.View>
        {itemsToShow.total[1] != itemsToShow.start[1] && (
          <>
            {/* <View style={{ width: '90%', height: 1, backgroundColor: 'rgba(159, 131, 67, 0.2)', marginHorizontal: '5%' }} /> */}
            <Pressable
              style={{
                paddingVertical: 5,
                backgroundColor: nominationsOpen ? (wonRender?.length + nominationsRender?.length) % 2 != 0 && 'rgba(255, 191, 42, 0.08)' : wonRender?.length % 2 != 0 && 'rgba(255, 191, 42, 0.08)',
                borderRadius: 0,
              }}
              onPress={handleOnPress_showNominations}
            >
              <TextType2 addStyle={{ color: textColor2 }}>
                {nominationsOpen ? 'Cerrar nominaciones' : itemsToShow.total[0] == 0 ? `Ver todas las nominaciones (total: ${itemsToShow.total[1]})` : `Ver nominaciones (${nominations.length})`}
              </TextType2>
            </Pressable>
          </>
        )}
      </View>
    </Animated.View>
  );
});

CastAwardsContainer.displayName = 'CastAwardsContainer';
export { CastAwardsContainer };
