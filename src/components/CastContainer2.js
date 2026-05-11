import { Dimensions, View, Image, ScrollView, Pressable } from 'react-native';

import { TextType1 } from './TextType1';
import { TextType2 } from './TextType2';
import { TextType3 } from './TextType3';
import { memo, useEffect, useState } from 'react';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { fetchMoreCast, fetchMoreCastSerie } from '../tmdb';
import { useRouter, usePathname } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import db from '../conection.js';
import { BookmarkerFullIcon } from '../SVGS';

const windowWidth = Dimensions.get('window').width;
const itemWidth = ((windowWidth - 40) * 0.8) / 3.2;

function Button_libraryFull() {
  return (
    <Animated.View
      style={{
        width: 12,
        height: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BookmarkerFullIcon width={7} height={7} fill="#ffffffE6" />
    </Animated.View>
  );
}

function CastItem({ sendCast, movieId, movieSerie, sendBg, setEnableAnimations, enableEntering, checkedList }) {
  const pathname = usePathname();
  const router = useRouter();
  const [cast, setCast] = useState(sendCast);
  const [castCant, setCastCant] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const handleOnPressMoraCast = ({}) => {
    const sliceList = castCant === 10;
    if (movieSerie === 'movie') {
      fetchMoreCast({ startIndex: castCant, movieId: movieId }).then(({ newCast, hasMore }) => {
        setHasMore(hasMore);
        setCastCant((prev) => prev + newCast?.length);
        setCast((prev) => [...(sliceList ? prev.slice(0, 10) : prev), ...newCast]);
      });
    } else if (movieSerie === 'serie') {
      fetchMoreCastSerie({ startIndex: castCant, movieId: movieId }).then(({ newCast, hasMore }) => {
        setHasMore(hasMore);
        setCastCant((prev) => prev + newCast?.length);
        setCast((prev) => [...(sliceList ? prev.slice(0, 10) : prev), ...newCast]);
      });
    }
    setEnableAnimations(true);
    setTimeout(() => {
      setEnableAnimations(false);
    }, 1000);
  };
  const handleOnPress = ({ cast_id }) => {
    router.push({
      pathname: `${pathname.split('/')[1]}/screenCastDetails/[id]`,
      params: {
        id: cast_id,
        bg: sendBg,
      },
    });
  };
  const castReturn = [];

  for (let i = 0; i < cast?.length && i < castCant; i++) {
    let characterNOfLines = cast[i].character && cast[i].character.includes('Additional') ? 1 : 2;
    let nameNOfLines = cast[i].character && cast[i].character.includes('Additional') ? 1 : 2;

    let cleanCharacter = cast[i].character;

    if (cast[i].character) {
      cleanCharacter = cleanCharacter.replace(' (voice)', '');
      cleanCharacter.includes('/') && (cleanCharacter = cleanCharacter.split('/')[0]);
      cleanCharacter.includes(' - ') && (cleanCharacter = cleanCharacter.split(' - ')[0]);
      cleanCharacter.includes(' (') && (cleanCharacter = cleanCharacter.split(' (')[0]);
    }

    if (cast) {
      castReturn.push(
        <Pressable key={i} onPress={() => handleOnPress({ cast_id: cast[i].id })}>
          <Animated.View
            style={{ width: itemWidth, alignItems: 'center' }}
            entering={enableEntering ? FadeInDown.springify().damping(80).stiffness(150) : undefined}
            layout={Layout.springify().damping(80).stiffness(150)}
          >
            {cast[i].img &&
              (cast[i]?.img.includes('null') ? (
                <View style={{ width: itemWidth * 0.9, height: 125, borderRadius: 8, marginBottom: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={require('../../assets/images/icon--userFull.png')} style={{ width: 40, height: 40, opacity: 0.5 }} />
                </View>
              ) : (
                <Image source={{ uri: `${cast[i].img}` }} resizeMode="cover" style={{ width: itemWidth * 0.9, height: 125, borderRadius: 8, marginBottom: 5 }}></Image>
              ))}
            <TextType1 numberOfLines={nameNOfLines}>{cast[i].name}</TextType1>
            {cast[i].character && (
              <TextType3 addStyle={{ fontSize: 13 }} numberOfLines={characterNOfLines}>
                {cleanCharacter}
              </TextType3>
            )}

            {checkedList?.includes(cast[i].id.toString()) && (
              <Pressable style={{ position: 'absolute', top: 110, right: 8 }}>
                <Button_libraryFull />
              </Pressable>
            )}
          </Animated.View>
        </Pressable>,
      );
    }
  }
  if (cast?.length > 10 && hasMore) {
    castReturn.push(
      <Pressable key={castCant + 10} style={{ width: itemWidth, height: 125, alignItems: 'center' }} onPress={handleOnPressMoraCast}>
        <BlurView
          intensity={10}
          style={{ backgroundColor: 'rgba(255,255,255,.1)', height: '100%', width: itemWidth * 0.9, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}
        >
          <Image source={require('../../assets/images/icon--userFull.png')} style={{ width: 40, height: 40, opacity: 0.8 }} />

          <TextType1>Ver mas</TextType1>
        </BlurView>
      </Pressable>,
    );
  }
  return (
    <Animated.View layout={Layout.springify().damping(80).stiffness(150)} style={{ marginTop: 5, flexDirection: 'row' }}>
      {castReturn}
    </Animated.View>
  );
}
const CastContainer2 = memo(({ director = [], cast = [], addStyle, movieId, movieSerie, sendBg, setEnableAnimations }) => {
  const [castLists, setCastLists] = useState([]);
  let directorText = director[0]?.job === 'creator' ? 'Creador:' : director[0]?.job === 'writer' ? 'Escritor:' : 'Director:';

  useEffect(() => {
    getDoc(doc(db, 'castLists', 'checked')).then((snap) => {
      if (snap.exists()) {
        setCastLists(snap.data().tmdb_id);
      }
    });
  }, []);

  return (
    // <View style={{ flexDirection: 'row', width: '100%' }}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={itemWidth} disableIntervalMomentum={false} style={{ width: windowWidth }}>
      {director.length > 0 && (
        <Animated.View style={{ paddingLeft: 20 }} layout={Layout.springify().damping(80).stiffness(150)}>
          <TextType1 addStyle={{ textAlign: 'flex-start', marginLeft: 5 }}>{directorText}</TextType1>
          <CastItem sendCast={director} movieSerie={movieSerie} sendBg={sendBg} setEnableAnimations={setEnableAnimations} checkedList={castLists} />
        </Animated.View>
      )}
      {cast.length > 0 && (
        <Animated.View style={[{ paddingRight: 20 }, director.length === 0 && { paddingLeft: 20 }]} layout={Layout.springify().damping(80).stiffness(150)}>
          <TextType1 addStyle={{ textAlign: 'flex-start', marginLeft: 5 }}>Reparto:</TextType1>
          <CastItem sendCast={cast} movieId={movieId} movieSerie={movieSerie} sendBg={sendBg} setEnableAnimations={setEnableAnimations} checkedList={castLists} />
        </Animated.View>
      )}
    </ScrollView>
    // </View>
  );
});

CastContainer2.displayName = 'CastContainer';

export { CastContainer2 };
