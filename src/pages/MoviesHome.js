import { Dimensions, FlatList, Text, View } from 'react-native';
import { MainFrame } from '../components/MainFrame';
import Animated, { runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { TextType2 } from '../components/TextType2';
import { TextType1 } from '../components/TextType1';
import { useState, useEffect } from 'react';
import { firebasePLaylistMovies } from '../tmdb';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { PlaylistMovie } from '../components/PlaylistMovie';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const initialLists = {
  playlist: { id: 0, name: 'Playlist', data: 'showInPlaylist' },
  playlist_2: { id: 1, name: 'Ver con Aylin', data: 'showInPlaylist_2' },
  library: { id: 2, name: 'Biblioteca', data: 'library' },
  watched: { id: 3, name: 'Vistas', data: 'watched' },
  watched_2: { id: 4, name: 'Vistas con Aylin', data: 'watched_2' },
};

export default function MoviesHome() {
  const [lists, setLists] = useState(initialLists);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentRealIndex, setCurrentRealIndex] = useState(0);

  //   lists scroll
  //   ------------------------------------------------------------------------------------------------
  const iMarginLeft = useSharedValue(windowWidth);
  const iWidth = useSharedValue(20);

  const iMarginLeftAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginLeft: iMarginLeft.value,
      width: iWidth.value,
    };
  });
  const handleOnLayout = ({ e, key }) => {
    const { width } = e.nativeEvent.layout;
    setLists((prevLists) => ({
      ...prevLists,
      [key]: { ...prevLists[key], width },
    }));

    if (key === 'playlist') {
      iMarginLeft.value = withSpring(0);
      iWidth.value = withSpring(width);
      setCurrentIndex(0);
    }
  };
  const handleScroll = useAnimatedScrollHandler((e) => {
    const { x } = e.contentOffset;
    const xW = x / windowWidth;

    if (Number.isInteger(xW)) {
      runOnJS(setCurrentRealIndex)(xW);
    }
    const currentWidth = Object.values(lists).find((item) => item.id === currentIndex)?.width;
    const previousWidth = Object.values(lists).find((item) => item.id === currentIndex - 1)?.width;
    const nextWidth = Object.values(lists).find((item) => item.id === currentIndex + 1)?.width;

    let currentMargin = 0;
    Object.values(lists)
      .filter((item) => item.id < currentIndex)
      .forEach((item) => {
        currentMargin += item?.width + 20;
      });

    let previousMargin = currentMargin - 20 - previousWidth;
    let dNextMargin = currentWidth + 20;

    if (!Number.isInteger(xW)) {
      let finalWidth = '';
      let finalMargin = '';

      if (xW > currentIndex && nextWidth) {
        finalWidth = currentWidth + (nextWidth - currentWidth) * (xW - Math.floor(xW));
        finalMargin = currentMargin + dNextMargin * (xW - Math.floor(xW));

        if (xW > Math.ceil(xW) - 0.2 && currentIndex !== Math.ceil(xW)) {
          iWidth.value = withTiming(nextWidth, { duration: 200, dampingRatio: 0.2 });
          iMarginLeft.value = withTiming(currentMargin + dNextMargin, { duration: 200, dampingRatio: 0.6 });
          runOnJS(setCurrentIndex)(Math.ceil(xW));
        } else {
          iWidth.value = finalWidth;
          iMarginLeft.value = finalMargin;
        }
      }
      if (xW < currentIndex && previousWidth) {
        finalWidth = previousWidth + (currentWidth - previousWidth) * (xW - Math.floor(xW));
        finalMargin = previousMargin + (previousWidth + 20) * (xW - Math.floor(xW));

        if (xW < Math.floor(xW) + 0.2 && currentIndex !== Math.floor(xW)) {
          runOnJS(setCurrentIndex)(Math.floor(xW));
          iWidth.value = withTiming(previousWidth, { duration: 200, dampingRatio: 0.6 });
          iMarginLeft.value = withTiming(previousMargin, { duration: 200, dampingRatio: 0.6 });
        } else {
          iWidth.value = finalWidth;
          iMarginLeft.value = finalMargin;
        }
      }
    }
  });
  //   ------------------------------------------------------------------------------------------------

  return (
    <>
      <MainFrame>
        <Animated.FlatList
          data={Object.entries(lists)}
          keyExtractor={(index) => index.toString()}
          contentContainerStyle={{ width: windowWidth * lists.length }}
          style={{ height: windowHeight, position: 'absolute', top: 0 }}
          horizontal
          snapToInterval={windowWidth}
          decelerationRate={'fast'}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item: [key, value], index }) => {
            return (
              <View style={{ width: windowWidth, height: windowHeight, alignItems: 'center', justifyContent: 'center' }}>
                <PlaylistMovie item={value.data} index={index} isActive={index === currentRealIndex} />
              </View>
            );
          }}
        />
        <BlurView intensity={50} style={{ height: windowHeight * 0.1, width: '100%', position: 'absolute', backgroundColor: 'rgba(255,255,255,.1)' }}></BlurView>
        <Animated.View
          style={{
            flexDirection: 'row',
            gap: 20,
            paddingHorizontal: 20,
            position: 'absolute',
            width: windowWidth,
            height: windowHeight * 0.1,
            alignItems: 'flex-end',
            paddingBottom: 8,
          }}
        >
          {Object.entries(lists).map(([key, item]) => (
            <View style={{ flexGrow: 1 }} key={key} onLayout={(e) => handleOnLayout({ e, key })}>
              <TextType1 addStyle={{ fontSize: 15 }}>{item.name}</TextType1>
            </View>
          ))}
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 20,
                height: 1.5,
                bottom: 5,
                backgroundColor: 'rgba(255,255,255,0.4)',
              },
              iMarginLeftAnimatedStyle,
            ]}
          ></Animated.View>
        </Animated.View>
      </MainFrame>
    </>
  );
}
