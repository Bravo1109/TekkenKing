import React, {useState, useEffect, useRef, useCallback} from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground,
  ScrollView, Dimensions, Platform, RefreshControl, FlatList, Modal} from 'react-native'
import { Image } from 'expo-image';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment, { lang } from 'moment';
import * as Font from 'expo-font';
import { useHeaderHeight } from '@react-navigation/elements';
import { BASE_URL } from './config';
import { format } from 'date-fns';
import LottieView from 'lottie-react-native'; 
import ArrowLeft from '../images/turnBack.svg'
import ArrowUpLeft from '../images/arrow_up_left.svg'
import { CommonActions } from '@react-navigation/native';
import { openBrowserAsync } from 'expo-web-browser';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const tekkenBg = require('../images/tekkenTemple.jpeg')


function BattleProcess(props) {
  getTokenData = async () => {
        try {
            tokenData = await AsyncStorage.getItem('token')
            return tokenData
        } catch(e) {
            console.log('error home', e)
        }
    }
//   const {data} = props.route.params
  const timerQueueRef = useRef(null);
  const { widthH, heightH } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight({ widthH, heightH }, Platform.OS, insets.top) - 10
//   const {description} = props.route.params.description
//   const {source} = props.route.params.source
//   const {image} = props.route.params.image
  let customFonts = {
    'RobotoMedium': require('../assets/Roboto-Medium.ttf'),
    'RobotoBold': require('../assets/Roboto-Bold.ttf'),
    'RobotoLight': require('../assets/Roboto-Light.ttf'),
    'RobotoThin': require('../assets/Roboto-Thin.ttf'),
    'RobotoRegular': require('../assets/Roboto-Regular.ttf'),
    'SftBold': require('../assets/SFTSchriftedSans-ExtraBoldComp.ttf'),
    'SftLight': require('../assets/SFTSchriftedSans-ExtraLightComp.ttf'),
    'SftMedium': require('../assets/SFTSchriftedSans-MediumComp.ttf')
  };
  const SCREEN_WIDTH = Dimensions.get('window').width
  const SCREEN_HEIGHT = Dimensions.get('window').height
  const [fontsLoaded, setfFontsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [queue, setQueue] = useState(false)
  const [modalFindMatch, setfModalFindMatch] = useState(false)
  const _loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setfFontsLoaded(true);
  }
  _loadFontsAsync()
  const bluredBg = require('../images/bluredRating.png');
  const nowDate = new Date();
  const [language, setLanguage] = useState('');
  const [loadImage, setLoadImage] = useState(true);
  const [nextPageIsNull, setNextPageIsNull] = useState(false);
  const [name, setName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const isFocused = useIsFocused();
  const token = getTokenData()
  const [usersData, setUsersData] = useState([])
  const [lobbies, setLobbies] = useState(false);
  const [lobbiesLoading, setLobbiesLoading] = useState(false);
  const getLanguageData = async () => {
    try {
        const languageData = await AsyncStorage.getItem('language')
        console.log(languageData)
        languageData != null ? setLanguage(languageData) : setLanguage('Russian')
        return languageData
    } catch(e) {
        setLanguage('Russian')
        console.log('error', e)
    }
  }

  useEffect(() => {
    getLanguageData()
  }, [isFocused])

  
  return (
    <View style = {{flex:1, backgroundColor: '#172136', justifyContent: 'flex-start'}}>
        {loading && <View
            style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center',
                justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.0)' }}
        >
            {/* <ActivityIndicator /> */}
            <LottieView
                source={require('../animation/anim_glasses.json')}
                style={{width: 100, height: 100 }}
                loop={true}
                autoPlay={true}
                // renderMode='SOFTWARE'
                speed={1}
            />
        </View>}


      {/* <View style={{ height: headerHeight, backgroundColor: '#0F1826', 
                     alignItems: 'flex-end', paddingBottom: 10, flexDirection: 'row',
                     width: '100%' }}>
        <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
            onPress={() => {
            props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
            }}
        >
          <ArrowLeft height={20} width={20} />
        </TouchableOpacity>
        <View style={{ width: '60%' }}>
          <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>Tekken</Text>
        </View>
      </View> */}
      <View
        style={{ flexGrow: 1 }}
      >
        <View
            style={{
                height: SCREEN_HEIGHT,
                justifyContent: 'center'
            }}
        >
            <View
                style={{
                    right: 35, position: 'absolute', top: headerHeight, zIndex: 11111,
                }}
            >
                <TouchableOpacity
            onPress={() => {
                props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key})); 
            }}
            style={{ borderRadius: 100, width: 50, height: 50, transform: [{rotateZ: '90deg'}],
                alignItems: 'center', justifyContent: 'center', zIndex: 11111, 
                backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1, elevation: 3 }}
            activeOpacity={1}
        >
            <ArrowUpLeft width={30} height={30} fill={'#2688EB'} />
        </TouchableOpacity>
            </View>
            
        
            <TouchableOpacity
                style={{ position: 'absolute',
                    zIndex: 100,
                    right: 15,
                    width: 90,
                    alignItems: 'center',
                    backgroundColor: 'lightgreen',
                    padding: 10,
                    transform: [{rotateZ: '90deg'}],
                    borderRadius: 10
                }}
                onPress={() => {
                    setPlayer1Score(0)
                    setPlayer2Score(0)
                }}
                activeOpacity={0.9}
            >
                <Text
                    style={{
                        fontSize: 23,
                        fontFamily: 'SftMedium',
                    }}
                >Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    width: SCREEN_WIDTH,
                    height: '50%',
                    backgroundColor: 'tomato',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onPress={() => {
                    setPlayer1Score(player1Score + 1)
                }}
                activeOpacity={0.9}
            >
                <Text
                    style={{
                        fontSize: 100,
                        fontFamily: 'SftBold',
                        transform: [{rotateZ: '90deg'}]
                    }}
                >{player1Score}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    width: SCREEN_WIDTH,
                    height: '50%',
                    backgroundColor: 'skyblue',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onPress={() => {
                    setPlayer2Score(player2Score + 1)
                }}
                activeOpacity={0.9}
            >
                <Text
                    style={{
                        fontSize: 100,
                        fontFamily: 'SftBold',
                        transform: [{rotateZ: '90deg'}]
                    }}
                >{player2Score}</Text>
            </TouchableOpacity>
        </View>
        
      </View>

     </View>
  )
}

const styles = StyleSheet.create({
    cardStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7,
        width: '100%'
    },
    cardPartyStyle: {
      padding: 10,
      paddingVertical: 25,
      backgroundColor: '#172136',
      borderTopColor: 'rgba(62, 69, 85, 0.6)',
      borderRadius: 0
    },
})

export default BattleProcess