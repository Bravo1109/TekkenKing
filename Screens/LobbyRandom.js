import { View, Text, TouchableOpacity, KeyboardAvoidingView, 
    FlatList, Platform, ActivityIndicator, TextInput, StyleSheet,
    Image, Animated, Dimensions, Modal, ScrollView } from 'react-native'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import ArrowLeft from '../images/turnBack.svg';
import {IconButton, Button} from 'react-native-paper';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import moment from 'moment';
import CheckBox from './CheckBox';
import RangeSlider from './RangeSlider';
import { BASE_URL } from './config';
import SendIcon from '../images/sendIcon.svg'
import QuestionIcon from '../images/question.svg'
import Heart from '../images/like.svg'
import Close from '../images/close.svg'
import ExitIcon from '../images/alfred/exitGame.svg'
import LottieView from 'lottie-react-native';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.35; // ширина центрального слайда
const SPACER_ITEM_SIZE = (width - ITEM_WIDTH) / 2; // ширина пространства по бокам

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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

const LobbyRandom = (props) => {
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
  const [messageId, setMessageId] = useState(0)
  const SCREEN_HEIGHT = Dimensions.get('window').height
  const flatListRef = useRef(null);
  const onMomentumScrollEnd = (e) => {
    let activeIndex = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
    if (activeIndex === images.length) {
      flatListRef.current.scrollToIndex({ index: 0, animated: false });
    } else if (activeIndex === -1) {
      flatListRef.current.scrollToIndex({ index: images.length - 1, animated: false });
    }
  };
  const [localId, setLocalId] = useState(0)
  const [gender, setGender] = useState('all')
  const [checkMale, setCheckMale] = useState(gender == 'male')
  const [checkFemale, setCheckFemale] = useState(gender == 'female')
  const [checkAll, setCheckAll] = useState(gender == 'all')
  const [ageFrom, setAgeFrom] = useState(18)
  const [ageTo, setAgeTo] = useState(30)
  const [instruction, setInstruction] = useState(false)
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeTheme, setActiveTheme] = useState(0)
  const [language, setLanguage] = useState('')
  const isFocused = useIsFocused();
  const timerRef = useRef(null);
  const timerQueueRef = useRef(null);
  const [checkMes, setCheckMes] = useState(0)
  const [dialogId, setDialogId] = useState(0)
  const [modalExit, setModalExit] = useState(false)
  const [modalUserLeft, setModalUserLeft] = useState(false)
  const [dialogFound, setDialogFound] = useState(false)
  const [lastMesDate, setLastMesDate] = useState()
  const [lastChangeDate, setLastChangeDate] = useState('2023-12-02T19:28:25.869874Z')
  const [converseActive, setConverseActive] = useState(false)
  const [queue, setQueue] = useState(false)
  const [nextPageIsNull, setNextPageIsNull] = useState(true)
  const token = getTokenData()
  const [myId, setMyId] = useState(0)
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  let pubId = 0
  const [data, setData] = useState([])
  const [localData, setLocalData] = useState([])
  const [combinedData, setCombinedData] = useState([])
  const [text, setText] = useState("")
  const textInput = useRef()
  const [loading, setLoading] = useState(false)
  const [loadingReaction, setLoadingReaction] = useState(false)
  
  const [modalOpened, setModalOpened] = useState(false)
  const translateY = useRef(new Animated.Value(30)).current;
  const opacityModalOpened = useRef(new Animated.Value(0)).current
  const opacityImage = useRef(new Animated.Value(0)).current
  const opacityTextModalOpened = useRef(new Animated.Value(0)).current
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
      combinedData.length > 0 && setMessageId(combinedData[0].id)
    })
  }

  useEffect(() => {
    rendAnim.setValue(10)
    opacityAnim.setValue(0)
    animateRender()
    console.log('animanimanim')
  }, [combinedData])

  const loadQueue = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/lobby/${ageFrom}/${ageTo}/${gender}/${images[activeTheme].quest}/lobby_adding/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
        if (res.queue == 0) {
            setQueue(true)
            setLoading(false)
        } else {
            loadDialog()
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
    fetch(`${BASE_URL}/api/chats/?search=1`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (res.results.length > 0) {
        setDialogId(res.results[0].id)
        setUsers([res.results[0].users[0]])
        if (res.results[0].users.length == 0) {
          setModalUserLeft(true)
        }
        setLastChangeDate(res.results[0].last_change)
        loadDialogData(res.results[0].id)
      } else {
        lobbyAdded()
      }
    })
    .catch(error => {
      console.log("Error load data", error)
      setLoading(false)
    })
  }

  const exitChat = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/rndcht_ext/${dialogId}/chat_exit/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
  }

  const lobbyAdded = () => {
    clearTimeout(timerQueueRef.current)
    fetch(`${BASE_URL}/api/lobby/${ageFrom}/${ageTo}/${gender}/${images[activeTheme].quest}/lobby_added/`, {
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

  const finishSearch = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/lobby/${ageFrom}/${ageTo}/${gender}/${images[activeTheme].quest}/lobby_exit/`, {
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

  const likeMessage = (type) => {
    const itemId = data[0].id
    setLoadingReaction(true)
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

  const sendMessage = (mId) => {
    let status = 0
    
    if (combinedData[0].quest_active == 0 || combinedData[0].quest_active == 2 && (combinedData[0].author_to_open == 1 && combinedData[0].recipient_to_open == 1) || combinedData[0].author != myId && combinedData[0].is_liked != 0 && combinedData[0].quest_active == 1|| combinedData[0].author == 2 && combinedData[0].reciever == myId) {
      let message = {
        "id": mId,
        "text": text.trim(),
        "author": myId,
        "reciever": users[0].id,
        "is_read": false,
        "quest_active": (combinedData.length > 0 && (combinedData[0].quest_active == 2 ? 3 : combinedData[0].quest_active == 3 ? 0 : combinedData[0].quest_active)),
        "recipient_to_open": 0,
        "author_to_open": 0,
        "is_liked": 0,
        "type": 0,
        "quest_number": 0,
        "local": true,
        "came": false,
        "pub_date": new Date()
      }
      if (localData.length == 0 || message.pub_date != lastMesDate && localData[0] != undefined) {
        let newData = [...localData, ...[message]].filter((item, index, array) => {
          return array.findIndex(t => t.id === item.id) === index;
        });
        newData.unshift(...[message])
        localData.unshift(...[message])
        const uniqueData = [...newData].filter((item, index, array) => {
          return array.findIndex(t => t.id === item.id) === index;
        });
        setLocalData(uniqueData)
        
        setLastMesDate(message.pub_date)
        setLocalId(localId + 1)
        // setData(uniqueData);
      }
    fetch(`${BASE_URL}/api/chats/${dialogId}/messages/`, {
        method:"POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${token._j}`
        },
        body: JSON.stringify({
          text: text.trim()
        })
      }).then((resp) => {
        
        if(resp.status == 201 && text != '') {
          status = 201
          let obj = localData.findIndex(o => o.id === mId)
          console.log('objecttt', obj)
          localData[obj].came = true
          console.log(localData[obj])
          return resp.json()
        } else {
          let obj = localData.findIndex(o => o.id === mId)
          console.log('objecttt', obj)
          localData[obj].came = 2
          console.log(localData[obj])
        }
      }).then((resp) => {
        refreshDialogData()
        console.log("tokens", resp.tokens)
        if(status == 201 && text != '') {
          for (let i = 0; i < resp.tokens.length; i++) {
          // const element = tokens[i];
            // sendPushNotification(resp.tokens[i], users[0].id, 'New Message!', text, ('https://bravo511.pythonanywhere.com/media/' + resp.sender_photo), 0, 'ChatList')
          }
          console.log(resp)
        }
      }).catch(error => {
        console.log('errorvzdfvd', error)
        let obj = localData.findIndex(o => o.id === mId)
        console.log('objecttt', obj)
        localData[obj].came = 2
        console.log(localData[obj])
          setLoading(false)
      })
  } else if (data[0].quest_active == 2 && (data[0].author_to_open == 0 || data[0].recipient_to_open == 0)) {
    if (data[0].author == myId && data[0].author_to_open == 0 || data[0].author != myId && data[0].recipient_to_open == 0) {
      alert(language == 'English' ? 'You need to decide whether you want to open the chat with this user.' :
         'Вы должны решить, хотите ли открывать чат с этим пользователем')
    } else {
      alert(language == 'English' ? "The interlocutor hasn't made a decision about opening the chat yet."
         : 'Собеседник еще не решил хочет ли открыть чат')
    }
  } else if (data[0].author == 2 && data[0].reciever != myId) {
    alert(language == 'English' ? "It is now your companion's turn to answer the question." :
       'Сейчас очередь вашего собеседника отвечать на вопрос')
  }else if (data[0].author != 2 && data[0].author == myId) {
    alert(language == 'English' ? 'Wait for your companion to rate your answer.' :
       'Дождитесь, пока собеседник оценит ваш ответ')
  } else {
    alert(language == 'English' ? "First, you should rate your companion's answer." :
       'Сначала вы должны оценить ответ собеседника')
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
      console.log(data.length, res.next)
      setMyId(res.my_id)
      if (res.next == null) {
        setNextPageIsNull(true)
      }
      const uniqueData = [...data, ...res.results].filter((item, index, array) => {
        return array.findIndex(t => t.id === item.id) === index;
      });
      setData(uniqueData)
      setLocalId(res.results[0].id + 1)
      if (!lastMesDate) {
        setLastMesDate(lastChangeDate)
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
        const filteredData = localData.filter(item => !item.came);
        setLocalData(filteredData)
        setLocalId(res.results[0].id + 1)
        setData(uniqueData);
      }
      if (res.results.length > 0 && res.results[0].quest_active == 2 && res.results[0].author_to_open == 1 && res.results[0].recipient_to_open == 1 && !modalOpened) {
        setModalOpened(true)
        clearTimeout(timerRef.current)
      } else {
        reload()
      }
    }).then(() => {
      setLoading(false)
      setLoadingReaction(false)
    })
    .catch(error => {
      console.log("Error", error)
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
    setCombinedData(localData.concat(data))
  }, [data, localData])

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

  const renderData = useCallback(({item, index}) => {
    let a  = 0
    let prevMesDate = new Date(moment(item.pub_date).toISOString())
    if (index < data.length - 1) {
      prevMesDate = new Date(moment(data[index + 1].pub_date).toISOString())
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
    let message_pubD = new Date(moment(item.pub_date).toISOString())
    let message_date = new Date(mesDate)
    if (format(message_pubD, 'dd MMM yyy') != format(pubId, 'dd MMM yyy')) {
      pubId = message_pubD
      a = 1
    }
    if (users.length == 0) {
      return(
        <View>
          {(item.id == data[data.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
        <View style={{justifyContent: "flex-end", alignItems:'flex-end', backgroundColor: 'transparent'}}>
        <TouchableOpacity
          style={[(index < data.length - 1) &&
            format(message_pubD, 'dd MM yyyy') == format(prevMesDate, 'dd MM yyyy') &&
            {borderTopRightRadius: 5}, {margin:5, marginVertical: 2, maxWidth:'80%', borderRadius: 25, borderBottomRightRadius: 5, backgroundColor: "#2B4150",
          shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}]}
          delayLongPress={800}
          activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
              <Text style = {itemStyle.myCardStyle}>{item.text}</Text>
              <Text style={{ color: '#81848B', paddingBottom: 5, paddingRight: 5, fontSize: 12, marginLeft: 'auto' }}>{format(message_pubD, 'H:mm')}</Text>
            </View>
            
        </TouchableOpacity>
      </View>
      {(combinedData.length > 0 && a == 1 && item.id != combinedData[0].id) && <Text style={styles.dateStyleMessages}>{format(message_date, 'dd MMM yyyy')}</Text>}
      </View>
      )
    }
    if (item.author == myId && item.author != 2) {
        return(
          <Animated.View
          style={{transform: [{ translateY: item.id > messageId ? rendAnim : 0}], opacity: item.id > messageId ? opacityAnim : 1}}
          >
            {(item.id == data[data.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
          <View style={{justifyContent: "flex-end", alignItems:'flex-end', backgroundColor: 'transparent'}}>
          <TouchableOpacity
            style={[(index < data.length - 1) &&
              data[index + 1].author == item.author &&
              format(message_pubD, 'dd MM yyyy') == format(prevMesDate, 'dd MM yyyy') &&
              {borderTopRightRadius: 5}, {margin:5, marginVertical: 2, maxWidth:'80%', borderRadius: 25, borderBottomRightRadius: 5, backgroundColor: "#2B4150",
            shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}, item.local && {opacity: 0.7}]}
            delayLongPress={800}
            activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
              <Text style = {itemStyle.myCardStyle}>{item.text}</Text>
              {!item.local && <Text style={{ color: '#81848B', paddingBottom: 7, paddingRight: 7, fontSize: 12, marginLeft: 'auto' }}>{format(message_pubD, 'H:mm')}</Text>}
              {item.local && item.came != 2 && <ActivityIndicator 
                style={{ transform: [{scale: 0.6}], paddingBottom: 0, paddingLeft: 7, fontSize: 12, marginLeft: 'auto' }}
              />}
              {item.local && item.came == 2 && <Text
                style={{  paddingBottom: 5, paddingRight: 5, fontSize: 12, marginLeft: 'auto', color: 'tomato', fontSize: 20, fontFamily: 'RobotoBold' }}
              >!</Text>}
              </View>
          </TouchableOpacity>
          {item.quest_active == 1 && item.author == myId && item.is_liked == 0 && <View
                      style={[{ alignSelf: 'center', marginVertical: 20, borderRadius: 100, backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
                    >
                        <Text
                          style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, fontFamily: 'SftMedium' }}
                        >{item.reciever == users[0].id ? language == 'English' ? "Companion rates your answer" : 'Ваш ответ оценивают' : language == 'English' ? 'Your turn to answer' : 'Ваша очередь отвечать'}</Text>
                    </View>}
      </View>
      {item.quest_active == 2 && item.author_to_open == 0 && <View
              style={{ alignSelf: 'center', marginTop: SCREEN_HEIGHT * 0.1, borderRadius: 25, width: '90%',
              backgroundColor: '#1E3559', paddingVertical: 15 }}
            > 
              <Text
                style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 14, textAlign: 'center' }}
              >{language == 'English' ? 'Do you want to open a chat with this user?' :
                'Вы хотите открыть чат с пользователем?'}</Text>
              {!loadingReaction ? <View
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
              >
                <TouchableOpacity
                  style={{ padding: 5, paddingHorizontal: 10, shadowColor: '#FF2525', shadowOpacity: 1, shadowRadius: 5 }}
                  onPress={() => {
                    setModalExit(true)
                  }}
                >
                  <Close width={50} height={50} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ padding: 5, paddingHorizontal: 10, shadowColor: '#E2FF6C', shadowOpacity: 0.6, shadowRadius: 10 }}
                  onPress={() => {
                    setLoadingReaction(true)
                    chatOpen()
                  }}
                >
                  <Heart width={50} height={50} />
                </TouchableOpacity>
              </View> : <ActivityIndicator />}
            </View>}
            {item.quest_active == 2 && item.author_to_open == 1 && item.recipient_to_open == 0 &&<View
              style={{ alignSelf: 'center', marginVertical: 20, borderRadius: 100,
                 borderBottomColor: '#ff073a', borderBottomWidth: 4, shadowColor: '#ff073a', shadowOpacity: 1,
                 shadowOffset: {width: 0, height: 0}, shadowRadius: 5 } }
            > 
              <Text
                style={{ color: '#6D7885', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15 }}
              >{language == 'English' ? "Waiting for the user's decision about opening the chat." :
                'Ждем решения пользователя об открытии чата'}</Text>
            </View>}
            {item.quest_active == 2 && item.author_to_open == 1 && item.recipient_to_open == 1 && <View
              style={{ alignSelf: 'center', marginVertical: 20, borderRadius: 100, backgroundColor: '#3caa3c' } }
            > 
              <Text
                style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15 }}
              >{language == 'English' ? 'You opened this chat' : 'Вы открыли чат!'}</Text>
            </View>}
            {(combinedData.length > 0 && a == 1 && item.id != combinedData[0].id) && <Text style={styles.dateStyleMessages}>{format(message_date, 'dd MMM yyyy')}</Text>}
      {item.is_liked != 0 && <View
              style={[{ marginTop: 20, borderWidth: 1, borderColor: '#5555ff', backgroundColor: '#172136', borderRadius: 100, paddingVertical: 10, paddingHorizontal: 20,
                shadowColor: '#5555ff', shadowOpacity: 1, shadowOffset: {width: 0, height: 0}, shadowRadius: 5, marginHorizontal: 5,
                marginVertical: 5, alignSelf: 'center'}]}
            >
              <Text
                style={{ color: '#fff', fontSize: 15, fontFamily: 'SftMedium' }}
              >{language == 'English' ? item.is_liked == 1 ? 'Companion is satisfied' : item.is_liked == 2 ? 'Companion is not satisfied' : item.is_liked == 3 ? 'Companion is laughing' : item.is_liked == 4 ? 'Companion liked the answer' : 'Companion vomited' :
                item.is_liked == 1 ? 'Собеседника устроил ваш ответ' : item.is_liked == 2 ? 'Собеседник не доволен ответом' : item.is_liked == 3 ? 'Вы развеселили собеседника' : item.is_liked == 4 ? 'Собеседнику понравился ваш ответ' : 'Собеседника стошнило'}</Text> 
      </View>}
      </Animated.View>
  )
      }
    else if (item.author != myId && item.author != 2) {
        return(
          <Animated.View
          style={{transform: [{ translateY: item.id > messageId ? rendAnim : 0}], opacity: item.id > messageId ? opacityAnim : 1}}
          >
            {(item.id == data[data.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
          <View style={{justifyContent: "flex-start", alignItems:'flex-start', backgroundColor: 'transparent'}}>
              <View style={[(index < data.length - 1) &&
              data[index + 1].author == item.author &&
              format(message_pubD, 'dd MM yyyy') == format(prevMesDate, 'dd MM yyyy') &&
              {borderTopLeftRadius: 5}, {margin:5, marginVertical: 2, maxWidth:'80%', borderRadius: 25, borderBottomLeftRadius: 5, backgroundColor: "#0E0E24",
            shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}]}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                    <Text style = {itemStyle.myCardStyle}>{item.text}</Text>
                    <Text style={{ color: '#81848B', paddingBottom: 7, paddingRight: 7, fontSize: 12, marginLeft: 'auto' }}>{format(message_pubD, 'H:mm')}</Text>
                  </View>
              </View>
          </View>
          {item.id == data[0].id && item.is_liked == 0 && item.quest_active == 1 && <View
              style={{ alignSelf: 'center', marginTop: SCREEN_HEIGHT * 0.1, borderRadius: 25, width: '90%',
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

            {item.quest_active == 2 && item.recipient_to_open == 0 && <View
              style={{ alignSelf: 'center', marginTop: SCREEN_HEIGHT * 0.1, borderRadius: 25, width: '90%',
              backgroundColor: '#1E3559', paddingVertical: 15 }}
            > 
              <Text
                style={{ color: '#fff', paddingVertical: 10, textAlign: 'center', paddingHorizontal: 15, fontSize: 15 }}
              >{language == 'English' ? 'Do you want to open a chat with this user?' :
               'Вы хотите открыть чат с пользователем?'}</Text>
              {!loadingReaction ? <View
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
              >
                <TouchableOpacity
                  style={{ padding: 5, paddingHorizontal: 10, shadowColor: '#FF2525', shadowOpacity: 1, shadowRadius: 5 }}
                  onPress={() => {
                    setModalExit(true)
                  }}
                >
                  <Close width={50} height={50} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ padding: 5, paddingHorizontal: 10, shadowColor: '#E2FF6C', shadowOpacity: 0.6, shadowRadius: 10 }}
                  onPress={() => {
                    setLoadingReaction(true)
                    chatOpen()
                  }}
                >
                  <Heart width={50} height={50} />
                </TouchableOpacity>
              </View> : <ActivityIndicator />}
            </View>}

            {item.quest_active == 2 && item.recipient_to_open == 1 && item.author_to_open == 0 &&<View
              style={{ alignSelf: 'center', marginVertical: 20, borderRadius: 100, backgroundColor: 'purple' } }
            > 
              <Text
                style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15 }}
              >{language == 'English' ? "Waiting for the user's decision about opening the chat." :
               'Ждем решения пользователя об открытии чата'}</Text>
            </View>}
            {item.quest_active == 2 && item.author_to_open == 1 && item.recipient_to_open == 1 &&<View
              style={{ alignSelf: 'center', marginVertical: 20, borderRadius: 100, backgroundColor: '#3caa3c' } }
            > 
              <Text
                style={{ color: '#fff', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15 }}
              >{language == 'English' ? 'You opened this chat' :
               'Вы открыли чат!'}</Text>
            </View>}
          {(a == 1 && item.id != data[0].id) && <Text style={styles.dateStyleMessages}>{format(message_date, 'dd MMM yyyy')}</Text>}
            {item.is_liked != 0 && <View
              style={[{ marginTop: 20, borderWidth: 1, borderColor: '#39ff14', backgroundColor: '#172136', borderRadius: 100, paddingVertical: 10, paddingHorizontal: 20,
                shadowColor: '#39ff14', shadowOpacity: 1, shadowOffset: {width: 0, height: 0}, shadowRadius: 5, marginHorizontal: 5,
                marginVertical: 5, alignSelf: 'center'}]}
            >
              <Text
                style={{ color: '#fff',  fontSize: 15, fontFamily: 'SftMedium' }}
              >{language == 'English' ? item.is_liked == 1 ? 'You’re satisfied' : item.is_liked == 2 ? 'You’re not satisfied' : item.is_liked == 3 ? 'The answer made you laugh' : item.is_liked == 4 ? 'You liked the answer' : 'You felt nauseous' : 
                item.is_liked == 1 ? 'Ответ собеседника вас устроил' : item.is_liked == 2 ? 'Вы не довольны ответом' : item.is_liked == 3 ? 'Ответ вас развеселил' : item.is_liked == 4 ? 'Вам понравился ответ собеседника' : 'Вас стошнило'}</Text> 
            </View>}
          </Animated.View>
      ) 
       }
       else {
        return(
          <Animated.View
          style={{transform: [{ translateY: item.id > messageId ? rendAnim : 0}], opacity: item.id > messageId ? opacityAnim : 1}}
          >
            {(item.id == data[data.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
          <View style={{justifyContent: "center", alignItems:'center', backgroundColor: 'transparent'}}>
              <View style={[(index < data.length - 1) &&
              data[index + 1].author == item.author &&
              format(message_pubD, 'dd MM yyyy') == format(prevMesDate, 'dd MM yyyy') &&
              {borderTopLeftRadius: 5}, {margin:5, marginVertical: 20, width:'90%', borderRadius: 25, backgroundColor: "#464E79",
            shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}]}>
                  <View style={{ justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 }}
                    >
                      <QuestionIcon width={30} height={30} />
                      <Text
                        style={{ 
                          fontSize: 18, textAlign: 'left', marginLeft: 5,
                          color: "#fff", fontFamily: 'SftBold'
                        }}
                        >{language == 'English' ? 'Question #' : 'Вопрос #'}{item.quest_number}</Text>
                    </View>
                    <Text style = {{
                      fontSize: 15, padding: 20, paddingTop: 10,
                      textAlign: 'left', color: "#fff",
                      fontFamily: 'SftMedium', lineHeight: 20
                    }}>{language == 'English' ? item.text_eng : item.text}</Text>
                  </View>
              </View>
          </View>
          <View
              style={[{ alignSelf: 'center', marginBottom: 20, borderRadius: 100, backgroundColor: '#fff' }]}
            >
              <Text
                style={{ color: '#000', paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, fontFamily: 'SftMedium' }}
              >{item.reciever != myId ? language == 'English' ? "Companion's turn to answer" : 'Отвечает собеседник' : language == 'English' ? 'Your turn to answer' : 'Ваша очередь отвечать'}</Text> 
          </View>
          {(a == 1 && item.id != data[0].id) && <Text style={styles.dateStyleMessages}>{format(message_date, 'dd MMM yyyy')}</Text>}
          </Animated.View>
      ) 
       }
  }, [combinedData, messageId, loadingReaction])

  const keyExtractor = useCallback((item, index) => index.toString(), [])

  return (
    <View
        style={{ flex: 1, backgroundColor: '#172136' }}
    >
      {users.length > 0 && modalOpened && <Animated.View
          style={{ position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.9)', width: '100%', height: '100%',
        justifyContent: 'center', alignItems: 'center', zIndex: 100000, opacity: opacityModalOpened }}
        >
          <View
            style={{ backgroundColor: '#172136', width: '95%', borderRadius: 15 }}
          >
          <View
            style={{ justifyContent: 'center', alignItems: 'center',
             paddingHorizontal: 15 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
            }}
          />
            <Animated.Image
              source={{ uri: `${BASE_URL}${users[0].photos[0].compressed_image_url}` }}
              style={{ width: 80, height: 80, borderRadius: 100, marginTop: 30,
                 transform: [{translateY: translateY}], opacity: opacityImage }}
            />
            <Animated.Text
              style={{ color: '#fff', fontSize: 24, marginTop: 20, textAlign: 'center', lineHeight: 35,
               opacity: opacityTextModalOpened, fontFamily: 'SftBold', paddingHorizontal: 25 }}
            >{language == 'English' ? `You opened chat with ${users[0].name}` : `Вы открыли диалог с ${users[0].name}`}</Animated.Text>
            <Animated.Text
              style={{ color: '#818C99', textAlign: 'center', fontSize: 16, fontFamily: 'SftMedium',
               marginTop: 20, paddingHorizontal: 15, opacity: opacityTextModalOpened, lineHeight: 24 }}
            >{language == 'English' ? 'Now you can chat with each other' :
             'Теперь вы можете общаться друг с другом'}</Animated.Text>
          </View>
          <Animated.View
            style={{ opacity: opacityTextModalOpened, alignItems: 'center', marginVertical: 10 }}
          >
            <TouchableOpacity
              style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 25, margin: 10, marginVertical: 18,
              shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, width: '80%' }, 
              Platform.OS === 'android' && {elevation: 2}]}
              onPress={() => {
                props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
              }}
            >
              <Text
                style={{ color: '#fff', fontSize: 17, fontFamily: 'SftMedium', textAlign: 'center' }}
              >OK</Text>
            </TouchableOpacity>
          </Animated.View>
          </View>
          
        </Animated.View>}
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
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Random converse' : 'Случайный диалог'}</Text>
                </View>
                {dialogId != 0 ? <TouchableOpacity style={{ width: '20%', bottom: -5, right: 0, alignItems: 'flex-end', paddingRight: 10 }}
                  onPress={() => {
                    setModalExit(true)
                  }}>
                    <ExitIcon width={30} height={30} />
                </TouchableOpacity> :
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
                
            </TouchableOpacity>}
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
            <ScrollView
              indicatorStyle='white'
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', paddingBottom: 20 }}
            >
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
                bottom: -16, fontFamily: 'SftMedium'}}
            >{language == 'English' ? 'Topic' : 'Тема разговора'}</Animated.Text>
            <Animated.Text
              style={{ opacity: textOpacity, color: '#fff', position: 'absolute',
              bottom: -40, fontSize: 18, width: width, textAlign: 'center', fontFamily: 'SftMedium' }}
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
      {/* <Text>{images[activeTheme].quest}</Text> */}
      
      </View>
      <View
        style={{ marginVertical: 25 }}
      >
        <Text
          style={{ color: '#6D7885', fontSize: 16, textAlign: 'center', fontFamily: 'SftLight' }}
        >{language == 'English' ? 'Gender' : 'Пол'}</Text>
        <View
          style={{ justifyContent: 'flex-start', alignItems: 'stretch', marginTop: 5, marginHorizontal: 10 }}
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
          <Text style={{ fontSize: 17, color: '#fff', fontFamily: language == 'English' ? 'SftLight' : 'SftLight' }}>{language == 'English' ? 'All' : 'Любой'}</Text>
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
          
          <Text style={{ fontSize: 17, color: '#fff', fontFamily: language == 'English' ? 'SftLight' : 'SftLight' }}>{language == 'English' ? 'Male' : 'Мужчины'}</Text>
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
           
          <Text style={{ fontSize: 17, color: '#fff', fontFamily: language == 'English' ? 'SftLight' : 'SftLight' }}>{language == 'English' ? 'Female' : 'Женщины'}</Text>
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
            style={{ height: 20, marginTop: 70 }}
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
      </View>
      </ScrollView>
      <View
        style={{ flexGrow: 1, justifyContent: 'flex-end', paddingBottom: 20, width: '100%' }}
      >
            <TouchableOpacity
                style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 25, margin: 10, marginBottom: 18, marginTop: 0,
                shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
                Platform.OS === 'android' && {elevation: 2}]}
                activeOpacity={0.8}
                onPress={() => {
                    loadQueue()
                }}
            >
                <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Find converse' : 'Найти диалог'}</Text>
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
            >{language == 'English' ? 'When we find a conversation partner, you will receive a notification. In the meantime, feel free to continue using other features of the app.' :
             'Когда мы найдем собеседника, вы получите уведомление. А пока что можете продолжить использовать другие функции приложения.'}</Text>
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
     keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight - 20 : -1000}
    >

    <FlatList
        data={combinedData}
        renderItem = {renderData}
        inverted = {true}
        keyExtractor = {keyExtractor}
        // initialNumToRender = {data.length}
        windowSize = {data.length > 0 ? data.length : 30}
        showsVerticalScrollIndicator={false}
        ListFooterComponent = {renderLoader}
        onEndReached={LoadMoreItem}
        onEndReachedThreshold={0.8}
        removeClippedSubviews={true}
        style={{ paddingTop: 20 }}
        />
      <View style={{
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
        paddingTop:10,
        paddingLeft:10,
        paddingRight: 10,
        width: '100%',
        backgroundColor: '#0F1826'}}>
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
            size={25}
            style={[{
              borderRadius: 100,
              display: 'none',
              height: 25,
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
            if(text.trim() != '') {
              if (users.length > 0) {
                sendMessage(localId)
              }
              setText('')
              textInput.current.clear()
            }
          }}
        >
          <SendIcon width={32} height={32} />   
        </TouchableOpacity>}
        </View>
        </KeyboardAvoidingView>}
        
    </View>}

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
              >{language == 'English' ? 'Exit dialog' : 'Покинуть чат?'}</Text>
            <View style={{
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20,
              flexWrap: 'wrap', paddingHorizontal: 5
            }}>
              <Text
                style={{ textAlign: 'center', fontSize: 17, color: '#818C99', fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'Do you really want to leave the chat?' :
               'Вы действительно хотите покинуть чат?'}</Text>
            </View>
            
          </View>
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginTop: 18, width: '80%',
            marginBottom: 35, alignSelf: 'center', shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              exitChat()
              setModalExit(false)
              props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
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
        visible={modalUserLeft}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity 
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
              exitChat()
              setModalUserLeft(false)
              props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
            }}
          />
            <Text
                style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', marginTop: 35 }}
              >{language == 'English' ? 'User gone' : 'Собеседник вышел'}</Text>
            <View style={{
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20,
              flexWrap: 'wrap', paddingHorizontal: 5
            }}>
              <Text
                style={{ textAlign: 'center', fontSize: 17, color: '#818C99', fontFamily: 'SftMedium' }}
              >Собеседник покинул диалог</Text>
            </View>
            
          </View>
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginTop: 18, width: '80%',
            marginBottom: 35, alignSelf: 'center', shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              exitChat()
              setModalUserLeft(false)
              props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
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
            
            <View
                style={{ width: '100%', paddingHorizontal: 10 }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 23, fontFamily: 'SftBold' }}
                >{language == 'English' ? 'Description' : 'Описание'}.</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'This is a chat quiz with a random user, selected based on the parameters you specify before searching for an interlocutor.' :
                 'Это чат-квиз со случайным пользователем, подобранным исходя из параметров, которые вы укажете перед поиском собеседника.'}</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'Neither you nor your interlocutor can see who you are talking to' :
                 'Ни вы ни ваш собоседник не видите с кем общаетесь'}</Text>
              </View>
            <View
              style={{ flexDirection: 'row', paddingHorizontal: 10, marginTop: 20 }}
            >
              <View
                style={{ width: '50%' }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 23, fontFamily: 'SftBold' }}
                >1.</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'Choose a conversation topic, specify the gender and age of your desired interlocutor.' :
                 'Выберите тему беседы, укажите пол и возраст желаемого собеседника.'}</Text>
                 <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? "After clicking the 'Find converse' button, the search for a user with matching parameters will begin." :
                 'После нажатия кнопки "Найти диалог" начнется поиск пользователя с подходящими параметрами.'}</Text>
              </View>
              <View
                style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
              >
                <Image
                  style={{ width: (width / 2) * 0.8, height: (width / 2) * 0.8 * 1.86 }}
                  source={language == 'English' ? require('../images/randomChat/manual/chat_manual_theme_eng.jpg') :
                     require('../images/randomChat/manual/chat_manual_theme.jpg')}
                />
              </View>
            </View>
            <View
              style={{ width: width - 20, height: 1, backgroundColor: '#243A4A', alignSelf: 'center', marginVertical: 30 }}
            />
            <View
                style={{ width: '100%', paddingHorizontal: 10 }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 23, fontFamily: 'SftBold' }}
                >2.</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'Once a dialogue is found, the quiz will begin, consisting of 4 questions that will be asked alternately to you and your interlocutor.' :
                 'После того, как диалог будет найден, начнется квиз, состоящий из 4-х вопросов, которые будут задаваться по очереди вам и собеседнику.'}</Text>
              </View>
            <View
              style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 20 }}
            >
              <View
                style={{ width: '50%' }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'After each answer, the user waits for feedback from the interlocutor.' :
                 'После каждого ответа пользователь ждет оценки от собеседника.'}</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'After that, the next question will appear.' :
                 'После того, как ответ будет оценен, появится следующий вопрос.'}</Text>
              </View>
              <View
                style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
              >
                <Image
                  style={{ width: (width / 2) * 0.8, height: (width / 2) * 0.8 * 1.7 }}
                  source={language == 'English' ? require('../images/randomChat/manual/chat_manual_answer_eng.jpg') :
                    require('../images/randomChat/manual/chat_manual_answer.jpg')}
                />
              </View>
            </View>
            <View
              style={{ width: width - 20, height: 1, backgroundColor: '#243A4A', alignSelf: 'center', marginVertical: 30 }}
            />
            <View
              style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 20 }}
            >
              <View
                style={{ width: '50%' }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 23, fontFamily: 'SftBold' }}
                >3.</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'After answering the 4 questions, users will be offered the option to open a chat with each other.' :
                 'После ответа на 4 вопроса пользователям будет предложено открыть чат друг с другом.'}</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'If at least one user decides not to open the chat, the current dialogue is deleted.' :
                 'Если хотя бы один пользователь решает не открывать чат, то текущий диалог удаляется.'}</Text>
              </View>
              <View
                style={{ width: '50%', justifyContent: 'flex-start', alignItems: 'center' }}
              >
                <Image
                  style={{ width: (width / 2) * 0.8, height: (width / 2) * 0.8 * 1.7 }}
                  source={language == 'English' ? require('../images/randomChat/manual/chat_manual_open_eng.jpg') :
                    require('../images/randomChat/manual/chat_manual_open.jpg')}
                />
              </View>
            </View>
            <View
              style={{ width: width - 20, height: 1, backgroundColor: '#243A4A', alignSelf: 'center', marginVertical: 30 }}
            />
            <View
              style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 20 }}
            >
              <View
                style={{ width: '50%' }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 23, fontFamily: 'SftBold' }}
                >4.</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'If both users decide to open the chat with each other, the current dialogue is de-anonymized and appears in the regular chats tab.' :
                 'Если оба пользователя решают открыть чат друг с другом, то текущий диалог деанонизируется и появляется на вкладке обычных чатов.'}</Text>
                <Text
                  style={{ color: '#fff', fontSize: 18, marginTop: 15, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'Now the users can communicate with each other without any restrictions.' :
                 'Теперь пользователи могут общаться друг с другом без ограничений.'}</Text>
              </View>
              <View
                style={{ width: '50%', justifyContent: 'flex-start', alignItems: 'center' }}
              >
                <Image
                  style={{ width: (width / 2) * 0.8, height: (width / 2) * 0.8 * 1.6 }}
                  source={language == 'English' ? require('../images/randomChat/manual/chat_manual_opened_eng.jpg') :
                    require('../images/randomChat/manual/chat_manual_opened.jpg')}
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

export default LobbyRandom