import React, {useState, useEffect} from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground,
  Platform, RefreshControl, Dimensions, Modal, Animated, TextInput} from 'react-native'
import { Image } from 'expo-image';
import { CommonActions, useIsFocused } from "@react-navigation/native";
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Location from '../images/location.svg'
import CircleStar from '../images/star_circle.svg'
import { BlurView } from 'expo-blur'
import * as Font from 'expo-font';
import { useHeaderHeight } from '@react-navigation/elements';
import { BASE_URL } from './config'; 
import FilterSettings from '../images/filter_settings.svg'
import CheckBox from './CheckBox';
import LottieView from 'lottie-react-native';
import ArrowLeft from '../images/turnBack.svg'
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


function Companies(props) {
  const { widthH, heightH } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight({ widthH, heightH }, Platform.OS, insets.top) - 10
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
  const [filtersModal, setFiltersModal] = useState(false)
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
  const [location, setLocation] = useState('City')
  const [sortCity, setSortCity] = useState(1)
  const [sortCountry, setSortCountry] = useState(0)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingProfiles, setLoadingProfiles] = useState(true)
  
  const writeGender = async (value) => {
    try {
        await AsyncStorage.setItem('chooseGenderRating', value)
    } catch(e) {
        console.log('error', e)
    }
    console.log('Done', value)
  }
  const loadData = () => {
    if(!nextPageIsNull || currentPage === 1) {
    setLoading(true)
    fetch(`${BASE_URL}/api/companiegoods/`, {
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
      // console.log(data)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }}
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
      title: language == 'English' ? 'Companies' : 'Компании', headerTitleStyle: {fontFamily: 'SftBold', fontSize: 20},
    //   headerRight: () => (
    //     <TouchableOpacity
    //       style={{ height: 35, width: 35, marginRight: 10, zIndex: 0,
    //            backgroundColor: '#fff', borderRadius: 100, justifyContent: 'center',
    //            alignItems: 'center' }}
    //       activeOpacity={1}
    //       onPress={() => {
    //         setFiltersModal(true)
    //         console.log('gender:  ', gender)
    //       }}
    //     >
    //       <FilterSettings width={25} height={25} />
    //     </TouchableOpacity>
    //   )
     })
  }, [language])

  const clickedItem = (id) => {
    props.navigation.navigate("GoodsStack", {id: id, companie_item: id})
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
          {/* <BlurView style={[{ position: 'absolute',  alignItems: 'center',
            borderRadius: 40, overflow: 'hidden', bottom: 15, left: 15,  backgroundColor: 'rgba(0, 0, 0, 0.1)',
            justifyContent: 'center', flexDirection: 'row' }, item.boosted && { backgroundColor: 'rgba(200,255,0, 0.4)' }]}
            intensity={30}
          >
            {Platform.OS === 'android' && <Image
              style={{ width: SCREEN_WIDTH * 0.5 - 24, height: SCREEN_WIDTH * 0.5 - 24, position: 'absolute', bottom: -15, left: -15 }}
              cachePolicy={'disk'}
              source={item.photos.length > 0 ? {uri: `${BASE_URL}${item.photos[0].compressed_image_url}`}: bluredBg}
              blurRadius={20}
            />}
            {Platform.OS === 'android' && <View
              style={[{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)' }, item.boosted && { backgroundColor: 'rgba(200,255,0, 0.3)' }]}
            />}
            <View style={{  flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12 }}>
              <CircleStar width={15} height={15} fill='#fff' />
              <Text style={{ color: '#fff', fontSize: 12, marginLeft: 5, fontFamily: 'SftMedium' }}>Rating: {item.rating < 100000 ? item.rating : (item.rating / 1000).toFixed(1) + 'K'}</Text>
            </View>
            
          </BlurView> */}
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
    <View style = {{flex:1, backgroundColor: '#172136', justifyContent: 'flex-start'}}>
      <View style={{ height: headerHeight,
        alignItems: 'flex-end', paddingBottom: 10, flexDirection: 'row', width: '100%' }}>
            <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                onPress={() => {
                  props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
                }}
            >
                <ArrowLeft height={24} width={24} />
            </TouchableOpacity>
            <View style={{ width: '60%' }}>
                <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Companies' : 'Компании'}</Text>
            </View>
        </View>
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
        visible={filtersModal}
        statusBarTranslucent={true}
      >
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: SCREEN_WIDTH,
          backgroundColor: 'transparent'
        }}
        >
        <View style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'transparent'
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            
          <TouchableOpacity onPress={() => {
            setFiltersModal(false)
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
          <Animated.View style={{
            backgroundColor: '#172136',
            // borderRadius: 15,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            width: '100%',
            overflow:'hidden',
          }}
          activeOpacity={1}
          >
          <View style={{ marginTop: 20}}>
            <Text style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Search settings' : 'Фильтры поиска'}</Text>
          </View>
          <IconButton
            size={20}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 30, height: 30, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setFiltersModal(false)
            }}
          />
          <View style={{
            height: 0.33,
            width: '100%',
            backgroundColor: '#343434',
            marginTop: 20
          }} />
          {/* </GestureHandlerRootView> */}
          <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: 50 }}>
          <Text style={{ fontSize: 20, marginLeft: 20, color: '#BDBDBD', fontWeight: '300', fontFamily: 'SftLight' }}>{language == 'English' ? 'Gender' : 'Пол'}: </Text>
          <TouchableOpacity style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', marginTop: 17 }}
            activeOpacity={0.6}
            onPress={() => {
                // setCheckMale(false)
                // setCheckFemale(false)
                // setCheckAll(true)
                setGender('all')
            }}
          >
          <CheckBox size={35} color='#B8C1CC' selectedColor='#2688EB'
            selected={checkAll}
            onPress={() => {
                // setCheckMale(false)
                // setCheckFemale(false)
                // setCheckAll(true)
                setGender('all')
            }}
          /> 
          <Text style={{ fontSize: 17, color: '#fff', fontFamily: 'SftLight' }}>{language == 'English' ? 'All' : 'Любой'}</Text>
          </TouchableOpacity> 
          <TouchableOpacity style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', marginTop: 17 }}
          activeOpacity={0.6}
            onPress={() => {
              // setCheckMale(true)
              // setCheckFemale(false)
              // setCheckAll(false)
              setGender('male')
            }}
          >
          <CheckBox size={35} color='#B8C1CC' selectedColor='#2688EB'
            selected={checkMale}
            onPress={() => {
                // setCheckMale(true)
                // setCheckFemale(false)
                // setCheckAll(false)
                setGender('male')
            }}
          /> 
          <Text style={{ fontSize: 17, color: '#fff', fontFamily: 'SftLight' }}>{language == 'English' ? 'Male' : 'Мужчины'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', marginTop: 17 }}
            activeOpacity={0.6}
            onPress={() => {
                // setCheckMale(false)
                // setCheckFemale(true)
                // setCheckAll(false)
                setGender('female')
            }}
          >
          <CheckBox size={35} color='#B8C1CC' selectedColor='#2688EB'
            selected={checkFemale}
            onPress={() => {
                // setCheckMale(false)
                // setCheckFemale(true)
                // setCheckAll(false)
                setGender('female')
            }}
          /> 
          <Text style={{ fontSize: 17, color: '#fff', fontFamily: 'SftLight' }}>{language == 'English' ? 'Female' : 'Женщины'}</Text>
          </TouchableOpacity>
          
          </View>
          <View style={{ width: '100%', paddingHorizontal: 20, marginBottom: 40, marginTop:30 }}>
          <TouchableOpacity
          onPress={() => {
            // this.loadData()
            writeGender(gender)
            .then(() => {
              setFiltersModal(false)
              setLoadingProfiles(true),
              setNextPageIsNull(false),
              setData([]),
              setCurrentPage(1)
              setFiltersModalAccept(filtersModalAccept + 1)
            })
            // .then(() => {triggerFunction()})
            // this.writeAgeTo(this.state.age_to._j.toString())
          }}
          style={[{ borderWidth: 1, borderColor: '#90A9FF', borderRadius: 12, paddingVertical: 12,
          shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 3 },
          Platform.OS === 'android' && {elevation: 3, backgroundColor: '#172136'}]}
          activeOpacity={0.8}
          >
          <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontFamily: 'SftMedium' }, Platform.OS === 'android' && {
            textShadowColor: '#fff', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 7
          }]}>{language == 'English' ? 'Accept' : 'Принять'}</Text>
          </TouchableOpacity>
          </View>
          </Animated.View>
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
})

export default Companies