import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const backgroundColor = 'rgb(43, 38, 51)';

const colorBlack01 = 'rgba(1,1,1,0.1)';
const colorBlack02 = 'rgba(1,1,1,0.2)';
const colorBlack03 = 'rgba(1,1,1,0.3)';
const colorBlack05 = 'rgba(1,1,1,0.5)';
const colorBlack06 = 'rgba(1,1,1,0.6)';

const graphite = 'rgba(20,20,20,0.6)';

const colorWhite1 = 'rgba(255, 255, 255, 0.9)';
const colorWhite2 = 'rgba(255, 255, 255, 0.7)';
const colorWhite3 = 'rgba(255, 255, 255, 0.5)';

const transparent005 = 'rgba(255, 255, 255, 0.05)';
const transparent01 = 'rgba(255, 255, 255, 0.1)';
const transparent02 = 'rgba(255, 255, 255, 0.2)';
const transparent03 = 'rgba(255, 255, 255, 0.3)';

export const styles = StyleSheet.create({
  mainFrame: {
    backgroundColor: backgroundColor,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  background: {
    paddingTop: Constants.statusBarHeight,
    width: '100%',
    height: '100%',
  },
  // mainMenu: {
  //   width: '100%',
  //   height: '10%',
  //   position: 'absolute',
  //   top: '90%',
  //   left: 0,
  //   borderRadius: 15,
  //   overflow: 'hidden',
  // },
  // mainMenu_blur: {
  //   position: 'absolute',
  //   backgroundColor: transparent005,
  //   width: '100%',
  //   height: '100%',
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  // },
  // mainMenu__buttonImg: {
  //   width: 35,
  //   height: 35,
  //   marginTop: 12,
  //   opacity: 0.9,
  // },

  titleType1: {
    color: colorWhite1,
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 20,
  },
  subTitleType1: {
    color: colorWhite1,
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',

    // marginLeft: 5,
  },
  textType1: {
    color: colorWhite1,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginHorizontal: 0,
  },
  textType2: {
    color: colorWhite2,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  textType3: {
    color: colorWhite3,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  tagType1: {
    color: colorWhite1,
    paddingVertical: 2,
    paddingLeft: 5,
    paddingRight: 4,
    borderRadius: 4,
    backgroundColor: transparent01,
    height: 18,
  },
  tagType1Text: {
    color: colorWhite1,
  },

  buttonGoBack: {
    width: 35,
    height: 35,
    overflow: 'hidden',
    borderRadius: 10,
    // marginLeft: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGoBack_icon: {
    width: 35,
    height: 35,
    position: 'absolute',
  },

  // ----------------------------------------------------------------
  starContainer: { flexDirection: 'row' },
  starImg: {
    width: 16,
    height: 16,
    marginHorizontal: 1,
  },
  genresContainer: {
    // width: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'red',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '5',
  },

  providerContainer: {
    backgroundColor: transparent01,
    padding: 5,
    paddingTop: 3,
    borderRadius: 10,
  },
  providerBottom: {
    borderTopColor: transparent03,
    borderTopWidth: 1,
    marginTop: 3,
    // paddingTop: 3,
    flexDirection: 'row',
    width: '100%',
  },
  providerItem: {
    alignItems: 'center',
    marginHorizontal: 5,
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  providerItem__logo: {
    width: 40,
    height: 40,
  },

  // ----------------------------------------------------------------
  sectionNew: {
    name: 'sectionNew',
    scrollContainer: {
      width: '100%',
      height: '100%',
      // backgroundColor: '#FFFFFF',
    },
    movieContainer: {
      marginTop: 0,
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      justifyContent: 'flex-start',
      paddingHorizontal: 10,
      paddingBottom: 200,
    },
    movieItem: {
      backgroundColor: colorBlack03,
      borderRadius: 6,
      width: '30%',
      margin: `${10 / 6}%`,
      paddingBottom: 10,
      alignItems: 'center',
    },
    moviePoster: {
      width: '100%',
      aspectRatio: 2 / 3,
      borderRadius: 6,
    },
    movieTitle: {
      paddingHorizontal: 4,
      marginTop: 10,
    },
    starContainer: {
      marginTop: 5,
      marginBottom: 10,
    },
    starImg: {
      width: 10,
      height: 10,
    },
  },

  sectionNewMovieDetails: {
    fondo: {
      width: '100%',
      position: 'absolute',
    },
    fondoBlur: {
      width: '100%',
      position: 'absolute',
      backgroundColor: colorBlack06,
    },
    sliderFrame: {
      position: 'absolute',
      width: '100%',
      overflow: 'hidden',
    },

    gradient: {
      position: 'absolute',
      width: '100%',
      alignItems: 'center',
    },
    blur: {
      width: '100%',
      position: 'absolute',
      borderRadius: 30,
      overflow: 'hidden',
    },
    movieTitle: {
      // marginTop: '24%',
      letterSpacing: 0.2,
    },
    genresContainer: { marginTop: 5 },
    ratingRow: {
      marginTop: 7,
      flexDirection: 'row',
      alignItems: 'flex-start',
      overflow: 'hidden',
      height: 18,
    },
    starContainer: {
      marginTop: 0.5,
    },
    starImg: {
      width: 12,
      height: 12,
    },
    textRating: {
      height: 21,
      marginLeft: 5,
      marginTop: 0.2,
    },
    infoContainerTop: {
      marginTop: '22%',
      width: '100%',
      alignItems: 'center',
    },

    rowDate: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: 20,
      // marginTop: 5,
      gap: 5,
    },

    rowSpanishTitle: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
      paddingHorizontal: 22,
    },
    spanishTitleText: {
      marginLeft: 3,
    },
    rowOverview: {
      width: '100%',
      paddingHorizontal: 22,
      marginTop: 5,
    },
    overviewText: {
      textAlign: 'flex-start',
    },
    row3: {
      width: '100%',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingHorizontal: 20,
      overflow: 'hidden',
      alignItems: 'center',
    },
    providerContainer: {
      height: '100%',
      width: '60%',
    },
    trailerContainer_background: {
      width: '40%',
      height: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    trailerContainer: {
      borderRadius: 10,
      backgroundColor: transparent01,
      marginLeft: 8,
    },
    trailerContainer_text: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    trailerContainer_imgContainer: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      overflow: 'hidden',
    },
    trailerContainer_img: {
      width: '100%',
      aspectRatio: 16 / 6.5,
      // height: '70%',
      borderRadius: 10,
    },
    trailerContainer_imgBlur: {
      position: 'absolute',
      borderRadius: 20,
      overflow: 'hidden',
      width: 30,
      height: 30,
      backgroundColor: transparent005,
    },
    trailerContainer_imgPlay: {
      position: 'absolute',
      width: 15,
      height: 15,
      paddingLeft: 2,
    },
    trailerContainer_buttonContainer: {
      position: 'absolute',
      bottom: 10,
      right: 5,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 5,
    },
    trailerContainer_imgBlur2: {
      position: 'absolute',
      borderRadius: 40,
      overflow: 'hidden',
      width: '100%',
      height: 25,
      backgroundColor: transparent03,
    },
    trailerContainer_imgPlay2: {
      width: 12,
      height: 12,
      paddingLeft: 2,
      marginRight: 8,
    },

    row4: {
      width: '100%',
      justifyContent: 'space-between',
    },
    row5: {
      width: '100%',
      paddingHorizontal: 20,
    },
    row6: {
      marginTop: 8,
      width: '100%',
    },
    row7: {
      marginTop: 16,
      width: '100%',
      height: 190,
    },
    row8: {
      marginTop: 16,
      width: '100%',
      paddingHorizontal: 20,
    },
    row9: {
      marginTop: 16,
      width: '100%',
    },
    buttonsContainer: {
      position: 'absolute',
      right: 10,

      alignItems: 'flex-end',
    },
    buttonMovieAdmin_shadow: {
      shadowColor: 'rgba(1,1,1,0.2)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 10,
      width: '100%',
    },
    buttonMovieAdmin: {
      width: '100%',
      height: 28,
      borderRadius: 14,
      backgroundColor: transparent03,
      alignItems: 'center',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      marginTop: 15,
      flexDirection: 'row',
    },

    buttonAdmin_img: {
      width: 18,
      height: 18,
      paddingTop: 1,
      paddingLeft: 0.5,
      marginRight: 5,
      shadowColor: 'rgba(1,1,1,0.1)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 1,
    },
    bottomPartToScroll: {
      width: '100%',
    },
  },
});
