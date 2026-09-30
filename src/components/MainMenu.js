import { View, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import Animated, { runOnUI, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { memo, useEffect, useState } from 'react';
import { useDataMovie } from '../contextMovie';
import { TextType1 } from './TextType1';
import { useLocalSearchParams, useNavigation, usePathname, useRouter, useSegments } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../contextAuth';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const items = ['new', 'search', 'serie', 'movie', 'user'];
const icons = {
  select: {
    new: require('../../assets/images/icon--newFull.png'),
    otro: require('../../assets/images/icon--newFull.png'),
    movie: require('../../assets/images/icon--movieFull.png'),
    serie: require('../../assets/images/icon--tvFull.png'),
    search: require('../../assets/images/icon--searchFull.png'),
    user: require('../../assets/images/icon--userFull.png'),
  },
  no_select: {
    new: require('../../assets/images/icon--newEmpty.png'),
    otro: require('../../assets/images/icon--newEmpty.png'),
    movie: require('../../assets/images/icon--movieEmpty.png'),
    serie: require('../../assets/images/icon--tvEmpty.png'),
    search: require('../../assets/images/icon--searchEmpty.png'),
    user: require('../../assets/images/icon--userEmpty.png'),
  },
};
const texts = {
  new: 'Nuevo',
  search: 'Buscar',
  serie: 'Series',
  movie: 'Películas',
  user: 'Perfil',
};

const MainMenuItem = memo(({ item, lastRoutes, changeIndicatorMargin }) => {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const { user, notifyBlocked } = useAuth();

  const onSameTab = item.substring(0, 3) === pathname.substring(1, 4);

  const opacity = onSameTab ? 1 : 0.5;
  const img = onSameTab ? icons.select[item] : icons.no_select[item];

  const handlePress = () => {
    // Sin sesión solo se puede usar Perfil
    if (!user && item !== 'user') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      notifyBlocked();
      return;
    }

    let currentRoute = `/${segments.join('/')}`;

    const routeParams = currentRoute?.params;

    if (routeParams?.id) {
      currentRoute = currentRoute.replace('[id]', routeParams.id);
    }

    let routName = segments[0];
    if (segments[0] === '(tabs)') {
      routName = segments[1];
      currentRoute = currentRoute.replace('/(tabs)', '');
    }

    if (routName === item) {
      if (currentRoute === `/${item}`) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        router.replace(`${item}`);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.dismissTo(`${item}`);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push(lastRoutes[item]);
      changeIndicatorMargin({ _value: item });
    }
  };

  // useEffect(() => {
  //   // if (item === 'movie') {
  //   console.log('lastRoutesChange', lastRoutes);
  //   console.log('r', lastRoutes[item]);
  //   // }
  // }, [lastRoutes]);
  return (
    <Animated.View style={{ flexDirection: 'column', opacity: opacity, width: '20%' }}>
      <Pressable onPress={handlePress} style={{ width: '100%', alignItems: 'center' }}>
        <Image style={{ width: 30, height: 30, marginTop: 12 }} source={img}></Image>
        <TextType1>{texts[item]}</TextType1>
      </Pressable>
    </Animated.View>
  );
});

MainMenuItem.displayName = 'MainMenuItem';

const MainMenu = memo(() => {
  const itemsRender = [];

  const indicatorMargin = useSharedValue(0);

  const changeIndicatorMargin = ({ _value }) => {
    const newMargin = items.indexOf(_value) * (windowWidth * 0.2);
    indicatorMargin.value = withSpring(newMargin, { duration: 2500, dampingRatio: 0.6 });
  };

  const indicatorMarginAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginLeft: indicatorMargin.value,
    };
  });

  const segments = useSegments();
  const pathname = usePathname();

  const [lastRoutes, setLastRoutes] = useState({
    new: '/new',
    movie: '/movie',
    search: '/search',
    serie: '/serie',
    user: '/user',
  });

  useEffect(() => {
    if (segments?.length > 0) {
      let routName = segments[0];
      if (segments[0] === '(tabs)') {
        routName = segments[1];
      }
      setLastRoutes((prev) => ({
        ...prev,
        [routName]: pathname,
      }));
      // Mantiene el indicador bajo la pestaña actual (ej. al abrir la app directo en Perfil)
      if (items.includes(routName)) {
        changeIndicatorMargin({ _value: routName });
      }
    }
  }, [pathname]);

  for (let i = 0; i < items.length; i++) {
    itemsRender.push(<MainMenuItem key={i} item={items[i]} lastRoutes={lastRoutes} changeIndicatorMargin={changeIndicatorMargin} />);
  }

  return (
    <View style={{ width: '100%', height: '10%', position: 'absolute', top: '90%', left: 0, borderRadius: 15, overflow: 'hidden' }}>
      <BlurView
        intensity={40}
        tint={'light'}
        style={{ position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.1)', width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'space-around' }}
      >
        {itemsRender}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: '20%',
              height: 100,
              backgroundColor: 'rgba(169, 86, 86, 0)',
              alignItems: 'center',
              top: 50,
              left: 0,
            },
            indicatorMarginAnimatedStyle,
          ]}
        >
          <View
            style={{
              width: 8,
              height: 1.5,
              backgroundColor: 'rgba(255, 255, 255,.6)',
              marginTop: 8,
              borderRadius: 2,
            }}
          ></View>
        </Animated.View>
      </BlurView>
    </View>
  );
});

MainMenu.displayName = 'MainMenu';
export { MainMenu };
