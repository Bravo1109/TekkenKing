import { View, Text, TouchableOpacity, KeyboardAvoidingView, 
    FlatList, Platform, ActivityIndicator, StyleSheet,
    Image, Animated, Dimensions, Modal, ScrollView } from 'react-native'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import ArrowLeft from '../images/turnBack.svg';
import {IconButton, Button} from 'react-native-paper';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExitIcon from '../images/alfred/exitGame.svg'
import { BASE_URL } from './config';
import { BlurView } from 'expo-blur';
import LottieView from 'lottie-react-native';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
// const ITEM_WIDTH = width * 0.35; // ширина центрального слайда
// const SPACER_ITEM_SIZE = (width - ITEM_WIDTH) / 2; // ширина пространства по бокам

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const alfredStraight = require('../images/alfred/alfred.png')
const alfredSlap = require('../images/alfred/alfredSlap.png')
const slapHand = require('../images/alfred/slapHand.png')
const alfredSlipping = require('../images/alfred/alfredSlipping.png')
const bgAlfred = require('../images/alfred/bgAlfred.jpg')

const diceIcon = require('../images/dice.png')

const AlfredRating = (props) => {
    getTokenData = async () => {
        try {
            tokenData = await AsyncStorage.getItem('token')
            return tokenData
        } catch(e) {
            console.log('error home', e)
        }
    }
  const { widthH, heightH } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight({ widthH, heightH }, Platform.OS, insets.top) - 10
  const nowDate = new Date()
  const [gameAnimation, setGameAnimation] = useState(true)
  const [animAlfredOn, setAnimAlfredOn] = useState(false)
  const translateAlfred = useRef(new Animated.Value(-50)).current;
  const translateAlfredHand = useRef(new Animated.Value(-50)).current;
  const rotateHand = useRef(new Animated.Value(0)).current;
  const translateAlfredSlap = useRef(new Animated.Value(50)).current;
  const [opacityAlfredBg, setOpacityAlfredBg] = useState(0)
  const [opacityAlfredSlap, setOpacityAlfredSlap] = useState(0)
  const [opacityAlfredDefence, setOpacityAlfredDefence] = useState(0)
  const [opacityAlfredHand, setOpacityAlfredHand] = useState(0)
  const [gameAlfred, setGameAlfred] = useState(false)
  const [gameData, setGameData] = useState({})
  const [modalErr, setModalErr] = useState(false)
  const [modalExit, setModalExit] = useState(false)

  const [messageId, setMessageId] = useState(0)
  const SCREEN_WIDTH = Dimensions.get('window').width
  const SCREEN_HEIGHT = Dimensions.get('window').height
  // const onMomentumScrollEnd = (e) => {
  //   let activeIndex = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
  //   if (activeIndex === images.length) {
  //     flatListRef.current.scrollToIndex({ index: 0, animated: false });
  //   } else if (activeIndex === -1) {
  //     flatListRef.current.scrollToIndex({ index: images.length - 1, animated: false });
  //   }
  // };
  const [gender, setGender] = useState('all')
  
  const [language, setLanguage] = useState('')
  const isFocused = useIsFocused();
  const timerRef = useRef(null);
  const timerQueueRef = useRef(null);
  const [checkMes, setCheckMes] = useState(0)
  const [dialogId, setDialogId] = useState(0)
  const [dialogFound, setDialogFound] = useState(false)
  const [lastMesDate, setLastMesDate] = useState()
  const [lastChangeDate, setLastChangeDate] = useState('2023-12-02T19:28:25.869874Z')
  const [converseActive, setConverseActive] = useState(false)
  const [queue, setQueue] = useState(false)
  const [nextPageIsNull, setNextPageIsNull] = useState(true)
  const token = getTokenData()
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([])
  const [text, setText] = useState("")
  const [errorText, setErrorText] = useState("")
  const [loading, setLoading] = useState(false)
  const [ratingBet, setRatingBet] = useState(100)
  const [instruction, setInstruction] = useState(false)
  
  const [modalOpened, setModalOpened] = useState(false)
  const translateY = useRef(new Animated.Value(30)).current;
  const opacityModalOpened = useRef(new Animated.Value(0)).current
  const opacityImage = useRef(new Animated.Value(0)).current
  const opacityTextModalOpened = useRef(new Animated.Value(0)).current
  const rendAnim = useRef(new Animated.Value(10)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const rotateHandInterpolated = rotateHand.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-5deg', '0deg', '5deg']
  });

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
      data.length > 0 && setMessageId(data[0].id)
    })
  }

  useEffect(() => {
    rendAnim.setValue(10)
    opacityAnim.setValue(0)
    animateRender()
    console.log('animanimanim')
  }, [data])

  const loadQueue = () => {
    let status = 0
    setLoading(true)
    fetch(`${BASE_URL}/api/lobby_alfred/${ratingBet}/lobby_adding/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => {
      status = resp.status
      return resp.json()
    })
    .then(res => {
      if (status == 403) {
        setErrorText(res[0])
        setModalErr(true)
        setLoading(false)
      } else {
        if (res.queue == 0) {
            setQueue(true)
            setLoading(false)
        } else {
            loadDialog()
        }
      }
    })
    
    .catch(error => {
      console.log("Error load data", error)
    })
  }

  const dialogOpenedTranslation = () => {
    Animated.timing(opacityModalOpened, {
      toValue: 1,
      useNativeDriver: true,
      duration: 400,
    }).start()
    Animated.timing(translateY, {
      toValue: 0,
      useNativeDriver: true,
      duration: 400,
      delay: 200
    }).start()
    Animated.timing(opacityImage, {
      toValue: 1,
      useNativeDriver: true,
      duration: 400,
      delay: 200
    }).start()
    Animated.timing(opacityTextModalOpened, {
      toValue: 1,
      useNativeDriver: true,
      duration: 800,
      delay: 800
    }).start()
  }
  const loadDialog = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/chats/?search=2`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (res.results.length > 0) {
        setDialogId(res.results[0].id)
        // setUsers([res.results[0].users[0]])
        setLastChangeDate(res.results[0].last_change)
        loadDialogData(res.results[0].id)
      } else {
        lobbyAdded()
      }
    })
    .catch(error => {
      console.log("Error load data", error)
    })
  }

  const lobbyAdded = () => {
    console.log('added')
    clearTimeout(timerQueueRef.current)
    fetch(`${BASE_URL}/api/lobby_alfred/${ratingBet}/lobby_added/`, {
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
        loadDialog()
      }
      setLoading(false)
      lobbyRefresh()
    })
    .catch(error => {
      console.log("Error load data", error)
    })
  }

  const likeMessage = (type) => {
    const itemId = data[0].id
    fetch(`${BASE_URL}/api/like_message/${type}/${itemId}/`, {
        method:"PATCH",
        headers: {
          'Authorization': `${token._j}`
        }
      }).then((res) => {
        if(res.status == 200) {
          console.log('liked')
          refreshDialogData()
        }
      }).catch(error => {
        console.log("Error del", error)
      })
  }

  const chatOpen = () => {
    const itemId = data[0].id
    fetch(`${BASE_URL}/api/open_random_chat/${itemId}/`, {
        method:"PATCH",
        headers: {
          'Authorization': `${token._j}`
        }
      }).then((res) => {
        if(res.status == 200) {
          console.log('liked')
          refreshDialogData()
        } else if (res.status == 204) {
          setModalOpened(true)
          clearTimeout(timerRef.current)
          refreshDialogData()
        }
      }).catch(error => {
        console.log("Error del", error)
      })
  }

  const reload = () => {
    timerRef.current = setTimeout(() => {
        setCheckMes(checkMes + 1)
        console.log('rellllooooaaaad')
    }, 5000)
    if (!props.navigation.isFocused()) {
      clearTimeout(timerRef.current)
    }
  }

  const lobbyRefresh = () => {
    console.log('jabd')
    if (!dialogFound) {
        timerQueueRef.current = setTimeout(() => {
            lobbyAdded()
        }, 5000)
        if (!props.navigation.isFocused()) {
          clearTimeout(timerQueueRef.current)
        }
    }
    else {
        clearTimeout(timerQueueRef.current)
    }
  }


  const loadDialogData = (id) => {
    clearTimeout(timerRef.current)
    fetch(`${BASE_URL}/api/chats/${id}/?page=${currentPage}&limit=30`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      // console.log(data.length, res.next)
      if (res.next == null) {
        setNextPageIsNull(true)
      }
      const uniqueData = [...data, ...res.results].filter((item, index, array) => {
        return array.findIndex(t => t.id === item.id) === index;
      });
      setData(uniqueData)
      if (!lastMesDate) {
        setLastMesDate(lastChangeDate)
      }
      if (res.game_selected == 2) {
        setGameData(res.game_data)
        if (!gameAlfred) {
            setGameAlfred(true)
        }
      }
      setConverseActive(true)
      setLoading(false)
      reload()
    })
    .catch(error => {
      console.log("Error", error)
      setLoading(false)
    })
  }

  const refreshDialogData = () => {
    clearTimeout(timerRef.current)
    console.log('refreshingggg')
    fetch(`${BASE_URL}/api/chats/${dialogId}/?page=1&limit=15`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (data[0] != undefined) {
        console.log('res results', res.results)
        let newData = [...data, ...res.results].filter((item, index, array) => {
          return array.findIndex(t => t.id === item.id) === index;
        });
        newData.unshift(...res.results)
        const uniqueData = [...newData].filter((item, index, array) => {
          return array.findIndex(t => t.id === item.id) === index;
        });
        console.log('firstttt: ', newData)
        if (newData.length > 0) {
            setLastMesDate(newData[0].pub_date)
        }
        setData(uniqueData);
      }
      if (res.game_selected == 2) {
        setGameData(res.game_data)
        if (!gameAlfred) {
            setGameAlfred(true)
        }
      }
      if (res.count > 0 && res.results[0].quest_active == 2 && res.results[0].author_to_open == 1 && res.results[0].recipient_to_open == 1 && !modalOpened) {
        setModalOpened(true)
        clearTimeout(timerRef.current)
      } else {
        reload()
      }
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const endGame = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/chats/${dialogId}/alfred/end_game/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
        props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
        setLoading(false)
    })
    
    .catch(error => {
      console.log("Error load data", error)
    })
  }

  const finishSearch = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/lobby_alfred/${ratingBet}/lobby_exit/`, {
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
    getTokenData()
  }, []);
  useEffect(() => {
    if (data.length > 0 && data[0].quest_active == 2 && data[0].author_to_open == 1 && data[0].recipient_to_open == 1 && !modalOpened) {
      setModalOpened(true)
      clearTimeout(timerRef.current)
    }
  }, [data]);
  useEffect(() => {
    if (modalOpened) {
      dialogOpenedTranslation()
    }
  }, [modalOpened]);
  useEffect(() => {
    getTokenData()
    .then(() => {
        loadDialog()
    })
  }, []);
  useEffect(() => {
    getLanguageData()
  }, []);

  useEffect(() => {
    getTokenData()
    .then(() => {
      if (isFocused && checkMes != 0) {
        refreshDialogData()
      }
    })
  }, [checkMes])

  const loadingCircleStyle = () => {
    return {
        opacity: + loading,
        width: '100%',
        height: 30,
        alignItems:'center',
        justifyContent:'center'
    }
  }

  const gameAlfredAction = (side) => {
    let status = 0
    fetch(`${BASE_URL}/api/chats/${dialogId}/alfred/face_side/`, {
      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${token._j}`
      },
      body: JSON.stringify({
        side: side
      })
    }).then((resp) => {
      refreshDialogData()
      return resp.json()
    }).then((resp) => {
      console.log('alfredo: ', resp)
      // for (let i = 0; i < resp.tokens.length; i++) {
      //   sendPushNotification(resp.tokens[i], resp.id, 'Alfred Game', `Соперник сделал ход!`, `${BASE_URL}/media/${resp.photo}`, 50, 'RatingList')
      // }
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const gameAlfredEndAnimation = () => {
    let status = 0
    fetch(`${BASE_URL}/api/chats/${dialogId}/alfred/end_animation/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then((resp) => {
      refreshDialogData()
      if(resp.status == 201 && text != '') {
        status = 201
        return resp.json()
      }
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  useEffect(() => {
    if (gameData != undefined && gameData.enemy == gameData.my_id && gameData.animation_ended_enemy == false) {
      setTimeout(() => {
        gameAlfredEndAnimation()
      }, 3500)
    } else if (gameData != undefined && gameData.defender == gameData.my_id && gameData.animation_ended_defender == false) {
      setTimeout(() => {
        gameAlfredEndAnimation()
      }, 3500)
    }
  }, [gameData])

  const gameAlfredRoundWinner = {
    1: gameData != undefined && gameData.round_one_w,
    2: gameData != undefined && gameData.round_two_w,
    3: gameData != undefined && gameData.round_three_w
  }

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
      gameData.defender == gameData.my_id ? gameData.animation_ended_defender == false && (gameAlfredRoundWinner[gameData.round_ended] == gameData.my_id ? gameAlfredActionOpacity(1) : gameAlfredActionOpacity(0)) : 
      gameData.animation_ended_enemy == false && (gameAlfredRoundWinner[gameData.round_ended] == gameData.my_id ? gameAlfredActionOpacity(0) : gameAlfredActionOpacity(1))
    }
  }, [gameData])

  useEffect(() => {
    if (gameData != undefined && !gameAnimation) {
      gameData.defender == gameData.my_id ? gameData.animation_ended_defender == true && setGameAnimation(true) : 
      gameData.animation_ended_enemy == true && setGameAnimation(true)
    }
  }, [gameData])

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

  // const renderData = useCallback(({item, index}) => {
  //   let a  = 0
  //   let prevMesDate = new Date(moment(item.pub_date).toISOString())
  //   if (index < data.length - 1) {
  //     prevMesDate = new Date(moment(data[index + 1].pub_date).toISOString())
  //   }
  //   let mesDate = pubId
  //   let itemStyle =  StyleSheet.create({
  //       myCardStyle: {
  //           fontSize: 17,
  //           padding: 10,
  //           textAlign: "left",
  //           color: "white",
  //           fontFamily: 'SftMedium'
  //       },
  //       userCardStyle: {
  //           fontSize: 20,
  //           padding: 15,
  //           color: "white",
  //       }
  //   })
  //   let message_pubD = new Date(moment(item.pub_date).toISOString())
  //   let message_date = new Date(mesDate)
  //   if (format(message_pubD, 'dd MMM yyy') != format(pubId, 'dd MMM yyy')) {
  //     pubId = message_pubD
  //     a = 1
  //   }
  //   if (users.length == 0) {
  //     return(
  //       <View>
  //         {(item.id == data[data.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
  //       <View style={{justifyContent: "flex-end", alignItems:'flex-end', backgroundColor: 'transparent'}}>
  //       <TouchableOpacity
  //         style={[(index < data.length - 1) &&
  //           format(message_pubD, 'dd MM yyyy') == format(prevMesDate, 'dd MM yyyy') &&
  //           {borderTopRightRadius: 5}, {margin:5, marginVertical: 2, maxWidth:'80%', borderRadius: 25, borderBottomRightRadius: 5, backgroundColor: "#2B4150",
  //         shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}]}
  //         delayLongPress={800}
  //         activeOpacity={0.7}
  //         >
  //           <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
  //             <Text style = {itemStyle.myCardStyle}>{item.text}</Text>
  //             <Text style={{ color: '#81848B', paddingBottom: 5, paddingRight: 5, fontSize: 12, marginLeft: 'auto' }}>{format(message_pubD, 'H:mm')}</Text>
  //           </View>
            
  //       </TouchableOpacity>
  //     </View>
  //     {(a == 1 && item.id != data[0].id) && <Text style={styles.dateStyleMessages}>{format(message_date, 'dd MMM yyyy')}</Text>}
  //     </View>
  //     )
  //   }
  //   if (users.length > 0 && item.author == gameData.my_id && item.author != 2) {
  //       return(
  //         <Animated.View
  //         style={{transform: [{ translateY: item.id > messageId ? rendAnim : 0}], opacity: item.id > messageId ? opacityAnim : 1}}
  //         >
  //           {(item.id == data[data.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
  //         <View style={{justifyContent: "flex-end", alignItems:'flex-end', backgroundColor: 'transparent'}}>
  //         <TouchableOpacity
  //           style={[(index < data.length - 1) &&
  //             data[index + 1].author == item.author &&
  //             format(message_pubD, 'dd MM yyyy') == format(prevMesDate, 'dd MM yyyy') &&
  //             {borderTopRightRadius: 5}, {margin:5, marginVertical: 2, maxWidth:'80%', borderRadius: 25, borderBottomRightRadius: 5, backgroundColor: "#2B4150",
  //           shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}]}
  //           delayLongPress={800}
  //           activeOpacity={0.7}
  //           >
  //             <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
  //             <Text style = {itemStyle.myCardStyle}>{item.text}</Text>
  //             <Text style={{ color: '#81848B', paddingBottom: 7, paddingRight: 7, fontSize: 12, marginLeft: 'auto' }}>{format(message_pubD, 'H:mm')}</Text>
  //             </View>
  //         </TouchableOpacity>
  //     </View>
  //     {item.quest_active == 2 && item.author_to_open == 0 && <View
  //             style={{ alignSelf: 'center', marginTop: SCREEN_HEIGHT * 0.1, borderRadius: 25, width: '90%',
  //             backgroundColor: '#1A2E45', paddingVertical: 15 }}
  //           > 
  //             <Text
  //               style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 14, textAlign: 'center' }}
  //             >Вы хотите открыть чат с пользователем?</Text>
  //             <View
  //               style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
  //             >
  //               <TouchableOpacity
  //                 style={{ padding: 5, paddingHorizontal: 10, shadowColor: '#FF2525', shadowOpacity: 1, shadowRadius: 5 }}
  //               >
  //                 <Close width={50} height={50} />
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 style={{ padding: 5, paddingHorizontal: 10, shadowColor: '#E2FF6C', shadowOpacity: 0.6, shadowRadius: 10 }}
  //                 onPress={() => {
  //                   chatOpen()
  //                 }}
  //               >
  //                 <Heart width={50} height={50} />
  //               </TouchableOpacity>
  //             </View>
  //           </View>}
  //           {item.quest_active == 2 && item.author_to_open == 1 && item.recipient_to_open == 0 &&<View
  //             style={{ alignSelf: 'center', marginVertical: 20, borderRadius: 100, backgroundColor: 'purple' } }
  //           > 
  //             <Text
  //               style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15 }}
  //             >Ждем решения пользователя об открытии чата</Text>
  //           </View>}
  //           {item.quest_active == 2 && item.author_to_open == 1 && item.recipient_to_open == 1 && <View
  //             style={{ alignSelf: 'center', marginVertical: 20, borderRadius: 100, backgroundColor: '#3caa3c' } }
  //           > 
  //             <Text
  //               style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15 }}
  //             >Вы открыли чат!</Text>
  //           </View>}
  //     {(a == 1 && item.id != data[0].id) && <Text style={styles.dateStyleMessages}>{format(message_date, 'dd MMM yyyy')}</Text>}
  //     {item.is_liked != 0 && <View
  //             style={[{ alignSelf: 'center', marginTop: 20, borderRadius: 100, backgroundColor: 'purple' }]}
  //           >
  //             <Text
  //               style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, fontFamily: 'SftMedium' }}
  //             >{item.is_liked == 1 ? 'Собеседника устроил ваш ответ' : item.is_liked == 2 ? 'Собеседник не доволен ответом' : item.is_liked == 3 ? 'Вы развеселили собеседника' : item.is_liked == 4 ? 'Собеседнику понравился ваш ответ' : 'Собеседника стошнило'}</Text> 
  //     </View>}
  //     </Animated.View>
  // )
  //     }
  //   else if (users.length > 0 && item.author != gameData.my_id && item.author != 2) {
  //       return(
  //         <Animated.View
  //         style={{transform: [{ translateY: item.id > messageId ? rendAnim : 0}], opacity: item.id > messageId ? opacityAnim : 1}}
  //         >
  //           {(item.id == data[data.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
  //         <View style={{justifyContent: "flex-start", alignItems:'flex-start', backgroundColor: 'transparent'}}>
  //             <View style={[(index < data.length - 1) &&
  //             data[index + 1].author == item.author &&
  //             format(message_pubD, 'dd MM yyyy') == format(prevMesDate, 'dd MM yyyy') &&
  //             {borderTopLeftRadius: 5}, {margin:5, marginVertical: 2, maxWidth:'80%', borderRadius: 25, borderBottomLeftRadius: 5, backgroundColor: "#0E0E24",
  //           shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}]}>
  //                 <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
  //                   <Text style = {itemStyle.myCardStyle}>{item.text}</Text>
  //                   <Text style={{ color: '#81848B', paddingBottom: 7, paddingRight: 7, fontSize: 12, marginLeft: 'auto' }}>{format(message_pubD, 'H:mm')}</Text>
  //                 </View>
  //             </View>
  //         </View>
  //         {item.id == data[0].id && item.is_liked == 0 && item.quest_active == 1 && <View
  //             style={{ alignSelf: 'center', marginTop: SCREEN_HEIGHT * 0.1, borderRadius: 25, width: '90%',
  //                      backgroundColor: '#1A2E45', paddingVertical: 15 }}
  //           > 
  //             <Text
  //               style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15,
  //                        fontSize: 15, textAlign: 'center', fontFamily: 'SftMedium' }}
  //             >Оцените ответ собеседника</Text>
  //             <View
  //               style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}
  //             >
  //               <TouchableOpacity
  //                 style={{ marginHorizontal: 10 }}
  //                 activeOpacity={0.8}
  //                 onPress={() => {
  //                   likeMessage(1)
  //                 }}
  //               >
  //                 <Text
  //                   style={{ fontSize: 36 }}
  //                 >👍</Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 style={{ marginHorizontal: 10 }}
  //                 activeOpacity={0.8}
  //                 onPress={() => {
  //                   likeMessage(2)
  //                 }}
  //               >
  //                 <Text
  //                   style={{ fontSize: 36 }}
  //                 >👎</Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 style={{ marginHorizontal: 10 }}
  //                 activeOpacity={0.8}
  //                 onPress={() => {
  //                   likeMessage(3)
  //                 }}
  //               >
  //                 <Text
  //                   style={{ fontSize: 36 }}
  //                 >😆</Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 style={{ marginHorizontal: 10 }}
  //                 activeOpacity={0.8}
  //                 onPress={() => {
  //                   likeMessage(4)
  //                 }}
  //               >
  //                 <Text
  //                   style={{ fontSize: 36 }}
  //                 >❤</Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 style={{ marginHorizontal: 10 }}
  //                 activeOpacity={0.8}
  //                 onPress={() => {
  //                   likeMessage(5)
  //                 }}
  //               >
  //                 <Text
  //                   style={{ fontSize: 36 }}
  //                 >🤮</Text>
  //               </TouchableOpacity>
  //             </View>
  //           </View>}

  //           {item.quest_active == 2 && item.recipient_to_open == 0 && <View
  //             style={{ alignSelf: 'center', marginTop: SCREEN_HEIGHT * 0.1, borderRadius: 25, width: '90%',
  //             backgroundColor: '#1A2E45', paddingVertical: 15 }}
  //           > 
  //             <Text
  //               style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15 }}
  //             >Вы хотите открыть чат с пользователем?</Text>
  //             <View
  //               style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
  //             >
  //               <TouchableOpacity
  //                 style={{ padding: 5, paddingHorizontal: 10, shadowColor: '#FF2525', shadowOpacity: 1, shadowRadius: 5 }}
  //               >
  //                 <Close width={50} height={50} />
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 style={{ padding: 5, paddingHorizontal: 10, shadowColor: '#E2FF6C', shadowOpacity: 0.6, shadowRadius: 10 }}
  //                 onPress={() => {
  //                   chatOpen()
  //                 }}
  //               >
  //                 <Heart width={50} height={50} />
  //               </TouchableOpacity>
  //             </View>
  //           </View>}

  //           {item.quest_active == 2 && item.recipient_to_open == 1 && item.author_to_open == 0 &&<View
  //             style={{ alignSelf: 'center', marginVertical: 20, borderRadius: 100, backgroundColor: 'purple' } }
  //           > 
  //             <Text
  //               style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15 }}
  //             >Ждем решения пользователя об открытии чата</Text>
  //           </View>}
  //           {item.quest_active == 2 && item.author_to_open == 1 && item.recipient_to_open == 1 &&<View
  //             style={{ alignSelf: 'center', marginVertical: 20, borderRadius: 100, backgroundColor: '#3caa3c' } }
  //           > 
  //             <Text
  //               style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15 }}
  //             >Вы открыли чат!</Text>
  //           </View>}
  //         {(a == 1 && item.id != data[0].id) && <Text style={styles.dateStyleMessages}>{format(message_date, 'dd MMM yyyy')}</Text>}
  //           {item.is_liked != 0 && <View
  //             style={[{ alignSelf: 'center', marginTop: 20, borderRadius: 100, backgroundColor: 'green' }]}
  //           >
  //             <Text
  //               style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, fontFamily: 'RobotoRegular' }}
  //             >{item.is_liked == 1 ? 'Ответ собеседника вас устроил' : item.is_liked == 2 ? 'Вы не довольны ответом' : item.is_liked == 3 ? 'Ответ вас развеселил' : item.is_liked == 4 ? 'Вам понравился ответ собеседника' : 'Вас стошнило'}</Text> 
  //           </View>}
  //         </Animated.View>
  //     ) 
  //      }
  //      else {
  //       return(
  //         <Animated.View
  //         style={{transform: [{ translateY: item.id > messageId ? rendAnim : 0}], opacity: item.id > messageId ? opacityAnim : 1}}
  //         >
  //           {(item.id == data[data.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
  //         <View style={{justifyContent: "center", alignItems:'center', backgroundColor: 'transparent'}}>
  //             <View style={[(index < data.length - 1) &&
  //             data[index + 1].author == item.author &&
  //             format(message_pubD, 'dd MM yyyy') == format(prevMesDate, 'dd MM yyyy') &&
  //             {borderTopLeftRadius: 5}, {margin:5, marginVertical: 20, width:'90%', borderRadius: 25, backgroundColor: "#464E79",
  //           shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}]}>
  //                 <View style={{ justifyContent: 'flex-end', alignItems: 'flex-start' }}>
  //                   <View
  //                     style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 }}
  //                   >
  //                     <QuestionIcon width={30} height={30} />
  //                     <Text
  //                       style={{ 
  //                         fontSize: 18, textAlign: 'left', marginLeft: 5,
  //                         color: "#fff", fontFamily: 'RobotoBold'
  //                       }}
  //                       >Вопрос #{item.quest_number}</Text>
  //                   </View>
  //                   <Text style = {{
  //                     fontSize: 15, padding: 20, paddingTop: 10,
  //                     textAlign: 'left', color: "#fff",
  //                     fontFamily: 'RobotoRegular', lineHeight: 20
  //                   }}>{item.text}</Text>
  //                 </View>
  //             </View>
  //         </View>
  //         <View
  //             style={[{ alignSelf: 'center', marginBottom: 20, borderRadius: 100, backgroundColor: '#fff' }]}
  //           >
  //             <Text
  //               style={{ color: '#000', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, fontFamily: 'RobotoRegular' }}
  //             >{item.reciever != gameData.my_id ? 'Отвечает собеседник' : 'Ваша очередь отвечать'}</Text> 
  //         </View>
  //         {(a == 1 && item.id != data[0].id) && <Text style={styles.dateStyleMessages}>{format(message_date, 'dd MMM yyyy')}</Text>}
  //         </Animated.View>
  //     ) 
  //      }
  // }, [data])

  const keyExtractor = useCallback((item, index) => index.toString(), [])

  return (
    <View
        style={{ flex: 1, backgroundColor: '#172136' }}
    >
      
        <View style={{ height: headerHeight, backgroundColor: '#0F1826', 
            alignItems: 'flex-end', paddingBottom: 10, flexDirection: 'row', width: '100%', zIndex: 10000 }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                      props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Alfred and fan girl' : 'Альфред и фанатки'}</Text>
                </View>
                <TouchableOpacity
                onPress={() => {
                  setInstruction(true)
                }}
                style={{ width: '20%', alignItems: 'center', justifyContent: 'flex-end' }}
                activeOpacity={0.8}
            >
              <View
                style={{ width: 30, height: 30, backgroundColor: '#fff', justifyContent: 'center', borderRadius: 100 }}
              >
              <Text style={{ fontSize: 23, fontWeight: '500', color: '#007AFF', textAlign: 'center',
                 }}>?</Text>
              </View>
                
            </TouchableOpacity>
            </View>
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
        {!queue && !loading && !converseActive && <View
        style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}
        >
          <View
            style={{ height: SCREEN_HEIGHT/ 4 }}
          >
            <Image
              source={diceIcon}
              style={{ height: '100%'}}
              resizeMode='contain'
            />
          </View>
          <View
            style={{ paddingHorizontal: 10 }}
          >
            <Text
              style={{ color: '#fff', fontSize: 24, fontFamily: 'SftBold', textAlign: 'center', marginVertical: 10 }}
            >{language == 'English' ? 'Choose your bet' :
             'Выберите ставку на игру'}</Text>
            <Text
              style={{ color: '#B6BDC2', textAlign: 'center', fontSize: 13, fontFamily: 'SftMedium' }}
            >{language == 'English' ? "Your rating points serve as your wager in the game. Choose how many points you'd like to bet" :
             'Очки вашего рейтинга используются в качестве ставки на игру. Выберите количество рейтинга, которое хотите поставить'}</Text>
          </View>
          <View
            style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap', marginTop: 20 }}
          >
            <View
              style={{ width: '50%', padding: 10 }}
            >
              <TouchableOpacity
                style={[{ width: '100%', paddingVertical: 25, borderRadius: 15 }, ratingBet == 100 ? {backgroundColor: '#6083FF'} : {backgroundColor: '#0F1826'}]}
                activeOpacity={0.6}
                onPress={() => {
                  setRatingBet(100)
                }}
              >
                <Text
                  style={{ color: '#fff', width: '100%', textAlign: 'center', fontSize: 20, fontFamily: 'SftBold' }}
                >100</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{ width: '50%', padding: 10 }}
            >
              <TouchableOpacity
                style={[{ width: '100%', paddingVertical: 25, borderRadius: 15 }, ratingBet == 500 ? {backgroundColor: '#6083FF'} : {backgroundColor: '#0F1826'}]}
                activeOpacity={0.6}
                onPress={() => {
                  setRatingBet(500)
                }}
              >
                <Text
                  style={{ color: '#fff', width: '100%', textAlign: 'center', fontSize: 20, fontFamily: 'SftBold' }}
                >500</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{ width: '50%', padding: 10 }}
            >
              <TouchableOpacity
                style={[{ width: '100%', paddingVertical: 25, borderRadius: 15 }, ratingBet == 1000 ? {backgroundColor: '#6083FF'} : {backgroundColor: '#0F1826'}]}
                activeOpacity={0.6}
                onPress={() => {
                  setRatingBet(1000)
                }}
              >
                <Text
                  style={{ color: '#fff', width: '100%', textAlign: 'center', fontSize: 20, fontFamily: 'SftBold' }}
                >1000</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{ width: '50%', padding: 10 }}
            >
              <TouchableOpacity
                style={[{ width: '100%', paddingVertical: 25, borderRadius: 15 }, ratingBet == 10000 ? {backgroundColor: '#6083FF'} : {backgroundColor: '#0F1826'}]}
                activeOpacity={0.6}
                onPress={() => {
                  setRatingBet(10000)
                }}
              >
                <Text
                  style={{ color: '#fff', width: '100%', textAlign: 'center', fontSize: 20, fontFamily: 'SftBold' }}
                >10000</Text>
              </TouchableOpacity>
            </View>
          </View>
            {/* <View
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
                bottom: -16, }}
            >Тема разговора</Animated.Text>
            <Animated.Text
              style={{ opacity: textOpacity, color: '#fff', position: 'absolute',
              bottom: -40, fontSize: 18, width: width, textAlign: 'center' }}
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
          let activeSlide = Math.floor((e.nativeEvent.contentOffset.x + (width - ITEM_WIDTH) / 2) / ITEM_WIDTH)
          setActiveTheme(activeSlide)
        }}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
      />
      
      </View> */}
      {/* <View
        style={{ marginTop: 20 }}
      >
        <Text
          style={{ color: '#6D7885', fontSize: 16, textAlign: 'center' }}
        >Пол</Text>
        <View
          style={{ justifyContent: 'flex-start', alignItems: 'stretch', marginTop: 10, marginHorizontal: 10 }}
        >
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 17, width: '100%'}}
            activeOpacity={0.6}
            onPress={() => {
                setCheckMale(false)
                setCheckFemale(false)
                setCheckAll(true)
                setGender('all')
            }}
          >
          <Text style={{ fontSize: 17, color: '#fff', fontFamily: language == 'English' ? 'RobotoRegular' : 'RobotoLight' }}>{language == 'English' ? 'All' : 'Любой'}</Text>
          <CheckBox size={27} color='#B8C1CC' selectedColor='#2688EB'
            selected={checkAll}
            textStyle={{ width: 0 }}
            onPress={() => {
                setCheckMale(false)
                setCheckFemale(false)
                setCheckAll(true)
                setGender('all')
            }}
          /> 
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 17, width: '100%' }}
          activeOpacity={0.6}
            onPress={() => {
              setCheckMale(true)
              setCheckFemale(false)
              setCheckAll(false)
              setGender('male')
            }}
          >
          
          <Text style={{ fontSize: 17, color: '#fff', fontFamily: language == 'English' ? 'RobotoRegular' : 'RobotoLight' }}>{language == 'English' ? 'Male' : 'Мужчины'}</Text>
          <CheckBox size={27} color='#B8C1CC' selectedColor='#2688EB'
            selected={checkMale}
            textStyle={{ width: 0 }}
            onPress={() => {
                setCheckMale(true)
                setCheckFemale(false)
                setCheckAll(false)
                setGender('male')
            }}
          /> 
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 17, width: '100%' }}
            activeOpacity={0.6}
            onPress={() => {
                setCheckMale(false)
                setCheckFemale(true)
                setCheckAll(false)
                setGender('female')
            }}
          >
           
          <Text style={{ fontSize: 17, color: '#fff', fontFamily: language == 'English' ? 'RobotoRegular' : 'RobotoLight' }}>{language == 'English' ? 'Female' : 'Женщины'}</Text>
          <CheckBox size={27} color='#B8C1CC' selectedColor='#2688EB'
            selected={checkFemale}
            textStyle={{ width: 0 }}
            onPress={() => {
                setCheckMale(false)
                setCheckFemale(true)
                setCheckAll(false)
                setGender('female')
            }}
          />
          </TouchableOpacity>
          </View>
          <View
            style={{ height: 20, marginTop: 65 }}
          >
          <RangeSlider
            sliderWidth={width - 40}
            min={18} max={60}
            step={1}
            startPos={18}
            endPos={30}
            labelAlign='center'
            labelColor='#6D7885'
            labelFSZ={16}
            onValueChange={(range) => {
              setAgeFrom(range.min)
              setAgeTo(range.max)
            }} />

          </View>
      </View> */}
      <View
        style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 20, width: '100%' }}
      >
            <TouchableOpacity
                style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 25, margin: 10, marginVertical: 18,
                shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
                Platform.OS === 'android' && {elevation: 2}]}
                activeOpacity={0.8}
                onPress={() => {
                    loadQueue()
                }}
            >
                <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Find game' : 'Найти игру'}</Text>
            </TouchableOpacity>
      </View>
        </View>}

        {queue && !loading && !converseActive && <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}
        >
            <Text
                style={{ textAlign: 'center', color: '#fff', fontSize: 22, fontFamily: 'SftBold' }}
            >{language == 'English' ? "You've been added to the queue!" :
             'Вы добавлены в очередь!'}</Text>
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




    {converseActive && <View style={{flex:1, zIndex:1, backgroundColor: '#172136'}}>
    {!data ? <ActivityIndicator
      style={{ height: '100%', width: '100%', position: 'absolute' }}
      size='small'
    /> : <KeyboardAvoidingView
     style={{flex: 1}}
     behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
     keyboardVerticalOffset={Platform.OS === 'ios' ? 75 : -1000}
    >
    
    {/* <FlatList
        data={data}
        renderItem = {renderData}
        inverted = {true}
        keyExtractor = {keyExtractor}
        // initialNumToRender = {data.length}
        windowSize = {data.length > 0 ? data.length : 30}
        ListFooterComponent = {renderLoader}
        onEndReached={LoadMoreItem}
        onEndReachedThreshold={0.8}
        removeClippedSubviews={true}
        style={{ paddingTop: 20 }}
        /> */}
        </KeyboardAvoidingView>}
        {gameAlfred && <View
      style={{ width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}
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
                setModalExit(true)
              }}
            >
              <ExitIcon width={30} height={30} />
            </TouchableOpacity>
            </View>
            {gameAlfred && <Text
              style={{ color: '#fff', fontSize: 25, marginTop: 10, textAlign: 'left', width: '100%', paddingHorizontal: 10, fontFamily: 'SftMedium' }}
            >{gameData.defender == gameData.my_id ? language == 'English' ? 'Defend Alfred!' : 'Защищайте Альфреда!' : language == 'English' ? 'Attack Alfred!' : 'Атакуйте Альфреда!'}</Text>}
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
                style={[{ width: 10, height: 10, borderRadius: 100, margin: 5 }, (gameData.game_round == 1 && gameData.round_one_w == 0) ? {backgroundColor: '#fff'} : gameData.round_one_w == 0 ? {backgroundColor: '#415562'} : gameData.round_one_w != gameData.my_id ? {backgroundColor: '#FF2525'} : {backgroundColor: '#65B141'}]}
              />
              <View
                style={[{ width: 10, height: 10, borderRadius: 100, margin: 5 }, gameData.game_round == 2 && gameData.round_two_w == 0 ? {backgroundColor: '#fff'} : gameData.round_two_w == 0 ? {backgroundColor: '#415562'} : gameData.round_two_w != gameData.my_id ? {backgroundColor: '#FF2525'} : {backgroundColor: '#65B141'}]}
              />
              <View
                style={[{ width: 10, height: 10, borderRadius: 100, margin: 5 }, gameData.game_round == 3 && gameData.round_three_w == 0 ? {backgroundColor: '#fff'} : gameData.round_three_w == 0 ? {backgroundColor: '#415562'} : gameData.round_three_w != gameData.my_id ? {backgroundColor: '#FF2525'} : {backgroundColor: '#65B141'}]}
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
              {gameData.defender == gameData.my_id ? gameData.game_ended_defender == true && <BlurView
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
              style={{ position: 'absolute', bottom: 0, zIndex: 10, width: '100%', paddingVertical: 20, overflow: 'hidden' }}
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
            {gameData.defender == gameData.my_id ? <View
              style={{ height: SCREEN_WIDTH / 3.5, width: SCREEN_WIDTH }}
            >
              {gameData.round_ended < 3 ? (!gameData.defended ? <View
              style={{ height: '100%', width: '100%', backgroundColor: '#172136', flexDirection: 'row' }}
              >
              {!animAlfredOn && <TouchableOpacity
                style={{ width: SCREEN_WIDTH / 2, height: '100%', justifyContent: 'center', alignItems: 'center' }}
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
                  numberOfLines={1}
                  style={[{ color: '#fff', textAlign: 'center', fontFamily: 'SftMedium',
                  paddingVertical: 10, paddingHorizontal: 15, backgroundColor: 'rgba(255, 255, 255, 0.12)' }, language == 'English' ? {fontSize: 17} : {fontSize: 20}]}
                >{language == 'English' ? "Waiting for your opponent's move... " : 'Ждем ход соперника... '}<Text
                  style={{ fontSize: 15, color: '#B6BDC2' }}
                >{Math.floor((new Date(gameData.time_left) - nowDate) / (1000 * 60 * 60)) < 10 && '0'}{Math.floor((new Date(gameData.time_left) - nowDate) / (1000 * 60 * 60)) >= 0 ? Math.floor((new Date(gameData.time_left) - nowDate) / (1000 * 60 * 60)) : '0'}:{(Math.floor(((new Date(gameData.time_left) - nowDate) / (1000 * 60)) % 60) < 10 || Math.floor((new Date(gameData.time_left) - nowDate) / (1000 * 60 * 60)) < 0) && '0'}{Math.floor((new Date(gameData.time_left) - nowDate) / (1000 * 60 * 60)) >= 0 ? Math.floor(((new Date(gameData.time_left) - nowDate) / (1000 * 60)) % 60) : '0'}</Text></Text>
              </View>) :
              <View
                style={{ alignSelf: 'center', borderRadius: 100, overflow: 'hidden', marginVertical: 30 }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontFamily: 'SftMedium',
                  paddingVertical: 10, paddingHorizontal: 15, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
                >{language == 'English' ? 'Game over' : 'Игра завершена'}</Text> 
              </View>}
            </View> : <View
              style={{ height: SCREEN_WIDTH / 3.5, width: SCREEN_WIDTH }}
            >
              {gameData.round_ended < 3 ? (!gameData.attacked ? <View
              style={{ height: '100%', width: '100%', backgroundColor: '#172136', flexDirection: 'row' }}
              >
              {!animAlfredOn && <TouchableOpacity
                style={{ width: SCREEN_WIDTH / 2, height: '100%', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  gameAlfredAction('left')
                  setAnimAlfredOn(true)
                }}
              >
                <View
                  style={[{ paddingVertical: 15, minWidth: SCREEN_WIDTH / 3, paddingHorizontal: 20, borderRadius: 15, borderWidth: 1, borderColor: '#90A9FF', justifyContent: 'center',
                           shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 3 },
                           Platform.OS === 'android' && {elevation: 0, backgroundColor: '#172136'}]}
                >
                  <Text
                    style={{ textAlign: 'center', color: '#fff', fontFamily: 'SftMedium' }}
                  >{language == 'English' ? 'Left Slap' : 'Левая Пощечина'}</Text>
                </View>
              </TouchableOpacity>}
              {!animAlfredOn && <TouchableOpacity
                style={{ width: SCREEN_WIDTH / 2, height: '100%', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  gameAlfredAction('right')
                  setAnimAlfredOn(true)
                }}
              >
              <View
                  style={[{ paddingVertical: 15, minWidth: SCREEN_WIDTH / 3, paddingHorizontal: 20, borderRadius: 15, borderWidth: 1, borderColor: '#90A9FF', justifyContent: 'center',
                           shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 3 },
                           Platform.OS === 'android' && {elevation: 0, backgroundColor: '#172136'}]}
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
                  style={[{ color: '#fff', fontSize: 20, textAlign: 'center',
                  paddingVertical: 10, paddingHorizontal: 15, backgroundColor: 'rgba(255, 255, 255, 0.12)' }, language == 'English' ? {fontSize: 17} : {fontSize: 20}]}
                >{language == 'English' ? "Waiting for your opponent's move... " : 'Ждем ход соперника... '}<Text
                style={{ fontSize: 15, color: '#B6BDC2' }}
              >{Math.floor((new Date(gameData.time_left) - nowDate) / (1000 * 60 * 60)) < 10 && '0'}{Math.floor((new Date(gameData.time_left) - nowDate) / (1000 * 60 * 60)) >= 0 ? Math.floor((new Date(gameData.time_left) - nowDate) / (1000 * 60 * 60)) : '0'}:{(Math.floor(((new Date(gameData.time_left) - nowDate) / (1000 * 60)) % 60) < 10 || Math.floor((new Date(gameData.time_left) - nowDate) / (1000 * 60 * 60)) < 0) && '0'}{Math.floor((new Date(gameData.time_left) - nowDate) / (1000 * 60 * 60)) >= 0 ? Math.floor(((new Date(gameData.time_left) - nowDate) / (1000 * 60)) % 60) : '0'}</Text></Text>
              </View>) :
              <View
              style={{ alignSelf: 'center', borderRadius: 100, overflow: 'hidden', marginVertical: 30 }}
            >
              <Text
                style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontFamily: 'SftMedium',
                         paddingVertical: 10, paddingHorizontal: 15, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
              >{language == 'English' ? 'Game over' : 'Игра завершена'}</Text> 
            </View>}
            </View> 
            }
          </View>
          </View>
          </View>
    </View>}
    </View>}
    <Modal
        transparent={true}
        animationType='fade'
        visible={modalErr}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setModalErr(false)
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.9,
            position:'absolute',
            left: 0,
            zIndex: 0
          }}
          activeOpacity={0.9}
          >
          </TouchableOpacity>
          <View style={{
            backgroundColor: '#172136',
            borderRadius: 16,
            width: '90%',
            justifyContent: 'flex-end',
            overflow:'hidden',
          }}>
          <View
            style={{ justifyContent: 'center', backgroundColor: "#172136",  }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalErr(false)
            }}
          />
            <Text
                style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', marginTop: 35 }}
              >{language == 'English' ? 'Not enough rating!' : 'Не достаточно рейтинга!'}</Text>
            <View style={{
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20,
              flexWrap: 'wrap', paddingHorizontal: 5
            }}>
              <Text
                style={{ textAlign: 'center', fontSize: 17, color: '#818C99', fontFamily: 'SftMedium' }}
              >{errorText}</Text>
            </View>
            
          </View>
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginTop: 18, width: '80%',
            marginBottom: 35, alignSelf: 'center', shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalErr(false)
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Close' : 'Закрыть'}</Text>
          </TouchableOpacity>
          </View>
        </View>
        </Modal>

        <Modal
        transparent={true}
        animationType='fade'
        visible={modalExit}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setModalExit(false)
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.9,
            position:'absolute',
            left: 0,
            zIndex: 0
          }}
          activeOpacity={0.9}
          >
          </TouchableOpacity>
          <View style={{
            backgroundColor: '#172136',
            borderRadius: 16,
            width: '90%',
            justifyContent: 'flex-end',
            overflow:'hidden',
            paddingHorizontal: 10
          }}>
          <View
            style={{ justifyContent: 'center', backgroundColor: "#172136",  }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalExit(false)
            }}
          />
            <Text
                style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', marginTop: 35 }}
              >{language == 'English' ? 'Exit game' : 'Выйти из игры?'}</Text>
            <View style={{
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20,
              flexWrap: 'wrap', paddingHorizontal: 5
            }}>
              {gameData.game_round < 3 && ((new Date(gameData.time_left)) - nowDate) > 0 && <Text
                style={{ textAlign: 'center', fontSize: 17, color: '#818C99', fontFamily: 'SftMedium' }}
              >{language == 'English' ? "Are you sure you want to exit the game?" :
               'Вы действительно хотите выйти из игры?'}</Text>}
              {((new Date(gameData.time_left)) - nowDate > 0) ? (gameData.defender == gameData.my_id) ? <Text
                style={{ textAlign: 'center', fontSize: 17, marginTop: 15, color: '#818C99', fontFamily: 'SftMedium' }}
              >{gameData.points_defender > 1 ? language == 'English' ? `You ${gameData.round_ended < 3 ? "will get" : "got"} ${gameData.rating_bet} rating points.` : `Вы получи${gameData.round_ended < 3 ? "те" : "ли"} ${gameData.rating_bet} рейтинга` : language == 'English' ? `You ${gameData.round_ended < 3 ? "will loose" : "loose"} ${gameData.rating_bet} rating points` : `Вы потеря${gameData.round_ended < 3 ? "ете" : "ли"} ${gameData.rating_bet} рейтинга`}</Text>: <Text
              style={{ textAlign: 'center', fontSize: 17, marginTop: 15, color: '#818C99', fontFamily: 'SftMedium' }}
            >{gameData.points_enemy > 1 ? language == 'English' ? `You ${gameData.round_ended < 3 ? "will get" : "got"} ${gameData.rating_bet} rating points.` : `Вы получи${gameData.round_ended < 3 ? "те" : "ли"} ${gameData.rating_bet} рейтинга` : language == 'English' ? `You ${gameData.round_ended < 3 ? "will loose" : "loose"} ${gameData.rating_bet} rating points` : `Вы потеря${gameData.round_ended < 3 ? "ете" : "ли"} ${gameData.rating_bet} рейтинга`}</Text> :
            gameData.defender == gameData.my_id ? gameData.defended == true ?<Text
              style={{ textAlign: 'center', fontSize: 17, marginTop: 15, color: '#818C99', fontFamily: 'SftMedium' }}  
            >{language == 'English' ? `Your opponent didn't make their move within the allotted time. You will receive ${gameData.rating_bet} rating points` :
               `Соперник не сделал ход за отведенное время. Вы получите ${gameData.rating_bet} рейтинга`}</Text> :
            <Text
              style={{ textAlign: 'center', fontSize: 17, marginTop: 15, color: '#818C99', fontFamily: 'SftMedium' }}  
            >{language == 'English' ? `Are you sure you want to exit the game? You will lose ${gameData.rating_bet} rating points.` :
               `Вы действительно хотите выйти из игры? Вы потеряете ${gameData.rating_bet} рейтинга`}</Text>:
            gameData.attacked == true ? <Text
              style={{ textAlign: 'center', fontSize: 17, marginTop: 15, color: '#818C99', fontFamily: 'SftMedium' }}  
            >{language == 'English' ? `Your opponent didn't make their move within the allotted time. You will receive ${gameData.rating_bet} rating points` :
            `Соперник не сделал ход за отведенное время. Вы получите ${gameData.rating_bet} рейтинга`}</Text> : 
            <Text
              style={{ textAlign: 'center', fontSize: 17, marginTop: 15, color: '#818C99', fontFamily: 'SftMedium' }}  
            >{language == 'English' ? `Are you sure you want to exit the game? You will lose ${gameData.rating_bet} rating points.` :
            `Вы действительно хотите выйти из игры? Вы потеряете ${gameData.rating_bet} рейтинга`}</Text>}
            </View>
            
          </View>
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginTop: 18, width: '80%',
            marginBottom: 35, alignSelf: 'center', shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              endGame()
              setModalExit(false)
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Exit' : 'Выйти'}</Text>
          </TouchableOpacity>
          </View>
        </View>
        </Modal>

        <Modal
        transparent={true}
        animationType='fade'
        visible={instruction}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <View style={{
            width: '100%',
            minHeight: '100%',
            justifyContent: 'center',
            overflow:'hidden'
          }}>
          <View style={{ height: headerHeight, backgroundColor: '#0F1826', 
            alignItems: 'flex-end', paddingBottom: 10, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                      setInstruction(false)
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Manual' : 'Инструкция'}</Text>
                </View>
            </View>
          <ScrollView
            style={{ flex: 1, backgroundColor: '#172136' }}
            contentContainerStyle={{ paddingVertical: 40 }}
          >
            {/* {renderCardsDescription()} */}
            <View
              style={{ flexDirection: 'row', paddingHorizontal: 10 }}
            >
              <View
                style={{ width: '100%' }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 25, fontFamily: 'SftBold' }}
                >{language == 'English' ? 'Plot.' :
                 'Сюжет.'}</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'In the story, Alfred is a prominent figure, popular with the ladies. One of his fan girls, angered by his lack of reciprocal interest, decides to teach the scoundrel a lesson with a couple of well-deserved slaps.' :
                 'По сюжету Альфред - видная персона. Популярен у девушек. Одна из его поклонниц, разгневанная тем, что Альфред не проявляет к ней взаимного интереса, решает проучить подонка парой хороших пощечин.'}</Text>
              </View>
            </View>
            
            <View
              style={{ width: SCREEN_WIDTH - 20, height: 1, backgroundColor: '#243A4A', alignSelf: 'center', marginVertical: 30 }}
            />
            <View
                style={{ width: '100%', paddingHorizontal: 10 }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 25, fontFamily: 'SftBold' }}
                >{language == 'English' ? 'Gameplay' :
                 'Геймплей.'}</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'This is a rating-based game played against a random opponent.' :
                 'Это игра на рейтинг со случайным пользователем.'}</Text>
              </View>
            <View
              style={{ flexDirection: 'row', paddingHorizontal: 10, marginTop: 20 }}
            >
              <View
                style={{ width: '50%' }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 25, fontFamily: 'SftBold' }}
                >1.</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? "Choose how many of your rating points you'd like to wager." :
                 'Выберите количество своего рейтинга, которое вы хотите поставить.'}</Text>
                 <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'After clicking the "Find Game" button, the system will search for a player with the same bet.' :
                 'После нажатия кнопки "Найти игру" начнется поиск пользователя с такой же ставкой.'}</Text>
              </View>
              <View
                style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
              >
                <Image
                  style={{ width: (SCREEN_WIDTH / 2) * 0.8, height: (SCREEN_WIDTH / 2) * 0.8 * 1.86, borderRadius: 10 }}
                  source={language == 'English' ? require('../images/alfred/manual/alfred_manual_start_eng.jpg') :
                    require('../images/alfred/manual/alfred_manual_start.jpg')}
                />
              </View>
            </View>
            <View
              style={{ width: SCREEN_WIDTH - 20, height: 1, backgroundColor: '#243A4A', alignSelf: 'center', marginVertical: 30 }}
            />
            <View
                style={{ width: '100%', paddingHorizontal: 10 }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 25, fontFamily: 'SftBold' }}
                >2.</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'Once the game starts, player roles are randomly assigned.' :
                 'После начала игры случайным образом выбираются роли игроков.'}</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? "One player becomes the attacker (Alfred's fan girl), and the other becomes the defender." :
                 'Один выступает в роли атакующего (той самой фанатки), другой - в роли защищающегося.'}</Text>
              </View>
            <View
              style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 20 }}
            >
              <View
                style={{ width: '50%' }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? "The attacker's goal is to land at least two slaps." :
                 'Задача атакующего - пробить как минимум две пощечины.'}</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? "The defender's goal is to guess from which side the attacker will strike and dodge at least two slaps." :
                 'Задача защищающегося - угадать с какой стороны будет бить атакующий и уклониться хотя бы от двух пощечин.'}</Text>
              </View>
              <View
                style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
              >
                <Image
                  style={{ width: (SCREEN_WIDTH / 2) * 0.8, height: (SCREEN_WIDTH / 2) * 0.8 * 1.86 }}
                  source={language == 'English' ? require('../images/alfred/manual/alfred_manual_defender_eng.jpg') :
                    require('../images/alfred/manual/alfred_manual_defender.jpg')}
                />
              </View>
            </View>
            <View
              style={{ width: SCREEN_WIDTH - 20, height: 1, backgroundColor: '#243A4A', alignSelf: 'center', marginVertical: 30 }}
            />
            <View
              style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 20 }}
            >
              <View
                style={{ width: '50%' }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 25, fontFamily: 'SftBold' }}
                >3.</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? "The winner is decided based on victories over three rounds." :
                 'Победитель определяется исходя из побед в 3-х раундах.'}</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? "The winner gains the amount of rating points wagered" :
                 'Победителю начисляется количество рейтинга, которое было поставлено.'}</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? "The loser loses the same amount." :
                 'У проигравшего наборот - рейтинг отнимается.'}</Text>
              </View>
              <View
                style={{ width: '50%', justifyContent: 'flex-start', alignItems: 'center' }}
              >
                <Image
                  style={{ width: (SCREEN_WIDTH / 2) * 0.8, height: (SCREEN_WIDTH / 2) * 0.8 * 1.86 }}
                  source={language == 'English' ? require('../images/alfred/manual/alfred_manual_win_eng.jpg') :
                    require('../images/alfred/manual/alfred_manual_win.jpg')}
                />
              </View>
            </View>
            <View
              style={{ width: SCREEN_WIDTH - 20, height: 1, backgroundColor: '#243A4A', alignSelf: 'center', marginVertical: 30 }}
            />
            <View
              style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 20 }}
            >
              <View
                style={{ width: '50%' }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 25, fontFamily: 'SftBold' }}
                >4.</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? "Each player has 24 hours to make their move." :
                 'Время на один ход у каждого игрока - 24 часа.'}</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? "If your opponent fails to act within the allotted time and has won fewer than two rounds, you can exit the game and automatically claim their rating points." :
                 'Если ваш соперник не успевает сделать ход за отведенное время, и количество выигранных им раундов меньше двух, то вы можете выйти из игры, автоматически забрав рейтинг соперника.'}</Text>
              </View>
              <View
                style={{ width: '50%', justifyContent: 'flex-start', alignItems: 'center' }}
              >
                <Image
                  style={{ width: (SCREEN_WIDTH / 2) * 0.8, height: (SCREEN_WIDTH / 2) * 0.8 * 1.86 }}
                  source={language == 'English' ? require('../images/alfred/manual/alfred_manual_time_eng.jpg') :
                    require('../images/alfred/manual/alfred_manual_time.jpg')}
                />
              </View>
            </View>
          </ScrollView>
          </View>
          
        </View>
    </Modal>
    </View>
    
  )
}

export default AlfredRating