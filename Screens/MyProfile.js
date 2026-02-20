import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { StyleSheet, Text,
  View, ActivityIndicator, ImageBackground,
  ScrollView, FlatList, Platform, Modal,
  TouchableOpacity, Dimensions, Animated, KeyboardAvoidingView,
  Keyboard, Linking } from 'react-native';
import { Image } from 'expo-image';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { IconButton, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from "@react-navigation/native";
import { BlurView } from 'expo-blur'
import Pen from '../images/pen.svg'
import Settings from '../images/settings.svg'
import Location from '../images/location.svg'
import CircleStar from '../images/star_circle.svg'
import CheckMark from '../images/checkmark.svg'
import CheckMarkNoBg from '../images/checkmarkNoBg.svg'
import CheckMarkShadows from '../images/checkmarkShadows.svg'
import Star from '../images/star_3.svg'
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import ArrowLeft from '../images/turnBack.svg'
import ArrowDown from '../images/arrowDownSign.svg'
import Shop from '../images/shop.svg'
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { Shadow } from 'react-native-shadow-2';
import { BASE_URL } from './config';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { openBrowserAsync } from 'expo-web-browser';
import ParamsContext from './ParamsContext';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import debounce from 'lodash.debounce';


function MyProfile(props) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const secondListRef = useRef(null);
  const { widthH, heightH } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight({ widthH, heightH }, Platform.OS, insets.top) - 10
  const { hasBoostsToTop, setHasBoostsToTop } = useContext(ParamsContext);
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsWindow, setCommentsWindow] = useState(false)
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
  const _loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setfFontsLoaded(true);
  }
  _loadFontsAsync()
  let stat = 0
  let [fData, setFData] = useState()
  const bluredBg = require('../images/bluredProfile.png')
  const fbIcon = require("../images/socialMedia/fb.png")
  const telegramIcon = require("../images/socialMedia/telegram.png")
  const vkIcon = require("../images/socialMedia/vk.png")
  const [fontsLoaded, setfFontsLoaded] = useState(false)
  const [profileId, setProfileId] = useState(0)
  const SCREEN_WIDTH = Dimensions.get('window').width
  const SCREEN_HEIGHT = Dimensions.get('window').height
  const [pageNumber, setPageNumber] = useState(1)
  const [pageNumberModal, setPageNumberModal] = useState(1)
  const pinchRef = useRef(null);
  const scale = useRef(new Animated.Value(1)).current;
  const pinchFocalX = useRef(new Animated.Value(0)).current;
  const pinchFocalY = useRef(new Animated.Value(0)).current;
  const [profileRate, setProfileRate] = useState(0)
  const [hasPhotos, setHasPhotos] = useState(false)
  const [tutorial, setTutorial] = useState(false)
  const [tutorialFull, setTutorialFull] = useState(false)
  const [errType, setErrType] = useState(1)
  const [loadingCity, setLoadingCity] = useState(false);
  

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
  

  const handlePinchStateChange = (event) => {
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
  let profilePhotoId = 0
  const [photoId, setPhotoId] = useState(0)
  const [photoProfile, setPhotoProfile] = useState(false)
  const [boostersTab, setBoostersTab] = useState(1)
  const [vouchersTab, setVouchersTab] = useState(0)
  const [modalVerification, setModalVerification] = useState(false)
  const [modalVerificationStart, setModalVerificationStart] = useState(false)
  const [modalBuyRating, setModalBuyRating] = useState(false)
  const [modalToTheTop, setModalToTheTop] = useState(false)
  const [modalBuyPremium, setModalBuyPremium] = useState(false)
  const [modalBuyMuchRating, setModalBuyMuchRating] = useState(false)
  const [modalBuyRatingGot, setModalBuyRatingGot] = useState(0)
  const [modalToTheTopGot, setModalToTheTopGot] = useState(0)
  const [modalBuyPremiumGot, setmodalBuyPremiumGot] = useState(0)
  const [modalBuyMuchRatingGot, setModalBuyMuchRatingGot] = useState(0)
  const [errText, setErrText] = useState('')
  const [modalErr, setModalErr] = useState(false)
  const [modalBlockedAccount, setModalBlockedAccount] = useState(false)
  const [profilePhotos, setProfilePhotos] = useState()
  const [modal, setModal] = useState(false)
  const [modalChange, setModalChange] = useState(false)
  const [modalSettings, setModalSettings] = useState(false)
  const [modalWallet, setModalWallet] = useState(false)
  const [modalGallery, setModalGallery] = useState(false)
  const [modalDeletedAccount, setModalDeletedAccount] = useState(false)
  const [userData, setUserData] = useState()
  const [vouchersData, setVouschersData] = useState([])
  const [qrShow, setQrShow] = useState()
  const [qrImage, setQrImage] = useState()
  const [cityData, setCityData] = useState()
  const [city, setCity] = useState('')
  const [showCities, setShowCities] = useState(false)
  const [loading, setLoading] = useState(true);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [cityId, setCityId] = useState()
  const token = getTokenData()
  const isFocused = useIsFocused();
  const [lookingFor, setLookingFor] = useState('')
  const [language, setLanguage] = useState('')
  const [relationshipsStatus, setRelationshipsStatus] = useState('')
  const [kidsStatus, setKidsStatus] = useState('')
  const [profession, setProfession] = useState('')
  const [workPlace, setWorkPlace] = useState('')
  const [appreciate, setAppreciate] = useState('')
  const [alcohol, setAlcohol] = useState('')
  const [smoking, setSmoking] = useState('')
  const [height, setHeight] = useState(0)
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [chooseCityDisplay, setChooseCityDisplay] = useState(false)
  const [lookingPickerDisplay, setLookingPickerDisplay] = useState(false)
  const [languagePickerDisplay, setLanguagePickerDisplay] = useState(false)
  const [relationsPickerDisplay, setRelationsPickerDisplay] = useState(false)
  const [kidsPickerDisplay, setKidsPickerDisplay] = useState(false)
  const [appreciatePickerDisplay, setAppreciatePickerDisplay] = useState(false)
  const [alcoholPickerDisplay, setAlcoholPickerDisplay] = useState(false)
  const [smokingPickerDisplay, setSmokingPickerDisplay] = useState(false)
  const [choosedTags, setChoosedTags] = useState([])
  const [interestsDisplay, setInterestsPickerDisplay] = useState(false)
  const [boostModal, setBoostModal] = useState(false)
  const boosters = [
    {
      title: 'Премиум',
      titleEng: 'Premium',
      desc: 'Вы используете Премиум. Премиум открывает эксклюзивные функции приложения. Подробнее про Премиум и другие бустеры можно прочитать на странице свайпов, нажав значек "молния" в правом верхнем углу экрана, а так же на экране "мой профиль".',
      descEng: 'You using Premium. Premium unlocks exclusive app features. You can learn more about Premium and other boosters on the swipe page by tapping the "lightning" icon in the top-right corner of the screen, as well as on the "My Profile" screen.',
      icon: require("../images/crown.png")
    },
    {
      title: 'Войти в топ',
      titleEng: 'Boost to top',
      desc: 'Вы используете бустер "Войти в топ". Этот бустер повышает рейтинг профиля до топовых значений, что многократно увеличивает его видимость. Подробнее про бустер "Войти в топ" и другие бустеры можно прочитать на странице свайпов, нажав значек "молния" в правом верхнем углу экрана, а так же на экране "мой профиль".',
      descEng: `You using the "Boost to top" booster. This booster increases the profile's rating to top levels, significantly boosting its visibility. You can learn more about the "Boost to top" booster and other boosters on the swipe page by tapping the "lightning" icon in the top-right corner of the screen, as well as on the "My Profile" screen.`,
      icon: require("../images/rocket.png")
    },
  ]
  const [boosterIndex, setBoosterIndex] = useState(0)
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

  const scrollViewRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: require('../images/tutorial/table.png'),
      title: language == 'English' ? 'You’re in the most versatile dating service!' : 'Ты находишься в самом многофункциональном дейтинг сервисе!',
      description1: language == 'English' ? 'Take a quick tutorial to make the most of all the features!' : 'Пройди краткий туториал, чтобы максимально эффективно использовать все функции!',
      description2: language == 'English' ? 'You can always return to this guide by clicking on the "settings" icon and selecting the "tutorial" option.' : 'Ты всегда можешь вернуться к этой инструкции нажав на значок "настройки" и выбрав пункт "туториал"',
    },
    {
      image: require('../images/tutorial/stars.png'),
      title: language == 'English' ? 'Boost your rating and become a star!' : 'Повысь свой рейтинг и стань звездой!',
      description1: language == 'English' ? 'Use boosters to increase your rating. The higher rating — the more attention your profile will get!' : 'Используй бустеры для увеличения рейтинга. Больше рейтинг — больше внимания к твоему профилю!',
    },
    {
      image: require('../images/tutorial/matches.png'),
      title: language == 'English' ? 'Make new connections!' : 'Заводи новые знакомства!',
      description1: language == 'English' ? 'Send likes, reactions, and join games with other users!' : 'Отправляй лайки, реакции и участвуй в играх с другими пользователями',
    },
    {
      image: require('../images/tutorial/roulette.png'),
      title: language == 'English' ? 'Play and win!' : 'Играй и выигрывай!',
      description1: language == 'English' ? 'Join the daily roulette and rating games. Collect prizes and in-game coins!' : 'Участвуй в ежедневной рулетке и играх на рейтинг. Забирай призы и игровую валюту.',
    },
    {
      image: require('../images/tutorial/heartTutorial.png'),
      title: language == 'English' ? 'Enjoy new connections\nand fun experiences!' : 'Наслаждайся новыми знакомствами и \nразвлечениями.',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current.scrollTo({ x: nextSlide * SCREEN_WIDTH, animated: true });
    }
  };

  const writeProfileTutorial = async (value) => {
    try {
        await AsyncStorage.setItem('profileTutorial', value)
    } catch(e) {
        console.log('error', e)
    }
    console.log('Done', value)
  }

  const ListItem = ({ children, size=15 }) => {
    return (
      <View style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 5,
        paddingHorizontal: 10
      }}>
        <View style={{ 
          width: 6,
          height: 6,
          borderRadius: 5,
          backgroundColor: '#fff',
          marginTop: 7
         }} />
        <Text style={{
          marginLeft: 10, marginRight: 5, fontSize: size, color: '#fff', lineHeight: 20, justifyContent: 'center', alignItems: 'center'
        }}>{children}</Text>
      </View>
    );
  };

  const getProfileTutorial = async () => {
    try {
        let profileTutorialData = await AsyncStorage.getItem('profileTutorial')
        if(profileTutorialData == null) {
          setTutorial(true)
          writeProfileTutorial('true')
        }
    } catch(e) {
        console.log('error', e)
    }
  }

  useEffect(() => {
    if (isFocused) {
      getProfileTutorial()
    }
  }, [isFocused]);


  let onScrollEnd = (e) => {
    let pageNum = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setPageNumber(pageNum + 1)
    // setPageNumberModal(pageNum + 1)
    // console.log(pageNumber)
  }
  let onScrollEndModal = (e) => {
    let pageNum = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setPageNumberModal(pageNum + 1)
    // console.log(pageNumber)
  }
  const loadImage = () => {
    setLoading(true)
    // console.log('ddttdtd: ', fData)
    fetch(`${BASE_URL}/api/users/${userData.id}/photos/`, {
      method:"POST",
      body: fData,
      headers: {
        'Content-type': 'multipart/form-data',
        'Authorization': `${token._j}`
      }
    }).then((resp) => {
      stat = resp.status
      return resp.json()
    }).then((res) => {
      if (stat == 201) {
        loadUserData()
      }
      else {
        setLoading(false)
      }
    })
    .catch(error => {
      console.log("Error sss", error)
      setLoading(false)
    })
  }

  const cityChange = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/users/${userData.id}/`, {
      method:"PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${token._j}`
      },
      body: JSON.stringify({
        city: cityId,
      })
    }).then((resp) => {
        return resp.json()
    })
    .then(datas => {
        loadUserData()
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  // const loadComments = () => {
  //   setCommentsLoading(true)
  //   fetch(`${BASE_URL}/api/users/${userData.id}/estimation/`, {
  //     method:"GET",
  //     headers: {
  //       'Authorization': `${token._j}`
  //     }
  //   }).then(resp => resp.json())
  //   .then(res => {
  //     const uniqueData = [...comments, ...res.results].filter((item, index, array) => {
  //       return array.findIndex(t => t.id === item.id) === index;
  //     });
  //     setComments(uniqueData)
  //     setCommentsLoading(false)
  //   })
  //   .catch(error => {
  //     console.log("Error", error)
  //   })
  // }

  const recieveRating = () => {
    let status = 0
    setLoading(true)
    fetch(`${BASE_URL}/api/get_rating/one_t/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => {
      status = resp.status
      return resp.json()
    })
    .then(res => {
      if(status == 200) {
        loadUserData()
        setModalBuyRatingGot(1)
      } else if(status == 400) {
        setErrType(1)
        setModalBuyRating(false)
        let text = ''
        for (let i = 0; i < Object.keys(res).length; i++) {
          const key = Object.keys(res)[i];
          const value = Object.values(res)[i];
          text += `${value} `
        }
        setErrText(text)
        setLoading(false)
        setModalErr(true)
      }
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

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

  const useBoostToTop = () => {
    let status = 0
    setLoading(true)
      fetch(`${BASE_URL}/api/boosts/top_raise/`, {
        method:"GET",
        headers: {
          'Authorization': `${token._j}`
        }
      }).then(resp => {
        status = resp.status
        return resp.json()
      }).then(res => {
        if(status == 200) {
          if (res.message == 1) {
            setModalToTheTopGot(1)
            setHasBoostsToTop(res.boosts_qty)
            loadUserData()
          } else if (res.message == 2) {
            setErrType(2)
            setModalToTheTop(false)
            let text = language == 'English' ? 'You are already on top' : 'Ты уже в топе!'
            setErrText(text)
            setLoading(false)
            setModalErr(true)
          } else if (res.message == 3) {
            setErrType(2)
            setModalToTheTop(false)
            let text = language == 'English' ? 'Not enough users to use this boost' : 'Не достаточно пользователей, чтобы использовать этот бустер'
            setErrText(text)
            setLoading(false)
            setModalErr(true)
          }
        } else if(status == 400) {
          setErrType(2)
          setModalToTheTop(false)
          let text = language == 'English' ? 'You have no boosts to top' : 'У вас нет бустеров в наличии'
          setErrText(text)
          setLoading(false)
          setModalErr(true)
        }
      }).catch(error => {
        console.log("Error", error)
        setLoading(false)
      })
  }

  const loadCity = async (cityName) => {
    // Если поле пустое, можно сразу очищать данные и не выполнять запрос
    if (!cityName) {
      setCityData([]);
      setLoadingCity(false)
      return;
    }
    setLoadingCity(true);
    try {
      const response = await fetch(`${BASE_URL}/api/cities/?search=${cityName}`, {
        method: "GET",
      });
      const result = await response.json();
      setCityData(result.results);
      console.log(result);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoadingCity(false);
    }
  };
  const debouncedLoadCity = useCallback(
    debounce((cityName) => {
      loadCity(cityName);
    }, 500),
    []
  );

  const loadVouchers = () => {
    setLoadingVouchers(true)
    fetch(`${BASE_URL}/api/myqrs/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      setVouschersData(res.results)
      setLoadingVouchers(false)
      // console.log(res)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const deleteAccount = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/account_delete/delete_acc/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      checkToken()
    })
    .catch(error => {
      console.log("Error", error)
      setLoading(false)
    })
  }

  const renderCommentsData = (item) => {
    return(
      <View
        style={{ width: '100%', flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'flex-start' }}
      >
        <Image
          style={{ width: 50, height: 50, backgroundColor: '#aaa', borderRadius: 100 }}
          source={require('../images/bgstreet.jpg')}
          blurRadius={5}
        />
        <View
          style={{ marginLeft: 5, width: SCREEN_WIDTH * 0.9 - 75 }}
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Star fill={'yellow'} height={10} width={10} />
            <Text
              style={{ color: '#fff', fontSize: 10, marginLeft: 5, fontFamily: 'SftBold' }}
            >Общительность: {item.comunication}</Text>
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}
          >
            <Star fill={'yellow'} height={10} width={10} />
            <Text
              style={{ color: '#fff', fontSize: 10, marginLeft: 5, fontFamily: 'SftBold' }}
            >Адекватность: {item.activity}</Text>
          </View>
          
          <Text
            style={{ color: '#fff', marginTop: 5, fontFamily: 'SftMedium' }}
          >💬 {item.comment}</Text>
        </View>
        
      </View>
    )
  }

  const renderCityData = (item, index) => {
    return(
    <View>
    <TouchableOpacity style={[styles.cityCardStyle, {height: 50}]} activeOpacity = {1}
    onPress = {() => {
      setCityId(item.id)
      setCity((language == 'English' ? item.name_eng : item.name) + ', ' + item.country)
      setShowCities(false)
      // console.log(cityId)
    }}
    >
      <View style={[{flexDirection:"column", alignItems: 'flex-start', width: '100%'}, index != cityData.length - 1 && { borderBottomWidth: 1,
            borderBottomColor: '#1F3646' }]}> 
        <Text
          style={{ color: '#fff', padding: 13, textAlign: 'left', fontSize: 17, fontFamily: 'SftMedium'}}
        >{language == 'English' ? item.name_eng : item.name}, {item.country}</Text>
      </View>
    </TouchableOpacity>
    </View>
    )
  }

  const tagsToChoose = [
    {"id": 1, "name": "Sport"}, {"id": 2, "name": "Travel"}, {"id": 3, "name": "Shopping"},
    {"id": 4, "name": "Adventure"}, {"id": 5, "name": "Drawing"}, {"id": 6, "name": "Reading"},
    {"id": 7, "name": "Fishing"}, {"id": 8, "name": "Surfing"}, {"id": 9, "name": "Dating"},
    {"id": 10, "name": "Combat sports"}, {"id": 11, "name": "Sea"}, {"id": 12, "name": "Night walking"},
    {"id": 13, "name": "Supernatural"}, {"id": 14, "name": "Games"}
  ]

  const changeProfile = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/users/${userData.id}/profile/${userData.profile.id}/`, {
      method:"PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Authorization': `${token._j}`
      },
      body: JSON.stringify({
        looking_for: lookingFor,
        relationships_status: relationshipsStatus,
        have_kids: kidsStatus,
        height: 0 + height,
        profession: profession,
        work_place: workPlace,
        appreciate: appreciate,
        description: description,
        alcohol: alcohol,
        smoking: smoking,
        tags: choosedTags.map((item, i) => ( item.id ))
      })
    }).then((resp) => {
      return resp.json()
    }).then((res) => {
      loadUserData()
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const changeName = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/users/${userData.id}/`, {
      method:"PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Authorization': `${token._j}`
      },
      body: JSON.stringify({
        name: name
      })
    }).then((resp) => {
      return resp.json()
    }).then((res) => {
      loadUserData()
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  const makeMain = (new_photo_id, prev_photo_id) => {
    setLoading(true)
    fetch(`${BASE_URL}/api/users/${userData.id}/photos/${new_photo_id}/`, {
      method:"PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${token._j}`
      },
      body: JSON.stringify({
        profile_photo: true
      })
    }).then(() => {
      delPrev(prev_photo_id)
    }).then(() => {
      profilePhotoId = new_photo_id
    }).catch(error => {
      console.log("Error", error)
    })
  }
  const deletePhoto = (photo) => {
    setLoading(true)
    fetch(`${BASE_URL}/api/users/${userData.id}/photos/${photo}/`, {
      method:"DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${token._j}`
      }
    }).then(() => {
      loadUserData()
    })
    .catch(error => {
      console.log("Error", error)
    })
  }
  const delPrev = (prev_photo_id) => {
    fetch(`${BASE_URL}/api/users/${userData.id}/photos/${prev_photo_id}/`, {
      method:"PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${token._j}`
      },
      body: JSON.stringify({
        profile_photo: false
      })
      }).then(() => {
        loadUserData()
      })
      .catch(error => {
        console.log("Error", error)
      })
    }
  const loadUserData = () => {
    // setLoading(true)
    fetch(`${BASE_URL}/api/users/me/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (res.blocked) {
        setModalBlockedAccount(true)
      }
      if (pageNumber > res.photos.length) {
        setPageNumber(res.photos.length)
      }
      setUserData(res)
      setHasBoostsToTop(res.my_boosts_qty)
      setKidsStatus(res.profile.have_kids)
      setLookingFor(res.profile.looking_for)
      setProfilePhotos([{"button": true}].concat(res.photos))
      setDescription(res.profile.description)
      setName(res.name)
      setRelationshipsStatus(res.profile.relationships_status)
      setProfession(res.profile.profession)
      setWorkPlace(res.profile.work_place)
      setAppreciate(res.profile.appreciate)
      setAlcohol(res.profile.alcohol)
      setSmoking(res.profile.smoking)
      setHeight(res.profile.height)
      setChoosedTags(res.profile.tags)
      // console.log('profile', profilePhotos)
      setLoading(false)
      setModalChange(false)
      setChooseCityDisplay(false)
      // setModalBuyRating(false)
      setProfileRate((+ (res.profile.looking_for != '') + (res.profile.description != '') +
      (res.profile.relationships_status != '') + (res.profile.profession != '')+ (res.profile.work_place != '') +
      (res.profile.appreciate != '') + (res.profile.alcohol != '') + (res.profile.smoking != '') + (res.profile.have_kids != '') +
      (res.profile.height != 0) + (res.profile.tags.length != 0) + (res.photos.length != 0) * 5) / 16 * 10)
    })
    .catch(error => {
      console.log("Error", error)
      checkToken()
    })
  }
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
        // console.log(languageData)
        languageData != null ? setLanguage(languageData) : setLanguage('Russian')
        return languageData
    } catch(e) {
        setLanguage('Russian')
        console.log('error', e)
    }
  }
  const writeLanguageData = async (value) => {
    try {
        await AsyncStorage.setItem('language', value)
    } catch(e) {
        console.log('error', e)
    }
    // console.log('Done', value)
  }
  const removeTokenData = async () => {
    await AsyncStorage.removeItem('token');
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

  const checkToken = () => {
    removeTokenData()
    .then(() => {
      setLoading(false)
      // console.log('exittoken',AsyncStorage.getItem('token'))
      props.navigation.navigate('StartScreen', {logged_out:true})
    })
    .catch(
      console.log('error')
    )
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

  useEffect(() => {
    getTokenData()
      .then(() => {
        if (isFocused && userData) {
          loadImage()
        }
      })
  }, [fData])

  const PickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission denied!')
        return
      }
      
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
  
      if (!result.canceled) {
        let newImageUri = result.assets[0].uri;
  
        // Сначала изменяем разрешение изображения
        const resizedImage = await ImageManipulator.manipulateAsync(
          newImageUri,
          [],  // Примерное разрешение, можно настроить по своему усмотрению
          {
            format: ImageManipulator.SaveFormat.JPEG,
            compress: 0.95
          }
        );
        newImageUri = resizedImage.uri;
  
        let fileInfo = await FileSystem.getInfoAsync(newImageUri, { size: true });
  
        // Проверка на максимальный размер 15MB
        if (fileInfo.size > 15 * 1024 * 1024) {
          alert('The image size is too large! Please select an image less than 15MB.');
          return;
        }
        let formData = new FormData();
        formData.append('photo', {
          uri: newImageUri,
          name: 'image.jpeg',
          type: 'image/jpeg'
        });
  
        setFData(formData);
      }
    }
  }

  // useEffect(() => {
  //   console.log(description.length)
  // }, [description])

  // useEffect(() => {
  //   if (userData != undefined) {
  //     if(userData.photos.length == 0) {
  //       setHasPhotos(true)
  //     }
  //   }
  // }, [userData])

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
            source={{
              uri: `${BASE_URL}${item.compressed_image_url}`
            }}
            blurRadius={blur}
          />
          </TouchableOpacity>
      </View>
    )
  }

  const renderVouchers = (item) => {
    return(
      <View style={{ width: '50%', padding: 5}}>
        <TouchableOpacity style={{ width: '100%', backgroundColor: '#1E2742', borderRadius: 20 }}
          onPress={() => {
            setQrImage(item)
            setQrShow(true)
          }}
          activeOpacity={0.8}
        >
          <View style={{ width: '100%', padding: 10 }}>
            <Image
              style={{width:'100%', aspectRatio: 1/1, backgroundColor: 'transparent', borderRadius: 10}}
              source={{
                uri: `${BASE_URL}${item.voucher.compressed_image_url}`
              }}
            />
          </View>
          <Text
            style={{ color: '#fff', textAlign: 'center', fontSize: 20, marginVertical: 10, fontFamily: 'SftBold' }}
          >
            {item.voucher.name}
          </Text>
          <Text
            style={{ color: '#818C99', textAlign: 'center', fontSize: 17, marginBottom: 20, fontFamily: 'SftMedium' }}
          >
            {item.company.name}
          </Text>
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
            source={{
              uri: `${BASE_URL}${item.compressed_image_url}`
            }}
          />
      </View>
    )
  }

  const renderPhotos = () => {
    const data = userData.photos
    return data.map((item, i) => {
      if(item.profile_photo == true && item.id != profilePhotoId) {
        profilePhotoId = item.id
      }
        return (
        <TouchableOpacity style={{ width: '33%', padding: 5 }}
        key={item.id}
        onPress={() => {
          setPhotoId(item.id)
          // console.log(item.id)   
          setPhotoProfile(item.profile_photo)
          setModal(true)
         }}
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
        )
    })
  }

  if(!userData || !profilePhotos || !fontsLoaded) {
    return(
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#172136',
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
    )
  };
  return (
    <View style={{flex: 1, backgroundColor: '#172136'}}>
    <ScrollView
    keyboardShouldPersistTaps='handled'
    contentContainerStyle={{alignItems: 'center', backgroundColor: '#172136', flexGrow: 1}}
    scrollIndicatorInsets={{right: 1}}
    showsVerticalScrollIndicator={false}
     >
        <View style={{width:'100%', height: 0.75 * SCREEN_HEIGHT }}>
        <ImageBackground
        source={
          userData.photos.length == 0 ? (userData.sex == 'male' ? require('../images/male.png') : require('../images/female.png')) : {}
        }
        resizeMode='contain'
        style={{width:'100%', height: '100%'}}
        >
          <TouchableOpacity 
            style={{left: 15, top: 50, borderRadius: 100, height: 40, paddingHorizontal: 12, flexDirection: 'row',
              alignItems: 'center', justifyContent: 'center', zIndex: 11111, position: 'absolute',
              backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1 }}
            activeOpacity={1}
            onPress={() => {
              setModalWallet(true)
              loadVouchers()
            }}
          >
            {/* <Image source={require('../images/icon-yellow-rocket.png')} style={{ width: 23, aspectRatio: 1/1 }} /> */}
            <Shop width={24} height={24} />
            <Text
              style={{ color: '#6083FF', fontSize: 17, marginLeft: 5, fontFamily: 'SftMedium' }}
            >
              {userData.profile.my_vallet} cash
            </Text>
          </TouchableOpacity>
          <View style={{ right: 15, top: 50, position: 'absolute', flexDirection: 'row', flexWrap: 'wrap',
                         zIndex: 11111 }}>
          <TouchableOpacity
            onPress={() => {
              setModalSettings(true)
            }}
            style={{borderRadius: 100, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', 
              backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0},
              shadowRadius: 1, marginHorizontal: 7 }}
            activeOpacity={1}
           >
              <Settings width={25} height={25} />
          </TouchableOpacity>
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
          </View>
          {userData.photos.length > 0 && (
          <View>
          {/* <View style={{ zIndex: 100, width: '100%', height: 120, position: 'absolute', opacity: 0.5 }}>
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
          </View> */}
          {/* <View style={{ position: 'absolute', top: 50, left: 15, height: 40, zIndex: 100, alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{  color: '#fff', fontSize: 15, zIndex: 100 }}
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
            style={{ backgroundColor: '#0F1826' }}
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
            setModal(false)
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.8,
            position:'absolute',
            left: 0,
            top: 0,
            zIndex: 0
          }}
          activeOpacity={0.8}
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
            // console.log(photoId)
            {photoProfile != true && makeMain(photoId, profilePhotoId)}
            setModal(false)
          }}
          style={{
            height: '50%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 0.5,
            borderBottomColor: '#153850'
          }}
          activeOpacity={1}
          >
            <Text style={{ fontSize: 20, fontFamily: 'SftMedium', color: '#6083FF' }}>{language == 'English' ? 'Make main' : 'Сделать главным'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            if (userData.photos.length > 1) {
              deletePhoto(photoId)
              setModal(false)
            } else {
              alert('В профиле должно быть как минимум одно фото!')
              setModal(false)
            }
            
          }}
          style={{
            height: '50%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          activeOpacity={1}
          >
            <Text style={{ fontSize: 20, fontFamily: 'SftMedium', color: '#FF2525' }}>{language == 'English' ? 'Delete' : 'Удалить'}</Text>
          </TouchableOpacity>
          </View>
          <View
          style={{
            backgroundColor: '#172136',
            borderRadius: 15,
            width: '90%',
            height: 60,
            marginTop: 20,
            bottom: 70,
            overflow:'hidden'
          }}
          >
          <TouchableOpacity onPress={() => {         
              setModal(false)    
          }}
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          activeOpacity={1}
          >
            <Text style={{ fontSize: 20, fontFamily: 'SftMedium', color: '#fff' }}>{language == 'English' ? 'Cancel' : 'Отменить'}</Text>
          </TouchableOpacity>
          </View>
        </View>
        </Modal>
        <View
              style={[{ height: '0%', width: SCREEN_WIDTH, 
              alignSelf: 'center', marginTop: '20%', zIndex: 100 }]}
            >
            <BlurView style={{ position: 'absolute', width: '90%', alignSelf: 'center', zIndex: 100, bottom: 0,
            borderRadius: 40, overflow: 'hidden', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            intensity={70}
            >
              {/* {Platform.OS === 'android' && <LinearGradient
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
            />} */}
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
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            />}
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
               <Text
                numberOfLines={1}
                style={{fontSize: 25, maxWidth: '80%', textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                color: '#fff', letterSpacing: 0}}
              >{userData.name}</Text>
              <Text
                style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                  color: '#fff', letterSpacing: 0, marginRight: 2 }}
              >, {userData.age}</Text>
                {userData.verified ? <TouchableOpacity
                  onPress={() => {
                    setModalVerification(true)
                  }}
                ><CheckMark width={30} height={30} style={{ shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: {width: 0, height: 0}, shadowRadius: 3 }} /></TouchableOpacity> : 
                <TouchableOpacity
                  onPress={() => {
                    setModalVerificationStart(true)
                  }}
                ><CheckMarkNoBg width={30} height={30} color={'#aaa'} style={{ shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 0}, shadowRadius: 1 }} /></TouchableOpacity>}
                <View
                  style={{ backgroundColor: '#65B141', width: 7, aspectRatio: 1/1, borderRadius: 100, marginLeft: 5 }}
                ></View>
                </View>
                <View >
                {userData.profile.description != '' ? <Text
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
             
            </BlurView>
            </View>
            <View
          style={{ width: '90%', alignItems: 'center' }}
        ><BlurView
          style={{ marginBottom: 10, marginTop: 20, borderRadius: 30,
                   overflow: 'hidden', width: '100%', paddingVertical: 20,
                   paddingHorizontal: 10}}
          intensity={30}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                width: '100%' }}
          >
          <View style={{justifyContent: 'center', alignItems: 'center', width: '33%'}}>
            <Text
             numberOfLines={1}
             style={[{color: '#A7A3AE', fontFamily: 'SftMedium'}, language == 'English' ? {fontSize:17} : {fontSize: 14}]}>{language == 'English' ? 'Profile' : 'Профиль'}</Text>
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
            <Text style={{fontSize:20, color: '#fff', fontFamily: 'SftBold'}}>{(parseInt(profileRate * 10)) / 10}/10</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', width: '33%'}}>
            <Text
             numberOfLines={1}
             style={[{color: '#A7A3AE', fontFamily: 'SftMedium'}, language == 'English' ? {fontSize:17} : {fontSize: 14}]}>{language == 'English' ? 'Comunication' : 'Общительность'}</Text>
            <View style={{height: 40, marginVertical: 10}}>
            <View>
              <Star fill={'#A7A3AE'} height={'100%'} width={40} style={{ zIndex: 100, opacity: 1 }} />
              <View style={{ zIndex: 1000, position: 'absolute', height: `${userData.profile.comunication * 10}%`, width: 40, bottom: 0, overflow: 'hidden' }}>
                <Star fill={'yellow'} height={40} width={40} style={{ zIndex: 1000, opacity: 1, position: 'absolute', bottom: 0 }} />
              </View>
              </View>
            </View>
            <Text style={{fontSize:20, color: '#fff', fontFamily: 'SftBold'}}>{userData.profile.comunication < 10 ? userData.profile.comunication.toFixed(1) : userData.profile.comunication}/10</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', width: '33%'}}>
            <Text
             numberOfLines={1}
             style={[{color: '#A7A3AE', fontFamily: 'SftMedium'}, language == 'English' ? {fontSize:17} : {fontSize: 14}]}>{language == 'English' ? 'Adequacy' : 'Адекватность'}</Text>
            <View style={{height: 40, marginVertical: 10}}>
              <View style={{ shadowColor: '#B5FF3C', shadowOpacity: 0, shadowOffset: {width: -20 }, shadowRadius: 40 }}>
              {Platform.OS === 'android' && <Shadow
                distance={60}
                offset={[-20, 20]}
                startColor='rgba(181, 255, 60, 0.08)'
              />}
              <View style={{ shadowColor: '#B5FF3C', shadowOpacity: 0.8, shadowOffset: {width: -20 }, shadowRadius: 40 }}>
              <Star fill={'#A7A3AE'} height={'100%'} width={40} style={{ zIndex: 100, opacity: 1 }} />
              <View style={{ zIndex: 1000, position: 'absolute', height: `${userData.profile.activity * 10}%`, width: 40, bottom: 0, overflow: 'hidden' }}>
                <Star fill={'yellow'} height={40} width={40} style={{ zIndex: 1000, opacity: 1, position: 'absolute', bottom: 0 }} />
              </View>
              </View>
              </View>
            </View>
            <Text style={{fontSize:20, color: '#fff', fontFamily: 'SftBold'}}>{userData.profile.activity < 10 ? userData.profile.activity.toFixed(1) : userData.profile.activity}/10</Text>
          </View>
          </View>
          {commentsWindow && <ScrollView
            style={{ maxHeight: 180, width: SCREEN_WIDTH * 0.9 - 15 }}
            horizontal={true}
            bounces={false}
          >
            <View
              style={{ width: SCREEN_WIDTH * 0.9 - 20, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginTop: 10, position: 'absolute' }}
            />
            {!commentsLoading ? comments.length > 0 ? <FlatList
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
            />}
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
          </View>
        <View style={{ width: '90%', marginBottom: 20, paddingHorizontal: 5 }}>
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
        {userData.profile.description.length > 0 && <Text style={[{fontSize:30, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff', fontFamily: 'SftBold',
        // shadowRadius: 10, shadowOpacity: 1, shadowOffset: {width: 0, height: 0},
         marginTop: 20, marginBottom: 8}]}>{language == 'English' ?  'About me' : 'О себе'}</Text>}
          {userData.profile.description.length > 0 && <Text
           style={{ color: '#fff', width: '100%', fontSize: 17, fontFamily: 'SftMedium', marginBottom: 10 }}
           numberOfLines={12}
          >{userData.profile.description}</Text>}
        <Text style={[{fontSize:30, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff', fontFamily: 'SftBold',
        // shadowRadius: 10, shadowOpacity: 1, shadowOffset: {width: 0, height: 0},
         marginTop: 20, marginBottom: 0}]}>{language == 'English' ?  'Interests' : 'Интересы'}</Text>
        {userData.profile.tags.length > 0 ? (Platform.OS === 'ios' ? <View style={{ width: SCREEN_WIDTH * 0.9, flexDirection: 'row', flexWrap: 'wrap',
          marginVertical: 12, left: -5 }}>
          {userData.profile.tags.map((item, i) => {
            return <View
            key={item.id}
            style={{ borderWidth: 1, borderColor: '#fff', backgroundColor: '#172136', borderRadius: 100, paddingVertical: 10, paddingHorizontal: 20,
            shadowColor: '#fff', shadowOpacity: 0.7, shadowOffset: {width: 0, height: 0}, shadowRadius: 3, marginHorizontal: 5,
            marginVertical: 5 }}>
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'SftMedium' }}>{item.name}</Text>
            </View>
          })}
        </View> :

        <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', marginVertical: 15 }}>
        {userData.profile.tags.map((item, i) => {
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
              <Text style={{ color: '#fff', fontSize: 16, lineHeight: 19, fontFamily: 'SftMedium', }}>{item.name}</Text>
            </View>
            </Shadow>
          })}
      </View>) : <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', marginVertical: 15 }}>
         <View
            style={{ borderWidth: 1, borderColor: '#fff', borderRadius: 100, paddingVertical: 10, paddingHorizontal: 20,
            shadowColor: '#fff', shadowOpacity: 1, shadowOffset: {width: 0, height: 0}, shadowRadius: 3, marginHorizontal: 5,
            marginVertical: 5, elevation: 3, backgroundColor: '#172136' }}>
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'SftMedium' }}>{language == 'English' ? 'No interests yet' : 'Пока что нет интересов'}</Text>
            </View>
            </View>}
        <Text style={[{fontSize:30, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff',
        // shadowRadius: 10, shadowOpacity: 1, shadowOffset: {width: 0, height: 0},
         marginTop: 20, marginBottom: 12, fontFamily: 'SftBold'}]}>{language == 'English' ? 'Info' : 'Информация'}</Text>
        <View style={{ width: '100%'}}>
        <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'From' : 'Город'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.city.name_eng : userData.city.name}, {userData.city.country}</Text>
          </View>
          {userData.profile.looking_for != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Looking for': 'Я ищу'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.profile.looking_for : lookingForRussian[userData.profile.looking_for]}</Text>
          </View>}
          {userData.profile.relationships_status != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Relationship status' : 'Статус'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.profile.relationships_status : userData.sex == 'male' ? relationshipsStatusRussian[userData.profile.relationships_status] : relationshipsStatusFemRussian[userData.profile.relationships_status]}</Text>
          </View>}
          {userData.profile.have_kids != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Kids' : 'Дети'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.profile.have_kids : kidsRussian[userData.profile.have_kids]}</Text>
          </View>}
          {userData.profile.height != 0 && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Height' : 'Рост'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{userData.profile.height}</Text>
          </View>}
          {userData.profile.profession != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Profession' : 'Специальность'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{userData.profile.profession}</Text>
          </View>}
          {userData.profile.work_place != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Place of work' : 'Место работы'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{userData.profile.work_place}</Text>
          </View>}
          {userData.profile.appreciate != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Appreciate in others' : 'Ценю в других'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.profile.appreciate : appreciateRussian[userData.profile.appreciate]}</Text>
          </View>}
          {userData.profile.alcohol != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Alcohol' : 'Алкоголь'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.profile.alcohol : alcoholRussian[userData.profile.alcohol]}</Text>
          </View>}
          {userData.profile.smoking != '' && <View style={{ width: '100%', flexDirection: 'row', marginBottom: 12 }}>
            <Text style={{ color: '#E0E0E0', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? 'Smoking' : 'Курение'}</Text>
            <Text style={{ color: '#fff', width: '50%', fontSize: 17, fontFamily: 'SftMedium' }}>{language == 'English' ? userData.profile.smoking : smokingRussian[userData.profile.smoking]}</Text>
          </View>}
        </View>
        <Text style={[{fontSize:30, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff',
        // shadowRadius: 10, shadowOpacity: 1, shadowOffset: {width: 0, height: 0},
         marginTop: 20, marginBottom: 12, fontFamily: 'SftBold'}]}>{language == 'English' ? 'Photos' : 'Фото'}</Text>
        <View style={{ width: SCREEN_WIDTH * 0.9, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center', left: -5 }}>
        {userData.photos.length < 6 && <View style={[styles.cardStyle, { width: '33%', aspectRatio:1/1, 
        shadowColor: '#90A9FF',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.8,
        shadowRadius: 5 }]}>
        <IconButton
          icon='plus'
          iconColor='#fff'
          mode='contained'
          size={50}
          style={{
            borderRadius: 20,
            borderColor: '#90A9FF',
            flex: 1,
            margin: 0,
            aspectRatio: 1/1,
            backgroundColor: '#172136',
            borderWidth: 1
          }}
          onPress={PickImage}
        /></View>}
        {renderPhotos()}
        </View>
        </View>
        <View style={{ width: '100%', height: 90, bottom: 0,
        zIndex: 100, alignItems: 'center' }}>
        <View style={{ width: '90%', marginTop: 10 }}>
        <TouchableOpacity
          onPress={() => {
            checkToken()
          }}
          style={[{ borderWidth: 1, borderColor: '#90A9FF', borderRadius: 100, paddingVertical: 12,
          shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.8, shadowRadius: 5, backgroundColor: '#172136' },
          Platform.OS === 'android' && {elevation: 3}]}
          activeOpacity={0.8}
          >
          <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Log out' : 'Выйти'}</Text>
          </TouchableOpacity>
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
          ref={pinchRef}
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
          }} onPress={() => setModalGallery(false)}>
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
            height: '100%',
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
          <KeyboardAvoidingView style={{
            height: '100%',
            width: '100%'
        }}
        // contentContainerStyle={{paddingBottom: 20}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -SCREEN_HEIGHT}
        >
          {chooseCityDisplay &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}>

            <TouchableOpacity
              style={{ width: '100%', height: '100%', backgroundColor: "#172136" }}
              activeOpacity={1}
              onPress={() => {Keyboard.dismiss()}}
            >

            <View style={{ height: headerHeight, backgroundColor: '#0F1826', borderTopLeftRadius: 10, borderTopRightRadius: 10, 
            alignItems: 'flex-end', paddingBottom: 10, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                      setChooseCityDisplay(false)
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'City' : 'Город'}</Text>
                </View>
                <TouchableOpacity
                onPress={() => {
                  if (!cityId) {
                      alert("You should choose a valid city")
                  }
                  else {
                      cityChange()
                  }
              }}
                style={{ width: '20%' }}
                activeOpacity={1}
            >
                <Text style={{ fontSize: 20, fontWeight: '300', color: '#6083FF', textAlign: 'center', fontFamily: 'SftLight'}}>Save</Text>
            </TouchableOpacity>
            </View>
            <Text style={{ marginLeft: 10, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', marginTop: 30, fontFamily: 'SftLight', marginBottom: 5 }}>{language == 'English' ? 'City' : 'Город'}</Text>
            <TextInput
              style = {{padding:2,
                margin:10,
                marginVertical: 5,
                fontSize: 19,
                fontWeight: '300'
              }}
              contentStyle={{ fontFamily: 'SftLight' }}
              placeholder={language == 'English' ? 'Enter the name' : 'Введите название'}
              placeholderTextColor={'#818C99'}
              textColor='#fff'
              selectionColor='#818C99'
              outlineColor='transparent'
              outlineStyle={{ borderRadius: 13, borderWidth: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
              mode='outlined'
              value={city}
              onChangeText = {(city) => {
                setCity(city)
                setLoadingCity(true)
                debouncedLoadCity(city);
                setShowCities(true)
              }}
              onEndEditing = {() => setShowCities(false)}
            />
            <View style={{ zIndex: 100, width: '100%' }}>
        {showCities && <ScrollView 
            style={{width: '100%', height: 200, position: 'absolute', zIndex: 100}}
            bounces={false}
            horizontal={true}
            keyboardShouldPersistTaps='handled'
        >
          <View style={{  width: SCREEN_WIDTH, }}>
                      <View
                        style={{ height: 10 }}
                      >
                      {loadingCity && <ActivityIndicator size="small" color="#fff" />}
                      </View>
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
            </View>
              </ScrollView>}
         </View>
            </TouchableOpacity>
            </View>
            }
          {lookingPickerDisplay &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
            <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
            activeOpacity={0.5}
            onPress={() => {setLookingPickerDisplay(false)}}
            >
            </TouchableOpacity>
            <Picker
              style={{ width: '80%', backgroundColor: '#172136', zIndex: 10000, borderRadius: 15 }}
              selectedValue={lookingFor}
              onValueChange={(itemValue, itemIndex) => setLookingFor(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='None'
                value={''}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Serious relationships' : 'Серьезные отношения'}
                value={'Serious relationships'}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Friends' : 'Друзей'}
                value={'Friends'}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Hang out' : 'Тусовку'}
                value={'Hang out'}
                color='#fff'
              />
            </Picker>
            </View>
            }
            {appreciatePickerDisplay &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
            <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
            activeOpacity={0.5}
            onPress={() => {setAppreciatePickerDisplay(false)}}
            >
            </TouchableOpacity>
            <Picker
              style={{ width: '80%', backgroundColor: '#172136', zIndex: 10000, borderRadius: 15 }}
              selectedValue={appreciate}
              onValueChange={(itemValue, itemIndex) => setAppreciate(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='None'
                value={''}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Kindness and honesty' : 'Доброту и честность'}
                value={'Kindness and honesty'}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Intelligence and purpose' : 'Ум и целеустремленность'}
                value={'Intelligence and purpose'}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Sense of humor' : 'Чувство юмора'}
                value={'Sense of humor'}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Loyalty' : 'Верность'}
                value={'Loyalty'}
                color='#fff'
              />
            </Picker>
            </View>
            }

            {alcoholPickerDisplay &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
            <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
            activeOpacity={0.5}
            onPress={() => {setAlcoholPickerDisplay(false)}}
            >
            </TouchableOpacity>
            <Picker
              style={{ width: '80%', backgroundColor: '#172136', zIndex: 10000, borderRadius: 15 }}
              selectedValue={alcohol}
              onValueChange={(itemValue, itemIndex) => setAlcohol(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='None'
                value={''}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Often' : 'Часто'}
                value={'Often'}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Sometimes' : 'Иногда'}
                value={'Sometimes'}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Never' : 'Не пью'}
                value={'Never'}
                color='#fff'
              />
            </Picker>
            </View>
            }
            {smokingPickerDisplay &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
            <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
            activeOpacity={0.5}
            onPress={() => {setSmokingPickerDisplay(false)}}
            >
            </TouchableOpacity>
            <Picker
              style={{ width: '80%', backgroundColor: '#172136', zIndex: 10000, borderRadius: 15 }}
              selectedValue={smoking}
              onValueChange={(itemValue, itemIndex) => setSmoking(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='None'
                value={''}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Often' : 'Часто'}
                value={'Often'}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Sometimes' : 'Иногда'}
                value={'Sometimes'}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Never' : 'Не курю'}
                value={'Never'}
                color='#fff'
              />
            </Picker>
            </View>
            }
            {relationsPickerDisplay &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
            <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
            activeOpacity={0.5}
            onPress={() => {setRelationsPickerDisplay(false)}}
            >
            </TouchableOpacity>
            <Picker
              style={{ width: '80%', backgroundColor: '#172136', zIndex: 10000, borderRadius: 15 }}
              selectedValue={relationshipsStatus}
              onValueChange={(itemValue, itemIndex) => setRelationshipsStatus(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='None'
                value={''}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Single' : userData.sex == 'male' ? 'Свободен' : 'Свободна'}
                value={'Single'}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Engaged' : userData.sex == 'male' ? 'Помолвлен' : 'Помолвлена'}
                value={'Engaged'}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Married' : userData.sex == 'male' ? 'Женат' : 'Замужем'}
                value={'Married'}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'In relationships' : 'В отношениях'}
                value={'In relationships'}
                color='#fff'
              />
            </Picker>
            </View>
            }

          {kidsPickerDisplay &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
            <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
            activeOpacity={0.5}
            onPress={() => {setKidsPickerDisplay(false)}}
            >
            </TouchableOpacity>
            <Picker
              style={{ width: '80%', backgroundColor: '#172136', zIndex: 10000, borderRadius: 15 }}
              selectedValue={kidsStatus}
              onValueChange={(itemValue, itemIndex) => setKidsStatus(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='None'
                value={''}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? 'Yes I have' : 'Есть'}
                value={'Yes I have'}
                color='#fff'
              />
              <Picker.Item
                label={language == 'English' ? "No I haven't" : 'Нет'}
                value={"No I haven't"}
                color='#fff'
              />
            </Picker>
            </View>
            }

            <View style={{ height: headerHeight, backgroundColor: '#0F1826',
            alignItems: 'flex-end', paddingBottom: 10, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                      setModalChange(false)
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Edit profile' : 'Редактировать'}</Text>
                </View>
                <TouchableOpacity
                onPress={() => {
                  changeProfile()
                  setModalChange(false)
                }}
                style={{ width: '20%' }}
                activeOpacity={1}
            >
                <Text style={{ fontSize: 20, fontWeight: '300', color: '#6083FF', textAlign: 'center', fontFamily: 'SftLight'}}>Save</Text>
            </TouchableOpacity>
            </View>
          <ScrollView
            bounces={true}
            style={{flex: 1}}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >

          <View
            style={{ margin: 10 }}
          >
          <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', fontWeight: '300', marginTop: 20, marginBottom: 5, fontFamily: 'SftLight' }}>{language == 'English' ? 'City' : 'Город'}</Text>
          <TouchableOpacity
              style={{ padding: 19, marginVertical: 5, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                setChooseCityDisplay(true)
              }}
            >
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '300', fontFamily: 'SftLight' }}>{language == 'English' ? userData.city.name_eng : userData.city.name}, {userData.city.country}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity>
          </View>
          <View style={{ margin: 10}}>
          <Text style={{ fontSize: 17, textAlign: 'left', marginBottom: 5, color: '#6D7885', fontWeight: '300', overflow: 'hidden', fontFamily: 'SftLight' }}>{language == 'English' ? 'About you' : 'О себе'}: </Text>  
            <TextInput
              placeholder={language == 'English' ? 'Discribe yourself' : 'Пару слов о себе'}
              placeholderTextColor={'#818C99'}
              contentStyle={{ fontFamily: 'SftLight' }}
              style={{ padding: 2, marginVertical: 5, fontSize: 19, fontWeight: '300', fontFamily: 'SftLight', minHeight: 90, maxHeight: 140 }}
              mode='outlined'
              value={`${description}`}
              maxLength={500}
              multiline={true}
              textColor='#fff'
              selectionColor='#818C99'
              outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
              onChangeText={(newDescription) => {
                const maxNewLines = 11;
                const newLinesCount = newDescription.split('\n').length - 1;
            
                if (newLinesCount <= maxNewLines) {
                  setDescription(newDescription);
                } else {
                  // Если количество переносов строки превышает максимум,
                  // сохраняем текущий текст без добавления новой строки.
                  const lines = newDescription.split('\n');
                  const trimmedDescription = lines.slice(0, maxNewLines + 1).join('\n');
                  setDescription(trimmedDescription);
                }
              }}
            />
          </View>
          <View style={{ margin: 10}}>
          <Text style={{ fontSize: 17, textAlign: 'left', marginBottom: 5, color: '#6D7885', fontWeight: '300', fontFamily: 'SftLight'}}>{language == 'English' ? 'Height' : 'Рост'}: </Text>  
            <TextInput
              placeholder='(sm)'
              style={{ maxWidth: 70, padding: 2, marginVertical: 5, fontSize: 19, fontWeight: '300', textAlign: 'center' }}
              contentStyle={{ fontFamily: 'SftLight' }}
              mode='outlined'
              keyboardType='number-pad'
              value={`${height}`}
              maxLength={3}
              textColor='#fff'
              selectionColor='#818C99'
              outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
              onChangeText = {(height) => {
              setHeight(height)
            }}
            />
          </View>
          <View style={{ margin: 10}}>
          <Text style={{ fontSize: 17, textAlign: 'left', marginBottom: 5, color: '#6D7885', fontWeight: '300', fontFamily: 'SftLight'}}>{language == 'English' ? 'Profession' : 'Специальность'}: </Text>  
            <TextInput
              placeholder={language == 'English' ? 'What is your profession?' : 'Род деятельности'}
              placeholderTextColor={'#818C99'}
              style={{ padding: 2, marginVertical: 5, fontSize: 19, fontWeight: '300' }}
              contentStyle={{ fontFamily: 'SftLight' }}
              mode='outlined'
              value={`${profession}`}
              maxLength={40}
              textColor='#fff'
              selectionColor='#818C99'
              outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
              onChangeText = {(profession) => {
              setProfession(profession)
            }}
            />
          </View>
       
          <View style={{ margin: 10}}>
          <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', marginBottom: 5, fontWeight: '300', fontFamily: 'SftLight'}}>{language == 'English' ? 'Place of work' : 'Место работы'}: </Text>  
            <TextInput
              placeholder={language == 'English' ? 'Where do you work?' : 'Где ты работаешь?'}
              placeholderTextColor={'#818C99'}
              style={{ padding: 2, marginVertical: 5, fontSize: 19, fontWeight: '300' }}
              contentStyle={{ fontFamily: 'SftLight' }}
              mode='outlined'
              value={`${workPlace}`}
              maxLength={40}
              textColor='#fff'
              selectionColor='#818C99'
              outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
              onChangeText = {(workPlace) => {
              setWorkPlace(workPlace)
            }}
            />
          </View>
          <View style={{ margin: 10}}>
          <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', fontWeight: '300', marginBottom: 5, fontFamily: 'SftLight'}}>{language == 'English' ? 'Looking for' : 'Я ищу'}: </Text> 
          {Platform.OS === 'ios' ? <TouchableOpacity
              style={{ padding: 19, marginVertical: 5, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                setLookingPickerDisplay(true)
              }}
            >
              <Text style={[{ fontSize: 17, fontWeight: '300', fontFamily: 'SftLight' }, lookingFor != '' ? {color: '#fff' }: {color: '#818C99'}]}>{lookingFor != '' ? language == 'English' ?  lookingFor : lookingForRussian[lookingFor] : (language == 'English' ? 'Choose' : 'Выбрать')}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity>: 
            <View style={{ borderRadius: 13, overflow: 'hidden' }}>
            <Picker
            style={{ width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 10000, borderRadius: 13 }}
            dropdownIconColor={'#fff'}
            dropdownIconRippleColor={'#000'}
            selectedValue={lookingFor}
            onValueChange={(itemValue, itemIndex) => setLookingFor(itemValue)}
            mode='dropdown'
          >
            <Picker.Item
              label='None'
              value={''}
              color='#fff'
              style={{ backgroundColor: '#071620' }}
            />
            <Picker.Item
              label={language == 'English' ? 'Serious relationships' : 'Серьезные отношения'}
              value={'Serious relationships'}
              color='#fff'
              style={{ backgroundColor: '#071620' }}
            />
            <Picker.Item
              label={language == 'English' ? 'Friends' : 'Друзей'}
              value={'Friends'}
              color='#fff'
              style={{ backgroundColor: '#071620' }}
            />
            <Picker.Item
              label={language == 'English' ? 'Hang out' : 'Тусовку'}
              value={'Hang out'}
              color='#fff'
              style={{ backgroundColor: '#071620' }}
            />
            
          </Picker>
          </View> }
          </View>
          <View style={{ margin: 10}}>
            <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', fontWeight: '300', marginBottom: 5, fontFamily: 'SftLight'}}>{language == 'English' ? 'Relationships status' : 'Семейное положение'}:</Text>
            {Platform.OS === 'ios' ? <TouchableOpacity
              style={{ padding: 19, marginVertical: 5, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                setRelationsPickerDisplay(true)
              }}
            >
              <Text style={[{ fontSize: 17, fontWeight: '300', fontFamily: 'SftLight' }, relationshipsStatus != '' ? {color: '#fff' }: {color: '#818C99'}]}>{relationshipsStatus != '' ? language == 'English' ?  relationshipsStatus : (userData.sex == 'male' ? relationshipsStatusRussian[relationshipsStatus] : relationshipsStatusFemRussian[relationshipsStatus]) : (language == 'English' ? 'Choose' : 'Выбрать')}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity> : 
            <View style={{ borderRadius: 13, overflow: 'hidden' }}>
              <Picker
              style={{  width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 10000, borderRadius: 13 }}
              dropdownIconColor={'#fff'}
              dropdownIconRippleColor={'#000'}
              selectedValue={relationshipsStatus}
              onValueChange={(itemValue, itemIndex) => setRelationshipsStatus(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='None'
                value={''}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label={language == 'English' ? 'Single' : userData.sex == 'male' ? 'Свободен' : 'Свободна'}
                value={'Single'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label={language == 'English' ? 'Engaged' : userData.sex == 'male' ? 'Помолвлен' : 'Помолвлена'}
                value={'Engaged'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label={language == 'English' ? 'Married' : userData.sex == 'male' ? 'Женат' : 'Замужем'}
                value={'Married'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label={language == 'English' ? 'In relationships' : 'В отношениях'}
                value={'In relationships'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
            </Picker>
            </View>
            }
          </View>
          <View style={{ margin: 10}}>
            <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', fontWeight: '300', marginBottom: 5, fontFamily: 'SftLight'}}>{language == 'English' ? 'Kids' : 'Дети'}:</Text>
            {Platform.OS === 'ios' ? <TouchableOpacity
              style={{ padding: 19, marginVertical: 5, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                setKidsPickerDisplay(true)
              }}
            >
              <Text style={[{ fontSize: 17, fontWeight: '300', fontFamily: 'SftLight' }, kidsStatus != '' ? {color: '#fff' }: {color: '#818C99'}]}>{kidsStatus != '' ? language == 'English' ?  kidsStatus : kidsRussian[kidsStatus] : (language == 'English' ? 'Choose' : 'Выбрать')}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity> : 
            <View style={{ borderRadius: 13, overflow: 'hidden' }}>
              <Picker
              style={{  width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 10000, borderRadius: 13 }}
              dropdownIconColor={'#fff'}
              dropdownIconRippleColor={'#000'}
              selectedValue={kidsStatus}
              onValueChange={(itemValue, itemIndex) => setKidsStatus(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='None'
                value={''}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label={language == 'English' ? 'Yes I have' : 'Есть'}
                value={'Yes I have'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label={language == 'English' ? "No I haven't" : 'Нет'}
                value={"No I haven't"}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
            </Picker>
            </View>
            }
          </View>
          <View style={{ margin: 10}}>
            <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', fontWeight: '300', marginBottom: 5, fontFamily: 'SftLight'}}>{language == 'English' ? 'Appreciate in others' : 'Ценю в других'}:</Text>
            {Platform.OS === 'ios' ? <TouchableOpacity
              style={{ padding: 19, marginVertical: 5, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                setAppreciatePickerDisplay(true)
              }}
            >
              <Text style={[{ fontSize: 17, fontWeight: '300', fontFamily: 'SftLight' }, appreciate != '' ? {color: '#fff' }: {color: '#818C99'}]}>{appreciate != '' ? language == 'English' ? appreciate : appreciateRussian[appreciate] : (language == 'English' ? 'Choose' : 'Выбрать')}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity>:
            <View style={{ borderRadius: 13, overflow: 'hidden' }}>
              <Picker
              style={{  width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 10000, borderRadius: 13 }}
              dropdownIconColor={'#fff'}
              dropdownIconRippleColor={'#000'}
              selectedValue={appreciate}
              onValueChange={(itemValue, itemIndex) => setAppreciate(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='None'
                value={''}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label={language == 'English' ? 'Kindness and honesty' : 'Доброту и честность'}
                value={'Kindness and honesty'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label={language == 'English' ? 'Intelligence and purpose' : 'Ум и целеустремленность'}
                value={'Intelligence and purpose'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label={language == 'English' ? 'Sense of humor' : 'Чувство юмора'}
                value={'Sense of humor'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label={language == 'English' ? 'Loyalty' : 'Верность'}
                value={'Loyalty'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
            </Picker>
            </View>
            }
          </View>
          <View style={{ margin: 10}}>
            <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', fontWeight: '300', marginBottom: 5, fontFamily: 'SftLight'}}>{language == 'English' ? 'Alcohol' : 'Алкоголь'}:</Text>
            {Platform.OS === 'ios' ? <TouchableOpacity
              style={{ padding: 19, marginVertical: 5, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                setAlcoholPickerDisplay(true)
              }}
            >
              <Text style={[{ fontSize: 17, fontWeight: '300', fontFamily: 'SftLight' }, alcohol != '' ? {color: '#fff' }: {color: '#818C99'}]}>{alcohol != '' ? language == 'English' ? alcohol : alcoholRussian[alcohol] : (language == 'English' ? 'Choose' : 'Выбрать')}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity> : 
              <View style={{ borderRadius: 13, overflow: 'hidden' }}>
                <Picker
                style={{  width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 10000, borderRadius: 13 }}
                dropdownIconColor={'#fff'}
                dropdownIconRippleColor={'#000'}
                selectedValue={alcohol}
                onValueChange={(itemValue, itemIndex) => setAlcohol(itemValue)}
                mode='dropdown'
                >
                <Picker.Item
                label='None'
                value={''}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
                />
                <Picker.Item
                label={language == 'English' ? 'Often' : 'Часто'}
                value={'Often'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
                />
                <Picker.Item
                label={language == 'English' ? 'Sometimes' : 'Иногда'}
                value={'Sometimes'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
                />
                <Picker.Item
                label={language == 'English' ? 'Never' : 'Не пью'}
                value={'Never'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
                />
                </Picker>
              </View>
            }
          </View>
          <View style={{ margin: 10}}>
            <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', fontWeight: '300', marginBottom: 5, fontFamily: 'SftLight'}}>{language == 'English' ? 'Smoking' : 'Сигареты'}:</Text>
            {Platform.OS === 'ios' ? <TouchableOpacity
              style={{ padding: 19, marginVertical: 5, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                setSmokingPickerDisplay(true)
              }}
            >
              <Text style={[{ fontSize: 17, fontWeight: '300', fontFamily: 'SftLight' }, smoking != '' ? {color: '#fff' }: {color: '#818C99'}]}>{smoking != '' ? language == 'English' ? smoking : smokingRussian[smoking] : (language == 'English' ? 'Choose' : 'Выбрать')}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity> : 
            <View style={{ borderRadius: 13, overflow: 'hidden' }}>
                <Picker
                  style={{  width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 10000, borderRadius: 13 }}
                  dropdownIconColor={'#fff'}
                  dropdownIconRippleColor={'#000'}
                  selectedValue={smoking}
                  onValueChange={(itemValue, itemIndex) => setSmoking(itemValue)}
                  mode='dropdown'
                >
                  <Picker.Item
                    label='None'
                    value={''}
                    color='#fff'
                    style={{ backgroundColor: '#071620' }}
                  />
                  <Picker.Item
                    label={language == 'English' ? 'Often' : 'Часто'}
                    value={'Often'}
                    color='#fff'
                    style={{ backgroundColor: '#071620' }}
                  />
                  <Picker.Item
                    label={language == 'English' ? 'Sometimes' : 'Иногда'}
                    value={'Sometimes'}
                    color='#fff'
                    style={{ backgroundColor: '#071620' }}
                  />
                  <Picker.Item
                    label={language == 'English' ? 'Never' : 'Не курю'}
                    value={'Never'}
                    color='#fff'
                    style={{ backgroundColor: '#071620' }}
                  />
                </Picker>
            </View>
            }
          </View>
          <View style={{ margin: 10}}>
            <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', fontWeight: '300', marginBottom: 5, fontFamily: 'SftLight'}}>{language == 'English' ? 'Interests' : 'Интересы'} <Text style={{ fontSize: 15 }}>{choosedTags.length}/8:</Text></Text>
            <ScrollView
              style={{ flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 15, overflow: 'visible' }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            >

            <View
              style={{ width: '100%', width: SCREEN_WIDTH * 1.5, flexDirection: 'row', flexWrap: 'wrap' }}
            >
            {tagsToChoose.map((item, i) => {
            return <TouchableOpacity
            onPress={() => {
              if (choosedTags.map((item, i) => ( item.id )).includes(item.id)) {
                setChoosedTags(choosedTags.splice(choosedTags.splice(choosedTags.map((item, i) => ( item.id )).indexOf(item.id), 1)))
              }
              else {
                if (choosedTags.length < 8) {
                  setChoosedTags([...choosedTags, ...[item]])
                } else {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  )
                }
              }
            }}
            key={item.id}
            style={[choosedTags.map((item, i) => ( item.id )).includes(item.id) ? {backgroundColor: '#6083FF'} : {backgroundColor: '#081925'}, { borderRadius: 100, paddingVertical: 10, paddingHorizontal: 20,
            marginHorizontal: 5,
            marginVertical: 5 }]}>
              <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'SftMedium' }}>{item.name}</Text>
            </TouchableOpacity>
          })}
          </View>
          </ScrollView>
          </View>
          </ScrollView>
          </KeyboardAvoidingView>
          </View>
        </View>
        {loading && <View
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', width: '100%', height: '100%', position: 'absolute',
      left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
    >
        <ActivityIndicator />  
    </View>} 
      </Modal>

      <Modal
        transparent={true}
        animationType='fade'
        visible={modalWallet}
        statusBarTranslucent={true}
        >
          <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <TouchableOpacity onPress={() => {
            setModalWallet(false)
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
            height: '100%',
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
            height: '100%',
            width: '100%'
        }}
        >
            <View style={{ height: headerHeight, backgroundColor: '#0F1826', 
            alignItems: 'flex-end', paddingBottom: 10, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                      setModalWallet(false)
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'My wallet' : 'Кошелек'}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', alignItems: 'center', paddingHorizontal: 10, marginTop: 10, paddingBottom: 10  }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%', paddingHorizontal: 7 }}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}
      onPress={() => {
        if (boostersTab != 1) {
          setBoostersTab(1)
          setVouchersTab(0)
        }
        }}>
      <Text
        style={[boostersTab == 1 ? { color: '#fff'} : {color: '#818C99'}, {fontSize: 20, padding: 5, fontFamily: 'SftMedium'}]}
      >{language == 'English' ? 'Boosters' : 'Бустеры'}</Text>
      </TouchableOpacity>
      <View
        style={[{ width: '100%', height: 2, borderRadius: 100 }, boostersTab == 1 ? {backgroundColor: '#3F8AE0'} : {backgroundColor: 'transparent'}]}
      ></View>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%', paddingHorizontal: 7 }}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}
      onPress={() => {
        if (boostersTab == 1) {
          setBoostersTab(0)
          setVouchersTab(1)
        }
        }}>
      <Text
        style={[vouchersTab == 1 ? {  color: '#fff' } : {color: '#818C99'}, {fontSize: 20, padding: 5, fontFamily: 'SftMedium'}]}
      >{language == 'English' ? 'Vouchers' : 'Ваучеры'}</Text>
      </TouchableOpacity>
      <View
        style={[{ width: '100%', height: 2, borderRadius: 100 }, vouchersTab == 1 ? {backgroundColor: '#3F8AE0'} : {backgroundColor: 'transparent'}]}
      ></View>
      </View>
      </View>
          {boostersTab === 1 && <View style={{ flex: 1 }}><View style={{ paddingHorizontal: 10, marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30,
                         backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 16, paddingVertical: 20 }}>
          <Image source={require('../images/dollar.png')} style={{ width: 55, aspectRatio: 1/1 }} />
          <View style={{ marginLeft: 15 }}>
            <Text
              style={{ color: '#fff', fontSize: 20, fontFamily: 'SftMedium' }}
            >{language == 'English' ? 'You have' : 'Баланс'}</Text>
            <Text
              style={{ color: '#fff', fontSize: 30, fontFamily: 'SftBold', marginTop: 10 }}
            >
              {userData.profile.my_vallet}
            </Text>
          </View>
            
          </View>
          
          </View>
          <ScrollView
            style={{ paddingHorizontal: 10, flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', 
                flexWrap: 'wrap', paddingTop: 30 }}
          >
            <TouchableOpacity
              style={{ backgroundColor: '#1E2742', width: '48%', borderRadius: 16, alignItems: 'center', marginBottom: 15 }}
              activeOpacity={1}
            >
              <Image
                style={{ width: '85%', height: SCREEN_WIDTH * 0.48 * 0.4, marginVertical: 20 }}
                source={require("../images/ratingUp.png")}
              />
              <Text
                style={{ color: '#fff', fontSize: 20, marginLeft: 5, fontFamily: 'SftBold' }}
              >{language == 'English' ? 'Rating up' : 'Рейтинг'}</Text>
              <Text
                style={{ color: '#818C99', fontSize: 17, marginLeft: 5, fontFamily: 'SftMedium', marginTop: 10 }}
              >+1000 rating</Text>
              <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, width: '90%' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalBuyRating(true)
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', lineHeight: 22, fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Get' : 'Получить'}</Text>
          </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#1E2742', width: '48%', borderRadius: 16, alignItems: 'center', marginBottom: 15 }}
              activeOpacity={1}
            >
              <View
                style={{ backgroundColor: '#fe019a', position: 'absolute', top: -10, left: -10,
                   width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 100,
                   shadowColor: '#fe019a', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.7, shadowRadius: 5 }}
              >
                <Text
                  style={{ color: '#fff', fontFamily: 'SftBold', fontSize: 17 }}
                >{hasBoostsToTop}</Text>
              </View>
              <Image
                style={{ width: '75%', height: SCREEN_WIDTH * 0.48 * 0.4, marginVertical: 20 }}
                source={require("../images/rocket.png")}
              />
              <Text
                style={{ color: '#fff', fontSize: 20, marginLeft: 5, fontFamily: 'SftBold' }}
              >{language == 'English' ? 'Boost to top' : 'Войти в топ'}</Text>
              <Text
                style={{ color: '#818C99', fontSize: 17, marginLeft: 5, fontFamily: 'SftMedium', marginTop: 10 }}
              >{language == 'English' ? 'Fly so high' : 'Взлети на вершину'}</Text>
              <TouchableOpacity
            style={[{ backgroundColor: 'rgba(96, 131, 255, 1)', borderRadius: 12, paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, width: '90%' }, 
            Platform.OS === 'android' && {elevation: 0}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalToTheTop(true)
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', lineHeight: 22, fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Explore' : 'Подробнее'}</Text>
          </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#1E2742', width: '48%', borderRadius: 16, alignItems: 'center', marginBottom: 50 }}
              activeOpacity={1}
            >
              <Image
                style={{ width: '65%', height: SCREEN_WIDTH * 0.48 * 0.4, marginVertical: 20 }}
                source={require("../images/crown.png")}
              />
              <Text
                style={{ color: '#fff', fontSize: 20, marginLeft: 5, fontFamily: 'SftBold' }}
              >{language == 'English' ? 'Premium' : 'Премиум'}</Text>
              <Text
                style={{ color: '#818C99', fontSize: 17, marginLeft: 5, fontFamily: 'SftMedium', marginTop: 10 }}
              >{language == 'English' ? 'Become a king' : 'Стань королем'}</Text>
              <TouchableOpacity
            style={[{ backgroundColor: 'rgba(96, 131, 255, 1)', borderRadius: 12, paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, width: '90%' }, 
            Platform.OS === 'android' && {elevation: 0}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalBuyPremium(true)
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', lineHeight: 22, fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Explore' : 'Подробнее'}</Text>
          </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#1E2742', width: '48%', borderRadius: 16, alignItems: 'center', marginBottom: 50 }}
              activeOpacity={1}
            >
              <Image
                style={{ height: SCREEN_WIDTH * 0.48 * 0.4, width: '55%', marginVertical: 20 }}
                source={require("../images/booster4.png")}
              />
              <Text
                style={{ color: '#fff', fontSize: 20, marginLeft: 5, fontFamily: 'SftBold' }}
              >{language == 'English' ? 'Boost Rating' : 'Буст Рейтинг'}</Text>
              <Text
                style={{ color: '#818C99', fontSize: 17, marginLeft: 5, fontFamily: 'SftMedium', marginTop: 10 }}
              >+10000 rating</Text>
              <TouchableOpacity
            style={[{ backgroundColor: 'rgba(96, 131, 255, 1)', borderRadius: 12, paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, width: '90%' }, 
            Platform.OS === 'android' && {elevation: 0}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalBuyMuchRating(true)
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', lineHeight: 22, fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Explore' : 'Подробнее'}</Text>
          </TouchableOpacity>
            </TouchableOpacity>
            </View>
          </ScrollView>
          </View>}
          {vouchersTab ===1 && <View style={{ flex: 1, paddingTop: 0 }}>
          {!loadingVouchers ? <View
            style={{ flex: 1 }}
          >
            {vouchersData.length == 0 ? <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text
                style={{ color: '#fff', fontSize: 17, fontFamily: 'SftMedium', textAlign: 'center', }}
              >{language == 'English' ? 'You have no vouchers yet' : 'У вас пока что нет ваучеров'}</Text>
            </View> :
            <FlatList 
              data={vouchersData}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 3, paddingBottom: 30 }}
              renderItem = {({item}) => {
                return renderVouchers(item)
              }}
              keyExtractor = {item => `${item.id}`}
            />
            }
          
          </View> :
          <View
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <ActivityIndicator />  
          </View>}
          </View>}
          
          {qrShow && <View
            style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      justifyContent: 'center', alignItems: 'center' }}
          >
            <TouchableOpacity
              style={{ width: '100%', height: '100%', top: 0, left: 0, position: 'absolute' }}
              onPress={() => {
                setQrShow(false)
              }}
            >

            </TouchableOpacity>
            <View
              style={{ width: SCREEN_WIDTH * 0.9, minHeight: SCREEN_WIDTH * 0.9, maxHeight: '80%', borderRadius: 16,
               backgroundColor: '#172136', justifyContent: 'center', alignItems: 'center'
                }}
              // contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
            >
              <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setQrShow(false)
            }}
          />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
               marginVertical: 10, width: '80%', marginTop: 20 }}>
                <Image
                  source={{ uri: `${BASE_URL}` + qrImage.company.compressed_image_url }}
                  style={{ width: 50, aspectRatio: 1/1, borderRadius: 7 }}
                />
                <Text
                  style={{ color: '#fff', fontSize: 20, marginVertical: 10, position: 'absolute',
                   textAlign: 'center', width: '100%', fontFamily: 'SftBold' }}
                >{qrImage.voucher.name}</Text>
              </View>
              <View style={{
               marginVertical: 10, width: '80%' }}>
                <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{ color: '#818C99', fontSize: 17, width: '50%', textAlign: 'left', fontFamily: 'SftMedium'}}
                >{language == 'English' ? 'Company' : 'Компания'}:</Text>
                <Text
                  style={{ color: '#818C99', fontSize: 17, width: '50%', textAlign: 'right', fontFamily: 'SftMedium'}}
                >{qrImage.company.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Text
                  style={{ color: '#818C99', fontSize: 17, width: '50%', textAlign: 'left', fontFamily: 'SftMedium', }}
                >{language == 'English' ? 'Country' : 'Страна'}:</Text>
                <Text
                  style={{ color: '#818C99', fontSize: 17, width: '50%', textAlign: 'right', fontFamily: 'SftMedium', }}
                >Russia</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Text
                  style={{ color: '#818C99', fontSize: 17, width: '50%', textAlign: 'left', fontFamily: 'SftMedium', }}
                >{language == 'English' ? 'Cities' : 'Города'}:</Text>
                <Text
                  style={{ color: '#818C99', fontSize: 17, width: '50%', textAlign: 'right', fontFamily: 'SftMedium', }}
                >Any</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Text
                  style={{ color: '#818C99', fontSize: 17, width: '50%', textAlign: 'left', fontFamily: 'SftMedium', }}
                >{language == 'English' ? 'Date expire' : 'Годен до'}:</Text>
                <Text
                  style={{ color: '#818C99', fontSize: 17, width: '50%', textAlign: 'right', fontFamily: 'SftMedium', }}
                >18.08.2024</Text>
                </View>
              </View>
              <Image
                style={{ width: '80%', aspectRatio: 1/1, backgroundColor: '#fff', marginBottom: 30, marginTop: 20 }}
                source={{ uri: qrImage.image }}
              />
            </View>
          </View>}
          </View>
          </View>
        </View>
        {modalBuyRating && <View
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setModalBuyRating(false)
            setModalBuyRatingGot(0)
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
            backgroundColor: 'white',
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.9,
            justifyContent: 'center',
            overflow:'hidden'
          }}>
          <View
            style={{ flexGrow: 1, justifyContent: 'space-between', backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalBuyRating(false)
              setModalBuyRatingGot(0)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%', marginBottom: 20 }}
            >{language == 'English' ? 'Rating Up' : 'Рейтинг'}</Text>
            <ListItem>
              {language == 'English' ? 'Your rating directly impacts how visible your profile is' :
             'Рейтинг прямо пропорционально влияет на видимость вашего профиля'}
            </ListItem>
            <ListItem>
              {language == 'English' ? 'The higher your rating, the sooner other users will come across your profile' :
             'Чем выше рейтинг - тем раньше ваш профиль будет попадаться другим пользователям'}
            </ListItem>
            <ListItem>
              {language == 'English' ? 'Purchased rating stays with you forever' :
             'Купленный рейтинг останется с тобой навсегда'}
            </ListItem>
            <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '100%', marginTop: 20, marginBottom: 25 }}
            >+1000 Rating</Text>
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              recieveRating()
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{language == 'English' ? 'Buy' : 'Купить'}</Text>
            <Image source={require('../images/dollar.png')} style={{ width: 25, aspectRatio: 1/1 }} />
              <Text
                style={{ marginLeft: 5, fontSize: 20, color: '#fff', fontFamily: 'SftMedium' }}
              >1500 cash</Text>
          </TouchableOpacity>
          </View>
          {modalBuyRatingGot != 0 && <View
            style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: '#172136', top: 0, left: 0 }}
          >
          <View
            style={{ flex: 1, alignItems: 'center', paddingTop: 30 }}
          >
          <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'You got +1000 rating' : 'Вы получили +1000 рейтинга'}</Text>
            <View
              style={{ flexGrow: 1, justifyContent: 'center' }}
            >
            <Image
              source={require("../images/ratingUp.png")}
              style={{ height: SCREEN_WIDTH * 0.9 * 0.4, width: SCREEN_WIDTH * 0.9 * 0.7 }}
            />
            </View>
            </View>
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalBuyRating(false)
              setModalBuyRatingGot(0)
            }}
          />
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', marginBottom: 30,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignSelf: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              // console.log('+1000')
              setModalBuyRating(false)
              setModalBuyRatingGot(0)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{`${language == 'English' ? 'Ok' : 'Ок'}`}</Text>
          </TouchableOpacity>
          </View>} 
          </View>  :
          <View
            style={{ width: '100%', height: '100%', position: 'absolute',
            left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator 
              color={'#fff'}
            />
          </View>}
        </View>
        </View>}

        {modalToTheTop && <View
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setModalToTheTop(false)
            setModalToTheTopGot(0)
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
            backgroundColor: 'white',
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.9,
            justifyContent: 'center',
            overflow:'hidden'
          }}>
          <View
            style={{ flexGrow: 1, justifyContent: 'space-between', backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalToTheTop(false)
              setModalToTheTopGot(0)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%', marginBottom: 20 }}
            >{language == 'English' ? 'Boost to top' : 'Войти в топ'}</Text>
            <ListItem>
              {language == 'English' ? "These boosts will elevate your rating to top levels for a whole day" : 'Эти бустеры на сутки поднимут ваш рейтинг до топовых значений'}
            </ListItem>
            <ListItem>
              {language == 'English' ? "You'll be front and center in Swipes and featured among the top profiles." : 'Вы будете на передовых местах в свайпах и в топ-профилях'}
            </ListItem>
            <View
              style={{ width: '100%', marginTop: 20, marginBottom: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
            >
              <Text
                style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold' }}
              >{language == 'English' ? 'Balance: ' : 'Баланс: '}</Text>
              <Image
                style={{ width: 50, height: 50 }}
                source={require("../images/rocket.png")}
              />
              <Text
                style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold' }}
              >{hasBoostsToTop}</Text>
            </View>
            <TouchableOpacity
            style={[hasBoostsToTop > 0 ? {backgroundColor: 'rgba(96, 131, 255, 1)'} : {backgroundColor: 'rgba(96, 131, 255, 0.5)'}, { width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 0}]}
            activeOpacity={0.8}
            onPress={() => {
              if (hasBoostsToTop > 0) {
                useBoostToTop()
              }
            }}
          >
              <Text
                style={{ marginLeft: 5, fontSize: 20, color: '#fff', fontFamily: 'SftMedium' }}
              >{hasBoostsToTop > 0 ? language == 'English' ? 'Use' : 'Использовать' :
                language == 'English' ? 'Coming soon' : 'Скоро'}</Text>
          </TouchableOpacity>
          </View>
          {modalToTheTopGot != 0 && <View
            style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: '#172136', top: 0, left: 0 }}
          >
          <View
            style={{ flex: 1, alignItems: 'center', paddingTop: 30 }}
          >
          <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? "You're now at the top!" : 'Ты поднялся в топ!'}</Text>
            <View
              style={{ flexGrow: 1, justifyContent: 'center' }}
            >
            <Image
              source={require("../images/rocket.png")}
              style={{ height: SCREEN_WIDTH * 0.9 * 0.4, width:  SCREEN_WIDTH * 0.9 * 0.6 }}
            />
            </View>
            </View>
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalToTheTop(false)
              setModalToTheTopGot(0)
            }}
          />
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', marginBottom: 30,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignSelf: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalToTheTop(false)
              setModalToTheTopGot(0)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{`${language == 'English' ? 'Ok' : 'Ок'}`}</Text>
          </TouchableOpacity>
          </View>} 
          </View>  :
          <View
            style={{ width: '100%', height: '100%', position: 'absolute',
            left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator 
              color={'#fff'}
            />
          </View>}
        </View>
        </View>}

        {modalBuyPremium && <View
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setModalBuyPremium(false)
            setmodalBuyPremiumGot(0)
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
            backgroundColor: 'white',
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.9,
            justifyContent: 'center',
            overflow:'hidden'
          }}>
          <View
            style={{ flexGrow: 1, justifyContent: 'space-between', backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalBuyPremium(false)
              setmodalBuyPremiumGot(0)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%', marginBottom: 20 }}
            >{language == 'English' ? 'Premium' : 'Премиум'}</Text>
            <ListItem>
              {language == 'English' ? "4 'Boost to top' boosts included in the bundle" : '4 бустера "Войти в топ" в комплекте'}
            </ListItem>
            <ListItem>
              {language == 'English' ? 'See all likes and message anyone without using in-game currency' : 'Просматривай все лайки и пиши любому пользователю без использования внутриигровой валюты'}
            </ListItem>
            <ListItem>
              {language == 'English' ? 'Your profile will get more visibility even without boosters' : 'Твой профиль будут видеть чаще даже без бустеров'}
            </ListItem>
            <View
              style={{ width: '100%', marginTop: 20, marginBottom: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
            >
              <Text
                style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold' }}
              >{language== 'English' ? '30 days premium' : '1 месяц премиума: '}</Text>
            </View>
            <TouchableOpacity
            style={[{ backgroundColor: 'rgba(96, 131, 255, 0.5)', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 0}]}
            activeOpacity={0.8}
            onPress={() => {
              // recieveRating()
            }}
          >
              <Text
                style={{ marginLeft: 5, fontSize: 20, color: '#fff', fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'Coming soon' : 'Скоро'}</Text>
          </TouchableOpacity>
          </View>
          {modalBuyPremiumGot != 0 && <View
            style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: '#172136', top: 0, left: 0 }}
          >
          <View
            style={{ flex: 1, alignItems: 'center',
              justifyContent: 'center', paddingTop: 30 }}
          >
          <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'You got premium!' : 'Вы получили премиум!'}</Text>
            <Image
              source={require("../images/crown.png")}
              style={{ height: SCREEN_WIDTH * 0.9 * 0.5, width: '80%'}}
            />
            </View>
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalBuyPremium(false)
              setmodalBuyPremiumGot(0)
            }}
          />
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', marginBottom: 30,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignSelf: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalBuyPremium(false)
              setmodalBuyPremiumGot(0)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{`${language == 'English' ? 'Ok' : 'Ок'}`}</Text>
          </TouchableOpacity>
          </View>} 
          </View>  :
          <View
            style={{ width: '100%', height: '100%', position: 'absolute',
            left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator 
              color={'#fff'}
            />
          </View>}
        </View>
        </View>}

        {modalBuyMuchRating && <View
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setModalBuyMuchRating(false)
            setModalBuyMuchRatingGot(0)
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
            backgroundColor: 'white',
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.9,
            justifyContent: 'center',
            overflow:'hidden'
          }}>
          <View
            style={{ flexGrow: 1, justifyContent: 'space-between', backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalBuyMuchRating(false)
              setModalBuyMuchRatingGot(0)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%', marginBottom: 20 }}
            >{language == 'English' ? 'Boost Rating' : 'Буст Рейтинг'}</Text>
            <ListItem>
              {language == 'English' ? 'Your rating directly impacts how visible your profile is' :
             'Рейтинг прямо пропорционально влияет на видимость вашего профиля'}
            </ListItem>
            <ListItem>
              {language == 'English' ? 'The higher your rating, the sooner other users will come across your profile' :
             'Чем выше рейтинг - тем раньше ваш профиль будет попадаться другим пользователям'}
            </ListItem>
            <ListItem>
              {language == 'English' ? 'Purchased rating stays with you forever' :
             'Купленный рейтинг останется с тобой навсегда'}
            </ListItem>
            <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '100%', marginTop: 20, marginBottom: 25 }}
            >+10000 Rating</Text>
            <TouchableOpacity
            style={[{ backgroundColor: 'rgba(96, 131, 255, 0.5)', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 0}]}
            activeOpacity={0.8}
            onPress={() => {
              // recieveRating()
            }}
          >
              <Text
                style={{ marginLeft: 5, fontSize: 20, color: '#fff', fontFamily: 'SftMedium' }}
              >{language == 'English' ? 'Coming soon' : 'Скоро'}</Text>
          </TouchableOpacity>
          </View>
          {modalBuyMuchRatingGot != 0 && <View
            style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: '#172136', top: 0, left: 0 }}
          >
          <View
            style={{ flex: 1, alignItems: 'center',
              justifyContent: 'center', paddingTop: 30 }}
          >
          <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'You got +10000 rating' : 'Вы получили +10000 рейтинга'}</Text>
            <Image
              source={require("../images/booster4.png")}
              style={{ height: SCREEN_WIDTH * 0.9 * 0.5, width: '80%'}}
            />
            </View>
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalBuyMuchRating(false)
              setModalBuyMuchRatingGot(0)
            }}
          />
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', marginBottom: 30,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignSelf: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalBuyMuchRating(false)
              setModalBuyMuchRatingGot(0)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{`${language == 'English' ? 'Ok' : 'Ок'}`}</Text>
          </TouchableOpacity>
          </View>} 
          </View>  :
          <View
            style={{ width: '100%', height: '100%', position: 'absolute',
            left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator 
              color={'#fff'}
            />
          </View>}
        </View>
        </View>}
        {modalErr && <View style={{ width: '100%', height: '100%', position: 'absolute' }}>
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
                style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', marginTop: 30 }}
              >{errType == 1 ? language == 'English' ? 'Not enough cash!' : 'Недостаточно средств' :
                errType == 2 && language == 'English' ? 'Error' : 'Ошибка'}</Text>
            <View style={{
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20,
              flexWrap: 'wrap', paddingHorizontal: 5
            }}>
              <Text
                style={{ textAlign: 'center', fontSize: 17, color: '#818C99', fontFamily: 'SftMedium' }}
              >{errText}</Text>
              {errType == 1 && <Image source={require('../images/dollar.png')} style={{ width: 20, aspectRatio: 1/1, marginLeft: 5 }} />}
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
        </View>}
      </Modal>
      <Modal
        transparent={true}
        animationType='fade'
        visible={modalSettings}
        statusBarTranslucent={true}
        >
          <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <TouchableOpacity onPress={() => {
            setModalSettings(false)
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
          {languagePickerDisplay &&
            <View style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
            <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
            top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
            activeOpacity={0.5}
            onPress={() => {setLanguagePickerDisplay(false)}}
            >
            </TouchableOpacity>
            <Picker
              style={{ width: '80%', backgroundColor: '#172136', zIndex: 10000, borderRadius: 15 }}
              selectedValue={language}
              onValueChange={(itemValue, itemIndex) => setLanguage(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='English'
                value={'English'}
                color='#fff'
              />
              <Picker.Item
                label='Russian'
                value={'Russian'}
                color='#fff'
              />
            </Picker>
            </View>
            }
          <View
          contentContainerStyle={{
            height: '100%',
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
          <KeyboardAvoidingView style={{
            height: '100%',
            width: '100%'
        }}
        // contentContainerStyle={{paddingBottom: 20}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -SCREEN_HEIGHT}
        >
            <View style={{ height: headerHeight, backgroundColor: '#0F1826',
            alignItems: 'flex-end', paddingBottom: 10, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                      setModalSettings(false)
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Settings' : 'Настройки'}</Text>
                </View>
                <TouchableOpacity
                onPress={() => {
                  changeName()
                  setModalSettings(false)
                  writeLanguageData(language)
                }}
                style={{ width: '20%' }}
                activeOpacity={1}
            >
                <Text style={{ fontSize: 20, fontWeight: '300', color: '#6083FF', textAlign: 'center', fontFamily: 'SftLight'}}>Save</Text>
            </TouchableOpacity>
            </View>
          <ScrollView
            bounces={true}
            style={{flex: 1}}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
          <View style={{ margin: 10}}>
          <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', fontWeight: '300', marginTop: 20, overflow: 'hidden', fontFamily: 'SftLight' }}>{language == 'English' ? 'Your name' : 'Ваше имя'}: </Text>  
            <TextInput
              placeholder={language == 'English' ? 'Enter your name' : 'Введите имя'}
              placeholderTextColor={'#818C99'}
              contentStyle={{ fontFamily: 'SftLight' }}
              style={{ padding: 2, marginVertical: 5, fontSize: 17 }}
              mode='outlined'
              value={name}
              maxLength={75}
              multiline={false}
              textColor='#fff'
              selectionColor='#818C99'
              outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
              onChangeText = {(newName) => {
              setName(newName)
            }}
            />
          </View>
          <View style={{ margin: 10}}>
            <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', fontWeight: '300', marginBottom: 5, fontFamily: 'SftLight'}}>{language == 'English' ? 'Language' : 'Язык'}:</Text>
            {Platform.OS === 'ios' ? <TouchableOpacity
              style={{ padding: 17, marginVertical: 5, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                setLanguagePickerDisplay(true)
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: '300', fontFamily: 'SftLight', color: '#fff' }}>{language}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity> : 
            <View style={{ borderRadius: 13, overflow: 'hidden' }}>
              <Picker
              style={{  width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 10000, borderRadius: 13 }}
              dropdownIconColor={'#fff'}
              dropdownIconRippleColor={'#000'}
              selectedValue={language}
              onValueChange={(itemValue, itemIndex) => setLanguage(itemValue)}
              mode='dropdown'
            >
              <Picker.Item
                label='English'
                value={'English'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
              <Picker.Item
                label='Russian'
                value={'Russian'}
                color='#fff'
                style={{ backgroundColor: '#071620' }}
              />
            </Picker>
            </View>
            }
          </View>
          <View style={{ marginTop: 10, marginHorizontal: 10, flexDirection: 'row'}}>
            <Text style={{ fontSize: 18, textAlign: 'left', color: '#6D7885', fontWeight: '300',  fontFamily: 'SftLight'}}>Username: </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                // Ваше действие при нажатии
              }}
            >
              <Text
                selectable={true}
                style={{ color: '#6083FF', fontSize: 18, textAlign: 'left', fontFamily: 'SftLight'}}
              >{userData.username}</Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity style={{ marginTop: 50 }}
            activeOpacity={0.8}
          >
            <Text style={{ textAlign: 'center', color: '#6083FF', fontSize: 16, fontWeight: '300', fontFamily: 'SftMedium' }}>{language == 'English' ? 'Privacy Policy' : 'Политика конфиденциальности'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 30 }}
            activeOpacity={0.8}
          >
            <Text style={{ textAlign: 'center', color: '#6083FF', fontSize: 16, fontWeight: '300', fontFamily: 'SftMedium' }}>{language == 'English' ? 'Terms of Use' : 'Правила использования'}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={{ marginTop: 50 }}
            activeOpacity={0.8}
            onPress={() => {
              Image.clearDiskCache()
              alert(language == 'English' ? 'Cache cleared!' : 'Кэш сброшен!')
            }}
          >
            <Text style={{ textAlign: 'center', color: '#6083FF', fontSize: 16, fontWeight: '300', fontFamily: 'SftMedium' }}>{language == 'English' ? 'Clear cache' : 'Сбросить кэш'}</Text>
          </TouchableOpacity>
          <View
            style={{ flexDirection: 'row', marginTop: 50, alignItems: 'center', justifyContent: 'center' }}
          >
            <TouchableOpacity
              onPress={async () => {
                await openBrowserAsync('https://vk.com/vertep_dating')
              }}
            >
            
            <Image
              source={vkIcon}
              style={{ width: 50, height: 50, borderRadius: 100, marginRight: 7 }}
            />
            </TouchableOpacity>
            {/* <TouchableOpacity>
            <Image
              source={fbIcon}
              style={{ width: 50, height: 50, borderRadius: 100, marginHorizontal: 15 }}
            />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={async () => {
                await openBrowserAsync('https://t.me/Vertep_Dating')
              }}
            >
            <Image
              source={telegramIcon}
              style={{ width: 50, height: 50, borderRadius: 100, marginLeft: 7 }}
            />
            </TouchableOpacity>
          </View>
          </ScrollView>
          </KeyboardAvoidingView>
          </View>
        </View>
        {loading && <View
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', width: '100%', height: '100%', position: 'absolute',
      left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
    >
        <ActivityIndicator />  
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
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftMedium', width: '80%' }}
            >{language == 'English' ? 'Are you shure you want to delete your account?' : 'Вы уверены, что хотите удалить аккаунт?'}</Text>
            <Image
              source={require('../images/deletedUser.png')}
              style={{ width: SCREEN_WIDTH * 0.9 * 0.4, height: SCREEN_WIDTH * 0.9 * 0.4, margin: 15 }}
            />
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalDeletedAccount(false)
              deleteAccount()
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Delete an account' : 'Удалить аккаунт'}</Text>
          </TouchableOpacity>
          </View>
          </View>
        </View>
    </View>}
      </Modal>
    </ScrollView>
    {loading && <View
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', width: '100%', height: '100%', position: 'absolute',
      left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
    >
              <ActivityIndicator />  
    </View>} 
    <Modal
        transparent={true}
        animationType='fade'
        visible={modalBlockedAccount}
        statusBarTranslucent={true}
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
              
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftMedium', width: '80%' }}
            >Your account was blocked</Text>
            <Image
              source={require('../images/blocked.png')}
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
    </Modal>

    <Modal
        transparent={true}
        animationType='fade'
        visible={hasPhotos}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
              setHasPhotos(false)
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
              setHasPhotos(false)
            }}
          />
          <Text
              style={{ textAlign: 'center', fontSize: 30, color: 'tomato', fontFamily: 'SftMedium', width: '80%', lineHeight: 30 }}
            >Внимание!</Text>
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftMedium', width: '80%', marginTop: 10 }}
            >У вас нет фотографий</Text>
            <Text
              style={{ textAlign: 'center', fontSize: 15, color: '#B6BDC2', fontFamily: 'SftMedium', width: '80%', marginTop: 10 }}
            >Без фотографий ваш профиль не будет показываться другим пользователям. Рекомендуется добавить хотя бы пару фотографий</Text>
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, marginTop: 20, marginBottom: 5,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setHasPhotos(false)
            }}
            >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>Ok</Text>
          </TouchableOpacity>
          </View>
          </View>
        </View>
    </Modal>

    <Modal
        transparent={true}
        animationType='fade'
        visible={modalVerification}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setModalVerification(false)
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
              setModalVerification(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'Your account was verified' : 'Вы прошли верификацию'}</Text>
            <View
              style={{ width: SCREEN_WIDTH * 0.8 / 1.5, height: SCREEN_WIDTH * 0.8 / 1.5, marginVertical: 20 }}
            >
              <Image
                source={require('../images/profileVerified.jpg')}
                style={{ width: '100%', height: '100%', borderRadius: 20 }}
              />
              <CheckMarkShadows width={55} height={55} style={{ position: 'absolute', zIndex: 1, right: -20, bottom: -20 }} />
            </View>
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, marginTop: 10,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalVerification(false)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>ОК</Text>
          </TouchableOpacity>
          </View>
          </View>
        </View>
    </Modal>

    <Modal
        transparent={true}
        animationType='fade'
        visible={modalVerificationStart}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            modalVerificationStart(false)
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
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            overflow:'hidden'
          }}>
            <View style={{ height: headerHeight, backgroundColor: '#0F1826',
            alignItems: 'flex-end', paddingBottom: 10, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                      setModalVerificationStart(false)
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Verification' : 'Верификация'}</Text>
                </View>
            </View>
          <ScrollView
            style={{flexGrow: 1, backgroundColor: "#172136", paddingHorizontal: 10 }}
            contentContainerStyle={{ paddingVertical: 30, alignItems: 'center' }}
          >
            <View
              style={{ width: SCREEN_WIDTH * 0.8 / 1.5, height: SCREEN_WIDTH * 0.8 / 1.5, marginTop: 10  }}
            >
              <Image
                source={require('../images/profileVerified.jpg')}
                style={{ width: '100%', height: '100%', borderRadius: 20 }}
              />
              <CheckMarkShadows width={55} height={55} style={{ position: 'absolute', zIndex: 1, right: -20, bottom: -20 }} />
            </View>
            <Text
              style={{ color: '#fff', fontFamily: 'SftBold', fontSize: 25, textAlign: 'center', marginTop: 30 }}
            >{language == 'English' ? 'Verify your account' : 'Верифицируйте свой аккаунт'}</Text>
            <Text
              style={{ color: '#fff', fontFamily: 'SftMedium', fontSize: 17, marginTop: 10, width: '100%' }}
            >{language == 'English' ? 'Get verified so other users can be confident that you are who you say you are. Verified users are more trusted and receive better engagement.' :
             'Пройдите верификацию, чтобы пользователи были уверены что вы - это вы. Верифицированным пользователям доверяют больше и лучше идут на контакт.'}</Text>
            <Text
              style={{ color: '#fff', fontFamily: 'SftBold', fontSize: 25, textAlign: 'center', marginTop: 20 }}
            >{language == 'English' ? 'Message us' : 'Напишите нам'}</Text>
            <Text
              style={{ color: '#fff', fontFamily: 'SftMedium', fontSize: 17, marginTop: 10, width: '100%' }}
            >{language == 'English' ? 'Because some dishonest users have learned to bypass standard verification methods, we no longer use photo verification.' :
             'В связи с тем что недобросовестные пользователи научились обходить стандартные способы верификации, мы не используем верификацию по фотографии.'}</Text>
            <Text
              style={{ color: '#fff', fontFamily: 'SftMedium', fontSize: 17, marginVertical: 10, width: '100%' }}
            >{language == 'English' ? 'To verify your account, please follow these steps:' :
             'Чтобы верифицировать свой аккаунт нужно выполнить следующие действия:'}</Text>
            <ListItem size={15} >
              {language == 'English' ? 'Copy your username (you can find it by tapping the "Settings" icon)' :
               'Скопируйте свой username (его можно посмотреть нажав на значок "Настройки")'}
            </ListItem>
            <ListItem size={15} >
              {language == 'English' ? 'Send "Verification your username" in a direct message to us on ' : 'Отправьте "Верификация *ваш username*" к нам в личное сообщение в '}<Text
                onPress={async () => {
                  await openBrowserAsync('https://vk.com/id24798718')
                }}
                style={{ fontSize: 17, fontFamily: 'SftBold', color: '#6083FF' }}
              >VK</Text> {language == 'English' ? 'or' : 'или'} <Text
                onPress={async () => {
                  await openBrowserAsync('https://www.instagram.com/antonma01/')
                }}
                style={{ fontSize: 17, fontFamily: 'SftBold', color: '#6083FF' }}
            >Instagram</Text> {language == 'English' ? 'from your profile' : '(Запрещен на территории РФ) со своего профиля'}
            </ListItem>
            <ListItem size={15} >
              {language == 'English' ? 'Your profile must be public at the time of verification, contain your photos, and should not be empty or recently created.' :
               'Профиль должен быть открыт на момент проверки, иметь ваши фотографии, не быть пустым или "недавно созданным"'}
            </ListItem>
            <Text
              style={{ color: '#fff', fontFamily: 'SftBold', fontSize: 25, textAlign: 'center', marginTop: 15 }}
            >{language == 'English' ? 'Verification' : 'Проверка'}</Text>
            <Text
              style={{ color: '#fff', fontFamily: 'SftMedium', fontSize: 17, marginVertical: 10, width: '100%' }}
            >{language == 'English' ? 'Since verification is done manually, it may take some time. Once the process is complete, you will receive a verification badge.' :
             'Так как проверка производится вручную, она может потребовать какое то время. После того, как проверка будет пройдена, вы получите значок верификации.'}</Text>
          </ScrollView>
          </View>
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
            >{language == 'English' ? `${boosters[boosterIndex].descEng}` :
             `${boosters[boosterIndex].desc}`}</Text>
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

    </View>
      )
}

const styles = StyleSheet.create({
  cardStyle: {
      // alignItems: 'center',
      // justifyContent: 'center',
      padding: 5,
      width: '100%'
  },
  cityCardStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
    zIndex: 1000
  },
})

export default MyProfile