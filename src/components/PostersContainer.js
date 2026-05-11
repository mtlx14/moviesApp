import { View, ScrollView, Pressable, FlatList } from 'react-native';

import { TextType1 } from './TextType1';
import { memo, useEffect, useState } from 'react';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Link } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';

function Poster({ img, i, type, openPoster }) {
  const img_url = type === 'posters' ? img.replace('original', 'w500') : type === 'backdrops' && img.replace('original', 'w780');

  const itemWidth = type === 'posters' ? 105 : 300;

  return (
    <Pressable onPress={() => openPoster({ open: true, img_url: img, type: type })} style={{ height: 160 }}>
      <Image
        source={{ uri: `${img_url}` }}
        contentFit="cover"
        transition={400}
        style={{
          width: itemWidth,
          height: 160,
          borderRadius: 8,
          marginHorizontal: 5,
          position: 'relative',

          // top: startImageMargin,
          // opacity: startImageOpacity,
        }}
        // onLoad={handleStartImageLoad}
      />
    </Pressable>
  );
}

const PostersContainer = memo(({ imgs, type, mt, openPoster, enableEntering }) => {
  const [visibleImgs, setVisibleImgs] = useState([]);

  const snapInterval = type === 'posters' ? 115 : 310;
  const containerHeight = useSharedValue(enableEntering ? 0 : 200);

  const containerHeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: containerHeight.value,
    };
  });

  useEffect(() => {
    if (imgs && imgs.length > 0) {
      containerHeight.value = withSpring(200);
      setVisibleImgs(imgs.slice(0, 5));
    } else {
      containerHeight.value = withSpring(0);
    }
  }, [imgs]);

  const loadMoreImages = () => {
    if (visibleImgs.length < imgs?.length) {
      setVisibleImgs(imgs);
    }
  };

  return (
    <Animated.View style={[{ width: '100%', overflow: 'hidden', flex: 1 }, containerHeightAnimatedStyle]}>
      <TextType1 addStyle={{ alignSelf: 'flex-start', marginLeft: 20, marginBottom: 5, fontSize: 17, marginTop: mt }}>{type === 'posters' ? 'Posters' : 'Imágenes'}</TextType1>

      {visibleImgs && visibleImgs.length > 0 && (
        <View style={{ height: 160 }}>
          <FlashList
            horizontal
            snapToInterval={snapInterval}
            data={visibleImgs}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item}_${index}`}
            contentContainerStyle={{
              paddingHorizontal: 15,
            }}
            onEndReached={loadMoreImages}
            onEndReachedThreshold={0.9}
            estimatedItemSize={type === 'posters' ? 115 : 310}
            windowSize={1}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            renderItem={({ item }) => <Poster img={item} type={type} openPoster={openPoster} />}
          />
        </View>
      )}
    </Animated.View>
  );
});

PostersContainer.displayName = 'PostersContainer';
export { PostersContainer };
