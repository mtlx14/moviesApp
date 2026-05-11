import { View } from 'react-native';
import { Image } from 'expo-image';
import { styles } from '../style';
import { isDateInFuture } from '../function';
import { TagType1 } from './TagType1';
import { memo, useEffect } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
const imgs_src = {
  yellow: {
    full: require('../../assets/images/icon--starFull.png'),
    half: require('../../assets/images/icon--starHalf.png'),
    empty: require('../../assets/images/icon--starEmpty.png'),
  },
  blue: {
    full: require('../../assets/images/icon--starFull_blue.png'),
    half: require('../../assets/images/icon--starHalf_blue.png'),
    empty: require('../../assets/images/icon--starEmpty_blue.png'),
  },
  pink: {
    full: require('../../assets/images/icon--starFull_pink.png'),
    half: require('../../assets/images/icon--starHalf_pink.png'),
    empty: require('../../assets/images/icon--starEmpty_pink.png'),
  },
};

const RatingStars = memo(({ addStyleImg, addStyleContainer, rating, releaseDate, color }) => {
  color = color || 'yellow';
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2;

  for (let i = 1; i < 6; i++) {
    if (roundedRating >= i) {
      stars.push(<Image key={i} transition={1000} style={[styles.starImg, addStyleImg]} source={imgs_src[color].full}></Image>);
    } else if (roundedRating + 0.5 === i) {
      stars.push(<Image key={i} transition={1000} style={[styles.starImg, addStyleImg]} source={imgs_src[color].half}></Image>);
    } else {
      stars.push(<Image key={i} transition={1000} style={[styles.starImg, addStyleImg]} source={imgs_src[color].empty}></Image>);
    }
  }

  if (isDateInFuture(releaseDate)) {
    return (
      <TagType1 addStyle={[addStyleContainer, { height: addStyleContainer.height - 4, marginVertical: 2 }]} addStyleText={{ fontSize: 10 }}>
        Próximamente
      </TagType1>
    );
  } else {
    return <View style={[styles.starContainer, addStyleContainer]}>{stars}</View>;
  }
});

RatingStars.displayName = 'RatingStars';
export { RatingStars };
