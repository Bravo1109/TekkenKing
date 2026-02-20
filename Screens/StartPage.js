import React, {useState, useEffect, useRef, useContext} from 'react';
import { Text, Image, View, Modal, ActivityIndicator, AppState, TouchableOpacity,
Dimensions, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { UnreadContext } from './UnreadContext';
import { useNavigationState } from '@react-navigation/native';
import AppContext from './AppContext';
import Toast from 'react-native-toast-message';
import * as Font from 'expo-font';
import BlockUSerImg from '../images/blocked.png'
import { BASE_URL } from './config';
import Constants from 'expo-constants'


function StartPage(props) {
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
  const [fontsLoaded, setfFontsLoaded] = useState(false)
  const _loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setfFontsLoaded(true);
  }
  _loadFontsAsync()
  getTokenData = async () => {
    try {
      const tokenData = await AsyncStorage.getItem('token')
      // console.log('tokenbd',token)
      return tokenData
    } catch(e) {
      console.log('error', e)
      setLoading(false)
    }
  }
  
  const { hasMessages, setHasMessages, hasLobby, setHasLobby, hasMatches, setHasMatches, hasLikes, setHasLikes, hasReactions, setHasReactions, hasAlfredMes, setHasAlfredMes, hasPartyRequests, setHasPartyRequests, hasAcceptedPartyRequests, setHasAcceptedPartyRequests } = useContext(UnreadContext);
  const SCREEN_WIDTH = Dimensions.get('window').width
  const SCREEN_HEIGHT = Dimensions.get('window').height
  const [lastLikeId, setLastLikeId] = useState(false)
  const [partyRequestsHas, setPartyRequestsHas] = useState([])
  const [partyRequestsHasStarted, setPartyRequestsHasStarted] = useState(false)
  const [partyRequestsAccepted, setPartyRequestsAccepted] = useState([])
  const [partyRequestsAcceptedStarted, setPartyRequestsAcceptedStarted] = useState(false)
  const [appState, setAppState] = useState(AppState.currentState);
  const blockUserImage = Image.resolveAssetSource(BlockUSerImg).uri
  const [modalBlockedAccount, setModalBlockedAccount] = useState(false)
  const [modalBlockedReason, setModalBlockedReason] = useState('')
  const [modalDeletedAccount, setModalDeletedAccount] = useState(false)
  const timerRef = useRef(null);
  const timerRefUread = useRef(null);
  const [checkMes, setCheckMes] = useState(0)
  const [checkUnread, setCheckUnread] = useState(0)
  const writeUserData = async (value) => {
    try {
        await AsyncStorage.setItem('user', value)
    } catch(e) {
        console.log('error', e)
    }
    console.log('Done', value)
  }
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  let status = 0;
  const notificationListener = useRef();
  const responseListener = useRef();
  const [selfId, setSelfId] = useState(0);
  const [selfTokens, setSelfTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const isFocused = useIsFocused();
  const token = getTokenData()
  const loadData = async () => {
    console.log('logout', token)
    await fetch(`${BASE_URL}/api/users/me/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then((resp) => {
      status = resp.status
      return resp.json()
    }).then((resp) => {
      console.log('tokenLoad', token._j)
      console.log('tokkkk', expoPushToken)
      if (status == 200) {
        setSelfId(resp.id)
        if (!resp.blocked && !resp.deleted) {
          if (expoPushToken != null) {
            let count = 0;
            for (let i = 0; i < resp.tokens.length; i++) {
              if (resp.tokens[i] == expoPushToken) {
                count += 1
              }
            }
            if (count == 0) {
              createNewTokenExpo(expoPushToken)
            }
          }
          props.navigation.navigate("App")
          writeUserData(resp.id.toString())
          setLoading(false)
          updateOnlineStatus(resp.id)
        } else if (resp.blocked) {
          setModalBlockedAccount(true)
          setModalBlockedReason(resp.block_reason)
        } else if (resp.deleted) {
          setModalDeletedAccount(true)
        }
      }
      else {
        props.navigation.navigate("Signin")
        setLoading(false)
      }
    })
    .catch(error => {
      console.log("Error", error)
      AsyncStorage.removeItem('token')
      props.navigation.navigate('Signin')
      setLoading(false)
    })
  }
  const removeTokenData = async () => {
    await AsyncStorage.removeItem('token');
  }

  const checkToken = () => {
    removeTokenData()
    .then(() => {
      console.log('exittoken',AsyncStorage.getItem('token'))
      props.navigation.navigate("Signin")
    })
    .catch(
      console.log('error')
    )
  }

  const recoverAccount = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/account_delete/recover_acc/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      loadData()
    })
    .catch(error => {
      console.log("Error", error)
      setLoading(false)
    })
  }

  const checkExpoToken = async () => {
    await fetch(`${BASE_URL}/api/users/me/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then((resp) => {
      status = resp.status
      return resp.json()
    }).then((resp) => {
      console.log('tokenLoad', token._j)
      console.log('tokkkk', expoPushToken)
      if (status == 200) {
        if (!resp.blocked && !resp.deleted) {
          props.navigation.navigate("App")
          let count = 0;
          for (let i = 0; i < resp.tokens.length; i++) {
            if (resp.tokens[i] == expoPushToken) {
              count += 1
            }
          }
          if (count == 0) {
            createNewTokenExpo(expoPushToken)
          }
        } else if (resp.blocked) {
          setModalBlockedAccount(true)
          setModalBlockedReason(resp.block_reason)
        } else if (resp.deleted) {
          setModalDeletedAccount(true)
        }
      }
    })
    .catch(error => {
      console.log("Error", error)
      setLoading(false)
    })
  }
  
  const createNewTokenExpo = (expoToken) => {
    console.log(token._j)
    fetch(`${BASE_URL}/api/expotokens/`, {
        method:"POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${token._j}`
        },
        body: JSON.stringify({
          token: expoToken
        })
      })
  }

  const updateOnlineStatus = async (id) => {
    clearTimeout(timerRef.current)
    let now = new Date();
    console.log(now)
    await fetch(`${BASE_URL}/api/users/${id}/`, {
        method:"PATCH",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${token._j}`
        },
        body: JSON.stringify({
          last_seen: now
        })
      }).then(() => {
        reload()
    })
  }
  const routeName = useNavigationState(state => 
    state.routes[state.index].name
  );
 

  const updateUnread = () => {
    clearTimeout(timerRefUread.current)
    if (AppContext.navigationRef?.getCurrentRoute().name != 'Home'
     && AppContext.navigationRef?.getCurrentRoute().name != 'Chat'
     && AppContext.navigationRef?.getCurrentRoute().name != 'PartyOpenedStack'
     && AppContext.navigationRef?.getCurrentRoute().name != 'Signin'
     && AppContext.navigationRef?.getCurrentRoute().name != 'UserInfo'
     && AppContext.navigationRef?.getCurrentRoute().name != 'Sex'
     && AppContext.navigationRef?.getCurrentRoute().name != 'PhotoAdd'
     ) {
      fetch(`${BASE_URL}/api/updates/`, {
        method:"GET",
        headers: {
          'Authorization': `${token._j}`
        }
      }).then((resp) => {
        reloadUnread()
        return resp.json()
      }).then((res) => {
        const getLastLike = async () => {
          try {
            let likeData = await AsyncStorage.getItem(`lastLike${selfId}`)
            if(likeData != null) {
              if (res.results[0].last_like_id > parseInt(likeData)) {
                setHasLikes(true)
              } 
              if (res.results[0].last_like_id <= parseInt(likeData)) {
                setHasLikes(false)
              }
              return likeData
            }
            else {
              if (res.results[0].last_like_id > 0 && checkUnread > 0) {
                setHasLikes(true)
              } 
              return '0'
            }
          } catch(e) {
              console.log('error', e)
              return '0'
          }
        }
        const getLastReaction = async () => {
          try {
            let reactionData = await AsyncStorage.getItem(`lastReaction${selfId}`)
            if(reactionData != null) {
              if (res.results[0].last_reaction_id > parseInt(reactionData)) {
                setHasReactions(true)
              } 
              if (res.results[0].last_reaction_id <= parseInt(reactionData)) {
                setHasReactions(false)
              }
              return reactionData
            }
            else {
              if (res.results[0].last_reaction_id > 0 && checkUnread > 0) {
                setHasReactions(true)
              } 
              return '0'
            }
          } catch(e) {
              console.log('error', e)
              return '0'
          }
        }
          getLastLike()
          // getLastReaction()
          
          if (!partyRequestsHasStarted || JSON.stringify(res.results[0].unread_party_requests) != JSON.stringify(partyRequestsHas)) {
            setHasPartyRequests(res.results[0].unread_party_requests)
            setPartyRequestsHas(res.results[0].unread_party_requests)
            setPartyRequestsHasStarted(true)
          } 
          if (!partyRequestsAcceptedStarted || JSON.stringify(res.results[0].accepted_party_requests) != JSON.stringify(partyRequestsAccepted)) {
            setHasAcceptedPartyRequests(res.results[0].accepted_party_requests)
            setPartyRequestsAccepted(res.results[0].accepted_party_requests)
            setPartyRequestsAcceptedStarted(true)
          }

          if (res.results[0].unread_matches == true) {
            setHasMatches(true)
          } 
          if (res.results[0].unread_matches == false) {
            setHasMatches(false)
          }
          if (res.results[0].unread_messages == true) {
            setHasMessages(true)
          } 
          if (res.results[0].unread_messages == false) {
            setHasMessages(false)
          }
          if (res.results[0].unread_lobby == true) {
            setHasLobby(true)
          } 
          if (res.results[0].unread_lobby == false) {
            setHasLobby(false)
          }
          if (res.results[0].unread_alfred == true) {
            setHasAlfredMes(true)
          } 
          if (res.results[0].unread_alfred == false) {
            setHasAlfredMes(false)
          }
        }
        
      ).catch(error => {
        console.log("Error", error)
        reloadUnread()
      })
    } else {
      reloadUnread()
    }
    
  }

  const reload = () => {
    console.log('reloadUpdate')
    timerRef.current = setTimeout(() => {
      setCheckMes(checkMes + 1)
    }, 600000)
  }

  const reloadUnread = () => {
    console.log('reloadUnread')

    timerRefUread.current = setTimeout(() => {
      setCheckUnread(checkUnread + 1)
    }, 10000)
  }

  useEffect(() => {
    console.log('Modal Blocked Account State:', modalBlockedAccount);
  }, [modalBlockedAccount]);

  useEffect(() => {
    console.log('newwwwwwwwww')
    getTokenData()
    
    .then(() => {
      if(checkMes != 0) {
        updateOnlineStatus(selfId)
      }
        
      })
  }, [checkMes])

  useEffect(() => {
    console.log('checking unread')
    getTokenData()
    .then(() => {
      if(checkUnread != 0) {
        updateUnread()
      } 
      })
  }, [checkUnread])
  useEffect(() => {
  getTokenData()
  .then(() => {
    if(selfId != undefined && selfId != 0) {
      updateUnread()
    } 
  })
  
  }, [selfId])

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        if (notification.request.content.data['recipient_id'] == selfId) {
          if (appState != 'active') {
            return {
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: true,
            };
          }
          else {
            Toast.show({
              type: 'tomatoToast',
              position: 'top',
              text1: `${notification.request.content.title}`,
              text2: `${notification.request.content.body}`,
              visibilityTime: 4000,
              autoHide: true,
              topOffset: 40,
              bottomOffset: 0,
              props: {userImage: notification.request.content.data['userPhoto'], blur: notification.request.content.data['blur'], screen: notification.request.content.data['screen']}
            })
          }
        }
        return {
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }
      },
    })
  }, [selfId])

  useEffect(() => {
    registerForPushNotificationsAsync().then(etoken => setExpoPushToken(etoken));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return() => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [expoPushToken]);

  useEffect(() => {
    getTokenData()
      .then(() => {
        if(isFocused) {
          loadData()
        }
      })
  }, [isFocused])

  useEffect(() => {
    getTokenData()
      .then(() => {
        if(expoPushToken != null) {
          console.log('not null')
          checkExpoToken()
        }
      })
  }, [expoPushToken])

  
  return (
    <View 
      style={{ flex: 1, backgroundColor: '#172136', justifyContent: 'center', alignItems: 'center' }}
    >
    <ActivityIndicator/>
    {modalBlockedAccount && <View
        style={{ position: 'absolute', width: '100%', height: '100%' }}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.5,
            position:'absolute',
            left: 0,
            zIndex: 0
          }}
          activeOpacity={0.5}
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
              
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftMedium', width: '80%' }}
            >Your account was blocked</Text>
            <Text
              style={{ textAlign: 'center', fontSize: 17, color: '#6D7885', fontFamily: 'SftMedium', width: '80%', marginTop: 5 }}
            >The reason: {modalBlockedReason}</Text>
            <Image
              source={{uri: blockUserImage}}
              style={{ width: '45%', aspectRatio: 1/1, margin: 10 }}
            />
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalBlockedAccount(false)
              checkToken()
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>Ok</Text>
          </TouchableOpacity>
          </View>
          </View>
        </View>
    </View>}

    {modalDeletedAccount && <View
        style={{ position: 'absolute', width: '100%', height: '100%' }}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setModalDeletedAccount(false)
            checkToken()
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.5,
            position:'absolute',
            left: 0,
            zIndex: 0
          }}
          activeOpacity={0.5}
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
              setModalDeletedAccount(false)
              checkToken()
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftMedium', width: '80%' }}
            >Your account was deleted</Text>
            <Image
              source={require('../images/deletedUser.png')}
              style={{ width: '45%', aspectRatio: 1/1, margin: 10 }}
            />
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalDeletedAccount(false)
              recoverAccount()
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>Recover</Text>
          </TouchableOpacity>
          </View>
          </View>
        </View>
    </View>}
    </View>
  )
}

async function schedulePushNotification(pushToken) {
  await Notifications.scheduleNotificationAsync({
    content: {
      to: 'jhvih',
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
      showBadge: true,
      enableLights: true,
      enableVibrate: true,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export default StartPage