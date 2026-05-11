import { memo, useEffect } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { TextType2 } from './TextType2';
import db from '../conection.js';
import { arrayRemove, arrayUnion, doc, setDoc } from 'firebase/firestore';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { BookmarkerEmptyIcon, BookmarkerFullIcon, CheckIcon, CloseIcon, HeartEmptyIcon, HeartFullIcon, PopCornEmptyIcon, PopCornFullIcon } from '../SVGS.js';

const _imgSize = 13;
const _opacity = 0.7;

const imgSrc = {
  discard: <CloseIcon width={_imgSize} height={_imgSize} />,
  library: <BookmarkerEmptyIcon width={_imgSize} height={_imgSize} />,
  playlist: <HeartEmptyIcon width={_imgSize} height={_imgSize} />,
  watched: <CheckIcon width={_imgSize} height={_imgSize} />,
  watched_2: <CheckIcon width={_imgSize} height={_imgSize} />,
  watched_22: <CheckIcon width={_imgSize} height={_imgSize} />,
  playlist_2: <PopCornEmptyIcon width={_imgSize} height={_imgSize} />,
  discard2: <CloseIcon width={_imgSize} height={_imgSize} />,
  library2: <BookmarkerFullIcon width={_imgSize} height={_imgSize} />,
  playlist2: <HeartFullIcon width={_imgSize} height={_imgSize} />,
  watched2: <CheckIcon width={_imgSize} height={_imgSize} />,
  playlist_22: <PopCornFullIcon width={_imgSize} height={_imgSize} />,
};
const text = {
  discard: 'Descartar',
  library: 'Biblioteca',
  playlist: 'Playlist',
  watched: 'Ya la vi',
  watched_2: 'La vi con Aylin',
  playlist_2: 'Ver con Aylin',
};

const colors = {
  watched: { background: 'rgba(0, 193, 97, 0.2)', color: 'rgba(0,193,97,1)' },
  watched_2: { background: 'rgba(0, 193, 97, 0.2)', color: 'rgba(0,193,97,1)' },
  library: { background: 'rgba(94, 51, 226, 0.2)', color: 'rgba(94,51,226,1)' },
  discard: { background: 'rgba(0, 72, 255, 0.2)', color: 'rgba(0,72,255,1)' },
  playlist: { background: 'rgba(255, 0, 111, 0.2)', color: 'rgba(255,0,111,1) ' },
  playlist_2: { background: 'rgba(0, 146, 199, 0.2)', color: 'rgba(0,146,199,1)' },
};

const ItemToRender = memo(({ render, pressed, handleOnPress }) => {
  const background_sv = useSharedValue('rgba(255,255,255,0.05)');
  const shadowColor_sv = useSharedValue('rgba(255,255,255,0.05)');

  const base_bg = useSharedValue('rgba(255,255,255,.1)');

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: background_sv.value,
      shadowColor: shadowColor_sv.value,
    };
  });

  const baseAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: base_bg.value,
    };
  });

  useEffect(() => {
    if (pressed) {
      background_sv.value = withDelay(50, withTiming(colors[render].background, { duration: 200, dampingRatio: 1 }));
      shadowColor_sv.value = withDelay(50, withTiming(colors[render].color, { duration: 200, dampingRatio: 1 }));
      base_bg.value = withDelay(50, withTiming('rgba(100,100,100,.1)', { duration: 200, dampingRatio: 1 }));
    } else {
      background_sv.value = 'rgba(255,255,255,0.05)';
      shadowColor_sv.value = 'rgba(255,255,255,0.05)';
      base_bg.value = 'rgba(255,255,255,.1)';
    }
  }, [pressed, render]);

  let color = 'white';
  let image = imgSrc[render];
  let fontWeight = 400;
  let opacity = _opacity;
  let shadowOpacity = 0;

  if (pressed) {
    image = imgSrc[`${render}2`];
    fontWeight = 500;
    opacity = 0.9;
    shadowOpacity = 0.6;
  }
  return (
    <Pressable
      onPress={() => handleOnPress({ render: render })}
      pointerEvents="auto"
      style={[
        {
          flex: 1,
        },
      ]}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            borderRadius: 8,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: shadowOpacity,
            shadowRadius: 1,
          },
          backgroundAnimatedStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: 8,
            },
            baseAnimatedStyle,
          ]}
        ></Animated.View>

        <View style={{ opacity: opacity, marginTop: 5 }}>{image}</View>
        <TextType2 addStyle={{ fontSize: 12, color: color, opacity: opacity, fontWeight: fontWeight, marginBottom: 5 }}>{text[render]}</TextType2>
      </Animated.View>
    </Pressable>
  );
});

ItemToRender.displayName = 'ItemToRender';

const ButtonsMovieAdmin_2_noPress = memo(({ spaces, movieId, imdbId, moviesDB }) => {
  const render =
    spaces === 3
      ? ['library', 'playlist', 'watched']
      : moviesDB?.list?.includes('watched_2')
        ? ['library', 'playlist', 'playlist_2', 'watched_2']
        : moviesDB?.list?.includes('watched')
          ? moviesDB?.list?.includes('playlist_2')
            ? ['playlist', 'playlist_2', 'watched_2', 'watched']
            : ['library', 'playlist', 'playlist_2', 'watched']
          : moviesDB?.list?.includes('library')
            ? ['library', 'playlist', 'playlist_2', 'watched']
            : ['discard', 'library', 'playlist', 'watched'];

  const itemRender = [];

  for (let i = 0; i < spaces; i++) {
    let pressed = false;

    if (moviesDB?.list) {
      if (moviesDB.list.includes(render[i])) {
        pressed = true;
      }
    }
    itemRender.push(<ItemToRender key={i} render={render[i]} pressed={pressed} />);
  }
  return <View style={{ flexDirection: 'row', width: '100%', gap: 5 }}>{itemRender}</View>;
});

ButtonsMovieAdmin_2_noPress.displayName = 'ButtonsMovieAdmin_2_noPress';

export { ButtonsMovieAdmin_2_noPress };
