import { View, Image, Pressable, Linking } from 'react-native';
import { styles } from '../style';
import { TextType1 } from './TextType1';
import { TextType2 } from './TextType2';
import { memo } from 'react';
import { constantsAndInfo } from '../constantsAndInfo';

const providerNames = constantsAndInfo.providersNames;
const logosSrc = {
  amazon: require('../../assets/images/logo--amazon_prime_video.png'),
  apple: require('../../assets/images/logo--apple_tv.png'),
  cinemark: require('../../assets/images/logo--cinemark.png'),
  cineplanet: require('../../assets/images/logo--cineplanet.png'),
  cinepolis: require('../../assets/images/logo--cinepolis.png'),
  crunchyroll: require('../../assets/images/logo--crunchyroll.png'),
  disney: require('../../assets/images/logo--disney_plus.png'),
  google: require('../../assets/images/logo--google.png'),
  max: require('../../assets/images/logo--max.png'),
  mubi: require('../../assets/images/logo--mubi.png'),
  netflix: require('../../assets/images/logo--netflix.png'),
  paramount: require('../../assets/images/logo--paramount_plus.png'),
  noImg: require('../../assets/images/icon--noImg.png'),
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

function RenderProvider({ platforms, movieTitle }) {
  const providerToReturn = [];

  for (let i = 0; i < platforms.length; i++) {
    let platform = constantsAndInfo.providersNames[platforms[i].toLowerCase().replaceAll(' ', '_')];
    let imageSrc = platform in logosSrc ? logosSrc[platform] : logosSrc.noImg;
    providerToReturn.push(
      <Pressable key={i} style={styles.providerItem} onPress={() => openLinks(platform, movieTitle)}>
        <Image style={styles.providerItem__logo} source={imageSrc}></Image>
        <TextType2 numberOfLines={1}>{platforms[i]}</TextType2>
      </Pressable>,
    );
  }

  return <View style={styles.providerBottom}>{providerToReturn}</View>;
}
const ProviderContainer = memo(({ provider, providerType, movieTitle, addStyle }) => {
  let title = '';
  let platforms = [];
  console.log(provider);

  if (providerType === 'google') {
    title = 'Buscar en:';
    platforms = ['Google'];
  }
  if (providerType === 'cinemas') {
    title = 'Disponible en salas de cines:';
    platforms = ['Cineplanet', 'Cinepolis', 'Cinemark'];
  }
  if (providerType === 'stream') {
    title = 'Disponible con suscripción en:';

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
    title = 'Disponible para comprar o arrendar';
    platforms = constantsAndInfo.platformsToBuyMovies;
  }
  return (
    <View style={[styles.providerContainer, addStyle]}>
      <TextType1 addStyle={{ textAlign: 'center', margin: 0 }}>{title}</TextType1>
      <RenderProvider platforms={platforms} movieTitle={movieTitle} />
    </View>
  );
});

ProviderContainer.displayName = 'ProviderContainer';
export { ProviderContainer };
