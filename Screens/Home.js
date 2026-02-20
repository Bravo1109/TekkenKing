import React, {useState, useEffect, useRef, useContext} from 'react'
import { StyleSheet, Text, View, ImageBackground,
  ActivityIndicator, RefreshControl, TouchableOpacity, Dimensions, Modal, Platform } from 'react-native';
import { Image } from 'expo-image';
import {Card, Button, IconButton} from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from "@react-navigation/native";
import { format } from 'date-fns';
import { SwipeListView } from 'react-native-swipe-list-view';
import { UnreadContext } from './UnreadContext';
import * as Font from 'expo-font';
import TrashIcon from '../images/trash.svg'
import BlockIcon from '../images/block.svg'
import CheckMark from '../images/checkmarkShadows.svg'
import { BASE_URL } from './config';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
 

function Home(props) {
  useFocusEffect(() => {
    props.navigation.setOptions({ headerShown: true });
  });
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
  const [sortChats, setSortChats] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [sortReactions, setSortReactions] = useState(0)
  const [fontsLoaded, setfFontsLoaded] = useState(false)
  const _loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setfFontsLoaded(true);
  }
  _loadFontsAsync()
  const { hasMessages, setHasMessages } = useContext(UnreadContext);
  const [ unreadMessages, setUnreadMessages ] = useState(0)
  getTokenData = async () => {
    try {
        tokenData = await AsyncStorage.getItem('token')
        return tokenData
    } catch(e) {
        console.log('error home', e)
    }
  }
  const getUserData = async () => {
    try {
        let userData = await AsyncStorage.getItem('user')
        setUserMeId(userData)
        return userData
    } catch(e) {
        console.log('error', e)
    }
  }
  const route = useRoute();
  const [language, setLanguage] = useState('')
  const nowDate = new Date()
  const [modal, setModal] = useState(false)
  const [modalBlock, setModalBlock] = useState(false)
  const [blocked, setBlocked] = useState(0)
  const [itemId, setItemId] = useState(0)
  const [userId, setUserId] = useState(0)
  const [userMeId, setUserMeId] = useState(0)
  const SCREEN_WIDTH = Dimensions.get('window').width
  const [currentPage, setCurrentPage] = useState(1);
  const timerRef = useRef(null);
  const isFocused = useIsFocused();
  const [checkMes, setCheckMes] = useState(0)
  const token = getTokenData()
  const [data, setData] = useState([])
  const [reactionsData, setReactionsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [loadingNext, setLoadingNext] = useState(true)
  const [firstLoading, setFirstLoading] = useState(true)
  const [chatsLoading, setChatsLoading] = useState(true)
  const [nextPageIsNull, setNextPageIsNull] = useState(false)
  const { hasReactions, setHasReactions } = useContext(UnreadContext);
  const [ newReactions, setNewReactions ] = useState(false)
  const [lastReactionId, setLastReactionId] = useState(0)
  const loadData = (isRefresh) => {
    if(!nextPageIsNull || currentPage === 1) {
    setLoading(true)
    clearTimeout(timerRef.current)
    fetch(`${BASE_URL}/api/chats/?page=${currentPage}&search=0&limit=20`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (res.next == null) {
        setNextPageIsNull(true)
      }
      console.log('load', currentPage)
      
      if (currentPage == 1) {
        setData(res.results)
        if (res.next != null) {
          setNextPageIsNull(false)
        }
      }
      else {
        const uniqueData = [...data, ...res.results].filter((item, index, array) => {
          return array.findIndex(t => t.id === item.id) === index;
        });
        setData(uniqueData)
      }
      setLoading(false)
      setLoadingMore(false)
      setFirstLoading(false)
      setChatsLoading(false)
      setLoadingNext(false)
      reload()
    })
    .catch(error => {
      console.log("Error load data", error)
    })
  }}

  const loadReactionData = (isRefresh) => {
    if(!nextPageIsNull || currentPage === 1) {
    setLoading(true)
    clearTimeout(timerRef.current)
    fetch(`${BASE_URL}/api/reactions/?page=${currentPage}`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (res.next == null) {
        setNextPageIsNull(true)
      }
      console.log('load', currentPage)
      
      if (currentPage == 1) {
        setReactionsData(res.results)
        if (res.next != null) {
          setNextPageIsNull(false)
        }
      }
      else {
        const uniqueData = [...reactionsData, ...res.results].filter((item, index, array) => {
          return array.findIndex(t => t.id === item.id) === index;
        });
        setReactionsData(uniqueData)
      }
      setLoading(false)
      setLoadingMore(false)
      setFirstLoading(false)
      setChatsLoading(false)
      setLoadingNext(false)
    })
    .catch(error => {
      console.log("Error load data", error)
    })
  }}

  const checkUpdates = () => {
    setLoading(true)
    clearTimeout(timerRef.current)
    fetch(`${BASE_URL}/api/chats/?page=1&search=0&limit=15`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (res.next == null) {
        setNextPageIsNull(true)
      }
      // console.log(res)
      let newData = [...data];
      newData.unshift(...res.results)
      const uniqueData = newData.filter((item, index, array) => {
        return array.findIndex(t => t.id === item.id) === index;
      });
      setData(uniqueData)
      setLoading(false)
      setFirstLoading(false)
      setChatsLoading(false)
      setLoadingNext(false)
      
      reload()
    })
    .catch(error => {
      console.log("Error Updates", error)
      // AsyncStorage.removeItem('token')
      // props.navigation.navigate('StartScreen')
    })
  }
  const deleteChat = (id) => {
    setLoadingDelete(true)
    fetch(`${BASE_URL}/api/chats/${id}/`, {
        method:"DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${token._j}`
        }
      }).then((res) => {
        if(res.status == 204) {
          const newData = data.filter(item => item.id != id);
          setData(newData)
        }
      }).then(() => {
        setModal(false)
        setModalBlock(false)
        setLoadingDelete(false)
      })
      .catch(error => {
        console.log("Error del", error)
        setLoadingDelete(false)
      })
  }
  const blockUser = (userId, chatId) => {
    setLoadingDelete(true)
    fetch(`${BASE_URL}/api/users/${userId}/block/add/`, {
        method:"POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${token._j}`
        }
      }).then((res) => {
        if(res.status == 201) {
          if (sortChats == 1) {
            deleteChat(chatId)
          } else {
            setBlocked(1)
            setLoadingDelete(false)
          }
        } else if(res.status == 403) {
          if (sortChats == 1) {
            deleteChat(chatId)
          } else {
            setBlocked(2)
            setLoadingDelete(false)
          }
        } else {
          if (sortChats == 1) {
            deleteChat(chatId)
          } else {
            setBlocked(3)
            setLoadingDelete(false)
          }
        }
      })
      .catch(error => {
        console.log("Error del", error)
        setLoadingDelete(false)
        if (sortChats != 1) {
          setBlocked(3)
        }
      })
  }
  const LoadMoreItem = () => {
    if (!nextPageIsNull && isFocused && !loadingMore) {
      setLoading(true)
      setLoadingMore(true)
      setCurrentPage(currentPage + 1);
    }
  }

  const reload = () => {
    timerRef.current = setTimeout(() => {
      setCheckMes(checkMes + 1)
    }, 10000)
    if (!props.navigation.isFocused()) {
      clearTimeout(timerRef.current)
    }
    
  }
  
  const renderLoader = () => {
    return (
        <View style={loadingCircleStyle()}>
            <ActivityIndicator size='small' color='#aaa' />
        </View>
    )
  }

  const loadingCircleStyle = () => {
    return {
        opacity: + loading,
        position: 'absolute',
        width: '100%',
        alignItems:'center',
        justifyContent:'center'
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

  const writeLastReaction = async (value) => {
    try {
      await AsyncStorage.setItem(`lastReaction${userMeId}`, value)
    } catch(e) {
      console.log('error', e)
    }
    console.log('Done', value)
  }
  const getLastReaction = async () => {
    try {
      let reactionData = await AsyncStorage.getItem(`lastReaction${userMeId}`)
      console.log('reactiondata', reactionData)
      if(reactionData != null) {
        console.log('herere')
        setLastReactionId(parseInt(reactionData))
        return '0'
      }
      else {
        console.log('ororoor')
        setLastReactionId(0)
        return '0'
      }
    } catch(e) {
        console.log('error', e)
        setLastReactionId(0)
        return '0'
    }
  }
  useEffect(() => {
    getTokenData()
    getLastReaction()
      .then(() => {
        if (sortReactions == 1 && !isFocused) {
          if (reactionsData.length > 0) {
            writeLastReaction(reactionsData[0].id.toString())
            setHasReactions(false)
          }
        }
      })
  }, [isFocused, sortReactions])

  useEffect(() => {
    getLanguageData()
  }, [isFocused])

  useEffect(() => {
    props.navigation.setOptions({ title: language == 'English' ? 'Chats' : 'Чаты', headerTitleStyle: {fontFamily: 'SftBold', fontSize: 20}, })
  }, [language])

  useEffect(() => {
    getTokenData()
    getUserData()
    .then(() => {
      if (isFocused && !firstLoading) {
        sortChats == 1 ? loadData() : loadReactionData()
      }
      })
  }, [currentPage])

  useEffect(() => {
    getTokenData()
    .then(() => {
      if (isFocused && sortChats != 0) {
        checkUpdates()
      }
      })
  }, [checkMes, isFocused])

  useEffect(() => {
    if (!isFocused && checkMes != 0) {
      setCheckMes(0)
    }
  }, [isFocused])

  useEffect(() => {
    if (hasReactions == true) {
      setNewReactions(true)
    } else {
      setNewReactions(false)
    }
}, [hasReactions])

  useEffect(() => {
    if (data.length > 0 && sortChats != 0) {
      let unread_count = 0
      for (let i = 0; i < data.length; i ++) {
        if (data[i].unread_count > 0) {
          unread_count += 1
        }
      }
      console.log('unreadCount: ', unread_count)
      if (unread_count > 0) {
        setHasMessages(true)
      } else if (unread_count == 0) {
        setHasMessages(false)
      }
    }
  }, [data])

 
  const dates_compare = (date) => {
    let today = new Date()
    let result
    if (date.getFullYear() == today.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() == date.getDate()) {
      result = format(date, 'H:mm')
    }
    else if (date.getFullYear() == today.getFullYear() && today.getMonth() == date.getMonth() && (today.getDate() - date.getDate()) == 1) {
      result = language == 'English' ? 'Yesterday' : 'Вчера'
    }
    else if (date.getFullYear() == today.getFullYear()) {
      result = format(date, 'MMM dd')
    }
    else {
      result = format(date, 'dd MMM yyyy')
    }
    return(
      <Text style={{ fontSize:15, color:'#8E8E93', position: 'absolute', right: 0, fontFamily: 'SftMedium' }}>{result}</Text>
    )
  }

  const clickedItem = (data) => {
    props.navigation.navigate("Chat", {data:data, chat_data: data})
  }

  const renderData = (item) => {
    const item_date = new Date(item.messages.length > 0 ? `${item.last_change}` : '2023-01-01')
    if(item.users.length > 0 && data) {
      return(
        <TouchableOpacity 
            style={[styles.cardStyle, {height: 95, justifyContent: 'center'}, item != data[0] && {
              borderTopColor: 'rgb(65, 65, 65)',
              borderTopWidth: StyleSheet.hairlineWidth}]}
            contentStyle={{ width: '100%' }}
            activeOpacity={1}
            onPress = {() => clickedItem(item)}
            // mode='contained'
            >
          <View style={{flexDirection:"row", alignItems: 'flex-start'}}>
            {item.users.length == 1 ? (!item.users[0].deleted && !item.users[0].blocked) ? <ImageBackground
              source={item.users[0].photos.length == 0 ? item.users[0].sex == 'male' ? require('../images/male.png') : require('../images/female.png') : {}}
              resizeMode='contain'
              style={{width:65, height:65, backgroundColor: '#0F1825', borderRadius: 100}}
            >
              {item.users[0].verified && <CheckMark width={25} height={25} style={{ position: 'absolute', zIndex: 1, right: -3, top: -3 }} />}
              <ActivityIndicator
                style={{ position: 'absolute', height: '100%', width: '100%' }}
              />
              {item.users[0].photos.length > 0 ? <Image
                style={{width:'100%', height:'100%', borderRadius: 100}}
                cachePolicy={'disk'}
                source={{
                  uri: `${BASE_URL}${item.users[0].photos[0].compressed_image_url}`
                }}
                    // onLoadEnd={() => setLoadImage(false)}
              /> : <View></View> }
              <ActivityIndicator 
                style={{position: 'absolute', left:0, top:0, right:0, bottom:0}}
                animating={false}
              />
            </ImageBackground> :
            <ImageBackground
            source={require('../images/deletedUser.png')}
            resizeMode='contain'
            imageStyle={{ width: 60, height: 60, marginTop: 10, marginLeft: 10 }}
            style={{width:65, height:65,}}
          >
          </ImageBackground> :
          <ImageBackground
              resizeMode='contain'
              style={{width:65, height:65, backgroundColor: '#0F1825', borderRadius: 100}}
            >
              <ActivityIndicator
                style={{ position: 'absolute', height: '100%', width: '100%' }}
              />
              {item.chat_image != null ? <Image
                style={{width:'100%', height:'100%', borderRadius: 100}}
                cachePolicy={'disk'}
                source={{
                  uri: `${item.chat_image}`
                }}
                    // onLoadEnd={() => setLoadImage(false)}
              /> : <View></View> }
              <ActivityIndicator 
                style={{position: 'absolute', left:0, top:0, right:0, bottom:0}}
                animating={false}
              />
            </ImageBackground>
            }
            <View style={{marginLeft: 15, flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style = {{fontSize:21, color: '#fff', fontFamily: 'SftMedium'}}>{item.users.length > 1 ? item.chat_title : item.users[0].name}</Text>
                {((nowDate - new Date(item.users[0].last_seen)) / 60 / 1000) < 15 && item.users.length < 2 &&  <View
                  style={{ backgroundColor: '#65B141', width: 7, aspectRatio: 1/1, borderRadius: 100, marginLeft: 7 }}
                ></View>}
                {item.messages.length > 0 && dates_compare(item_date)}
              </View>
              {(item.messages.length > 0  && item.messages[0].author == userMeId && item.messages[0].author != 2 && <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'SftMedium' }}>{language == 'English' ? 'You' : 'Вы'}:</Text>)}
              {item.messages.length > 0 ? (<Text numberOfLines={1} style = {{fontSize:18, color:'#8E8E93', fontFamily: 'SftMedium'}}>
                {(item.messages && item.messages[0].text.length) < 10
                  ? `${item.messages[0].text}`
                  : `${item.messages[0].text.substring(0, 15)}...`}
                </Text>) : <Text></Text>}
                {item.unread_count > 0 && <View
                  style={{ paddingVertical: 3, paddingHorizontal: 9, borderRadius: 100, backgroundColor: '#fff', position: 'absolute', right: 0, top: '45%' }}
                >
                  <Text style={{ fontSize: 15, fontFamily: 'SftMedium', lineHeight: 17 }}>{item.unread_count}</Text>
                </View>}
            </View>
          </View>
        </TouchableOpacity>
      )
    }
    return(
      <TouchableOpacity 
          style={styles.cardStyle}
          contentStyle={{ width: '100%' }}
          activeOpacity={1}
          onPress = {() => clickedItem(item)} mode='contained'>
        <View style={{flexDirection:"row", alignItems: 'flex-start',}}> 
          <ImageBackground
            source={require('../images/male.png')}
            resizeMode='contain'
            style={{width:65, height:65, backgroundColor: '#0F1825', overflow: 'hidden', borderRadius:100}}
          >
            <Image
              style={{width:'100%', height:'100%', backgroundColor: '#8E8E93'}}
              
                  // onLoadEnd={() => setLoadImage(false)}
            />
            <ActivityIndicator 
              style={{position: 'absolute', left:0, top:0, right:0, bottom:0}}
              animating={false}
            />
          </ImageBackground>
          <View style={{marginLeft: 15, flex: 1}}>
            <View>
            <Text style = {{fontSize:25, color: '#fff', fontFamily: 'SftMedium'}}>DELETED</Text>
            {item.messages.length > 0 && dates_compare(new Date(item.messages.length > 0 ? `${item.last_change}` : '2023-01-01'))}
            </View>
            <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'SftMedium' }}>{language == 'English' ? 'You' : 'Вы'}:</Text>
            {item.messages.length > 0 ? <Text numberOfLines={1} style = {{fontSize:18, color:'#aaa', width:'100%', fontFamily: 'SftMedium'}}>
              {item.messages[0].text.length < 10
                ? `${item.messages[0].text}`
                : `${item.messages[0].text.substring(0, 15)}...`}
              </Text> : <Text></Text>}
          </View>
        </View>
      </TouchableOpacity>
      )
    
  }

  const renderReactionData = (item) => {
    const item_date = new Date(`${item.pub_date}`)
      return(
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.cardStyle, item.id > lastReactionId ? { backgroundColor: '#1B2945' } : {backgroundColor: '#172136'}, item != reactionsData[0] && {
            borderTopColor: 'rgba(255, 255, 255, 0.05)',
            borderTopWidth: 0.5}]}
          contentStyle={{ width: '100%' }}>
          <View style={{flexDirection:"row", alignItems: 'flex-start', alignItems: 'center'}}> 
            {!item.author.deleted ? <ImageBackground
              source={item.author.photos.length == 0 ? item.author.sex == 'male' ? require('../images/male.png') : require('../images/female.png') : {}}
              resizeMode='contain'
              style={{width:50, height:50}}
            >
              {item.author.verified && <CheckMark width={20} height={20} style={{ position: 'absolute', zIndex: 1, right: -3, top: -3 }} />}
              {item.author.photos.length > 0 ? <Image
                style={{width:'100%', height:'100%', borderRadius:100}}
                cachePolicy={'disk'}
                source={{
                  uri: `${BASE_URL}${item.author.photos[0].compressed_image_url}`
                }}
                    // onLoadEnd={() => setLoadImage(false)}
              /> : <View></View> }
              <ActivityIndicator 
                style={{position: 'absolute', left:0, top:0, right:0, bottom:0}}
                animating={false}
              />
            </ImageBackground> :
            <ImageBackground
            source={require('../images/deletedUser.png')}
            resizeMode='contain'
            imageStyle={{ width: 60, height: 60, marginTop: 10, marginLeft: 10 }}
            style={{width:65, height:65,}}
          >
          </ImageBackground>
            }
            <View style={{marginLeft: 15, flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style = {{fontSize:21, color: '#fff', fontFamily: 'SftMedium'}}>{item.author.name}</Text>
                {((nowDate - new Date(item.author.last_seen)) / 60 / 1000) < 15 && <View
                  style={{ backgroundColor: '#65B141', width: 7, aspectRatio: 1/1, borderRadius: 100, marginLeft: 7 }}
                ></View>}
              </View>
              
                <Text numberOfLines={1} style = {{fontSize:18, color:'#8E8E93', fontFamily: 'SftMedium'}}>
                 {language == 'English' ?  item.action == 'Punch' ? `${item.author.name} набил${item.author.sex == 'female' ? 'а' : ''} вам ебало` : item.action == 'Hugs' ? `${item.author.name} hugged you` : item.action == 'Respect' ? `${item.author.name} showed you respect` : item.action == 'Handshake' ? `${item.author.name} shook your hand` : item.action == 'Wink' ? `${item.author.name} winked at you` : `${item.author.name} slapped you` :
                  item.action == 'Punch' ? `${item.author.name} набил${item.author.sex == 'female' ? 'а' : ''} вам ебало` : item.action == 'Hugs' ? `${item.author.name} вас обнял${item.author.sex == 'female' ? 'а' : ''}` : item.action == 'Respect' ? `${item.author.name} выразил${item.author.sex == 'female' ? 'а' : ''} респект` : item.action == 'Handshake' ? `${item.author.name} пожал${item.author.sex == 'female' ? 'а' : ''} вам руку` : item.action == 'Wink' ? `${item.author.name} подмигнул${item.author.sex == 'female' ? 'а' : ''} вам` : `${item.author.name} дал${item.author.sex == 'female' ? 'а' : ''} вам пощечину`}
                </Text>
            </View>
            <Text
              style={{ fontSize: 28 }} 
            >{item.action == 'Punch' ? '👊' : item.action == 'Hugs' ? '🤗' : item.action == 'Respect' ? '👍' : item.action == 'Handshake' ? '🤝' : item.action == 'Wink' ? '😉' : '👋'}</Text>
          </View>
        </TouchableOpacity>
      )
  }

  return (    
    <View style = {{flex:1, backgroundColor: '#172136'}}>
      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 10, backgroundColor: '#0F1826'  }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}
      onPress={() => {
          setSortChats(1)
          setSortReactions(0)
          {sortChats == 0 && (
            setChatsLoading(true),
            setNextPageIsNull(false),
            reactionsData.length > 0 && writeLastReaction(reactionsData[0].id.toString()),
            setHasReactions(false),
            setData([]),
            setReactionsData([]),
            currentPage != 1 ? setCurrentPage(1) : loadData())}
        }}>
      <Text
        style={[sortChats == 1 ? { color: '#fff'} : {color: '#818C99'}, {fontSize: 17, padding: 5, fontFamily: 'SftMedium'}]}
      >{language == 'English' ? 'Chats' : 'Чаты'}</Text>
      {hasMessages && <View style={{ width: 7, height: 7, backgroundColor: 'yellow', borderRadius: 100 }} />}
      </TouchableOpacity>
      <View
        style={[{ width: '90%', height: 2, borderRadius: 100 }, sortChats == 1 ? {backgroundColor: '#3F8AE0'} : {backgroundColor: 'transparent'}]}
      ></View>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}
      onPress={() => {
          setSortReactions(1)
          setSortChats(0)
          {(sortChats == 1 || sortChats == 0 && sortReactions == 0) && (
            setChatsLoading(true),
            setNextPageIsNull(false),
            setData([]),
            setReactionsData([]),
            currentPage != 1 ? setCurrentPage(1) : loadReactionData())}
        }}>
      <Text
        style={[sortReactions == 1 &&  sortChats == 0 ? {  color: '#fff' } : {color: '#818C99'}, {fontSize: 17, padding: 5, fontFamily: 'SftMedium'}]}
      >{language == 'English' ? 'Reactions' : 'Реакции'}</Text>
      {newReactions && <View style={{ width: 7, height: 7, backgroundColor: 'yellow', borderRadius: 100 }} />}
      </TouchableOpacity>
      <View
        style={[{ width: '90%', height: 2, borderRadius: 100 }, sortReactions== 1 && sortChats == 0 ? {backgroundColor: '#3F8AE0'} : {backgroundColor: 'transparent'}]}
      ></View>
      </View>
      </View> */}
      {data.length != 0 || reactionsData.length != 0 ? (sortChats == 1 ? <SwipeListView
      data={data}
      stopLeftSwipe={50}
      stopRightSwipe={-SCREEN_WIDTH / 2}
      renderItem = {({item}) => {
        return renderData(item)
      }}
      refreshControl = {
        <RefreshControl
          onRefresh = {() => {
            setCurrentPage(1)
          }}
          refreshing = {loadingNext}
          tintColor = {'#aaa'}
          // style = {{ opacity: 1, transform: [{ scale: 0.7 }]}}
        />
      }
      // windowSize = {data.length > 0 ? data.length : 30}
      windowSize = {7}
      showsVerticalScrollIndicator={false}
      keyExtractor = {item => item.id}
      useNativeDriver={false}
      style={{backgroundColor:'#172136'}}
      contentContainerStyle={loading && { paddingBottom: 30, overflow: 'hidden' }}
      renderHiddenItem={ (data, rowMap) => (
        <View style={{height: 95, justifyContent: 'flex-end', flexDirection: 'row', overflow: 'hidden' }}>
          <TouchableOpacity
          onPress={() => {
            if (data['item']['users'].length == 1) {
              setUserId(data['item']['users'][0].id)
              setItemId(data['item']['id'])
              setModalBlock(true)
            } else {
              alert('Действие запрещено')
              setUserId(0)
            }
            
          }}
          style={{height: '100%', backgroundColor: '#223DA4', justifyContent: 'center', alignItems: 'center', width: SCREEN_WIDTH * 0.23}}>
            <BlockIcon width={30} height={30} />
            <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Block' : 'Блок'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => {
            if (data['item']['users'].length == 1) {
            setItemId(data['item']['id'])
            setModal(true)
            } else {
              setItemId(0)
              alert('Действие запрещено')
            }
          }}
          style={{ height: '100%', backgroundColor: '#A57A23', justifyContent: 'center', alignItems: 'center', width: SCREEN_WIDTH * 0.23 }}>
            <TrashIcon width={30} height={30} color={'#fff'} />
            <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'SftMedium' }}>{language == 'English' ?'Delete' : 'Удалить'}</Text>
          </TouchableOpacity>
            
        </View>
      )}
      rightOpenValue={-SCREEN_WIDTH * 0.46}
      ListFooterComponent={renderLoader}
      onEndReached={LoadMoreItem}
      onEndReachedThreshold={0.8}
      removeClippedSubviews={false}
      /> : 
      <SwipeListView
      data={reactionsData}
      stopLeftSwipe={50}
      stopRightSwipe={-SCREEN_WIDTH / 3}
      useNativeDriver={false}
      renderItem = {({item}) => {
        return renderReactionData(item)
      }}
      refreshControl = {
        <RefreshControl
          onRefresh = {() => {
            setCurrentPage(1)
          }}
          refreshing = {loadingNext}
          tintColor = {'#aaa'}
          // style = {{ opacity: 1, transform: [{ scale: 0.7 }]}}
        />
      }
      // windowSize = {data.length > 0 ? data.length : 30}
      windowSize = {5}
      showsVerticalScrollIndicator={false}
      keyExtractor = {item => item.id.toString()}
      style={{backgroundColor:'#172136'}}
      renderHiddenItem={ (data, rowMap) => (
        <View style={{height: '100%', justifyContent: 'flex-end', flexDirection: 'row' }}>
          <TouchableOpacity
          onPress={() => {
            if (data['item']['author']) {
              setUserId(data['item']['author'].id)
              setItemId(data['item']['id'])
              setModalBlock(true)
            } else {
              alert(language == 'English' ? "Can't find this user!" : 'Пользователь не найден')
              setUserId(0)
            }
          }}
          style={{height: '100%', backgroundColor: '#223DA4', justifyContent: 'center', alignItems: 'center', width: SCREEN_WIDTH * 0.23}}>
            <BlockIcon width={30} height={30} />
            <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Block' : 'Блок'}</Text>
          </TouchableOpacity>
            
        </View>
      )}
      rightOpenValue={-SCREEN_WIDTH * 0.23}
      ListFooterComponent={renderLoader}
      onEndReached={LoadMoreItem}
      onEndReachedThreshold={0.8}
      removeClippedSubviews={false}
      />
      ) : (
      !firstLoading && !chatsLoading ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#172136'}}>
      {sortChats == 1 ? <Text style={{ fontSize: 20, color: '#fff', fontFamily: 'SftMedium' }}>{language == 'English' ? 'You have no chats yet' : 'У вас пока нет чатов'}</Text> :
      <Text style={{ fontSize: 20, color: '#fff', fontFamily: 'SftMedium' }}>{language == 'English' ? "You didn't get any reactions yet" : 'Вы еще не получали реакций'}</Text>}
      </View> : <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#172136'
      }}>
        {/* <ActivityIndicator /> */}
        <LottieView
              source={require('../animation/anim_glasses.json')}
              style={{width: 100, height: 100 }}
              loop={true}
              autoPlay={true}
              // renderMode='SOFTWARE'
              speed={1}
            />
      </View>
      )}
      <Modal
        transparent={true}
        animationType='fade'
        visible={modal}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setItemId(0)
            setModal(false)
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
          {!loadingDelete ? <View
            style={{flexGrow: 1, justifyContent: 'center', backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setItemId(0)
              setModal(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftMedium', width: '80%' }}
            >{language == 'English' ? 'Are you sure you want to delete this chat?' : 'Вы точно хотите удалить этот чат?'}</Text>
            <Image
              source={require('../images/deleteChatImg.png')}
              style={{ width: '50%', aspectRatio: 1/1 }}
            />
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              deleteChat(itemId)
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Delete' : 'Удалить'}</Text>
          </TouchableOpacity>
          </View> : <View
            style={{flexGrow: 1, justifyContent: 'center', backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          ><ActivityIndicator /></View>}
          </View>
        </View>
    </Modal>
    <Modal
        transparent={true}
        animationType='fade'
        visible={modalBlock}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setItemId(0)
            setBlocked(0)
            setModalBlock(false)
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
            style={{flexGrow: 1, justifyContent: 'center', backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setItemId(0)
              setBlocked(0)
              setModalBlock(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftMedium', width: '80%' }}
            >{language == 'English' ? 'Are you sure you want to block this user?' : 'Вы точно хотите заблокировать этого пользователя?'}</Text>
            <Image
              cachePolicy={'disk'}
              source={sortChats == 1 ? (data.length > 0 && userId != 0 && itemId != 0 && data[data.findIndex(o => o.id === itemId)].users[0].photos.length > 0 && {uri: BASE_URL + data[data.findIndex(o => o.id === itemId)].users[0].photos[0].compressed_image_url}) : (reactionsData.length > 0 && userId != 0 && itemId != 0 && reactionsData[reactionsData.findIndex(o => o.id === itemId)].author.photos.length > 0 && {uri: BASE_URL + reactionsData[reactionsData.findIndex(o => o.id === itemId)].author.photos[0].compressed_image_url})}
              style={{ width: '35%', aspectRatio: 1/1, margin: 20, borderRadius: 100, backgroundColor: '#0F1825' }}
            />
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              blockUser(userId, itemId)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Block' : 'Заблокировать'}</Text>
          </TouchableOpacity>
          </View>

          {blocked != 0 && <View
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, backgroundColor: '#172136' }}
          >
            
          <View
            style={{ flex: 1, alignItems: 'center',
               justifyContent: 'center'
             }}
          >
          <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftMedium', width: '80%' }}
            >{language == 'English' ? `${blocked == 1 ? 'User has been blocked' : blocked == 2 ? 'This user is already blocked' : 'Something went wrong'}` : `${blocked == 1 ? 'Пользователь заблокирован' : blocked == 2 ? 'Этот пользователь уже заблокирован' : 'Что то пошло не так'}`}</Text>
            {/* <Image
              source={{uri: blockUserImage}}
              style={{ width: '45%', aspectRatio: 1/1, margin: 10 }}
            /> */}
            </View>
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setItemId(0)
              setBlocked(0)
              setModalBlock(false)
            }}
          />
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, marginBottom: 30,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, alignSelf: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setItemId(0)
              setBlocked(0)
              setModalBlock(false)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Ok' : 'Ок'}</Text>
          </TouchableOpacity>
          </View>}

          </View>
          {loadingDelete && <View
            style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute', alignItems: 'center',
            justifyContent: 'center', }}
          >
            <ActivityIndicator />
          </View>}
        </View>
    </Modal>
     </View>
     
  )
}

const styles = StyleSheet.create({
    cardStyle: {
        padding: 12,
        backgroundColor: '#172136',
        // shadowOpacity: 1,
        // shadowColor: '#8E8E93',
        // shadowRadius: 0.5,
        // shadowOffset : {width: 0, height: 0},
        borderRadius: 0,
        height: 95
    },
})

export default Home