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
const law1 = require('../images/fighters/law1.jpeg')
const law2 = require('../images/fighters/law2.jpeg')
const law3 = require('../images/fighters/law3.jpeg')
const law4 = require('../images/fighters/law4.jpeg')
const law5 = require('../images/fighters/law5.jpeg')
const sohai1 = require('../images/fighters/sohai1.jpeg')
const sohai2 = require('../images/fighters/sohai2.jpeg')
const sohai3 = require('../images/fighters/sohai3.jpeg')
const sohai4 = require('../images/fighters/sohai4.jpeg')
const sohai5 = require('../images/fighters/sohai5.jpeg')


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
  const {pk} = props.route.params
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
  const [player1, setPlayer1] = useState(0)
  const [player2, setPlayer2] = useState(0)
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

  const currentMatch = () => {
    console.log(pk)
    clearTimeout(timerQueueRef.current)
    fetch(`${BASE_URL}/api/two_game/${pk}/`, {
        method:"GET",
        headers: {
        'Authorization': `${token._j}`
        }
    }).then(resp => resp.json())
    .then(res => {

        if (player1 == 0 || player2 == 0) {
            setPlayer1(res.player_one)
            setPlayer2(res.player_two)
        }
        setPlayer1Score(res.player_one_score)
        setPlayer2Score(res.player_two_score)
        setLoading(false)
        lobbyRefresh()
    })
    .catch(error => {
        console.log("Error load data", error)
    })
  }

  const getPoint = () => {
    clearTimeout(timerQueueRef.current)
    fetch(`${BASE_URL}/api/two_game/${pk}/get_point/`, {
        method:"GET",
        headers: {
        'Authorization': `${token._j}`
        }
    }).then(resp => resp.json())
    .then(res => {
        lobbyRefresh()
    })
    .catch(error => {
        console.log("Error load data", error)
    })
  }

  const clearScore = () => {
    clearTimeout(timerQueueRef.current)
    fetch(`${BASE_URL}/api/two_game/${pk}/clear_score/`, {
        method:"GET",
        headers: {
        'Authorization': `${token._j}`
        }
    }).then(resp => resp.json())
    .then(res => {
        lobbyRefresh()
    })
    .catch(error => {
        console.log("Error load data", error)
    })
  }

  const lobbyRefresh = () => {
    console.log('jabd')
    // if (!dialogFound) {
        timerQueueRef.current = setTimeout(() => {
            currentMatch()
        }, 5000)
        if (!props.navigation.isFocused()) {
          clearTimeout(timerQueueRef.current)
        }
    // }
    // else {
    //     clearTimeout(timerQueueRef.current)
    // }
  }

  useEffect(() => {
    getLanguageData()
  }, [isFocused])

  useEffect(() => {
    getTokenData()
    .then(() => {
        currentMatch()
    })
  }, []);

  
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
            
        <View
            style={{ 
                position: 'absolute',
                zIndex: 100,
                right: -65,
                alignItems: 'center',
                flexDirection: 'row',
                transform: [{rotateZ: '90deg'}],
            }}
        >
            {player1 != 0 && <Image
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 10,
                    marginRight: 0
                }}
                source={{
                    uri: `${BASE_URL}${player1.photos[0].compressed_image_url}`
                }}
            />}
            <TouchableOpacity
                style={{
                    width: 90,
                    alignItems: 'center',
                    backgroundColor: 'tomato',
                    padding: 10,
                    borderRadius: 10,
                    marginHorizontal: 10
                }}
                onPress={() => {
                    setPlayer1Score(0)
                    setPlayer2Score(0)
                    clearScore()
                }}
                activeOpacity={0.9}
            >
                <Text
                    style={{
                        fontSize: 23,
                        fontFamily: 'SftMedium',
                        color: '#fff'
                    }}
                >Clear</Text>
            </TouchableOpacity>
            {player2 != 0 && <Image
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 10,
                    marginRight: 0
                }}
                source={{
                    uri: `${BASE_URL}${player2.photos[0].compressed_image_url}`
                }}
            />}
        </View>
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
                    getPoint()
                }}
                activeOpacity={0.9}
            >
                <Image
                    style={{ 
                        position: 'absolute',
                        zIndex: 0,
                        height: SCREEN_WIDTH,
                        width: SCREEN_HEIGHT / 2,
                        transform: [{rotateZ: '90deg'}],
                    }}
                    source={player2Score < 4 ? law1 : player2Score > 3 && player2Score < 8 ? law2 : player2Score > 7 && player2Score < 12 ? law3 : player2Score > 11 && player2Score < 16 ? law4 : law5}
                />
                <Text
                    style={{
                        position: 'absolute',
                        fontSize: 80,
                        width: SCREEN_HEIGHT / 2,
                        textAlign: 'center',
                        marginLeft: SCREEN_WIDTH / 1.45,
                        fontFamily: 'SftBold',
                        transform: [{rotateZ: '90deg'}],
                        color: '#fff'
                    }}
                >{player1Score}</Text>
                {player1 != 0 && <Text
                    style={{
                        position: 'absolute',
                        fontSize: 30,
                        width: SCREEN_HEIGHT / 2,
                        textAlign: 'center',
                        marginRight: SCREEN_WIDTH / 1.35,
                        fontFamily: 'SftMedium',
                        transform: [{rotateZ: '90deg'}],
                        color: '#fff'
                    }}
                >{player1.name}</Text>}
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
                    getPoint()
                }}
                activeOpacity={0.9}
            >
                <Image
                    style={{ 
                        position: 'absolute',
                        zIndex: 0,
                        height: SCREEN_WIDTH,
                        width: SCREEN_HEIGHT / 2,
                        transform: [{rotateZ: '90deg'}],
                        borderLeftWidth: 1,
                        borderColor: '#fff'
                    }}
                    source={player1Score < 4 ? sohai1 : player1Score > 3 && player1Score < 8 ? sohai2 : player1Score > 7 && player1Score < 12 ? sohai3 : player1Score > 11 && player1Score < 16 ? sohai4 : sohai5}
                />
                <Text
                    style={{
                        position: 'absolute',
                        fontSize: 80,
                        width: SCREEN_HEIGHT / 2,
                        textAlign: 'center',
                        marginLeft: SCREEN_WIDTH / 1.45,
                        fontFamily: 'SftBold',
                        transform: [{rotateZ: '90deg'}],
                        color: '#fff'
                    }}
                >{player2Score}</Text>
                {player2 != 0 && <Text
                    style={{
                        position: 'absolute',
                        fontSize: 30,
                        width: SCREEN_HEIGHT / 2,
                        textAlign: 'center',
                        marginRight: SCREEN_WIDTH / 1.35,
                        fontFamily: 'SftMedium',
                        transform: [{rotateZ: '90deg'}],
                        color: '#fff'
                    }}
                >{player2.name}</Text>}
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