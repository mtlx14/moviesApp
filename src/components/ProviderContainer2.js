import { memo } from 'react';
import { View, Image, Pressable, Linking, ScrollView, Dimensions } from 'react-native';
import { constantsAndInfo } from '../constantsAndInfo';
import Animated, { Layout } from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width;

const providersNames = constantsAndInfo.providersNames;
const logosSrc = {
  amazon: require('../../assets/images/logo--amazon_prime_videoWide.png'),
  apple: require('../../assets/images/logo--apple_tvWide.png'),
  cinemark: require('../../assets/images/logo--cinemarkWide.png'),
  cineplanet: require('../../assets/images/logo--cineplanetWide.png'),
  cinepolis: require('../../assets/images/logo--cinepolisWide.png'),
  crunchyroll: require('../../assets/images/logo--crunchyrollWide.png'),
  disney: require('../../assets/images/logo--disney_plusWide2.png'),
  google: require('../../assets/images/logo--googleWide.png'),
  max: require('../../assets/images/logo--maxWidth.png'),
  mubi: require('../../assets/images/logo--mubiWide.png'),
  netflix: require('../../assets/images/logo--netflixWide.png'),
  paramount: require('../../assets/images/logo--paramount_plusWide.png'),
  noImg: require('../../assets/images/icon--noImg.png'),
};

const backgrounds = {
  amazon: 'rgba(55, 136, 235,.9)',
  apple: 'rgba(24, 24, 24, 0.9)',
  cinemark: 'rgba(219, 40, 40,.9)',
  cineplanet: 'rgba(35, 51, 107,.9)',
  cinepolis: 'rgba(255,255,255,.9)',
  crunchyroll: 'rgba(255, 94, 0, 0.9)',
  disney: 'rgba(21, 121, 141, 0.9)',
  google: 'rgba(255,255,255,.9)',
  max: 'rgba(21, 64, 239, 0.9)',
  mubi: 'rgba(25, 61, 209, 0.9)',
  netflix: 'rgba(255,255,255,.9)',
  paramount: 'rgba(0,100,225, 0.9)',
  noImg: 'rgba(255,255,255,0.2)',
};

const openLinks = async (platform, movieTitle) => {
  const links = {
    cinemark: ['https://www.cinemark.cl/cine?tag=512&cine=cinemark_alto_las_condes', 'https://www.cinemark.cl/'],
    cinepolis: ['https://cinepolischile.cl/cartelera/santiago-oriente/cinepolis-la-reina', 'https://cinepolischile.cl/'],
    cineplanet: ['https://www.cineplanet.cl/peliculas/', 'https://www.cineplanet.cl/'],
    amazon: [`https://app.primevideo.com/search?phrase=${movieTitle.toLowerCase().replaceAll(' ', '+')}`],
    netflix: [`https://www.netflix.com/search?q=${movieTitle.toLowerCase().replaceAll(' ', '%20')}`],
    disney: [`https://www.disneyplus.com/`],
    paramount: [`https://www.paramountplus.com/`],
    max: [`https://play.max.com/`],
    mubi: [`https://mubi.com/es/cl/films/${movieTitle.toLowerCase().replaceAll(' ', '-')}`],
  };

  if (platform in links) {
    for (const link of links[platform]) {
      try {
        const supported = await Linking.canOpenURL(link);
        if (supported) {
          await Linking.openURL(link);
          return;
        }
      } catch (err) {
        console.error(`Error al intentar abrir ${link}:`, err);
      }
    }
  } else {
    let link = `https://www.google.com/search?q=movie:+${movieTitle.toLowerCase().replaceAll(' ', '+')}`;
    try {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
        return;
      }
    } catch (err) {
      console.error(`Error al intentar abrir ${link}:`, err);
    }
  }

  console.error('Ninguno de los enlaces es compatible');
};

function RenderProvider({ platforms, movieTitle, type }) {
  const providerToReturn = [];

  for (let i = 0; i < platforms.length && i < 4; i++) {
    let platform = constantsAndInfo.providersNames[platforms[i].toLowerCase().replaceAll(' ', '_')];
    let imageSrc = platform in logosSrc ? logosSrc[platform] : logosSrc.noImg;
    let getBackGround = platform in backgrounds ? backgrounds[platform] : backgrounds.noImg;

    let img_height = platforms.length === 1 ? 24 : platforms.length === 2 ? 22 : platforms.length === 3 ? 22 : platforms.length === 4 && 18;
    providerToReturn.push(
      <Pressable
        key={i}
        style={{
          height: 42,
          backgroundColor: getBackGround,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          overflow: 'hidden',
        }}
        onPress={() => openLinks(platform, movieTitle)}
      >
        <Image style={{ height: img_height, resizeMode: 'contain' }} source={imageSrc}></Image>
        {type === 'buy' && (
          <Image style={{ height: 15, width: 15, resizeMode: 'contain', position: 'absolute', right: 5, top: 5, opacity: 0.6 }} source={require('../../assets/images/icon--coins.png')}></Image>
        )}
      </Pressable>,
    );
  }

  return <>{providerToReturn}</>;
}
const ProviderContainer2 = memo(({ provider, providerType, movieTitle, addStyle }) => {
  let platforms = [];

  if (providerType === 'google') {
    platforms = ['Google'];
  }
  if (providerType === 'cinemas') {
    platforms = ['Cineplanet', 'Cinepolis', 'Cinemark'];
  }
  if (providerType === 'stream') {
    let newProvider = [];
    if (constantsAndInfo.myProviders.some((str) => provider.includes(str))) {
      newProvider = constantsAndInfo.myProviders.filter((str) => provider.includes(str));
    } else {
      newProvider = provider;
    }
    for (let i = 0; i < newProvider.length; i++) {
      platforms.push(newProvider[i]);
    }
  }
  if (providerType === 'buy') {
    platforms = constantsAndInfo.platformsToBuyMovies;
  }
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: windowWidth }} snapToInterval={windowWidth} disableIntervalMomentum={true} decelerationRate={'fast'}>
      <View style={([addStyle], { flexDirection: 'row', width: windowWidth, gap: '2%', paddingHorizontal: 20 })}>
        <RenderProvider platforms={platforms} movieTitle={movieTitle} type={providerType} />
      </View>
      {!platforms.includes('Google') && (
        <View style={([addStyle], { flexDirection: 'row', width: windowWidth, gap: '2%', paddingHorizontal: 20 })}>
          <RenderProvider platforms={['Google']} movieTitle={movieTitle} type={providerType} />
        </View>
      )}
    </ScrollView>
  );
});

ProviderContainer2.displayName = 'ProviderContainer2';
export { ProviderContainer2 };
