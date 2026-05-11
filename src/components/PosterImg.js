import { Image } from 'expo-image';
import { memo } from 'react';

const PosterImg = memo(({ defaultImg, useData }) => {
  const movieDB = useData();

  return <Image source={{ uri: `${movieDB?.fixedPoster || defaultImg}` }} contentFit="cover" style={{ width: 120, height: 180, borderRadius: 10 }} />;
});
PosterImg.displayName = 'PosterImg';
export { PosterImg };
