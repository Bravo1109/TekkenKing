import React, {useState, useEffect} from 'react'
import { Text, View, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ImageBackground,
  RefreshControl, SafeAreaView } from 'react-native'
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import Location from '../images/location.svg'
import CircleStar from '../images/star_circle.svg'
import { BlurView } from 'expo-blur'
import { useHeaderHeight } from '@react-navigation/elements';
import RangeSlider from './RangeSlider';
import Modal from 'react-native-modal'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { BASE_URL } from './config';

function Games(props) {
  let customFonts = {
    'RobotoMedium': require('../assets/Roboto-Medium.ttf'),
    'RobotoBold': require('../assets/Roboto-Bold.ttf'),
    'RobotoLight': require('../assets/Roboto-Light.ttf'),
    'RobotoThin': require('../assets/Roboto-Thin.ttf'),
    'RobotoRegular': require('../assets/Roboto-Regular.ttf'),
  };
  const [language, setLanguage] = useState('')
  const [fontsLoaded, setfFontsLoaded] = useState(false)
  const _loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setfFontsLoaded(true);
  }
  _loadFontsAsync()
  const headerHeight = useHeaderHeight();
  
    getTokenData = async () => {
        try {
            tokenData = await AsyncStorage.getItem('token')
            return tokenData
        } catch(e) {
            console.log('error', e)
        }
      }
      const male = require('../images/male.png')
      const missH = require('../images/missh/missH.jpg')
      const roulette = require('../images/roulette/roulette.jpg')
      const tarot = require('../images/tarot/XOBP4354.jpg')
      // const pirates = require('../images/pirates/HPBR3932.jpg')
      const isFocused = useIsFocused();
      const [currentPage, setCurrentPage] = useState(1);
      const [nextPageIsNull, setNextPageIsNull] = useState(false)
      const token = getTokenData()
      const [data, setData] = useState()
      const [loading, setLoading] = useState(false)
      const [loadingProfiles, setLoadingProfiles] = useState(false)
      const [sortLikes, setSortLikes] = useState(1)
      const [sortMatches, setSortMatches] = useState(0)
      const loadData = () => {
        setLoading(true)
        setData([{'id': 1, 'title': 'Miss Hourney', 'source': missH, 'navigate': 'MissHourney'},
                 {'id': 2, 'title': 'Coin case roulette', 'source': roulette, 'navigate': 'Roulette'},
                 {'id': 3, 'title': "Tarot", 'source': tarot, 'navigate': 'Tarot'},
                 {'id': 4, 'title': "Random converse", 'source': tarot, 'navigate': 'LobbyRandom'}
                ])
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
              loadData()
            }
          })
      }, [isFocused])

      useEffect(() => {
        props.navigation.setOptions({ title: language == 'English' ? 'Games' : 'Игры' })
      }, [language])

      
      const LoadMoreItem = () => {
        if (data.length > 9 && !nextPageIsNull && !loading) {
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

      const clickedItem = (destination) => {
        props.navigation.navigate(destination)
      }
    
      const renderData = (item) => {
        console.log('get', item)
        return(
        <View style={{width: '50%'}}>
        <TouchableOpacity style={styles.cardStyle} activeOpacity = {0.7} onPress = {() => {
            clickedItem(item.item['navigate'])
            }}>
          <View style={{flexDirection:"column", alignItems: 'center', width: '100%'}}> 
            <ImageBackground
              resizeMode='cover'
              style={{width:'100%', aspectRatio:1/1, overflow: 'hidden', borderColor: 'blue', borderRadius:35 }}
            >
              <Image
                style={{width:'100%', height:'100%'}}
                source={item.item['source']}
              />
              {/* <BlurView style={{ position: 'absolute', width: '60%', aspectRatio: 3/1, alignItems: 'center',
            borderRadius: 40, overflow: 'hidden', bottom: 15, left: 15,  backgroundColor: 'rgba(0, 0, 0, 0.2)',
            justifyContent: 'center', flexDirection: 'row' }}
            intensity={30}
          >
            <CircleStar width={15} height={15} fill='#fff' />
            <Text style={{ color: '#fff', fontSize: 12, marginLeft: 5 }}>Rating: {item.sender.age < 0 ? `${item.sender.rating}`
            : '??'}</Text>
          </BlurView> */}
            </ImageBackground>
            <View style={{marginTop: 5}}>
          <Text style = {{fontSize:15, color: '#fff', textAlign: 'center', fontFamily: 'RobotoRegular'}}>{item.item['title']}</Text>
        </View>
          </View>
        </TouchableOpacity>
        </View>
        )
      }
      if(loadingProfiles || !data) {
        return(
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#172136'
          }}>
            <ActivityIndicator/>
          </View>
        )
      };
      return (
        <View style = {{flex: 1, backgroundColor: '#172136'}}>
          <FlatList
          data={data}
          numColumns={2}
          contentContainerStyle={{justifyContent: 'flex-start', paddingTop: headerHeight, paddingHorizontal: 10}}
          renderItem = {(item) => {
            return renderData(item)
          }}
          windowSize = {data.length > 0 ? data.length : 30}
          keyExtractor = {item => `${item.id}`}
        //   onEndReached={LoadMoreItem}
          // onEndReachedThreshold={1}
          
        //   refreshControl = {
        //     <RefreshControl
        //       onRefresh = {() => loadData()}
        //       refreshing = {loadingProfiles}
        //       tintColor = {'#aaa'}
        //       // style = {{ opacity: 1, transform: [{ scale: 0.7 }]}}
        //     />
        //   }
        //   ListFooterComponent = {renderLoader}
          />
          {/* <TouchableOpacity
            style={{ width: 150, height: 40, backgroundColor: 'tomato' }}
            onPress={() => {
              Toast.show({
                type: 'tomatoToast',
                position: 'top',
                text1: 'Match!',
                text2: 'You have a new match f  fsd f sda fas df asd f sd fsda fdsafdsafsdafdsf dsf sda fasdfsadsa dsa d  asd  asd!',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 40,
                bottomOffset: 0,
                props: {userImage: 'https://bravo511.pythonanywhere.com/media/users/images/image_ch7VFH2.jpeg', screen: 'Likes'}
              })
            }}
          >
            <Text>Toast show</Text>
          </TouchableOpacity> */}
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

export default Games