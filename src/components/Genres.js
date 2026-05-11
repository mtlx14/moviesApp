import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { styles } from '../style';
import { constantsAndInfo } from '../constantsAndInfo';
import { TagType1 } from './TagType1';
import { memo } from 'react';
import { ProviderTag } from './ProviderTag';
const windowWidth = Dimensions.get('window').width;

const twoGenres = {
  'sci-fi_&_fantasy': ['Ciencia Ficción', 'Fantasia'],
  'action_&_adventure': ['Acción', 'Aventura'],
  'war_&_politics': ['Guerra', 'Política'],
};
const genreTranslate = {
  action: 'Acción',
  adventure: 'Aventura',
  animation: 'Animación',
  comedy: 'Comedia',
  crime: 'Crimen',
  documentary: 'Documental',
  drama: 'Drama',
  family: 'Familia',
  fantasy: 'Fantasia',
  history: 'Historia',
  horror: 'Terror',
  kids: 'Infantil',
  music: 'Música',
  mystery: 'Misterio',
  news: 'Noticias',
  reality: 'Reality',
  romance: 'Romance',
  science_fiction: 'Ciencia Ficción',
  soap: 'Telenovela',
  talk: 'Conversación',
  tv_movie: 'Película de TV',
  thriller: 'Suspenso',
  war: 'Guerra',
  western: 'Western',
};
function Genre({ genre }) {
  return <TagType1>{genre}</TagType1>;
}

const Genres = memo(({ addStyleImg, addStyleContainer, genresData, addProvider }) => {
  const genresToPrint = [];
  const genres = [];

  if (genresData) {
    genresData = genresData.sort();

    for (let i = 0; i < genresData.length; i++) {
      const genre = genresData[i].toLowerCase().replaceAll(' ', '_');
      if (genre in twoGenres) {
        for (let j = 0; j < twoGenres[genre].length; j++) {
          genresToPrint.push(twoGenres[genre][j]);
        }
      } else {
        genresToPrint.push(genreTranslate[genresData[i].toLowerCase().replace(' ', '_')]);
      }
    }

    for (let i = 0; i < genresToPrint.length; i++) {
      genres.push(<TagType1 key={i}>{genresToPrint[i]}</TagType1>);
    }
  }
  if (addProvider) {
    for (let i = 0; i < addProvider.length; i++) {
      genres.push(<ProviderTag key={'a' + i}>{addProvider[i]}</ProviderTag>);
    }
  }
  return <View style={[localStyles.container, addStyleContainer]}>{genres}</View>;
});

Genres.displayName = 'Genres';
export { Genres };

const localStyles = StyleSheet.create({
  container: {
    // width: '100%',
    marginTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '5',
  },
});
