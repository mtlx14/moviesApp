import { isDateInFuture } from './function';
import { constantsAndInfo } from './constantsAndInfo';
import { collection, doc, getDoc } from 'firebase/firestore';
import db from './conection';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNzg1ZDhkNTZkMDZlNDNlMTFhNGVmNjhiN2NkOGFkZSIsIm5iZiI6MTY4OTY1NjE2NC44NDcwMDAxLCJzdWIiOiI2NGI2MWI2NGUwY2E3ZjAxMjUzZWMxNjAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.c8YHyXczoDKFWREc5jqrQeK7OBBklGfhMtNrw0TUegs',
  },
};
const apiKeyOMDB = '443c7843';
function formatDate(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
}
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h${remainingMinutes}m`;
}

function moreThanAMonth(dateString) {
  const [day, month, year] = dateString.split('-').map(Number);
  const inputDate = new Date(year, month - 1, day);

  const currentDate = new Date();

  const diffInMonths = (currentDate.getFullYear() - inputDate.getFullYear()) * 12 + (currentDate.getMonth() - inputDate.getMonth());

  if (diffInMonths > 1 || (diffInMonths === 1 && currentDate.getDate() >= day)) {
    return true;
  }

  return false;
}

function getFlagEmoji(languageCode) {
  const codePoints = languageCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function romanToInt(roman) {
  const romanMap = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;

  for (let i = 0; i < roman.length; i++) {
    let current = romanMap[roman[i]];
    let next = romanMap[roman[i + 1]];

    if (next && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }

  return total;
}

function convertRomanInText(text) {
  if (!text) return undefined;
  const romanRegex = /\b[IVXLCDM]+\b/gi; // Detecta números romanos en mayúscula o minúscula

  return text.replace(romanRegex, (match) => {
    const upperMatch = match.toUpperCase();
    return isValidRoman(upperMatch) ? romanToInt(upperMatch.toLowerCase().replace(/ /g, '_').replace(/:/g, '')) : match;
  });
}

const countryToCode = {
  Afghanistan: 'AF',
  Albania: 'AL',
  Algeria: 'DZ',
  Andorra: 'AD',
  Angola: 'AO',
  'Antigua and Barbuda': 'AG',
  Argentina: 'AR',
  Armenia: 'AM',
  Australia: 'AU',
  Austria: 'AT',
  Azerbaijan: 'AZ',
  Bahamas: 'BS',
  Bahrain: 'BH',
  Bangladesh: 'BD',
  Barbados: 'BB',
  Belarus: 'BY',
  Belgium: 'BE',
  Belize: 'BZ',
  Benin: 'BJ',
  Bhutan: 'BT',
  Bolivia: 'BO',
  'Bosnia and Herzegovina': 'BA',
  Botswana: 'BW',
  Brazil: 'BR',
  Brunei: 'BN',
  Bulgaria: 'BG',
  'Burkina Faso': 'BF',
  Burundi: 'BI',
  'Cabo Verde': 'CV',
  Cambodia: 'KH',
  Cameroon: 'CM',
  Canada: 'CA',
  'Central African Republic': 'CF',
  Chad: 'TD',
  Chile: 'CL',
  China: 'CN',
  Colombia: 'CO',
  Comoros: 'KM',
  'Congo (Brazzaville)': 'CG',
  'Congo (Kinshasa)': 'CD',
  'Costa Rica': 'CR',
  Croatia: 'HR',
  Cuba: 'CU',
  Cyprus: 'CY',
  'Czech Republic': 'CZ',
  Denmark: 'DK',
  Djibouti: 'DJ',
  Dominica: 'DM',
  'Dominican Republic': 'DO',
  Ecuador: 'EC',
  Egypt: 'EG',
  'El Salvador': 'SV',
  'Equatorial Guinea': 'GQ',
  Eritrea: 'ER',
  Estonia: 'EE',
  Eswatini: 'SZ',
  Ethiopia: 'ET',
  Fiji: 'FJ',
  Finland: 'FI',
  France: 'FR',
  Gabon: 'GA',
  Gambia: 'GM',
  Georgia: 'GE',
  Germany: 'DE',
  Ghana: 'GH',
  Greece: 'GR',
  Grenada: 'GD',
  Guatemala: 'GT',
  Guinea: 'GN',
  'Guinea-Bissau': 'GW',
  Guyana: 'GY',
  Haiti: 'HT',
  Honduras: 'HN',
  Hungary: 'HU',
  Iceland: 'IS',
  India: 'IN',
  Indonesia: 'ID',
  Iran: 'IR',
  Iraq: 'IQ',
  Ireland: 'IE',
  Israel: 'IL',
  Italy: 'IT',
  Jamaica: 'JM',
  Japan: 'JP',
  Jordan: 'JO',
  Kazakhstan: 'KZ',
  Kenya: 'KE',
  Kiribati: 'KI',
  Kuwait: 'KW',
  Kyrgyzstan: 'KG',
  Laos: 'LA',
  Latvia: 'LV',
  Lebanon: 'LB',
  Lesotho: 'LS',
  Liberia: 'LR',
  Libya: 'LY',
  Liechtenstein: 'LI',
  Lithuania: 'LT',
  Luxembourg: 'LU',
  Madagascar: 'MG',
  Malawi: 'MW',
  Malaysia: 'MY',
  Maldives: 'MV',
  Mali: 'ML',
  Malta: 'MT',
  'Marshall Islands': 'MH',
  Mauritania: 'MR',
  Mauritius: 'MU',
  Mexico: 'MX',
  Micronesia: 'FM',
  Moldova: 'MD',
  Monaco: 'MC',
  Mongolia: 'MN',
  Montenegro: 'ME',
  Morocco: 'MA',
  Mozambique: 'MZ',
  Myanmar: 'MM',
  Namibia: 'NA',
  Nauru: 'NR',
  Nepal: 'NP',
  Netherlands: 'NL',
  'New Zealand': 'NZ',
  Nicaragua: 'NI',
  Niger: 'NE',
  Nigeria: 'NG',
  'North Korea': 'KP',
  'North Macedonia': 'MK',
  Norway: 'NO',
  Oman: 'OM',
  Pakistan: 'PK',
  Palau: 'PW',
  Palestine: 'PS',
  Panama: 'PA',
  'Papua New Guinea': 'PG',
  Paraguay: 'PY',
  Peru: 'PE',
  Philippines: 'PH',
  Poland: 'PL',
  Portugal: 'PT',
  Qatar: 'QA',
  Romania: 'RO',
  Russia: 'RU',
  Rwanda: 'RW',
  'Saint Kitts and Nevis': 'KN',
  'Saint Lucia': 'LC',
  'Saint Vincent and the Grenadines': 'VC',
  Samoa: 'WS',
  'San Marino': 'SM',
  'Sao Tome and Principe': 'ST',
  'Saudi Arabia': 'SA',
  Senegal: 'SN',
  Serbia: 'RS',
  Seychelles: 'SC',
  'Sierra Leone': 'SL',
  Singapore: 'SG',
  Slovakia: 'SK',
  Slovenia: 'SI',
  'Solomon Islands': 'SB',
  Somalia: 'SO',
  'South Africa': 'ZA',
  'South Korea': 'KR',
  'South Sudan': 'SS',
  Spain: 'ES',
  'Sri Lanka': 'LK',
  Sudan: 'SD',
  Suriname: 'SR',
  Sweden: 'SE',
  Switzerland: 'CH',
  Syria: 'SY',
  Taiwan: 'TW',
  Tajikistan: 'TJ',
  Tanzania: 'TZ',
  Thailand: 'TH',
  'Timor-Leste': 'TL',
  Togo: 'TG',
  Tonga: 'TO',
  'Trinidad and Tobago': 'TT',
  Tunisia: 'TN',
  Turkey: 'TR',
  Turkmenistan: 'TM',
  Tuvalu: 'TV',
  'U.S.': 'US',
  Uganda: 'UG',
  UK: 'GB',
  Ukraine: 'UA',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United States': 'US',
  USA: 'US',
  Uruguay: 'UY',
  Uzbekistan: 'UZ',
  Vanuatu: 'VU',
  'Vatican City': 'VA',
  Venezuela: 'VE',
  Vietnam: 'VN',
  Yemen: 'YE',
  Zambia: 'ZM',
  Zimbabwe: 'ZW',
};

function setJobs({ known_for, credits, gender }) {
  const jobs = [...new Set(credits.crew.map((item) => item.job))];
  known_for = known_for.toLowerCase();

  const isMatch = (job, keyword) => job.toLowerCase().includes(keyword);

  const sendJobs = jobs
    .map((job) => {
      if (known_for != 'producer' && isMatch(job, 'producer')) return gender == 1 ? 'Productora' : 'Productor';
      if (known_for != 'writer' && isMatch(job, 'writer')) return gender == 1 ? 'Escritora' : 'Escritor';
      if (known_for != 'screenplay' && isMatch(job, 'screenplay')) return 'Guionista';
      if (known_for != 'director' && isMatch(job, 'director')) return gender == 1 ? 'Directora' : 'Director';
      return null;
    })
    .filter(Boolean);

  const translate = {
    acting: gender == 1 ? 'Actriz' : 'Actor',
    directing: gender == 1 ? 'Directora' : 'Director',
    writing: gender == 1 ? 'Escritora' : 'Escritor',
    producing: gender == 1 ? 'Productora' : 'Productor',
  };

  known_for = translate[known_for] || undefined;
  known_for && sendJobs.unshift(known_for);
  known_for != 'acting' && credits.cast.length > 5 && sendJobs.unshift(gender == 1 ? 'Actriz' : 'Actor');

  return [...new Set(sendJobs)];
}

function isValidRoman(roman) {
  return /^[IVXLCDM]+$/.test(roman);
}
export const fetchNewMovies = async () => {
  const allMovies = [];
  let currentPage = 1;
  let totalPages = 1;

  let cantOfMovies = 90;

  const baseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'w500';

  try {
    while (currentPage <= totalPages) {
      const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${currentPage}`, options);

      const data = await response.json();

      const moviesWithVotes = data.results.filter((movie) => movie.vote_count > 20);

      for (let i = 0; i < moviesWithVotes.length; i++) {
        const newMovie = {
          id: moviesWithVotes[i].id,
          title: moviesWithVotes[i].original_language === 'es' ? moviesWithVotes[i].original_title : moviesWithVotes[i].title,
          poster: `${baseURL}${imgSize}${moviesWithVotes[i].poster_path}`,
          rating: parseFloat((moviesWithVotes[i].vote_average / 2).toFixed(1)),
          release_date: formatDate(moviesWithVotes[i].release_date),
        };

        if (!allMovies.some((movie) => movie.id === newMovie.id)) {
          allMovies.push(newMovie);
        }

        if (allMovies.length >= cantOfMovies) return allMovies;
      }

      totalPages = data.total_pages;
      currentPage++;
    }
    return allMovies;
  } catch (error) {
    console.error('Error al obtener las películas:', error);
    return [];
  }
};

export const fetchMovieDetails = async ({ movieId }) => {
  const movie = {};
  const imgBaseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'original';
  const imgSizePoster = 'w500';
  const imgSizeCast = 'w500';
  const showConsoleForErrors = false;

  try {
    // const response = await fetch(
    //   `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=alternative_titles%2Ctranslations%2Crelease_dates%2Cwatch/providers%2Cvideos%2Ccredits%2Cexternal_ids%2Csimilar%2Cimages?include_image_language=en%2Cimages?include_image_language=null&language=en-US`,
    //   options,
    // );
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=alternative_titles%2Ctranslations%2Crelease_dates%2Cwatch/providers%2Cvideos%2Ccredits%2Cexternal_ids%2Csimilar%2Cimages&include_image_language=en,null&language=en-US`,
      options,
    );

    // const response = await fetch(
    //   `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=alternative_titles%2Ctranslations%2Crelease_dates%2Cwatch/providers%2Cvideos%2Ccredits%2Cexternal_ids%2Csimilar%2Cimages?include_image_language=en%2Cimages?include_image_language=null&language=en-US`,
    //   options,
    // );

    const data = await response.json();
    // console.log('aa', data.images);

    // console.log('id', movieId);
    // console.log('data1', movieId, data.external_ids.wikidata_id);
    // console.log('similar', data.similar);

    movie.alternative_titles = data.alternative_titles.titles;
    movie.backdrop = `${imgBaseURL}${imgSize}${data.backdrop_path}`;
    movie.collection_id = data.belongs_to_collection ? data.belongs_to_collection.id : null;
    movie.country = getFlagEmoji(data.origin_country[0]) || '';
    movie.id = data.id;
    movie.imdb_id = data.imdb_id;
    movie.original_language = data.original_language.toUpperCase();
    movie.poster = `${imgBaseURL}${imgSizePoster}${data.poster_path}`;
    movie.rating = parseFloat((data.vote_average / 2).toFixed(1)).toFixed(1);
    movie.relatedMovies_ids;
    movie.release_date = formatDate(data.release_date);
    movie.runtime = formatDuration(data.runtime);
    movie.spanishTitle = data.original_language === 'es' ? data.original_title : data.title;
    movie.tagline = data.tagline;
    movie.title = data.original_language === 'es' ? data.original_title : data.title;
    movie.US_title = data.title;
    movie.wikidata_id = data.external_ids.wikidata_id;
    movie.backdrops = [];
    movie.cast = [];
    movie.director = [];
    movie.genres = [];
    movie.newTrailerImg = null;
    movie.otherRatings = null;
    movie.overview = '';
    movie.posters = [];
    movie.provider = [];
    movie.providerType = '';
    movie.trailerImg = null;
    movie.trailerLink = null;
    movie.year = '';

    data.genres.forEach((genre) => {
      movie.genres.push(genre.name);
    });
    showConsoleForErrors && console.log('a');

    // ------ translations ------

    const translations = data.translations.translations;
    if (translations.some((item) => item.iso_3166_1 === 'MX')) {
      movie.overview = translations.find((item) => item.iso_3166_1 === 'MX').data.overview;
      movie.spanishTitle = translations.find((item) => item.iso_3166_1 === 'MX').data.title || movie.spanishTitle;
    } else if (translations.some((item) => item.iso_3166_1 === 'ES' && item.iso_639_1 === 'es')) {
      movie.overview = translations.find((item) => item.iso_3166_1 === 'ES' && item.iso_639_1 === 'es').data.overview;
      movie.spanishTitle = translations.find((item) => item.iso_3166_1 === 'ES' && item.iso_639_1 === 'es').data.title || movie.spanishTitle;
    }
    if (!movie.overview) {
      movie.overview = 'No se encontró descripción para esta película';
    }

    showConsoleForErrors && console.log('b');

    // ------ release dates ------

    movie.year = parseInt(movie.release_date.split('-')[2]);
    const current_year = new Date().getFullYear();
    const release_dates = data.release_dates.results;
    if (movie.year >= current_year - 1) {
      if (release_dates.some((item) => item.iso_3166_1 === 'CL')) {
        const clRelease = release_dates.find((item) => item.iso_3166_1 === 'CL');

        for (const r_date of clRelease.release_dates) {
          if ([1, 2, 3].includes(r_date.type)) {
            movie.release_date = formatDate(r_date.release_date);
            break;
          }
        }
      }
    }
    if (release_dates.some((item) => item.iso_3166_1 === 'US')) {
      let findingCertification = '';
      let certifications = release_dates.find((item) => item.iso_3166_1 === 'US').release_dates;
      let iter = 0;
      while (!findingCertification && iter + 1 <= certifications.length) {
        findingCertification = certifications[iter].certification;
        iter += 1;
      }
      movie.certification = findingCertification || '';
    }
    showConsoleForErrors && console.log('c');
    // ------ providers ------

    const provider = data[`watch/providers`].results;

    if ('CL' in provider) {
      if ('flatrate' in provider['CL']) {
        provider['CL']['flatrate'].forEach((item) => {
          if (!constantsAndInfo.notAcceptedProviders.includes(item.provider_name)) {
            movie.provider.push(item.provider_name);
            movie.providerType = 'stream';
          }
        });
      }
      if ('buy' in provider['CL'] && movie.provider.length === 0) {
        provider['CL']['buy'].forEach((item) => {
          // console.log('provider', item);
          if (!constantsAndInfo.notAcceptedProviders.includes(item.provider_name)) {
            if (!movie.provider.includes(item.provider_name)) {
              movie.provider.push(item.provider_name);
              movie.providerType = 'buy';
            }
          }
        });
      }
      if ('rent' in provider['CL'] && movie.provider.length === 0) {
        provider['CL']['rent'].forEach((item) => {
          if (!constantsAndInfo.notAcceptedProviders.includes(item.provider_name)) {
            if (!movie.provider.includes(item.provider_name)) {
              movie.provider.push(item.provider_name);
              movie.providerType = 'buy';
            }
          }
        });
      }
    }

    if (movie.provider.length === 0) {
      if (moreThanAMonth(movie.release_date)) {
        movie.providerType = 'google';
      } else {
        movie.providerType = 'cinemas';
      }
    }
    if (isDateInFuture(movie.release_date)) {
      movie.providerType = 'google';
    }
    showConsoleForErrors && console.log('d');
    // ------ videos ------

    const videos = data.videos.results;
    let trailer = '';
    if (videos.find((item) => item.name === 'Official Trailer')) {
      trailer = videos.find((item) => item.name === 'Official Trailer');
    } else if (videos.some((item) => item.type === 'Trailer')) {
      trailer = videos.find((item) => item.type === 'Trailer');
    }

    if (trailer) {
      movie.trailerLink = `https://www.youtube.com/watch?v=${trailer.key}`;
      movie.trailerImg = `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`;
    }
    showConsoleForErrors && console.log('e');
    // ------ cast ------
    const cast = data.credits.cast;
    const director = data.credits.crew.find((item) => item.job === 'Director') || null;
    const cast_imgSizeCast = 'w300';

    let newDirector = null;
    if (director) {
      newDirector = {
        id: director.id,
        name: director.name,
        img: `${imgBaseURL}${cast_imgSizeCast}${director.profile_path}`,
      };
    }
    movie.director.push(newDirector);

    for (let i = 0; i < cast.length && i < 11; i++) {
      let newCast = {
        id: cast[i].id,
        name: cast[i].name,
        character: cast[i].character,
        img: `${imgBaseURL}${cast_imgSizeCast}${cast[i].profile_path}`,
      };
      movie.cast.push(newCast);
    }
    showConsoleForErrors && console.log('f');
    // ------ images ------

    // const posters = [...data['images?include_image_language=en'].posters, ...data['images?include_image_language=null'].posters];
    // const backdrops = [...data['images?include_image_language=null'].backdrops];
    const posters = [...data.images.posters, ...data.images.posters];
    const backdrops = [...data.images.backdrops];
    console.log('p', posters);
    for (let i = 0; i < posters.length && movie.posters.length < 20; i++) {
      movie.posters.push(`${imgBaseURL}${imgSize}${posters[i].file_path}`);
    }
    for (let i = 0; i < backdrops.length; i++) {
      movie.backdrops.push(`${imgBaseURL}${imgSize}${backdrops[i].file_path}`);
    }
    movie.newTrailerImg = movie?.backdrops[movie?.backdrops?.length - 1]?.replace('w500', 'w1280');

    showConsoleForErrors && console.log('g');
    return movie;
  } catch (err) {
    console.error('Error al obtener datos de fetchMovieDetail', err);
    throw new Error('error');
  }
};

export const fetchMovieRatings = async ({ movie }) => {
  // console.log('movie', movie.title, movie.id);
  const newMovie = {};
  newMovie.otherRatings = [];
  const year = parseInt(movie.release_date.split('-')[2]);
  const years = [year, year - 1, year + 1];
  // console.log('a');
  try {
    let dataOMDB = null;
    for (let i = 0; i < years.length; i++) {
      const responseOMDB = await fetch(`https://www.omdbapi.com/?t=${movie?.US_title?.toLowerCase().replace(' ', '_').replace(':', '')}&y=${years[i]}&apikey=${apiKeyOMDB}`);
      dataOMDB = await responseOMDB.json();

      if (!dataOMDB.Error) {
        newMovie.otherRatings = dataOMDB.Ratings;
        break;
      }
    }

    if (dataOMDB.Error && movie?.alternative_titles) {
      const new_title = movie?.alternative_titles.find((title) => title.iso_3166_1 === 'US')?.title;
      if (new_title) {
        for (let i = 0; i < years.length; i++) {
          const responseOMDB_2 = await fetch(`https://www.omdbapi.com/?t=${new_title?.toLowerCase().replace(' ', '_').replace(':', '')}&y=${years[i]}&apikey=${apiKeyOMDB}`);
          const dataOMDB_2 = await responseOMDB_2.json();

          if (!dataOMDB_2.Error) {
            newMovie.otherRatings = dataOMDB_2.Ratings;
            break;
          }
        }
      }
    }
    // console.log('b');
    if (newMovie.otherRatings.length === 0) {
      let dataOMDB = null;
      for (let i = 0; i < years.length; i++) {
        const responseOMDB = await fetch(`https://www.omdbapi.com/?t=${movie?.US_title?.toLowerCase().replace(' ', '_').replace(':', '').replace('the movie', '')}&y=${years[i]}&apikey=${apiKeyOMDB}`);
        dataOMDB = await responseOMDB.json();

        if (!dataOMDB.Error) {
          newMovie.otherRatings = dataOMDB.Ratings;
          break;
        }
      }

      if (dataOMDB.Error && movie?.alternative_titles) {
        const new_title = movie?.alternative_titles.find((title) => title.iso_3166_1 === 'US')?.title;

        if (new_title) {
          console.log('new title: sssss ', new_title, year);
          for (let i = 0; i < years.length; i++) {
            const responseOMDB_2 = await fetch(`https://www.omdbapi.com/?t=${new_title?.toLowerCase().replace(' ', '_').replace(':', '').replace('the movie', '')}&y=${years[i]}&apikey=${apiKeyOMDB}`);
            const dataOMDB_2 = await responseOMDB_2.json();

            if (!dataOMDB_2.Error) {
              newMovie.otherRatings = dataOMDB_2.Ratings;
              break;
            }
          }
        }
      }
    }
    // console.log('c');
    if (newMovie.otherRatings.length === 0) {
      const testingRomanTitle = convertRomanInText(movie.US_title);
      // console.log('testingRomanTitle', testingRomanTitle);
      let dataOMDB = null;
      for (let i = 0; i < years.length; i++) {
        const responseOMDB = await fetch(`https://www.omdbapi.com/?t=${testingRomanTitle}&y=${years[i]}&apikey=${apiKeyOMDB}`);
        dataOMDB = await responseOMDB.json();

        if (!dataOMDB.Error) {
          newMovie.otherRatings = dataOMDB.Ratings;
          break;
        }
      }

      if (dataOMDB.Error && movie?.alternative_titles) {
        const new_title = convertRomanInText(movie?.alternative_titles?.find((title) => title.iso_3166_1 === 'US')?.title);

        if (new_title) {
          for (let i = 0; i < years.length; i++) {
            const responseOMDB_2 = await fetch(`https://www.omdbapi.com/?t=${new_title?.toLowerCase().replace(' ', '_').replace(':', '')}&y=${years[i]}&apikey=${apiKeyOMDB}`);
            const dataOMDB_2 = await responseOMDB_2.json();

            if (!dataOMDB_2.Error) {
              newMovie.otherRatings = dataOMDB_2.Ratings;
              break;
            }
          }
        }
      }
    }
    // console.log('d');
    return newMovie;
  } catch (err) {
    console.error('Error al obtener los datos de fetchMovieRatings', err);
    throw new Error('error');
  }
};

export const fetchMovieOscars = async ({ wikidata_MovieId }) => {
  const movie = {};
  movie.awards = [];
  const wikidataQuery = `
SELECT ?type ?awardLabel ?recipientLabel ?genderLabel ?year WHERE {
  {
    ?recipient p:P166 ?awardStatement.
    ?awardStatement ps:P166 ?award.
    ?awardStatement pq:P1686 wd:${wikidata_MovieId}.
    BIND("Won" AS ?type)
  }
  UNION
  {
    ?recipient p:P1411 ?awardStatement.
    ?awardStatement ps:P1411 ?award.
    ?awardStatement pq:P1686 wd:${wikidata_MovieId}.
    BIND("Nominated" AS ?type)
  }
  
  ?award wdt:P31/wdt:P279* wd:Q19020.

  OPTIONAL { ?awardStatement pq:P585 ?year. }
  OPTIONAL { ?recipient wdt:P21 ?gender. } 

  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
}
ORDER BY ?year


    `;

  try {
    const sparqlUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(wikidataQuery)}&format=json`;

    const wikidataRes = await fetch(sparqlUrl, {
      headers: {
        Accept: 'application/sparql-results+json',
      },
    });

    const wikidataJson = await wikidataRes.json();

    const fetchedAwards = wikidataJson.results.bindings.map((item) => ({
      type: item.type?.value,
      award: item.awardLabel?.value.replace('Ó', 'O').replace('Anexo:', ''),
      year: (item.year?.value && formatDate(item.year.value).split('-').pop()) || null,
      recipient: item.recipientLabel?.value || null,
      gender: item.genderLabel?.value || null,
    }));

    const unique_awards = [];

    for (let i = 0; i < fetchedAwards.length; i++) {
      const movie_awards = fetchedAwards[i];
      if (movie_awards.type === 'Won') {
        if (!unique_awards.includes(movie_awards.award)) {
          unique_awards.push(movie_awards.award);
          movie.awards.push(movie_awards);
          if (['actor', 'actriz', 'director'].some((p) => movie_awards.award.includes(p))) {
            movie_awards.showPerson = true;
          }
        }
      }
    }

    for (let i = 0; i < fetchedAwards.length; i++) {
      const movie_awards = fetchedAwards[i];
      if (movie_awards.type != 'Won') {
        if (!unique_awards.includes(movie_awards.award)) {
          unique_awards.push(movie_awards.award);
          movie.awards.push(movie_awards);
          if (['actor', 'actriz', 'director'].some((p) => movie_awards.award.includes(p))) {
            movie_awards.showPerson = true;
          }
        }
      }
    }

    const newOrder = [
      'Oscar a la mejor película',
      'Oscar al mejor director',
      'Oscar al mejor actor',
      'Oscar a la mejor actriz',
      'Oscar al mejor actor de reparto',
      'Oscar a la mejor actriz de reparto',
      'Oscar al mejor guion',
      'Oscar al mejor guion adaptado',
    ];

    movie.awards = movie.awards.sort((a, b) => {
      const aIndex = newOrder.indexOf(a.award);
      const bIndex = newOrder.indexOf(b.award);

      return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
    });

    // console.log('movie', movie);
    return movie;
  } catch (err) {
    console.error('Error al obtener los datos de fetchMovieOscars', err);
    throw new Error('error');
  }
};

export const fetchMovieCollection = async ({ movieId, collectionId }) => {
  const imgBaseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'w342';

  const movie = {};
  movie.collectionMovies = [];

  try {
    if (collectionId) {
      const response2 = await fetch(`https://api.themoviedb.org/3/collection/${collectionId}?language=en-US`, options);
      const data2 = await response2.json();

      movie.collectionName = data2.name.replace(' Collection', '');

      const collectionMovies = data2.parts
        .filter((part) => part.id !== parseInt(movieId) && part.title && part.release_date && part.poster_path)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 10);

      const processedMovies = await Promise.all(
        collectionMovies.map(async (part) => {
          const newMovie = {
            id: part.id.toString(),
            title: part.original_language === 'es' ? part.original_title : part.title,
            release_date: part.release_date,
            poster: `${imgBaseURL}${imgSize}${part.poster_path}`,
            rating: part.vote_average ? parseFloat((part.vote_average / 2).toFixed(1)).toFixed(1) : null,
            spanishTitle: '',
          };

          try {
            const response3 = await fetch(`https://api.themoviedb.org/3/movie/${newMovie.id}?append_to_response=translations%2Cexternal_ids`, options);

            const data3 = await response3.json();

            const translation =
              data3.translations.translations.find((item) => item.iso_3166_1 === 'MX') || data3.translations.translations.find((item) => item.iso_3166_1 === 'ES' && item.iso_639_1 === 'es');

            if (translation) {
              newMovie.spanishTitle = translation.data.title || '';
            }
            newMovie.imdb_id = data3.external_ids.imdb_id || null;
          } catch (translationError) {
            console.warn(`Error obteniendo traducción para película/ imdb_id ${newMovie.id}`, translationError);
          }

          return newMovie;
        }),
      );

      movie.collectionMovies = processedMovies.length > 0 ? processedMovies : null;
    } else {
      movie.collectionMovies = null;
    }

    return movie;
  } catch (err) {
    console.error('Error al obtener los datos de fetchMovieCollection', err);
    throw new Error('error');
  }
};

export const fetchMovieDirectorMovies = async ({ movieId, directorId }) => {
  const imgBaseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'w342';

  const movie = {};
  movie.directorMovies = [];

  try {
    const response3 = await fetch(`https://api.themoviedb.org/3/person/${directorId}/movie_credits?language=en-US`, options);
    const data3 = await response3.json();

    const directorMovies = data3.crew
      .filter((movie) => movie.job === 'Director' && movie.poster_path !== null && movie.release_date !== '' && movie.vote_average !== 0 && movie.id !== parseInt(movieId))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);

    const processedMovies = await Promise.all(
      directorMovies.map(async (movie) => {
        const newMovie = {
          id: movie.id.toString(),
          title: movie.original_language === 'es' ? movie.original_title : movie.title,
          release_date: movie.release_date,
          poster: `${imgBaseURL}${imgSize}${movie.poster_path}`,
          rating: movie.vote_average ? parseFloat((movie.vote_average / 2).toFixed(1)).toFixed(1) : null,
          spanishTitle: '',
        };

        try {
          const response3 = await fetch(`https://api.themoviedb.org/3/movie/${newMovie.id}?append_to_response=translations%2Cexternal_ids`, options);

          const data3 = await response3.json();

          const translation =
            data3.translations.translations.find((item) => item.iso_3166_1 === 'MX') || data3.translations.translations.find((item) => item.iso_3166_1 === 'ES' && item.iso_639_1 === 'es');

          if (translation) {
            newMovie.spanishTitle = translation.data.title || '';
          }
          newMovie.imdb_id = data3.external_ids.imdb_id || null;
        } catch (translationError) {
          console.warn(`Error obteniendo traducción para película ${newMovie.id}`, translationError);
        }

        return newMovie;
      }),
    );

    movie.directorMovies = directorMovies.length > 0 ? processedMovies : null;

    return movie;
  } catch (err) {
    console.error('Error al obtener los datos de fetchMovieDirectorMovies', err);
    throw new Error('Error obteniendo datos del director');
  }
};

export const fetchMovieRelatedMovies = async ({ movieId, collection }) => {
  console.log('ss', movieId);
  const imgBaseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'w342';

  const movie = {};
  movie.relatedMovies = [];

  const collectionIds = collection ? collection.map((item) => item.id) : [];
  try {
    const response5 = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`, options);
    const data5 = await response5.json();
    // const dataSorted = data5.results.sort((a, b) => b.popularity - a.popularity).slice(0, 10);
    // console.log('data', data5);
    const dataSorted = data5.results
      .filter((item) => !collectionIds.includes(item.id))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);

    const processedMovies = await Promise.all(
      dataSorted.map(async (relatedMovie) => {
        const newMovie = {
          id: relatedMovie.id.toString(),
          title: relatedMovie.original_language === 'es' ? relatedMovie.original_title : relatedMovie.title,
          release_date: relatedMovie.release_date,
          poster: `${imgBaseURL}${imgSize}${relatedMovie.poster_path}`,
          rating: relatedMovie.vote_average ? parseFloat((relatedMovie.vote_average / 2).toFixed(1)).toFixed(1) : null,
          spanishTitle: '',
        };

        try {
          const response3 = await fetch(`https://api.themoviedb.org/3/movie/${newMovie.id}?append_to_response=translations%2Cexternal_ids`, options);

          const data3 = await response3.json();

          const translation =
            data3.translations.translations.find((item) => item.iso_3166_1 === 'MX') || data3.translations.translations.find((item) => item.iso_3166_1 === 'ES' && item.iso_639_1 === 'es');

          if (translation) {
            newMovie.spanishTitle = translation.data.title || '';
          }
          newMovie.imdb_id = data3.external_ids.imdb_id || null;
        } catch (translationError) {
          console.warn(`Error obteniendo traducción para película ${newMovie.id}`, translationError);
        }

        return newMovie;
      }),
    );

    movie.relatedMovies = dataSorted.length > 0 ? processedMovies : null;

    return movie;
  } catch (err) {
    console.error('Error al obtener los datos de fetchMovieRelatedMovies', err);
    throw new Error('Error obteniendo datos de películas relacionadas');
  }
};

export const fetchMoreCast = async ({ movieId, startIndex }) => {
  const imgBaseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'w500';
  const limit = 10;
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, options);
    const data = await response.json();

    const cast = data.cast.slice(startIndex, startIndex + limit);
    const hasMore = data.cast.length > startIndex + limit;
    const sendCast = [];
    for (let i = 0; i < cast.length; i++) {
      let newCast = {
        id: cast[i].id,
        name: cast[i].name,
        character: cast[i].character,
        img: `${imgBaseURL}${imgSize}${cast[i].profile_path}`,
      };
      sendCast.push(newCast);
    }
    return { newCast: sendCast, hasMore };
  } catch (err) {
    console.error('Error al obtener datos de fetchMoreCast', err);
    throw new Error('error');
  }
};

// ------------------------------------------------------

export const firebasePLaylistMovies = async ({ item, startIndex = 0, limit = 8 }) => {
  const imgBaseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'w185';
  const backdropSize = 'w780';
  let cant = 0;

  let movie_ids = null;
  try {
    const docRef = doc(db, 'lists', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      movie_ids = docSnap.data();
      cant = movie_ids.tmdb_id.length;
    } else {
      console.log('El documento no existe.', item);
    }
  } catch (error) {
    console.error('Error al obtener el documento:', error);
  }

  if (!movie_ids || !movie_ids.imdbId || !movie_ids.tmdb_id) {
    console.log('No hay IDs de películas para procesar.');
    return [];
  }

  const { imdbId, tmdb_id } = movie_ids;
  if (imdbId.length !== tmdb_id.length) {
    console.error('Los arrays imdbId y tmdb_id no tienen la misma longitud.');
    return [];
  }
  const reversedTmdbIds = [...tmdb_id].reverse(); // Copia e invierte el array

  const paginatedTmdbIds = reversedTmdbIds.slice(startIndex, startIndex + limit);

  try {
    const moviesToReturn = await Promise.all(
      paginatedTmdbIds.map(async (movie_id, index) => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}?append_to_response=credits%2Cexternal_ids%2Cwatch/providers&language=en-US`, options);

          const data = await response.json();
          const provider = data[`watch/providers`].results;

          if (data) {
            const movieDetails = {
              id: data.id,
              imdb_id: data.external_ids.imdb_id,
              title: data.title,
              poster: `${imgBaseURL}${imgSize}${data.poster_path}`,
              backdrop: `${imgBaseURL}${backdropSize}${data.backdrop_path}`,
              lq_backdrop: `${imgBaseURL}${'w92'}${data.backdrop_path}`,
              rating: parseFloat((data.vote_average / 2).toFixed(1)).toFixed(1),
              genres: data.genres.map((genre) => genre.name),
              director: data.credits.crew.find((item) => item.job === 'Director')?.name || 'Desconocido',
              release_year: data.release_date.substring(0, 4),
              providers: [],
            };

            if ('CL' in provider) {
              if ('flatrate' in provider['CL']) {
                provider['CL']['flatrate'].forEach((item) => {
                  if (constantsAndInfo.myProviders.includes(item.provider_name)) {
                    movieDetails.providers.push(item.provider_name);
                  }
                });
              }
            }

            const movieDocRef = doc(db, 'movies', String(movieDetails.imdb_id));
            const movieDocSnap = await getDoc(movieDocRef);

            if (movieDocSnap.exists()) {
              const { fixedBackdrop, backdropXPosition, lastListChangeDate } = movieDocSnap.data();

              const new_fixedBackdrop = fixedBackdrop ? fixedBackdrop.replace('original', backdropSize) : null;
              const lq_fixedBackdrop = fixedBackdrop ? fixedBackdrop.replace('original', 'w92') : null;

              return {
                ...movieDetails,
                fixedBackdrop: new_fixedBackdrop || null,
                lq_fixedBackdrop: lq_fixedBackdrop,
                backdropXPosition: backdropXPosition || null,
                lastListChangeDate: lastListChangeDate || null,
              };
            } else {
              console.log(`No se encontraron datos adicionales en Firebase para la película con ID: ${movie_id}`);
              return movieDetails;
            }
          } else {
            console.warn(`No se encontraron datos para la película con ID: ${movie_id}`);
            return null;
          }
        } catch (error) {
          console.warn(`Error obteniendo detalles de la película con ID: ${movie_id}`, error);
          return null;
        }
      }),
    );

    return { movies: moviesToReturn.filter((movie) => movie !== null), cant };
  } catch (error) {
    console.error('Error procesando las películas:', error);
    return [];
  }
};
// ----------------------------------------------

export const searchMovies = async ({ text }) => {
  const query = text.toLowerCase().replace(' ', '%20');
  const allMovies = [];
  const allSeries = [];
  const allPersons = [];
  let m_currentPage = 1;
  let m_totalPages = 1;
  let s_currentPage = 1;
  let s_totalPages = 1;
  let p_currentPage = 1;
  let p_totalPages = 1;

  let cantOfMovies = 3;
  let cantOfPersons = 5;

  const baseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'w500';
  const imgSizePerson = 'w500';
  let while_1 = true;
  let while_2 = true;
  let while_3 = true;
  try {
    while (m_currentPage <= m_totalPages && while_1) {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=${m_currentPage}`, options);

      const data = await response.json();

      const movies = data.results.sort((a, b) => b.popularity - a.popularity);

      for (let i = 0; i < movies.length; i++) {
        const newMovie = {
          id: movies[i].id,
          title: movies[i].original_language === 'es' ? movies[i].original_title : movies[i].title,
          poster: `${baseURL}${imgSize}${movies[i].poster_path}`,
          rating: parseFloat((movies[i].vote_average / 2).toFixed(1)),
          release_date: formatDate(movies[i].release_date),
          popularity: movies[i].popularity,
          type: 'movie',
        };

        if (!allMovies.some((movie) => movie.id === newMovie.id)) {
          allMovies.push(newMovie);
        }

        if (allMovies.length >= cantOfMovies) {
          while_1 = false;
          break;
        }
      }

      m_totalPages = data.total_pages;
      m_currentPage++;
    }
    while (s_currentPage <= s_totalPages && while_2) {
      const response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=true&language=en-US&page=${s_currentPage}`, options);

      const data = await response.json();

      const movies = data.results.sort((a, b) => b.popularity - a.popularity);

      for (let i = 0; i < movies.length; i++) {
        const newMovie = {
          id: movies[i].id,
          title: movies[i].original_language === 'es' ? movies[i].original_name : movies[i].name,
          poster: `${baseURL}${imgSize}${movies[i].poster_path}`,
          rating: parseFloat((movies[i].vote_average / 2).toFixed(1)),
          release_date: formatDate(movies[i].first_air_date),
          popularity: movies[i].popularity,
          type: 'serie',
        };

        if (!allSeries.some((movie) => movie.id === newMovie.id)) {
          allSeries.push(newMovie);
        }

        if (allSeries.length >= cantOfMovies) {
          while_2 = false;
          break;
        }
      }

      s_totalPages = data.total_pages;
      s_currentPage++;
    }
    while (p_currentPage <= p_totalPages && while_3) {
      const response = await fetch(`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=${p_currentPage}`, options);

      const data = await response.json();

      const persons = data.results.sort((a, b) => b.popularity - a.popularity);

      for (let i = 0; i < persons.length; i++) {
        const newPerson = {
          id: persons[i].id,
          name: persons[i].name,
          image: `${baseURL}${imgSizePerson}${persons[i].profile_path}`,
          type: 'person',
        };

        if (!allPersons.some((person) => person.id === newPerson.id)) {
          allPersons.push(newPerson);
        }

        if (allPersons.length >= cantOfPersons) {
          while_3 = false;
          break;
        }
      }

      p_totalPages = data.total_pages;
      p_currentPage++;
    }
    return { movies: [...allMovies, ...allSeries], persons: allPersons };
  } catch (error) {
    console.error('Error al obtener las películas:', error);
    return [];
  }
};

export const fetchMoreSearch = async ({ searchType, text, startIndex }) => {
  const query = text.toLowerCase().replace(' ', '%20');

  const results = [];
  let currentPage = 1;
  let totalPages = 1;

  let cantOfSearch = 6;

  const baseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'w500';
  let while_ = true;
  try {
    if (searchType === 'movie') {
      while (currentPage <= totalPages && while_) {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=true&language=en-US&page=${currentPage}`, options);

        const data = await response.json();

        const movies = data.results.sort((a, b) => b.popularity - a.popularity).slice(startIndex);

        for (let i = 0; i < movies.length; i++) {
          if (!('release_date' in movies[i]) || !('vote_average' in movies[i]) || !('popularity' in movies[i])) {
            continue;
          }

          const newMovie = {
            id: movies[i].id,
            title: movies[i].original_language === 'es' ? movies[i].original_title : movies[i].title,
            poster: `${baseURL}${imgSize}${movies[i].poster_path}`,
            rating: parseFloat((movies[i].vote_average / 2).toFixed(1)),
            release_date: formatDate(movies[i].release_date),
            popularity: movies[i].popularity,
            type: 'movie',
          };

          if (!results.some((movie) => movie.id === newMovie.id)) {
            results.push(newMovie);
          }

          if (results.length >= cantOfSearch) {
            while_ = false;
            break;
          }
        }

        totalPages = data.total_pages;
        currentPage++;
      }
    } else if (searchType === 'serie') {
      while (currentPage <= totalPages && while_) {
        const response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=true&language=en-US&page=${currentPage}`, options);

        const data = await response.json();

        const movies = data.results.sort((a, b) => b.popularity - a.popularity).slice(startIndex);

        for (let i = 0; i < movies.length; i++) {
          if (!('release_date' in movies[i]) || !('vote_average' in movies[i]) || !('popularity' in movies[i])) {
            continue;
          }
          const newMovie = {
            id: movies[i].id,
            title: movies[i].original_language === 'es' ? movies[i].original_name : movies[i].name,
            poster: `${baseURL}${imgSize}${movies[i].poster_path}`,
            rating: parseFloat((movies[i].vote_average / 2).toFixed(1)),
            release_date: formatDate(movies[i].first_air_date),
            popularity: movies[i].popularity,
            type: 'serie',
          };

          if (!results.some((movie) => movie.id === newMovie.id)) {
            results.push(newMovie);
          }

          if (results.length >= cantOfSearch) {
            while_ = false;
            break;
          }
        }

        totalPages = data.total_pages;
        currentPage++;
      }
    }

    return { searchResults: results.sort((a, b) => b.popularity - a.popularity) };
  } catch (error) {
    console.error('Error al obtener las películas:', error);
    return [];
  }
};
// ----------------------------------------------------------

export const fetchNewSeries = async () => {
  const allMovies = [];
  let currentPage = 1;
  let totalPages = 1;

  let cantOfMovies = 90;

  const baseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'w500';

  try {
    while (currentPage <= totalPages) {
      const response = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=${currentPage}`, options);

      fetch('https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1', options);

      const data = await response.json();

      const moviesWithVotes = data.results.filter((movie) => movie.vote_count > 20);

      for (let i = 0; i < moviesWithVotes.length; i++) {
        const newMovie = {
          id: moviesWithVotes[i].id,
          title: moviesWithVotes[i].original_language === 'es' ? moviesWithVotes[i].original_name : moviesWithVotes[i].name,
          poster: `${baseURL}${imgSize}${moviesWithVotes[i].poster_path}`,
          rating: parseFloat((moviesWithVotes[i].vote_average / 2).toFixed(1)),
          release_date: formatDate(moviesWithVotes[i].first_air_date),
        };

        if (!allMovies.some((movie) => movie.id === newMovie.id)) {
          allMovies.push(newMovie);
        }

        if (allMovies.length >= cantOfMovies) return allMovies;
      }

      totalPages = data.total_pages;
      currentPage++;
    }
    return allMovies;
  } catch (error) {
    console.error('Error al obtener las películas:', error);
    return [];
  }
};
export const fetchSerieDetails = async ({ movieId }) => {
  const movie = {};
  const imgBaseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'original';
  const imgSizePoster = 'w500';
  const imgSizeCast = 'w500';

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${movieId}?append_to_response=external_ids%2Calternative_titles%2Ctranslations%2Crelease_dates%2Cwatch/providers%2Cvideos%2Ccredits%2Caggregate_credits%2Csimilar%2Ccontent_ratings%2Cimages?include_image_language=en%2Cimages?include_image_language=null&language=en-US`,
      options,
    );

    const data = await response.json();
    // console.log('id', movieId);
    // console.log('data1', movieId, Object.keys(data));
    // console.log(data);

    movie.alternative_titles = data.alternative_titles.titles;
    movie.backdrop = `${imgBaseURL}${imgSize}${data.backdrop_path}`;
    movie.country = getFlagEmoji(data.origin_country[0]) || '';
    movie.episodes = data.number_of_episodes;
    movie.id = data.id;
    movie.imdb_id = data.external_ids.imdb_id;
    movie.lastEpisodeNumber = data?.last_episode_to_air?.episode_number;
    movie.nextEpisodeDate = data?.next_episode_to_air?.air_date ? formatDate(data.next_episode_to_air.air_date) : null;
    movie.nextEpisodeNumber = data.next_episode_to_air?.episode_number;
    movie.nextEpisodeSeason = data.next_episode_to_air?.season_number;
    movie.original_language = data.original_language.toUpperCase();
    movie.poster = `${imgBaseURL}${imgSizePoster}${data.poster_path}`;
    movie.rating = parseFloat((data.vote_average / 2).toFixed(1)).toFixed(1);
    movie.release_date = formatDate(data.first_air_date);
    movie.seasons = data.last_episode_to_air.season_number || data.number_of_seasons;
    movie.spanishTitle = data.original_language === 'es' ? data.original_name : data.name;
    movie.status = data.status;
    movie.tagline = data.tagline;
    movie.title = data.original_language === 'es' ? data.original_name : data.name;
    movie.US_title = data.name;
    movie.backdrops = [];
    movie.cast = [];
    movie.director = [];
    movie.episodesForSeasons = [];
    movie.genres = [];
    movie.newTrailerImg = null;
    movie.otherRatings = null;
    movie.overview = '';
    movie.posters = [];
    movie.provider = [];
    movie.providerType = '';
    movie.trailerImg = null;
    movie.trailerLink = null;
    movie.year = '';

    data.genres.forEach((genre) => {
      movie.genres.push(genre.name);
    });

    data.seasons.forEach((season) => {
      if (season.season_number != 0 && season.name != 'Specials') {
        movie.episodesForSeasons.push(season.episode_count);
      }
    });

    // console.log('a');
    // ------ translations ------

    const translations = data.translations.translations;
    if (translations.some((item) => item.iso_3166_1 === 'MX')) {
      movie.overview = translations.find((item) => item.iso_3166_1 === 'MX').data.overview;
      movie.spanishTitle = translations.find((item) => item.iso_3166_1 === 'MX').data.title || movie.spanishTitle;
    } else if (translations.some((item) => item.iso_3166_1 === 'ES' && item.iso_639_1 === 'es')) {
      movie.overview = translations.find((item) => item.iso_3166_1 === 'ES' && item.iso_639_1 === 'es').data.overview;
      movie.spanishTitle = translations.find((item) => item.iso_3166_1 === 'ES' && item.iso_639_1 === 'es').data.title || movie.spanishTitle;
    }
    if (!movie.overview) {
      movie.overview = 'No se encontró descripción para esta película';
    }

    // console.log('b');

    // ------ certifications ------

    let findingCertification = '';
    let certifications = data.content_ratings?.results.filter((item) => item.iso_3166_1 === 'US');
    let iter = 0;

    while (!findingCertification && iter + 1 <= certifications?.length) {
      findingCertification = certifications[iter].rating;
      iter += 1;
    }
    movie.certification = findingCertification || '';

    // console.log('c');
    // ------ providers ------

    const provider = data[`watch/providers`].results;

    if ('CL' in provider) {
      if ('flatrate' in provider['CL']) {
        provider['CL']['flatrate'].forEach((item) => {
          if (!constantsAndInfo.notAcceptedProviders.includes(item.provider_name)) {
            movie.provider.push(item.provider_name);
            movie.providerType = 'stream';
          }
        });
      }
      if ('buy' in provider['CL'] && movie.provider.length === 0) {
        provider['CL']['buy'].forEach((item) => {
          // console.log('provider', item);
          if (!constantsAndInfo.notAcceptedProviders.includes(item.provider_name)) {
            if (!movie.provider.includes(item.provider_name)) {
              movie.provider.push(item.provider_name);
              movie.providerType = 'buy';
            }
          }
        });
      }
      if ('rent' in provider['CL'] && movie.provider.length === 0) {
        provider['CL']['rent'].forEach((item) => {
          if (!constantsAndInfo.notAcceptedProviders.includes(item.provider_name)) {
            if (!movie.provider.includes(item.provider_name)) {
              movie.provider.push(item.provider_name);
              movie.providerType = 'buy';
            }
          }
        });
      }
    }

    if (movie.provider.length === 0) {
      if (moreThanAMonth(movie.release_date)) {
        movie.providerType = 'google';
      } else {
        movie.providerType = 'cinemas';
      }
    }
    if (isDateInFuture(movie.release_date)) {
      movie.providerType = 'google';
    }
    // console.log('d');
    // ------ videos ------

    const videos = data.videos.results;
    let trailer = '';
    if (videos.find((item) => item.name === 'Official Trailer')) {
      trailer = videos.find((item) => item.name === 'Official Trailer');
    } else if (videos.some((item) => item.type === 'Trailer')) {
      trailer = videos.find((item) => item.type === 'Trailer');
    }

    if (trailer) {
      movie.trailerLink = `https://www.youtube.com/watch?v=${trailer.key}`;
      movie.trailerImg = `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`;
    }
    // console.log('e');
    // ------ cast ------
    const cast = data.aggregate_credits.cast.slice(0, 11);
    const director = data.created_by && data.created_by[0];
    const cast_imgSizeCast = 'w300';

    let newDirector = null;
    if (director) {
      newDirector = {
        id: director.id,
        name: director.name,
        img: `${imgBaseURL}${cast_imgSizeCast}${director.profile_path}`,
        job: 'creator',
      };
    } else {
      let escritor = data.credits.crew.find((item) => item.department == 'Writing');
      if (escritor) {
        newDirector = {
          id: escritor.id,
          name: escritor.name,
          img: `${imgBaseURL}${cast_imgSizeCast}${escritor.profile_path}`,
          job: 'writer',
        };
      }
    }
    newDirector && movie.director.push(newDirector);

    for (let i = 0; i < cast.length && i < 12; i++) {
      let newCast = {
        id: cast[i].id,
        name: cast[i].name,
        character: cast[i].roles[0].character,
        img: `${imgBaseURL}${cast_imgSizeCast}${cast[i].profile_path}`,
      };
      movie.cast.push(newCast);
    }
    // console.log('f');
    // ------ images ------

    const posters = [...data['images?include_image_language=en'].posters, ...data['images?include_image_language=null'].posters];
    const backdrops = [...data['images?include_image_language=null'].backdrops];

    for (let i = 0; i < posters.length && movie.posters.length < 20; i++) {
      movie.posters.push(`${imgBaseURL}${imgSize}${posters[i].file_path}`);
    }
    for (let i = 0; i < backdrops.length; i++) {
      movie.backdrops.push(`${imgBaseURL}${imgSize}${backdrops[i].file_path}`);
    }
    movie.newTrailerImg = movie?.backdrops[movie.backdrops.length - 1]?.replace('w500', 'w1280');

    return movie;
  } catch (err) {
    console.error('Error al obtener datos de fetchMovieDetail , serie', err);
    throw new Error('error');
  }
};
export const firebasePLaylistSeries = async ({ item, startIndex = 0, limit = 8 }) => {
  const use_item = item === 'tv_watched_2' ? 'tv_watched' : item;
  const imgBaseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'w185';
  const backdropSize = 'w780';

  let movie_ids = null;
  try {
    const docRef = doc(db, 'lists', use_item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      movie_ids = docSnap.data();
    } else {
      console.log('El documento no existe.', use_item);
    }
  } catch (error) {
    console.error('Error al obtener el documento:', error);
  }

  if (!movie_ids || !movie_ids.imdbId || !movie_ids.tmdb_id) {
    console.log('No hay IDs de películas para procesar.');
    return [];
  }

  const { imdbId, tmdb_id } = movie_ids;
  if (imdbId.length !== tmdb_id.length) {
    console.error('Los arrays imdbId y tmdb_id no tienen la misma longitud.');
    return [];
  }
  const reversedTmdbIds = [...tmdb_id].reverse();

  try {
    const moviesToReturn = await Promise.all(
      reversedTmdbIds.map(async (movie_id, index) => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/tv/${movie_id}?append_to_response=credits%2Cexternal_ids%2Cwatch/providers&language=en-US`, options);

          const data = await response.json();
          const provider = data[`watch/providers`].results;

          if (data) {
            const movieDetails = {
              id: data.id,
              imdb_id: data.external_ids.imdb_id,
              title: data.original_language === 'es' ? data.original_name : data.name,
              poster: `${imgBaseURL}${imgSize}${data.poster_path}`,
              backdrop: `${imgBaseURL}${backdropSize}${data.backdrop_path}`,
              lq_backdrop: `${imgBaseURL}${'w92'}${data.backdrop_path}`,
              rating: parseFloat((data.vote_average / 2).toFixed(1)).toFixed(1),
              genres: data.genres.map((genre) => genre.name),
              director: data.created_by[0] ? data.created_by[0].name : null,
              release_year: data.first_air_date.substring(0, 4),
              providers: [],
              status: data.status,
            };
            const director = data.created_by && data.created_by[0];

            if (!director) {
              movieDetails.director = data.credits.crew.find((item) => item.department == 'Writing')?.name;
            }

            if ('CL' in provider) {
              if ('flatrate' in provider['CL']) {
                provider['CL']['flatrate'].forEach((provider) => {
                  if (constantsAndInfo.myProviders.includes(provider.provider_name)) {
                    movieDetails.providers.push(provider.provider_name);
                  }
                });
              }
            }

            const movieDocRef = doc(db, 'series', String(movieDetails.imdb_id));
            const movieDocSnap = await getDoc(movieDocRef);

            if (movieDocSnap.exists()) {
              const { fixedBackdrop, backdropXPosition, lastListChangeDate, season, episodes, list } = movieDocSnap.data();

              const new_fixedBackdrop = fixedBackdrop ? fixedBackdrop.replace('original', backdropSize) : null;
              const lq_fixedBackdrop = fixedBackdrop ? fixedBackdrop.replace('original', 'w92') : null;

              let episodesForSeasons = [];
              let s_seasons = data.last_episode_to_air.season_number || data.number_of_seasons;
              let s_episodes = null;

              if (use_item === 'tv_watched') {
                data.seasons.forEach((season) => {
                  if (season.season_number != 0 && season.name != 'Specials') {
                    episodesForSeasons.push(season.episode_count);
                  }
                });
                s_episodes = episodesForSeasons[s_seasons - 1];
              }

              if (item === 'tv_watched') {
                if (s_seasons === season && s_episodes === episodes) {
                  return {
                    ...movieDetails,
                    fixedBackdrop: new_fixedBackdrop || null,
                    lq_fixedBackdrop: lq_fixedBackdrop,
                    backdropXPosition: backdropXPosition || null,
                    lastListChangeDate: lastListChangeDate || null,
                  };
                }

                return null;
              } else if (item === 'tv_watched_2') {
                if (!list.includes('playlist_2')) {
                  if (s_seasons != season || s_episodes != episodes) {
                    return {
                      ...movieDetails,
                      fixedBackdrop: new_fixedBackdrop || null,
                      lq_fixedBackdrop: lq_fixedBackdrop,
                      backdropXPosition: backdropXPosition || null,
                      lastListChangeDate: lastListChangeDate || null,
                    };
                  }
                }
                return null;
              } else {
                return {
                  ...movieDetails,
                  fixedBackdrop: new_fixedBackdrop || null,
                  lq_fixedBackdrop: lq_fixedBackdrop,
                  backdropXPosition: backdropXPosition || null,
                  lastListChangeDate: lastListChangeDate || null,
                };
              }
            } else {
              console.log(`No se encontraron datos adicionales en Firebase para la película con ID: ${movie_id}`);
              return movieDetails;
            }
          } else {
            console.warn(`No se encontraron datos para la película con ID: ${movie_id}`);
            return null;
          }
        } catch (error) {
          console.warn(`Error obteniendo detalles de la película con ID: ${movie_id}`, error);
          return null;
        }
      }),
    );
    const removeNullIds = moviesToReturn.filter((movie) => movie !== null);
    const paginatedTmdbIds = removeNullIds.slice(startIndex, startIndex + limit);

    return { movies: paginatedTmdbIds, cant: removeNullIds.length };
  } catch (error) {
    console.error('Error procesando las películas:', error);
    return [];
  }
};
export const fetchMoreCastSerie = async ({ movieId, startIndex }) => {
  const imgBaseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'w500';
  const limit = 10;
  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/aggregate_credits?language=en-US`, options);
    const data = await response.json();

    const cast = data.cast.slice(startIndex, startIndex + limit);
    const hasMore = data.cast.length > startIndex + limit;
    const sendCast = [];
    for (let i = 0; i < cast.length; i++) {
      let newCast = {
        id: cast[i].id,
        name: cast[i].name,
        character: cast[i].roles[0].character,

        img: `${imgBaseURL}${imgSize}${cast[i].profile_path}`,
      };
      sendCast.push(newCast);
    }
    return { newCast: sendCast, hasMore };
  } catch (err) {
    console.error('Error al obtener datos de fetchMoreCast', err);
    throw new Error('error');
  }
};
export const fetchCurrentEpisodeSerie = async ({ season, episode, serieDB }) => {
  const imgBaseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'w780';
  const newMovie = {};
  const currentSeason = season || serieDB.season || 1;
  const currentEpisode = episode || serieDB.episodes || 1;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${serieDB.tmdb_id}/season/${currentSeason}/episode/${currentEpisode}?append_to_response=images&include_image_language=null&language=en-US`,
      options,
    );

    const data = await response.json();

    if (data.success === false) return null;
    newMovie.currentEpisodeInfo = {
      name: data.name,
      season: currentSeason,
      episode: currentEpisode,
      air_date: formatDate(data.air_date),
      overview: data.overview,
      imgs: [],
    };
    data?.images?.stills?.forEach((item) => {
      newMovie.currentEpisodeInfo.imgs.push(`${imgBaseURL}${imgSize}${item.file_path}`);
    });

    return newMovie;
  } catch (err) {
    console.error('Error al obtener datos de fetchCurrentEpisode', err);
    throw new Error('error');
  }
};
// ----------------------------------------------------------
export const fetchCastDetails = async ({ castId }) => {
  const cast = {};
  const imgBaseURL = 'https://image.tmdb.org/t/p/';
  const imgSize = 'w500';

  try {
    const response = await fetch(`https://api.themoviedb.org/3/person/${castId}?append_to_response=external_ids%2Ccombined_credits&language=en-US`, options);

    const data = await response.json();
    // console.log('d', data);
    cast.birthday = data.birthday ? formatDate(data.birthday) : null;
    cast.deathday = data.deathday ? formatDate(data.deathday) : null;
    cast.flag = data.place_of_birth ? getFlagEmoji(countryToCode[data.place_of_birth.split(',').pop().trim()] || '') : null;
    cast.jobs = setJobs({ known_for: data.known_for_department, credits: data.combined_credits, gender: data.gender });
    cast.gender = data.gender;
    cast.imdb_id = data.external_ids.imdb_id;
    cast.place = data?.place_of_birth?.split(',').slice(-2).join(',').trim() || null;
    cast.name = data.name;
    cast.profile_img = `${imgBaseURL}${imgSize}${data.profile_path}`;
    cast.wikidata_id = data.external_ids.wikidata_id;
    cast.credits = data.combined_credits;

    // console.log(cast.credits.crew.filter((item) => item.job === 'Director'));
    return cast;
  } catch (err) {
    console.error('Error al obtener datos de fetchCastDetails', err);
    throw new Error('error');
  }
};
export const fetchCastAwards = async ({ wikidata_CastId }) => {
  const cast = { awards: {} };

  const wikidataQuery = `
SELECT ?type ?awardLabel ?forWork ?forWorkLabel ?forWorkTmdbId ?year WHERE {
  {
    wd:${wikidata_CastId} p:P166 ?awardStatement.
    ?awardStatement ps:P166 ?award.
    BIND("Won" AS ?type)
  }
  UNION
  {
    wd:${wikidata_CastId} p:P1411 ?awardStatement.
    ?awardStatement ps:P1411 ?award.
    BIND("Nominated" AS ?type)
  }
  ?award wdt:P31/wdt:P279* wd:Q19020.  # premios Oscar

  OPTIONAL { ?awardStatement pq:P1686 ?forWork. }

  OPTIONAL { 
    ?forWork wdt:P4947 ?forWorkTmdbId.  # TMDb ID del trabajo
  }

  OPTIONAL { ?awardStatement pq:P585 ?year. }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "es". }
}
ORDER BY ?year


    `;
  try {
    const sparqlUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(wikidataQuery)}&format=json`;

    const wikidataRes = await fetch(sparqlUrl, {
      headers: {
        Accept: 'application/sparql-results+json',
      },
    });

    const wikidataJson = await wikidataRes.json();
    cast.awards = wikidataJson.results.bindings.map((item) => ({
      type: item.type?.value,
      award: item.awardLabel?.value.replace('Ó', 'O').replace('Anexo:', ''),
      movie: item.forWorkLabel?.value || null,
      year: (item.year?.value && formatDate(item.year?.value).split('-').pop()) || null,
      movie_tmdbId: item.forWorkTmdbId?.value || null,
      movie_wikidataId: item.forWork?.value ? item.forWork.value.split('/').pop() : null,
    }));

    const filtered_movieAwards = [];
    const filtered_castAwards = [];
    const wonMoviesCast = new Set();
    const wonMoviesMovies = new Set();

    for (let i = 0; i < cast.awards.length; i++) {
      const cast_awards = cast.awards[i];
      if (cast_awards.award.includes('cortometraje')) continue;
      if (cast_awards.award.includes('película')) {
        filtered_movieAwards.push(cast_awards);
        if (cast_awards.type === 'Won') {
          wonMoviesMovies.add(cast_awards.movie);
        }
      } else {
        filtered_castAwards.push(cast_awards);
        if (cast_awards.type === 'Won') {
          wonMoviesCast.add(cast_awards.movie);
        }
      }
    }
    cast.awards = filtered_castAwards.filter((item) => {
      const exclude = wonMoviesCast.has(item.movie);
      return item.type === 'Won' || !exclude;
    });
    cast.moviesAwards = filtered_movieAwards.filter((item) => {
      const exclude = wonMoviesMovies.has(item.movie);
      return item.type === 'Won' || !exclude;
    });

    // console.log('mpmp', cast);
    return cast;
  } catch (err) {
    console.error('Error al obtener datos de fetchCastDetails', err);
    throw new Error('error');
  }
};
