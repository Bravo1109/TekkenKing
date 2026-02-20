import React, {useState, useEffect} from 'react'
import { Text, View, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ImageBackground,
  Platform, RefreshControl, TextInput, Dimensions} from 'react-native'
import { useIsFocused } from "@react-navigation/native";
import Male from '../images/male.png'
import Female from '../images/female.png'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Location from '../images/location.svg'
import CircleStar from '../images/star_circle.svg'
import CheckMark from '../images/checkmarkShadows.svg'
import { BlurView } from 'expo-blur'
import * as Font from 'expo-font';
import { useHeaderHeight } from '@react-navigation/elements';
import { BASE_URL } from './config';
import LottieView from 'lottie-react-native'; 



function CelebrityList(props) {
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
  const SCREEN_WIDTH = Dimensions.get('window').width
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
  const [language, setLanguage] = useState('');
  const male = Image.resolveAssetSource(Male).uri;
  const female = Image.resolveAssetSource(Female).uri;
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
  const [loadingProfiles, setLoadingProfiles] = useState(true)
  const loadData = () => {
    if(!nextPageIsNull || currentPage === 1) {
    setLoading(true)
    fetch(`${BASE_URL}/api/celebrities/?limit=20&search=${name}&page=${currentPage}`, {
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
      setLoadingProfiles(false)
      console.log(data)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }}
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
        loadData()
      }
    })
    console.log(isFocused)
  }, [sortCity, sortCountry, currentPage, isFocused])

  useEffect(() => {
    getTokenData()
    .then(() => {
        if (currentPage != 1) {
            setCurrentPage(1)
        }
        else {
            loadData()
        }
    })
  }, [name])

  useEffect(() => {
    props.navigation.setOptions({ title: language == 'English' ? 'Celebrities' : 'Знаменитости', headerTitleStyle: {fontFamily: 'SftBold', fontSize: 20} })
  }, [language])

  const clickedItem = (id) => {
    props.navigation.navigate("Profile", {id: id, data: id})
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
    <TouchableOpacity style={styles.cardStyle} activeOpacity = {1} onPress = {() => clickedItem(item)}>
      <View style={{flexDirection:"column", alignItems: 'flex-start', width: '100%'}}> 
      <CheckMark width={35} height={35} style={{ position: 'absolute', zIndex: 1, right: -5, top: -5 }} />
      <ImageBackground
        // source={item.sex == 'male' ? {uri: male} : {uri: female}}
        resizeMode='contain'
        style={{width: '100%', aspectRatio: 1/1, overflow: 'hidden', backgroundColor: '#0F1825',
        borderRadius:35}}
        >
          {item.photos.length != 0 ? <Image
            style={{width:'100%', height:'100%', opacity: 1}}
            source={{
             uri: `${BASE_URL}${item.photos[0].compressed_image_url}`
            }}
            onLoadEnd={() => setLoadImage(false)}
           /> : <View></View> }
          <BlurView style={{ position: 'absolute',  alignItems: 'center',
            borderRadius: 40, overflow: 'hidden', bottom: 15, left: 15,  backgroundColor: 'rgba(0, 0, 0, 0.1)',
            justifyContent: 'center', flexDirection: 'row' }}
            intensity={30}
          >
            {/* {Platform.OS === 'android' && <LinearGradient
              colors={['rgba(186, 185, 189, 0.97);', 'rgba(116, 128, 134, 0.97)']}
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
            {Platform.OS === 'android' && <Image
              style={{ width: SCREEN_WIDTH * 0.5 - 24, height: SCREEN_WIDTH * 0.5 - 24, position: 'absolute', bottom: -15, left: -15 }}
              source={item.photos.length > 0 ? {uri: `${BASE_URL}${item.photos[0].compressed_image_url}`}: bluredBg}
              blurRadius={20}
            />}
            {Platform.OS === 'android' && <View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            />}
            <View style={{  flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12 }}>
              <CircleStar width={15} height={15} fill='#fff' />
              <Text style={{ color: '#fff', fontSize: 12, marginLeft: 5, fontFamily: 'SftMedium' }}>Rating: {item.rating}</Text>
            </View>
            
          </BlurView>
        <ActivityIndicator 
        style={{position: 'absolute', left:0, top:0, right:0, bottom:0}}
        animating={loadImage}
        />

      </ImageBackground>
      
        <View style={{marginTop: 5}}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style = {{fontSize:15, color: '#fff', fontFamily: 'SftMedium', marginRight: 2}}>{item.name.length < 15
              ? `${item.name}`
              : `${item.name.substring(0, 13)}...`}, {item.age}</Text>
         {((nowDate - new Date(item.last_seen)) / 60 / 1000) < 15 && <View
            style={{ backgroundColor: '#65B141', width: 7, aspectRatio: 1/1, borderRadius: 100, marginLeft: 5 }}
          ></View>}
        </View>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Location width={15} height={15} fill='#A1AAB1' />
            <Text style={{ fontSize:12, color: '#A1AAB1', marginLeft: 5, fontFamily: 'SftMedium' }}>{item.city.name}</Text>
          </View>
          
        </View>
      </View>
    </TouchableOpacity>
    </View>
    )
  }
  return (
    <View style = {{flex:1, backgroundColor: '#172136', justifyContent: 'flex-start', paddingTop: headerHeight}}>
      <View
        style={{ width: '100%', height: 45, marginTop: 10, paddingHorizontal: 17 }}
      >
      <TextInput
            placeholder={language == 'English' ? 'Search': 'Поиск'}
            placeholderTextColor='#636366'
            verticalAlign='middle'
            value={name}
            // ref={textInput}
            onChangeText = {name => setName(name)}
            style={{ backgroundColor: '#080D15', fontSize: 17, minHeight: 45, maxHeight: 45,
            flex: 1, textAlignVertical: 'center', borderRadius: 15,  overflow: 'hidden', 
            color: '#fff', borderWidth: 1, paddingHorizontal: 10}}
        />
      </View>
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
      windowSize = {5}
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

export default CelebrityList