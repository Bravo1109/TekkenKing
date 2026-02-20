import React, {useState, useEffect} from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground,
  Platform, RefreshControl, Dimensions, Modal, Animated, TextInput} from 'react-native'
import { Image } from 'expo-image';
import { useIsFocused } from "@react-navigation/native";
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BlurView } from 'expo-blur'
import * as Font from 'expo-font';
import { useHeaderHeight } from '@react-navigation/elements';
import { BASE_URL } from './config';
import LottieView from 'lottie-react-native';
import Plus from '../images/plus.svg'
import ArrowBack from '../images/turnBack.svg'
import ArrowDown from '../images/arrowDownSign.svg'
import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import CloudIcon from '../images/cloud.svg'


function Stores(props) {
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
  const SCREEN_WIDTH = Dimensions.get('window').width
  const [fontsLoaded, setfFontsLoaded] = useState(false)
  const [cursorRating, setCursorRating] = useState(0)
  const [cursorId, setCursorId] = useState(0)
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
  
  const [language, setLanguage] = useState('')
  const [filtersModalAccept, setFiltersModalAccept] = useState(0)
  const [gender, setGender] = useState('')
  const [genderGot, setGenderGot] = useState(false)
  const [checkMale, setCheckMale] = useState(gender == 'male')
  const [checkFemale, setCheckFemale] = useState(gender == 'female')
  const [checkAll, setCheckAll] = useState(gender == 'all')
  const [loadImage, setLoadImage] = useState(true)
  const [nextPageIsNull, setNextPageIsNull] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const isFocused = useIsFocused();
  const token = getTokenData()
  const [sortCity, setSortCity] = useState(1)
  const [sortCountry, setSortCountry] = useState(0)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingProfiles, setLoadingProfiles] = useState(true)
  const [modalChange, setModalChange] = useState(false)
  const [changeTitle, setChangeTitle] = useState('')
  const [changeDesc, setChangeDesc] = useState('')
  const [changePhones, setChangePhones] = useState('')
  const [changeMail, setChangeMail] = useState('')
  const [changeLpr, setChangeLpr] = useState('')
  const [changeLink, setChangeLink] = useState('')
  const [changeStatus, setChangeStatus] = useState('Контактов не было')
  const [changeStatusModal, setChangeStatusModal] = useState(false)
  const [loadingChange, setLoadingChange] = useState(false)
  
  const loadData = () => {
    if(!nextPageIsNull || currentPage === 1) {
    setLoading(true)
    fetch(`${BASE_URL}/api/stores/`, {
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
        setCursorId(res.results[res.results.length - 1].id)
        setCursorRating(res.results[res.results.length - 1].rating)
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
      setLoadingProfiles(false)
      setLoadingChange(false)
      // console.log(data)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }}

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
        formData.append('image', {
          uri: newImageUri,
          name: 'image.jpeg',
          type: 'image/jpeg'
        });
  
        setFData(formData);
      }
    }
  }

  const createStore = () => {
      setLoadingChange(true)
      fData.append('title', changeTitle);
      fData.append('description', changeDesc);
      fData.append('status', changeStatus);
      fData.append('telephone', changePhones);
      fData.append('mail', changeMail);
      fData.append('lpr', changeLpr);
      fData.append('link', changeLink);
      fetch(`${BASE_URL}/api/stores/`, {
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
          setLoadingChange(false)
          setModalChange(false)
          loadData()
        } else if (status == 403) {
          setLoadingChange(false)
          alert('Действие запрещено')
        } else {
          setLoadingChange(false)
          alert('Ошибка! Название магазина, ссылка и фото не могут быть пустыми')
        } 
      })
      .catch(error => {
        console.log("Error", error)
      })
    }

  const getGenderData = async () => {
    try {
        let genderData = await AsyncStorage.getItem('chooseGenderRating')
        if(genderData != null) {
          setGender(genderData)
          setGenderGot(true)
          return
        }
        else {
          setGender('all')
          setGenderGot(true)
          return
        }
    } catch(e) {
        console.log('error', e)
        return loadData()
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
  useEffect(() => {
    getLanguageData()
    // getGenderData()
    getTokenData()
    .then(() => {
      if (isFocused) {
        !genderGot ? getGenderData() : loadData()
      }
    })
    // console.log(isFocused)
  }, [sortCity, sortCountry, currentPage, isFocused, filtersModalAccept])

  useEffect(() => {
    getTokenData()
    .then(() => {
        genderGot && loadData()
    })
  }, [genderGot])

  useEffect(() => {
    if (gender == 'male') {
      setCheckMale(true)
      setCheckAll(false)
      setCheckFemale(false)
    } else if (gender == 'female') {
      setCheckMale(false)
      setCheckAll(false)
      setCheckFemale(true)
    } else {
      setCheckMale(false)
      setCheckAll(true)
      setCheckFemale(false)
    }
  }, [gender])

  useEffect(() => {
    props.navigation.setOptions({
      title: language == 'English' ? 'Stores' : 'Магазины', headerTitleStyle: {fontFamily: 'SftBold', fontSize: 20},
      headerRight: () => (
        <TouchableOpacity
        style={{ height: 40, aspectRatio: 1/1, borderRadius: 100,
                  marginRight: 10, borderColor: '#90A9FF', borderWidth: 2,
                  alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F1826',
                  shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0},
                  shadowOpacity: 0.7, shadowRadius: 5, elevation: 15 }}
        onPress={() => {
          setModalChange(true)
        }}
        >
        <Plus height={17} width={17} color={'#90A9FF'} />
        </TouchableOpacity>
        )
    })
  }, [language])

  const clickedItem = (id) => {
    props.navigation.navigate("Store", {id: id, data: id})
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
  const renderData = (item) => {
    return(
      <View style={{width: '50%'}}>
    <TouchableOpacity style={styles.cardStyle} activeOpacity = {0.8} onPress = {() => clickedItem(item)}>
      <View style={{flexDirection:"column", alignItems: 'flex-start', width: '100%'}}>
      <ImageBackground
        // source={item.sex == 'male' ? {uri: male} : {uri: female}}
        resizeMode='contain'
        style={{width: '100%', aspectRatio: 1/1, overflow: 'hidden', backgroundColor: '#0F1825',
        borderRadius:35}}
        >
          <ActivityIndicator
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          />
          <Image
            style={{width:'100%', height:'100%', opacity: 1}}
            cachePolicy={'disk'}
            source={{
             uri: `${BASE_URL}${item.compressed_image_url}`
            }}
            onLoadEnd={() => setLoadImage(false)}
           />
          <BlurView style={[{ position: 'absolute',  alignItems: 'center',
            borderRadius: 40, overflow: 'hidden', bottom: 15, marginLeft: 15, marginRight: 15, backgroundColor: 'rgba(0, 0, 0, 0.1)',
            justifyContent: 'center', flexDirection: 'row' }, item.boosted && { backgroundColor: 'rgba(200,255,0, 0.4)' }]}
            intensity={50}
          >
            {Platform.OS === 'android' && <Image
              style={{ width: SCREEN_WIDTH * 0.5 - 24, height: SCREEN_WIDTH * 0.5 - 24, position: 'absolute', bottom: -15, left: -15 }}
              cachePolicy={'disk'}
              source={{uri: `${BASE_URL}${item.compressed_image_url}`}}
              blurRadius={30}
            />}
            {Platform.OS === 'android' && <View
              style={[{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)' }, item.boosted && { backgroundColor: 'rgba(200,255,0, 0.3)' }]}
            />}
            <View style={{  flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10 }}>
              <Text
              numberOfLines={1}
              style={{ color: '#fff', fontSize: 12,
               fontFamily: 'SftMedium' }}>{item.status}</Text>
            </View>
            
          </BlurView>
        <ActivityIndicator 
        style={{position: 'absolute', left:0, top:0, right:0, bottom:0}}
        animating={loadImage}
        />

      </ImageBackground>
      
        <View style={{marginTop: 5}}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}
        >
          <Text
           numberOfLines={1}
           style = {{fontSize:15, color: '#fff', fontFamily: 'SftMedium', maxWidth: '75%'}}>
            {item.title}</Text>    
        </View>
          {/* <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Location width={15} height={15} fill='#A1AAB1' />
            <Text
              numberOfLines={1}
            style={{ fontSize:12, color: '#A1AAB1', marginLeft: 5, fontFamily: 'SftMedium' }}>{language == 'English' ? item.city.name_eng : item.city.name}</Text>
          </View> */}
          
        </View>
      </View>
    </TouchableOpacity>
    </View>
    )
  }
  return (
    <View style = {{flex:1, backgroundColor: '#172136', justifyContent: 'flex-start', paddingTop: headerHeight}}>
      {/* <View
        style={{ width: '100%', height: 45, marginTop: 10, paddingHorizontal: 17 }}
      >
      <TextInput
            placeholder={language == 'English' ? "Friend's username": 'Username друга'}
            placeholderTextColor='#636366'
            verticalAlign='middle'
            // value={name}
            // ref={textInput}
            // onChangeText = {name => setName(name)}
            style={{ backgroundColor: '#080D15', fontSize: 17, minHeight: 45, maxHeight: 45,
            flex: 1, textAlignVertical: 'center', borderRadius: 15,  overflow: 'hidden', 
            color: '#fff', borderWidth: 1, paddingHorizontal: 10}}
        />
      </View> */}
      {loadingProfiles || !data ? 
        // <ActivityIndicator
        //   size='small'
        // /> 
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <LottieView
              source={require('../animation/anim_glasses.json')}
              style={{width: 100, height: 100, marginBottom: headerHeight }}
              loop={true}
              autoPlay={true}
              // renderMode='SOFTWARE'
              speed={1}
            />
        </View>
        :
      <FlatList
      data={data}
      numColumns={2}
      contentContainerStyle={{ justifyContent: 'flex-start', paddingTop: 10, paddingHorizontal: 10, paddingBottom: headerHeight}}
      renderItem = {({item}) => {
        return renderData(item)
      }}
      // initialNumToRender = {data.length}
      // windowSize = {data.length > 0 ? data.length : 30}
      windowSize = {7}
      // onRefresh = {() => loadData()}
      // refreshing = {loadingProfiles}
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
          refreshing = {loadingProfiles}
          tintColor = {'#aaa'}
          // style = {{ transform: [{ scale: 0.7 }]}}
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
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Create store' : 'Cоздать магазин'}</Text>
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
              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', fontWeight: '300', marginTop: 20, fontFamily: 'SftLight'}}>{language == 'English' ? 'Title' : 'Название магазина'}</Text>
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
              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: 'SftLight'}}>{language == 'English' ? 'Description' : 'Описание магазина'}</Text>
              <TextInput style = {[styles.inputStyle, {minHeight: 100, maxHeight: 200}]}
                contentStyle={[{ fontFamily: 'SftLight' }, Platform.OS === 'android' && {paddingTop: 15}]}
                placeholder={language == 'English' ? 'Describe store' : 'Опишите магазин'}
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
              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: 'SftLight'}}>{language == 'English' ? 'Status' : 'Статус'}</Text>
              {Platform.OS === 'ios' ? <TouchableOpacity
                style={{ padding: 17, marginVertical: 5, marginHorizontal: 10, borderRadius: 13, borderWidth: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
                activeOpacity={0.8}
                onPress={() => {
                  setChangeStatusModal(true)
                }}
              >
                <Text style={{ fontSize: 17, fontWeight: '300', fontFamily: 'SftMedium', color: '#fff' }}>{changeStatus}</Text>
                <ArrowDown height={20} width={20} />
              </TouchableOpacity> : 
              <View style={{ borderRadius: 13, overflow: 'hidden', marginHorizontal: 10, marginVertical: 5}}>
                <Picker
                style={{  width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 10000, borderRadius: 13 }}
                dropdownIconColor={'#fff'}
                dropdownIconRippleColor={'#000'}
                selectedValue={changeStatus}
                onValueChange={(itemValue, itemIndex) => setChangeStatus(itemValue)}
                mode='dropdown'
                >
                <Picker.Item
                  label='Контактов не было'
                  value={'Контактов не было'}
                  color='#fff'
                  style={{ backgroundColor: '#071620' }}
                />
                <Picker.Item
                  label='Не интересно'
                  value={'Не интересно'}
                  color='#fff'
                  style={{ backgroundColor: '#071620' }}
                />
                <Picker.Item
                  label='Заинтересованы, проработка'
                  value={'Заинтересованы, проработка'}
                  color='#fff'
                  style={{ backgroundColor: '#071620' }}
                />
                <Picker.Item
                  label='Отправка КП'
                  value={'Отправка КП'}
                  color='#fff'
                  style={{ backgroundColor: '#071620' }}
                />
                <Picker.Item
                  label='Заключение договора поставки'
                  value={'Заключение договора поставки'}
                  color='#fff'
                  style={{ backgroundColor: '#071620' }}
                />
                <Picker.Item
                  label='Наш пездюк'
                  value={'Наш пездюк'}
                  color='#fff'
                  style={{ backgroundColor: '#071620' }}
                />
              </Picker>
              </View>
              }

              <Text style={{ marginLeft: 10, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: 'SftLight' }}>{language == 'English' ? 'Phone numbers' : 'Телефоны'}</Text>
              <TextInput style = {[styles.inputStyle, {minHeight: 100, maxHeight: 200}]}
                contentStyle={[{ fontFamily: 'SftLight' }, Platform.OS === 'android' && {paddingTop: 15}]}
                placeholder={language == 'English' ? 'Add phones' : 'Добавьте телефоны'}
                // scrollEnabled={newPartyDescription == '' ? false : true}
                placeholderTextColor={'#818C99'}
                value={changePhones}
                multiline={true}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                // outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {description => setChangePhones(description)}
              />
              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontFamily: 'SftLight'}}>{language == 'English' ? 'E-mail' : 'E-mail'}</Text>
              <TextInput style = {[styles.inputStyle]}
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholder={language == 'English' ? 'Add store e-mail' : 'Добавьте почту магазина'}
                placeholderTextColor={'#818C99'}
                value={changeMail}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                // outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {text => setChangeMail(text)}
              />
              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontFamily: 'SftLight'}}>{language == 'English' ? 'Contact face' : 'ЛПР'}</Text>
              <TextInput style = {[styles.inputStyle]}
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholder={language == 'English' ? 'Add contact face' : 'Добавьте контактное лицо'}
                placeholderTextColor={'#818C99'}
                value={changeLpr}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                // outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {text => setChangeLpr(text)}
              />
              <Text style={{ marginLeft: 12, fontSize: 17, color: '#6D7885', marginTop: 10, fontFamily: 'SftLight' }}>{language == 'English' ? 'Store link' : 'Ссылка на магазин'}</Text>
              <TextInput style = {[styles.inputStyle]}
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholder={language == 'English' ? 'Add store link' : 'Добавьте ссылку на магазин'}
                placeholderTextColor={'#818C99'}
                value={changeLink}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                // outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {text => setChangeLink(text)}
              />
              <TouchableOpacity
                style={[{ backgroundColor: '#172136', borderRadius: 100, flexDirection: 'row', paddingVertical: 15, margin: 10, marginTop: 30,
                shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.8,
                shadowRadius: 5, borderColor: '#90A9FF', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }, 
                Platform.OS === 'android' && {elevation: 4}]}
                activeOpacity={0.8}
                onPress={() => {
                  fData != undefined ? createStore() : alert(language == 'English' ? 'Choose the photo!' : 'Выберите фото!')
                }}
              >
                <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400',
                  marginLeft: 10, fontFamily: 'SftMedium' }, 
                ]}>{language == 'English' ? 'Create store' : 'Создать магазин'}</Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
            {changeStatusModal &&
                <View style={{ width: '100%', height: '100%', position: 'absolute',
                top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10000}}> 
                <TouchableOpacity style={{ width: '100%', height: '100%', position: 'absolute',
                top: 0, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
                activeOpacity={0.5}
                onPress={() => {setChangeStatusModal(false)}}
                >
                </TouchableOpacity>
                <Picker
                  style={{ width: '90%', backgroundColor: '#172136', zIndex: 10000, borderRadius: 15 }}
                  selectedValue={changeStatus}
                  onValueChange={(itemValue, itemIndex) => setChangeStatus(itemValue)}
                  mode='dropdown'
                >
                  <Picker.Item
                    label='Контактов не было'
                    value={'Контактов не было'}
                    color='#fff'
                  />
                  <Picker.Item
                    label='Не интересно'
                    value={'Не интересно'}
                    color='#fff'
                  />
                  <Picker.Item
                    label='Заинтересованы, проработка'
                    value={'Заинтересованы, проработка'}
                    color='#fff'
                  />
                  <Picker.Item
                    label='Отправка КП'
                    value={'Отправка КП'}
                    color='#fff'
                  />
                  <Picker.Item
                    label='Заключение договора поставки'
                    value={'Заключение договора поставки'}
                    color='#fff'
                  />
                  <Picker.Item
                    label='Наш пездюк'
                    value={'Наш пездюк'}
                    color='#fff'
                  />
                </Picker>
                </View>
              }
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
})

export default Stores