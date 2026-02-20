import React, {useState, useEffect, useCallback} from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground,
  Platform, RefreshControl, TextInput, Dimensions} from 'react-native'
import { Image } from 'expo-image';
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



function DatingNews(props) {
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
  const [loadingNews, setLoadingNews] = useState(true)
  const loadData = () => {
    if(!nextPageIsNull) {
    setLoading(true)
    fetch(`${BASE_URL}/api/article/?page=${currentPage}`, {
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
      setLoadingNews(false)
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
  }, [isFocused])

  // useEffect(() => {
  //   getTokenData()
  //   .then(() => {
  //       if (currentPage != 1) {
  //           setCurrentPage(1)
  //       }
  //       else {
  //           loadData()
  //       }
  //   })
  // }, [name])

  useEffect(() => {
    getTokenData()
    .then(() => {
        if (currentPage != 1 && !loading) {
            loadData()
        }
    })
  }, [currentPage])

  useEffect(() => {
    props.navigation.setOptions({ title: language == 'English' ? 'Dating News' : 'Дейт Новости',
         headerTitleStyle: {fontFamily: 'SftBold', fontSize: 20, }, headerStyle: {backgroundColor: "#fff"} })
  }, [language])

  const clickedItem = (item) => {
    props.navigation.navigate("DatingNewsOpenedStack", {title: {'title' : language == 'English' ? item.title_eng : item.title}, description: {'description' : language == 'English' ? item.description_eng : item.description}, image: {'image' : item.compressed_image_url}, source: {'source' : item.source}})
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
    let pubdate = new Date(item.pub_date)
    let formatDate = format(pubdate, 'HH:mm')
    let prevMesDate = new Date(moment(item.pub_date).toISOString())
    if (index < data.length - 1) {
      prevMesDate = new Date(moment(data[index + 1].pub_date).toISOString())
    }
    let message_pubD = new Date(moment(item.pub_date).toISOString())
    return(
      <View style={{width: '100%'}}>
        {(item.id == data[0].id || index > 0 && (format(new Date(moment(item.pub_date).toISOString()), 'dd MMM yyy') != format(new Date(moment(data[index - 1].pub_date).toISOString()), 'dd MMM yyy')))  && <View
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 100, alignSelf: 'center'}}
        ><Text 
        style={{textAlign: 'center',
            fontSize: 13,
            margin: 10,
            marginHorizontal: 15,
            color: '#fff',
            fontFamily: 'SftMedium'}}
        >
            {format(message_pubD, 'dd MMM yyyy')}
        </Text></View>}
        {Platform.OS === 'android' && <Shadow
                distance={35}
                offset={[20, 27]}
                startColor={'#ff073a'}
                style={{ width: SCREEN_WIDTH - 60, height: (SCREEN_WIDTH - 20) / 2 + 148, borderRadius: 20, position: 'absolute' }}
              />}
    <TouchableOpacity style={[styles.cardStyle, {
        shadowColor: '#ff073a', shadowOffset: {width: 0, height: -7}, shadowOpacity: 0.9, shadowRadius: 10
    }]} activeOpacity = {1} onPress = {() => clickedItem(item)}>
        
      <View
        style={{
             width: '100%', backgroundColor: '#ff073a', paddingTop: 3, overflow: 'hidden',
             borderRadius: 36, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, 
        }}
      >
      <View style={{flexDirection:"column", alignItems: 'flex-start',
         width: '100%', backgroundColor: '#2E374A',
         borderRadius:35, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: 'hidden'}}>
      <ImageBackground
        // source={item.sex == 'male' ? {uri: male} : {uri: female}}
        resizeMode='contain'
        style={{width: '100%', aspectRatio: 2/1, overflow: 'hidden', backgroundColor: '#0F1825',
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
        

      </ImageBackground>
      
        <View style={{ paddingVertical: 20, paddingHorizontal: 12 }}>
              <Text
                style={{ color: '#fff', fontSize: 20,  fontFamily: 'SftBold'
                 }}
                ellipsizeMode='tail'
                numberOfLines={1}
              >{language == 'English' ? item.title_eng : item.title}</Text>
              <Text
               style={{ color: '#fff', fontSize: 17, marginTop: 10,
                 fontFamily: 'SftMedium', height: 85 }}
               ellipsizeMode='tail'
               numberOfLines={4}
              >{language == 'English' ? item.description_eng : item.description}</Text>
        </View>
        <View style={{ paddingBottom: 10, paddingHorizontal: 12, width: '100%' }}>
            <Text
              style={{ color: '#8E8E93', fontSize: 13, textAlign: 'right'}}
            >{formatDate}</Text>
        </View>
          
      </View>
      </View>
    </TouchableOpacity>
    </View>
    )
  }, [data])
  return (
    <View style = {{flex:1, backgroundColor: '#172136', justifyContent: 'flex-start', paddingTop: headerHeight}}>
        <View
            style={{ position: 'absolute', width: '100%', height: headerHeight, top: 0, backgroundColor: '#0F1826' }}
        />
      {loadingNews || !data ? 
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
      numColumns={1}
      contentContainerStyle={{ justifyContent: 'flex-start', paddingTop: 10, paddingHorizontal: 10, paddingBottom: headerHeight}}
      renderItem = {renderData}
      windowSize = {2}
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
          refreshing = {loadingNews}
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
      
     </View>
  )
}

const styles = StyleSheet.create({
    cardStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        width: '100%'
    },
})

export default DatingNews