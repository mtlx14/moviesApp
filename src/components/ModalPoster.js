import { BlurView } from 'expo-blur';
import { memo, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Pressable, View } from 'react-native';
import { styles } from '../style';
import { TextType1 } from './TextType1';
import Animated, { FadeIn, FadeOut, runOnJS, useAnimatedScrollHandler, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { doc, setDoc } from 'firebase/firestore';
import db from '../conection.js';
import { useDataMovie } from '../contextMovie.js';
import { CloseIcon } from '../SVGS.js';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ModalPoster = memo(({ data, openPoster }) => {
  const isPosterClosed = useRef(false);
  const startScroller = useSharedValue(false);
  const movieDB = useDataMovie();
  const [current_img, setCurrent_img] = useState(data.current_img);
  const [current_trailerImg, setCurrent_TrailerImg] = useState(data.current_trailerImg);

  const imdb_id = data.imdb_id;
  const type = data.type;
  let img_url = data.img_url;
  let original_img = data.original_img;

  useEffect(() => {
    if (movieDB) {
      setCurrent_TrailerImg(movieDB.fixedTrailerImg);
      if (type === 'posters') {
        setCurrent_img(movieDB.fixedPoster);
      } else {
        setCurrent_img(movieDB.fixedBackdrop);
      }
    }
  }, [movieDB]);

  const defaultPoster = type === 'posters' ? original_img === img_url : original_img === img_url.replace('w500', 'original');
  const imgSelected = type === 'posters' ? img_url === current_img : current_img === img_url.replace('w500', 'original');
  const trailerImgSelected = img_url.replace('w500', 'original') === current_trailerImg;

  const scrollViewRef = useRef(null);
  const closeScrollRef = useRef(null);
  const xPosition = useSharedValue(0.5);

  const startImageOpacity = useSharedValue(0);
  const startImageMargin = useSharedValue(30);
  const handleStartImageLoad = () => {
    startImageOpacity.value = withSpring(1, { duration: 1000, dampingRatio: 0.8 });
    startImageMargin.value = withSpring(0, { duration: 1000, dampingRatio: 1.2 });
    if (closeScrollRef.current) {
      closeScrollRef.current.scrollTo({ y: 200, animated: true });
    }
  };

  const handleOnPress = () => {
    if (imgSelected) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      if (type === 'posters') {
        setDoc(
          doc(db, 'movies', imdb_id),
          {
            fixedPoster: img_url,
            lastPosterChangeDate: Date.now(),
            lastPosterChangeType: 'poster',
          },
          { merge: true },
        );
      } else {
        setDoc(
          doc(db, 'movies', imdb_id),
          {
            fixedBackdrop: img_url.replace('w500', 'original'),
            lastPosterChangeDate: Date.now(),
            lastPosterChangeType: 'backdrop',
            backdropXPosition: xPosition.value.toFixed(2),
          },
          { merge: true },
        );
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  const handleOnPress_trailer = () => {
    if (trailerImgSelected) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      setDoc(
        doc(db, 'movies', imdb_id),
        {
          fixedTrailerImg: img_url.replace('w500', 'original'),
          lastTrailerImgChangeDate: Date.now(),
        },
        { merge: true },
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  let backgroundColor = 'rgba(255,255,255,0.2)';
  let backgroundColor2 = 'rgba(255,255,255,0.2)';
  let buttonText = 'Fijar como poster de película';
  let buttonText2 = 'Fijar como imagen de trailer';

  if (trailerImgSelected) {
    buttonText2 = 'Fijado como imagen de trailer';
    backgroundColor2 = 'rgba(255, 31, 128, 0.7)';
  }

  let _width = windowWidth * 0.8;
  let scrollHeight = _width * 1.5;
  let scrollEnabled = false;
  let imgWidth = _width;
  if (imgSelected) {
    backgroundColor = 'rgba(255, 31, 128, 0.7)';
    buttonText = 'Fijado como poster de película';
  }
  if (type === 'backdrops') {
    scrollHeight = _width * 1.2;
    scrollEnabled = true;
    imgWidth = scrollHeight * 1.7;
    buttonText = 'Fijar como fondo de película';
    if (imgSelected) {
      buttonText = 'Fijado como fondo de película';
    }
  }

  const handleScrollLoad = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: (scrollHeight * 1.7 - _width) * 0.5,
        animated: true,
      });
    }
  };

  const handleScroll = useAnimatedScrollHandler((e) => {
    const { x } = e.contentOffset;
    if (x >= 0 && x <= scrollHeight * 1.7 - _width) {
      let ceroOne = x / (scrollHeight * 1.7 - _width);
      xPosition.value = ceroOne;
    }
  });
  const closeScrollOpacity = useSharedValue(1);

  if (isPosterClosed.current) {
    closeScrollOpacity.value = 0;
  }

  const handleCloseScroll = useAnimatedScrollHandler((e) => {
    const { y } = e.contentOffset;

    if (!startScroller.value) {
      if (y >= 195) {
        startScroller.value = true;
      }
    } else {
      if (y <= 200 && y > 120) {
        closeScrollOpacity.value = (y - 120) / 80;
      } else if (y <= 120) {
        closeScrollOpacity.value = 0;
        if (!isPosterClosed.current) {
          isPosterClosed.current = true;
          runOnJS(openPoster)({ open: false, img_url: '', type: type });
        }
      }
    }
  });

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
        <Animated.ScrollView
          ref={closeScrollRef}
          style={{
            height: windowHeight * 0.9,
            maxHeight: windowHeight * 0.9,
            opacity: closeScrollOpacity,
            top: 0,
          }}
          onScroll={handleCloseScroll}
          scrollEventThrottle={16}
          scrollEnabled={startScroller ? true : false}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              height: 200,
              width: '100%',
            }}
          ></View>
          <View
            style={{
              height: windowHeight * 0.9,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Animated.View style={{ opacity: startImageOpacity, alignSelf: 'flex-end' }}>
              <Pressable style={[styles.buttonGoBack, { marginRight: windowWidth * 0.1 }]} onPress={() => openPoster({ open: false, img_url: '', type: type })}>
                <Animated.View style={{ opacity: 1, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.3)' }}>
                  <BlurView style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} intensity={20}>
                    <CloseIcon width={20} height={20} fill="#ffffff" />
                  </BlurView>
                </Animated.View>
              </Pressable>
            </Animated.View>
            <Animated.ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={scrollEnabled}
              style={{
                width: _width,
                height: scrollHeight,
                maxHeight: scrollHeight,
                overflow: 'hidden',
                // marginTop: windowHeight * 0.14,
                marginTop: 15,
                borderRadius: 10,
              }}
              onLayout={handleScrollLoad}
              onScroll={handleScroll}
            >
              <Animated.Image
                source={{ uri: img_url.replace('w500', 'original') }}
                style={{
                  height: scrollHeight,
                  width: imgWidth,
                  objectFit: 'cover',
                  opacity: startImageOpacity,
                  top: startImageMargin,
                  borderRadius: 10,
                }}
                onLoad={handleStartImageLoad}
              />
            </Animated.ScrollView>

            <Animated.View style={{ opacity: startImageOpacity, top: startImageMargin, position: 'relative' }}>
              <View style={{ marginTop: 15, opacity: defaultPoster ? 1 : 0 }}>
                <TextType1>{type === 'posters' ? '*Poster por defecto' : '*Fondo por defecto'}</TextType1>
              </View>
              <Pressable
                style={{
                  backgroundColor: backgroundColor,
                  height: 40,
                  alignItems: 'center',
                  width: windowWidth * 0.6,
                  justifyContent: 'center',
                  marginTop: 15,
                  borderRadius: 20,

                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                }}
                onPress={handleOnPress}
              >
                <TextType1>{buttonText}</TextType1>
              </Pressable>
              {type === 'backdrops' && (
                <Pressable
                  style={{
                    backgroundColor: backgroundColor2,
                    height: 40,
                    alignItems: 'center',
                    width: windowWidth * 0.6,
                    justifyContent: 'center',
                    marginTop: 15,
                    borderRadius: 20,

                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 5,
                  }}
                  onPress={handleOnPress_trailer}
                >
                  <TextType1>{buttonText2}</TextType1>
                </Pressable>
              )}
            </Animated.View>
          </View>
        </Animated.ScrollView>
      </Animated.View>
    </>
  );
});

ModalPoster.displayName = 'ModalPoster';

export { ModalPoster };
