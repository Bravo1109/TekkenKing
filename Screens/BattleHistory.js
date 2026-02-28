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
import { CommonActions } from '@react-navigation/native';
import { openBrowserAsync } from 'expo-web-browser';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const tekkenBg = require('../images/tekkenTemple.jpeg')


function BattleHistory(props) {
  getTokenData = async () => {
        try {
            tokenData = await AsyncStorage.getItem('token')
            return tokenData
        } catch(e) {
            console.log('error home', e)
        }
    }
  const {data} = props.route.params
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

  const lobbyAdded = () => {
      console.log('added')
      clearTimeout(timerQueueRef.current)
      fetch(`${BASE_URL}/api/two_lobby/lobby_added/`, {
        method:"GET",
        headers: {
          'Authorization': `${token._j}`
        }
      }).then(resp => resp.json())
      .then(res => {
        if (res.is_exists == 1) {
          setQueue(true)
        } else if (res.is_exists == 0) {
          setQueue(false)
        } else if (res.is_exists == 2){
          setQueue(false)
          clickedItem(res.pk)
        }
        setLoading(false)
        lobbyRefresh()
      })
      .catch(error => {
        console.log("Error load data", error)
      })
    }

    const findMatch = () => {
      setLoading(true)
      setLobbiesLoading(true)
      setUsersData([])
      fetch(`${BASE_URL}/api/two_lobby/`, {
        method:"GET",
        headers: {
          'Authorization': `${token._j}`
        }
      }).then(resp => resp.json())
      .then(res => {
        console.log(res.results)
        setUsersData(res.results)
        setLoading(false)
        setLobbiesLoading(false)
        lobbyRefresh()
      })
      .catch(error => {
        console.log("Error load data", error)
      })
    }

  const createLobby = () => {
      if(!nextPageIsNull || currentPage === 1) {
      setLoading(true)
      fetch(`${BASE_URL}/api/two_lobby/lobby_adding/`, {
        method:"GET",
        headers: {
          'Authorization': `${token._j}`
        }
      }).then(resp => resp.json())
      .then(res => {
        console.log(res)
        if (res.lobby_created == 1) {
            setQueue(true)
        }
        setLoading(false)
        // setLoadingChange(false)
        // setLoadingProfiles(false)
        // console.log(data)
      })
      .catch(error => {
        console.log("Error", error)
      })
    }}

    const createGame = (id) => {
      if(!nextPageIsNull || currentPage === 1) {
      setLoading(true)
      fetch(`${BASE_URL}/api/two_game/create_game/${id}/`, {
        method:"GET",
        headers: {
          'Authorization': `${token._j}`
        }
      }).then(resp => resp.json())
      .then(res => {
        console.log(res)
        if (res.created == 1) {
            clickedItem(res.game_pk)
        }
        setLoading(false)
        // setLoadingChange(false)
        // setLoadingProfiles(false)
        // console.log(data)
      })
      .catch(error => {
        console.log("Error", error)
      })
    }}

    const lobbyRefresh = () => {
    console.log('jabd')
    // if (!dialogFound) {
        timerQueueRef.current = setTimeout(() => {
            lobbyAdded()
        }, 5000)
        if (!props.navigation.isFocused()) {
          clearTimeout(timerQueueRef.current)
        }
    // }
    // else {
    //     clearTimeout(timerQueueRef.current)
    // }
  }

  const finishSearch = () => {
      setLoading(true)
      fetch(`${BASE_URL}/api/two_lobby/lobby_exit/`, {
        method:"GET",
        headers: {
          'Authorization': `${token._j}`
        }
      }).then(resp => resp.json())
      .then(res => {
          lobbyAdded()
      })
      .catch(error => {
        console.log("Error load data", error)
      })
    }

  const clickedItem = (item) => {
    if (item['navigate'] != '') {
        props.navigation.navigate('BattleProcessStack', {pk: item})
    }
  }

  useEffect(() => {
    getLanguageData()
  }, [isFocused])

  useEffect(() => {
      getTokenData()
      .then(() => {
          lobbyAdded()
      })
    }, []);

    const renderUsersData = useCallback(({item, index}) => {
          return(
            <TouchableOpacity 
                style={[styles.cardPartyStyle, {borderTopWidth: 0.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, item.host.is_deleted && {opacity: 0.4}]}
                contentStyle={{ width: '100%' }}
                activeOpacity={0.4}
                onPress = {() => {
                    setfModalFindMatch(false)
                    setLobbies(false)
                    createGame(item.host.id)
                }}
                >
              <View style={{flexDirection:"row", alignItems: 'flex-start', height: 80}}>
                <ImageBackground
                  source={item.host.photos.length == 0 ? item.host.sex == 'male' ? require('../images/male.png') : require('../images/female.png') : {}}
                  resizeMode='contain'
                  style={{width: 80, height: 80, backgroundColor: '#0F1825', borderRadius: 100, overflow: 'hidden'}}
                >
                  {item.host.photos.length > 0  && <ActivityIndicator
                    style={{ position: 'absolute', height: '100%', width: '100%' }}
                  />}
                  {item.host.photos.length > 0 ? <Image
                    style={{width:'100%', height:'100%', borderRadius: 100}}
                    cachePolicy={'disk'}
                    source={{
                      uri: `${BASE_URL}${item.host.photos[0].compressed_image_url}`
                    }}
                        // onLoadEnd={() => setLoadImage(false)}
                  /> : <View></View> }
                </ImageBackground>
                <View style={{marginLeft: 15, height: '100%', justifyContent: 'center'}}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                     numberOfLines={1}
                     style = {{fontSize:27, color: '#fff', fontFamily: 'SftBold'}}>{item.host.name}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
      }, [usersData])
  
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


      <View style={{ height: headerHeight, backgroundColor: '#0F1826', 
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
          <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{data.title}</Text>
        </View>
      </View>
      <View
        style={{ flex: 1 }}
      >
        <View
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - headerHeight, position: 'absolute'  }}
        >
            <View
                style={{ width: "100%", height: '100%', backgroundColor: '#172136',
                     position: 'absolute', zIndex: 10, opacity: 0.5 }}
            />
            <Image
                style={{ width: "100%", height: '100%', }}
                blurRadius={20}
                source={tekkenBg}
            />
        </View>
        
        <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 30 }}
        >
        </ScrollView>
      </View>
      {!queue && <View
        style={{ flexGrow: 1, justifyContent: 'flex-end', paddingBottom: 20, width: '100%', zIndex: 100 }}
      >
        <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 25, margin: 10, marginBottom: 25, marginTop: 0,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
                setfModalFindMatch(true)
            }}
        >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'New match' : 'Новый вызов'}</Text>
        </TouchableOpacity>
      </View>}

      {queue && !loading && <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, zIndex: 100 }}
        >
            <Text
                style={{ textAlign: 'center', color: '#fff', fontSize: 22, fontFamily: 'SftBold' }}
            >{language == 'English' ? "You created the lobby!" :
            'Вы создали лобби!'}</Text>
            <Text
                style={{  textAlign: 'center', color: '#fff', fontSize: 17, marginTop: 10, fontFamily: 'SftMedium' }}
            >{language == 'English' ? "You'll receive a notification when we find another player. In the meantime, feel free to continue using other features of the app." :
            'Когда мы найдем игрока, вы получите уведомление. А пока что можете продолжить использовать другие функции приложения.'}</Text>
            <TouchableOpacity
                style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 25,
                margin: 10, marginVertical: 18, position: 'absolute', bottom: 30,
                shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
                Platform.OS === 'android' && {elevation: 2}]}
                activeOpacity={0.8}
                onPress={() => {
                    finishSearch()
                }}
            >
                <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Stop searching' : 'Остановить поиск'}</Text>
            </TouchableOpacity>
        </View>}
      
      <Modal
        transparent={true}
        animationType='fade'
        visible={modalFindMatch}
        statusBarTranslucent={true}
        >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end'
        }}
        >
        {lobbies && <View
            style={{
                height: SCREEN_HEIGHT / 1.3,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                width: SCREEN_WIDTH,
                backgroundColor: '#172136',
                zIndex: 100,
                position: 'absolute'
            }}
        >
            <FlatList
                data={usersData}
                renderItem = {renderUsersData}
                refreshControl = {
                    <RefreshControl
                        onRefresh = {() => {
                            findMatch()
                        }}
                        refreshing = {lobbiesLoading}
                        tintColor = {'#aaa'}
                    />
                }
                windowSize = {7}
                showsVerticalScrollIndicator={false}
                keyExtractor = {item => item.id}
                style={{backgroundColor:'#172136', flex: 1, borderTopRightRadius: 15,
                borderTopLeftRadius: 15,}}
                contentContainerStyle={[{ top: -1, paddingBottom: 30}]}
                // ListFooterComponent={renderLoader}
                // onEndReached={LoadMoreItem}
                onEndReachedThreshold={0.8}
                removeClippedSubviews={true}
                />
        </View>}
        <TouchableOpacity onPress={() => {
            setfModalFindMatch(false)
            setLobbies(false)
        }}
        style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.7,
            position:'absolute',
            left: 0,
            top: 0,
            zIndex: 0
        }}
        activeOpacity={0.7}
        >
        </TouchableOpacity>
        <View style={{
            backgroundColor: '#172136',
            borderRadius: 15,
            width: '90%',
            height: 120,
            bottom: 70,
            overflow:'hidden'
        }}>
        <TouchableOpacity onPress={() => {
            setfModalFindMatch(false)
            createLobby()
        }}
        style={{
            height: '50%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 0.5,
            borderBottomColor: '#153850'
        }}
        activeOpacity={0.8}
        >
            <Text style={{ fontSize: 20, fontFamily: 'SftMedium', color: '#6083FF' }}>{language == 'English' ? 'Create match' : 'Создать матч'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            // setfModalFindMatch(false)
            findMatch()
            setLobbies(true)
        }}
        style={{
            height: '50%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        }}
        activeOpacity={0.8}
        >
            <Text style={{ fontSize: 20, fontFamily: 'SftMedium', color: '#6083FF' }}>{language == 'English' ? 'Find match' : 'Найти матч'}</Text>
        </TouchableOpacity>
        </View>
        <View
            style={{
                backgroundColor: '#172136',
                borderRadius: 15,
                marginTop: 20,
                marginBottom: 50,
                width: '90%',
                height: 60,
                bottom: 70,
                overflow:'hidden'
            }}
        >
            <TouchableOpacity onPress={() => {
                setfModalFindMatch(false)
            }}
            style={{
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            activeOpacity={0.8}
            >
                <Text style={{ fontSize: 20, fontFamily: 'SftMedium', color: '#FF2525' }}>{language == 'English' ? 'Cancel' : 'Отменить'}</Text>
            </TouchableOpacity>
        </View>
        </View>
      </Modal>

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

export default BattleHistory