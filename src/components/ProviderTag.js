import { Text, View, Image } from 'react-native';
import { styles } from '../style';
import { constantsAndInfo } from '../constantsAndInfo';

const providerNames = constantsAndInfo.providersNames;
export const logosSrc = {
  amazon: require('../../assets/images/logo--amazon_prime_videoWide.png'),
  apple: require('../../assets/images/logo--apple_tvWide.png'),
  cinemark: require('../../assets/images/logo--cinemarkWide.png'),
  cineplanet: require('../../assets/images/logo--cineplanetWide.png'),
  cinepolis: require('../../assets/images/logo--cinepolisWide.png'),
  crunchyroll: require('../../assets/images/logo--crunchyrollWide.png'),
  disney: require('../../assets/images/logo--disney_plusWide.png'),
  google: require('../../assets/images/logo--googleWide.png'),
  max: require('../../assets/images/logo--maxWidth.png'),
  mubi: require('../../assets/images/logo--mubiWide.png'),
  netflix: require('../../assets/images/logo--netflixWide2.png'),
  paramount: require('../../assets/images/logo--paramount_plus.png'),
  noImg: require('../../assets/images/icon--noImg.png'),
};
export const backgrounds = {
  amazon: 'rgba(55, 136, 235,.6)',
  apple: 'rgba(24, 24, 24, 0.5)',
  cinemark: 'rgba(219, 40, 40,.5)',
  cineplanet: 'rgba(35, 51, 107,.5)',
  cinepolis: 'rgba(255,255,255,.5)',
  crunchyroll: 'rgba(255, 94, 0, 0.6)',
  disney: 'rgba(21, 121, 141, 0.5)',
  google: 'rgba(255,255,255,.5)',
  max: 'rgba(21, 64, 239, 0.5)',
  mubi: 'rgba(25, 61, 209, 0.5)',
  netflix: 'rgba(229,9,20,.4)',
  noImg: 'rgba(255,255,255,0.2)',
};

export function ProviderTag({ children, ...props }) {
  let platform = constantsAndInfo.providersNames[children.toLowerCase().replaceAll(' ', '_')];
  let getBackGround = platform in backgrounds ? backgrounds[platform] : backgrounds.noImg;

  let imageSrc = platform in logosSrc ? logosSrc[platform] : logosSrc.noImg;

  return (
    <View style={{ backgroundColor: getBackGround, height: 18, alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
      <Image style={{ height: 12, width: 62, resizeMode: 'contain' }} source={imageSrc}></Image>
    </View>
  );
}
