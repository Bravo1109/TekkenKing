import React, {useState, useEffect, useCallback} from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground,
  ScrollView, Dimensions} from 'react-native'
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
import ArrowLeft from '../images/arrow_up_left.svg'
import { CommonActions } from '@react-navigation/native';
import { openBrowserAsync } from 'expo-web-browser';



function DatingNewsOpened(props) {
  const headerHeight = useHeaderHeight();
  const {title} = props.route.params.title
  const {description} = props.route.params.description
  const {source} = props.route.params.source
  const {image} = props.route.params.image
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
  const SCREEN_HEIGHT = Dimensions.get('window').height
  const [fontsLoaded, setfFontsLoaded] = useState(false)
  const _loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setfFontsLoaded(true);
  }
  _loadFontsAsync()
  const bluredBg = require('../images/bluredRating.png');
  const nowDate = new Date();
  const [language, setLanguage] = useState('');
  const [loadImage, setLoadImage] = useState(true);
  const [nextPageIsNull, setNextPageIsNull] = useState(false);
  const [name, setName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const isFocused = useIsFocused();
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

  const handlePress = async (url) => {
    let result = await openBrowserAsync(url);
    console.log(result);
  };

  const renderTextWithLinks = (text) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlPattern);

    return parts.map((part, index) => {
      if (urlPattern.test(part)) {
        return (
          <TouchableOpacity 
          key={index} 
          onPress={() => handlePress(part)}
          >
            <Text style={{
                color: '#6183FF',
                fontSize: 18,
                fontFamily: 'SftMedium',
                textDecorationLine: 'underline',
                marginBottom: -3,
            }}
            numberOfLines={2}
            ellipsizeMode='tail'>{part}</Text>
          </TouchableOpacity>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  useEffect(() => {
    getLanguageData()
  }, [isFocused])


  
  return (
    <View style = {{flex:1, backgroundColor: '#172136', justifyContent: 'flex-start', paddingTop: headerHeight}}>
      <TouchableOpacity
            onPress={() => {
                props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key})); 
            }}
            style={{left: 15, top: 50, borderRadius: 100, width: 40, height: 40,
              alignItems: 'center', justifyContent: 'center', zIndex: 11111, position: 'absolute',
              backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1, elevation: 3 }}
            activeOpacity={1}
            >
              <ArrowLeft width={30} height={30} fill={'#2688EB'} />
          </TouchableOpacity>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Image
            style={{backgroundColor: '#0F1825', width: '100%', height: SCREEN_HEIGHT / 3}}
            cachePolicy={'disk'}
            source={{
                uri: `${BASE_URL}${image}`
            }}
        />
        <View
            style={{ paddingHorizontal: 15, width: '100%' }}
        >
        <Text
            style={{ color: '#fff', fontSize: 25, marginVertical: 20, fontFamily: 'SftBold', textAlign: 'center' }}
        >{title}</Text>
        <Text
            style={{ color: '#fff', fontSize: 18, fontFamily: 'SftMedium', textAlign: 'left' }}
        >{renderTextWithLinks(description)}</Text>
        <Text
            style={{ color: '#fff', fontSize: 18, marginTop: 20, fontFamily: 'SftMedium', textAlign: 'left' }}
        >{renderTextWithLinks(`${language == 'English' ? 'Source: ' : 'Источник: '}${source}`)}</Text>
        </View>
        
      </ScrollView>
      
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

export default DatingNewsOpened