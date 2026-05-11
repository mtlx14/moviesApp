import { ActivityIndicator, Pressable, TextInput, View, Dimensions } from 'react-native';
import { MainFrame } from '../components/MainFrame';
import { Image } from 'expo-image';
import { useRef, useState, useEffect } from 'react';
import { TextType1 } from '../components/TextType1';
import { TitleType1 } from '../components/TitleType1';
import { FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { styles } from '../style';
import { RatingStars } from '../components/RatingStars';
import { fetchMoreSearch, searchMovies } from '../tmdb';
import { BlurView } from 'expo-blur';
import { doc, getDoc } from 'firebase/firestore';
import db from '../conection';
import * as Haptics from 'expo-haptics';
import { usePathname } from 'expo-router';
import { BookmarkerFullIcon, CheckIcon } from '../SVGS';

const windowHeight = Dimensions.get('window').height;

export default function SearchHome() {
  const pathname = usePathname();

  const sectionStyle = styles.sectionNew;
  const [movies, setMovies] = useState([]);
  const [persons, setPersons] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [cants, setCants] = useState({ movie: 3, serie: 3 });

  useEffect(() => {
    const getWatchedMovies = async () => {
      try {
        const watchedSnap = await getDoc(doc(db, 'lists', 'watched'));
        const librarySnap = await getDoc(doc(db, 'lists', 'library'));
        const tv_watchedSnap = await getDoc(doc(db, 'lists', 'tv_watched'));
        const tv_librarySnap = await getDoc(doc(db, 'lists', 'tv_library'));

        const watched = watchedSnap.exists() ? watchedSnap.data().tmdb_id : [];
        const library = librarySnap.exists() ? librarySnap.data().tmdb_id : [];
        const tv_watched = tv_watchedSnap.exists() ? tv_watchedSnap.data().tmdb_id : [];
        const tv_library = tv_librarySnap.exists() ? tv_librarySnap.data().tmdb_id : [];

        setWatchedMovies({
          watched,
          library,
          tv_watched,
          tv_library,
        });
      } catch (error) {
        console.error('Error al obtener las listas:', error);
      }
    };
    getWatchedMovies();
  }, []);

  const inputRef = useRef(null);

  let typingTimeout;

  const router = useRouter();

  const getMovies = async ({ text }) => {
    const movieList = await searchMovies({ text });
    setSearchText(text);
    setMovies(movieList.movies);
    setPersons(movieList.persons);
  };

  const handleSearchInput = (newText) => {
    Haptics.selectionAsync();

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      getMovies({ text: newText });
    }, 500);
  };
  const handleOnPressMoreSearch = ({ searchType }) => {
    let startIndex = cants[searchType];

    fetchMoreSearch({ searchType, text: searchText, startIndex }).then(({ searchResults }) => {
      setMovies((prev) => [...prev, ...searchResults]);
      setCants((prev) => ({ ...prev, [searchType]: prev[searchType] + searchResults.length }));
    });
  };

  const openMovie = ({ movie_id, type }) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (type == 'movie') {
      router.push(`${pathname.split('/')[1]}/screenMovieDetails/${movie_id}`);
    } else if (type == 'serie') {
      router.push(`${pathname.split('/')[1]}/screenSerieDetails/${movie_id}`);
    } else if (type == 'person') {
      router.push(`${pathname.split('/')[1]}/screenCastDetails/${movie_id}`);
    }
  };

  return (
    <MainFrame>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        style={{ position: 'absolute', height: windowHeight, width: '100%', paddingTop: windowHeight * 0.15 + 8 }}
        contentContainerStyle={{
          width: '96%',
          alignSelf: 'center',
          paddingBottom: windowHeight * 0.1 + 10,
        }}
        numColumns={3}
        renderItem={({ item }) => (
          <Pressable style={{ width: '30%', margin: `${10 / 6}%` }} onPress={() => openMovie({ movie_id: item.id, type: item.type })} key={`${(item.id, item.type)}`}>
            <Animated.View
              style={{
                backgroundColor: 'rgba(1,1,1,0.2)',
                borderRadius: 6,
                paddingBottom: 2,
                alignItems: 'center',
              }}
              entering={FadeInDown.springify().damping(80).stiffness(150)}
            >
              <Image source={{ uri: `${item.poster}` }} resizeMode="cover" style={sectionStyle.moviePoster}></Image>
              <TextType1 addStyle={sectionStyle.movieTitle} numberOfLines={1}>
                {item.title}
              </TextType1>

              <RatingStars
                addStyleImg={{ width: 10, height: 10 }}
                addStyleContainer={{ height: 20, alignItems: 'center', justifyContent: 'center' }}
                rating={item.rating}
                releaseDate={item.release_date}
              />
            </Animated.View>

            {item.type === 'movie' && watchedMovies.watched.includes(String(item.id)) && (
              <Animated.View
                style={{
                  position: 'absolute',
                  right: '2%',
                  top: '70.5%',
                }}
                entering={FadeInDown.springify().damping(80).stiffness(150)}
              >
                <BlurView
                  intensity={8}
                  style={{
                    backgroundColor: 'rgba(99, 99, 99, 0.5)',

                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <CheckIcon height={10} width={10} fill="#ffffffc5" />
                </BlurView>
              </Animated.View>
            )}
            {item.type === 'movie' && watchedMovies.library.includes(String(item.id)) && !watchedMovies.watched.includes(String(item.id)) && (
              <Animated.View
                style={{
                  position: 'absolute',
                  right: '2%',
                  top: '70.5%',
                }}
                entering={FadeInDown.springify().damping(80).stiffness(150)}
              >
                <BlurView
                  intensity={8}
                  style={{
                    backgroundColor: 'rgba(99, 99, 99, 0.5)',

                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <BookmarkerFullIcon height={10} width={10} fill="#ffffffc5" />
                </BlurView>
              </Animated.View>
            )}
            {item.type === 'serie' && watchedMovies.tv_watched.includes(String(item.id)) && (
              <Animated.View
                style={{
                  position: 'absolute',
                  right: '2%',
                  top: '70.5%',
                }}
                entering={FadeInDown.springify().damping(80).stiffness(150)}
              >
                <BlurView
                  intensity={8}
                  style={{
                    backgroundColor: 'rgba(99, 99, 99, 0.5)',

                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <CheckIcon height={10} width={10} fill="#ffffffc5" />
                </BlurView>
              </Animated.View>
            )}
            {item.type === 'serie' && watchedMovies.tv_library.includes(String(item.id)) && !watchedMovies.tv_watched.includes(String(item.id)) && (
              <Animated.View
                style={{
                  position: 'absolute',
                  right: '2%',
                  top: '70.5%',
                }}
                entering={FadeInDown.springify().damping(80).stiffness(150)}
              >
                <BlurView
                  intensity={8}
                  style={{
                    backgroundColor: 'rgba(99, 99, 99, 0.5)',

                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <BookmarkerFullIcon height={10} width={10} fill="#ffffffc5" />
                </BlurView>
              </Animated.View>
            )}

            <Animated.View
              style={{
                position: 'absolute',
                left: '2%',
                top: '70.5%',
              }}
              entering={FadeInDown.springify().damping(80).stiffness(150)}
            >
              <BlurView
                intensity={8}
                style={{
                  backgroundColor: 'rgba(99, 99, 99, 0.5)',
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  style={{ width: 12, height: 12, opacity: 0.8 }}
                  source={item.type == 'serie' ? require('../../assets/images/icon--tvEmpty.png') : require('../../assets/images/icon--movieEmpty.png')}
                ></Image>
              </BlurView>
            </Animated.View>
          </Pressable>
        )}
        ListHeaderComponent={
          <FlatList
            data={persons}
            keyExtractor={(item) => item.id.toString()}
            numColumns={5}
            style={{ marginHorizontal: `${10 / 6}%` }}
            renderItem={({ item }) => (
              <Pressable
                style={{ width: '19%', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 5, marginTop: 4, marginHorizontal: '.5%' }}
                onPress={() => openMovie({ movie_id: item.id, type: item.type })}
              >
                {item.image.includes('null') ? (
                  <View
                    style={{ width: '90%', aspectRatio: 1, borderRadius: 100, marginBottom: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}
                  >
                    <Image source={require('../../assets/images/icon--userFull.png')} style={{ width: '50%', aspectRatio: 1, opacity: 0.5 }} />
                  </View>
                ) : (
                  <Image source={{ uri: `${item.image}` }} contentFit="cover" style={{ width: '90%', aspectRatio: 1, borderRadius: 100, marginBottom: 2 }}></Image>
                )}
                <TextType1>{item.name}</TextType1>
              </Pressable>
            )}
          />
        }
        ListFooterComponent={
          <>
            {movies.length > 0 && (
              <>
                <Pressable
                  style={{
                    width: `${100 - 10 / 3}%`,
                    height: 30,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    marginTop: `${10 / 6}%`,
                  }}
                  onPress={() => handleOnPressMoreSearch({ searchType: 'movie' })}
                >
                  <TextType1>Cargar más películas</TextType1>
                </Pressable>
                <Pressable
                  style={{
                    width: `${100 - 10 / 3}%`,
                    height: 30,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    marginTop: `${10 / 4}%`,
                  }}
                  onPress={() => handleOnPressMoreSearch({ searchType: 'serie' })}
                >
                  <TextType1>Cargar más series</TextType1>
                </Pressable>
              </>
            )}
          </>
        }
      />
      <BlurView style={{ width: '100%', height: windowHeight * 0.15, paddingBottom: 10, position: 'absolute', justifyContent: 'flex-end' }}>
        <TitleType1 addStyle={{ marginTop: 0, marginLeft: 25 }}>Buscar</TitleType1>
        {/* <View style={{ width: '100%', alignItems: 'flex-end', paddingHorizontal: 20 }}>
        <TextType2 addStyle={{ fontWeight: 500 }}>Filtros</TextType2>
        </View> */}
        <View
          style={{
            backgroundColor: 'rgba(1, 1, 1, .1)',
            marginHorizontal: 20,
            height: 40,
            borderRadius: 20,
            marginTop: 5,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            gap: 10,
          }}
        >
          <Image style={{ width: 25, height: 25, opacity: 0.6 }} source={require('../../assets/images/icon--searchEmpty.png')} />

          <TextInput
            ref={inputRef}
            autoCorrect={false}
            // spellCheck={false}
            placeholder="Buscar por película, actor, director..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={{
              color: 'rgba(255,255,255,.9)',
              fontSize: 15,
              fontWeight: '500',
              marginHorizontal: 0,
              marginTop: 2,
              height: '100%',
              flex: 1,
            }}
            onChangeText={handleSearchInput}
          />
        </View>
      </BlurView>
    </MainFrame>
  );
}
