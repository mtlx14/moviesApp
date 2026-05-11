import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { TextType1 } from './TextType1';
import { Pressable, View } from 'react-native';
import { TextType2 } from './TextType2';
import { Image } from 'expo-image';
import Animated, { FadeInDown, FadeInLeft, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { usePathname, useRouter } from 'expo-router';
import { useDataLists } from '../contextLists';
const MovieAwards = memo(({ awards = [], heightValue, animated_opacity }) => {
  const [nominationsOpen, setNominationsOpen] = useState(false);
  console.log('heightValue', heightValue.value);

  const awardsWon = useMemo(() => {
    return awards.filter((item) => item.type == 'Won');
  }, [awards]);
  const nominations = useMemo(() => {
    return awards.filter((item) => item.type == 'Nominated');
  }, [awards]);

  let total_height = 0;
  const heights = [...awardsWon, ...nominations].map((item) => {
    const i_height = item.showPerson ? 46 : 35;
    total_height += i_height;
    return i_height;
  });

  let awardsRender = [];

  let textColor = 'rgba(255, 246, 224, .9)';
  let textColor2 = 'rgba(255, 246, 224, 0.7)';

  const start_height = heights[0] + (heights[1] ?? 0);

  const height_nominations = useSharedValue(start_height);
  const handleOnPress_showNominations = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    let nextHeight = nominationsOpen ? start_height : total_height;
    setNominationsOpen((prev) => !prev);
    height_nominations.value = withSpring(nextHeight, { duration: 1000, dampingRatio: 1.2 });
  };

  const awardsHeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(heightValue.value, [0, 1], [0, height_nominations.value + 10 + (heights.length > 2 ? 30 : 0)]),
    };
  });

  for (let i = 0; i < awardsWon.length; i++) {
    const pre_text = awardsWon[i].showPerson ? (awardsWon[i].gender === 'femenino' ? 'Ganadora del' : 'Ganador del') : 'Ganadora del';
    awardsRender.push(
      <View key={i}>
        <Pressable
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            height: awardsWon[i].showPerson ? 46 : 35,
            backgroundColor: i % 2 != 0 && 'rgba(255, 191, 42, 0.05)',
            borderRadius: 10,
            marginHorizontal: 8,
          }}
        >
          <Image style={{ width: 20, height: 20, opacity: 0.7 }} source={require('../../assets/images/icon--oscar.png')} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
            <View style={{ alignItems: 'flex-start' }}>
              <TextType1 addStyle={{ color: textColor }}>{`${pre_text} ${awardsWon[i].award}`}</TextType1>

              {awardsWon[i].showPerson && <TextType2 addStyle={{ color: textColor2 }}>{`${awardsWon[i].recipient}`}</TextType2>}
            </View>
          </View>
        </Pressable>
      </View>,
    );
  }
  for (let i = 0; i < nominations.length; i++) {
    const pre_text = nominations[i].showPerson ? (nominations[i].gender === 'femenino' ? 'Nominada al' : 'Nominado al') : 'Nominada al';
    awardsRender.push(
      <View key={i + awardsWon.length}>
        <Pressable
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            height: nominations[i].showPerson ? 46 : 35,
            paddingVertical: 8,
            backgroundColor: (i + awardsWon?.length) % 2 != 0 && 'rgba(255, 191, 42, 0.05)',
            borderRadius: 10,
            marginHorizontal: 8,
          }}
          // onPress={() => handleOnPress({ movie_id: nominations[i].movie_tmdbId })}
        >
          <Image style={{ width: 20, height: 20, opacity: 0.2 }} source={require('../../assets/images/icon--oscar.png')} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center', paddingRight: 10 }}>
            <View style={{ alignItems: 'flex-start' }}>
              <TextType1 addStyle={{ color: textColor }}>{`${pre_text} ${nominations[i].award}`}</TextType1>
              {nominations[i].showPerson && <TextType2 addStyle={{ color: textColor2 }}>{`${nominations[i].recipient}`}</TextType2>}
            </View>
          </View>
        </Pressable>
      </View>,
    );
  }
  if (awardsRender.length > 0) {
    return (
      <Animated.View
        style={[{ width: '100%', paddingHorizontal: 20 }, awardsHeightAnimatedStyle]}
        //  entering={FadeInLeft.springify().damping(80).stiffness(150).delay(200)}
      >
        <View
          style={{
            width: '100%',
            backgroundColor: 'rgba(255, 191, 42, 0.2)',
            borderColor: 'rgba(255, 191, 42, 0.2)',
            borderWidth: 1,
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <Animated.View style={{ height: height_nominations, overflow: 'hidden' }}>{awardsRender}</Animated.View>
          {awardsWon.length + nominations.length > 2 && (
            <>
              <Pressable
                style={{
                  paddingVertical: 5,
                  backgroundColor: nominationsOpen ? awardsRender?.length % 2 != 0 && 'rgba(255, 191, 42, 0.08)' : 'rgba(255, 191, 42, 0)',
                  borderRadius: 0,
                  height: 26,
                }}
                onPress={handleOnPress_showNominations}
              >
                <TextType2 addStyle={{ color: textColor2 }}>{nominationsOpen ? 'Ver menos' : 'Ver todo'}</TextType2>
              </Pressable>
            </>
          )}
        </View>
      </Animated.View>
    );
  }
});

MovieAwards.displayName = 'MovieAwards';
export { MovieAwards };
