import { View, Pressable, Linking, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { TextType1 } from './TextType1';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { memo, useEffect } from 'react';
import Animated, { FadeInDown, withSpring, useSharedValue } from 'react-native-reanimated';
import { TextType2 } from './TextType2';
import { FlashList } from '@shopify/flash-list';

const windowWidth = Dimensions.get('window').width;

const NextEpisodeSerie = memo(({ movie }) => {
  if (!movie.currentEpisodeInfo) return;

  const img_url = movie.currentEpisodeInfo.imgs[0];
  return (
    <Animated.View style={{ width: '100%', paddingHorizontal: 20, marginTop: 16 }}>
      <Animated.View style={{ position: 'relative' }}>
        <View style={{ width: '100%', height: ((windowWidth - 40) / 16) * 7, borderRadius: 10, overflow: 'hidden', zIndex: 10 }}>
          <FlashList
            data={movie.currentEpisodeInfo.imgs}
            estimatedItemSize={windowWidth}
            horizontal
            pagingEnabled
            decelerationRate={'fast'}
            snapToInterval={windowWidth - 40}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <Image
                  source={{ uri: item, cache: 'force-cached' }}
                  contentFit="cover"
                  //   placeholder={{ uri: lq_img_url, cache: 'force-cached' }}
                  placeholderContentFit="cover"
                  style={{
                    width: windowWidth - 40,
                    aspectRatio: 16 / 7,
                  }}
                />
              );
            }}
          >
            <LinearGradient
              colors={['rgba(20,20,20,0.0)', 'rgba(0, 0, 0, 0.7)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 0, y: 1 }}
              style={[{ height: '100%', position: 'absolute', width: '100%', alignItems: 'center' }]}
              locations={[0, 1]}
            ></LinearGradient>
          </FlashList>
          <View style={{ position: 'absolute', bottom: 8, right: 4, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <BlurView style={{ position: 'absolute', borderRadius: 40, overflow: 'hidden', width: '100%', height: 18, backgroundColor: 'rgba(255,255,255,0.3)' }} intensity={15}></BlurView>
            <TextType1 addStyle={{ marginHorizontal: 8, fontSize: 12, marginBottom: 0.5 }}>{`Viendo E${movie.currentEpisodeInfo.episode}:S${movie.currentEpisodeInfo.season}`}</TextType1>
          </View>
        </View>
        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'flex-start', paddingBottom: 5, borderRadius: 10, marginTop: -30, paddingTop: 35, paddingHorizontal: 10 }}>
          <TextType1 addStyle={{ fontSize: 16 }}>{movie.currentEpisodeInfo.name}</TextType1>
          <TextType2 addStyle={{ textAlign: 'left' }}>{movie.currentEpisodeInfo.overview}</TextType2>
        </View>
      </Animated.View>
    </Animated.View>
  );
});

NextEpisodeSerie.displayName = 'NextEpisodeSerie';
export { NextEpisodeSerie };
