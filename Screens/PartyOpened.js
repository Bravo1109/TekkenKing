import React, {useState, useEffect, useRef, useCallback, useContext} from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground,
  ScrollView, Dimensions, RefreshControl, Platform, Modal,
   KeyboardAvoidingView, FlatList, Animated, TextInput, Keyboard} from 'react-native'
import { Image } from 'expo-image';
import { useIsFocused } from "@react-navigation/native";
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment, { lang } from 'moment';
import * as Font from 'expo-font';
import { useHeaderHeight } from '@react-navigation/elements';
import { BASE_URL } from './config';
import { format } from 'date-fns';
import LottieView from 'lottie-react-native'; 
import ArrowLeft from '../images/arrow_up_left.svg'
import ArrowBack from '../images/turnBack.svg'
import { CommonActions } from '@react-navigation/native';
import { openBrowserAsync } from 'expo-web-browser';
import Crowd from '../images/crowd.svg'
import Crown from '../images/crown.svg'
import Money from '../images/money.svg'
import Clocks from '../images/clocks.svg'
import Location from '../images/location.svg'
import Music from '../images/music.svg'
import Drinks from '../images/drinks.svg'
import Fork from '../images/fork.svg'
import Plus from '../images/plus.svg'
import Accept from '../images/accept.svg'
import Denied from '../images/deny.svg'
import TrashIcon from '../images/trash.svg'
import SendIcon from '../images/sendIcon.svg'
import Pen from '../images/pen.svg'
import ExitIcon from '../images/alfred/exitGame.svg'
import AddParticipant from '../images/addParticipant.svg'
import CheckMark from '../images/checkmarkShadows.svg'
import ArrowDown from '../images/arrowDownSign.svg'
import Minus from '../images/minus.svg'
import { BlurView } from 'expo-blur';
import { Shadow } from 'react-native-shadow-2';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UnreadContext } from './UnreadContext';


function PartyOpened(props) {
  const { hasPartyRequests, setHasPartyRequests, hasAcceptedPartyRequests, setHasAcceptedPartyRequests } = useContext(UnreadContext);
  const { widthH, heightH } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const headerHeightTop = getDefaultHeaderHeight({ widthH, heightH }, Platform.OS, insets.top) - 10
  const nowDate = new Date();
  const timerRef = useRef(null);
  const headerHeight = useHeaderHeight();
  const [partyData, setPartyData] = useState(props.route.params.data);
  const {chat} = props.route.params.chat != undefined ? props.route.params.chat : false
  const {data} = props.route.params
  const [modalParticipantOnDelete, setModalParticipantOnDelete] = useState(false)
  const [participantOnDelete, setParticipantOnDelete] = useState(
                    {
                      'id': 0,
                      'name': 'name',
                      'photos': [
                        {
                          "id": 0,
                          "photo": "",
                          "profile_photo": true,
                          "compressed_image_url": ""
                        }
                      ]
              })
  const [participantsData, setParticipantsData] = useState(partyData.participants_paginated != undefined && partyData.participants_paginated.participants);
  const [partyRequestsData, setPartyRequestsData] = useState([]);
  const [partyInviteData, setPartyInviteData] = useState([]);
  const [currentInvitePage, setCurrentInvitePage] = useState(1);
  const [partyMessagesData, setPartyMessagesData] = useState([]);
  const [localData, setLocalData] = useState([])
  const [myId, setMyId] = useState(0)
  const [combinedData, setCombinedData] = useState([])
  const [messageId, setMessageId] = useState(0)
  const [localMesWritten, setLocalMesWritten] = useState(0)
  let [fData, setFData] = useState(new FormData())
  const [modalChange, setModalChange] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [newPartyTitle, setNewPartyTitle] = useState(partyData.title)
  const [newPartyDescription, setNewPartyDescription] = useState(partyData.description)
  const [newPartyLocation, setNewPartyLoaction] = useState(partyData.place)
  const [newPartyCnt, setNewPartyCnt] = useState(partyData.max_participants_cnt)
  const [newPartyMoney, setNewPartyMoney] = useState(partyData.payment)
  const [newPartyTheme, setNewPartyTheme] = useState(partyData.theme)
  const [newPartyDrinks, setNewPartyDrinks] = useState(partyData.drinks)
  const [newPartyFood, setNewPartyFood] = useState(partyData.food)
  const [newPartyMusic, setNewPartyMusic] = useState(partyData.music)
  const [newPartyTakeWith, setNewPartyTakeWith] = useState(partyData.take_with)
  const [newPartyDresscode, setNewPartyDresscode] = useState(partyData.dress_code)
  const [newPartyModalStart, setNewPartyModalStart] = useState(false)
  const [newPartyModalStartAndroid, setNewPartyModalStartAndroid] = useState(false)
  const [newPartyModalEnd, setNewPartyModalEnd] = useState(false)
  const [newPartyModalEndAndroid, setNewPartyModalEndAndroid] = useState(false)
  const [newPartyCreationLoading, setNewPartyCreationLoading] = useState(false)
  const [showCities, setShowCities] = useState(false)
  const [cityId, setCityId] = useState(partyData.city.id)
  const [city, setCity] = useState(partyData.city.name + ', ' + partyData.city.country)
  const [cityData, setCityData] = useState()
  const [dateStart, setDateStart] = useState(new Date(partyData.start_date))
  const [labelDateStart, setLabelDateStart] = useState(dateStart.getDate() + '.' + (dateStart.getMonth() + 1 < 10 ? '0' + (dateStart.getMonth() + 1) : (dateStart.getMonth() + 1)) + '.' + dateStart.getFullYear() + '  ' + dateStart.getHours() + ':' + (dateStart.getMinutes() < 10 ? '0' + dateStart.getMinutes() : dateStart.getMinutes()))
  const [dateEnd, setDateEnd] = useState(new Date(partyData.finish_date))
  const [labelDateEnd, setLabelDateEnd] = useState(dateEnd.getDate() + '.' + (dateEnd.getMonth() + 1 < 10 ? '0' + (dateEnd.getMonth() + 1) : (dateEnd.getMonth() + 1)) + '.' + dateEnd.getFullYear() + '  ' + dateEnd.getHours() + ':' + (dateEnd.getMinutes() < 10 ? '0' + dateEnd.getMinutes() : dateEnd.getMinutes()))
  const [newPartyThemePickerDisplay, setNewPartyThemePickerDisplay] = useState(false)
  const [newPartyDrinksPickerDisplay, setNewPartyDrinksPickerDisplay] = useState(false)
  const [newPartyFoodPickerDisplay, setNewPartyFoodPickerDisplay] = useState(false)
  const [newPartyMusicPickerDisplay, setNewPartyMusicPickerDisplay] = useState(false)
  const [modalLeaveParty, setModalLeaveParty] = useState(false)
  const [text, setText] = useState("")
  const textInput = useRef()
  let pubId = 0
  const [localId, setLocalId] = useState(0)
  const [lastMesDate, setLastMesDate] = useState()
  const [partyRequestsActions, setPartyRequestsActions] = useState(0);
  const [startDate, setStartDate] = useState(new Date(partyData.start_date))
  const [endDate, setEndDate] = useState(new Date(partyData.finish_date))
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
  const _loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setfFontsLoaded(true);
  }
  _loadFontsAsync()
  getTokenData = async () => {
    try {
        tokenData = await AsyncStorage.getItem('token')
        return tokenData
    } catch(e) {
        console.log('error', e)
    }
  }
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRemoveMyself, setLoadingRemoveMyself] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [checkMes, setCheckMes] = useState(0)
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [participantsAdded, setParticipantsAdded] = useState(false);
  const [loadingRequestConfirm, setLoadingRequestConfirm] = useState(false);
  const [loadingInviteConfirm, setLoadingInviteConfirm] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState('');
  const [loadingMoreParticipants, setLoadingMoreParticipants] = useState(false)
  const [loadImage, setLoadImage] = useState(true);
  const [nextPageIsNull, setNextPageIsNull] = useState(false);
  const [nextChatPageIsNull, setNextChatPageIsNull] = useState(false);
  const [nextInvitePageIsNull, setNextInvitePageIsNull] = useState(false);
  const [name, setName] = useState('');
  const token = getTokenData()
  const [currentPage, setCurrentPage] = useState(1);
  const [currentChatPage, setCurrentChatPage] = useState(1);
  const isFocused = useIsFocused();
  const [modalParticipants, setModalParticipants] = useState(false);
  const [modalParticipantsRequest, setModalParticipantsRequest] = useState(false);
  const [modalInviteParticipant, setModalInviteParticipant] = useState(false);
  const participantsModalOpacity = useRef(new Animated.Value(0)).current;
  const [sortParticipants, setSortParticipants] = useState(0);
  const [sortChat, setSortChat] = useState(1);
  const rendAnim = useRef(new Animated.Value(10)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateStart
    // setShowStart(Platform.OS === 'ios')
    setDateStart(currentDate)
    let tempDate = new Date(currentDate)
    let fDate = tempDate.getDate() + '.' + (tempDate.getMonth() + 1 < 10 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1) + '.' + tempDate.getFullYear() + '  ' + tempDate.getHours() + ':' + (tempDate.getMinutes() < 10 ? '0' + tempDate.getMinutes() : tempDate.getMinutes())
    setLabelDateStart(fDate)
  }

  const handleConfirm = (date) => {
    setDateStart(date);
    let tempDate = new Date(date)
    let fDate = tempDate.getDate() + '.' + (tempDate.getMonth() + 1 < 10 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1) + '.' + tempDate.getFullYear() + '  ' + tempDate.getHours() + ':' + (tempDate.getMinutes() < 10 ? '0' + tempDate.getMinutes() : tempDate.getMinutes())
    setLabelDateStart(fDate)
    setNewPartyModalStartAndroid(false)
  };

  const handleEndConfirm = (date) => {
    setDateEnd(date);
    let tempDate = new Date(date)
    let fDate = tempDate.getDate() + '.' + (tempDate.getMonth() + 1 < 10 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1) + '.' + tempDate.getFullYear() + '  ' + tempDate.getHours() + ':' + (tempDate.getMinutes() < 10 ? '0' + tempDate.getMinutes() : tempDate.getMinutes())
    setLabelDateEnd(fDate)
    setNewPartyModalEndAndroid(false)
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || dateEnd
    // setShowStart(Platform.OS === 'ios')
    setDateEnd(currentDate)
    let tempDate = new Date(currentDate)
    let fDate = tempDate.getDate() + '.' + (tempDate.getMonth() + 1 < 10 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1) + '.' + tempDate.getFullYear() + '  ' + tempDate.getHours() + ':' + (tempDate.getMinutes() < 10 ? '0' + tempDate.getMinutes() : tempDate.getMinutes())
    setLabelDateEnd(fDate)
  }

  const handleEndEditing = () => {
    // Проверка диапазона и установка корректного значения
    let numericCnt = parseInt(newPartyCnt);
    if (!isNaN(numericCnt)) {
      if (numericCnt == undefined) {
        setNewPartyCnt(1);
      } else if (numericCnt > 99) {
        setNewPartyCnt(99);
      }
    } else {
      setNewPartyCnt(1); // Минимальное значение по умолчанию
    }
  };
  const handleEndEditingMoney = () => {
    // Проверка диапазона и установка корректного значения
    let numericCnt = parseInt(newPartyMoney);
    console.log('numeric = ', numericCnt)
    if (!isNaN(numericCnt)) {
      if (numericCnt > 9999) {
        setNewPartyMoney(9999);
      } else {
        setNewPartyMoney(numericCnt.toString());
      }
    } else {
      setNewPartyMoney(0); // Минимальное значение по умолчанию
    }
  };

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

  const reload = () => {
    console.log('reloading')
    timerRef.current = setTimeout(() => {
        setCheckMes(checkMes + 1)
        console.log('rellllooooaaaad')
    }, 5000)
    // if (!isFocused) {
    //   clearTimeout(timerRef.current)
    // }
  }

  useEffect(() => {
    rendAnim.setValue(10)
    opacityAnim.setValue(0)
    animateRender()
    console.log('animanimanim')
  }, [combinedData])

  useEffect(() => {
    getTokenData()
    .then(() => {
      if (checkMes != 0) {
        refreshMessagesData()
      }
    })
  }, [checkMes])


  useEffect(() => {
    if (modalParticipants && sortChat == 1) {
      getTokenData()
      .then(() => {
      if (isFocused && combinedData.length == 0) {
        loadMessagesData()
      } else if (isFocused && combinedData.length != 0) {
        refreshMessagesData()
      } 
    })
    } else {
      clearTimeout(timerRef.current)
      setLocalData([])
      setPartyMessagesData([])
      setCurrentChatPage(1)
      setNextChatPageIsNull(false)
    }
  }, [modalParticipants, sortChat, isFocused])

  const loadData = () => {
    setLoading(true)
    setLoadingJoin(true)
    !dataLoaded && setDataLoaded(true)
    setCurrentPage(1)
    fetch(`${BASE_URL}/api/parties/${data.id}/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (res.participants_paginated.next == null) {
        setNextPageIsNull(true)
      } else if (nextPageIsNull == true) {
        setNextPageIsNull(false)
      }
      if (chat) {
        setDateStart(new Date(res.start_date))
        setDateEnd(new Date(res.finish_date))
        setLabelDateStart(new Date(res.start_date).getDate() + '.' + (new Date(res.start_date).getMonth() + 1 < 10 ? '0' + (new Date(res.start_date).getMonth() + 1) : (new Date(res.start_date).getMonth() + 1)) + '.' + new Date(res.start_date).getFullYear() + '  ' + new Date(res.start_date).getHours() + ':' + (new Date(res.start_date).getMinutes() < 10 ? '0' + new Date(res.start_date).getMinutes() : new Date(res.start_date).getMinutes()))
        setLabelDateEnd(new Date(res.finish_date).getDate() + '.' + (new Date(res.finish_date).getMonth() + 1 < 10 ? '0' + (new Date(res.finish_date).getMonth() + 1) : (new Date(res.finish_date).getMonth() + 1)) + '.' + new Date(res.finish_date).getFullYear() + '  ' + new Date(res.finish_date).getHours() + ':' + (new Date(res.finish_date).getMinutes() < 10 ? '0' + new Date(res.finish_date).getMinutes() : new Date(res.finish_date).getMinutes()))
        setStartDate(new Date(res.start_date))
        setEndDate(new Date(res.finish_date))
      }
      setMyId(res.my_id)
      setPartyData(res)
      setParticipantsData(res.participants_paginated.participants)
      setLoading(false)
      setLoadingJoin(false)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const changeParty = () => {
    setNewPartyCreationLoading(true)
    fData.append('title', newPartyTitle);
    fData.append('theme', newPartyTheme);
    fData.append('dress_code', newPartyDresscode);
    fData.append('take_with', newPartyTakeWith);
    fData.append('description', newPartyDescription);
    fData.append('city', cityId);
    fData.append('place', newPartyLocation);
    fData.append('start_date', dateStart.toISOString());
    fData.append('finish_date', dateEnd.toISOString());
    fData.append('max_participants_cnt', newPartyCnt);
    fData.append('food', newPartyFood);
    fData.append('drinks', newPartyDrinks);
    fData.append('music', newPartyMusic);
    fData.append('payment', newPartyMoney);
    fetch(`${BASE_URL}/api/parties/${data.id}/`, {
      method:"PATCH",
      headers: {
        'Authorization': `${token._j}`,
        'Accept': 'application/json',
      },
        body: fData
    }).then((resp) => {
        status = resp.status
        return resp.json()
    })
    .then(datas => {
      if (status == 200) {
        setNewPartyCreationLoading(false)
        setModalChange(false)
        loadData()
      } else if (status == 403) {
        setNewPartyCreationLoading(false)
        alert('Действие запрещено!')
      } else {
        setNewPartyCreationLoading(false)
        alert('Что-то пошло не так')
      } 
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const deleteParty = () => {
    setNewPartyCreationLoading(true)
    let status = 0
    fetch(`${BASE_URL}/api/parties/${data.id}/`, {
      method:"DELETE",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then((resp) => {
        status = resp.status
        if (resp.status == 204) {
          // setNewPartyCreationLoading(false)
          // setModalChange(false)
          props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key}));
        } else if (resp.status == 403) {
          setNewPartyCreationLoading(false)
          alert('Действие запрещено!')
        } else {
          setNewPartyCreationLoading(false)
          alert('Что-то пошло не так')
        } 
    }).catch(error => {
      console.log("Error", error)
      setNewPartyCreationLoading(false)
    })
  }

  const loadMessagesData = () => {
    setLoadingMoreParticipants(true)
    clearTimeout(timerRef.current)
    fetch(`${BASE_URL}/api/parties/${data.id}/chat/?page=${currentChatPage}&limit=30`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (res.next == null) {
        setNextChatPageIsNull(true)
      }
      if (res.results.length > 0) {
      const uniqueData = [...partyMessagesData, ...res.results].filter((item, index, array) => {
        return array.findIndex(t => t.id === item.id) === index;
      });
      setPartyMessagesData(uniqueData)
      
      if(res.results[0].id > localId) {
        setLocalId(res.results[0].id + 1)
      }
      // setCombinedData(uniqueData)
      if (!lastMesDate) {
        setLastMesDate(res.results[0].pub_date)
      }
    }
      setLoadingChat(false)
      setLoadingMoreParticipants(false)
      // setStickerLoading(false)
      reload()
    })
    .catch(error => {
      console.log("Error", error)
      setLoadingChat(false)
      loadingMoreParticipants(false)
      // setStickerLoading(false)
    })
  }

  const refreshMessagesData = () => {
    clearTimeout(timerRef.current)
    console.log('refreshingggg')
    fetch(`${BASE_URL}/api/parties/${data.id}/chat/?page=1&limit=15`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (res.results.length > 0 || partyMessagesData[0] != undefined) {
        let newData = [...partyMessagesData, ...res.results].filter((item, index, array) => {
          return array.findIndex(t => t.id === item.id) === index;
        });
        newData.unshift(...res.results)
        const uniqueData = [...newData].filter((item, index, array) => {
          return array.findIndex(t => t.id === item.id) === index;
        });
        if (newData.length > 0) {
            setLastMesDate(newData[0].pub_date)
        }
        const filteredData = localData.filter(item => !item.came);
        setLocalData(filteredData)
        setLocalId(res.results[0].id + 1)
        setPartyMessagesData(uniqueData);
      }
        reload()
    }).then(() => {
      setLoadingChat(false)
      setLoadingMoreParticipants(false)
    })
    .catch(error => {
      console.log("Error", error)
      setLoadingChat(false)
      setLoadingMoreParticipants(false)
    })
  }

  const sendMessage = (mId) => {
    let status = 0
    setLoadingChat(true)
    // setLocalId(localId + 1000)
      let message = {
        "id": mId,
        "text": text.trim(),
        "author": {'id': myId},
        "is_read": false,
        "type": 0,
        "local": true,
        "came": false,
        "pub_date": new Date(),
        // "refer_message_id": selectedMsgId,
        // "refer_message_text": selectedText,
        // "refer_message_author_name": ""
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
        if (localMesWritten == 0) {
          setLocalMesWritten(1)
        }
        setLastMesDate(message.pub_date)
        setLocalId(localId + 1000)
        // setData(uniqueData);
      }
    fetch(`${BASE_URL}/api/parties/${data.id}/chat/`, {
        method:"POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${token._j}`
        },
        body: JSON.stringify({
          text: text.trim(),
          // refer_message_id: selectedMsgId,
          // refer_message_text: selectedText,
        })
      }).then((resp) => {
        // checkUpdates()
        if(resp.status == 201) {
          status = 201
          return resp.json()
        } else {
          let obj = localData.findIndex(o => o.id === mId)
          console.log('objecttt', obj)
          localData[obj].came = 2
          console.log('ERRRRRRROORROORRORO')
        }  
      }).then((resp) => {
        if(status == 201) {
          let obj = localData.findIndex(o => o.id === mId)
          console.log('objecttt', obj)
          localData[obj].id = resp.id
          localData[obj].came = true
          localData[obj].local = false
          // localData[obj].refer_message_author_name = resp.ref_author
          console.log(localData[obj])
          setLoadingChat(false)
          // for (let i = 0; i < resp.tokens.length; i++) {
          // // const element = tokens[i];
          //   sendPushNotification(resp.tokens[i], users[0].id, 'New Message!', text, (`${BASE_URL}/media/` + resp.sender_photo), 0, 'ChatList')
          // }
        }
      }).catch(error => {
          console.log('errorvzdfvd', error)
          let obj = localData.findIndex(o => o.id === mId)
          console.log('objecttt', obj)
          localData[obj].came = 2
          console.log(localData[obj])
      })
  
  }

  const LoadMoreChatItem = () => {
    if (!nextChatPageIsNull && !loadingChat) {
      setLoadingChat(true)
      setCurrentChatPage(currentChatPage + 1);
    }
  }

  const renderCityData = (item, index) => {
    return(
    <View>
    <TouchableOpacity style={[styles.cityCardStyle, {height: 50}]} activeOpacity = {1}
    onPress = {() => {
      setCityId(item.id)
      setCity(item.name + ', ' + item.country)
      setShowCities(false)
      // console.log(cityId)
    }}
    >
      <View style={[{flexDirection:"column", alignItems: 'flex-start', width: '100%'}, index != cityData.length - 1 && { borderBottomWidth: 1,
            borderBottomColor: '#1F3646' }]}> 
        <Text
          style={{ color: '#fff', padding: 13, textAlign: 'left', fontSize: 17, fontFamily: 'SftMedium'}}
        >{item.name}, {item.country}</Text>
      </View>
    </TouchableOpacity>
    </View>
    )
  }

  const loadCity = async (city) => {
    await fetch(`${BASE_URL}/api/cities/?search=${city}`, {
      method:"GET",
    }).then(resp => resp.json())
    .then(data => {
      setCityData(data.results)
      // console.log(data)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  useEffect(() => {
    getLanguageData()
    getTokenData()
    .then(() => {
      if (isFocused && currentChatPage != 1) {
        loadMessagesData()
      }
    })
  }, [currentChatPage])

  useEffect(() => {
    setCombinedData(localData.concat(partyMessagesData))
  }, [partyMessagesData, localData])


  const loadMoreData = () => {
    fetch(`${BASE_URL}/api/parties/${data.id}/?page=${currentPage}`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (res.participants_paginated.next == null) {
        setNextPageIsNull(true)
      }
      const uniqueData = [...participantsData, ...res.participants_paginated.participants].filter((item, index, array) => {
        return array.findIndex(t => t.id === item.id) === index;
      });
      setParticipantsData(uniqueData)
      setLoadingMoreParticipants(false)
    })
    .catch(error => {
      console.log("Error", error)
      setLoadingMoreParticipants(false)
    })
  }
  const LoadMoreItem = () => {
    if (!nextPageIsNull && isFocused && !loadingMoreParticipants) {
      // setLoading(true)
      setLoadingMoreParticipants(true)
      setCurrentPage(currentPage + 1);
    }
  }
  const LoadMoreInviteItem = () => {
    if (!nextInvitePageIsNull && isFocused && !loadingInvite) {
      // setLoading(true)
      setLoadingInvite(true)
      setCurrentInvitePage(currentInvitePage + 1);
    }
  }
  useEffect(() => {
    getTokenData()
    .then(() => {
      if (isFocused && currentPage != 1) {
        loadMoreData()
      }
      })
  }, [currentPage])

  useEffect(() => {
    getTokenData()
    .then(() => {
      if (isFocused) {
        loadInviteData()
      }
      })
  }, [currentInvitePage])

  const loadRequestsData = () => {
    setLoadingRequests(true)
    fetch(`${BASE_URL}/api/parties/${data.id}/request/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      setPartyRequestsData(res.results)
      setLoadingRequests(false)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const loadInviteData = () => {
    console.log('invitedattaaa')
    setLoadingInvite(true)
    fetch(`${BASE_URL}/api/parties/${data.id}/invite/?page=${currentInvitePage}`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (res.next == null) {
        setNextInvitePageIsNull(true)
      } else if (res.next != null) {
        setNextInvitePageIsNull(false)
      }
      const uniqueData = [...partyInviteData, ...res.results].filter((item, index, array) => {
        return array.findIndex(t => t.id === item.id) === index;
      });
      if (currentInvitePage == 1) {
        setPartyInviteData(res.results)
      } else {
        setPartyInviteData(uniqueData)
      }
      setLoadingInvite(false)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const addParticipant = async (id) => {
    setLoadingRequestConfirm(true);
    let objIndex = partyRequestsData.findIndex(o => o.id === id);
    
    // Создаем новый объект для обновления состояния
    let updatedPartyRequestsData = [...partyRequestsData];
    partyRequestsData[objIndex].is_loading = true

    let status = 0;
    await fetch(`${BASE_URL}/api/parties/${data.id}/request/${id}/add_participant/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then((resp) => {
      status = resp.status;
      return resp.json();
    }).then((res) => {
      if(status === 200) {
        partyRequestsData[objIndex].is_accepted = true
        partyRequestsData[objIndex].is_loading = false
        setParticipantsAdded(true);
      } else if (status === 403) {
        alert('Действие не доступно!');
        partyRequestsData[objIndex].is_loading = false
      } else {
        partyRequestsData[objIndex].is_loading = false
      }
      
      // Обновляем состояние после всех изменений
      setPartyRequestsActions(partyRequestsActions + 1)
      setLoadingRequestConfirm(false);
    }).catch(error => {
      console.log("Error", error);
      partyRequestsData[objIndex].is_loading = false
      setPartyRequestsActions(partyRequestsActions + 1)
      setLoadingRequestConfirm(false);
    });
}

const removeParticipant = (id) => {
  setLoadingRequestConfirm(true);
  let objIndex = participantsData.findIndex(o => o.id === id);

  // Создаем новый объект для обновления состояния
  // let updatedPartyRequestsData = [...partyRequestsData];
  participantsData[objIndex].is_loading = true
  participantsData[objIndex].is_deleted = false
  let status = 0;
  fetch(`${BASE_URL}/api/parties/${data.id}/${id}/participants/remove_participant/`, {
    method:"GET",
    headers: {
      'Authorization': `${token._j}`
    }
  }).then((resp) => {
    status = resp.status;
    return resp.json();
  }).then((res) => {
    if(status === 202) {
      participantsData[objIndex].is_deleted = true
      participantsData[objIndex].is_loading = false
      setParticipantsAdded(true);
    } else if (status === 403) {
      alert('Действие не доступно!');
      participantsData[objIndex].is_loading = false
    } else {
      participantsData[objIndex].is_loading = false
      alert('Что-то пошло не так')
    }
    
    // Обновляем состояние после всех изменений
    // setPartyRequestsActions(partyRequestsActions + 1)
    setLoadingRequestConfirm(false);
  })
  .catch(error => {
    console.log("Error", error)
    setLoadingRequestConfirm(false);
  })
}

const removeMyself = (id) => {
  setLoadingRemoveMyself(true);
  let status = 0;
  fetch(`${BASE_URL}/api/parties/${data.id}/${id}/participants/remove_myself/`, {
    method:"GET",
    headers: {
      'Authorization': `${token._j}`
    }
  }).then((resp) => {
    status = resp.status;
    return resp.json();
  }).then((res) => {
    if(status === 202) {
      setModalLeaveParty(false)
      props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key}));
    } else if (status === 403) {
      alert('Действие не доступно!');
    } else {
      alert('Что-то пошло не так')
    }
    setLoadingRemoveMyself(false);
  })
  .catch(error => {
    console.log("Error", error)
    setLoadingRemoveMyself(false);
  })
}

const sendInvitation = async (id) => {
  setLoadingInviteConfirm(true);
  let objIndex = partyInviteData.findIndex(o => o.id === id);

  partyInviteData[objIndex].is_loading = true

  let status = 0;
  await fetch(`${BASE_URL}/api/parties/${data.id}/invite/${id}/send_invitation/`, {
    method:"GET",
    headers: {
      'Authorization': `${token._j}`
    }
  }).then((resp) => {
    status = resp.status;
    return resp.json();
  }).then((res) => {
    if(status === 200) {
      partyInviteData[objIndex].is_accepted = true
      partyInviteData[objIndex].is_loading = false
    } else if (status === 403) {
      alert('Действие не доступно!');
      partyInviteData[objIndex].is_loading = false
    } else {
      partyInviteData[objIndex].is_loading = false
    }
    
    // Обновляем состояние после всех изменений
    setPartyRequestsActions(partyRequestsActions + 1)
    setLoadingInviteConfirm(false);
  }).catch(error => {
    console.log("Error", error);
    partyInviteData[objIndex].is_loading = false
    setPartyRequestsActions(partyRequestsActions + 1)
    setLoadingInviteConfirm(false);
  });
}

const removeRequest = async (id) => {
  setLoadingRequestConfirm(true);
  let objIndex = partyRequestsData.findIndex(o => o.id === id);
  
  // Создаем новый объект для обновления состояния
  // let updatedPartyRequestsData = [...partyRequestsData];
  partyRequestsData[objIndex].is_loading = true

  // setPartyRequestsData(updatedPartyRequestsData);

  let status = 0;
  await fetch(`${BASE_URL}/api/parties/${data.id}/request/${id}/deny_request/`, {
    method:"GET",
    headers: {
      'Authorization': `${token._j}`
    }
  }).then((resp) => {
    status = resp.status;
    return resp.json();
  }).then((res) => {
    if(status === 200) {
      partyRequestsData[objIndex].is_accepted = false
      partyRequestsData[objIndex].is_loading = false
      setParticipantsAdded(true);
    } else if (status === 403) {
      alert('Вы не организатор данной вечеринки!');
      partyRequestsData[objIndex].is_loading = false
    } else {
      partyRequestsData[objIndex].is_loading = false
    }
    setPartyRequestsActions(partyRequestsActions + 1)
    // Обновляем состояние после всех изменений
    // setPartyRequestsData(updatedPartyRequestsData);
    setLoadingRequestConfirm(false);
  }).catch(error => {
    console.log("Error", error);
    partyRequestsData[objIndex].is_loading = false
    setPartyRequestsActions(partyRequestsActions + 1)
    // setPartyRequestsData(updatedPartyRequestsData);
    setLoadingRequestConfirm(false);
  });
}

// const reload = () => {
//   timerRef.current = setTimeout(() => {
//     setPartyRequestsActions(partyRequestsActions + 1)
//     console.log(partyRequestsActions)
//   }, 500)
//   if (!props.navigation.isFocused()) {
//     clearTimeout(timerRef.current)
//   }
// }

// useEffect(() => {
//   reload()
// }, [partyRequestsActions])


  const sendRequest = () => {
    let status = 0
    setLoadingJoin(true)
    fetch(`${BASE_URL}/api/parties/${data.id}/request/`, {
      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${token._j}`
      }
    }).then((resp) => {
      if(resp.status == 201) {
        status = 201
        return resp.json()
      } else {
        status = resp.status
        return resp.json()
      }  
    }).then((resp) => {
      if(status == 201) {
        setPartyData((prevState) => ({
          ...prevState,
          under_consideration: true,
        }));
        setLoadingJoin(false)
      } else {
        setLoadingJoin(false)
      }
    }).catch(error => {
        console.log('error of request', error)
        setLoadingJoin(false)
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
  const keyExtractor = useCallback((item, index) => index.toString(), [])
  useEffect(() => {
    getLanguageData()
    getTokenData()
    .then(() => {
      if (isFocused && !dataLoaded) {
        loadData()
      }
    })
  }, [isFocused])

  const handlePress = async (url) => {
    let result = await openBrowserAsync(url);
    console.log(result);
  };

  const renderTextWithLinks = (text) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlPattern);

    return parts.map((part, index) => {
      if (urlPattern.test(part)) {
        return (
          <TouchableOpacity 
          key={index} 
          onPress={() => handlePress(part)}
          >
            <Text style={{
                color: '#6183FF',
                fontSize: 18,
                fontFamily: 'SftMedium',
                textDecorationLine: 'underline',
                marginBottom: -3,
            }}
            numberOfLines={2}
            ellipsizeMode='tail'>{part}</Text>
          </TouchableOpacity>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  useEffect(() => {
    getLanguageData()
  }, [isFocused])

  const renderLoader = () => {
    return (
        <View style={loadingCircleStyle()}>
            <ActivityIndicator size='small' color='#aaa' />
        </View>
    )
  }

  const loadingCircleStyle = () => {
    return {
        opacity: loadingMoreParticipants || loadingInvite ? 1 : 0,
        position: 'absolute',
        width: '100%',
        alignItems:'center',
        justifyContent:'center'
    }
  }

  const modalParticipantsOpacity = () => {
    setModalParticipants(true)
    console.log('valueee', participantsModalOpacity)
    Animated.timing(participantsModalOpacity, {
      toValue: !modalParticipants ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      modalParticipants && setModalParticipants(false)
    })
}

  const clickedItem = (id) => {
    props.navigation.navigate("Profile", {id: id})
  }

  const renderParticipantsData = useCallback(({item, index}) => {
      return(
        <TouchableOpacity 
            style={[styles.cardPartyStyle, {borderTopWidth: 0.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, item.is_deleted && {opacity: 0.4}]}
            contentStyle={{ width: '100%' }}
            activeOpacity={!item.is_deleted ? 1 : 0.4}
            onPress = {() => clickedItem(item)}
            >
          <View style={{flexDirection:"row", alignItems: 'flex-start', height: 50}}>
            <ImageBackground
              source={item.photos.length == 0 ? item.sex == 'male' ? require('../images/male.png') : require('../images/female.png') : {}}
              resizeMode='contain'
              style={{width: 50, height: 50, backgroundColor: '#0F1825', borderRadius: 100, overflow: 'hidden'}}
            >
              {item.verified == true && <CheckMark width={30} height={30} style={{ position: 'absolute', zIndex: 1, right: -3, top: -3 }} />}
              {item.photos.length > 0  && <ActivityIndicator
                style={{ position: 'absolute', height: '100%', width: '100%' }}
              />}
              {item.photos.length > 0 ? <Image
                style={{width:'100%', height:'100%', borderRadius: 100}}
                cachePolicy={'disk'}
                source={{
                  uri: `${BASE_URL}${item.photos[0].compressed_image_url}`
                }}
                    // onLoadEnd={() => setLoadImage(false)}
              /> : <View></View> }
            </ImageBackground>
            <View style={{marginLeft: 15, height: '100%', justifyContent: 'center'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                 numberOfLines={1}
                 style = {{fontSize:21, color: '#fff', fontFamily: 'SftMedium'}}>{item.name}</Text>
                 {item.id == partyData.owner.id && <Crown width={20} height={18} style={{ marginLeft: 5 }} />}
              </View>
              <Text
               numberOfLines={1}
               style={[{fontSize:15, fontFamily: 'SftMedium'}, ((nowDate - new Date(item.last_seen)) / 60 / 1000) < 15 ? {color: '#6083FF'} : {color: '#8E8E93'}]}>{((nowDate - new Date(item.last_seen)) / 60 / 1000) < 15 ? 'Online' : (language == 'English' ? 'Last seen: recently' : 'был(а): недавно')}</Text>
            </View>
          </View>
          {partyData.is_owner && partyData.owner.id != item.id && (!item.is_loading && !item.is_deleted ? <TouchableOpacity
            style={[{ height: 30, width: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: 'tomato', borderRadius: 100 }]}
            onPress={() => {
              if(!item.is_deleted) {
                setModalParticipantOnDelete(true)
                setParticipantOnDelete(item)
              }
            }}
          >
            <Minus height={13} width={13} color={'#fff'} />
          </TouchableOpacity> : !item.is_deleted ? <ActivityIndicator /> : <View></View>)}
        </TouchableOpacity>
      )
  }, [participantsData, loadingRequestConfirm])

  const renderChatData = useCallback(({item, index}) => {
    let a  = 0
    let prevMesDate = new Date(moment(item.pub_date).toISOString())
    if (index < partyMessagesData.length - 1) {
      prevMesDate = new Date(moment(partyMessagesData[index + 1].pub_date).toISOString())
    }
    let mesDate = pubId
    let itemStyle =  StyleSheet.create({
        myCardStyle: {
            fontSize: 16,
            padding: 10,
            // paddingRight: 0,
            textAlign: "left",
            color: "white",
            fontFamily: 'SftMedium',
            width: 'auto',
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
    if (combinedData.length > 0 && item.author.id == myId) {
        return(
          <Animated.View
            style={{transform: [{ translateY: ((item.id > messageId && localMesWritten == 0) || (item.local == true && item.id > messageId)) ? rendAnim : 0}], opacity: ((item.id > messageId && localMesWritten == 0) || (item.local ==true && item.id > messageId)) ? opacityAnim : 1}}
          >
            {(item.id == combinedData[combinedData.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
          <View style={{justifyContent: "flex-end", alignItems:'flex-end', backgroundColor: 'transparent'}}>
          <TouchableOpacity
            style={[(index < combinedData.length - 1) &&
              combinedData[index + 1].author.id == item.author.id &&
              format(message_pubD, 'dd MM yyyy') == format(prevMesDate, 'dd MM yyyy') &&
              {borderTopRightRadius: 5}, {margin:5, marginVertical: 2, maxWidth:'80%', borderRadius: 25, borderBottomRightRadius: 5, backgroundColor: "#2B4150",
            shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}, item.local && {opacity: 0.7}]}
            delayLongPress={800}
            activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
              <Text style = {itemStyle.myCardStyle}>{item.text}</Text>
              {!item.local && <Text style={{ color: '#81848B', paddingBottom: 7, marginRight: 7, fontSize: 12, marginLeft: 'auto', minWidth: 35, textAlign: 'right' }}>{format(message_pubD, 'H:mm')}</Text>}
              {item.local && item.came != 2 && <ActivityIndicator 
                style={{ transform: [{scale: 0.6}], paddingBottom: 0, paddingLeft: 7, fontSize: 12, marginLeft: 'auto' }}
              />}
              {item.local && item.came == 2 && <Text
                style={{  paddingBottom: 5, paddingRight: 5, fontSize: 12, marginLeft: 'auto', color: 'tomato', fontSize: 20, fontFamily: 'RobotoBold' }}
              >!</Text>}
              </View>
          </TouchableOpacity>
      </View>
            {(combinedData.length > 0 && a == 1 && item.id != combinedData[0].id) && <Text style={styles.dateStyleMessages}>{format(message_date, 'dd MMM yyyy')}</Text>}
      
      </Animated.View>
  )
      }
    else if (combinedData.length > 0 && item.author.id != myId && item.author != 2) {
        return(
          <Animated.View
          style={{transform: [{ translateY: item.id > messageId ? rendAnim : 0}], opacity: item.id > messageId ? opacityAnim : 1}}
          >
            {(item.id == partyMessagesData[partyMessagesData.length - 1].id) && <Text style={styles.dateStyleMessages}>{format(message_pubD, 'dd MMM yyyy')}</Text>}
          <View style={{justifyContent: "flex-start", alignItems:'flex-end', flexDirection: 'row', backgroundColor: 'transparent'}}>
              {(index >= 0) &&
              (index == 0 || combinedData[index - 1].author.id != item.author.id || (a == 1 && item.id != partyMessagesData[0].id)) &&
               <TouchableOpacity
                style={{ width: 35, height: 35, marginLeft: 5 }}
                onPress={() => {
                  clickedItem(item.author)
                }}
              >
                <ImageBackground
              source={item.author.photos.length == 0 ? item.sex == 'male' ? require('../images/male.png') : require('../images/female.png') : {}}
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
              <View style={[{margin:5, marginLeft: 47, marginBottom: 2, marginTop: 10, maxWidth:'78%', borderRadius: 25, borderBottomLeftRadius: 5, backgroundColor: "#0E0E24",
            shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2}, (index < combinedData.length - 1) &&
              (combinedData[index + 1].author.id == item.author.id &&
              format(message_pubD, 'dd MM yyyy') == format(prevMesDate, 'dd MM yyyy')) &&
              {borderTopLeftRadius: 5, marginTop: 2}, (index >= 0) &&
                (index == 0 || combinedData[index - 1].author.id != item.author.id || a == 1 && item.id != partyMessagesData[0].id) &&
                 {marginLeft: 7} ]}>
                  {(index >= 0) &&
              (index == 0 && combinedData.length == 1 || (index == combinedData.length - 1 && combinedData.length > 1 && combinedData[index - 1].author.id != item.author.id) || ((index < combinedData.length - 1) && combinedData[index + 1].author.id != item.author.id) || format(message_pubD, 'dd MM yyyy') != format(prevMesDate, 'dd MM yyyy')) && <TouchableOpacity
                onPress={() => {
                  clickedItem(item.author)
                }}
              ><Text
                    numberOfLines={1}
                    style={{ color: '#90A9FF', marginLeft: 10, paddingTop: 10, fontSize: 13, fontFamily: 'SftMedium' }}
                  >{item.author.name}</Text></TouchableOpacity>}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                    <Text style = {[itemStyle.myCardStyle, (index >= 0) &&
              (index == 0 && combinedData.length == 1 || (index == combinedData.length - 1 && combinedData.length > 1 && combinedData[index - 1].author.id != item.author.id) || ((index < combinedData.length - 1) && combinedData[index + 1].author.id != item.author.id) || format(message_pubD, 'dd MM yyyy') != format(prevMesDate, 'dd MM yyyy')) &&
               {paddingTop: 2}]}>{item.text}</Text>
                    <Text style={{ color: '#81848B', paddingBottom: 7, marginRight: 10, fontSize: 12, marginLeft: 'auto', minWidth: 35, textAlign: 'right'}}>{format(message_pubD, 'H:mm')}</Text>
                  </View>
              </View>
          </View>
          {(a == 1 && item.id != partyMessagesData[0].id) && <Text style={styles.dateStyleMessages}>{format(message_date, 'dd MMM yyyy')}</Text>}
          </Animated.View>
      ) 
       }
  }, [combinedData, messageId, loadingChat])

  const renderPartyRequestsData = (item) => {
    return(
      <TouchableOpacity 
          style={[styles.cardPartyStyle, {borderTopWidth: 0.5}]}
          contentStyle={{ width: '100%' }}
          activeOpacity={1}
          onPress = {() => clickedItem(item.applicant)}
          >
        <View style={{flexDirection:"row", alignItems: 'center', height: 50}}>
          <ImageBackground
            source={item.applicant.photos.length == 0 ? item.sex == 'male' ? require('../images/male.png') : require('../images/female.png') : {}}
            resizeMode='contain'
            style={{width: 50, height: 50, backgroundColor: '#0F1825', borderRadius: 100, overflow: 'hidden'}}
          >
            {/* {item.role == 'celebrity' && <CheckMark width={30} height={30} style={{ position: 'absolute', zIndex: 1, right: -3, top: -3 }} />} */}
            {item.applicant.photos.length > 0  && <ActivityIndicator
              style={{ position: 'absolute', height: '100%', width: '100%' }}
            />}
            {item.applicant.photos.length > 0 ? <Image
              style={{width:'100%', height:'100%', borderRadius: 100}}
              cachePolicy={'disk'}
              source={{
                uri: `${BASE_URL}${item.applicant.photos[0].compressed_image_url}`
              }}
                  // onLoadEnd={() => setLoadImage(false)}
            /> : <View></View> }
          </ImageBackground>
          <View style={{marginLeft: 15, height: '100%', justifyContent: 'center', flexGrow: 1}}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
               numberOfLines={1}
               style = {{fontSize:21, color: '#fff', fontFamily: 'SftMedium'}}>{item.applicant.name}</Text>
            </View>
            <Text
             numberOfLines={1}
             style={[{fontSize:15, fontFamily: 'SftMedium'}, ((nowDate - new Date(item.applicant.last_seen)) / 60 / 1000) < 15 ? {color: '#6083FF'} : {color: '#8E8E93'}]}>{((nowDate - new Date(item.applicant.last_seen)) / 60 / 1000) < 15 ? 'Online' : (language == 'English' ? 'Last seen: recently' : 'был(а): недавно')}</Text>
          </View>
          {item.is_accepted != true && item.is_accepted != false ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {item.is_loading != true && <TouchableOpacity
              style={{ height: 40, aspectRatio: 1/1, borderRadius: 100,
                     marginRight: 10, borderColor: '#90A9FF', borderWidth: 2,
                     alignItems: 'center', justifyContent: 'center', backgroundColor: '#172136',
                     shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0},
                     shadowOpacity: 0.7, shadowRadius: 5, elevation: 15 }}
              onPress={() => {
                addParticipant(item.id)
                setPartyRequestsActions(partyRequestsActions + 1)
              }}
            >
              <Plus height={15} width={15} color={'#90A9FF'} />
            </TouchableOpacity>}
            {item.is_loading != true && <TouchableOpacity
              style={{ height: 40, aspectRatio: 1/1, borderRadius: 100,
                     borderColor: '#ff073a', borderWidth: 2,
                     alignItems: 'center', justifyContent: 'center', backgroundColor: '#ff073a',
                     shadowColor: '#ff073a', shadowOffset: {width: 0, height: 0},
                     shadowOpacity: 1, shadowRadius: 10, elevation: 15 }}
              onPress={() => {
                removeRequest(item.id)
                setPartyRequestsActions(partyRequestsActions + 1)
              }}
            >
              <TrashIcon height={27} width={27} color={'#fff'} />
            </TouchableOpacity>}
            {item.is_loading == true && <ActivityIndicator />}
          </View> : <View>
          {item.is_accepted == true ? <TouchableOpacity
              style={{ height: 30, aspectRatio: 1/1, borderRadius: 100,
                       borderColor: '#90A9FF', borderWidth: 0, alignItems: 'center',
                       justifyContent: 'center', backgroundColor: '#fff' }}
              onPress={() => {
                  addParticipant(item.id)
              }}
            >
              <Accept height={17} width={17} color={'#2688EB'} />
            </TouchableOpacity> : <TouchableOpacity
              style={{ height: 30, aspectRatio: 1/1, borderRadius: 100,
                       borderColor: '#90A9FF', borderWidth: 0, alignItems: 'center',
                       justifyContent: 'center', backgroundColor: 'tomato' }}
              onPress={() => {
                  addParticipant(item.id)
              }}
            >
              <Denied height={17} width={17} color={'#fff'} />
            </TouchableOpacity>}
          </View>}
        </View>
      </TouchableOpacity>
    )
}

const renderPartyInviteData = (item) => {
  return(
    <TouchableOpacity 
        style={[styles.cardPartyStyle, {borderTopWidth: 0.5}]}
        contentStyle={{ width: '100%' }}
        activeOpacity={1}
        onPress = {() => clickedItem(item.users[0])}
        >
      <View style={{flexDirection:"row", alignItems: 'center', height: 50}}>
        <ImageBackground
          source={item.users[0].photos.length == 0 ? item.sex == 'male' ? require('../images/male.png') : require('../images/female.png') : {}}
          resizeMode='contain'
          style={{width: 50, height: 50, backgroundColor: '#0F1825', borderRadius: 100, overflow: 'hidden'}}
        >
          {/* {item.role == 'celebrity' && <CheckMark width={30} height={30} style={{ position: 'absolute', zIndex: 1, right: -3, top: -3 }} />} */}
          {item.users[0].photos.length > 0  && <ActivityIndicator
            style={{ position: 'absolute', height: '100%', width: '100%' }}
          />}
          {item.users[0].photos.length > 0 ? <Image
            style={{width:'100%', height:'100%', borderRadius: 100}}
            cachePolicy={'disk'}
            source={{
              uri: `${BASE_URL}${item.users[0].photos[0].compressed_image_url}`
            }}
                // onLoadEnd={() => setLoadImage(false)}
          /> : <View></View> }
        </ImageBackground>
        <View style={{marginLeft: 15, height: '100%', justifyContent: 'center', flexGrow: 1}}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
             numberOfLines={1}
             style = {{fontSize:21, color: '#fff', fontFamily: 'SftMedium'}}>{item.users[0].name}</Text>
          </View>
          <Text
           numberOfLines={1}
           style={[{fontSize:15, fontFamily: 'SftMedium'}, ((nowDate - new Date(item.users[0].last_seen)) / 60 / 1000) < 15 ? {color: '#6083FF'} : {color: '#8E8E93'}]}>{((nowDate - new Date(item.users[0].last_seen)) / 60 / 1000) < 15 ? 'Online' : (language == 'English' ? 'Last seen: recently' : 'был(а): недавно')}</Text>
        </View>
        {(item.invited == false && (item.is_accepted != true && item.is_accepted != false)) ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item.is_loading != true && <TouchableOpacity
            style={{ height: 40, aspectRatio: 1/1, borderRadius: 100,
                   marginRight: 10, borderColor: '#90A9FF', borderWidth: 2,
                   alignItems: 'center', justifyContent: 'center', backgroundColor: '#172136',
                   shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0},
                   shadowOpacity: 0.7, shadowRadius: 5, elevation: 15 }}
            onPress={() => {
              sendInvitation(item.id)
              setPartyRequestsActions(partyRequestsActions + 1)
            }}
          >
            <Plus height={15} width={15} color={'#90A9FF'} />
          </TouchableOpacity>}
          {item.is_loading == true && <ActivityIndicator style={{ marginRight: 15, width: 30 }} />}
        </View> : <View>
        {(item.invited == true || item.is_accepted == true) && <TouchableOpacity
            style={{ height: 30, aspectRatio: 1/1, borderRadius: 100, marginRight: 15,
                     borderColor: '#90A9FF', borderWidth: 0, alignItems: 'center',
                     justifyContent: 'center', backgroundColor: '#fff' }}
            onPress={() => {
                // addParticipant(item.id)
            }}
          >
            <Accept height={17} width={17} color={'#2688EB'} />
          </TouchableOpacity>}
        </View>}
      </View>
    </TouchableOpacity>
  )
}

  if(chat && loading) {
    return (
      <View
        style={{ flex:1, backgroundColor: '#172136', justifyContent: 'center' }}
      >
        <ActivityIndicator />
      </View>
  )
  } else {
  return (
    <View style = {{flex:1, backgroundColor: '#172136', justifyContent: 'flex-start', paddingTop: headerHeight}}>
      <TouchableOpacity
            onPress={() => {
                if (hasPartyRequests.includes(partyData.id) && partyData.requests_participants_cnt == 0) {
                  const filteredArray = hasPartyRequests.filter(num => num !== partyData.id);
                  setHasPartyRequests(filteredArray)
                }
                if (hasAcceptedPartyRequests.includes(partyData.id)) {
                  const filteredArray = hasAcceptedPartyRequests.filter(num => num !== partyData.id);
                  setHasAcceptedPartyRequests(filteredArray)
                }
                props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key})); 
            }}
            style={{left: 15, top: 50, borderRadius: 100, width: 40, height: 40,
              alignItems: 'center', justifyContent: 'center', zIndex: 11111, position: 'absolute',
              backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1, elevation: 3 }}
            activeOpacity={1}
            >
              <ArrowLeft width={30} height={30} fill={'#2688EB'} />
          </TouchableOpacity>
          {partyData.is_owner && <View style={{ right: 15, top: 50, position: 'absolute', flexDirection: 'row', flexWrap: 'wrap',
                         zIndex: 11111 }}>
          <TouchableOpacity
            onPress={() => {
              setModalChange(true)
            }}
            style={{borderRadius: 100, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', 
              backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1 }}
            activeOpacity={1}
            >
              <Pen width={20} height={20} fill={'#2688EB'} />
          </TouchableOpacity>
          </View>}
          {!partyData.is_owner && partyData.is_participant && <View style={{ right: 15, top: 50, position: 'absolute', flexDirection: 'row', flexWrap: 'wrap',
                         zIndex: 11111 }}>
          <TouchableOpacity
            onPress={() => {
              setModalLeaveParty(true)
            }}
            style={{borderRadius: 100, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', 
              backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1 }}
            activeOpacity={1}
            >
              <ExitIcon width={25} height={25} />
          </TouchableOpacity>
          </View>}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View
            style={{ width: '100%' }}
        >
        <Image
            style={{backgroundColor: '#0F1825', width: '100%', aspectRatio: 5/4}}
            cachePolicy={'disk'}
            source={{
                uri: `${BASE_URL}${partyData.compressed_image_url}`
            }}
        />
        <View
            style={{ position: 'absolute', bottom: 20, left: 10, borderRadius: 100, overflow: 'hidden' }}
           >
            <BlurView
                intensity={30}
                tint='extraLight'
            >
              {Platform.OS === 'android' && <Image
              style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH / 1.25, position: 'absolute', bottom: -20, left: -10 }}
              cachePolicy={'disk'}
              source={{
                uri: `${BASE_URL}${partyData.compressed_image_url}`
               }}
              blurRadius={10}
            />}
            {Platform.OS === 'android' && <View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            />}
              <View style={{  flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 12 }}>
                {/* <CircleStar width={15} height={15} fill='#fff' /> */}
                <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'SftMedium', lineHeight: 20, }}>{partyData.theme}</Text>
              </View>
            </BlurView>
            </View>
        </View>
        <View
            style={{ paddingHorizontal: 15, width: '100%' }}
        >
        <Text
            style={{ color: '#fff', fontSize: 25, marginVertical: 20, fontFamily: 'SftBold', textAlign: 'left' }}
        >{partyData.title}</Text>
            {(partyData.is_owner || partyData.is_participant) && <View
                    style={{ flexDirection: 'row',}}
            >
              <Shadow
                distance={4}
                offset={[0, 0]}
                startColor={Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0)'}
              >
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#fff',
                      paddingVertical: 8, paddingHorizontal: 15, borderRadius: 100, backgroundColor: '#172136',
                      shadowColor: '#fff', shadowOpacity: 0.4, shadowOffset: {width: 0, height: 0}, shadowRadius: 3,
                     }}
                  >
                {/* <Money height={22} width={32} color={'#fff'} marginTop={1} marginRight={8} /> */}
                <Text
                  style={{ color: '#fff', fontSize: 20, 
                        fontFamily: 'SftMedium', lineHeight: 22 }}
                >{partyData.is_owner ? language == 'English' ? 'You are owner' : 'Вы организатор' : language == 'English' ? 'Participant' : 'Вы участник'}</Text>
                </View>
                </Shadow>
            </View>}

        <TouchableOpacity
            style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}
            activeOpacity={0.8}
            onPress={() => {
              clickedItem(partyData.owner)
            }}
        >
                <Crown height={25} width={24} color={'#fff'} />
                {partyData.owner.id != undefined && partyData.owner.photos.length > 0 && <Image
                  style={{ width: 25, height: 25, borderRadius: 100, backgroundColor: '#0F1825', marginLeft: 6 }}
                  cachePolicy={'disk'}
                  source={{uri: BASE_URL + partyData.owner.photos[0].compressed_image_url}}
                />}
                {partyData.owner.id != undefined && <Text
                  numberOfLines={1}
                  style={{ color: '#fff', fontSize: 15, 
                        fontFamily: 'SftBold', marginLeft: 5, marginRight: 25 }}
                >{partyData.owner.name}</Text>}
                {partyData.owner.id == undefined && <ActivityIndicator style={{ marginLeft: 6 }} />}
        </TouchableOpacity>

        <View
            style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}
        >
                <Location height={25} width={25} fill={'#fff'}  marginRight={0} />
                <Text
                  style={{ color: '#fff', fontSize: 15, 
                        fontFamily: 'SftLight', marginLeft: 5, marginRight: 25 }}
                >{partyData.city != undefined && language == 'English' ? partyData.city.name_eng : partyData.city.name}, {partyData.is_participant ? partyData.place : language == 'English' ? '(Only participants can see the adress)' : '(Только участники видят адресс)'}</Text>
        </View>
        <View
            style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}
        >
            <Clocks height={25} width={25} color={'#fff'}  marginRight={5} />
                <Text
                  style={{ color: '#fff', fontSize: 15, lineHeight: 17, 
                        fontFamily: 'SftLight' }}
                >
                    {format(startDate, 'd.MM.yy HH:mm')} -- {format(endDate, 'd.MM.yy HH:mm')}
                </Text>
        </View>
        <View
            style={{ flexDirection: 'row', marginBottom: 10 }}
        >
            <View
                    style={{ flexDirection: 'row' }}
                >
                <Shadow
                distance={4}
                offset={[0, 0]}
                startColor={Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0)'}
              >
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#fff',
                        paddingVertical: 8, paddingHorizontal: 15, borderRadius: 100, backgroundColor: '#172136',
                        shadowColor: '#fff', shadowOpacity: 0.4, shadowOffset: {width: 0, height: 0}, shadowRadius: 3,
                     }}
                  >
                  <Crowd width={27} height={22} color={'#fff'} marginTop={0} marginRight={5} marginLeft={-2} />
                  <Text
                    style={{ color: '#fff', fontSize: 20, 
                        fontFamily: 'SftMedium', lineHeight: 22 }}
                  >{partyData.participants_cnt != undefined ? partyData.participants_cnt : <ActivityIndicator />}/{partyData.max_participants_cnt}</Text>
                  </View>
                  </Shadow>
            </View>
             <View
                    style={{ flexDirection: 'row', marginLeft: 10}}
            >
              <Shadow
                distance={4}
                offset={[0, 0]}
                startColor={Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0)'}
              >
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#fff',
                        paddingVertical: 8, paddingHorizontal: 15, borderRadius: 100, backgroundColor: '#172136',
                        shadowColor: '#fff', shadowOpacity: 0.4, shadowOffset: {width: 0, height: 0}, shadowRadius: 3
                     }}
                  >
                <Money height={22} width={32} color={'#fff'} marginTop={0} marginRight={8} />
                <Text
                  style={{ color: '#fff', fontSize: 20, 
                        fontFamily: 'SftMedium', lineHeight: 23 }}
                >{partyData.payment > 0 ? partyData.payment : 'free'}</Text>
                </View>
                </Shadow>
            </View>
        </View>
        <Text
            style={{ color: '#fff', fontSize: 25, marginTop: 10, fontFamily: 'SftBold', textAlign: 'left' }}
        >{language == 'English' ? 'Description:' : 'Описание:'}</Text>
        <Text
            style={{ color: '#fff', fontSize: 18, fontFamily: 'SftMedium', textAlign: 'left', marginTop: 5 }}
        >{renderTextWithLinks(partyData.description)}</Text>
        <View
            style={{ flexDirection: 'row', marginTop: 15, flexWrap: 'wrap' }}
        >
            <View
                    style={{ flexDirection: 'row', marginRight: 10, paddingVertical: 5 }}
                >
                  <Shadow
                distance={4}
                offset={[0, 0]}
                startColor={Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0)'}
              >
                  <View
                    style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#fff',
                        paddingVertical: 8, paddingHorizontal: 15, borderRadius: 100, alignItems: 'center', backgroundColor: '#172136',
                        shadowColor: '#fff', shadowOpacity: 0.4, shadowOffset: {width: 0, height: 0}, shadowRadius: 3
                     }}
                  >
                  <Music height={22}  color={'#fff'}  />
                  <Text
                    style={{ color: '#fff', fontSize: 20, marginLeft: 3,
                        fontFamily: 'SftMedium', lineHeight: 23 }}
                  >{partyData.music}</Text>
                  </View>
                  </Shadow>
            </View>
             <View
                    style={{ flexDirection: 'row', marginRight: 10, paddingVertical: 5}}
            >
              <Shadow
                distance={4}
                offset={[0, 0]}
                startColor={Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0)'}
              >
                <View
                    style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#fff',
                        paddingVertical: 8, paddingHorizontal: 15, borderRadius: 100, alignItems: 'center', backgroundColor: '#172136',
                        shadowColor: '#fff', shadowOpacity: 0.4, shadowOffset: {width: 0, height: 0}, shadowRadius: 3
                     }}
                  >
                <Drinks height={25}  color={'#fff'} fill={'#000'} marginTop={-3} />
                <Text
                  style={{ color: '#fff', fontSize: 20, 
                        fontFamily: 'SftMedium', marginLeft: 1, lineHeight: 23 }}
                >{partyData.drinks}</Text>
                </View>
                </Shadow>
            </View>
            <View
                    style={{ flexDirection: 'row', paddingVertical: 5}}
            >
              <Shadow
                distance={4}
                offset={[0, 0]}
                startColor={Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0)'}
              >
                <View
                    style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#fff',
                        paddingVertical: 8, paddingHorizontal: 15, borderRadius: 100, alignItems: 'center', backgroundColor: '#172136',
                        shadowColor: '#fff', shadowOpacity: 0.4, shadowOffset: {width: 0, height: 0}, shadowRadius: 3
                     }}
                  >
                <Fork height={23}  color={'#fff'}  />
                <Text
                  style={{ color: '#fff', fontSize: 20,
                        fontFamily: 'SftMedium', marginLeft: 3, lineHeight: 23 }}
                >{partyData.food}</Text>
                </View>
                </Shadow>
            </View>
        </View>
        {partyData.take_with != '' &&  <Text
            style={{ color: '#fff', fontSize: 25, marginTop: 15, fontFamily: 'SftBold', textAlign: 'left' }}
        >{language == 'English' ? 'Take with:' : 'Взять с собой:'}</Text>}
        {partyData.take_with != '' && <Text
            style={{ color: '#fff', fontSize: 18, marginTop: 5, marginBottom: 20, fontFamily: 'SftMedium', textAlign: 'left' }}
        >{partyData.take_with}</Text>}
        {partyData.dress_code != '' && <Text
            style={[{ color: '#fff', fontSize: 25, fontFamily: 'SftBold', textAlign: 'left' }, partyData.take_with == '' && {marginTop: 15}]}
        >{language == 'English' ? 'Dress-code:' : 'Дресс-код:'}</Text>}
        <Text
            style={{ color: '#fff', fontSize: 18, marginTop: 5, fontFamily: 'SftMedium', textAlign: 'left' }}
        >{partyData.dress_code}</Text>
        </View>

      </ScrollView>
      <View style={{ width: '100%', height: 90, backgroundColor: '#0F1421',
        position: 'absolute', bottom: 0, zIndex: 100, alignItems: 'center' }}>
        <View style={{ width: '90%', marginTop: 10 }}>
        <TouchableOpacity
          onPress={() => {
            if (partyData.is_participant) {
              modalParticipantsOpacity()
            } else{
              !partyData.under_consideration && !loadingJoin ? sendRequest() : !loadingJoin && alert('Ваша заявка уже на рассмотрении')
            }
            
          }}
          style={[{ borderWidth: 1, borderColor: '#90A9FF', borderRadius: 100, paddingVertical: 12, backgroundColor: '#0F1421',
          shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.8, shadowRadius: 5 }, 
          Platform.OS === 'android' && {elevation: 3}]}
          activeOpacity={0.8}
          >
          {loadingJoin ? <ActivityIndicator /> : <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontFamily: 'SftMedium' }, Platform.OS === 'android' && {
            
          }]}>{partyData.is_participant ? language == 'English' ? 'Chat / Participants' : 'Чат / Участники' : partyData.under_consideration ? language == 'English' ? 'Sent' : 'На рассмотрении' : language == 'English' ? 'Join' : 'Присоединиться'}</Text>}
          {partyData.requests_participants_cnt != undefined && (partyData.is_owner && partyData.requests_participants_cnt > 0) && <BlurView
              style={{top: -8, padding: 7, position: 'absolute', right: 5, borderColor: '#0F1421',
                borderRadius: 100, overflow: 'hidden', 
              }}
              intensity={10}
              tint='prominent'
            ><View 
            style={{ width: 9, height: 9, backgroundColor: 'yellow', borderRadius: 100 }} /></BlurView>}
          </TouchableOpacity>
        </View>
        
      </View>
      
      {modalParticipants && <Animated.View
        // transparent={true}
        // animationType='fade'
        // visible={modalParticipants}
        // statusBarTranslucent={true}
        style={{ height: '100%', width: '100%', position: 'absolute', zIndex: 100000, opacity: participantsModalOpacity }}
        >
          <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <TouchableOpacity onPress={() => {
            modalParticipantsOpacity()
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.5,
            position:'absolute',
            left: 0,
            top: 0,
            zIndex: 0
          }}
          activeOpacity={0.5}
          >
          </TouchableOpacity>
          <View
          contentContainerStyle={{
            flex: 1,
          }}
          style={{
            backgroundColor: '#172136',
            width: '100%',
            maxHeight: '100%',
            minHeight: '100%',
            overflow:'hidden'
          }}
          onPress={() => {
            Keyboard.dismiss()
          }}
          activeOpacity={1}
          >
          <View style={{
            flex: 1
        }}
        >
            <View style={{ height: headerHeightTop, backgroundColor: '#0F1826', 
            alignItems: 'flex-end', paddingBottom: 11, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 5 }}
                    onPress={() => {
                      modalParticipantsOpacity()
                    }}
                >
                    <ArrowBack height={22} width={22} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text
                     numberOfLines={1}
                     style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{partyData.title}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%',
                           alignItems: 'center', paddingHorizontal: 10, paddingBottom: 10,
                           backgroundColor: '#0F1826'  }}>
              
              <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%'}}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}
                  onPress={() => {
                    if (sortParticipants == 1) {
                      setSortParticipants(0)
                      setLoadingMoreParticipants(true)
                      setSortChat(1)
                    }
                  }}
                >
                  <Text
                    style={[sortChat == 1 ? {  color: '#fff' } : {color: '#818C99'}, {fontSize: 17, padding: 5, fontFamily: 'SftMedium'}]}
                  >{language == 'English' ? 'Chat' : 'Чат'}</Text>
                </TouchableOpacity>
                <View
                  style={[{ width: '90%', height: 2, borderRadius: 100 }, sortChat == 1 ? {backgroundColor: '#3F8AE0'} : {backgroundColor: 'transparent'}]}
                ></View>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%'}}>
              <TouchableOpacity
                activeOpacity={1}
                style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}
                onPress={() => {
                  if (sortParticipants != 1) {
                    setSortParticipants(1)
                    setSortChat(0)
                  }
                }}
              >
                <Text
                  style={[sortParticipants == 1 ? { color: '#fff'} : {color: '#818C99'}, {fontSize: 17, padding: 5, fontFamily: 'SftMedium'}]}
                >{language == 'English' ? 'Participants' : 'Участники'}</Text>
                {partyData.requests_participants_cnt != undefined && (partyData.is_owner && partyData.requests_participants_cnt > 0) && <View style={{ width: 7, height: 7, backgroundColor: 'yellow', borderRadius: 100 }} />}
              </TouchableOpacity>
              <View
                style={[{ width: '90%', height: 2, borderRadius: 100 }, sortParticipants == 1 ? {backgroundColor: '#3F8AE0'} : {backgroundColor: 'transparent'}]}
              ></View>
              </View>
            </View>
                
            <View
              style={{ flex: 1 }}
            >
              {partyData.requests_participants_cnt != undefined && (partyData.is_owner && partyData.requests_participants_cnt > 0) && <TouchableOpacity
                style={{ marginVertical: 10}}
                onPress={() => {
                  setModalParticipantsRequest(true)
                  loadRequestsData()
                }}
              >
                <View
                  style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}
                >
                  <View
                    style={{ flexDirection: 'row', shadowColor: '#90A9FF', shadowRadius: 4,
                             shadowOpacity: 1, shadowOffset: {width: 0, height: 0} }}
                  >
                  <View
                    style={{ width: 50, height: 50, borderRadius: 100, backgroundColor: '#0F1826',
                             borderWidth: 3, borderColor: '#172136',
                     }}
                  >
                    <ImageBackground
                      style={{ width: '100%', height: '100%', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <ActivityIndicator
                        color={'#fff'}
                        style={{ position: 'absolute', transform: [{scale: 0.7}] }}
                      />
                      <Image
                        style={{ width: '100%', height: '100%', borderRadius: 100 }}
                        cachePolicy={'disk'}
                        source={partyData.requests_participants[0].length > 0 && { uri: BASE_URL + partyData.requests_participants[0][0].compressed_image_url}}
                      />
                      
                    </ImageBackground>
                    {partyData.requests_participants_cnt == 1 && <View
                      style={{ paddingHorizontal: 5, paddingVertical: 2, position: 'absolute', top: -5, right: -7,
                               backgroundColor: '#fe019a', borderRadius: 100 , borderWidth: 2, borderColor: '#172136'}}
                    >
                      <Text
                        style={{ color: '#fff', fontSize: 12, fontFamily: 'SftMedium' }}
                      >+1</Text>
                    </View>}
                  </View>
                  {partyData.requests_participants.length > 1 && <View
                    style={{ width: 50, height: 50, borderRadius: 100, backgroundColor: '#0F1826',
                             marginLeft: -38, borderWidth: 3, borderColor: '#172136', }}
                  >
                    <ImageBackground
                      style={{ width: '100%', height: '100%', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <ActivityIndicator
                        color={'#fff'}
                        style={{ position: 'absolute', transform: [{scale: 0.7}] }}
                      />
                      <Image
                        style={{ width: '100%', height: '100%', borderRadius: 100 }}
                        cachePolicy={'disk'}
                        source={partyData.requests_participants[1].length > 0 && { uri: BASE_URL + partyData.requests_participants[1][0].compressed_image_url}}
                      />
                      
                    </ImageBackground>
                    {partyData.requests_participants_cnt == 2 && <View
                      style={{ paddingHorizontal: 5, paddingVertical: 2, position: 'absolute', top: -5, right: -7,
                               backgroundColor: '#fe019a', borderRadius: 100 , borderWidth: 2, borderColor: '#172136'}}
                    >
                      <Text
                        style={{ color: '#fff', fontSize: 12, fontFamily: 'SftMedium' }}
                      >+2</Text>
                    </View>}
                  </View>}
                  {partyData.requests_participants.length > 2 && <View
                    style={{ width: 50, height: 50, borderRadius: 100, backgroundColor: '#0F1826',
                             marginLeft: -38, borderWidth: 3, borderColor: '#172136', }}
                  >
                    <ImageBackground
                      style={{ width: '100%', height: '100%', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <ActivityIndicator
                        color={'#fff'}
                        style={{ position: 'absolute', transform: [{scale: 0.7}] }}
                      />
                      <Image
                        style={{ width: '100%', height: '100%', borderRadius: 100 }}
                        cachePolicy={'disk'}
                        source={partyData.requests_participants[2].length > 0 && { uri: BASE_URL + partyData.requests_participants[2][0].compressed_image_url}}
                      />
                      
                    </ImageBackground>
                    {partyData.requests_participants_cnt > 2 && <View
                      style={{ paddingHorizontal: 5, paddingVertical: 2, position: 'absolute', top: -5, right: -7,
                               backgroundColor: '#fe019a', borderRadius: 100 , borderWidth: 2, borderColor: '#172136'}}
                    >
                      <Text
                        style={{ color: '#fff', fontSize: 12, fontFamily: 'SftMedium' }}
                      >+{partyData.requests_participants_cnt <= 99 ? partyData.requests_participants_cnt : 99}</Text>
                    </View>}
                  </View>}
                  </View>
                  <View
                    style={{ flexGrow: 1, flexDirection: 'row', justifyContent: 'center' }}
                  >
                    <Text
                      style={{ color: '#fff', fontSize: 18, fontFamily: 'SftMedium' }}
                    >{language == 'English' ? 'Join Requests' : 'Заявки на участие'}</Text>
                  </View>
                  <ArrowBack height={20} width={20} style={{ transform: [{rotateZ: '180deg'}] }} />
                </View>
              </TouchableOpacity>}
              {modalParticipantOnDelete &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
            <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.7 }}
            activeOpacity={0.7}
            onPress={() => {
              setModalParticipantOnDelete(false)
              setParticipantOnDelete({
                'id': 0,
                'name': 'name',
                'photos': [
                  {
                    "id": 0,
                    "photo": "",
                    "profile_photo": true,
                    "compressed_image_url": ""
                  }
                ]
            })
            }}
            >
            </TouchableOpacity>
            <View
              style={{ width: '90%', backgroundColor: '#172136', zIndex: 10000,
                 borderRadius: 15, paddingVertical: 15, paddingHorizontal: 10,
                 alignItems: 'center' }}
            >
              <Text
                numberOfLines={2}
                style={{ color: '#fff', fontFamily: 'SftMedium', fontSize: 18, marginTop: 5, textAlign: 'center' }}
              >{language == 'English' ? 'Are you shure you want to kick ' : 'Вы действительно хотите удалить участника '}<Text
                style={{ fontFamily: 'SftBold' }}>{participantOnDelete.name}</Text>?</Text>
              <Image
                style={{ height: 60, width: 60, borderRadius: 100, backgroundColor: '#0F1826',
                         marginTop: 15
                 }}
                 cachePolicy={'disk'}
                 source={participantOnDelete.photos.length > 0 && {uri: BASE_URL + participantOnDelete.photos[0].compressed_image_url}}
              />
              <View
                style={{ width: '100%', height: 0.5, backgroundColor: '#153850', marginTop: 20 }}
              />
              <TouchableOpacity
                style={{ alignItems: 'center', paddingTop: 15, width: '100%' }}
                onPress={() => {
                  removeParticipant(participantOnDelete.id)
                  setModalParticipantOnDelete(false)
                }}
              >
                <Text
                  style={{ color: '#ff073a', fontSize: 20, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'Delete' : 'Удалить'}</Text>
              </TouchableOpacity>
              
            </View>
            <View
              style={{ width: '90%', backgroundColor: '#172136', zIndex: 10000,
                 borderRadius: 15, paddingVertical: 15, paddingHorizontal: 5,
                  marginTop: 15 }}
            >
            <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={() => {
                  setModalParticipantOnDelete(false)
                  setParticipantOnDelete({
                    'id': 0,
                    'name': 'name',
                    'photos': [
                      {
                        "id": 0,
                        "photo": "",
                        "profile_photo": true,
                        "compressed_image_url": ""
                      }
                    ]
                })
                }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 20, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'Cancel' : 'Отменить'}</Text>
              </TouchableOpacity>
            </View>
            </View>
            }
              {partyData.participants_cnt != undefined && (sortParticipants == 1 ? <View
                style={{ flex: 1 }}
              ><FlatList
                data={participantsData}
                renderItem = {renderParticipantsData}
                refreshControl = {
                  <RefreshControl
                    onRefresh = {() => {
                      // setCurrentPage(1)
                      loadData()
                    }}
                    // refreshing = {loadingNext}
                    tintColor = {'#aaa'}
                  />
                }
                windowSize = {7}
                showsVerticalScrollIndicator={false}
                keyExtractor = {item => item.id}
                style={{backgroundColor:'#172136', flex: 1}}
                contentContainerStyle={[{ top: -1 }, partyData.is_owner ? {paddingBottom: 0} : {paddingBottom: 30}]}
                ListFooterComponent={renderLoader}
                onEndReached={LoadMoreItem}
                onEndReachedThreshold={0.8}
                removeClippedSubviews={true}
              />
              {partyData.is_participant && <View style={{ width: '100%', height: 90, backgroundColor: '#0F1421',
                              bottom: 0, zIndex: 100, alignItems: 'center' }}>
                <View style={{ width: '90%', marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (partyData.participants_cnt < partyData.max_participants_cnt) {
                        loadInviteData()
                        setModalInviteParticipant(true)                        
                      } else{
                        alert('Maximum participants')
                      }
                    }}
                    style={[{ borderWidth: 1, borderColor: '#90A9FF', borderRadius: 100, paddingVertical: 10, backgroundColor: '#0F1421',
                    shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.8, shadowRadius: 5,
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }, 
                    Platform.OS === 'android' && {elevation: 3}]}
                    activeOpacity={0.8}
                  >
                    <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 23, fontFamily: 'SftMedium' }, Platform.OS === 'android' && {
            
                  }]}>{language == 'English' ? 'Invite' : 'Пригласить'}</Text>
                  <AddParticipant width={18} height={18} color={"#fff"} style={{ marginLeft: 5 }} />
                  </TouchableOpacity>
                </View>
                </View>}
              </View> :
              <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : -1000}
              >
              {combinedData.length > 0 ? <FlatList
                data={combinedData}
                renderItem = {renderChatData}
                inverted = {true}
                keyExtractor = {keyExtractor}
                // initialNumToRender = {data.length}
                windowSize = {combinedData.length > 0 ? combinedData.length : 10}
                showsVerticalScrollIndicator={false}
                ListFooterComponent = {renderLoader}
                onEndReached={LoadMoreChatItem}
                onEndReachedThreshold={0.8}
                removeClippedSubviews={true}
                style={{ paddingTop: 20 }}
              /> :
              <TouchableOpacity
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                activeOpacity={1}
                onPress={() => {
                  Keyboard.dismiss()
                }}
              >
                {!loadingMoreParticipants ? <Text
                  style={{ color: '#fff', fontFamily: 'SftMedium', fontSize: 20 }}
                >{language == 'English' ? 'There are no messages yet' : 'Сообщений пока нет'}</Text> :
                <ActivityIndicator />}
              </TouchableOpacity>}
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
                sendMessage(localId)
              setText('')
              textInput.current.clear()
            }
          }}
        >
          <SendIcon width={32} height={32} />   
        </TouchableOpacity>}
        </View>
              </KeyboardAvoidingView>
              )}
            </View>

          </View>
        </View>
      </View>

      {modalParticipantsRequest && <View
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      >
        <View style={{ height: headerHeightTop, backgroundColor: '#0F1826', 
            alignItems: 'flex-end', paddingBottom: 11, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 5 }}
                    onPress={() => {
                      if (participantsAdded) {
                        setParticipantsAdded(false)
                        loadData()
                      }
                      setModalParticipantsRequest(false)
                    }}
                >
                    <ArrowBack height={22} width={22} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text
                     numberOfLines={1}
                     style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Join Requests' : 'Заявки на участие'}</Text>
                </View>
            </View>
            <View
              style={{ flex: 1, backgroundColor: '#172136' }}
            >
              {partyRequestsData.length > 0 ? <FlatList
                data={partyRequestsData}
                // renderItem = {renderPartyRequestsData}
                renderItem = {({item}) => {
                  return renderPartyRequestsData(item)
                }}
                refreshControl = {
                  <RefreshControl
                    onRefresh = {() => {
                      // setCurrentPage(1)
                      loadRequestsData()
                    }}
                    // refreshing = {loadingNext}
                    tintColor = {'#aaa'}
                  />
                }
                windowSize = {7}
                showsVerticalScrollIndicator={false}
                keyExtractor = {item => item.id}
                style={{backgroundColor:'#172136', flex: 1}}
                contentContainerStyle={{ paddingBottom: 30, top: -1 }}
                ListFooterComponent={renderLoader}
                // onEndReached={LoadMoreItem}
                onEndReachedThreshold={0.8}
                removeClippedSubviews={true}
                extraData={partyRequestsActions}
              /> : loadingRequests ? <View
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              ><LottieView
                source={require('../animation/anim_glasses.json')}
                style={{width: 100, height: 100 }}
                loop={true}
                autoPlay={true}
                // renderMode='SOFTWARE'
                speed={1}
              /></View> : <View>
                  <Text
                    style={{ color: '#fff', fontSize: 18, fontFamily: 'SftMedium' }}
                  >No new requests</Text>
                </View>}
            </View>
      </View>}

      {modalInviteParticipant && <View
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      >
        <View style={{ height: headerHeightTop, backgroundColor: '#0F1826', 
            alignItems: 'flex-end', paddingBottom: 11, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 5 }}
                    onPress={() => {
                      // if (participantsAdded) {
                      //   setParticipantsAdded(false)
                      //   loadData()
                      // }
                      setModalInviteParticipant(false)
                    }}
                >
                    <ArrowBack height={22} width={22} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text
                     numberOfLines={1}
                     style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Invite' : 'Пригласить'}</Text>
                </View>
            </View>
            <View
              style={{ flex: 1, backgroundColor: '#172136' }}
            >
              {partyInviteData.length > 0 ? <FlatList
                data={partyInviteData}
                // renderItem = {renderPartyRequestsData}
                renderItem = {({item}) => {
                  return renderPartyInviteData(item)
                }}
                refreshControl = {
                  <RefreshControl
                    onRefresh = {() => {
                      // setCurrentPage(1)
                      if (currentInvitePage == 1) {
                        loadInviteData()
                      } else {
                        setCurrentInvitePage(1)
                      }
                    }}
                    // refreshing = {loadingNext}
                    tintColor = {'#aaa'}
                  />
                }
                windowSize = {3}
                // showsVerticalScrollIndicator={false}
                indicatorStyle='white'
                keyExtractor = {item => item.id}
                style={{backgroundColor:'#172136', flex: 1}}
                contentContainerStyle={{ paddingBottom: 30, top: -1 }}
                ListFooterComponent={renderLoader}
                onEndReached={LoadMoreInviteItem}
                onEndReachedThreshold={0.8}
                removeClippedSubviews={true}
                extraData={partyRequestsActions}
              /> : loadingInvite ? <View
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              ><LottieView
                source={require('../animation/anim_glasses.json')}
                style={{width: 100, height: 100 }}
                loop={true}
                autoPlay={true}
                // renderMode='SOFTWARE'
                speed={1}
              /></View> : <View
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              >
                  <Text
                    style={{ color: '#fff', fontSize: 18, fontFamily: 'SftMedium', textAlign: 'center' }}
                  >{language == 'English' ? 'You have no chats with users yet' : 'У вас пока что нет диалогов с другими пользователями'}</Text>
                </View>}
            </View>
      </View>}

      </Animated.View>}
      <Modal
        transparent={true}
        animationType='fade'
        visible={modalChange}
        statusBarTranslucent={true}
        >
          <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <TouchableOpacity onPress={() => {
            setModalChange(false)
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.5,
            position:'absolute',
            left: 0,
            top: 0,
            zIndex: 0
          }}
          activeOpacity={0.5}
          >
          </TouchableOpacity>
          <View
          contentContainerStyle={{
            flex: 1,
          }}
          style={{
            backgroundColor: '#172136',
            width: '100%',
            maxHeight: '100%',
            minHeight: '100%',
            overflow:'hidden'
          }}
          onPress={() => {
            Keyboard.dismiss()
          }}
          activeOpacity={1}
          >
          <View style={{
            flex: 1
        }}
        >
            <View style={{ height: headerHeightTop, backgroundColor: '#0F1826', 
            alignItems: 'flex-end', paddingBottom: 11, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 5 }}
                    onPress={() => {
                      setModalChange(false)
                    }}
                >
                    <ArrowBack height={22} width={22} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Change' : 'Редактировать'}</Text>
                </View>
                <TouchableOpacity
                onPress={() => {
                  changeParty()
                }}
                style={{ width: '20%' }}
                activeOpacity={1}
            >
                <Text style={{ fontSize: 20, fontWeight: '300', color: '#6083FF', textAlign: 'center', fontFamily: 'SftLight'}}>Save</Text>
            </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
            style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
            onPress={() => {
              Keyboard.dismiss()
            }}
          /> */}
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50 }}
              extraScrollHeight={105}
              keyboardShouldPersistTaps={'handled'}
            >

              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', fontWeight: '300', marginTop: 20, fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language == 'English' ? 'Party title' : 'Заголовок вечеринки'}</Text>
              <TextInput style = {[styles.inputStyle]}
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholder={language == 'English' ? 'Short title' : 'Короткое название'}
                placeholderTextColor={'#818C99'}
                value={newPartyTitle}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {title => setNewPartyTitle(title)}
              />
              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : '' }}>{language == 'English' ? 'Description' : 'Описание'}</Text>
              <TextInput style = {[styles.inputStyle, {minHeight: 100, maxHeight: 200}]}
                contentStyle={[{ fontFamily: 'SftLight' }, Platform.OS === 'android' && {paddingTop: 15}]}
                placeholder={language == 'English' ? 'Describe your party' : 'Опишите вашу вечеринку'}
                scrollEnabled={newPartyDescription == '' ? false : true}
                placeholderTextColor={'#818C99'}
                value={newPartyDescription}
                multiline={true}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {description => setNewPartyDescription(description)}
              />

              <Text style={{ marginLeft: 10, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: 'SftLight' }}>{language == 'English' ? 'City' : 'Город'}</Text>
              <TextInput
                style = {{padding:17,
                  margin:10,
                  marginVertical: 5,
                  fontSize: 17,
                  fontWeight: '300',
                  fontFamily: 'SftLight',
                  color: '#fff',
                  borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)'}}
                placeholder={language == 'English' ? 'Enter the city' : 'Выберите город'}
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholderTextColor={'#818C99'}
                textColor='#fff'
                selectionColor='#818C99'
                outlineColor='transparent'
                outlineStyle={{ borderRadius: 13, borderWidth: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                mode='outlined'
                value={city}
                onChangeText = {(city) => {
                  setCity(city)
                  loadCity(city)
                  setShowCities(true)
                }}
                onEndEditing = {() => setShowCities(false)}
              />
              <View style={{ zIndex: 100, width: '100%' }}>
            {showCities && <ScrollView 
              style={{width: '100%', height: 200, position: 'absolute', zIndex: 100, backgroundColor: '#172136'}}
              bounces={false}
              horizontal={true}
              keyboardShouldPersistTaps='handled'
            >
            <FlatList
              data={cityData}
              contentContainerStyle={{zIndex: 100, zIndex: 1000}}
              style={{top: 0, left: 0, width: SCREEN_WIDTH, maxHeight: 200, zIndex: 1000}}
              bounces={false}
              keyboardShouldPersistTaps='handled'
              renderItem = {({item, index}) => {
                return renderCityData(item, index)
              }}
              keyExtractor = {item => `${item.id}`}
            />
              </ScrollView>}
         </View>
              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language == 'English' ? 'Adress' : 'Адрес'}</Text>
              <TextInput style = {[styles.inputStyle]}
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholder={language == 'English' ? 'Location (only participants can see it)' : 'Адрес (виден только участникам)'}
                placeholderTextColor={'#818C99'}
                value={newPartyLocation}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {text => setNewPartyLoaction(text)}
              />
              <View
                style={{ flexDirection: 'row' }}
              >
                <View
                  style={{ width: '50%' }}
                >
                  <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language == 'English' ? 'Number of people' : 'Кол-во человек'}</Text>
                  <TextInput style = {[styles.inputStyle, {fontFamily: 'SftMedium', textAlign: 'center', width: 70, includeFontPadding: true}]}
                    contentStyle={{ fontFamily: 'SftMedium' }}
                    keyboardType='number-pad'
                    maxLength={2}
                    value={`${newPartyCnt}`}
                    mode = "outlined"
                    textColor='#fff'
                    selectionColor='#818C99'
                    outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                    onChangeText={(cnt) => {
                      // Убираем все нечисловые символы
                      let sanitizedCnt = cnt.replace(/[^0-9]/g, '');

                      // Проверяем, что первый символ не "0"
                      if (sanitizedCnt.length > 0 && sanitizedCnt[0] === '0') {
                        sanitizedCnt = 1; // Убираем "0" в начале
                      }

                      setNewPartyCnt(sanitizedCnt);
                    }}
                    onEndEditing={handleEndEditing}
                  />
                </View>
                <View
                  style={{ width: '50%' }}
                >
                  <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language == 'English' ? 'Entrance fee' : 'Плата за вход'}</Text>
                  <TextInput style = {[styles.inputStyle, {fontFamily: 'SftMedium', textAlign: 'center', width: 100, includeFontPadding: true}]}
                    keyboardType='number-pad'
                    maxLength={4}
                    value={`${newPartyMoney}`}
                    mode = "outlined"
                    textColor='#fff'
                    selectionColor='#818C99'
                    outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                    onChangeText={(cnt) => {
                      // Убираем все нечисловые символы
                      let sanitizedCnt = cnt.replace(/[^0-9]/g, '');

                      // Проверяем, что первый символ не "0"
                      if (sanitizedCnt.length > 0 && sanitizedCnt[0] === '0') {
                        sanitizedCnt = 0; // Убираем "0" в начале
                      }

                      setNewPartyMoney(sanitizedCnt);
                    }}
                    onEndEditing={handleEndEditingMoney}
                  />
                </View>
              </View>
              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', fontWeight: '300', marginTop: 10, fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language == 'English' ? 'Start date' : 'Начало вечеринки'}</Text>
              {<TouchableOpacity
              style={{ padding: 17, marginVertical: 5, marginHorizontal: 10, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                Platform.OS === 'ios' ? setNewPartyModalStart(true) : setNewPartyModalStartAndroid(true)
              }}
            >
              <Text style={[{ fontSize: 17, fontWeight: '300', fontFamily: 'SftLight' }, labelDateStart == 'Choose date'  ? {color: '#818C99'} : {color: '#fff'}]}>{language != 'English' && labelDateStart == 'Choose date' ? 'Выбрать дату' : labelDateStart}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity>}
            <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', fontWeight: '300', marginTop: 10, fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language == 'English' ? 'End date' : 'Конец вечеринки'}</Text>
            {<TouchableOpacity
              style={{ padding: 17, marginVertical: 5, marginHorizontal: 10, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                Platform.OS === 'ios' ? setNewPartyModalEnd(true) : setNewPartyModalEndAndroid(true)
              }}
            >
              <Text style={[{ fontSize: 17, fontWeight: '300', fontFamily: 'SftLight' }, , labelDateEnd == 'Choose date'  ? {color: '#818C99'} : {color: '#fff'}]}>{language != 'English' && labelDateEnd == 'Choose date' ? 'Выбрать дату' : labelDateEnd}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity>}



              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language == 'English' ? 'Party type' : 'Тип вечеринки'}</Text>
            {Platform.OS === 'ios' ? <TouchableOpacity
              style={{ padding: 17, marginVertical: 5, marginHorizontal: 10, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                setNewPartyThemePickerDisplay(true)
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: '300', fontFamily: 'SftMedium', color: '#fff' }}>{newPartyTheme}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity> : 
            <View style={{ borderRadius: 13, overflow: 'hidden', marginHorizontal: 10, marginVertical: 5}}>
              <Picker
              style={{  width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 10000, borderRadius: 13 }}
              dropdownIconColor={'#fff'}
              dropdownIconRippleColor={'#000'}
              selectedValue={newPartyTheme}
              onValueChange={(itemValue, itemIndex) => setNewPartyTheme(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='American style'
                value={'American style'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='Russian style'
                value={'Russian style'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
            </Picker>
            </View>
            }

            <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language == 'English' ? 'Music' : 'Музыка'}</Text>
            {Platform.OS === 'ios' ? <TouchableOpacity
              style={{ padding: 17, marginVertical: 5, marginHorizontal: 10, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                setNewPartyMusicPickerDisplay(true)
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: '300', fontFamily: 'SftMedium', color: '#fff' }}>{newPartyMusic}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity> : 
            <View style={{ borderRadius: 13, overflow: 'hidden', marginHorizontal: 10, marginVertical: 5 }}>
              <Picker
              style={{  width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 10000, borderRadius: 13 }}
              dropdownIconColor={'#fff'}
              dropdownIconRippleColor={'#000'}
              selectedValue={newPartyMusic}
              onValueChange={(itemValue, itemIndex) => setNewPartyMusic(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='not provided'
                value={'not provided'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='different'
                value={'different'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='electronic'
                value={'electronic'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='disco'
                value={'disco'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='pop'
                value={'pop'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='rap'
                value={'rap'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='rock'
                value={'rock'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='metal'
                value={'metal'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='classic'
                value={'classic'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
            </Picker>
            </View>
            }


            <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language == 'English' ? 'Drinks' : 'Напитки'}</Text>
            {Platform.OS === 'ios' ? <TouchableOpacity
              style={{ padding: 17, marginVertical: 5, marginHorizontal: 10, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                setNewPartyDrinksPickerDisplay(true)
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: '300', fontFamily: 'SftMedium', color: '#fff' }}>{newPartyDrinks}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity> : 
            <View style={{ borderRadius: 13, overflow: 'hidden', marginHorizontal: 10, marginVertical: 5 }}>
              <Picker
              style={{  width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 10000, borderRadius: 13 }}
              dropdownIconColor={'#fff'}
              dropdownIconRippleColor={'#000'}
              selectedValue={newPartyDrinks}
              onValueChange={(itemValue, itemIndex) => setNewPartyDrinks(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='non-alcohol'
                value={'non-alcohol'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='alcohol'
                value={'alcohol'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
            </Picker>
            </View>
            }

            <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language == 'English' ? 'Food' : 'Еда'}</Text>
            {Platform.OS === 'ios' ? <TouchableOpacity
              style={{ padding: 17, marginVertical: 5, marginHorizontal: 10, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                setNewPartyFoodPickerDisplay(true)
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: '300', fontFamily: 'SftMedium', color: '#fff' }}>{newPartyFood}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity> : 
            <View style={{ borderRadius: 13, overflow: 'hidden', marginHorizontal: 10, marginVertical: 5 }}>
              <Picker
              style={{  width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 10000, borderRadius: 13 }}
              dropdownIconColor={'#fff'}
              dropdownIconRippleColor={'#000'}
              selectedValue={newPartyFood}
              onValueChange={(itemValue, itemIndex) => setNewPartyFood(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='not provided'
                value={'not provided'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='different'
                value={'different'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
            </Picker>
            </View>
            }

              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : '' }}>{language == 'English' ? 'Take with' : 'Взять с собой'}</Text>
              <TextInput style = {[styles.inputStyle, {minHeight: 100, maxHeight: 200}]}
                contentStyle={[{ fontFamily: 'SftLight' }, Platform.OS === 'android' && {paddingTop: 15}]}
                placeholder={language == 'English' ? 'What to take with (if necessary)' : 'Что взять с собой (если нужно)'}
                scrollEnabled={newPartyTakeWith == '' ? false : true}
                placeholderTextColor={'#818C99'}
                value={newPartyTakeWith}
                multiline={true}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {take => setNewPartyTakeWith(take)}
              />
              
            <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', fontWeight: '300', marginTop: 10, fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language == 'English' ? 'Dress-code' : 'Дресс-код'}</Text>
            <TextInput style = {[styles.inputStyle]}
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholder={language == 'English' ? 'Dress-code (if necessary)' : 'Дресс-код (если нужно)'}
                placeholderTextColor={'#818C99'}
                value={newPartyDresscode}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {text => setNewPartyDresscode(text)}
            />
            
            <TouchableOpacity
              style={[{ backgroundColor: '#172136', borderRadius: 100, flexDirection: 'row', paddingVertical: 15, margin: 10, marginTop: 30,
              shadowColor: '#ff073a', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1,
              shadowRadius: 10, borderColor: '#ff073a', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }, 
              Platform.OS === 'android' && {elevation: 4}]}
              activeOpacity={0.8}
              onPress={() => {
                setModalDelete(true)
              }}
            >
              <Text style={[{ color: '#ff073a', textAlign: 'center', fontSize: 20, fontWeight: '400',
               marginLeft: 10, fontFamily: 'SftMedium' }, 
              ]}>{language == 'English' ? 'Delete party' : 'Удалить вечеринку'}</Text>
            </TouchableOpacity>

            </KeyboardAwareScrollView>

            {modalDelete &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
            <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
            activeOpacity={0.5}
            onPress={() => {setModalDelete(false)}}
            >
            </TouchableOpacity>
            <View
              style={{ width: '90%', backgroundColor: '#172136', zIndex: 10000, borderRadius: 15, paddingVertical: 15, paddingHorizontal: 10 }}
            >
              <Text
                style={{ color: '#fff', fontFamily: 'SftMedium', fontSize: 18, marginTop: 5, textAlign: 'center' }}
              >{language == 'English' ? 'Are you sure you want to delete this party?' : 'Вы действительно хотите удалить вечеринку?'}</Text>
              <View
                style={{ width: '100%', height: 0.5, backgroundColor: '#153850', marginTop: 20 }}
              />
              <TouchableOpacity
                style={{ alignItems: 'center', marginTop: 15 }}
                onPress={() => {
                  deleteParty()
                }}
              >
                <Text
                  style={{ color: '#ff073a', fontSize: 20, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'Delete' : 'Удалить'}</Text>
              </TouchableOpacity>
              
            </View>
            <View
              style={{ width: '90%', backgroundColor: '#172136', zIndex: 10000,
                 borderRadius: 15, paddingVertical: 15, paddingHorizontal: 5,
                  marginTop: 15 }}
            >
            <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={() => {
                  setModalDelete(false)
                }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 20, fontFamily: 'SftMedium' }}
                >{language == 'English' ? 'Cancel' : 'Отменить'}</Text>
              </TouchableOpacity>
            </View>
            </View>
            }


            {Platform.OS === 'android' && (
              <View
                style={{ zIndex: 10000 }}
              >
              <DateTimePickerModal
              isVisible={newPartyModalStartAndroid}
              mode="datetime"
              display="spinner"
              minimumDate={nowDate}
              onConfirm={handleConfirm}
              onCancel={() => {setNewPartyModalStartAndroid(false)}}
            />
            </View>
            )}

            {Platform.OS === 'android' && (
              <View>
              <DateTimePickerModal
              isVisible={newPartyModalEndAndroid}
              mode="datetime"
              display="spinner"
              minimumDate={dateEnd > dateStart ? dateEnd : dateStart}
              onConfirm={handleEndConfirm}
              onCancel={() => {setNewPartyModalEndAndroid(false)}}
            />
            </View>
            )}

            {newPartyThemePickerDisplay &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
            <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
            activeOpacity={0.5}
            onPress={() => {setNewPartyThemePickerDisplay(false)}}
            >
            </TouchableOpacity>
            <Picker
              style={{ width: '80%', backgroundColor: '#172136', zIndex: 10000, borderRadius: 15 }}
              selectedValue={newPartyTheme}
              onValueChange={(itemValue, itemIndex) => setNewPartyTheme(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='American style'
                value={'American style'}
                color='#fff'
              />
              <Picker.Item
                label='Russian style'
                value={'Russian style'}
                color='#fff'
              />
            </Picker>
            </View>
            }

            {newPartyDrinksPickerDisplay &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
            <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
            activeOpacity={0.5}
            onPress={() => {setNewPartyDrinksPickerDisplay(false)}}
            >
            </TouchableOpacity>
            <Picker
              style={{ width: '80%', backgroundColor: '#172136', zIndex: 10000, borderRadius: 15 }}
              selectedValue={newPartyDrinks}
              onValueChange={(itemValue, itemIndex) => setNewPartyDrinks(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='non-alcohol'
                value={'non-alcohol'}
                color='#fff'
              />
              <Picker.Item
                label='alcohol'
                value={'alcohol'}
                color='#fff'
              />
            </Picker>
            </View>
            }

            {newPartyFoodPickerDisplay &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
            <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
            activeOpacity={0.5}
            onPress={() => {setNewPartyFoodPickerDisplay(false)}}
            >
            </TouchableOpacity>
            <Picker
              style={{ width: '80%', backgroundColor: '#172136', zIndex: 10000, borderRadius: 15 }}
              selectedValue={newPartyFood}
              onValueChange={(itemValue, itemIndex) => setNewPartyFood(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='not provided'
                value={'not provided'}
                color='#fff'
              />
              <Picker.Item
                label='different'
                value={'different'}
                color='#fff'
              />
            </Picker>
            </View>
            }

            {newPartyMusicPickerDisplay &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
            <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
            activeOpacity={0.5}
            onPress={() => {setNewPartyMusicPickerDisplay(false)}}
            >
            </TouchableOpacity>
            <Picker
              style={{ width: '80%', backgroundColor: '#172136', zIndex: 10000, borderRadius: 15 }}
              selectedValue={newPartyMusic}
              onValueChange={(itemValue, itemIndex) => setNewPartyMusic(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='not provided'
                value={'not provided'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='different'
                value={'different'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='electronic'
                value={'electronic'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='disco'
                value={'disco'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='pop'
                value={'pop'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='rap'
                value={'rap'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='rock'
                value={'rock'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='metal'
                value={'metal'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='classic'
                value={'classic'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
            </Picker>
            </View>
            }

            {newPartyModalStart && <View
            >
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}>
            <TouchableOpacity onPress={() => {
                setNewPartyModalStart(false)
            }}
            style={{
                height: '100%',
                width: '100%',
                backgroundColor: 'black',
                opacity: 0.6,
                position:'absolute',
                left: 0,
                top: 0,
                zIndex: 0
            }}
            activeOpacity={0.6}
            >
            </TouchableOpacity>
            <View style={{ width: '100%', backgroundColor: '#172136', height: SCREEN_HEIGHT - 50,
             borderTopLeftRadius: 10, borderTopRightRadius: 10, alignItems: 'center' }}>
            <View style={{ height: 70, backgroundColor: '#0F1826', borderTopLeftRadius: 10, borderTopRightRadius: 10, 
            alignItems: 'center', paddingTop: 10, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                        setNewPartyModalStart(false)
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 25, textAlign: 'center', fontFamily: 'SftMedium' }}>{language == 'English' ? 'Party start date' : 'Начало вечеринки'}</Text>
                </View>
                <TouchableOpacity
                onPress={() => {
                  // setLabelDateStart(format(dateStart, 'dd MMMM yyyy'))
                  setNewPartyModalStart(false)
                }}
                style={{ width: '20%' }}
                activeOpacity={1}
            >
                <Text style={{ fontSize: 20, fontWeight: '300', color: '#6083FF', textAlign: 'center', fontFamily: 'SftLight'}}>Save</Text>
            </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            {Platform.OS === 'ios' && (
                <RNDateTimePicker
                testID='dateTimePicker'
                value={dateStart}
                minimumDate={nowDate}
                mode={'datetime'}
                display={'inline'}
                // style= {{ height: 120 }}
                onChange={onChange}
            />
            )}
            </View>
            </View>
            </View>
      </View>}


      {newPartyModalEnd && <View
            >
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}>
            <TouchableOpacity onPress={() => {
                setNewPartyModalEnd(false)
            }}
            style={{
                height: '100%',
                width: '100%',
                backgroundColor: 'black',
                opacity: 0.6,
                position:'absolute',
                left: 0,
                top: 0,
                zIndex: 0
            }}
            activeOpacity={0.6}
            >
            </TouchableOpacity>
            <View style={{ width: '100%', backgroundColor: '#172136', height: SCREEN_HEIGHT - 50,
             borderTopLeftRadius: 10, borderTopRightRadius: 10, alignItems: 'center' }}>
            <View style={{ height: 70, backgroundColor: '#0F1826', borderTopLeftRadius: 10, borderTopRightRadius: 10, 
            alignItems: 'center', paddingTop: 10, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                        setNewPartyModalEnd(false)
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 25, textAlign: 'center', fontFamily: 'SftMedium' }}>{language == 'English' ? 'Party start date' : 'Начало вечеринки'}</Text>
                </View>
                <TouchableOpacity
                onPress={() => {
                  // setLabelDateStart(format(dateStart, 'dd MMMM yyyy'))
                  setNewPartyModalEnd(false)
                }}
                style={{ width: '20%' }}
                activeOpacity={1}
            >
                <Text style={{ fontSize: 20, fontWeight: '300', color: '#6083FF', textAlign: 'center', fontFamily: 'SftLight'}}>Save</Text>
            </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            {Platform.OS === 'ios' && (
                <RNDateTimePicker
                testID='dateTimePicker'
                value={dateEnd}
                minimumDate={dateStart}
                mode={'datetime'}
                display={'inline'}
                // style= {{ height: 120 }}
                onChange={onChangeEnd}
            />
            )}
            </View>
            </View>
            </View>
      </View>}

          {newPartyCreationLoading &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
                          top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
              <ActivityIndicator />
            </View>
            }

          </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType='fade'
        visible={modalLeaveParty}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setModalLeaveParty(false)
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
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.9,
            minHeight: SCREEN_WIDTH * 0.9,
            justifyContent: 'flex-end',
            overflow:'hidden'
          }}>
          <View
            style={{ flexGrow: 1, justifyContent: 'center', backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalLeaveParty(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'Leave the party' : 'Покинуть вечеринку'}</Text>
            <Text
              style={{ textAlign: 'center', fontSize: 17, color: '#818C99', fontFamily: 'SftLight',
               width: '80%', marginTop: 10 }}
            >{language == 'English' ? 'Do you really want to leave this party?' : 'Вы действительно хотите покинуть эту вечеринку?'}</Text>
            <Image
              source={{uri: BASE_URL + partyData.compressed_image_url}}
              cachePolicy={'disk'}
              style={{ width: SCREEN_WIDTH * 0.9, height: SCREEN_WIDTH / 2,  marginTop: 10, marginBottom: 15 }}
              blurRadius={6}
            />
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              removeMyself(partyData.my_id)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{language == 'English' ? 'Leave' : 'Покинуть'}</Text>
          </TouchableOpacity>
          </View>
          {loadingRemoveMyself && <View
            style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center', alignItems: 'center'
             }}
          >
            <ActivityIndicator />  
          </View>}
          </View>
        </View>
        </Modal>
     </View>
  )}
}

const styles = StyleSheet.create({
    cardStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7,
        width: '100%'
    },
    inputStyle: {
      padding: 17,
      margin: 10,
      marginVertical: 5,
      fontSize: 17,
      borderRadius: 13,
      borderWidth: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      color: '#fff',
      fontFamily: 'SftLight'
    },
    cityCardStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: 1,
      zIndex: 1000
    },
    cardPartyStyle: {
      padding: 10,
      backgroundColor: '#172136',
      borderTopColor: 'rgba(62, 69, 85, 0.6)',
      borderRadius: 0
    },
    dateStyleMessages: {
      textAlign: 'center',
      fontSize: 15,
      margin: 20,
      color: '#0aa',
      fontFamily: 'SftMedium'
    }
})

export default PartyOpened