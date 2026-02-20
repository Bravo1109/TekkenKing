import React, {useState, useEffect, useCallback, useContext} from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground,
  Platform, RefreshControl, Dimensions, Modal, Keyboard, ScrollView,
  } from 'react-native'
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {TextInput} from 'react-native-paper';
import { useIsFocused } from "@react-navigation/native";
import Male from '../images/male.png'
import Female from '../images/female.png'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment, { lang } from 'moment';
import * as Font from 'expo-font';
import { useHeaderHeight } from '@react-navigation/elements';
import { BASE_URL } from './config';
import { format } from 'date-fns';
import LottieView from 'lottie-react-native';
import { Shadow } from 'react-native-shadow-2';
import Location from '../images/location.svg'
import Crowd from '../images/crowd.svg'
import Money from '../images/money.svg'
import Plus from '../images/plus.svg'
import CloudIcon from '../images/cloud.svg'
import ArrowLeft from '../images/turnBack.svg'
import ArrowDown from '../images/arrowDownSign.svg'
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { UnreadContext } from './UnreadContext';
import { LinearGradient } from 'expo-linear-gradient';



function Parties(props) {
  const headerHeight = useHeaderHeight();
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
  let [fData, setFData] = useState()
  const { hasPartyRequests, hasAcceptedPartyRequests } = useContext(UnreadContext);
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
  const bluredBg = require('../images/bluredRating.png');
  const nowDate = new Date();
  const [modalParty, setModalParty] = useState(false)
  const [newPartyTitle, setNewPartyTitle] = useState('')
  const [newPartyDescription, setNewPartyDescription] = useState('')
  const [newPartyLocation, setNewPartyLoaction] = useState('')
  const [newPartyCnt, setNewPartyCnt] = useState(1)
  const [newPartyMoney, setNewPartyMoney] = useState(0)
  const [newPartyTheme, setNewPartyTheme] = useState('American style')
  const [newPartyDrinks, setNewPartyDrinks] = useState('non-alcohol')
  const [newPartyFood, setNewPartyFood] = useState('not provided')
  const [newPartyMusic, setNewPartyMusic] = useState('not provided')
  const [newPartyTakeWith, setNewPartyTakeWith] = useState('')
  const [newPartyDresscode, setNewPartyDresscode] = useState('')
  const [newPartyModalStart, setNewPartyModalStart] = useState(false)
  const [newPartyModalStartAndroid, setNewPartyModalStartAndroid] = useState(false)
  const [newPartyModalEnd, setNewPartyModalEnd] = useState(false)
  const [newPartyModalEndAndroid, setNewPartyModalEndAndroid] = useState(false)
  const [newPartyCreationLoading, setNewPartyCreationLoading] = useState(false)
  const [cityId, setCityId] = useState()
  const [city, setCity] = useState('')
  const [cityData, setCityData] = useState()
  const [showCities, setShowCities] = useState(false)
  const [labelDateStart, setLabelDateStart] = useState('Choose date')
  const [dateStart, setDateStart] = useState(nowDate)
  const [labelDateEnd, setLabelDateEnd] = useState('Choose date')
  const [dateEnd, setDateEnd] = useState(nowDate)
  const [newPartyThemePickerDisplay, setNewPartyThemePickerDisplay] = useState(false)
  const [newPartyDrinksPickerDisplay, setNewPartyDrinksPickerDisplay] = useState(false)
  const [newPartyFoodPickerDisplay, setNewPartyFoodPickerDisplay] = useState(false)
  const [newPartyMusicPickerDisplay, setNewPartyMusicPickerDisplay] = useState(false)
  const [language, setLanguage] = useState('');
  const [sortAll, setSortAll] = useState(1);
  const [sortMy, setSortMy] = useState(0);
  const [loadImage, setLoadImage] = useState(true);
  const [nextPageIsNull, setNextPageIsNull] = useState(false);
  const [name, setName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const isFocused = useIsFocused();
  const token = getTokenData()
  const [location, setLocation] = useState('City')
  const [sortCity, setSortCity] = useState(1)
  const [sortCountry, setSortCountry] = useState(0)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingChangeType, setLoadingChangeType] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [loadingNews, setLoadingNews] = useState(true)
  const [showStart, setShowStart] = useState(false)

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateStart
    setShowStart(Platform.OS === 'ios')
    setDateStart(currentDate)
    let tempDate = new Date(currentDate)
    let fDate = tempDate.getDate() + '.' + (tempDate.getMonth() + 1) + '.' + tempDate.getFullYear() + '  ' + tempDate.getHours() + ':' + (tempDate.getMinutes() < 10 ? '0' + tempDate.getMinutes() : tempDate.getMinutes())
    setLabelDateStart(fDate)
  }

  const handleConfirm = (date) => {
    setDateStart(date);
    let tempDate = new Date(date)
    let fDate = tempDate.getDate() + '.' + (tempDate.getMonth() + 1) + '.' + tempDate.getFullYear() + '  ' + tempDate.getHours() + ':' + (tempDate.getMinutes() < 10 ? '0' + tempDate.getMinutes() : tempDate.getMinutes())
    setLabelDateStart(fDate)
    setNewPartyModalStartAndroid(false)
  };

  const handleEndConfirm = (date) => {
    setDateEnd(date);
    let tempDate = new Date(date)
    let fDate = tempDate.getDate() + '.' + (tempDate.getMonth() + 1) + '.' + tempDate.getFullYear() + '  ' + tempDate.getHours() + ':' + (tempDate.getMinutes() < 10 ? '0' + tempDate.getMinutes() : tempDate.getMinutes())
    setLabelDateEnd(fDate)
    setNewPartyModalEndAndroid(false)
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || dateEnd
    setShowStart(Platform.OS === 'ios')
    setDateEnd(currentDate)
    let tempDate = new Date(currentDate)
    let fDate = tempDate.getDate() + '.' + (tempDate.getMonth() + 1) + '.' + tempDate.getFullYear() + '  ' + tempDate.getHours() + ':' + (tempDate.getMinutes() < 10 ? '0' + tempDate.getMinutes() : tempDate.getMinutes())
    setLabelDateEnd(fDate)
  }

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
  
        // Процедура сжатия
        // let compression = 1; 
        // do {
        //   const compressedResult = await ImageManipulator.manipulateAsync(
        //     newImageUri,
        //     [],
        //     {
        //       format: ImageManipulator.SaveFormat.JPEG,
        //       compress: compression
        //     }
        //   );
        //   newImageUri = compressedResult.uri;
        //   fileInfo = await FileSystem.getInfoAsync(newImageUri, { size: true });
        //   compression -= 0.1;
        // } while (fileInfo.size > 400 * 1024 && compression > 0.1);
  
        let formData = new FormData();
        formData.append('image', {
          uri: newImageUri,
          name: 'image.jpeg',
          type: 'image/jpeg'
        });
  
        setFData(formData);
      }
    }
  }

  const createParty = () => {
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
    fetch(`${BASE_URL}/api/parties/`, {
      method:"POST",
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
      if (status == 201) {
        setNewPartyCreationLoading(false)
        setModalParty(false)
        loadData()
      } else if (status == 403) {
        setNewPartyCreationLoading(false)
        alert('Вы уже являетесь организатором 2-х активных вечеринок!')
      } else {
        setNewPartyCreationLoading(false)
        alert('Что-то пошло не так')
      } 
    })
    .catch(error => {
      console.log("Error", error)
    })
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

  const loadData = () => {
    // if(!nextPageIsNull || currentPage === 1) {
    setLoading(true)
    fetch(`${BASE_URL}/api/parties/?limit=14&page=${currentPage}&in_party=${sortMy}`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      if (res.next == null) {
        setNextPageIsNull(true)
      }
      else if (res.next != null) {
        setNextPageIsNull(false)
      }
      const uniqueData = [...data, ...res.results].filter((item, index, array) => {
        return array.findIndex(t => t.id === item.id) === index;
      });
      if (currentPage != 1) {
        setData(uniqueData)
      }
      else if (currentPage == 1) {
        setData(res.results)
      } 
      setLoading(false)
      setLoadingChangeType(false)
      setLoadingNews(false)
      console.log(data)
    })
    .catch(error => {
      console.log("Error", error)
    })
  // }
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
      if (isFocused && !dataLoaded) {
        loadData()
        setDataLoaded(true)
        props.navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
            style={{ height: 40, aspectRatio: 1/1, borderRadius: 100,
                     marginRight: 10, borderColor: '#90A9FF', borderWidth: 2,
                     alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F1826',
                     shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0},
                     shadowOpacity: 0.7, shadowRadius: 5, elevation: 15 }}
            onPress={() => {
              setModalParty(true)
            }}
            >
            <Plus height={17} width={17} color={'#90A9FF'} />
            </TouchableOpacity>
            )
        })
      }
    })
    console.log(isFocused)
  }, [isFocused])

  useEffect(() => {
    getTokenData()
    .then(() => {
      if(dataLoaded) {
        if (currentPage != 1) {
          setCurrentPage(1)
        }
        else {
          loadData()
        }
      }  
    })
  }, [name])

  useEffect(() => {
    getTokenData()
      .then(() => {
        if (isFocused && dataLoaded) {
          currentPage == 1 ? loadData() : setCurrentPage(1)
        }
      })
  }, [sortMy])

  useEffect(() => {
    getTokenData()
      .then(() => {
        if (isFocused && dataLoaded) {
          loadData()
        }
      })
  }, [currentPage])

  useEffect(() => {
    props.navigation.setOptions({ title: language == 'English' ? 'Parties' : 'Вечеринки',
         headerTitleStyle: {fontFamily: 'SftBold', fontSize: 20, }, headerStyle: {backgroundColor: "#fff"} })
  }, [language])

  const clickedItem = (item) => {
    props.navigation.navigate("PartyOpenedStack", {data: item})
  }

  const LoadMoreItem = () => {
    if (data.length > 6 && !nextPageIsNull) {
      setCurrentPage(currentPage + 1);
    }
    
  }
  const renderLoader = () => {
    return (
        <View style={[loadingCircleStyle(loading), loading ? {opacity: 1}: {opacity: 0}]}>
            <ActivityIndicator size='small' color='#aaa' />
        </View>
    )
  }
  const loadingCircleStyle = () => {
    return {
        top: 10,
        width: '100%',
        alignItems:'center',
        justifyContent:'center'
    }
  }
  const renderData = useCallback(({item, index}) => {
    return(
      <View style={{width: '50%', padding: 10}}>
        
        {Platform.OS === 'android' && <Shadow
                distance={12}
                offset={[0, -3]}
                startColor={'#ff073a'}
                containerStyle={{ opacity: 0.5 }}
                style={{ width: SCREEN_WIDTH / 2 - 20, height: SCREEN_WIDTH / 2 - 20 + 144, borderRadius: 36, position: 'absolute' }}
              />}
    <TouchableOpacity style={[styles.cardStyle, {
        shadowColor: '#ff073a', shadowOffset: {width: 0, height: -7}, shadowOpacity: 0.9, shadowRadius: 10
    }]} activeOpacity = {1} onPress = {() => clickedItem(item)}>
      

          { hasPartyRequests.includes(item.id) && <View
              style={{ borderRadius: 100, position: 'absolute', width: 35, height: 35,
               zIndex: 1000, overflow: 'hidden', top: -4, right: -4, justifyContent: 'center', alignItems: 'center' }}
            >
              <View
                style={{  height: '30%', aspectRatio: 1/1, backgroundColor: 'yellow', borderRadius: 100, zIndex: 1000 }}
              />
              <View
                style={{  height: '100%', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.11)',
                 borderRadius: 100, zIndex: 100, position: 'absolute' }}
              />
              <ImageBackground
              style={[{ height: '100%',
                zIndex: 10, alignSelf: 'flex-end', borderRadius: 100, justifyContent: 'center', position: 'absolute',
                alignItems: 'center', top: 0, right: 0 }, item.id == 3 ? {width: SCREEN_WIDTH, height: SCREEN_WIDTH / 2 - 10,  } : {width: SCREEN_WIDTH / 2 - 10, height: SCREEN_WIDTH / 2 - 10}]}
                blurRadius={10}
                source={{
                  uri: `${BASE_URL}${item.compressed_image_url}`
                 }}
            >
              
            </ImageBackground>
            </View>}
            
      <View
        style={{
             width: '100%', backgroundColor: '#ff073a', paddingTop: 3, overflow: 'hidden',
             borderRadius: 36, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, 
        }}
      >
        
      <View style={{flexDirection:"column", alignItems: 'flex-start',
         width: '100%', backgroundColor: '#2E374A',
         borderRadius:35, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: 'hidden'}}>
          {hasAcceptedPartyRequests.includes(item.id) && <View
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, width: '100%', alignItems: 'flex-end' }}
            >
              <LinearGradient
              colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)']}
              start={{
                x:0,
                y:1
              }}
              end={{
                x:0,
                y:0
              }}
              style={{ width: '100%', height: '100%', position: 'absolute' }}
            />
            <Text style={{  fontSize: 17, padding: 15, marginBottom: 30, marginTop: 5,
              fontWeight: '600', fontFamily: 'SftBold', color: '#fefe22', transform: [{rotate: '40deg'}] }}>New</Text>
            </View>}
      <ImageBackground
        // source={item.sex == 'male' ? {uri: male} : {uri: female}}
        resizeMode='contain'
        style={{width: '100%', aspectRatio: 1/1, overflow: 'hidden', backgroundColor: '#0F1825',
        }}
        >
            <ActivityIndicator 
                style={{position: 'absolute', left:0, top:0, right:0, bottom:0}}
                animating={loadImage}
            />
            
          <Image
            style={{width:'100%', height:'100%', opacity: 1}}
            cachePolicy={'disk'}
            source={{
             uri: `${BASE_URL}${item.compressed_image_url}`
            }}
            onLoadEnd={() => setLoadImage(false)}
           />
           <View
            style={{ position: 'absolute', bottom: 10, left: 10, borderRadius: 100, overflow: 'hidden' }}
           >
            <BlurView
                intensity={25}
                tint='extraLight'
            >
            {Platform.OS === 'android' && <Image
              style={{ width: SCREEN_WIDTH * 0.5 - 20, height: SCREEN_WIDTH * 0.5 - 20, position: 'absolute', bottom: -10, left: -10 }}
              cachePolicy={'disk'}
              source={{
                uri: `${BASE_URL}${item.compressed_image_url}`
               }}
              blurRadius={20}
            />}
            {Platform.OS === 'android' && <View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            />}
              <View style={{  flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 12, alignItems: 'center' }}>
                {/* <CircleStar width={15} height={15} fill='#fff' /> */}
                <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'SftMedium', lineHeight: 17 }}>{item.theme}</Text>
              </View>
            </BlurView>
            </View>

      </ImageBackground>
      
        <View style={{ paddingVertical: 20, paddingHorizontal: 12 }}>
              <Text
                style={{ color: '#fff', fontSize: 17,  fontFamily: 'SftBold',
                   height: 25
                 }}
                ellipsizeMode='tail'
                numberOfLines={1}
              >{item.title}</Text>
              <Text
               style={{ color: '#fff', fontSize: 14, marginTop: 5,
                 fontFamily: 'SftMedium', height: 40 }}
               ellipsizeMode='tail'
               numberOfLines={2}
              >{item.description}</Text>
            <View
                style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}
            >
                <View
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Crowd height={15.5} width={21} color={'#fff'} marginTop={0}/>
                  <Text
                    style={{ color: '#fff', fontSize: 13, marginLeft: 5,
                        fontFamily: 'SftLight', lineHeight: 15 }}
                  >{item.participants_cnt}/{item.max_participants_cnt}</Text>
                </View>
                <View
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Money height={13} width={21} color={'#fff'} marginTop={0} marginRight={5} />
                <Text
                  style={{ color: '#fff', fontSize: 13, 
                        fontFamily: 'SftLight', lineHeight: 15 }}
                >{item.payment > 0 ? item.payment : 'free'}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Location width={15} height={15} fill='#fff' />
            <Text
              numberOfLines={1}
            style={{ fontSize:12, color: '#fff', marginLeft: 5, fontFamily: 'SftLight' }}>{language == 'English' ? item.city.name_eng : item.city.name}</Text>
          </View>
        </View>
        
          
      </View>
      </View>
    </TouchableOpacity>
    </View>
    )
  }, [data, hasPartyRequests, hasAcceptedPartyRequests])
  return (
    <View style = {{flex:1, backgroundColor: '#172136', justifyContent: 'flex-start', paddingTop: headerHeight}}>
        <View
            style={{ position: 'absolute', width: '100%', height: headerHeight, top: 0, backgroundColor: '#0F1826' }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%',
           alignItems: 'center', paddingHorizontal: 10, paddingBottom: 10,
           backgroundColor: '#0F1826'  }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%'}}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}
      onPress={() => {
        if (sortAll != 1) {
          setSortAll(1)
          setSortMy(0)
          setLoadingChangeType(true)
        }
        }}>
      <Text
        style={[sortAll == 1 ? { color: '#fff'} : {color: '#818C99'}, {fontSize: 17, padding: 5, fontFamily: 'SftMedium'}]}
      >{language == 'English' ? 'Search' : 'Найти'}</Text>
      </TouchableOpacity>
      <View
        style={[{ width: '90%', height: 2, borderRadius: 100 }, sortAll == 1 ? {backgroundColor: '#3F8AE0'} : {backgroundColor: 'transparent'}]}
      ></View>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%'}}>
      <TouchableOpacity
      activeOpacity={1}
      style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}
      onPress={() => {
        if (sortAll == 1) {
          setSortAll(0)
          setSortMy(1)
          setLoadingChangeType(true)
          }
        }}>
      <Text
        style={[sortMy == 1 ? {  color: '#fff' } : {color: '#818C99'}, {fontSize: 17, padding: 5, fontFamily: 'SftMedium'}]}
      >{language == 'English' ? 'My parties' : 'Мои вечеринки'}</Text>
      {(hasPartyRequests.length > 0 || hasAcceptedPartyRequests.length > 0) && <View style={{ width: 7, height: 7, backgroundColor: 'yellow', borderRadius: 100 }} />}
      </TouchableOpacity>
      <View
        style={[{ width: '90%', height: 2, borderRadius: 100 }, sortMy == 1 ? {backgroundColor: '#3F8AE0'} : {backgroundColor: 'transparent'}]}
      ></View>
      </View>
      </View>
      {loadingChangeType || data.length == 0 ? 
        // <ActivityIndicator
        //   size='small'
        // /> 
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          {loadingChangeType ? <LottieView
              source={require('../animation/anim_glasses.json')}
              style={{width: 100, height: 100, marginBottom: headerHeight }}
              loop={true}
              autoPlay={true}
              // renderMode='SOFTWARE'
              speed={1}
            /> : <Text
              style={{ color: '#fff', fontSize: 18, paddingHorizontal: 10, textAlign: 'center', fontFamily: 'SftMedium', marginBottom: headerHeight }}
            >{sortMy == 1 ? 'Вы пока что не состоите ни в одной вечеринке' : 'Пока что нет активных вечеринок...\nВозможно самое время создать первую ;)'}</Text>}
        </View>
        :
      <FlatList
      data={data}
      numColumns={2}
      contentContainerStyle={{ justifyContent: 'flex-start', paddingTop: 10, paddingBottom: headerHeight}}
      renderItem = {renderData}
      windowSize = {3}
      refreshControl = {
        <RefreshControl
          onRefresh = {() => {
            if (currentPage != 1) {
              setCurrentPage(1)
            }
            else {
              loadData()
            }
          }}
          refreshing = {loading}
          tintColor = {'#aaa'}
        />
      }
      showsVerticalScrollIndicator={false}
      keyExtractor = {item => `${item.id}`}
      onEndReached={LoadMoreItem}
      onEndReachedThreshold={1}
      ListFooterComponent = {renderLoader}
      removeClippedSubviews={true}
      />}

<Modal
        transparent={true}
        animationType='fade'
        visible={modalParty}
        statusBarTranslucent={true}
        >
          <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <TouchableOpacity onPress={() => {
            setModalParty(false)
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
                      setModalParty(false)
                    }}
                >
                    <ArrowLeft height={22} width={22} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Create party' : 'Организовать вечеринку'}</Text>
                </View>
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
              <ImageBackground
                style={{width: 150, height: 150, borderRadius: 37, alignSelf: 'center', marginTop: 50,
                        marginBottom: 20, backgroundColor: '#2B4150', overflow: 'hidden'}}
              >
                <TouchableOpacity 
                  style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                  onPress={PickImage}
                  activeOpacity={0.7}
                >

                  <CloudIcon height={40} width={40} />
                  <Image
                    style={{width: 150, height: 150, position: 'absolute'}}
                    source={fData && {
                      uri: fData["_parts"][0][1]["uri"]
                  }}
                  />
                </TouchableOpacity>
      
              </ImageBackground>
              <TouchableOpacity
                style={{ alignSelf: 'center' }}
                onPress={PickImage}
              >
                <Text
                  style={{ fontSize: 17, fontWeight: '300', fontFamily: 'SftLight',
                           color: '#6083FF'
                  }}
                >{language == 'English' ? 'Load photo' : 'Выбрать фотографию'}</Text>
              </TouchableOpacity>

              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', fontWeight: '300', marginTop: 20, fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language=='English' ? 'Party title' : 'Заголовок вечеринки'}</Text>
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
              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : '' }}>{language=='English' ? 'Description' : 'Описание'}</Text>
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

              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: 'SftLight' }}>{language=='English' ? 'City' : 'Город'}</Text>
              <TextInput
                style = {{padding:2,
                  margin:10,
                  marginVertical: 5,
                  fontSize: 17,
                  fontWeight: '300',
                  fontFamily: 'SftLight'}}
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
              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language=='English' ? 'Adress' : 'Адрес'}</Text>
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
                  <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language=='English' ? 'Number of people' : 'Кол-во человек'}</Text>
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
                  <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language=='English' ? 'Entrance fee' : 'Плата за вход'}</Text>
                  <TextInput style = {[styles.inputStyle, {fontFamily: 'SftMedium', textAlign: 'center', width: 100, includeFontPadding: true}]}
                    contentStyle={{ fontFamily: 'SftMedium' }}
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
              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', fontWeight: '300', marginTop: 10, fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language=='English' ? 'Start date' : 'Начало вечеринки'}</Text>
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
            <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', fontWeight: '300', marginTop: 10, fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language=='English' ? 'End date' : 'Конец вечеринки'}</Text>
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



              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language=='English' ? 'Party type' : 'Тип вечеринки'}</Text>
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

            <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language=='English' ? 'Music' : 'Музыка'}</Text>
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


            <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language=='English' ? 'Drinks' : 'Напитки'}</Text>
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

            <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language=='English' ? 'Food' : 'Еда'}</Text>
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
              
            <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', fontWeight: '300', marginTop: 10, fontFamily: fontsLoaded ? 'SftLight' : ''  }}>{language=='English' ? 'Dress-code' : 'Дресс-код'}</Text>
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
              shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.8,
              shadowRadius: 5, borderColor: '#90A9FF', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }, 
              Platform.OS === 'android' && {elevation: 4}]}
              activeOpacity={0.8}
              onPress={() => {
                fData != undefined ? createParty() : alert(language == 'English' ? 'Choose the photo!' : 'Выберите фото!')
              }}
            >
              <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400',
               marginLeft: 10, fontFamily: 'SftMedium' }, 
              ]}>{language == 'English' ? 'Create party' : 'Создать вечеринку'}</Text>
            </TouchableOpacity>

            </KeyboardAwareScrollView>

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
                textColor='#fff'
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
     </View>
  )
}

const styles = StyleSheet.create({
    cardStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 0,
        width: '100%'
    },
    inputStyle: {
      padding:2,
      margin:10,
      marginVertical: 5,
      fontSize: 17,
    },
    cityCardStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: 1,
      zIndex: 1000
    }
})

export default Parties