import React, { useState, useEffect, useRef } from 'react'
import { Text, View, ActivityIndicator, Modal,
  TouchableOpacity, KeyboardAvoidingView, ImageBackground,
  ScrollView, Dimensions, FlatList, Platform, TextInput,
  Animated, Keyboard, AppState } from 'react-native';
import { Image } from 'expo-image';
import { CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IconButton } from 'react-native-paper';
import { BlurView } from 'expo-blur'
import Location from '../images/location.svg'
import CircleStar from '../images/star_circle.svg'
import CheckMark from '../images/checkmark.svg'
import Star from '../images/star_3.svg'
import ArrowLeft from '../images/arrow_up_left.svg'
import Heart from '../images/like.svg'
import Close from '../images/close.svg'
import SendReaction from '../images/reactionsProfile.svg'
import Accept from '../images/accept.svg'
import ArrowBack from '../images/turnBack.svg';
import ReportUser from '../images/report.svg'
import Svg, { Path, Circle } from 'react-native-svg'
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import * as Haptics from 'expo-haptics';
import { Shadow } from 'react-native-shadow-2';
import { BASE_URL } from './config';
import RateSlider from './RateSlider';
import * as Device from 'expo-device';
import Glasses from '../images/glassesSwipes.svg'

function MatchProfile(props) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const secondListRef = useRef(null);
  const [language, setLanguage] = useState('')
  const [messageSent, setMessageSent] = useState(false)
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
  const boosters = [
    {
      title: 'Премиум',
      titleEng: 'Premium',
      desc: 'использует Премиум. Премиум открывает эксклюзивные функции приложения. Подробнее про Премиум и другие бустеры можно прочитать на странице свайпов, нажав значек "молния" в правом верхнем углу экрана, а так же на экране "мой профиль".',
      descEng: 'is using Premium. Premium unlocks exclusive app features. You can learn more about Premium and other boosters on the swipe page by tapping the "lightning" icon in the top-right corner of the screen, as well as on the "My Profile" screen.',
      icon: require("../images/crown.png")
    },
    {
      title: 'Войти в топ',
      titleEng: 'Boost to top',
      desc: 'использует бустер "Войти в топ". Этот бустер повышает рейтинг профиля до топовых значений, что многократно увеличивает его видимость. Подробнее про бустер "Войти в топ" и другие бустеры можно прочитать на странице свайпов, нажав значек "молния" в правом верхнем углу экрана, а так же на экране "мой профиль".',
      descEng: `is using the "Boost to top" booster. This booster increases the profile's rating to top levels, significantly boosting its visibility. You can learn more about the "Boost to top" booster and other boosters on the swipe page by tapping the "lightning" icon in the top-right corner of the screen, as well as on the "My Profile" screen.`,
      icon: require("../images/rocket.png")
    },
  ]
  const [boosterIndex, setBoosterIndex] = useState(0)
  const deviceModel = Device.modelName;
    const modelsDict = {
      'iPhone 16 Pro Max': 17,
      'iPhone 16 Pro': 17,
      'iPhone 16 Plus': 15,
      'iPhone 16': 15,
      'iPhone 15 Pro Max': 17,
      'iPhone 15 Pro': 17,
      'iPhone 15 Plus': 15,
      'iPhone 15': 15,
      'iPhone 14 Pro Max': 17,
      'iPhone 14 Pro': 17,
      'iPhone 14 Plus': 5,
      'iPhone 14': 5,
      'iPhone 13 Pro Max': 5,
      'iPhone 13 Pro': 5,
      'iPhone 13 mini': 5,
      'iPhone 13': 5,
      'iPhone 12 Pro Max': 5,
      'iPhone 12 Pro': 5,
      'iPhone 12 mini': 5,
      'iPhone 12': 5,
      'iPhone 11 Pro Max': 3,
      'iPhone 11 Pro': 3,
      'iPhone 11': 3,
      'iPhone X': 3,
      'iPhone Xʀ': 3,
      'iPhone Xs': 3,
      'iPhone Xs Max': 3,
    }
  
  const handlePinchStateChange = (event) => {
    console.log(scale)
    if (event.nativeEvent.oldState == State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true
      }).start()
      Animated.spring(pinchFocalX, {
        toValue: 0,
        useNativeDriver: true
      }).start()
      Animated.spring(pinchFocalY, {
        toValue: 0,
        useNativeDriver: true
      }).start()
    }
  }
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
  const handlePinchGestureEvent = Animated.event(
    [ 
      { 
        nativeEvent: { 
          scale: scale,
          focalX: pinchFocalX,
          focalY: pinchFocalY  
        },
      },
    ], {listener: (e) => {
      pinchFocalX.setValue(-((e.nativeEvent.focalX - (SCREEN_WIDTH / 2))) - ((SCREEN_WIDTH - SCREEN_WIDTH) / 2))
      pinchFocalY.setValue(-((e.nativeEvent.focalY - (SCREEN_WIDTH * 1.2 / 2))) - (((SCREEN_WIDTH * 1.2 ) - (SCREEN_WIDTH * 1.2)) / 2))
    }, 
    useNativeDriver: false }
  );
  const [pageNumber, setPageNumber] = useState(1)
  const [pageNumberModal, setPageNumberModal] = useState(1)
  const [text, setText] = useState("")
  const [modal, setModal] = useState(false)
  const [modalBlocked, setModalBlocked] = useState(false)
  const [modalGallery, setModalGallery] = useState(false)
  const [userData, setUserData] = useState(props.route.params.data)
  const [loading, setLoading] = useState(true);
  const token = getTokenData()
  const colorAnim = useRef(new Animated.Value(0)).current;
  const colorAnimLike = useRef(new Animated.Value(0)).current;
  const paths = [
    "M55.9918 44.006C54.5405 44.0698 53.2389 44.6433 52.111 45.6995L51.994 45.813L51.8723 45.695C50.6626 44.5761 49.2746 44 47.7344 44C44.5772 44 42 46.5603 42 49.7172C42 52.8046 43.1273 54.2688 48.1824 58.263L50.8704 60.3607C51.5345 60.8783 52.4655 60.8783 53.1296 60.3607L55.4937 58.5182L56.4269 57.7784C60.9647 54.144 62 52.676 62 49.7172C62 46.5603 59.4228 44 56.2656 44L55.9918 44.006ZM56.2656 45.8C58.4314 45.8 60.2 47.557 60.2 49.7172L60.1951 50.0108C60.1192 52.1674 59.1332 53.352 54.686 56.8631L52.0231 58.941C52.0095 58.9515 51.9905 58.9515 51.9769 58.941L49.6128 57.0984L48.739 56.4066C44.5968 53.0977 43.8 51.9668 43.8 49.7172C43.8 47.557 45.5686 45.8 47.7344 45.8C49.0673 45.8 50.2408 46.4176 51.3038 47.7152C51.6662 48.1577 52.3441 48.1543 52.702 47.7081C53.7389 46.4156 54.9087 45.8 56.2656 45.8Z",
    "M45.2636 45.2636C45.6151 44.9121 46.185 44.9121 46.5364 45.2636L52 50.7272L57.4636 45.2636C57.8151 44.9122 58.385 44.9122 58.7364 45.2636C59.0879 45.6151 59.0879 46.185 58.7364 46.5364L53.2728 52L58.7364 57.4636C59.0879 57.8151 59.0879 58.385 58.7364 58.7364C58.3849 59.0879 57.8151 59.0879 57.4636 58.7364L52 53.2728L46.5364 58.7364C46.1849 59.0879 45.6151 59.0879 45.2636 58.7364C44.9121 58.3849 44.9121 57.8151 45.2636 57.4636L50.7272 52L45.2636 46.5364C44.9122 46.1849 44.9122 45.6151 45.2636 45.2636Z"
  ]
  const {id} = props.route.params.id
  let onScrollEnd = (e) => {
    let pageNum = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setPageNumber(pageNum + 1)
  }
  let onScrollEndModal = (e) => {
    let pageNum = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setPageNumberModal(pageNum + 1)
  }
  const lookingForRussian = {
    "Friends": "Друзей",
    "Hang out": "Тусовку",
    "Serious relationships": "Серьезные отношения"
  }
  const relationshipsStatusRussian = {
    "Single": "Свободен",
    "Engaged": "Помолвлен",
    "Married": "Женат",
    "In relationships": "В отношениях"
  }
  const relationshipsStatusFemRussian = {
    "Single": "Свободна",
    "Engaged": "Помолвлена",
    "Married": "Замужем",
    "In relationships": "В отношениях"
  }
  const kidsRussian = {
    "Yes I have": "Есть",
    "No I haven't": "Нет"
  }
  const appreciateRussian = {
    "Loyalty": "Верность",
    "Sense of humor": "Чувство юмора",
    "Intelligence and purpose": "Ум и целеустремленность",
    "Kindness and honesty": "Доброту и честность"
  }
  const alcoholRussian = {
    "Often": "Часто",
    "Sometimes": "Иногда",
    "Never": "Не пью"
  }
  const smokingRussian = {
    "Often": "Часто",
    "Sometimes": "Иногда",
    "Never": "Не курю"
  }
  const loadUserData = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/matches/${id}/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      setUserData(res)
      setModalBlocked(!!+res.profile.blocked)
      setProfileRate((+ (res.profile.looking_for != '') + (res.profile.description != '') +
      (res.profile.relationships_status != '') + (res.profile.profession != '')+ (res.profile.work_place != '') +
      (res.profile.appreciate != '') + (res.profile.alcohol != '') + (res.profile.smoking != '') + (res.profile.have_kids != '') +
      (res.profile.height != 0) + (res.profile.tags.length != 0) + (res.photos.length != 0) * 5) / 16 * 10)
      setLoading(false)
    })
    .catch(error => {
      console.log("Error", error)
      setLoading(false)
    })
  }
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

  const isValidText = (input) => {
    // Проверяем, что строка содержит хотя бы одну букву
    const regex = /[a-zA-Zа-яА-Я]/; // Добавьте дополнительные символы, если необходимо
    return regex.test(input.trim());
  };

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
        recipient: userData.id,
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
      //     sendPushNotification(resp.tokens[i], userData.id, 'New Reaction!', `${resp.author.name}${text}`, `${BASE_URL}${resp.author.photos[0].compressed_image_url}`, 0, 'ChatList')
      //   }
      // }
    })
    .catch(error => {
      console.log("Error", error)
      setLoadingReaction(false)
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

  const sendMessage = () => {
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
        //   for (let i = 0; i < resp.tokens.length; i++) {
        //   // const element = tokens[i];
        //   sendPushNotification(resp.tokens[i], id, 'New Message!', text, (`${BASE_URL}` + resp.sender_photo), 0, 'ChatList')
        //   }
        //   console.log(resp)
        // }
      }).catch(error => {
          console.log('error', error)
          setLoading(false)
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

  const sendLike = async (tokens) => {
    console.log('like')
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
  const sendDislike = async () => {
    console.log('Dislike')
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

  const animateColor = (type) => {
    
    if (type == 1 && animEnd == false) {
      setAnimEnd(true)
      setColorSvLike('#aaa')
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning
      )
      
      // Animated.timing(colorAnimLike, {
      //   toValue: 1,
      //   duration: 200,
      //   useNativeDriver: false,
      // }).start();
    }
    else if (type != 1 && animEnd == false) {
      setAnimEnd(true)
      setColorSv('#aaa')
      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Heavy
      )
      // Animated.timing(colorAnim, {
      //   toValue: 1,
      //   duration: 200,
      //   useNativeDriver: false,
      // }).start();
    }
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
          loadUserData()
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

  // const renderCommentsData = (item) => {
  //   return(
  //     <View
  //       style={{ width: '100%', flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'flex-start' }}
  //     >
  //       <Image
  //         style={{ width: 50, height: 50, backgroundColor: '#aaa', borderRadius: 100 }}
  //         source={{uri: `${BASE_URL}${item.photo.slice(0, -5) + '.full.jpeg'}`}}
  //         blurRadius={5}
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

  const renderPhotos = () => {
    const data = userData.photos
    return userData.photos.map((item, i) => {
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
          cachePolicy={'disk'}
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


  if(!userData) {
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
      {Platform.OS === 'ios' && deviceModel in modelsDict && isFocused && userData.profile && appState == 'active' && <View
        style={{ borderRadius: 100, overflow: 'hidden', position: 'absolute', top: modelsDict[deviceModel], zIndex: 10000, alignSelf: 'center' }}
      ><BlurView
        intensity={10}
        style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100,
            backgroundColor: 'rgba(164,225,5,0.7)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
      >
        <Glasses width={30} height={10} color={'#7424EB'} style={{ marginTop: 1 }} />
        <Text
          style={{ color: '#fff', fontFamily: 'SftBold', fontSize: 13 }}
        > Vertep</Text>
      </BlurView></View>}
      <TouchableOpacity
            onPress={() => {
              props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
            }}
            style={{left: 20, top: 50, borderRadius: 100, width: 40, height: 40,
              alignItems: 'center', justifyContent: 'center', zIndex: 11111, position: 'absolute',
              backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1, elevation: 3 }}
            activeOpacity={1}
            >
              <ArrowLeft width={30} height={30} fill={'#2688EB'} />
          </TouchableOpacity>
          <View
            style={{ right: 20, top: 50, position: 'absolute', zIndex: 11111, 
                     flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'
            }}
          >
            <TouchableOpacity
            onPress={() => {
              setModalReport(true)
            }}
            style={{borderRadius: 100, width: 40, height: 40,
              alignItems: 'center', justifyContent: 'center', zIndex: 11111, marginHorizontal: 7,
              backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1, elevation: 3 }}
            activeOpacity={1}
            >
              <ReportUser width={25} height={25} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              userData.profile && userData.profile.my_profile == 0 && !userData.deleted && setModalEmoji(true)
            }}
            style={{borderRadius: 100, width: 40, height: 40,
              alignItems: 'center', justifyContent: 'center', zIndex: 11111,
              backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1, elevation: 3 }}
            activeOpacity={1}
            >
              <SendReaction width={30} height={30} fill={userData.profile && userData.profile.my_profile == 0 && !userData.deleted ? '#2688EB' : '#aaa'} />
          </TouchableOpacity>
          </View>
      <View style={{ width: '100%', height: 90, backgroundColor: '#0F1421',
        position: 'absolute', bottom: 0, zIndex: 100, alignItems: 'center' }}>
        <View style={{ width: '90%', marginTop: 10 }}>
        {userData.profile && userData.profile.my_profile == 0 ? <TouchableOpacity
          onPress={() => setModal(true)}
          style={[{ borderWidth: 1, borderColor: '#90A9FF', borderRadius: 100, paddingVertical: 12, backgroundColor: '#0F1421',
          shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.8, shadowRadius: 5 }, 
          Platform.OS === 'android' && {elevation: 3}]}
          activeOpacity={0.8}
          >
          <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Send Message' : 'Написать'}</Text>
          </TouchableOpacity> : <TouchableOpacity
          style={{ borderWidth: 1, borderColor: '#aaa', borderRadius: 100, paddingVertical: 12,
           }}
          activeOpacity={0.8}
          >
          <Text style={{ color: '#aaa', textAlign: 'center', fontSize: 20, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Send Message' : 'Написать'}</Text>
          </TouchableOpacity>}
        </View>
        
      </View>
    <ScrollView
    keyboardShouldPersistTaps='handled'
    contentContainerStyle={{alignItems: 'center', flexGrow: 1, width: '100%', backgroundColor: '#172136'}}
    scrollIndicatorInsets={{right: 1}}
    showsVerticalScrollIndicator={false}
     >
      <View style={{width:'100%', height: 0.75 * SCREEN_HEIGHT}}>
        <ImageBackground
        source={
          userData.photos.length == 0 ? (userData.sex == 'male' ? require('../images/male.png') : require('../images/female.png')) : {}
        }
        resizeMode='contain'
        style={{width:'100%', height: '100%'}}
        >
          {userData.photos.length > 0 && (
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
          {/* <View style={{ position: 'absolute', top: 50, right: 15, height: 40, zIndex: 100, alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{  color: '#fff', fontSize: 15, zIndex: 100, fontFamily: 'SftMedium' }}
            >{pageNumber}/{userData.photos.length}</Text>
          </View> */}
          <View
            style={{ position: 'absolute', height: 0.75 * SCREEN_HEIGHT, alignSelf: 'flex-end',
            borderRadius: 50, zIndex: 100, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
           }}
          >
          {userData.photos.map((it, idx) => {
          return(
          <Animated.View
          key={it.id}
          style={[{margin: 4, marginRight: 15,
           borderRadius: 50, zIndex: 100, 
          }, idx == pageNumber - 1 ? {backgroundColor: '#4525EB', width: 15, height: 15, borderWidth: 4, borderColor: '#fff'} : {backgroundColor: 'rgba(255, 255, 255, 0.53)', width: 10, height: 10}]}
        />
          ) 
        })}
        </View>
          <Animated.FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            indicatorStyle={"white"}
            bounces={true}
            data={userData.photos}
            pagingEnabled={true}
            onMomentumScrollEnd={onScrollEnd}
            contentContainerStyle={{justifyContent: 'flex-start'}}
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [{ 
                nativeEvent: { 
                  contentOffset: { x: scrollX }
                } 
              }],
              { useNativeDriver: true } // или true, если анимации подходят
            )}
            renderItem = {({item}) => {
              return renderGallery(item)
            }}
            keyExtractor = {item => `${item.id}`}
          /></View>)}
        </ImageBackground>
        
        </View>
        <View
              style={[{ height: '0%', width: SCREEN_WIDTH, 
              alignSelf: 'center', marginTop: '20%', zIndex: 100 }]}
            >
            {!userData.profile || userData.profile.my_profile == 0 ? <BlurView style={{ position: 'absolute', width: '90%', alignSelf: 'center', zIndex: 100, bottom: 0,
            borderRadius: 40, overflow: 'hidden', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            intensity={70}
            >
            {Platform.OS === 'android' && <Animated.FlatList
            ref={secondListRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            indicatorStyle={"white"}
            bounces={true}
            data={userData.photos}
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
            {Platform.OS === 'android' && !userData.deleted && <LinearGradient
                colors={['transparent', '#3B5062']}
                start={{
                  x:0,
                  y:0.1
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
            {Platform.OS === 'android' && userData.deleted && <LinearGradient
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
               <Text style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                color: '#fff', letterSpacing: 0, marginRight: 2}}
              >{userData.name.length <= 20
                ? `${userData.name}`
                : `${userData.name.substring(0, 17)}...`}, {userData.age}</Text>
                {userData.verified && <CheckMark width={30} height={30} style={{ shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: {width: 0, height: 0}, shadowRadius: 3 }} />}
                {((nowDate - new Date(userData.last_seen)) / 60 / 1000) < 15 && <View
                  style={{ backgroundColor: '#65B141', width: 7, aspectRatio: 1/1, borderRadius: 100, marginLeft: 5 }}
                ></View>}
                </View>
                <View >
                {userData.profile && userData.profile.description != '' ? <Text
                style={{ color: '#fff', marginTop: 15, minHeight: 35, fontSize: 15, fontFamily: 'SftMedium',
                 }}
                 ellipsizeMode='tail'
                 numberOfLines={2}
                >{userData.profile.description}</Text> :
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
                      style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium' }}
                    >{language == 'English' ? userData.city.name_eng : userData.city.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                  <CircleStar width={20} height={20} style={{color: '#fff'}} />
                  <Text
                  style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium' }}
                  >Rating: <Text
                    style={userData.boosted && { color: '#ffa420' }}
                  >{userData.rating}</Text></Text>
                  </View>
                </View>
                <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                {userData.profile && (userData.profile.liked == 0 || userData.profile.liked == 2) && !userData.deleted ? <TouchableOpacity
                  style={{ marginRight: 20 }}
                  activeOpacity={1}
                  onPress={() => {
                    animateColor(1)
                    {userData.profile.liked != 1 && sendDislike()}
                  }}
                ><Svg xml={Close} width="55" height="55" viewBox="27 27 50 50">
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
                  {userData.profile && (userData.profile.liked == 0 || userData.profile.liked == 1) && !userData.deleted ? <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    animateColor(0)
                    {userData.profile.liked != 1 && sendLike(userData.tokens)}
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
              {Platform.OS === 'android' && <LinearGradient
              colors={['rgba(62, 84, 101, 0.97);', 'rgba(32, 54, 71, 0.97)']}
              start={{
                x:0,
                y:0
              }}
              end={{
                x:1,
                y:0
              }}
              style={{ width: '100%', height: '100%', position: 'absolute' }}
            />}
              <View style={{width: '100%', zIndex: 0, paddingVertical: 25, paddingHorizontal: 30 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
               <Text style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                color: '#fff', letterSpacing: 0, marginRight: 2}}
              >{userData.name.length <= 20
                ? `${userData.name}`
                : `${userData.name.substring(0, 17)}...`}, {userData.age}</Text>
                <CheckMark width={30} height={30} />
                <View
                  style={{ backgroundColor: '#65B141', width: 7, aspectRatio: 1/1, borderRadius: 100, marginLeft: 5 }}
                ></View>
                </View>
                <View >
                {userData.profile && userData.profile.description != '' ? <Text
                style={{ color: '#fff', marginTop: 15, minHeight: 35, fontSize: 15, fontFamily: 'SftMedium',
                 }}
                 ellipsizeMode='tail'
                 numberOfLines={2}
                >{userData.profile.description}</Text> :
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
                    >{language == 'English' ? userData.city.name_eng : userData.city.name}</Text>
                  </View>
                  
                </View>
                <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                  <CircleStar width={20} height={20} fill='#fff'/>
                  <Text
                  style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium' }}
                  >Rating: <Text
                    style={userData.boosted && { color: '#ffa420' }}
                  >{userData.rating}</Text></Text>
                  </View>
                </View>
                </View>

              </View>
             
            </BlurView>}
            </View>
            {!userData.deleted && !userData.blocked && <View
          style={{ width: '90%', alignItems: 'center' }}
        ><BlurView
          style={{ marginBottom: 10, marginTop: 20, borderRadius: 30,
                   overflow: 'hidden', width: '100%', paddingVertical: 20,
                   paddingHorizontal: 10}}
          intensity={30}
        >
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                width: '100%' }}
            activeOpacity={1}
            onPress={() => {
              commentWindowOpacity()
            }}
          >
          <View style={{justifyContent: 'center', alignItems: 'center', width: '33%'}}>
          <Text 
            numberOfLines={1}
            style={{fontSize: language == 'English' ? 17 : 14, color: '#A7A3AE', fontFamily: 'SftMedium'}}>{language == 'English' ? 'Profile' : 'Профиль'}</Text>
            <View style={{height: 40, marginVertical: 10}}>
            <View style={{ shadowColor: '#0500FF', shadowOpacity: 0.2, shadowOffset: {width: 20 }, shadowRadius: 40 }}>
            {Platform.OS === 'android' && <Shadow
                distance={60}
                offset={[20, 4]}
                startColor='rgba(5, 0, 255, 0.12)'
              />}
              <View style={{ shadowColor: '#0500FF', shadowOpacity: 1, shadowOffset: {width: 20 }, shadowRadius: 40 }}>
              <Star fill={'#A7A3AE'} height={'100%'} width={40} style={{ zIndex: 100, opacity: 1 }} />
              <View style={{ zIndex: 1000, position: 'absolute', height: `${profileRate * 10}%`, width: 40, bottom: 0, overflow: 'hidden' }}>
                <Star fill={'yellow'} height={40} width={40} style={{ zIndex: 1000, opacity: 1, position: 'absolute', bottom: 0 }} />
              </View>
              </View>
              </View>
            </View>
            <Text style={{fontSize:20, fontWeight: '600', color: '#fff', fontFamily: 'SftBold'}}>{(parseInt(profileRate * 10)) / 10}/10</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', width: '33%'}}>
          <Text 
            numberOfLines={1}
            style={{fontSize: language == 'English' ? 17 : 14, color: '#A7A3AE', fontFamily: 'SftMedium'}}>{language == 'English' ? 'Comunication' : 'Общительность'}</Text>
            <View style={{height: 40, marginVertical: 10}}>
            <View>
              <Star fill={'#A7A3AE'} height={'100%'} width={40} style={{ zIndex: 100, opacity: 1 }} />
              {userData.profile && <View style={{ zIndex: 1000, position: 'absolute', height: `${userData.profile.comunication * 10}%`, width: 40, bottom: 0, overflow: 'hidden' }}>
                <Star fill={'yellow'} height={40} width={40} style={{ zIndex: 1000, opacity: 1, position: 'absolute', bottom: 0 }} />
              </View>}
              </View>
            </View>
            {userData.profile && <Text style={{fontSize:20, fontWeight: '600', color: '#fff', fontFamily: 'SftBold'}}>{userData.profile.comunication < 10 ? userData.profile.comunication.toFixed(1) : userData.profile.comunication}/10</Text>}
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', width: '33%'}}>
          <Text
            numberOfLines={1}
            style={{fontSize: language == 'English' ? 17 : 14, color: '#A7A3AE', fontFamily: 'SftMedium'}}>{language == 'English' ? 'Adequacy' : 'Адекватность'}</Text>
            <View style={{height: 40, marginVertical: 10}}>
            <View style={{ shadowColor: '#B5FF3C', shadowOpacity: 0, shadowOffset: {width: -20 }, shadowRadius: 40 }}>
            {Platform.OS === 'android' && <Shadow
                distance={60}
                offset={[-20, 20]}
                startColor='rgba(181, 255, 60, 0.08)'
              />}
              <View style={{ shadowColor: '#B5FF3C', shadowOpacity: 0.8, shadowOffset: {width: -20 }, shadowRadius: 40 }}>
              <Star fill={'#A7A3AE'} height={'100%'} width={40} style={{ zIndex: 100, opacity: 1 }} />
              {userData.profile && <View style={{ zIndex: 1000, position: 'absolute', height: `${userData.profile.activity * 10}%`, width: 40, bottom: 0, overflow: 'hidden' }}>
                <Star fill={'yellow'} height={40} width={40} style={{ zIndex: 1000, opacity: 1, position: 'absolute', bottom: 0 }} />
              </View>}
              </View>
              </View>
            </View>
            {userData.profile && <Text style={{fontSize:20, fontWeight: '600', color: '#fff', fontFamily: 'SftBold'}}>{userData.profile.activity < 10 ? userData.profile.activity.toFixed(1) : userData.profile.activity}/10</Text>}
          </View>
          </TouchableOpacity>
          {commentsWindow && <ScrollView
            style={{ maxHeight: 180, width: SCREEN_WIDTH * 0.9 - 15 }}
            horizontal={true}
            bounces={false}
          >
            <View
              style={{ width: SCREEN_WIDTH * 0.9 - 20, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginTop: 10, position: 'absolute' }}
            />
            {/* {!commentsLoading ? comments.length > 0 ? <FlatList
              data={comments}
              style={{ marginTop: 11 }}
              indicatorStyle='white'
              contentContainerStyle={{ width: SCREEN_WIDTH * 0.9 - 14, paddingTop: 10, paddingBottom: 20 }}
              renderItem = {({item}) => {
                return renderCommentsData(item)
              }}
              keyExtractor = {item => `${item.id}`}
            /> : <View
              style={{ height: '100%', width: SCREEN_WIDTH * 0.9 - 20, justifyContent: 'center' }}
            >
              <Text
                style={{ textAlign: 'center', color: '#fff', fontSize: 20, fontFamily: 'SftBold' }}
              >No  comments yet</Text>
            </View> : <ActivityIndicator
              style={{ width: SCREEN_WIDTH * 0.9 - 20, height: '100%' }}
            />} */}
          </ScrollView>}
          </BlurView>
          {/* <TouchableOpacity
            style={{ position: 'absolute', bottom: -8, backgroundColor: '#3B5062', borderRadius: 100, }}
            activeOpacity={0.7}
            onPress={() => {
              if (commentsWindow == false) {
                setCommentsWindow(true)
                if (comments.length == 0) {
                  loadComments()
                }
              } else {
                setCommentsWindow(false)
                console.log(comments)
              }
              
            }}
          >
            <ArrowBack width={20} height={20} style={{ transform: [{rotateZ: !commentsWindow ? '270deg' : '90deg'}], margin: 10 }} />
          </TouchableOpacity> */}
          </View>}
        <View style={{ width: '90%', marginBottom: 100, paddingHorizontal: 5 }}>
        {(userData.boosted || userData.premium) && <View>
        <Text
          style={[{fontSize:30, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff', fontFamily: 'SftBold',
            marginTop: 20, marginBottom: 0}]}
        >{language == 'English' ? 'Boosts' : 'Усиления'}</Text>
        <View
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          {userData.premium && <TouchableOpacity
            onPress={() => {
              setBoosterIndex(0)
              setBoostModal(true)
            }}
          ><Image
            style={{ width: 60, height: 60 }}
            source={require("../images/crown.png")}
          /></TouchableOpacity>}
          {userData.boosted && <TouchableOpacity
            onPress={() => {
              setBoosterIndex(1)
              setBoostModal(true)
            }}
          ><Image
            style={{ width: 70, height: 70 }}
            source={require("../images/rocket.png")}
          /></TouchableOpacity>}
        </View>
        </View>}
        {userData.profile && userData.profile.description.length > 0 && <Text style={[{fontSize:30, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff', fontFamily: 'SftBold',
        // shadowRadius: 10, shadowOpacity: 1, shadowOffset: {width: 0, height: 0},
        marginTop: 20, marginBottom: 8}]}>{language == 'English' ?  'About me' : 'О себе'}</Text>}
          {userData.profile && userData.profile.description.length > 0 && <Text
           style={{ color: '#fff', width: '100%', fontSize: 17, fontFamily: 'SftMedium', marginBottom: 10 }}
           numberOfLines={12}
          >{userData.profile.description}</Text>}
        {userData.profile && userData.profile.tags.length > 0 && <Text style={[{fontSize:30, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff',
        // shadowRadius: 10, shadowOpacity: 1, shadowOffset: {width: 0, height: 0},
         marginTop: 20, marginBottom: 0, fontFamily: 'SftBold'}]}>{language == 'English' ? 'Interests' : 'Интересы'}</Text>}
        {Platform.OS === 'ios' ?
         userData.profile && userData.profile.tags.length > 0 && <View style={{ width: SCREEN_WIDTH * 0.9, flexDirection: 'row', flexWrap: 'wrap',
          marginVertical: 12, left: -5 }}>
        {userData.profile && userData.profile.tags.map((item, i) => {
            return <View
            key={item.id}
            style={{ borderWidth: 1, borderColor: '#fff', backgroundColor: '#172136', borderRadius: 100, paddingVertical: 10, paddingHorizontal: 20,
            shadowColor: '#fff', shadowOpacity: 0.7, shadowOffset: {width: 0, height: 0}, shadowRadius: 3, marginHorizontal: 5,
            marginVertical: 5 }}>
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'SftMedium' }}>{item.name}</Text>
            </View>
          })}
        </View> :

        userData.profile && userData.profile.tags.length > 0 && <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', marginVertical: 15 }}>
        {userData.profile && userData.profile.tags.map((item, i) => {
            return <Shadow
            key={item.id}
            distance={4}
            offset={[0, 0]}
            containerStyle={{ margin: 5 }}
            startColor={Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0)'}
          >
             <View
            style={{ borderWidth: 1, borderColor: '#fff', borderRadius: 100, paddingVertical: 10, paddingHorizontal: 20,
            shadowColor: '#fff', backgroundColor: '#172136'}}>
              <Text style={{ color: '#fff', fontSize: 16, lineHeight: 19, fontFamily: 'SftMedium' }}>{item.name}</Text>
            </View>
            </Shadow>
          })}
      </View>}
        <Text style={[{fontSize:30, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff', fontFamily: 'SftBold',
        // shadowRadius: 10, shadowOpacity: 1, shadowOffset: {width: 0, height: 0},
         marginTop: 20, marginBottom: 12}]}>{language == 'English' ?'Info' : 'Информация'}</Text>
        <View style={{ width: '100%'}}>
          <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'From' : 'Город'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.city.name_eng : userData.city.name}, {userData.city.country}</Text>
          </View>
          {userData.profile && userData.profile.looking_for != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Looking for' : 'Ищет'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.profile.looking_for : lookingForRussian[userData.profile.looking_for]}</Text>
          </View>}
          {userData.profile && userData.profile.relationships_status != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Relationship status' : 'Статус'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.profile.relationships_status : userData.sex == 'male' ? relationshipsStatusRussian[userData.profile.relationships_status] : relationshipsStatusFemRussian[userData.profile.relationships_status]}</Text>
          </View>}
          {userData.profile && userData.profile.have_kids != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Kids' : 'Дети'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.profile.have_kids : kidsRussian[userData.profile.have_kids]}</Text>
          </View>}
          {userData.profile && userData.profile.height != 0 && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Height' : 'Рост'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{userData.profile.height}</Text>
          </View>}
          {userData.profile && userData.profile.profession != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Profession' : 'Специальность'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{userData.profile.profession}</Text>
          </View>}
          {userData.profile && userData.profile.work_place != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Place of work' : 'Место работы'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{userData.profile.work_place}</Text>
          </View>}
          {userData.profile && userData.profile.appreciate != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Appreciate in others' : 'Ценит в других'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.profile.appreciate : appreciateRussian[userData.profile.appreciate]}</Text>
          </View>}
          {userData.profile && userData.profile.alcohol != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Alcohol' : 'Алкоголь'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.profile.alcohol : alcoholRussian[userData.profile.alcohol]}</Text>
          </View>}
          {userData.profile && userData.profile.smoking != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Smoking' : 'Курение'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.profile.smoking : smokingRussian[userData.profile.smoking]}</Text>
          </View>}
        </View>
        <Text style={[{fontSize:30, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff', fontFamily: 'SftBold',
        // shadowRadius: 10, shadowOpacity: 1, shadowOffset: {width: 0, height: 0},
         marginTop: 20, marginBottom: 12}]}>{language == 'English' ? 'Photos' : 'Фото'}</Text>
        <View style={{ width: SCREEN_WIDTH * 0.9, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center', left: -5 }}>
        {renderPhotos()}
        </View>
        </View>
        

        <Modal
        transparent={true}
        animationType='fade'
        visible={modalGallery}
        statusBarTranslucent={true}
        >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          <TouchableOpacity onPress={() => {
            setModalGallery(false)
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.95,
            position:'absolute',
            left: 0,
            top: 0,
            zIndex: 0
          }}
          activeOpacity={0.95}
          >
          </TouchableOpacity>
          <PinchGestureHandler 
          onGestureEvent={handlePinchGestureEvent}
          onHandlerStateChange={handlePinchStateChange}
          >
          <Animated.View
            style={{ alignItems: 'center' }}
          >
          <Text
            style={{ color: '#fff', textAlign: 'center', position: 'absolute',
                     top: (-SCREEN_HEIGHT + SCREEN_WIDTH * 1.2) / 4.5,
                     fontSize: 20, fontFamily: 'SftBold' }}
          >{pageNumberModal} / {userData.photos.length}</Text>
          <IconButton
            size={20}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 30, height: 30, position: 'absolute',
                     backgroundColor: 'rgba(129, 140, 153, 0.2)',
                     top: (-SCREEN_HEIGHT + SCREEN_WIDTH * 1.2) / 4, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalGallery(false)
            }}
          />
          <Animated.View style={{
            backgroundColor: 'white',
            width: SCREEN_WIDTH,
            aspectRatio: 1/1.2,
            overflow:'hidden',
            transform: [{ scale: scale }, {translateX: pinchFocalX}, {translateY: pinchFocalY}]
          }}>
          
          <FlatList
            ref={flatListRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            indicatorStyle={"white"}
            bounces={false}
            data={userData.photos}
            pagingEnabled={true}
            onMomentumScrollEnd={onScrollEndModal}
            contentContainerStyle={{justifyContent: 'flex-start'}}
            scrollEventThrottle={32}
            renderItem = {({item}) => {
              return renderModalGallery(item)
            }}
            // onContentSizeChange={handleLayout}
            getItemLayout={getItemLayout}
            keyExtractor = {item => `${item.id}`}
          />
          
          </Animated.View>
          </Animated.View>
          </PinchGestureHandler>
        </View>
    </Modal>

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
            >{language == 'English' ? 'Message' : 'Сообщение'}</Text>
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
            >{language == 'English' ? 'for' : 'для'} <Text style={{ fontWeight: '600', fontFamily: 'SftBold' }}>{userData.name}</Text></Text>
          <View style={{
            width: '100%',
            overflow:'hidden'
          }} onPress={() => setModal(false)}>
            <Text style={{ marginLeft: 20, fontSize: 17, color: '#6D7885', fontWeight: '300', marginTop: 20, fontFamily: 'SftLight'  }}>{language == 'English' ? 'Your message' : 'Ваше сообщение'}</Text>
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
            outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
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
                sendMessage(userData.tokens)
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
            >{language == 'English' ? 'The message has been sent' : 'Сообщение отправлено'}</Text>
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
    <Modal
        transparent={true}
        animationType='fade'
        visible={modalBlocked}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setModalBlocked(false)
            props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
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
              setModalBlocked(false)
              props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
            }}
          />
            <Text
                style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', marginTop: 30 }}
              >{language == 'English' ? 'Oops... There is a problem': 'Упс... У нас проблема'}</Text>
            <View style={{
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20,
              flexWrap: 'wrap', paddingHorizontal: 5
            }}>
              <Text
                style={{ textAlign: 'center', fontSize: 17, color: '#818C99', fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'This user added you to black list': 'Пользователь вас заблокировал'}</Text>
            </View>
            
          </View>
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginTop: 18, width: '80%',
            marginBottom: 35, alignSelf: 'center', shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalBlocked(false)
              props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Close': 'Закрыть'}</Text>
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
            setReactSent(false)
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
          {!loadingReaction ? <View style={{
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.95,
            justifyContent: 'center',
            overflow:'hidden'
          }}>
          {!reactSent ? <View
            style={{flexGrow: 1, justifyContent: 'flex-start', backgroundColor: "#172136", alignItems: 'center', paddingTop: 30,
          paddingBottom: 20 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setReactSent(false)
              setModalEmoji(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'Send reaction' : 'Отправить реакцию'}</Text>
          <View
            style={{flexGrow: 1, justifyContent: 'flex-start', width: '100%', alignItems: 'flex-start',
             paddingVertical: 30, paddingHorizontal: 10 }}
          >
            {/* <TouchableOpacity
            style={{ paddingHorizontal: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingVertical: 3 }}
            activeOpacity={0.8}
            onPress={() => {
              sendAction(userData.sex == 'male' ? 'Punch' : 'Punchw', ` набил(а) вам ебало!`)
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
              sendAction(userData.sex == 'male' ? 'Slap' : 'Slapw', ` дал(а) вам пощечину!`)
            }}
          >
            <Text
              style={{ fontSize: 32, marginRight: 10 }}
            >👋</Text>
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Slap in the face' : 'Дать пощечину'}</Text>
          </TouchableOpacity>
          </View>
          </View> : <View
            style={{ flexGrow: 1, justifyContent: 'center', backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setReactSent(false)
              setModalEmoji(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'Nice' : 'Отлично'}</Text>
            <Text
              style={{ textAlign: 'center', fontSize: 17, color: '#818C99', fontFamily: 'SftLight',
               width: '80%', marginTop: 10 }}
            >{language == 'English' ? 'The reaction has been sent' : 'Реакция отправлена'}</Text>
            <View
              style={{ height: 30, aspectRatio: 1/1, borderRadius: 100, marginVertical: 15,
                       borderColor: '#90A9FF', borderWidth: 0, alignItems: 'center',
                       justifyContent: 'center', backgroundColor: '#fff' }}
            >
              <Accept height={17} width={17} color={'#2688EB'} />
            </View>
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setReactSent(false)
              setModalEmoji(false)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>ОК</Text>
          </TouchableOpacity>
          </View>}
          </View> :
          <View>
            <ActivityIndicator />
          </View>}
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType='fade'
        visible={modalReport}
        statusBarTranslucent={true}
      >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -70 : -1000}
        >
          <TouchableOpacity onPress={() => {
            setModalReport(false)
            setReportDescriprion('')
            setReportReason('none')
            setReportSent(false)
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
          {!reportSent ? <KeyboardAvoidingView style={{
            
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.95,
            justifyContent: 'center',
            overflow:'hidden'
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? -70 : -1000}
        > 
          <View
            style={{flexGrow: 1, justifyContent: 'flex-start', backgroundColor: "#172136", alignItems: 'center', paddingTop: 30,
                    paddingBottom: 20 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalReport(false)
              setReportDescriprion('')
              setReportReason('none')
            }}
          />
          {reportReason != 'none' && <TouchableOpacity
            style={{ position: 'absolute', left: 0, top: 35, paddingLeft: 15 }}
            onPress={() => {
              setReportReason('none')
            }}
          >
            <ArrowBack width={20} height={20} />
          </TouchableOpacity>}
          
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'Report user' : 'Пожаловаться'}</Text>
            <View>
            <TouchableOpacity
              style={{ width: '100%', paddingVertical: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              onPress={() => {
                setReportReason('fake')
                setReportReasonText(language == 'English' ? 'Fake user' : 'Фейк')
              }}
            >
              <Text
                style={{ color: '#fff', fontSize: 18, paddingHorizontal: 10, fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'Fake user' : 'Фейк'}</Text>
              <ArrowBack width={15} height={15} style={{ transform: [{rotateZ: '180deg'}], marginRight: 10 }} />
            </TouchableOpacity>
            <View
              style={{ width: SCREEN_WIDTH * 0.95 - 20, height: 1, backgroundColor: '#1A3242' }}
            />
            <TouchableOpacity
              style={{ width: '100%', paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              onPress={() => {
                setReportReason('unacceptable')
                setReportReasonText(language == 'English' ? 'Unacceptable content' : 'Неприемлемый контент')
              }}
            >
              <Text
                style={{ color: '#fff', fontSize: 18, paddingHorizontal: 10, fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'Unacceptable content' : 'Неприемлемый контент'}</Text>
              <ArrowBack width={15} height={15} style={{ transform: [{rotateZ: '180deg'}], marginRight: 10 }} />
            </TouchableOpacity>
            <View
              style={{ width: SCREEN_WIDTH * 0.95 - 20, height: 1, backgroundColor: '#1A3242' }}
            />
            <TouchableOpacity
              style={{ width: '100%', paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              onPress={() => {
                setReportReason('fraud')
                setReportReasonText(language == 'English' ? 'Fraud' : 'Мошенничество')
              }}
            >
              <Text
                style={{ color: '#fff', fontSize: 18, paddingHorizontal: 10, fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'Fraud' : 'Мошенничество'}</Text>
              <ArrowBack width={15} height={15} style={{ transform: [{rotateZ: '180deg'}], marginRight: 10 }} />
            </TouchableOpacity>
            <View
              style={{ width: SCREEN_WIDTH * 0.95 - 20, height: 1, backgroundColor: '#1A3242' }}
            />
            <TouchableOpacity
              style={{ width: '100%', paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              onPress={() => {
                setReportReason('abuse')
                setReportReasonText(language == 'English' ? 'Abuse' : 'Оскорбления')
              }}
            >
              <Text
                style={{ color: '#fff', fontSize: 18, paddingHorizontal: 10, fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'Abuse' : 'Оскорбления'}</Text>
              <ArrowBack width={15} height={15} style={{ transform: [{rotateZ: '180deg'}], marginRight: 10 }} />
            </TouchableOpacity>
            <View
              style={{ width: SCREEN_WIDTH * 0.95 - 20, height: 1, backgroundColor: '#1A3242' }}
            />
            <TouchableOpacity
              style={{ width: '100%', paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              onPress={() => {
                setReportReason('underage')
                setReportReasonText(language == 'English' ? 'Underage user' : 'Несовершеннолетний пользователь')
              }}
            >
              <Text
                style={{ color: '#fff', fontSize: 18, paddingHorizontal: 10, fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'Underage user' : 'Несовершеннолетний пользователь'}</Text>
              <ArrowBack width={15} height={15} style={{ transform: [{rotateZ: '180deg'}], marginRight: 10 }} />
            </TouchableOpacity>
            <View
              style={{ width: SCREEN_WIDTH * 0.95 - 20, height: 1, backgroundColor: '#1A3242' }}
            />
            <TouchableOpacity
              style={{ width: '100%', paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              onPress={() => {
                setReportReason('skuf')
                setReportReasonText(language == 'English' ? 'Skuf' : 'Скуф')
              }}
            >
              <Text
                style={{ color: 'tomato', fontSize: 18, paddingHorizontal: 10, fontFamily: 'SftBold' }}
              >{language == 'English' ? 'SKUF' : 'СКУФ'}</Text>
              <ArrowBack width={15} height={15} style={{ transform: [{rotateZ: '180deg'}], marginRight: 10 }} />
            </TouchableOpacity>
            <View
              style={{ width: SCREEN_WIDTH * 0.95 - 20, height: 1, backgroundColor: '#1A3242' }}
            />
            <TouchableOpacity
              style={{ width: '100%', paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              onPress={() => {
                setReportReason('other')
                setReportReasonText(language == 'English' ? 'Other' : 'Другое')
              }}
            >
              <Text
                style={{ color: '#fff', fontSize: 18, paddingHorizontal: 10, fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'Other' : 'Другое'}</Text>
              <ArrowBack width={15} height={15} style={{ transform: [{rotateZ: '180deg'}], marginRight: 10 }} />
            </TouchableOpacity>

            {reportReason != 'none' && <TouchableOpacity
              style={{ position: 'absolute', zIndex: 100, backgroundColor: '#172136', width: '100%', height: '100%' }}
              onPress={() => {
                Keyboard.dismiss()
              }}
              activeOpacity={1}
            >
              <Text
                style={{ fontSize: 18, color: '#8E8E93', textAlign: 'center', marginTop: 20, fontFamily: 'SftMedium' }}
              >{reportReasonText}</Text> 
              <TextInput
                style = {{
                  marginHorizontal:20,
                  borderRadius: 13,
                  marginTop: 20,
                  paddingTop: 17,
                  paddingBottom: 17,
                  paddingHorizontal: 10,
                  color: '#fff',
                  fontFamily: 'SftLight',
                  fontSize: 19,
                  fontWeight: '300',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  maxHeight: 120}}
                removeClippedSubviews={false}
                placeholder={language == 'English' ? 'Describe the problem' : 'Опишите проблему'}
                placeholderTextColor={'#818C99'}
                multiline={true}
                value={reportDescriprion}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {text => setReportDescriprion(text)}
              />
              <TouchableOpacity
                style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginVertical: 18, bottom: 0, width: SCREEN_WIDTH * 0.95 - 20,
                shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, position: 'absolute' }, 
                Platform.OS === 'android' && {elevation: 2}]}
                activeOpacity={0.8}
                onPress={() => {
                  Keyboard.dismiss()
                  reportUser()
                }}
              >
                <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Send' : 'Отправить'}</Text>
              </TouchableOpacity>
            </TouchableOpacity>}

            </View>
          </View>
          {loading && <View
              style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.7)', top: 0 }}
             >
              <ActivityIndicator
                style={{ width: '100%', height: '100%' }}
              />
            </View>}
          </KeyboardAvoidingView> :
          <View
            style={{borderRadius: 15, width: SCREEN_WIDTH * 0.95, justifyContent: 'center',
                    backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setReportSent(false)
              setModalReport(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftMedium', width: '80%' }}
            >{language == 'English' ? 'Thank you' : 'Спасибо'}</Text>
            <Text
              style={{ textAlign: 'center', fontSize: 17, color: '#818C99', fontFamily: 'SftLight',
               width: '80%', marginTop: 10 }}
            >{language == 'English' ? 'We have received your complaint and will review it soon' : 'Мы получили вашу жалобу и вскоре ее рассмотрим'}</Text>
            <View
              style={{ height: 30, aspectRatio: 1/1, borderRadius: 100, marginVertical: 15,
                       borderColor: '#90A9FF', borderWidth: 0, alignItems: 'center',
                       justifyContent: 'center', backgroundColor: '#fff' }}
            >
              <Accept height={17} width={17} color={'#2688EB'} />
            </View>
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setReportSent(false)
              setModalReport(false)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>ОК</Text>
          </TouchableOpacity>
          </View>}
        </View>
    </Modal>

    <Modal
        transparent={true}
        animationType='fade'
        visible={boostModal}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setBoostModal(false)
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
          {!loading ? <View style={{
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.95,
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
              setBoostModal(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? boosters[boosterIndex].titleEng : boosters[boosterIndex].title}</Text>
            <Text
              style={{ textAlign: 'left', fontSize: 15, color: '#fff', fontFamily: 'SftLight',
               width: '100%', marginTop: 10, paddingHorizontal: 15 }}
            >{language == 'English' ? `${userData.name} ${boosters[boosterIndex].descEng}` :
            `${userData.name} ${boosters[boosterIndex].desc}`}</Text>
            <Image
              source={boosters[boosterIndex].icon}
              style={{ width: SCREEN_WIDTH / 3, height: SCREEN_WIDTH / 3, overflow: 'visible', marginVertical: 10 }}
            />
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setBoostModal(false)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{language == 'English' ? 'Ok' : 'Ок'}</Text>
          </TouchableOpacity>
          </View>
          </View> :
          <View
            style={{ width: '100%', height: '100%', position: 'absolute',
            left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator 
              color={'#fff'}
            />  
          </View>}
        </View>
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
    </View>
      )
}

export default MatchProfile