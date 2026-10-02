const colorRed1 = 'rgb(252, 75, 75)';
const colorRed07 = 'rgba(203, 58, 58, 0.18)';
const colorBlue1 = 'rgb(35, 129, 237)';
const colorBlue015 = 'rgba(35, 129, 237, 0.25)';
const colorPurple1 = 'rgb(137, 37, 219)';
const colorPurple01 = 'rgba(137, 37, 219, 0.1)';
const colorGreen1 = 'rgb(30, 215, 42)';
const colorGreen01 = 'rgba(46, 158, 54, 0.3)';
const colorYellow1 = 'rgb(255, 213, 0)';
const colorYellow01 = 'rgba(255, 213, 0,0.1)';
const colorBlack1 = 'rgb(20, 20, 20)';
const colorBlack01 = 'rgba(40, 40, 40,0.2)';

export const constantsAndInfo = {
  backgroundColor1: '#615E5B',
  backgroundColor2: '#222F39',
  genreColors: {
    action: 'rgb(45, 87, 116)',
    adventure: 'rgb(58, 141, 72)',
    animation: 'rgb(178, 153, 62)',
    comedy: 'rgb(124, 65, 123)',
    crime: 'rgb(108, 63, 161)',
    documentary: 'rgb(34, 33, 105)',
    drama: 'rgb(93, 30, 30)',
    family: 'rgb(17, 128, 130)',
    fantasy: 'rgb(226, 114, 202)',
    history: 'rgb(165, 71, 17)',
    horror: 'rgb(159, 19, 19)',
    music: 'rgb(31, 159, 102)',
    mystery: 'rgb(105, 75, 92)',
    romance: 'rgb(171, 52, 52)',
    science_fiction: 'rgb(197, 100, 36)',
    tv_movie: 'rgb(118, 33, 102)',
    thriller: 'rgb(68, 71, 91)',
    war: 'rgb(23, 76, 16)',
    western: 'rgb(125, 73, 27)',
  },

  buttonType1Colors: {
    red: { background: colorRed07, color: colorRed1 },
    blue: { background: colorBlue015, color: colorBlue1 },
    purple: { background: colorPurple01, color: colorPurple1 },
    green: { background: colorGreen01, color: colorGreen1 },
    yellow: { background: colorYellow01, color: colorYellow1 },
    black: { background: colorBlack01, color: colorBlack1 },
  },

  providersNames: {
    amazon_prime_video: 'amazon',
    apple_tv: 'apple',
    'apple_tv+': 'apple',
    cineplanet: 'cineplanet',
    cinemark: 'cinemark',
    cinepolis: 'cinepolis',
    crunchyroll: 'crunchyroll',
    disney_plus: 'disney',
    google: 'google',
    hbo_max: 'max',
    mubi: 'mubi',
    netflix: 'netflix',
    paramount_plus: 'paramount',
  },
  platformsToBuyMovies: ['Apple tv+', 'Amazon Prime Video'],

  notAcceptedProviders: [
    'Adrenalina Pura Amazon channel',
    'Adrenalina Pura Apple TV channel',
    'Apple TV Plus Amazon Channel',
    'Apple TV Amazon Channel',
    'Cindie Amazon Channel',
    'Crunchyroll Amazon Channel',
    'Cultpix',
    'Claro video',
    'DIRECTV GO',
    'FilmBox+',
    'Filmelier Plus Amazon Channel',
    'Google Play Movies',
    'Lionsgate+ Amazon Channels',
    'Looke Amazon Channel',
    'MGM+ Apple TV Channel',
    'MGM Plus Amazon Channel',
    'MGM Amazon Channel',
    'MovistarTV',
    'MUBI Amazon Channel',
    'Paramount+ Amazon Channel',
    'Paramount Plus Apple TV Channel',
    'Paramount Plus Apple TV Channel ',
    'Paramount Plus Apple TV channel',
    'Sony One Amazon Channel',
    'Universal+ Amazon Channel',
  ],

  // valor por defecto de mis suscripciones; la lista real vive en la db (ver src/myProviders.js)
  myProviders: ['Amazon Prime Video', 'Disney Plus', 'HBO Max', 'Netflix', 'Crunchyroll', 'Apple TV'],
  // suscripciones que se pueden elegir en Perfil > Mis suscripciones
  allProviders: ['Amazon Prime Video', 'Disney Plus', 'HBO Max', 'Netflix', 'Crunchyroll', 'Apple TV', 'MUBI'],
};
