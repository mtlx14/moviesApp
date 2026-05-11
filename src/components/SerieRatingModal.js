import { memo, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Pressable, View, ScrollView, Text } from 'react-native';
import { styles } from '../style.js';
import { TextType1 } from './TextType1.js';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown, FadeOutUp, runOnJS, useAnimatedScrollHandler, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { doc, setDoc } from 'firebase/firestore';
import db from '../conection.js';
import { useDataMovie } from '../contextMovie.js';
import { RatingStars } from './RatingStars.js';
import { BlurView } from 'expo-blur';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const SerieRatingModal = memo(({ imdb_id, openRating }) => {
  const [rateText, setRateText] = useState('0.0');
  const scrollRef = useRef(null);
  const opacityScrollText = useSharedValue(0);

  const handleOnPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setDoc(
      doc(db, 'series', imdb_id),
      {
        myRating: rateText,
      },
      { merge: true },
    );
    openRating({ open: false });
  };

  const handleScroll = useAnimatedScrollHandler((e) => {
    const { x } = e.contentOffset;
    if (x >= 30 && x <= windowHeight * 0.2 + 30) {
      let rate = ((1 - (x - 30) / (windowHeight * 0.2)) * 4 + 1).toFixed(1);
      if (rate !== '1.0') {
        opacityScrollText.value = withSpring(1);
      }

      runOnJS(setRateText)(rate);
    } else if (x < 30) {
      runOnJS(setRateText)((5.0).toFixed(1));
      opacityScrollText.value = withTiming(0, { duration: 500 });
    } else if (x > windowHeight * 0.2 + 30) {
      runOnJS(setRateText)((1.0).toFixed(1));
      opacityScrollText.value = withTiming(0, { duration: 500 });
    }
  });
  const handleScrollEnd = () => {
    opacityScrollText.value = withTiming(0, { duration: 500 });
  };
  const handleScrollOnLayout = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: false });
    }
  };

  return (
    <>
      <Animated.View
        style={{
          width: windowWidth,
          height: windowHeight,
          backgroundColor: 'rgba(1,1,1,0.5)',
          position: 'absolute',
          top: 0,
        }}
        entering={FadeIn.springify().damping(80).stiffness(150)}
        exiting={FadeOut.springify().damping(80).stiffness(150)}
      >
        <BlurView intensity={30} style={{ width: '100%', height: '100%', position: 'absolute' }}></BlurView>
        <Animated.View entering={FadeInDown.springify().damping(80).stiffness(150)} exiting={FadeOutDown.springify().damping(80).stiffness(150)}>
          <Animated.View style={{ opacity: 1, alignSelf: 'flex-end', marginTop: windowHeight * 0.25 }}>
            <Pressable style={[styles.buttonGoBack, { marginRight: windowWidth * 0.15 }]} onPress={() => openRating({ open: false })}>
              <Animated.View style={{ opacity: 1, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <BlurView style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} intensity={20}>
                  <CloseIcon height={18} width={18} />
                </BlurView>
              </Animated.View>
            </Pressable>
          </Animated.View>
          <Animated.View style={{ position: 'absolute', marginTop: windowHeight * 0.28, width: '100%', alignItems: 'center', opacity: opacityScrollText }}>
            <Animated.Text style={{ color: 'white', fontSize: 20, opacity: 0.7 }}>{rateText}</Animated.Text>
          </Animated.View>

          <Animated.View
            style={{ width: windowWidth * 0.7, left: windowWidth * 0.15, alignItems: 'center', backgroundColor: 'rgba(255,255,255,.15)', paddingTop: 20, borderRadius: 10, marginTop: 10 }}
          >
            <RatingStars rating={rateText} addStyleImg={{ width: 22, height: 22, marginHorizontal: 2 }} />
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <TextType1 addStyle={{ fontSize: 16, marginTop: 10, width: 80 }}>Puntuación: </TextType1>
              <Animated.Text style={{ fontSize: 18, marginTop: 10, color: 'white', width: 25 }}>{rateText}</Animated.Text>
            </View>
            <View style={{ width: '100%', borderTopColor: 'rgba(255,255,255,.2)', borderTopWidth: 1, height: 50, justifyContent: 'center', marginTop: 10 }}>
              <Pressable onPress={handleOnPress}>
                <TextType1 addStyle={{ fontSize: 18 }}>Guardar</TextType1>
              </Pressable>
            </View>
            <Animated.ScrollView
              ref={scrollRef}
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{
                width: windowWidth,
                height: 80,
                position: 'absolute',
              }}
              onScroll={handleScroll}
              onScrollEndDrag={handleScrollEnd}
              onLayout={handleScrollOnLayout}
            >
              <View style={{ width: windowWidth * 1.5 }}></View>
            </Animated.ScrollView>
          </Animated.View>
          <Pressable style={{ paddingTop: 10, alignItems: 'center' }} onPress={() => openRating({ open: false })}>
            <TextType1 addStyle={{ borderBottomColor: 'rgba(255,255,255,.5)', color: 'rgba(255,255,255,.5)', borderBottomWidth: 1 }}>Cancelar</TextType1>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </>
  );
});

SerieRatingModal.displayName = 'SerieRatingModal';

export { SerieRatingModal };
