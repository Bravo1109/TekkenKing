import React, { useState, useEffect, useRef } from 'react'
import { Text, View, ActivityIndicator, Modal,
  TouchableOpacity, KeyboardAvoidingView, ImageBackground,
  ScrollView, Dimensions, StyleSheet, Platform, TextInput,
  Animated, Keyboard, AppState } from 'react-native';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IconButton } from 'react-native-paper'; 
import { BlurView } from 'expo-blur'
import Pen from '../images/pen.svg'
import ArrowLeft from '../images/arrow_up_left.svg'
import SendReaction from '../images/reactionsProfile.svg'
import ArrowBack from '../images/turnBack.svg';
import ReportUser from '../images/report.svg'
import Heart from '../images/like.svg'
import Close from '../images/close.svg'
import Accept from '../images/accept.svg'
import Svg, { Path, Circle } from 'react-native-svg'
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import * as Haptics from 'expo-haptics';
import { Shadow } from 'react-native-shadow-2';
import { BASE_URL } from './config';
import RateSlider from './RateSlider';
import * as Device from 'expo-device';
import { openBrowserAsync } from 'expo-web-browser';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrashIcon from '../images/trash.svg'

function Good(props) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [commentsData, setCommentsData] = useState([])
  const secondListRef = useRef(null);
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [choosenItem, setChoosenItem] = useState(0)
  const [likedChanged, setLikedChanged] = useState('none');
  const [language, setLanguage] = useState('')
  const [comments, setComments] = useState([])
  const [boostModal, setBoostModal] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsWindow, setCommentsWindow] = useState(false)
  const [commentSendModal, setCommentSendModal] = useState(false)
  const commentModalOpacity = useRef(new Animated.Value(0)).current;
  const [commentComunicationValue, setCommentComunicationValue] = useState(10)
  const [commentActivityValue, setCommentActivityValue] = useState(10)
  const [commentMessage, setCommentMessage] = useState('')
  const [commentSentLoading, setCommentSentLoading] = useState(false)
  const [commentSent, setCommentSent] = useState(0)
  const [messageSent, setMessageSent] = useState(false)
  const [reactSent, setReactSent] = useState(false)
  const bluredBg = require('../images/bluredProfile.png')
  const isFocused = useIsFocused();
  const nowDate = new Date()
  const [animEnd, setAnimEnd] = useState(false)
  const scale = useRef(new Animated.Value(1)).current;
  const pinchFocalX = useRef(new Animated.Value(0)).current;
  const pinchFocalY = useRef(new Animated.Value(0)).current;
  const [profileRate, setProfileRate] = useState(0)
  const [modalEmoji, setModalEmoji] = useState(false);
  const [modalReport, setModalReport] = useState(false);
  const [reportReason, setReportReason] = useState('none');
  const [reportDescriprion, setReportDescriprion] = useState('');
  const [reportReasonText, setReportReasonText] = useState('');
  const [loadingReaction, setLoadingReaction] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState)
  const [boosterIndex, setBoosterIndex] = useState(0)
  const deviceModel = Device.modelName;
  const [modalChange, setModalChange] = useState(false)
  const [changeTitle, setChangeTitle] = useState('')
  const [changeDesc, setChangeDesc] = useState('')
  
  const commentWindowOpacity = () => {
      setCommentSendModal(true)
      console.log('valueee', commentModalOpacity)
      Animated.timing(commentModalOpacity, {
        toValue: !commentSendModal ? 1 : 0,
        duration: 200,
        useNativeDriver: true
      }).start(() => {
        commentSendModal && setCommentSendModal(false)
      })
  }
  const SCREEN_WIDTH = Dimensions.get('window').width
  const SCREEN_HEIGHT = Dimensions.get('window').height
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight({ SCREEN_WIDTH, SCREEN_HEIGHT }, Platform.OS, insets.top) - 10
  const [pageNumber, setPageNumber] = useState(1)
  const [pageNumberModal, setPageNumberModal] = useState(1)
  const [errText, setErrText] = useState('')
  const [modalErr, setModalErr] = useState(false)
  const [text, setText] = useState("")
  const [modal, setModal] = useState(false)
  const [modalCash, setModalCash] = useState(false)
  const [modalGallery, setModalGallery] = useState(false)
  const [goodData, setGoodData] = useState(props.route.params.data)
  const [loading, setLoading] = useState(true);
  const [loadingChange, setLoadingChange] = useState(false)
  const token = getTokenData()
  const colorAnim = useRef(new Animated.Value(0)).current;
  const colorAnimLike = useRef(new Animated.Value(0)).current;
  const {id} = props.route.params.id


  const loadgoodData = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/goods/${id}/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      setChangeTitle(res.title)
      setChangeDesc(res.description)
      setGoodData(res)
      setLoading(false)
      setModalCash(false)
      setCommentsData(res.comments)
    })
    .catch(error => {
      console.log("Error", error)
      setLoading(false)
      setModalCash(false)
    })
  }

  const changeGood = () => {
      setLoadingChange(true)
      fetch(`${BASE_URL}/api/goods/${id}/`, {
        method:"PATCH",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${token._j}`,
        },
        body: JSON.stringify({
          title: changeTitle,
          description: changeDesc,
        })
      }).then((resp) => {
          status = resp.status
          return resp.json()
      })
      .then(datas => {
        if (status == 200) {
          setLoadingChange(false)
          setModalChange(false)
          loadgoodData()
        } else if (status == 403) {
          setLoadingChange(false)
          alert('Действие запрещено!')
        } else {
          setLoadingChange(false)
          alert('Ошибка! Название магазина и ссылка не могут быть пустыми')
        } 
      })
      .catch(error => {
        console.log("Error", error)
        setLoadingChange(false)
      })
    }

  const loadComments = () => {
    setCommentsLoading(true)
    fetch(`${BASE_URL}/api/users/${id}/estimation/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      // const uniqueData = [...comments, ...res.results].filter((item, index, array) => {
      //   return array.findIndex(t => t.id === item.id) === index;
      // });
      setComments(res.results)
      setCommentsLoading(false)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const sendRate = async () => {
    setCommentSentLoading(true)
    let status = 0
    await fetch(`${BASE_URL}/api/users/${id}/estimation/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${token._j}`
        },
        body: JSON.stringify({
          comunication: commentComunicationValue,
          activity: commentActivityValue,
          // comment: commentMessage
        })
    }).then((resp) => {
      status = resp.status
      return resp.json()
    }).then(res => {
      if (status == 201) {
        setCommentSent(1)
        loadComments()
      } else if (status == 403) {
        setCommentSent(2)
      } else {
        setCommentSent(3)
      }
    }).catch(error => {
      console.log("Error", error)
      setCommentSent(3)
    })
  }

  const reportUser = () => {
    setLoading(true)
    let status = 0
    fetch(`${BASE_URL}/api/complaint/${id}/`, {
      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${token._j}`
      },
      body: JSON.stringify({
        text: reportDescriprion,
        theme: reportReason
      })
    }).then((resp) => {
      status = resp.status
      return resp.json()
    })
    .then(res => {
      if (status == 201) {
        setLoading(false)
        setReportSent(true)
        setReportDescriprion('')
        setReportReason('none')
      } else {
        setLoading(false)
      }
    })
    .catch(error => {
      console.log("Error", error)
      setLoading(false)
    })
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState)
    });

    return () => {
      subscription.remove();
    }
  }, []);
  useEffect(() => {
    const listenerId = scrollX.addListener(({ value }) => {
      if (secondListRef.current) {
        secondListRef.current.scrollToOffset({
          offset: value,
          animated: false, // можно поставить true, если нужна плавность
        });
      }
    });
    // В конце убираем подписку
    return () => {
      scrollX.removeListener(listenerId);
    };
  }, [scrollX]);

  const flatListRef = useRef(null);
  const handleGoToSecond = (num) => {
    if (flatListRef.current != null) {
      flatListRef.current.scrollToIndex({ index: num - 1, animated: false });
    }
  };

  const getItemLayout = (data, index) => ({
    length: SCREEN_WIDTH, // set the height of your item here
    offset: SCREEN_WIDTH * index,
    index,
  });

  const handleLayout = (num) => {
    setTimeout(() => {
      handleGoToSecond(num);
    }, 0);
  };

  const sendMessage = (tokens) => {
    let status = 0
    fetch(`${BASE_URL}/api/users/${id}/chats/create/`, {
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
            setMessageSent(true)
            setLoading(false)
            return resp.json()
          } else if (resp.status == 403) {
            status = 403
            alert(language == 'english' ? 'This user is in your black list!' : 'Этот пользователь в вашем черном списке')
            setLoading(false)
            setModal(false)
          }
        }).then((resp) => {
          // if(status == 201 && text != '') {
          //   for (let i = 0; i < tokens.length; i++) {
          //   // const element = tokens[i];
          //     sendPushNotification(tokens[i], id, 'New Message!', text, (`${BASE_URL}` + resp.sender_photo), 0, 'ChatList')
          //   }
          // }
        }).catch(error => {
            console.log('error', error)
            setLoading(false)
          })
        }
  const sendLike = async (tokens) => {
    console.log('like')
    setLikedChanged('like')
    await fetch(`${BASE_URL}/api/users/${id}/like/create/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${token._j}`
        }
    }).then((res) => {
      return res.json()
    }).then((resp) => {
      for (let i = 0; i < tokens.length; i++) {
        // const element = tokens[i];
        if (resp.is_mutually == false) {
          // {resp.sender.photos.length > 0 && sendPushNotification(tokens[i], id, 'New Like!', 'Somebody liked you', `${BASE_URL}` + resp.sender.photos[0].compressed_image_url, 50, 'Likes')}
        } else {
          // {resp.sender.photos.length > 0 && sendPushNotification(tokens[i], id, 'Match!', 'You have a new match!', `${BASE_URL}` + resp.sender.photos[0].compressed_image_url, 0, 'Likes')}
          {resp.recipient_photo != null && Toast.show({
            type: 'tomatoToast',
            position: 'top',
            text1: 'Match!',
            text2: 'You have a new match!',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 40,
            bottomOffset: 0,
            props: {userImage: `${BASE_URL}` + resp.recipient_photo, screen: 'Likes'}
          })}
        }
        
      }
    })
  }

  const sendDislike = async () => {
    console.log('Dislike')
    setLikedChanged('dislike')
    await fetch(`${BASE_URL}/api/users/${id}/dislike/create/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${token._j}`
        }
    })
  }

  const interpolateColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FF2525', '#aaa'],
  });

  const interpolateColorLike = colorAnimLike.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E2FF6C', '#aaa'],
  });
  const [colorSv, setColorSv] = useState('#FF2525')
  const [colorSvLike, setColorSvLike] = useState('#E2FF6C')

  const sendAction = (action, text) => {
    setLoadingReaction(true)
    let status = 0
    fetch(`${BASE_URL}/api/reactions/`, {
      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${token._j}`
      },
      body: JSON.stringify({
        recipient: goodData.id,
        action: action
      })
    }).then((resp) => {
      if(resp.status == 201 && text != '') {
        status = 201
        setLoadingReaction(false)
        setReactSent(true)
        return resp.json()
      } else if (resp.status == 403) {
        status = 403
        alert(language == 'english' ? 'This user is in your blacklist' : 'Этот пользователь в вашем черном списке')
        setLoadingReaction(false)
        setModalEmoji(false)
        return resp.json()
      }
    }).then((resp) => {
      // if(status == 201 && text != '') {
      //   for (let i = 0; i < resp.tokens.length; i++) {
      //     sendPushNotification(resp.tokens[i], goodData.id, 'New Reaction!', `${resp.author.name}${text}`, `${BASE_URL}${resp.author.photos[0].compressed_image_url}`, 0, 'ChatList')
      //   }
      // }
    })
    .catch(error => {
      console.log("Error", error)
      setLoadingReaction(false)
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

  const renderCommentsData = () => {
      const data = commentsData
      return data.map((item, i) => {
        return(
          <View
            key={item.id} 
            style={{width: '100%', marginTop: 15}}>
          <View style={{flexDirection:"row", alignItems: 'flex-start', width: '100%'}}>
          <ImageBackground
            resizeMode='contain'
            style={{width: 50, aspectRatio: 1/1, overflow: 'hidden', backgroundColor: '#0F1825',
            borderRadius: 100}}
            >
              {item.user.photos.length > 0 && <Image
                style={{width:'100%', height:'100%', opacity: 1}}
                cachePolicy={'disk'}
                source={{
                 uri: `${BASE_URL}${item.user.photos[0].compressed_image_url}`
                }}
               />}
          </ImageBackground>
          
            <View
              style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10, alignItems: 'flex-start', justifyContent: 'flex-start', width: SCREEN_WIDTH * 0.9 - 110}}
            >
              <Text
               numberOfLines={1}
               style = {{fontSize:15, color: '#fff', fontFamily: 'SftBold', maxWidth: SCREEN_WIDTH * 0.9 - 110}}>
                {item.user.name}</Text>
              <Text
               style = {{fontSize:15, color: '#fff', fontFamily: 'SftMedium'}}>
                {item.text}</Text>
            </View>
            {item.user.id == goodData.myId && <TouchableOpacity
              onPress={() => {
                deleteComment(item.id)
                setChoosenItem(item.id)
              }}
            >
              {loadingDelete && choosenItem == item.id ? <ActivityIndicator /> :
              <TrashIcon width={30} height={30} color={'tomato'} />}
            </TouchableOpacity>}
          </View>
        </View>
        )
    })
      }
    
  const sendComment = () => {
      let status = 0
      fetch(`${BASE_URL}/api/goods/${id}/comment/`, {
          method:"POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${token._j}`
          },
          body: JSON.stringify({
            text: text.trim(),
            good: id
          })
          }).then((resp) => {
            if(resp.status == 201 && text != '') {
              status = 201
              setLoading(false)
              setModal(false)
              loadgoodData()
              return resp.json()
            } else if(resp.status == 404) {
              alert('Ошибка')
              setModal(false)
              setLoading(false)
            }
          }).then((resp) => {
            // if(status == 201 && text != '') {
            //   for (let i = 0; i < tokens.length; i++) {
            //   // const element = tokens[i];
            //     sendPushNotification(tokens[i], id, 'New Message!', text, (`${BASE_URL}` + resp.sender_photo), 0, 'ChatList')
            //   }
            // }
          }).catch(error => {
              console.log('error', error)
              alert('Что-то пошло не так')
              setModal(false)
              setLoading(false)
            })
          }

  const deleteComment = (comment_id) => {
      setLoadingDelete(true)
      fetch(`${BASE_URL}/api/goods/${id}/comment/${comment_id}/`, {
          method:"DELETE",
          headers: {
            'Authorization': `${token._j}`
          }
        }).then((res) => {
          if(res.status == 204) {
            const newCommentsData = commentsData.filter(item => item.id !== comment_id);
            setCommentsData(newCommentsData);
            setLoadingDelete(false)
            setChoosenItem(0)
            // setDeleted(true)
          }
        }).catch(error => {
          setLoadingDelete(false)
          setChoosenItem(0)
          console.log("Error del", error)
        })
    }

  const iconStyle = {
    fill: interpolateColor.toLocaleString()
  };

  const updatedIconStyle = {
    ...iconStyle,
    fill: interpolateColor.__getValue()
  };

  const AnimatePath = Animated.createAnimatedComponent(Path)
  const AnimateCircle = Animated.createAnimatedComponent(Circle)

  getTokenData = async () => {
    try {
        tokenData = await AsyncStorage.getItem('token')
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
  
  useEffect(() => {
    getLanguageData()
    getTokenData()
      .then(() => {
        if (isFocused) {
          loadgoodData()
        }
      })
  }, [isFocused])

  const renderGallery = (item, blur=0) => {
    return(
    <View style={{ width: SCREEN_WIDTH, height: '100%' }}>
      <TouchableOpacity
        onPress={() => {
          setModalGallery(true)
          setPageNumberModal(pageNumber)
          handleLayout(pageNumber)
        }}
        activeOpacity={1}
      >
          <ImageBackground
            resizeMode='contain'
            style={{width:'100%', height: '100%', backgroundColor: '#000',
            position: 'absolute', alignItems: 'center', justifyContent: 'center'}}
          >
          <Image
            style={{width: 30, height: 30, backgroundColor: 'black'}}
            source={require('../images/onload.gif')}
          />
          </ImageBackground>
          <Image
            style={{width:'100%', height: '100%', backgroundColor: 'transparent'}}
            cachePolicy={'disk'}
            source={{
              uri: `${BASE_URL}${item.compressed_image_url}`
            }}
            blurRadius={blur}
          />
        </TouchableOpacity>
      </View>
    )
  }

  // const renderCommentsData = (item) => {
  //   return(
  //     <View
  //       style={{ width: '100%', flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'flex-start' }}
  //     >
  //       <Image
  //         style={{ width: 50, height: 50, backgroundColor: '#aaa', borderRadius: 100 }}
  //         source={{uri: `${BASE_URL}${item.photo.slice(0, -5) + '.full.jpeg'}`}}
  //         blurRadius={8}
  //       />
  //       <View
  //         style={{ marginLeft: 5, width: SCREEN_WIDTH * 0.9 - 75 }}
  //       >
  //         <View
  //           style={{ flexDirection: 'row', alignItems: 'center' }}
  //         >
  //           <Star fill={'yellow'} height={10} width={10} />
  //           <Text
  //             style={{ color: '#fff', fontSize: 10, marginLeft: 5, fontFamily: 'SftBold' }}
  //           >Общительность: {item.comunication}</Text>
  //         </View>
  //         <View
  //           style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}
  //         >
  //           <Star fill={'yellow'} height={10} width={10} />
  //           <Text
  //             style={{ color: '#fff', fontSize: 10, marginLeft: 5, fontFamily: 'SftBold' }}
  //           >Адекватность: {item.activity}</Text>
  //         </View>
          
  //         <Text
  //           style={{ color: '#fff', marginTop: 5, fontFamily: 'SftMedium' }}
  //         >💬 {item.comment}</Text>
  //       </View>
        
  //     </View>
  //   )
  // }

  const renderModalGallery = (item) => {
    return(
    <View style={{ width: SCREEN_WIDTH, height: '100%' }}>
          <ImageBackground
            resizeMode='contain'
            style={{width:'100%', height: '100%', backgroundColor: '#000',
            position: 'absolute', alignItems: 'center', justifyContent: 'center'}}
          >
          <Image
            style={{width: 30, height: 30, backgroundColor: 'black'}}
            source={require('../images/onload.gif')}
          />
          </ImageBackground>
          <Image
            style={{width:'100%', height: '100%', backgroundColor: 'transparent'}}
            cachePolicy={'disk'}
            source={{
              uri: `${BASE_URL}${item.compressed_image_url}`
            }}
          />
      </View>
    )
  }

  const renderPhotos = () => {
    const data = goodData.photos
    return goodData.photos.map((item, i) => {
        return (
        <View style={{ width: '33%', padding: 5 }}
        key={item.id} >
        <TouchableOpacity
        onPress={() => {
          setModalGallery(true)
          setPageNumberModal(i + 1)
          handleLayout(i + 1)
        }}
        activeOpacity={1}
      >
        <ImageBackground
            resizeMode='contain'
            style={{width:'100%', aspectRatio: 1/1, backgroundColor: '#000',
            alignItems: 'center', justifyContent: 'center', borderRadius: 20, overflow: 'hidden'}}
          >
            <Image
            style={{width: 15, height: 15, backgroundColor: 'black', position: 'absolute'}}
            source={require('../images/onload.gif')}
          />
          <Image
          
          style={{ width: '100%', aspectRatio: 1/1, zIndex: 10 }}
          source={{
          uri: `${BASE_URL}${item.compressed_image_url}`
        }}
        />
        </ImageBackground>
        </TouchableOpacity>
        </View>
        )
    })
  }


  if(!goodData) {
    return(
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#172136',
      }}>
        <ActivityIndicator />
      </View>
    )
  };
  return (
    <View style={{ flex:1, backgroundColor: '#172136', width: '100%'}}>
      <TouchableOpacity
        onPress={() => {
            props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key})); 
        }}
        style={{left: 20, top: 50, borderRadius: 100, width: 40, height: 40,
          alignItems: 'center', justifyContent: 'center', zIndex: 11111, position: 'absolute',
          backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1, elevation: 3 }}
        activeOpacity={1}
        >
          <ArrowLeft width={30} height={30} fill={'#2688EB'} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setModalChange(true)
        }}
        style={{position: 'absolute', zIndex: 11111, right: 20, top: 50, borderRadius: 100, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', 
          backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1 }}
        activeOpacity={1}
        >
          <Pen width={20} height={20} fill={'#2688EB'} />
      </TouchableOpacity>
          
      <View style={{ width: '100%', height: 90, backgroundColor: '#0F1421',
        position: 'absolute', bottom: 0, zIndex: 100, alignItems: 'center' }}>
        <View style={{ width: '90%', marginTop: 10 }}>
        <TouchableOpacity
          onPress={() => {
              setModal(true)
          }}
          style={[{ borderWidth: 1, borderColor: '#90A9FF', borderRadius: 100, paddingVertical: 12, backgroundColor: '#0F1421',
          shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.8, shadowRadius: 5 }, 
          Platform.OS === 'android' && {elevation: 3}]}
          activeOpacity={0.8}
          >
          <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Comment' : 'Комментировать'}</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    <ScrollView
    keyboardShouldPersistTaps='handled'
    contentContainerStyle={{alignItems: 'center', flexGrow: 1, width: '100%', backgroundColor: '#172136'}}
    scrollIndicatorInsets={{right: 1}}
    showsVerticalScrollIndicator={false}
     >
      <View style={{width:'100%', height: 0.5 * SCREEN_HEIGHT}}>
        <ImageBackground
        resizeMode='contain'
        style={{width:'100%', height: '100%'}}
        >
          {goodData.compressed_image_url && (
          <View>
          <View style={{ zIndex: 100, width: '100%', height: 120, position: 'absolute', opacity: 0.5 }}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']}
              start={{
                x:0,
                y:0
              }}
              end={{
                x:0,
                y:1
              }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          <View style={{ width: SCREEN_WIDTH, height: '100%' }}>
      <TouchableOpacity
        activeOpacity={1}
      >
          <ImageBackground
            resizeMode='contain'
            style={{width:'100%', height: '100%', backgroundColor: '#000',
            position: 'absolute', alignItems: 'center', justifyContent: 'center'}}
          >
          <Image
            style={{width: 30, height: 30, backgroundColor: 'black'}}
            source={require('../images/onload.gif')}
          />
          </ImageBackground>
          <Image
            style={{width:'100%', height: '100%', backgroundColor: 'transparent'}}
            cachePolicy={'disk'}
            source={{
              uri: `${BASE_URL}${goodData.compressed_image_url}`
            }}
          />
        </TouchableOpacity>
      </View></View>)}
        </ImageBackground>
        
        </View>
        {/* <View
              style={[{ height: '0%', width: SCREEN_WIDTH, 
              alignSelf: 'center', marginTop: '20%', zIndex: 100 }]}
            >
            {!goodData.profile || goodData.profile.my_profile == 0 ? <BlurView style={{ position: 'absolute', width: '90%', alignSelf: 'center', zIndex: 100, bottom: 0,
            borderRadius: 40, overflow: 'hidden', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            intensity={70}
            >
            {Platform.OS === 'android' && <Animated.FlatList
            ref={secondListRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            indicatorStyle={"white"}
            bounces={true}
            data={goodData.photos}
            pagingEnabled={true}
            onMomentumScrollEnd={onScrollEnd}
            contentContainerStyle={{justifyContent: 'flex-start'}}
            scrollEventThrottle={32}
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.75, position: 'absolute',
              bottom: 0, marginBottom: '10%', left: '-5%'}}
            onScroll={Animated.event(
              [{ 
                nativeEvent: { 
                  contentOffset: { x: scrollX }
                } 
              }],
              { useNativeDriver: true } // или true, если анимации подходят
            )}
            renderItem = {({item}) => {
              return renderGallery(item, 20)
            }}
            keyExtractor = {item => `${item.id}`}
          />}
            {Platform.OS === 'android' && <View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)', zIndex: 1 }}
            >
            </View>}
            {Platform.OS === 'android' && !goodData.deleted && !goodData.blocked && <LinearGradient
                colors={['transparent', '#3B5062']}
                start={{
                  x:0,
                  y:0
                }}
                end={{
                  x:0,
                  y:0.9
                }}
              style={{position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              marginBottom: 0,
              height: '100%',}}
            />}
            {Platform.OS === 'android' && (goodData.deleted || goodData.blocked) && <LinearGradient
                colors={['#3B5062', '#3B5062',]}
                start={{
                  x:0,
                  y:0.1
                }}
                end={{
                  x:0,
                  y:0.5
                }}
              style={{position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              marginBottom: 0,
              height: '100%',}}
            />}
              <View style={{width: '100%', zIndex: 0, paddingVertical: 25, paddingHorizontal: 30, zIndex: 10 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
               {!goodData.deleted && !goodData.blocked ? <Text style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                color: '#fff', letterSpacing: 0, marginRight: 2}}
              >{!goodData.name.length <= 20
                ? `${goodData.name}`
                : `${goodData.name.substring(0, 17)}...`}, {goodData.age}</Text> :
                <Text style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                color: '#fff', letterSpacing: -1}}>{goodData.deleted ? 'DELETED' : 'BLOCKED'}</Text>}
                {goodData.verified && <CheckMark width={30} height={30} style={{ shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: {width: 0, height: 0}, shadowRadius: 3 }} />}
                {((nowDate - new Date(goodData.last_seen)) / 60 / 1000) < 15 && <View
                  style={{ backgroundColor: '#65B141', width: 7, aspectRatio: 1/1, borderRadius: 100, marginLeft: 5 }}
                ></View>}
                </View>
                <View >
                {goodData.profile && goodData.profile.description != '' ? <Text
                style={{ color: '#fff', marginTop: 15, minHeight: 35, fontSize: 15, fontFamily: 'SftMedium',
                 }}
                 ellipsizeMode='tail'
                 numberOfLines={2}
                >{goodData.profile.description}</Text> :
                <Text
                style={{ color: '#fff', marginTop: 15, fontFamily: 'SftMedium', height: 35 }}
                numberOfLines={2}
                >{language == 'English' ? 'No description': 'Нет описания'}</Text>}
                </View>
                 
                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{ width: '50%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Location width={20} height={20} fill='#fff'/>
                    <Text
                      style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium'}}
                    >{language == 'English' ? goodData.city.name_eng : goodData.city.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                  <CircleStar width={20} height={20} style={{color: '#fff'}} />
                  <Text
                  style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium' }}
                  >Rating: <Text
                    style={goodData.boosted && { color: '#ffa420' }}
                  >{goodData.rating}</Text></Text>
                  </View>
                </View>
                <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                {goodData.profile && (goodData.profile.liked == 0 || goodData.profile.liked == 2) && !goodData.deleted && !goodData.blocked ? <TouchableOpacity
                  style={{ marginRight: 20 }}
                  activeOpacity={1}
                  onPress={() => {
                    animateColor(1)
                    {goodData.profile.liked != 1 && goodData.profile.liked != 2 && sendDislike()}
                  }}
                >
                  <Svg xml={Close} width="55" height="55" viewBox="27 27 50 50">
                  {Platform.OS == 'ios' ? <AnimatePath d={paths[1]} fill={colorSv} /> :
                  <AnimatePath d={paths[1]} fill={colorSv} />}
                  {Platform.OS == 'ios' ? <AnimateCircle cx="52" cy="52" r="23" stroke={colorSv} fill={'transparent'} strokeWidth="2" shapeRendering="crispEdges" />:
                  <AnimateCircle cx="52" cy="52" r="23" stroke={colorSv} fill={'transparent'} strokeWidth="2" shapeRendering="crispEdges" />}
                </Svg>
                  </TouchableOpacity>: <TouchableOpacity
                  style={{ marginRight: 20 }}
                  activeOpacity={1}
                ><Svg xml={Close} width="55" height="55" viewBox="27 27 50 50">
                  <Path d={paths[1]} fill={'#aaa'} />
                  <Circle cx="52" cy="52" r="23" stroke={'#aaa'} fill={'transparent'} strokeWidth="2" shapeRendering="crispEdges" />
                </Svg>
                  </TouchableOpacity>}
                  {goodData.profile && (goodData.profile.liked == 0 || goodData.profile.liked == 1) && !goodData.deleted && !goodData.blocked  ? <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    animateColor(0)
                    {goodData.profile.liked != 1 && goodData.profile.liked != 2 && sendLike(goodData.tokens)}
                  }}
                ><Svg xml={Heart} width="55" height="55" viewBox="27 27 50 50">
                {Platform.OS == 'ios' ? <AnimatePath d={paths[0]} fill={colorSvLike} />:
                 <AnimatePath d={paths[0]} fill={colorSvLike} />}
                {Platform.OS == 'ios' ? <AnimateCircle cx="52" cy="52" r="23" stroke={colorSvLike} fill={'transparent'} strokeWidth="2" shapeRendering="crispEdges" />:
                <AnimateCircle cx="52" cy="52" r="23" stroke={colorSvLike} fill={'transparent'} strokeWidth="2" shapeRendering="crispEdges" />}
                </Svg>
                  </TouchableOpacity> : <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                  }}
                ><Svg xml={Heart} width="55" height="55" viewBox="27 27 50 50">
                <Path d={paths[0]} fill={'#aaa'} />
                <Circle cx="52" cy="52" r="23" stroke={'#aaa'} fill={'transparent'} strokeWidth="2" shapeRendering="crispEdges" />
                </Svg>
                  </TouchableOpacity>}
                </View>
                </View>

              </View>
             
            </BlurView> : <BlurView style={{ position: 'absolute', width: '90%', alignSelf: 'center', zIndex: 100, bottom: 0,
            borderRadius: 40, overflow: 'hidden', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            intensity={70}
            >
              {Platform.OS === 'android' && <Animated.FlatList
            ref={secondListRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            indicatorStyle={"white"}
            bounces={true}
            data={goodData.photos}
            pagingEnabled={true}
            onMomentumScrollEnd={onScrollEnd}
            contentContainerStyle={{justifyContent: 'flex-start'}}
            scrollEventThrottle={32}
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.75, position: 'absolute',
              bottom: 0, marginBottom: '10%', left: '-5%'}}
            onScroll={Animated.event(
              [{ 
                nativeEvent: { 
                  contentOffset: { x: scrollX }
                } 
              }],
              { useNativeDriver: true } // или true, если анимации подходят
            )}
            renderItem = {({item}) => {
              return renderGallery(item, 20)
            }}
            keyExtractor = {item => `${item.id}`}
          />}
            {Platform.OS === 'android' && <View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)', zIndex: 1 }}
            >
            </View>}
            {Platform.OS === 'android' && <LinearGradient
                colors={['rgba(0, 0, 0, 0)', '#3B5062']}
                start={{
                  x:0,
                  y:0
                }}
                end={{
                  x:0,
                  y:0.9
                }}
              style={{position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              marginBottom: 0,
              height: '100%',}}
            />}
              <View style={{width: '100%', zIndex: 0, paddingVertical: 25, paddingHorizontal: 30 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
               <Text style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                color: '#fff', letterSpacing: 0, marginRight: 2}}
              >{goodData.name.length <= 20
                ? `${goodData.name}`
                : `${goodData.name.substring(0, 17)}...`}, {goodData.age}</Text>
                {goodData.verified && <CheckMark width={30} height={30} style={{ shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: {width: 0, height: 0}, shadowRadius: 3 }} />}
                <View
                  style={{ backgroundColor: '#65B141', width: 7, aspectRatio: 1/1, borderRadius: 100, marginLeft: 5 }}
                ></View>
                </View>
                <View >
                {goodData.profile && goodData.profile.description != '' ? <Text
                style={{ color: '#fff', marginTop: 15, minHeight: 35, fontSize: 15, fontFamily: 'SftMedium',
                 }}
                 ellipsizeMode='tail'
                 numberOfLines={2}
                >{goodData.profile.description}</Text> :
                <Text
                style={{ color: '#fff', marginTop: 15, fontFamily: 'SftMedium', height: 35 }}
                numberOfLines={2}
                >{language == 'English' ? 'No description': 'Нет описания'}</Text>}
                </View>
                <View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{ width: '50%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Location width={20} height={20} fill='#fff'/>
                    <Text
                      style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium'}}
                    >{language == 'English' ? goodData.city.name_eng : goodData.city.name}</Text>
                  </View>
                  
                </View>
                <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                  <CircleStar width={20} height={20} fill='#fff'/>
                  <Text
                  style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium' }}
                  >Rating: <Text
                    style={goodData.boosted && { color: '#ffa420' }}
                  >{goodData.rating}</Text></Text>
                  </View>
                </View>
                </View>

              </View>
             
            </BlurView>}
            </View> */}
        
        <View style={{ width: '90%', marginBottom: 100, paddingHorizontal: 5 }}>
        {goodData.title && <Text style={[{fontSize:30, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff', fontFamily: 'SftBold',
        marginTop: 20, marginBottom: 8, textAlign: 'center'}]}>{goodData.title}</Text>}
          {goodData.description && goodData.description.length > 0 && <Text
           style={{ color: '#fff', width: '100%', fontSize: 17, fontFamily: 'SftMedium', marginBottom: 10 }}
           numberOfLines={12}
          >{goodData.description}</Text>}
          
          {goodData.lpr && <Text
           style={{ color: '#fff', width: '100%', fontSize: 17, fontFamily: 'SftMedium', marginBottom: 10 }}
           numberOfLines={12}
          >{goodData.lpr}</Text>}
          {goodData.title && <Text style={[{fontSize:30, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff', fontFamily: 'SftBold',
        marginTop: 20, marginBottom: 8}]}>Комментарии</Text>}
        {goodData.comments && goodData.comments.length > 0 ?
          renderCommentsData()
          : <Text
              style={{ color: '#fff', width: '100%', fontSize: 17, fontFamily: 'SftMedium', marginBottom: 10 }}
              numberOfLines={12}
            >Комментариев пока нет...</Text>}
        </View>
        

        <Modal
        transparent={true}
        animationType='fade'
        visible={modal}
        statusBarTranslucent={true}
        >
        {!loading ? <KeyboardAvoidingView style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -70 : -1000}
        >
            
          <TouchableOpacity onPress={() => {
            setMessageSent(false)
            setModal(false)
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.9,
            position:'absolute',
            left: 0,
            top: 0,
            zIndex: 0
          }}
          activeOpacity={0.9}
          >
          </TouchableOpacity>
          {!messageSent ? <View style={{
            borderRadius: 20,
            width: '95%',
            overflow:'hidden',
            backgroundColor: '#172136',
          }} 
          >
            
            <Text
              style={{ textAlign: 'center', color: '#fff', fontSize: 25, marginTop: 30, fontFamily: 'SftBold' }}
            >{language == 'English' ? 'Comment' : 'Комментарий'}</Text>
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setMessageSent(false)
              setModal(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', color: '#fff', fontSize: 17, marginTop: 15, fontWeight: '300', color: '#818C99', fontFamily: 'SftLight'}}
            >{language == 'English' ? 'to' : 'к'} <Text style={{ fontWeight: '600', fontFamily: 'SftBold' }}>{goodData.title}</Text></Text>
          <View style={{
            width: '100%',
            overflow:'hidden'
          }} onPress={() => setModal(false)}>
            <Text style={{ marginLeft: 20, fontSize: 17, color: '#6D7885', fontWeight: '300', marginTop: 20, fontFamily: 'SftLight'  }}>{language == 'English' ? 'Your comment' : 'Ваш комментарий'}</Text>
            <TextInput
            style = {{
              marginHorizontal:20,
              borderRadius: 13,
              marginTop: 10,
              paddingTop: 17,
              paddingBottom: 17,
              paddingHorizontal: 10,
              color: '#fff',
              fontSize: 17,
              fontWeight: '300',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              maxHeight: 120}}
            removeClippedSubviews={false}
            placeholder={language == 'English' ? 'Enter the text' : 'Введите текст'}
            placeholderTextColor={'#818C99'}
            multiline={true}
            value={text}
            mode = "outlined"
            textColor='#fff'
            selectionColor='#818C99'
            // outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            onChangeText = {text => setText(text)}
            />
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, marginHorizontal: 20, marginTop: 20,
            marginBottom: 40, shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              if (text.trim() != '') {
                setLoading(true)
                sendComment()
                setText('')
              }
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Send' : 'Отправить'}</Text>
          </TouchableOpacity>
          </View>
          </View> :
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
              setMessageSent(false)
              setModal(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'Nice' : 'Отлично'}</Text>
            <Text
              style={{ textAlign: 'center', fontSize: 17, color: '#818C99', fontFamily: 'SftLight',
               width: '80%', marginTop: 10 }}
            >{language == 'English' ? 'The comment created' : 'Комментарий создан'}</Text>
            <Image
              source={require('../images/chatOpen.png')}
              style={{ width: '50%', aspectRatio: 1/1, overflow: 'visible', marginVertical: 10 }}
            />
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setMessageSent(false)
              setModal(false)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>ОК</Text>
          </TouchableOpacity>
          </View>
          </View>}
        </KeyboardAvoidingView> : 
        <View
        style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.9)',
        left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator 
          color={'#fff'}
        />  
      </View>}
    </Modal>


    </ScrollView>
    {commentSendModal && <Animated.View
        transparent={true}
        animationType='fade'
        visible={commentSendModal}
        statusBarTranslucent={true}
        style={{ position: 'absolute', zIndex: 1000000, height: '100%',
                 width: '100%', top: 0, left: 0, opacity: commentModalOpacity }}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            commentWindowOpacity()
            setCommentSentLoading(false)
            setCommentMessage('')
            setCommentSent(0)
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

          <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? -70 : -1000}
        > 
          <TouchableOpacity style={{
            backgroundColor: '#172136',
            borderRadius: 16,
            width: '90%',
            justifyContent: 'flex-end',
            overflow:'hidden',
          }}
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss()
          }}
          >
            
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
              commentWindowOpacity()
              setCommentSentLoading(false)
              setCommentMessage('')
              setCommentSent(0)
            }}
          />
            <Text
                style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', marginTop: 30 }}
              >{language == 'English' ? 'Rate profile' : 'Оцените профиль'}</Text>
            <View style={{
              flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginTop: 20,
              flexWrap: 'wrap', paddingHorizontal: 5
            }}>
              <View
                style={{ marginBottom: 50 }}
              >
                <Text
                  style={{ color: '#fff', marginBottom: 25, fontFamily: 'SftLight', fontSize: 17 }}
                >{language == 'English' ? 'Comunication' : 'Общительность'}</Text>
                <RateSlider 
                  sliderWidth={SCREEN_WIDTH * 0.9 - 40}
                  min={1}
                  max={10}
                  step={1}
                  startPos={1}
                  endPos={10}
                  shadowIos='#0500FF'
                  shadowAndroid={'rgba(5, 0, 255, 0.12)'}
                  onValueChange={(range) => {
                  setCommentComunicationValue(range.max)
                }} />
              </View>
              <View
                style={{ marginBottom: 50 }}
              >
                <Text
                  style={{ color: '#fff', marginBottom: 25, fontFamily: 'SftLight', fontSize: 17 }}
                >{language == 'English' ? 'Adequacy' : 'Адекватность'}</Text>
                <RateSlider 
                  sliderWidth={SCREEN_WIDTH * 0.9 - 40}
                  min={1}
                  max={10}
                  step={1}
                  startPos={1}
                  endPos={10}
                  shadowIos='#B5FF3C'
                  shadowAndroid={'rgba(181, 255, 60, 0.1)'}
                  onValueChange={(range) => {
                    setCommentActivityValue(range.max)
                  }} />
              </View>
              {/* {<TextInput
                style = {{
                  width: SCREEN_WIDTH * 0.9 - 40,
                  marginHorizontal:20,
                  borderRadius: 13,
                  marginTop: 20,
                  paddingTop: 17,
                  paddingBottom: 17,
                  paddingHorizontal: 10,
                  color: '#fff',
                  fontSize: 17,
                  fontWeight: '300',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  maxHeight: 80}}
                removeClippedSubviews={false}
                placeholder={language == 'English' ? 'Comment (anonymously)' : 'Коментарий (анонимно)'}
                placeholderTextColor={'#818C99'}
                multiline={true}
                value={commentMessage}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {text => setCommentMessage(text)}
              />} */}
            </View>
            
          </View>
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginTop: 18, width: SCREEN_WIDTH * 0.9 - 40,
            marginBottom: 35, alignSelf: 'center', shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 0}]}
            activeOpacity={0.8}
            onPress={() => {
                sendRate()
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Rate' : 'Оценить'}</Text>
          </TouchableOpacity>
          </TouchableOpacity>
          {commentSentLoading && <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, width: SCREEN_WIDTH * 0.9,
                     height: '100%', backgroundColor: '#172136', borderRadius: 16 }}
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss()
            }}
          >
            {commentSent == 0 ? <ActivityIndicator
              style={{ width: '100%', height: '100%' }}
            /> : <View
              style={{ width: '100%', height: '100%' }}
            ><View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}
            >
              <Text
                style={{ color: '#fff', fontSize: 23, fontFamily: 'SftMedium', textAlign: 'center' }}
              >{language == 'English' ? commentSent == 1 ? 'Sent!' : commentSent == 2 ? 'You have already rated this profile' : 'Something went wrong' :
               commentSent == 1 ? 'Оценка отправлена!' : commentSent == 2 ? 'Вы уже оценили этот профиль' : 'Что то пошло не так'}</Text>
            </View>
            <View>
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginTop: 18, width: SCREEN_WIDTH * 0.9 - 40,
            marginBottom: 35, alignSelf: 'center', shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              commentWindowOpacity()
              setCommentMessage('')
              setCommentSentLoading(false)
              setCommentSent(0)
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Ok' : 'Ок'}</Text>
          </TouchableOpacity>
            </View>
            </View>}
          </TouchableOpacity>}
          </KeyboardAvoidingView>
        </View>
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
            <View style={{ height: headerHeight, backgroundColor: '#0F1826', 
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
                  changeGood()
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

              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', fontWeight: '300', marginTop: 20, fontFamily: 'SftLight'}}>{language == 'English' ? 'Title' : 'Название товара'}</Text>
              <TextInput style = {[styles.inputStyle]}
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholder={language == 'English' ? 'Short title' : 'Короткое название'}
                placeholderTextColor={'#818C99'}
                value={changeTitle}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                // outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {title => setChangeTitle(title)}
              />
              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: 'SftLight'}}>{language == 'English' ? 'Description' : 'Описание товара'}</Text>
              <TextInput style = {[styles.inputStyle, {minHeight: 100, maxHeight: 200}]}
                contentStyle={[{ fontFamily: 'SftLight' }, Platform.OS === 'android' && {paddingTop: 15}]}
                placeholder={language == 'English' ? 'Describe the good' : 'Опишите товар'}
                // scrollEnabled={newPartyDescription == '' ? false : true}
                placeholderTextColor={'#818C99'}
                value={changeDesc}
                multiline={true}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                // outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {description => setChangeDesc(description)}
              />

            </KeyboardAwareScrollView>
            {loadingChange &&
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
    </View>
      )
}

const styles = StyleSheet.create({
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
})

export default Good