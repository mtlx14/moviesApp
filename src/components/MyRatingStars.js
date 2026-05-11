import { memo } from 'react';
import { RatingStars } from './RatingStars';
import { Pressable, View } from 'react-native';
import { TextType1 } from './TextType1';
import { TextType3 } from './TextType3';

import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';

const MyRatingStars = memo(({ sectionStyle, openRating, color, useData }) => {
  const movieDb = useData();

  const movieRating = (movieDb && movieDb?.myRating) || 0;

  if (movieDb && movieDb?.list?.includes('watched')) {
    return (
      <>
        <Animated.View entering={FadeInLeft.springify().damping(80).stiffness(150)} exiting={FadeOutRight.springify().damping(80).stiffness(150)}>
          <Pressable style={{ flexDirection: 'row' }} onPress={() => openRating({ open: true })}>
            <RatingStars addStyleImg={sectionStyle.starImg} addStyleContainer={sectionStyle.starContainer} rating={movieRating} color={color} />
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <TextType1 addStyle={sectionStyle.textRating}>{movieRating}</TextType1>
              <TextType3>{`Mi puntuación${movieRating === 0 ? ' (sin puntos)' : ''}`}</TextType3>
            </View>
          </Pressable>
        </Animated.View>
      </>
    );
  } else {
    return <></>;
  }
});

MyRatingStars.displayName = 'MyRatingStars';
export { MyRatingStars };
