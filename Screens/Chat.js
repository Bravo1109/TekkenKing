import React, {useState, useEffect, useRef, useCallback} from 'react'
import { StyleSheet, Text, View, ImageBackground,
     KeyboardAvoidingView, FlatList, Platform,
      ActivityIndicator, TouchableOpacity, Modal, Dimensions,
      NativeModules, TextInput, Keyboard, Animated, InteractionManager} from 'react-native';
import { Image } from 'expo-image';
import {IconButton, Button} from 'react-native-paper';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { format } from 'date-fns';
import { useIsFocused } from "@react-navigation/native";
import moment, { lang } from 'moment';
import * as Haptics from 'expo-haptics';
import { BASE_URL } from './config';
import * as Font from 'expo-font';
import StickerPack from '../images/stickerChoose.svg'
import GamesIcon from '../images/gamesIcon.svg'
import SendIcon from '../images/sendIcon.svg'
import QuestionIcon from '../images/question.svg'
import GameIcon from '../images/gameIcon.svg'
import GameStarted from '../images/gameStarted.svg'
import GameFinished from '../images/gameFinished.svg'
import ExitIcon from '../images/alfred/exitGame.svg'
import ArrowBack from '../images/turnBack.svg';
import Drinks from '../images/drinks.svg'
import { useHeaderHeight } from '@react-navigation/elements';
import { FlashList } from '@shopify/flash-list';

const punchSticker = require('../images/emoji/faceCrush.png')
const punchWSticker = require('../images/emoji/punchW.png')
const hugsSticker = require('../images/emoji/hugsmm.png')
const hugsmwSticker = require('../images/emoji/hugsmw.png')
const hugswwSticker = require('../images/emoji/hugsww.png')
const manWink = require('../images/emoji/manWink.png')
const womanWink = require('../images/emoji/womanWink.png')
const respectSticker = require('../images/emoji/respect.png')
const respectwSticker = require('../images/emoji/respectw.png')
const handShakeSticker = require('../images/emoji/handshake.png')
const slapSticker = require('../images/emoji/slap.png')
const slapWomanSticker = require('../images/emoji/slapWoman.png')

const alfredStraight = require('../images/alfred/alfred.png')
const alfredSlap = require('../images/alfred/alfredSlap.png')
const slapHand = require('../images/alfred/slapHand.png')
const alfredSlipping = require('../images/alfred/alfredSlipping.png')
const bgAlfred = require('../images/alfred/bgAlfred.jpg')

const laughingPeople = require('../images/lobby/laughingPeople.jpg')
const nightStreet = require('../images/lobby/nightStreet.jpg')
const rainWalking = require('../images/lobby/rainWalking.jpg')
const partyImage = require('../images/lobby/party.jpg')

const images = [
  {'id': 0, 'url': nightStreet, 'theme': 'friends walking', 'quest': 'Friends'},
  {'id': 1, 'url': laughingPeople, 'theme': 'cringe converse','quest': 'Cringe'},
  {'id': 2, 'url': rainWalking, 'theme': 'night dating', 'quest': 'Dating'},
  {'id': 3, 'url': partyImage, 'theme': 'meeting at a party', 'quest': 'Party'}
]

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

function Chat(props) {
  const headerHeight = useHeaderHeight();
  const [quizChoosen, setQuizChoosen] = useState(false)
  const scrollX = useRef(new Animated.Value(0)).current;
  const [messageId, setMessageId] = useState(0)
  const [localId, setLocalId] = useState(0)
  const [sentMes, setSentMes] = useState(0)
  const [localMesWritten, setLocalMesWritten] = useState(0)
  const [gameAnimation, setGameAnimation] = useState(true)
  const [animAlfredOn, setAnimAlfredOn] = useState(false)
  const translateAlfred = useRef(new Animated.Value(-50)).current;
  const translateAlfredHand = useRef(new Animated.Value(-50)).current;
  const rotateHand = useRef(new Animated.Value(0)).current;
  const translateAlfredSlap = useRef(new Animated.Value(50)).current;
  const flatListRef = useRef();
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
  const [language, setLanguage] = useState('')
  const [fontsLoaded, setfFontsLoaded] = useState(false)
  const _loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setfFontsLoaded(true);
  }
  useEffect(() => {
  _loadFontsAsync()
  }, [])
  const isFocused = useIsFocused();
  const nowDate = new Date()
  const timerRef = useRef(null);
  const [nextPageIsNull, setNextPageIsNull] = useState(false)
  const [opacityAlfredBg, setOpacityAlfredBg] = useState(0)
  const [myId, setMyId] = useState(0)
  const [opacityAlfredSlap, setOpacityAlfredSlap] = useState(0)
  const [opacityAlfredDefence, setOpacityAlfredDefence] = useState(0)
  const [opacityAlfredHand, setOpacityAlfredHand] = useState(0)
  const { PlatformConstants, AndroidSettings } = NativeModules;
  const [itemId, setItemId] = useState(0)
  const [itemText, setItemText] = useState('')
  const SCREEN_WIDTH = Dimensions.get('window').width
  const SCREEN_HEIGHT = Dimensions.get('window').height
  const ITEM_WIDTH = SCREEN_WIDTH * 0.9 * 0.35; // ширина центрального слайда
  const SPACER_ITEM_SIZE = (SCREEN_WIDTH * 0.9 - ITEM_WIDTH) / 2; // ширина пространства по бокам
  const [activeTheme, setActiveTheme] = useState(0)
  const [modal, setModal] = useState(false)
  const [modalGames, setModalGames] = useState(false)
  const [gameAlfred, setGameAlfred] = useState(false)
  const [checkMes, setCheckMes] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState(0)
  const [lastMesDate, setLastMesDate] = useState()
  const [text, setText] = useState("")
  const [data, setData] = useState([])
  const [localData, setLocalData] = useState([])
  const [combinedData, setCombinedData] = useState([])
  const [gameData, setGameData] = useState(undefined)
  const [deleted, setDeleted] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [selectedMsgId, setSelectedMsgId] = useState(0)
  const textInput = useRef()
  const [socket, setSocket] = useState(null);
  const [modalEmoji, setModalEmoji] = useState(false);
  const {id, users, chat_image, chat_title} = props.route.params.data
  const {chat_data} = props.route.params
  const [heightTextInput, setHeightTextInput] = useState(50);
  var ws = useRef(null)
  let pubId = 0
  const url = `${BASE_URL}/api/chats/${id}/?page=${currentPage}&limit=30`
  const [loading, setLoading] = useState(true)
  const [loadingReaction, setLoadingReaction] = useState(false)
  const [stickerLoading, setStickerLoading] = useState(false)

  const rotateHandInterpolated = rotateHand.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-5deg', '0deg', '5deg']
  });

  const loadData = () => {
    clearTimeout(timerRef.current)
    console.log('loadDataFull')
    props.navigation.setOptions({
      title: users.length > 1 ? <Text
      style={{ color: '#fff', fontSize: 19, fontWeight: '600', padding: 0, margin: 0, fontFamily: 'SftBold' }}
      >{chat_title}</Text>
       : users.length == 1 ? <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}><Text
      style={{ color: '#fff', fontSize: 17, fontWeight: '600', padding: 0, margin: 0, fontFamily: 'SftMedium' }}
      >{users[0].name}</Text>
      {((nowDate - new Date(users[0].last_seen)) / 60 / 1000) > 15 ? <Text
      style={{ color: '#8E8E93', fontFamily: 'SftMedium' }}
      >{language == 'English' ? 'Last seen: recently' : 'был(а): недавно'}</Text> : <Text
      style={{ color: '#6083FF', fontFamily: 'SftMedium' }}
      >Online</Text>}
      </View> : 'DELETED',
      headerRight: () => (
      <View
      style={{ height: '100%', marginRight: 10, zIndex: 0 }}>
        {users.length == 1 ? (!users[0].deleted && !users[0].blocked) ? <Image 
        style={{height:'93%', aspectRatio: 1/1, borderRadius:100, alignSelf: 'flex-end'}}
        cachePolicy={'disk'}
        source={users[0].photos.length != 0 && {
        uri: `${BASE_URL}${users[0].photos[0].compressed_image_url}`
      }}/> :
      <Image 
        style={{height:'90%', aspectRatio: 1/1, alignSelf: 'flex-end'}}
        source={require('../images/deletedUser.png')}
        /> :
        <Image 
        style={{height:'93%', aspectRatio: 1/1, borderRadius:100, alignSelf: 'flex-end'}}
        cachePolicy={'disk'}
        source={chat_image != null && {
        uri: `${chat_image}`
      }}/>
      }
      {users.length == 1 && <TouchableOpacity style={{ width: 0.8 * SCREEN_WIDTH, height: '100%', position:'absolute', right: 0 }}
      onPress={() => {
        props.navigation.navigate("Profile", {id:users[0]})
      }}></TouchableOpacity>}
      </View>
      )
    });
    fetch(url, {
      method:"GET",
      headers: {
        'Authorization': `${token}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (res.next == null) {
        setNextPageIsNull(true)
      }
      if (myId == 0) {
        setMyId(res.my_id)
      }
      const uniqueData = [...data, ...res.results].filter((item, index, array) => {
        return array.findIndex(t => t.id === item.id) === index;
      });
      setData(uniqueData)
      if(res.results[0].id > localId) {
        setLocalId(res.results[0].id + 1)
      }
      // setCombinedData(uniqueData)
      if (!lastMesDate) {
        setLastMesDate(res.results[0].pub_date)
      }
      if (res.game_selected == 2) {
        setGameData(res.game_data)
        if (!gameAlfred) {
          if (res.game_data.defender == users[0].id && !res.game_data.game_ended_enemy || res.game_data.enemy == users[0].id && !res.game_data.game_ended_defender) {
            setGameAlfred(true)
            Keyboard.dismiss()
          }
        }
      }
      setLoading(false)
      setStickerLoading(false)
      reload()
      console.log('chat_data: ', chat_data)
    })
    .catch(error => {
      console.log("Error", error)
      setLoading(false)
      setStickerLoading(false)
    })
  }

  const clickedItem = (data) => {
    props.navigation.navigate("PartyOpenedStack", {data: data, chat: {'chat': true}})
  }

  const checkUpdates = () => {
    clearTimeout(timerRef.current)
    let mes_id = 0
    if (data.length > 0){
      mes_id = data[0].id
    }
    fetch(`${BASE_URL}/api/chats/${id}/unread_messages/${mes_id}/`, {
      method:"GET",
      headers: {
        'Authorization': `${token}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (data.length == 0 || res.results[0].pub_date != lastMesDate && data[0] != undefined) {
        let newData = [...data, ...res.results].filter((item, index, array) => {
          return array.findIndex(t => t.id === item.id) === index;
        });
        newData.unshift(...res.results)
        const uniqueData = [...newData].filter((item, index, array) => {
          return array.findIndex(t => t.id === item.id) === index;
        });
        setLastMesDate(newData[0].pub_date)
        // const uniqueIds = new Set(data.map(item => item.id));
        // console.log(uniqueIds)
        // const filteredData = localData.filter(item => !uniqueIds.has(item.id))
        // setLocalData(filteredData)
        if (res.results[0].id >= localId) {
          setLocalId(res.results[0].id + 1)
        }
        setData(uniqueData);
      }
      console.log('firstttt: ', checkMes)
      if (res.game_selected == 2) {
        setGameData(res.game_data)
        if (!gameAlfred) {
          if (res.game_data.defender == users[0].id && !res.game_data.game_ended_enemy || res.game_data.enemy == users[0].id && !res.game_data.game_ended_defender) {
            setGameAlfred(true)
            Keyboard.dismiss()
          }
        }
      }
      reload()
      setLoading(false)
      setLoadingReaction(false)
      setStickerLoading(false)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const startQuiz = () => {
    let status = 0
    fetch(`${BASE_URL}/api/chats/${id}/${images[activeTheme].quest}/quiz/start_quiz/`, {
      method:"GET",
      headers: {
        'Authorization': `${token}`
      }
    }).then((resp) => {
      checkUpdates()
      setActiveTheme(0)
      scrollX.setValue(0)
      if(resp.status == 201 && text != '') {
        status = 201
        return resp.json()
      }
    })
    .catch(error => {
      setActiveTheme(0)
      scrollX.setValue(0)
      console.log("Error", error)
    })
  }

  const endQuiz = () => {
    let status = 0
    fetch(`${BASE_URL}/api/chats/${id}/${images[activeTheme].quest}/quiz/end_quiz/`, {
      method:"GET",
      headers: {
        'Authorization': `${token}`
      }
    }).then((resp) => {
      checkUpdates()
      if(resp.status == 201 && text != '') {
        status = 201
        return resp.json()
      }
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const finishGame = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/chats/${id}/alfred/finish_game/`, {
      method:"GET",
      headers: {
        'Authorization': `${token}`
      }
    }).then(resp => resp.json())
    .then(res => {
        setAnimAlfredOn(false)
        checkUpdates()
    })
    
    .catch(error => {
      console.log("Error load data", error)
    })
  }

  const gameAlfredStart = () => {
    let status = 0
    fetch(`${BASE_URL}/api/chats/${id}/alfred/start_alfred/`, {
      method:"GET",
      headers: {
        'Authorization': `${token}`
      }
    }).then((resp) => {
      checkUpdates()
      if(resp.status == 201 && text != '') {
        status = 201
        return resp.json()
      }
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const gameAlfredAction = (side) => {
    let status = 0
    fetch(`${BASE_URL}/api/chats/${id}/alfred/face_side/`, {
      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
      body: JSON.stringify({
        side: side
      })
    }).then((resp) => {
      checkUpdates()
      return resp.json()
    }).then((resp) => {
      console.log('alfredo: ', resp)
      // for (let i = 0; i < resp.tokens.length; i++) {
      //   sendPushNotification(resp.tokens[i], users[0].id, 'Alfred Game', `${resp.name} сделал(а) ход!`, `${BASE_URL}${resp.photo}`, 0, 'ChatList')
      // }
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const gameAlfredEndAnimation = () => {
    let status = 0
    fetch(`${BASE_URL}/api/chats/${id}/alfred/end_animation/`, {
      method:"GET",
      headers: {
        'Authorization': `${token}`
      }
    }).then((resp) => {
      checkUpdates()
      if(resp.status == 201 && text != '') {
        status = 201
        return resp.json()
      }
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const sendAction = (action, text) => {
    textInput.current.blur()
    setStickerLoading(true)
    let status = 0
    fetch(`${BASE_URL}/api/reactions/`, {
      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
      body: JSON.stringify({
        recipient: users[0].id,
        action: action
      })
    }).then((resp) => {
      checkUpdates()
      if(resp.status == 201 && text != '') {
        status = 201
        return resp.json()
      }
    }).then((resp) => {
      // if(status == 201 && text != '') {
      //   for (let i = 0; i < resp.tokens.length; i++) {
      //     sendPushNotification(resp.tokens[i], users[0].id, 'New Reaction!', `${resp.author.name}${text}`, `${BASE_URL}${resp.author.photos[0].compressed_image_url}`, 0, 'ChatList')
      //   }
      // }
    })
    .catch(error => {
      setStickerLoading(false)
      console.log("Error", error)
    })
  }

  const sendMessage = (mId, tokend) => {
    let status = 0
    setLocalId(localId + 1000)
    
      let message = {
        "id": mId,
        "text": text.trim(),
        "author": {id: userId},
        "reciever": users[0].id,
        "is_read": false,
        "quest_active": (combinedData.length > 0 && (combinedData[0].quest_active == 2 ? combinedData[0].author.role == 'bot' ? 3 : 0 : combinedData[0].quest_active == 3 ? 0 : combinedData[0].quest_active)),
        "recipient_to_open": 0,
        "author_to_open": 0,
        "is_liked": 0,
        "type": 0,
        "quest_number": 0,
        "local": true,
        "came": false,
        "pub_date": new Date(),
        "refer_message_id": selectedMsgId,
        "refer_message_text": selectedText,
        "refer_message_author_name": ""
      }
      if (combinedData.length == 0 || message.pub_date != lastMesDate && combinedData[0] != undefined) {
        let newData = [...combinedData, ...[message]].filter((item, index, array) => {
          return array.findIndex(t => t.id === item.id) === index;
        });
        newData.unshift(...[message])
        combinedData.unshift(...[message])
        const uniqueData = [...newData].filter((item, index, array) => {
          return array.findIndex(t => t.id === item.id) === index;
        });
        setCombinedData(uniqueData)
        if (localMesWritten == 0) {
          setLocalMesWritten(1)
        }
        setLastMesDate(message.pub_date)
        setLocalId(localId + 1000)
        // setData(uniqueData);
      }
    fetch(`${BASE_URL}/api/chats/${id}/messages/`, {
        method:"POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${tokend}`
        },
        body: JSON.stringify({
          text: text.trim(),
          refer_message_id: selectedMsgId,
          refer_message_text: selectedText,
        })
      }).then((resp) => {
        // checkUpdates()
        if(resp.status == 201 && text != '') {
          status = 201
          return resp.json()
        } else {
          let obj = combinedData.findIndex(o => o.id === mId)
          console.log('objecttt', obj)
          combinedData[obj].came = 2
          console.log('ERRRRRRROORROORRORO')
        }  
      }).then((resp) => {
        if(status == 201 && text != '') {
          // let obj = combinedData.findIndex(o => o.id === mId)
          // combinedData[obj].id = resp.mes_id
          // combinedData[obj].came = true
          // combinedData[obj].local = false
          // combinedData[obj].refer_message_author_name = resp.ref_author
          // setSentMes(sentMes + 1)
          // for (let i = 0; i < resp.tokens.length; i++) {
          // // const element = tokens[i];
          //   sendPushNotification(resp.tokens[i], users[0].id, 'New Message!', text, (BASE_URL + resp.sender_photo), 0, 'ChatList')
          // }
          setTimeout(() => {
            const updatedData = combinedData.map(item =>
            item.id === mId ? { ...item, id: resp.mes_id, came: true, local: false, refer_message_author_name: resp.ref_author } : item
          );
          setCombinedData(updatedData);
          }, 100);
          
        }
      }).catch(error => {
          console.log('errorvzdfvd', error)
          let obj = localData.findIndex(o => o.id === mId)
          console.log('objecttt', obj)
          localData[obj].came = 2
          console.log(localData[obj])
          setLoading(false)
          setStickerLoading(false)
      })
  }

  const likeMessage = (type) => {
    const itemId = data[0].id
    setLoadingReaction(true)
    fetch(`${BASE_URL}/api/like_message/${type}/${itemId}/`, {
        method:"PATCH",
        headers: {
          'Authorization': `${token}`
        }
      }).then((res) => {
        if(res.status == 200) {
          console.log('liked')
          checkUpdates()
        }
      }).catch(error => {
        console.log("Error del", error)
      })
  }

  // const sendPushNotification = async (token, id, title, body, photo, blur, screen) => {
  //   const message = {
  //     to: 'ExponentPushToken[S173PYN94WQXYlY_3w9hYv]',
  //     sound: 'default',
  //     title: 'Original Title',
  //     body: 'And here is the body!',
  //     data: { recipient_id: id, userPhoto: photo, screen: screen },
  //   };
  
  //   await fetch('https://exp.host/--/api/v2/push/send', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Host': 'exp.host',
  //       'Accept-encoding': 'gzip, deflate',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       to: token,
  //       body: body,
  //       title: title,
  //       data: {recipient_id: id, userPhoto: photo, blur: blur, screen: screen}
  //     }),
  //   });
  // }
  const reload = () => {
    console.log('hyhwushiws')
    timerRef.current = setTimeout(() => {
      setCheckMes(checkMes + 1)
    }, 3000)
    if (!props.navigation.isFocused()) {
      clearTimeout(timerRef.current)
    }
  }
  // const deleteMessage = () => {
  //   fetch(`url`, {
  //       method:"DELETE",
  //       headers: {
  //         'Authorization': `${token}`
  //       }
  //     }).then((res) => {
  //       if(res.status == 204) {
  //         const newData = data.filter(item => item.id !== itemId);
  //         setData(newData);
  //         setDeleted(true)
  //       }
  //     }).catch(error => {
  //       console.log("Error del", error)
  //     })
  // }
  const getTokenData = async () => {
    try {
        let tokenData = await AsyncStorage.getItem('token')
        setToken(tokenData)
        return tokenData
    } catch(e) {
        console.log('error', e)
    }
  }
  const getIdData = async () => {
    try {
        tokenData = await AsyncStorage.getItem('user')
        setUserId(tokenData)
        return tokenData
    } catch(e) {
        console.log('error', e)
    }
    
  }

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

  const renderLoader = () => {
    return (
        <View style={loadingCircleStyle()}>
            <ActivityIndicator size='small' color='#aaa' />
        </View>
    )
  }

  const LoadMoreItem = () => {
    if (!nextPageIsNull && !loading) {
      setLoading(true)
      setCurrentPage(currentPage + 1);
    }
  }

  const loadingCircleStyle = () => {
    return {
        opacity: + loading,
        width: '100%',
        height: 30,
        alignItems:'center',
        justifyContent:'center'
    }
  }
  useEffect(() => {
    getIdData()
  }, [currentPage, isFocused])

  useEffect(() => {
    if (localData.length > 0) {
      const uniqueIds = new Set(data.map(item => item.id));
      console.log(uniqueIds)
      const filteredData = localData.filter(item => !uniqueIds.has(item.id))
      setLocalData(filteredData)
    }
  }, [data])

  useEffect(() => {
    console.log('userId: ', userId)
  }, [userId])

  useEffect(() => {
    if (gameData != undefined && gameData.defender != myId && !gameData.animation_ended_enemy) {
      setTimeout(() => {
        gameAlfredEndAnimation()
      }, 3500)
    } else if (gameData != undefined && gameData.defender == myId && !gameData.animation_ended_defender) {
      setTimeout(() => {
        gameAlfredEndAnimation()
      }, 3500)
    }
  }, [gameData])

  useEffect(() => {
    getLanguageData()
    getTokenData()
    .then(() => {
      if (isFocused && token != '') {
        loadData()
      }
    })
  }, [currentPage, isFocused, token])

  // useEffect(() => {
  //   if (isFocused && ws.current == null) {
  //     ws.current = new WebSocket(`wss://bravo511.pythonanywhere.com/ws/chats/${id}/`);
  //     ws.current.onopen = () => {
  //       console.log('connected!')
  //     }
  //     ws.current.onclose = (e) => {
  //       console.log('closed: ', e)
  //     }
  //     ws.current.onmessage = (e) => {
  //       const datas = JSON.parse(e.data)
  //       console.log(datas)
  //       newDataMessage(datas.message)
  //     }
  //     console.log(ws.current)
  //   }
  //   else {
  //     if (ws.current != null) {
  //       ws.current.close()
  //     }
      
  //   }
  // }, [isFocused])

//   useEffect(() => {
//     if (!isFocused) {
//       ws.close()
//     }
      
// }, [isFocused])
  const gameAlfredRoundWinner = {
    1: gameData != undefined && gameData.round_one_w,
    2: gameData != undefined && gameData.round_two_w,
    3: gameData != undefined && gameData.round_three_w
  }

  const sendSocketMessage = () => {
    if (ws) {
      const newMessage = {
        type: "message",
        user: userId,
        message: text
      };
      ws.current.send(JSON.stringify(newMessage));
    }
  };
  const newDataMessage = (message) => {
    setData((prevState) => [message, ...prevState].filter((item, index, array) => {
      return array.findIndex(t => t.id === item.id) === index;
    }));
  };
  useEffect(() => {
    getTokenData()
    .then(() => {
      if (isFocused && checkMes != 0) {
        checkUpdates()
      }
    })
  }, [checkMes])

  useEffect(() => {
    setCombinedData(localData.concat(data))
  }, [data, localData])

  useEffect(() => {
    if (deleted) {
      setDeleted(false)
      getTokenData()
      .then(() => {
        if (isFocused) {
          loadData()
        }
      })
    }
  }, [deleted])

  const rendAnim = useRef(new Animated.Value(10)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const animateRender = () => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
    Animated.timing(rendAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      InteractionManager.runAfterInteractions(() => {
        if (combinedData.length > 0 && combinedData[0].id !== messageId) {
          setMessageId(combinedData[0].id);
        }
      });
    })
  }

  useEffect(() => {
    rendAnim.setValue(10)
    opacityAnim.setValue(0)
    animateRender()
    console.log('animanimanim')
  }, [combinedData])
  
  const gameAlfredActionOpacity = (type) => {
    setAnimAlfredOn(true)
    type == 0 ? setOpacityAlfredSlap(1) : setOpacityAlfredDefence(1)
    setGameAnimation(false)
    setOpacityAlfredHand(1)
    setOpacityAlfredBg(1)
    Animated.timing(translateAlfred, {
      toValue: 0,
      duration: 4000,
      useNativeDriver: true,
    }).start()
    Animated.timing(translateAlfredSlap, {
      toValue: 0,
      duration: 4000,
      useNativeDriver: true,
    }).start()
    Animated.timing(translateAlfredHand, {
      toValue: 100,
      duration: 4000,
      useNativeDriver: true,
    }).start()
    Animated.timing(rotateHand, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true
  }).start()
    setTimeout(() => {
      setOpacityAlfredBg(0)
      setOpacityAlfredSlap(0)
      setOpacityAlfredDefence(0)
      setOpacityAlfredHand(0)
      setAnimAlfredOn(false)
      translateAlfred.setValue(-50)
      translateAlfredSlap.setValue(50)
      translateAlfredHand.setValue(-150)
      rotateHand.setValue(0)
    }, 4000)
  }

  useEffect(() => {
    if (gameData != undefined && gameAnimation) {
      gameData.defender == myId ? gameData.animation_ended_defender == false && (gameAlfredRoundWinner[gameData.round_ended] == myId ? gameAlfredActionOpacity(1) : gameAlfredActionOpacity(0)) : 
      gameData.animation_ended_enemy == false && (gameAlfredRoundWinner[gameData.round_ended] == myId ? gameAlfredActionOpacity(0) : gameAlfredActionOpacity(1))
    }
  }, [gameData])

  useEffect(() => {
    if (gameData != undefined && !gameAnimation) {
      gameData.defender == myId ? gameData.animation_ended_defender == true && setGameAnimation(true) : 
      gameData.animation_ended_enemy == true && setGameAnimation(true)
    }
  }, [gameData])

  const renderData = useCallback(({item, index}) => {
    let fadeAnim = new Animated.Value(1)

    
    
    let a  = 0
    let prevMesDate = new Date(moment(item.pub_date).toISOString())
    if (index < combinedData.length - 1) {
      prevMesDate = new Date(moment(combinedData[index + 1].pub_date).toISOString())
    }
    let mesDate = pubId
    let itemStyle =  StyleSheet.create({
        myCardStyle: {
            fontSize: 17,
            padding: 10,
            textAlign: "left",
            color: "white",
            fontFamily: 'SftMedium'
        },
        userCardStyle: {
            fontSize: 20,
            padding: 15,
            color: "white",
        }
    })
    // const parsedDate = moment(item.pub_date).toISOString()
    // let get_date = new Date(item.pub_date).toISOString()
    // console.log(get_date)
    let message_pubD = new Date(moment(item.pub_date).toISOString())
    let message_date = new Date(mesDate)
    const showDate = (() => {
      const currentDate = format(message_pubD, 'dd MMM yyyy');
      const prevDate = index < combinedData.length - 1
        ? format(new Date(moment(combinedData[index + 1].pub_date).toISOString()), 'dd MMM yyyy')
        : '';
      return currentDate !== prevDate;
    })();
    if (format(message_pubD, 'dd MMM yyy') != format(pubId, 'dd MMM yyy')) {
      pubId = message_pubD
      a = 1
    }
    if (users.length == 0) {
      return(
        <View>
          {(item.id == combinedData[combinedData.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
        <View style={{justifyContent: "flex-end", alignItems:'flex-end', backgroundColor: 'transparent'}}>
        <TouchableOpacity
          style={[(index < data.length - 1) &&
            format(message_pubD, 'dd MM yyyy') == format(prevMesDate, 'dd MM yyyy') &&
            {borderTopRightRadius: 5}, {margin:5, marginVertical: 2, maxWidth:'80%', borderRadius: 25, borderBottomRightRadius: 5, backgroundColor: "#2B4150",
          shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}]}
          onLongPress={() => {
            setModal(true)
            setItemId(item.id)
            setItemText(item.text)
            Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Light
            )
          }}
          delayLongPress={200}
          activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
              <Text style = {itemStyle.myCardStyle}>{item.text}</Text>
              <Text style={{ color: '#81848B', paddingBottom: 5, paddingRight: 5, fontSize: 12, marginLeft: 'auto' }}>{format(message_pubD, 'H:mm')}</Text>
            </View>
            
        </TouchableOpacity>
      </View>
      {showDate && item.id !== combinedData[0].id && (
        <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>
      )}
      </View>
      )
    }
    if (users.length > 0 && item.author.id == myId && item.author.role != 'bot') {
      if (item.type == 0) {
        return(
          <Animated.View
            style={{transform: [{ translateY: ((item.id > messageId && localMesWritten == 0) || (item.local == true && item.id > messageId)) ? rendAnim : 0}], opacity: ((item.id > messageId && localMesWritten == 0) || (item.local ==true && item.id > messageId)) ? opacityAnim : 1}}
          >
            {/* {(item.id == combinedData[combinedData.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>} */}
            {showDate && (
        <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>
      )}
          <View style={{justifyContent: "flex-end", alignItems:'flex-end', backgroundColor: 'transparent'}}>
          <TouchableOpacity
            style={[(index < combinedData.length - 1) &&
              combinedData[index + 1].author.id == item.author.id &&
              format(message_pubD, 'dd MM yyyy') == format(prevMesDate, 'dd MM yyyy') &&
              {borderTopRightRadius: 5}, {margin:5, marginVertical: 2, maxWidth:'80%', borderRadius: 25, borderBottomRightRadius: 5, backgroundColor: "#2B4150",
            shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}, item.local && item.came != true && {opacity: 0.7}]}
            onLongPress={() => {
              setModal(true)
              setItemId(item.id)
              setItemText(item.text)
              Haptics.impactAsync(
                Haptics.ImpactFeedbackStyle.Light
              )
            }}
            delayLongPress={200}
            activeOpacity={0.7}
            >
              {item.refer_message_id != 0 && <View
                style={{ borderLeftWidth: 2, borderLeftColor: '#fff', marginHorizontal: 10,
                   marginTop: 15, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3 }}
              >
                <Text
                  style = {{fontSize: 15,
                    paddingTop: 5,
                    paddingHorizontal: 5,
                    textAlign: "left",
                    color: "white",
                    fontFamily: 'SftMedium'}}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >{item.refer_message_author_name == '' ? 'Ответ': item.refer_message_author_name}</Text>
                <Text
                  style = {{fontSize: 15,
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    textAlign: "left",
                    color: "white",
                    fontFamily: 'SftMedium'}}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >{item.refer_message_text}</Text>
              </View>}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
              <Text style = {itemStyle.myCardStyle}>{item.text}</Text>
              {(!item.local || item.came == true) && <Text style={{ color: '#81848B', paddingBottom: 7, paddingRight: 7, fontSize: 12, marginLeft: 'auto' }}>{format(message_pubD, 'H:mm')}</Text>}
              {item.local && item.came == false && <ActivityIndicator 
                style={{ transform: [{scale: 0.6}], paddingBottom: 0, paddingLeft: 7, fontSize: 12, marginLeft: 'auto' }}
              />}
              {item.local && item.came == 2 && <Text
                style={{  paddingBottom: 5, paddingRight: 5, fontSize: 12, marginLeft: 'auto', color: 'tomato', fontSize: 20, fontFamily: 'SftBold' }}
              >!</Text>}
              </View>
          </TouchableOpacity>
          {item.quest_active == 1 && item.author.id == myId && item.is_liked == 0 && <View
            style={[{ alignSelf: 'center', marginVertical: 20, borderRadius: 100, backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
          >
              <Text
                style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, fontFamily: 'SftMedium' }}
              >{item.reciever == users[0].id ? language == 'English' ? "Companion rates your answer" : 'Ваш ответ оценивают' : language == 'English' ? 'Your turn to answer' : 'Ваша очередь отвечать'}</Text>
          </View>}
      </View>
      {item.quest_active == 2 && item.author_to_open == 1 && item.recipient_to_open == 1 &&<View
              style={{ alignSelf: 'center', marginVertical: 20, borderRadius: 100, backgroundColor: '#6083FF' } }
            > 
              <Text
                style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'You have opened the chat!' : 'Вы открыли чат!'}</Text>
            </View>}
      {item.quest_active == 3 && <View
              style={{ alignSelf: 'center', marginVertical: 20, borderRadius: 100, backgroundColor: '#6083FF' } }
            > 
              <Text
                style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'Quiz over!' : 'Квиз завершен!'}</Text>
            </View>}
      
        {item.is_liked != 0 && <View
          style={[{ marginTop: 20, borderWidth: 1, borderColor: '#5555ff', backgroundColor: '#172136', borderRadius: 100, paddingVertical: 10, paddingHorizontal: 20,
            shadowColor: '#5555ff', shadowOpacity: 1, shadowOffset: {width: 0, height: 0}, shadowRadius: 5, marginHorizontal: 5,
            marginVertical: 5, elevation: 5, alignSelf: 'center'}]}
        >
          <Text
            style={{ color: '#fff', fontSize: 15, fontFamily: 'SftMedium' }}
          >{language == 'English' ? item.is_liked == 1 ? 'Companion is satisfied' : item.is_liked == 2 ? 'Companion is not satisfied' : item.is_liked == 3 ? 'Companion is laughing' : item.is_liked == 4 ? 'Companion liked the answer' : 'Companion vomited' :
            item.is_liked == 1 ? 'Собеседника устроил ваш ответ' : item.is_liked == 2 ? 'Собеседник не доволен ответом' : item.is_liked == 3 ? 'Вы развеселили собеседника' : item.is_liked == 4 ? 'Собеседнику понравился ваш ответ' : 'Собеседника стошнило'}</Text> 
        </View>}
      </Animated.View>
  )} else {
      return(
        <Animated.View
        style={{transform: [{ translateY: item.id > messageId ? rendAnim : 0}], opacity: item.id > messageId ? opacityAnim : 1}}
        >
            {(item.id == data[data.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
          <View style={{justifyContent: "flex-end", alignItems:'center', backgroundColor: 'transparent'}}>
          <Image
              style={{ width: 150, height: 150, marginTop: 40 }}
              source={item.type == 1 ? punchSticker : item.type == 2 ? hugsSticker : item.type == 3 ? respectSticker : item.type == 4 ? handShakeSticker : item.type == 5 ? manWink : item.type == 6 ? slapSticker : item.type == 7 ? punchWSticker : item.type == 8 ? slapWomanSticker : item.type == 9 ? womanWink : item.type == 10 ? hugsmwSticker : item.type == 11 ? respectwSticker : item.type == 12 && hugswwSticker}
            />
          <TouchableOpacity
            style={{margin:5, marginVertical: 10, maxWidth:'90%', borderRadius: 25, backgroundColor: "#1F3646",
            shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}}
            onLongPress={() => {
              setModal(true)
              setItemId(item.id)
              setItemText(item.text)
              Haptics.impactAsync(
                Haptics.ImpactFeedbackStyle.Light
              )
            }}
            delayLongPress={300}
            activeOpacity={0.7}
            >
              {item.refer_message_id != 0 && <View
                style={{ borderLeftWidth: 2, borderLeftColor: '#fff', marginHorizontal: 10,
                   marginTop: 15, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3 }}
              >
                <Text
                  style = {{fontSize: 15,
                    paddingTop: 5,
                    paddingHorizontal: 5,
                    textAlign: "left",
                    color: "white",
                    fontFamily: 'SftMedium'}}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >{item.refer_message_author_name == '' ? 'Ответ': item.refer_message_author_name}</Text>
                <Text
                  style = {{fontSize: 15,
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    textAlign: "left",
                    color: "white",
                    fontFamily: 'SftMedium'}}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >{item.refer_message_text}</Text>
              </View>}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
              <Text style = {itemStyle.myCardStyle}>{language == 'English' ? item.type == 1 || item.type == 7 ? 'Вы набили ебало собеседнику' : item.type == 2 || item.type == 10 || item.type == 12 ? 'You hugged your companion' : item.type == 3 || item.type == 11 ? 'You showed respect' : item.type == 4 ? 'You shook hands with companion' : item.type == 5 || item.type == 9 ? 'You winked at your companion' : (item.type == 6 || item.type == 8) && `${users[0].name} got slapped` :
                item.type == 1 || item.type == 7 ? 'Вы набили ебало собеседнику' : item.type == 2 || item.type == 10 || item.type == 12 ? users.length > 1 ? 'Вы кого-то обняли' : 'Вы обняли собеседника' : item.type == 3 || item.type == 11 ? 'Вы выразили уважение' : item.type == 4 ? users.length > 1 ? 'Вы пожимаете руку' :  'Вы пожали руку собеседнику' : item.type == 5 || item.type == 9 ? users.length > 1 ? 'Вы подмигнули' :  'Вы подмигнули собеседнику' : (item.type == 6 || item.type == 8) && users.length > 1 ? 'Вы пробили пощечину' : `${users[0].name} получил${users[0].sex == 'female' ? 'a' : ''} пощечину`}</Text>
              <Text style={{ color: '#aaa', paddingBottom: 7, paddingRight: 7, fontSize: 12, marginLeft: 'auto' }}>{format(message_pubD, 'H:mm')}</Text>
              </View>
          </TouchableOpacity>
      </View>
      {showDate && item.id !== combinedData[0].id && (
        <Text style={styles.dateStyleMessages}>{format(message_date, 'dd MMM yyyy')}</Text>
      )}
      </Animated.View>
      )
  }
      }
      else if (users.length > 0 && item.author.id != userId && item.author.role != 'bot') {
        if (item.type == 0) {
        return(
          <Animated.View
          style={{transform: [{ translateY: item.id > messageId ? rendAnim : 0}], opacity: item.id > messageId ? opacityAnim : 1}}
          >
            {showDate && (
            <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>
          )}
          <View style={{flexDirection: 'row', justifyContent: "flex-start", alignItems:'flex-end', backgroundColor: 'transparent'}}>
              {item.author && item.author.id != myId && ((users.length > 1 && index >= 0) && (index == 0 || combinedData[index - 1].author.id != item.author.id || (a == 1 && item.id != data[0].id) || combinedData[index - 1].type > 0)) && <TouchableOpacity
                style={{ width: 35, height: 35, marginLeft: 5 }}
                onPress={() => {
                  props.navigation.navigate("Profile", {id: item.author})
                }}
              >
                <ImageBackground
              resizeMode='contain'
              style={{width: '100%', height: '100%', backgroundColor: '#0F1825', borderRadius: 100, overflow: 'hidden'}}
            >
              {item.author.photos.length > 0  && <ActivityIndicator
                style={{ position: 'absolute', height: '100%', width: '100%' }}
              />}
                <Image
                style={{ borderRadius: 100, width: '100%', height: '100%' }}
                cachePolicy={'disk'}
                source={item.author.photos.length > 0 && {
                  uri: `${BASE_URL}${item.author.photos[0].compressed_image_url}`
                }}
              /> 
              </ImageBackground></TouchableOpacity>}
              <TouchableOpacity style={[(index < combinedData.length - 1) &&
              combinedData[index + 1].author.id == item.author.id &&
              format(message_pubD, 'dd MM yyyy') == format(prevMesDate, 'dd MM yyyy') &&
              {borderTopLeftRadius: 5}, {margin:5, marginLeft: 47, marginVertical: 2, maxWidth:'80%', borderRadius: 25, borderBottomLeftRadius: 5, backgroundColor: "#0E0E24",
            shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}, (index >= 0) &&
                (users.length < 2 || index == 0 || combinedData[index - 1].author.id != item.author.id || a == 1 && item.id != data[0].id || combinedData[index - 1].type > 0) && {marginLeft: 7}]}
            onLongPress={() => {
              setModal(true)
              setItemId(item.id)
              setItemText(item.text)
              Haptics.impactAsync(
                Haptics.ImpactFeedbackStyle.Light
              )
            }}
            delayLongPress={200}
            activeOpacity={0.7}
            >
              {(users.length > 1 && index >= 0) &&
              (index == 0 && combinedData.length == 1 || (index == combinedData.length - 1 && combinedData.length > 1 && combinedData[index - 1].author.id != item.author.id) || ((index < combinedData.length - 1) && combinedData[index + 1].type > 0) || ((index < combinedData.length - 1) && combinedData[index + 1].author.id != item.author.id) || format(message_pubD, 'dd MM yyyy') != format(prevMesDate, 'dd MM yyyy')) && <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate("Profile", {id: item.author})
                }}
              ><Text
                    numberOfLines={1}
                    style={{ color: '#90A9FF', marginLeft: 10, paddingTop: 10, fontSize: 13, fontFamily: 'SftMedium' }}
                  >{item.author.name}</Text></TouchableOpacity>}
              {item.refer_message_id != 0 && <View
                style={[{ borderLeftWidth: 2, borderLeftColor: '#fff', marginHorizontal: 10,
                   marginTop: 15, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3 }, (users.length > 1 && index >= 0) &&
                  (index == 0 && combinedData.length == 1 || (index == combinedData.length - 1 && combinedData.length > 1 && combinedData[index - 1].author.id != item.author.id) || ((index < combinedData.length - 1) && combinedData[index + 1].author.id != item.author.id) || ((index < combinedData.length - 1) && combinedData[index + 1].type > 0) || format(message_pubD, 'dd MM yyyy') != format(prevMesDate, 'dd MM yyyy')) &&
                  {marginTop: 2}]}>
                <Text
                  style = {{fontSize: 15,
                    paddingTop: 5,
                    paddingHorizontal: 5,
                    textAlign: "left",
                    color: "white",
                    fontFamily: 'SftMedium'}}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >{item.refer_message_author_name}</Text>
                <Text
                  style = {{fontSize: 15,
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    textAlign: "left",
                    color: "white",
                    fontFamily: 'SftMedium'}}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >{item.refer_message_text}</Text>
              </View>}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                    <Text style = {[itemStyle.myCardStyle, (users.length > 1 && index >= 0) &&
                  (index == 0 && combinedData.length == 1 || (index == combinedData.length - 1 && combinedData.length > 1 && combinedData[index - 1].author.id != item.author.id) || ((index < combinedData.length - 1) && combinedData[index + 1].author.id != item.author.id) || (index>0 && combinedData[index - 1].type > 0) || format(message_pubD, 'dd MM yyyy') != format(prevMesDate, 'dd MM yyyy')) &&
                  {paddingTop: 2}]}>{item.text}</Text>
                    <Text style={{ color: '#81848B', paddingBottom: 7, paddingRight: 7, fontSize: 12, marginLeft: 'auto' }}>{format(message_pubD, 'H:mm')}</Text>
                  </View>
              </TouchableOpacity>
          </View>
          {item.id == data[0].id && item.is_liked == 0 && item.quest_active == 1 && <View
              style={{ alignSelf: 'center', marginTop: '20%', borderRadius: 25, width: '90%',
              backgroundColor: '#1E3559', paddingVertical: 15 }}
            > 
              <Text
                style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15,
                         fontSize: 15, textAlign: 'center', fontFamily: 'SftMedium' }}
              >{language == 'English' ? "Rate your companion's answer." : 'Оцените ответ собеседника'}</Text>
              {!loadingReaction ? <View
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}
              >
                <TouchableOpacity
                  style={{ marginHorizontal: 10 }}
                  activeOpacity={0.8}
                  onPress={() => {
                    likeMessage(1)
                  }}
                >
                  <Text
                    style={{ fontSize: 36 }}
                  >👍</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginHorizontal: 10 }}
                  activeOpacity={0.8}
                  onPress={() => {
                    likeMessage(2)
                  }}
                >
                  <Text
                    style={{ fontSize: 36 }}
                  >👎</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginHorizontal: 10 }}
                  activeOpacity={0.8}
                  onPress={() => {
                    likeMessage(3)
                  }}
                >
                  <Text
                    style={{ fontSize: 36 }}
                  >😆</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginHorizontal: 10 }}
                  activeOpacity={0.8}
                  onPress={() => {
                    likeMessage(4)
                  }}
                >
                  <Text
                    style={{ fontSize: 36 }}
                  >❤</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginHorizontal: 10 }}
                  activeOpacity={0.8}
                  onPress={() => {
                    likeMessage(5)
                  }}
                >
                  <Text
                    style={{ fontSize: 36 }}
                  >🤮</Text>
                </TouchableOpacity>
              </View> : <ActivityIndicator />}
            </View>}
          {item.quest_active == 2 && item.author_to_open == 1 && item.recipient_to_open == 1 &&<View
              style={{ alignSelf: 'center', marginVertical: 20, borderRadius: 100, backgroundColor: '#6083FF' } }
            > 
              <Text
                style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'You have opened the chat!' : 'Вы открыли чат!'}</Text>
            </View>}
          {item.quest_active == 3 && <View
              style={{ alignSelf: 'center', marginVertical: 20, borderRadius: 100, backgroundColor: '#6083FF' } }
            > 
              <Text
                style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'Quiz over!' : 'Квиз завершен!'}</Text>
            </View>}
          
          {item.is_liked != 0 && <View
            style={[{ marginTop: 20, borderWidth: 1, borderColor: '#39ff14', backgroundColor: '#172136', borderRadius: 100, paddingVertical: 10, paddingHorizontal: 20,
              shadowColor: '#39ff14', shadowOpacity: 1, shadowOffset: {width: 0, height: 0}, shadowRadius: 5, marginHorizontal: 5,
              marginVertical: 5, elevation: 5, alignSelf: 'center'}]}
          >
            <Text
              style={{ color: '#fff', fontSize: 15, fontFamily: 'SftMedium' }}
            >{language == 'English' ? item.is_liked == 1 ? 'You’re satisfied' : item.is_liked == 2 ? 'You’re not satisfied' : item.is_liked == 3 ? 'The answer made you laugh' : item.is_liked == 4 ? 'You liked the answer' : 'You felt nauseous' : 
              item.is_liked == 1 ? 'Ответ собеседника вас устроил' : item.is_liked == 2 ? 'Вы не довольны ответом' : item.is_liked == 3 ? 'Ответ вас развеселил' : item.is_liked == 4 ? 'Вам понравился ответ собеседника' : 'Вас стошнило'}</Text> 
        </View>}
          </Animated.View>
      )} else {
        return(
          <Animated.View
          style={{transform: [{ translateY: item.id > messageId ? rendAnim : 0}], opacity: item.id > messageId ? opacityAnim : 1}}
          >
              {(item.id == data[data.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
            
            <View style={{justifyContent: "flex-end", alignItems: 'center', backgroundColor: 'transparent'}}>
            <Image
              style={{ width: 150, height: 150, marginTop: 40 }}
              source={item.type == 1 ? punchSticker : item.type == 2 ? hugsSticker : item.type == 3 ? respectSticker : item.type == 4 ? handShakeSticker : item.type == 5 ? manWink : item.type == 6 ? slapSticker : item.type == 7 ? punchWSticker : item.type == 8 ? slapWomanSticker : item.type == 9 ? womanWink : item.type == 10 ? hugsmwSticker : item.type == 11 ? respectwSticker : item.type == 12 && hugswwSticker}
            />
            <View
              style={{margin:5, marginVertical: 10, maxWidth:'90%', borderRadius: 25, backgroundColor: "#0A0A1E",
              shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}}
              >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                <Text style = {itemStyle.myCardStyle}>{language == 'English' ? (item.type == 1 || item.type == 7) ? `${users[0].name} набил${users[0].sex == 'female' ? 'a' : ''} вам ебало` : item.type == 2 || item.type == 10 || item.type == 12 ? `${users[0].name} hugged you` : item.type == 3 || item.type == 11 ? `${users[0].name} showed you respect` : item.type == 4 ? `${users[0].name} shook your hand` : item.type == 5 || item.type == 9 ? `${users[0].name} winked at you` : (item.type == 6 || item.type == 8) && `${users[0].name} slapped you` :
                  (item.type == 1 || item.type == 7) ? `${users[0].name} набил${users[0].sex == 'female' ? 'a' : ''} вам ебало` : item.type == 2 || item.type == 10 || item.type == 12 ? users.length > 1 ? `${users[0].name} обнимает`: `${users[0].name} вас обнял${users[0].sex == 'female' ? 'a' : ''}` : item.type == 3 || item.type == 11 ? users.length > 1 ? `${users[0].name} выразил респект` : `${users[0].name} выразил${users[0].sex == 'female' ? 'a' : ''} вам респект` : item.type == 4 ? users.length > 1 ? `${users[0].name} жмет руку` :  `${users[0].name} пожал${users[0].sex == 'female' ? 'a' : ''} вам руку` : item.type == 5 || item.type == 9 ? users.length > 1 ? `${users[0].name} подмигивает` :  `${users[0].name} подмигнул${users[0].sex == 'female' ? 'a' : ''} вам` : (item.type == 6 || item.type == 8) && users.length > 1 ? `${users[0].name} пробивает пощечину` :  `${users[0].name} дал${users[0].sex == 'female' ? 'a' : ''} вам пощечину`}</Text>
                <Text style={{ color: '#81848B', paddingBottom: 7, paddingRight: 7, fontSize: 12, marginLeft: 'auto' }}>{format(message_pubD, 'H:mm')}</Text>
                </View>
            </View>
        </View>
        {showDate && item.id !== combinedData[0].id && (
          <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>
        )}
        </Animated.View>
        )
      } 
       }
       else {
        if (item.type == 101) {
          return(
              <Animated.View
              style={{transform: [{ translateY: item.id > messageId ? rendAnim : 0}], opacity: item.id > messageId ? opacityAnim : 1}}
              >
                {(item.id == data[data.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
              <View style={{justifyContent: "center", alignItems:'center', backgroundColor: 'transparent'}}>
                  <View style={{margin:5, marginVertical: 10, paddingHorizontal: 0, justifyContent: 'center', alignItems: 'center', width:'90%', borderRadius: 25, backgroundColor: item.reciever != myId ? "#464E79" : "#0E0E24",
                shadowColor: '#000', shadowOffset: {width: 0, height: 2}, overflow: 'hidden', shadowOpacity: 0.2}}>
                  <View
                    style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                  >
                    
                    <Image
                    source={require('../images/partyImgChats.jpg')}
                    style={{ width: '100%', height: '100%', transform: [{ rotateY: '180deg' }]}}
                    blurRadius={3}
                  />
                    </View>
                  <View
                    style={{ paddingHorizontal: 25, flexDirection: 'row',  alignItems: 'center', marginTop: 30, marginBottom: 20 }}
                  >
                   <Drinks height={35} color={'#fff'} style={{ top: -2 }} />
                      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                      
                        <Text style = {{
                          fontSize: 20,
                          textAlign: 'left', color: "#fff", marginLeft: 15,
                          fontFamily: 'SftBold', lineHeight: 20
                        }}>{item.reciever != myId ? language == 'English' ? 'You sent invitation to the party' : `Вы отправили приглашение на вечеринку` : language == 'English'  ? `${users[0].name} invited you to the party` : `${users[0].name} пригласил(а) вас на вечеринку`}</Text>
                      </View>
                  </View>
                  <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center',
                      borderWidth: 2, borderColor: '#E2FF6C', borderRadius: 100,
                      paddingHorizontal: 35, paddingVertical: 5, marginBottom: 20,
                      backgroundColor: 'rgba(0, 0, 0, 0)'
                    }}
                    onPress={() => {
                      let data = {
                        'id': item.link_id,
                        'start_date': '2024-12-25T22:00:00Z',
                        'finish_date': '2024-12-26T06:00:00Z',
                        'owner': 0,
                        'title': 'Party',
                        'theme': 'party',
                        'is_active': true,
                        'dress_code': 'No',
                        'description': 'description',
                        "city": {
                          "id": 0,
                          "name": "",
                          "name_eng": "",
                          "country": ""
                        },
                        'place': 'adress',
                        'payment': 0,
                        'participants_cnt': 1,
                        'food': 'not provided',
                        'drinks': 'not provided',
                        'music': 'not provided',
                        'is_owner': false,
                        'max_participants_cnt': 1
                      }
                      clickedItem(data)
                    }}
                  >
                    <Text
                      style={{ color: '#E2FF6C', fontSize: 18, fontFamily: 'SftBold' }}
                    >{language == 'English' ? 'Open' : 'Открыть'}</Text>
                  </TouchableOpacity>
                  </View>
              </View>
              {showDate && item.id !== combinedData[0].id && (
                <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>
              )}
              </Animated.View>
        )
        } else {
          if (item.game_active == false) {
            return(
              <Animated.View
              style={{transform: [{ translateY: item.id > messageId ? rendAnim : 0}], opacity: item.id > messageId ? opacityAnim : 1}}
              >
                {(item.id == data[data.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
              <View style={{justifyContent: "center", alignItems:'center', backgroundColor: 'transparent'}}>
                  <View style={{margin:5, marginVertical: 20, width:'90%', borderRadius: 25, backgroundColor: "#464E79",
                shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}}>
                      <View style={{ justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                        <View
                          style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 }, item.quest_active == 0 && {paddingBottom: 20}]}
                        >
                          <QuestionIcon width={30} height={30} />
                          <Text
                            style={{ 
                              fontSize: 18, textAlign: 'left', marginLeft: 5,
                              color: "#fff", fontFamily: 'SftBold'
                            }}
                            >{item.quest_active != 0 ? language == 'English' ? 'Question #' : 'Вопрос #' : language == 'English' ? 'Quiz over' : 'Квиз завершен'}{item.quest_active != 0 && item.quest_number}</Text>
                        </View>
                        {item.quest_active != 0 && <Text style = {{
                          fontSize: 15, padding: 20, paddingTop: 10,
                          textAlign: 'left', color: "#fff",
                          fontFamily: 'SftMedium', lineHeight: 20
                        }}>{language == 'English' ? item.text_eng : item.text}</Text>}
                      </View>
                  </View>
              </View>
              <View
                  style={[{ alignSelf: 'center', marginBottom: 20, borderRadius: 100, backgroundColor: '#fff' }]}
                >
                  {item.quest_active != 0 ? <Text
                    style={{ color: '#000', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, fontFamily: 'SftMedium' }}
                  >{item.reciever == users[0].id ? language == 'English' ? "Companion's turn to answer" : 'Отвечает собеседник' : language == 'English' ? 'Your turn to answer' : 'Ваша очередь отвечать'}</Text> :
                  <Text
                    style={{ color: '#000', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, fontFamily: 'SftMedium' }}
                  >{item.reciever == users[0].id ? language == 'English' ? 'You cancelled the quiz' : 'Вы отменили квиз' : language == 'English' ? 'Companion canceled the quiz' : 'Собеседник отменил квиз'}</Text>}
              </View>
              {showDate && item.id !== combinedData[0].id && (
                <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>
              )}
              </Animated.View>
          )} else {
            return(
              <Animated.View
              style={{transform: [{ translateY: item.id > messageId ? rendAnim : 0}], opacity: item.id > messageId ? opacityAnim : 1}}
              >
                {(item.id == data[data.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
              <View style={{justifyContent: "center", alignItems:'center', backgroundColor: 'transparent'}}>
                  <View style={{margin:5, marginVertical: 10, paddingHorizontal: 0, flexDirection: 'row', alignItems: 'center', width:'90%', borderRadius: 25, backgroundColor: item.reciever != myId ? "#464E79" : "#0E0E24",
                shadowColor: '#000', shadowOffset: {width: 0, height: 2}, overflow: 'hidden', shadowOpacity: 0.2}}>
                  {item.game_status != 0 && <View
                    style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                  >
                    
                    <Image
                    source={require('../images/alfred/alfredChat.jpg')}
                    style={{ width: '100%', height: '100%', transform: [{ rotateY: '180deg' }]}}
                    blurRadius={5}
                  />
                  {/* <View
                      style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(71, 78, 122, 0.7)'}}
                    /> */}
                    </View>}
                  <View
                    style={{ paddingHorizontal: 20, flexDirection: 'row',  alignItems: 'center' }}
                  >
                  {item.game_status == 1 ? <GameStarted width={35} height={35} /> :
                   item.game_status == 2 ? <GameFinished width={35} height={35} /> :
                   <GameIcon width={35} height={35} />}
                      <View style={{ justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                      
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center', paddingTop: item.game_status == 0 ? 20 : 30 }}
                        >
                          <Text
                            style={{ 
                              fontSize: 15, textAlign: 'left', marginLeft: 5,
                              color: "rgba(255, 255, 255, 0.64)", fontFamily: 'SftLight'
                            }}
                            >{format(message_pubD, 'H:mm')}</Text>
                        </View>
                        <Text style = {{
                          fontSize: 20, paddingBottom: item.game_status == 0 ? 20 : 30, paddingTop: 10,
                          textAlign: 'left', color: "#fff", marginLeft: 5,
                          fontFamily: 'SftMedium', lineHeight: 20
                        }}>{item.game_status == 0 && item.reciever != myId ? language == 'English' ? 'You made your move' : 'Вы сделали ход' : (language == 'English' && item.game_status == 0) ? item.text_eng : item.text}</Text>
                      </View>
                  </View>
                  </View>
              </View>
              {showDate && item.id !== combinedData[0].id && (
                <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>
              )}
              </Animated.View>
          )
          }
        }
        
       }
  }, [combinedData, messageId, loadingReaction, sentMes])

  const ITEM_HEIGHT = 100;
  const keyExtractor = useCallback((item, index) => index.toString(), [])
  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  )

  return (
    <View style={{flex:1, zIndex:1, backgroundColor: '#172136'}}>
    {!data ? <ActivityIndicator
      style={{ height: '100%', width: '100%', position: 'absolute' }}
      size='small'
    /> : <KeyboardAvoidingView
     style={{flex: 1}}
     behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
     keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight - 20 : -1000}
    >
    
    <FlashList
        ref={flatListRef}
        keyboardShouldPersistTaps='handled'
        estimatedItemSize={68}
        data={combinedData}
        renderItem = {renderData}
        inverted={true}
        keyExtractor = {keyExtractor}
        // initialNumToRender = {data.length}
        initialNumToRender={20}
        // windowSize = {data.length > 0 ? data.length : 30}
        // windowSize = {1}
        ListFooterComponent = {renderLoader}
        // onContentSizeChange={(width, height) => {
        //   flatListRef.current.scrollToOffset({
        //     offset: 0,
        //     animated: true
        //   })
        // }}
        showsVerticalScrollIndicator={false}
        onEndReached={LoadMoreItem}
        onEndReachedThreshold={0.8}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingTop: 20 }}
        style={{ paddingTop: 20}}
        />
        {stickerLoading && <ActivityIndicator
          style={{ height: 40 }}
        />}
        <View
          style={{ backgroundColor: '#0F1826' }}
        >
          {selectedText != '' && <View
            style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 10, paddingTop: 10, }}
          >
            <View
              style={{ width: 35 }}
            />
            <View
              style={{ borderLeftWidth: 2, borderLeftColor: '#6083FF', flex: 1 }}
            >
            <Text
              style={{ color: '#fff', paddingLeft: 10, }}
            >Ответ</Text>
            <Text
              style={{ color: '#fff', paddingLeft: 10, fontSize: 15, marginTop: 5 }}
              numberOfLines={1}
              ellipsizeMode='tail'
            >{selectedText}</Text>
            </View>
            <View
              style={{ width: 35, alignSelf: 'flex-start' }}
            >
            <IconButton
            size={25}
            icon='close'
            iconColor='#818C99'
            style={{ width: 25, height: 25 }}
            onPress={() => {
              setItemId(0)
              setSelectedMsgId(0)
              setItemText('')
              setSelectedText('')
            }}
          />
          </View>
          </View>}
      <View style={{
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
        paddingTop:10,
        paddingHorizontal: 10,
        width: '100%',
        backgroundColor: '#0F1826'}}>
        {chat_data && chat_data.private && <TouchableOpacity
          style={{ marginRight: 5 }}
          activeOpacity={0.7}
          onPress={() => {
            Keyboard.dismiss()
            setModalEmoji(true)
            textInput.current.clear()
          }}
        >
          <StickerPack width={32} height={32} /> 
        </TouchableOpacity>}
      <TextInput
            multiline={true}
            placeholder={language == 'English' ? 'Message': 'Сообщение'}
            placeholderTextColor='#636366'
            verticalAlign='middle'
            value={text}
            ref={textInput}
            onChangeText = {text => setText(text)}
            outlineColor='#3A3A3C'
            activeOutlineColor='#3A3A3C'
            style={{maxHeight: 120, backgroundColor: '#080D15', fontSize: 15, paddingTop: 10,
            flex: 1, textAlignVertical: 'center', borderRadius: 30,  overflow: 'hidden', paddingBottom: 10,
            color: '#fff', borderWidth: 1, borderColor: '#3A3A3C', paddingHorizontal: 10}}
        />
        {/* {text && <IconButton
            icon='send'
            iconColor='white'
            underlayColor='transparent'
            rippleColor={'transparent'}
            size={22}
            style={[{
              height: 25,
              width: 25,
              display: 'none',
            }, !text ? {display: 'none'} : {display: 'flex'}]}
            onPress={() => {
              // sendSocketMessage()
              console.log(users[0])
              sendMessage(users[0].tokens)
              setText('')
              textInput.current.clear()
            }}
        />} */}
        {text && <TouchableOpacity
          style={{ marginLeft: 5 }}
          activeOpacity={0.7}
          onPress={() => {
            // sendSocketMessage()
            if (text.trim() != '') {
              if (users.length > 0) {
                sendMessage(localId, token)
              } else {
                alert('User was deleted')
              }
              setText('')
              setItemId(0)
              setSelectedMsgId(0)
              setItemText('')
              setSelectedText('')
              textInput.current.clear()
            }  
          }}
        >
          <SendIcon width={32} height={32} />   
        </TouchableOpacity>}
        {!text && chat_data && chat_data.private && <TouchableOpacity
          style={{ marginLeft: 5 }}
          activeOpacity={0.7}
          onPress={() => {
            if (data.length == 0 || data.length > 0 && (data[0].quest_active == 0 || data[0].quest_active == 3 || data[0].quest_active == 2 && data[0].author.role != 'bot')) {
              setModalGames(true)
              textInput.current.clear()
            } else {
              endQuiz()
            }
          }}
        >
          <GamesIcon width={32} height={32} color={data.length > 0 ? (data[0].quest_active == 1 || data[0].quest_active == 2 && data[0].author.role == 'bot' ? "red" : "#7F7F7F") : "#7F7F7F"} /> 
        </TouchableOpacity>}
        </View>
        </View>
    </KeyboardAvoidingView>}
    <Modal
        transparent={true}
        animationType='fade'
        visible={modal}
        statusBarTranslucent={true}
        >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end'
        }}
        >
          <TouchableOpacity onPress={() => {
            setItemId(0)
            setItemText('')
            setModal(false)
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
            setModal(false)
            setTimeout(() => {
              setSelectedText(itemText)
              setSelectedMsgId(itemId)
              textInput.current.focus()
            }, 400)
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
            <Text style={{ fontSize: 20, fontFamily: 'SftMedium', color: '#6083FF' }}>{language == 'English' ? 'Answer' : 'Ответить'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setModal(false)
            setItemText('')
            setItemId(0)
          }}
          style={{
            height: '50%',
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

    <Modal
        transparent={true}
        animationType='fade'
        visible={modalEmoji}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setModalEmoji(false)
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.8,
            position:'absolute',
            left: 0,
            zIndex: 0
          }}
          activeOpacity={0.8}
          >
          </TouchableOpacity>
          <View style={{
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.9,
            minHeight: SCREEN_WIDTH * 0.9,
            justifyContent: 'center',
            overflow:'hidden'
          }}>
          <View
            style={{flexGrow: 1, justifyContent: 'flex-start', backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalEmoji(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'Choose action' : 'Выберите действие'}</Text>
          <View
            style={{flexGrow: 1, justifyContent: 'flex-start', width: '100%', alignItems: 'flex-start',
             paddingVertical: 30, paddingHorizontal: 10 }}
          >
            {/* <TouchableOpacity
            style={{ paddingHorizontal: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingVertical: 3 }}
            activeOpacity={0.8}
            onPress={() => {
              sendAction(users[0].sex == 'male' ? 'Punch' : 'Punchw', ` набил(а) вам ебало!`)
              setModalEmoji(false)
              textInput.current.blur()
            }}
          >
            <Text
              style={{ fontSize: 32, marginRight: 10 }}
            >👊</Text>
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Crush face' : 'Набить ебало'}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{ paddingHorizontal: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingVertical: 3 }}
            activeOpacity={0.8}
            onPress={() => {
              sendAction('Respect', ` выразил(а) вам респект!`)
              setModalEmoji(false)
            }}
          >
            <Text
              style={{ fontSize: 32, marginRight: 10 }}
            >👍</Text>
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Respect' : 'Выразить респект'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingHorizontal: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingVertical: 3 }}
            activeOpacity={0.8}
            onPress={() => {
              sendAction('Handshake', ` пожал(а) вам руку!`)
              setModalEmoji(false)
            }}
          >
            <Text
              style={{ fontSize: 32, marginRight: 10 }}
            >🤝</Text>
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Shake hands' : 'Пожать руку'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingHorizontal: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingVertical: 3 }}
            activeOpacity={0.8}
            onPress={() => {
              sendAction('Hugs', ` вас обнял(а)!`)
              setModalEmoji(false)
            }}
          >
            <Text
              style={{ fontSize: 32, marginRight: 10 }}
            >🤗</Text>
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'To hug' : 'Обнять'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingHorizontal: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingVertical: 3 }}
            activeOpacity={0.8}
            onPress={() => {
              sendAction('Wink', ` вам подмигнул(а)!`)
              setModalEmoji(false)
            }}
          >
            <Text
              style={{ fontSize: 32, marginRight: 10 }}
            >😉</Text>
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'To give a wink' : 'Подмигнуть'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingHorizontal: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingVertical: 3 }}
            activeOpacity={0.8}
            onPress={() => {
              sendAction(users[0].sex == 'male' ? 'Slap' : 'Slapw', ` дал(а) вам пощечину!`)
              setModalEmoji(false)
            }}
          >
            <Text
              style={{ fontSize: 32, marginRight: 10 }}
            >👋</Text>
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Slap in the face' : 'Дать пощечину'}</Text>
          </TouchableOpacity>
          </View>
          </View>
          </View>
        </View>
    </Modal>


    <Modal
        transparent={true}
        animationType='fade'
        visible={modalGames}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setModalGames(false)
            setQuizChoosen(false)
            setActiveTheme(0)
            scrollX.setValue(0)
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.8,
            position:'absolute',
            left: 0,
            zIndex: 0
          }}
          activeOpacity={0.8}
          >
          </TouchableOpacity>
          {!quizChoosen ? <View style={{
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.9,
            // minHeight: SCREEN_WIDTH * 0.9,
            justifyContent: 'center',
            overflow:'hidden'
          }}>
          <View
            style={{flexGrow: 1, justifyContent: 'flex-start', backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalGames(false)
              setActiveTheme(0)
              scrollX.setValue(0)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'Mini games' : 'Мини игры'}</Text>
          <View
            style={{flexGrow: 1, justifyContent: 'flex-start', width: '100%', alignItems: 'flex-start',
             paddingVertical: 30, paddingHorizontal: 10 }}
          >
            {/* <TouchableOpacity
            style={{ paddingHorizontal: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingVertical: 3 }}
            activeOpacity={0.8}
            onPress={() => {
              setQuizChoosen(true)
            }}
          >
            <Text
              style={{ fontSize: 32, marginRight: 10 }}
            >📋</Text>
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Quiz' : 'Квиз'}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{ paddingHorizontal: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingVertical: 3 }}
            activeOpacity={0.8}
            onPress={() => {
              gameAlfredStart()
              setModalGames(false)
              setActiveTheme(0)
              scrollX.setValue(0)
            }}
          >
            <Text
              style={{ fontSize: 32, marginRight: 10 }}
            >👨🏻</Text>
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Alfred' : 'Альфред'}</Text>
          </TouchableOpacity>
          </View>
          
          </View>
          </View> :
          <View
        style={{ width: SCREEN_WIDTH * 0.9, borderRadius: 15, paddingTop: 30, paddingBottom: 20, backgroundColor: '#172136',
          justifyContent: 'flex-start', alignItems: 'center'
         }}
      >
        <TouchableOpacity
            style={{ position: 'absolute', left: 0, top: 35, paddingLeft: 15 }}
            onPress={() => {
              setQuizChoosen(false)
              setActiveTheme(0)
              scrollX.setValue(0)
            }}
          >
            <ArrowBack width={20} height={20} />
          </TouchableOpacity>
        <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'Choose topic' : 'Выберите тему'}</Text>
        <View
              style={{maxHeight: 250 }}
            >
            <AnimatedFlatList
              data={[{ key: 'left-spacer' }, ...images, { key: 'right-spacer' }]}
              contentContainerStyle={{ justifyContent: 'center', alignItems: 'center',
                                        paddingHorizontal: 0}}
              renderItem={({ item, index }) => {
              if (!item.url) {
              // это пространство по бокам
              return <View style={{ width: SPACER_ITEM_SIZE }} />;
              }

          const inputRange = [
            (index - 2) * ITEM_WIDTH,
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
          ];

          // анимация масштаба
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.65, 1.1, 0.65], // увеличиваем центральный слайд
            extrapolate: 'extend',
          });

          // анимация прозрачности
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7], // изменяем прозрачность боковых слайдов
            extrapolate: 'extend',
          });
          const textOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0], // изменяем прозрачность текста
            extrapolate: 'extend',
          });

          return (
            <View
              style={{
                width: ITEM_WIDTH,
                height: ITEM_WIDTH * 1.2
              }}
            >
            <Animated.View
              style={{
                width: ITEM_WIDTH,
                aspectRatio: 1/1,
                transform: [{ scale }],
                opacity,
                borderRadius: 25,
                overflow: 'hidden'
              }}
            >
              <Image
                source={item.url}
                style={{ width: ITEM_WIDTH, height: ITEM_WIDTH, backgroundColor: '#000' }}
              />
            </Animated.View>
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
            <Animated.Text
                style={{ opacity: textOpacity, textAlign: 'center', color: '#6D7885', fontSize: 16, position: 'absolute',
                bottom: -16, fontFamily: 'SftMedium' }}
            >{language == 'English' ? 'Topic' : 'Тема разговора'}</Animated.Text>
            <Animated.Text
              style={{ opacity: textOpacity, color: '#fff', position: 'absolute',
              bottom: -40, fontSize: 18, width: SCREEN_WIDTH, textAlign: 'center', fontFamily: 'SftMedium' }}
            >{item.theme}</Animated.Text>
            </View>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={
          Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
          )
        }
        onMomentumScrollEnd={(e) => {
          let activeSlide = Math.floor((e.nativeEvent.contentOffset.x + (SCREEN_WIDTH * 0.9 - ITEM_WIDTH) / 2) / ITEM_WIDTH)
          setActiveTheme(activeSlide)
        }}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
      />
      {/* <Text>{images[activeTheme].quest}</Text> */}
      
      </View>
      <View
        style={{ flexGrow: 1, justifyContent: 'flex-end', width: '100%' }}
      >
            <TouchableOpacity
                style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 25, margin: 10, marginVertical: 18,
                shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
                Platform.OS === 'android' && {elevation: 2}]}
                activeOpacity={0.8}
                onPress={() => {
                  startQuiz()
                  setModalGames(false)
                  setQuizChoosen(false)
                  textInput.current.blur()
                }}
            >
                <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Start quiz' : 'Начать Квиз'}</Text>
            </TouchableOpacity>
      </View>
      </View>}
        </View>
    </Modal>


    {gameAlfred && <View
      style={{ width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center' }}
    > 
          <View style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            overflow:'hidden'
          }}>
          <View
            style={{flexGrow: 1, justifyContent: 'flex-start', backgroundColor: "#172136", alignItems: 'center' }}
          >
            <View
              style={{ width: '100%', alignItems: 'center', paddingVertical: 20, backgroundColor: '#172136',
               zIndex: 10000, borderBottomColor: '#2A3A45', borderBottomWidth: 1, justifyContent: 'center' }}
            >
            {/* <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setGameAlfred(false)
            }}
          /> */}
            <Text
              style={{ textAlign: 'center', fontSize: 22, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'Alfred' : 'Альфред'}</Text>
            <TouchableOpacity
              style={{ position: 'absolute', right: 10 }}
              activeOpacity={0.8}
              onPress={() => {
                finishGame()
                setGameAlfred(false)
              }}
            >
              <ExitIcon width={30} height={30} />
            </TouchableOpacity>
            </View>
            {gameAlfred && <Text
              style={{ color: '#fff', fontSize: 25, marginTop: 10, textAlign: 'left', width: '100%', paddingHorizontal: 10, fontFamily: 'SftMedium' }}
            >{gameData.defender != users[0].id ? language == 'English' ? 'Defend Alfred!' : 'Защищайте Альфреда!' : language == 'English' ? 'Attack Alfred!' : 'Атакуйте Альфреда!'}</Text>}
            <View
              style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between',
               paddingHorizontal: 10, alignItems: 'center', marginVertical: 20 }}
            >
            <View
              style={{ justifyContent: 'center', borderRadius: 100, overflow: 'hidden' }}
            >
            <Text
              style={{ color: '#fff', fontSize: 17, fontFamily: 'SftBold',
               paddingVertical: 10, paddingHorizontal: 15, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
            >{`Round: ${gameData.game_round}/3`}</Text>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
            >
              <View
                style={[{ width: 10, height: 10, borderRadius: 100, margin: 5 }, (gameData.game_round == 1 && gameData.round_one_w == 0) ? {backgroundColor: '#fff'} : gameData.round_one_w == 0 ? {backgroundColor: '#415562'} : gameData.round_one_w == users[0].id ? {backgroundColor: '#FF2525'} : {backgroundColor: '#65B141'}]}
              />
              <View
                style={[{ width: 10, height: 10, borderRadius: 100, margin: 5 }, gameData.game_round == 2 && gameData.round_two_w == 0 ? {backgroundColor: '#fff'} : gameData.round_two_w == 0 ? {backgroundColor: '#415562'} : gameData.round_two_w == users[0].id ? {backgroundColor: '#FF2525'} : {backgroundColor: '#65B141'}]}
              />
              <View
                style={[{ width: 10, height: 10, borderRadius: 100, margin: 5 }, gameData.game_round == 3 && gameData.round_three_w == 0 ? {backgroundColor: '#fff'} : gameData.round_three_w == 0 ? {backgroundColor: '#415562'} : gameData.round_three_w == users[0].id ? {backgroundColor: '#FF2525'} : {backgroundColor: '#65B141'}]}
              />
            </View>
            </View>
            {/* {gameData.defender != users[0].id ? gameData.animation_ended_defender == false && <Text>Animation defender {gameAlfredRoundWinner[gameData.round_ended] != users[0].id ? 'win' : 'loose'}</Text> : 
            gameData.animation_ended_enemy == false && <Text>Animation enemy {gameAlfredRoundWinner[gameData.round_ended] != users[0].id ? 'win' : 'loose'}</Text>} */}
            {/* {gameData.defender != users[0].id ? gameData.game_ended_defender == true && <Text>{gameData.points_defender > gameData.points_enemy ? 'You win!' : 'You loose'}</Text>:
            gameData.game_ended_enemy == true && <Text>{gameData.points_enemy > gameData.points_defender ? 'You win!' : 'You loose'}</Text>} */}
          <View
            style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center',}}
          >
            <View
              style={{ height: SCREEN_HEIGHT / 2, justifyContent: 'flex-end', width: SCREEN_WIDTH,
                       alignItems: 'center', overflow: 'hidden' }}
            >
              {gameData.defender != users[0].id ? gameData.game_ended_defender == true && <BlurView
                style={{ position: 'absolute', bottom: 0, zIndex: 10, width: '100%', paddingVertical: 20,
                overflow: 'hidden' }}
                intensity={25}
              >
                {Platform.OS === 'android' && <Image
                  style={{ position: 'absolute',  height: SCREEN_WIDTH / 1.2, width: SCREEN_WIDTH, bottom: 0,
                   alignSelf: 'center', backgroundColor: '#293F4E'}}
                  source={alfredStraight}
                  blurRadius={20}
                />}
                <Text
                  style={{ color: '#fff', fontSize: 30, textAlign: 'center', fontFamily: 'SftBold' }}
                >{gameData.points_defender > gameData.points_enemy ? 'You win!' : 'You loose'}</Text></BlurView> :
            gameData.game_ended_enemy == true && <BlurView
              style={{ position: 'absolute', bottom: 0, zIndex: 10, width: '100%', paddingVertical: 20,
              overflow: 'hidden' }}
              intensity={25}
            >
              {Platform.OS === 'android' && <Image
                  style={{ position: 'absolute',  height: SCREEN_WIDTH / 1.2, width: SCREEN_WIDTH, bottom: 0,
                   alignSelf: 'center', backgroundColor: '#293F4E'}}
                  source={alfredStraight}
                  blurRadius={20}
                />}
                <Text
              style={{ color: '#fff', fontSize: 30, textAlign: 'center', fontFamily: 'SftBold' }}
            >{gameData.points_enemy > gameData.points_defender ? 'You win!' : 'You loose'}</Text>
            </BlurView>}
              <Image
                source={alfredStraight}
                style={{ padding: 0, margin: 0, height: SCREEN_WIDTH / 1.2, aspectRatio: 1/1 }}
              />
              <Image
                source={bgAlfred}
                style={{ padding: 0, margin: 0, height: '100%', width: SCREEN_WIDTH,
                 position: 'absolute', alignSelf: 'flex-end', opacity: opacityAlfredBg,
                  transform: [{translateY: 0}, {scale: 1.4}] }}
              />
              <Animated.Image
                source={alfredSlap}
                style={[{ padding: 0, margin: 0, height: SCREEN_WIDTH / 1.1, width: SCREEN_WIDTH / 1.1,
                 position: 'absolute', opacity: opacityAlfredSlap, alignSelf: 'flex-end', transform: [{translateX: translateAlfredSlap}] },
                 gameData.attacking_side_last == 0 && {transform: [{rotateY: '180deg'}, {translateX: translateAlfredSlap}], alignSelf: 'flex-start'}]}
              />
              <Animated.Image
                source={alfredSlipping}
                style={[{ padding: 0, margin: 0, height: SCREEN_WIDTH / 1.1, width: SCREEN_WIDTH / 1.1,
                 position: 'absolute', opacity: opacityAlfredDefence, alignSelf: 'flex-start', transform: [{translateX: translateAlfred}] },
                 gameData.defending_side_last == 0 && {transform: [{rotateY: '180deg'}, {translateX: translateAlfred}], alignSelf: 'flex-end'}]}
              />
              <Animated.Image
                source={slapHand}
                style={[{ padding: 0, margin: 0, height: SCREEN_WIDTH / 1.1, width: SCREEN_WIDTH / 1.1, bottom: -10,
                 position: 'absolute', opacity: opacityAlfredHand, alignSelf: 'flex-end', transform: [{translateX: translateAlfredHand}, {rotateZ: rotateHandInterpolated}] },
                 gameData.attacking_side_last != 0 && {transform: [{rotateY: '180deg'}, {translateX: translateAlfredHand}, {rotateZ: rotateHandInterpolated}], alignSelf: 'flex-start'}]}
              />
              
            </View>
            {gameData.defender != users[0].id ? <View
              style={{ height: SCREEN_WIDTH / 3.5, width: SCREEN_WIDTH }}
            >
              {gameData.round_ended < 3 ? (!gameData.defended ? <View
              style={{ height: '100%', width: '100%', backgroundColor: '#172136', flexDirection: 'row' }}
              >
              {!animAlfredOn && <TouchableOpacity
                style={{ width: SCREEN_WIDTH / 2, height: '100%', justifyContent: 'center', alignItems: 'center' }}
                activeOpacity={Platform.OS === 'android' ? 1 : 0.7}
                onPress={() => {
                  gameAlfredAction('left')
                  setAnimAlfredOn(true)
                }}
              >
                <View
                  style={[{ paddingVertical: 15, paddingHorizontal: 20, minWidth: SCREEN_WIDTH / 3, borderRadius: 15, borderWidth: 1, borderColor: '#90A9FF', justifyContent: 'center',
                           shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 3 },
                           Platform.OS === 'android' && {elevation: 3, backgroundColor: '#172136'}]}
                >
                  <Text
                    style={{ textAlign: 'center', color: '#fff', fontFamily: 'SftMedium' }}
                  >{language == 'English' ? 'Left Block' : 'Левый Блок'}</Text>
                </View>
              </TouchableOpacity>}
              {!animAlfredOn && <TouchableOpacity
                style={{ width: SCREEN_WIDTH / 2, height: '100%', justifyContent: 'center', alignItems: 'center' }}
                activeOpacity={Platform.OS === 'android' ? 1 : 0.7}
                onPress={() => {
                  gameAlfredAction('right')
                  setAnimAlfredOn(true)
                }}
              >
              <View
                  style={[{ paddingVertical: 15, paddingHorizontal: 20, minWidth: SCREEN_WIDTH / 3, borderRadius: 15, borderWidth: 1, borderColor: '#90A9FF', justifyContent: 'center',
                  shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 3 },
                  Platform.OS === 'android' && {elevation: 3, backgroundColor: '#172136'}]}
                >
                  <Text
                    style={{ textAlign: 'center', color: '#fff', fontFamily: 'SftMedium' }}
                  >{language == 'English' ? 'Right Block' : 'Правый Блок'}</Text>
                </View>
              </TouchableOpacity>}
              {animAlfredOn && <View
                style={{ width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center' }}
              >
                <ActivityIndicator
                  size={'small'}
                />
              </View>}
              </View> : <View
                style={{ alignSelf: 'center', borderRadius: 100, overflow: 'hidden', marginVertical: 30 }}
              >
                <Text
                  style={[{ color: '#fff', fontSize: 20, textAlign: 'center', fontFamily: 'SftMedium',
                  paddingVertical: 10, paddingHorizontal: 15, backgroundColor: 'rgba(255, 255, 255, 0.12)' }, language == 'English' ? {fontSize: 17} : {fontSize: 20}]}
                >{language == 'English' ? "Waiting for your opponent's move... " : 'Ждем ход соперника... '}</Text>  
              </View>) :
              <View
                style={{ alignSelf: 'center', borderRadius: 100, overflow: 'hidden', marginVertical: 30 }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 20, textAlign: 'center',
                  paddingVertical: 10, paddingHorizontal: 15, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
                >Игра завершена</Text> 
              </View>}
            </View> : <View
              style={{ height: SCREEN_WIDTH / 3.5, width: SCREEN_WIDTH }}
            >
              {gameData.round_ended < 3 ? (!gameData.attacked ? <View
              style={{ height: '100%', width: '100%', backgroundColor: '#172136', flexDirection: 'row' }}
              >
              {!animAlfredOn && <TouchableOpacity
                style={{ width: SCREEN_WIDTH / 2, height: '100%', justifyContent: 'center', alignItems: 'center' }}
                activeOpacity={Platform.OS === 'android' ? 1 : 0.7}
                onPress={() => {
                  gameAlfredAction('left')
                  setAnimAlfredOn(true)
                }}
              >
                <View
                  style={[{ paddingVertical: 15, minWidth: SCREEN_WIDTH / 3, paddingHorizontal: 20, borderRadius: 15, borderWidth: 1, borderColor: '#90A9FF', justifyContent: 'center',
                           shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 3 },
                           Platform.OS === 'android' && {elevation: 3, backgroundColor: '#172136'}]}
                >
                  <Text
                    style={{ textAlign: 'center', color: '#fff', fontFamily: 'SftMedium' }}
                  >{language == 'English' ? 'Left Slap' : 'Левая Пощечина'}</Text>
                </View>
              </TouchableOpacity>}
              {!animAlfredOn && <TouchableOpacity
                style={{ width: SCREEN_WIDTH / 2, height: '100%', justifyContent: 'center', alignItems: 'center' }}
                activeOpacity={Platform.OS === 'android' ? 1 : 0.7}
                onPress={() => {
                  gameAlfredAction('right')
                  setAnimAlfredOn(true)
                }}
              >
              <View
                  style={[{ paddingVertical: 15, minWidth: SCREEN_WIDTH / 3, paddingHorizontal: 20, borderRadius: 15, borderWidth: 1, borderColor: '#90A9FF', justifyContent: 'center',
                           shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 3 },
                           Platform.OS === 'android' && {elevation: 3, backgroundColor: '#172136'}]}
                >
                  <Text
                    style={{ textAlign: 'center', color: '#fff', fontFamily: 'SftMedium' }}
                  >{language == 'English' ? 'Right Slap' : 'Правая Пощечина'}</Text>
                </View>
              </TouchableOpacity>}
              {animAlfredOn && <View
                style={{ width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center' }}
              >
                <ActivityIndicator
                  size={'small'}
                />
              </View>}
              </View> : <View
                style={{ alignSelf: 'center', borderRadius: 100, overflow: 'hidden', marginVertical: 30 }}
              >
                <Text
                  style={[{ color: '#fff', fontSize: 20, textAlign: 'center', fontFamily: 'SftMedium',
                  paddingVertical: 10, paddingHorizontal: 15, backgroundColor: 'rgba(255, 255, 255, 0.12)' }, language == 'English' ? {fontSize: 17} : {fontSize: 20}]}
                >{language == 'English' ? "Waiting for your opponent's move... " : 'Ждем ход соперника... '}</Text>  
              </View>) :
              <View
              style={{ alignSelf: 'center', borderRadius: 100, overflow: 'hidden', marginVertical: 30 }}
            >
              <Text
                style={{ color: '#fff', fontSize: 20, textAlign: 'center',
                         paddingVertical: 10, paddingHorizontal: 15, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
              >Игра завершена</Text> 
            </View>}
            </View> 
            }
          </View>
          </View>
          </View>
    </View>}
    </View>
  )
}
const styles = StyleSheet.create({
  loadingCircle: {
    display: 'none'
  },
  
  dateStyleMessages: {
    textAlign: 'center',
    fontSize: 15,
    margin: 20,
    color: '#0aa',
    fontFamily: 'SftMedium'
  }
});
export default Chat