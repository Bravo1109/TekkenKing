import React, {useState, useEffect, useContext} from 'react'
import { Text, View, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ImageBackground,
  ScrollView, Dimensions } from 'react-native'
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useHeaderHeight } from '@react-navigation/elements';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { UnreadContext } from './UnreadContext';
import { BlurView } from 'expo-blur';

function SelectionScreen(props) {
  let customFonts = {
    'RobotoMedium': require('../assets/Roboto-Medium.ttf'),
    'RobotoBold': require('../assets/Roboto-Bold.ttf'),
    'RobotoLight': require('../assets/Roboto-Light.ttf'),
    'RobotoThin': require('../assets/Roboto-Thin.ttf'),
    'RobotoRegular': require('../assets/Roboto-Regular.ttf'),
  };
  const SCREEN_HEIGHT = Dimensions.get('window').height
  const SCREEN_WIDTH = Dimensions.get('window').width
  const { hasLobby, hasAlfredMes, hasPartyRequests, hasAcceptedPartyRequests } = useContext(UnreadContext);
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
      const roulette = require('../images/roulette/roulette.jpg')
      const tarot = require('../images/tarot/tarot.jpg')
      const goods = require('../images/goodss.jpg')
      const stores = require('../images/tekken.png')
      const staff = require('../images/staff.jpeg')
      const isFocused = useIsFocused();
      const [currentPage, setCurrentPage] = useState(1);
      const [nextPageIsNull, setNextPageIsNull] = useState(false)
      const token = getTokenData()
      const [data, setData] = useState([])
      const [dataNext, setDataNext] = useState([])
      const [dataVertical, setDataVertical] = useState([])
      const [dataHorizontal, setDataHorizontal] = useState([])
      const [loading, setLoading] = useState(false)
      const [loadingProfiles, setLoadingProfiles] = useState(false)
      const [sortLikes, setSortLikes] = useState(1)
      const [sortMatches, setSortMatches] = useState(0)
      const loadData = () => {
        setLoading(true)
        setData([{'id': 0, 'title': 'Tekken', 'titleRussian': 'Tekken', 'source': stores, 'navigate': 'BattleHistoryStack'},
                //  {'id': 1, 'title': 'Open case', 'titleRussian': 'Открыть кейс', 'source': roulette, 'navigate': 'Roulette'},
                //  {'id': 2, 'title': "Dating News", 'titleRussian': 'Дейт Новости', 'source': datingNews, 'navigate': 'DatingNewsStack'},
                //  {'id': 3, 'title': "Random converse", 'titleRussian': 'Случайный диалог', 'source': randomConverse, 'navigate': 'LobbyRandom'},
                //  {'id': 4, 'title': "Tarot", 'titleRussian': 'Таро', 'source': tarot, 'navigate': 'Tarot'},
                //  {'id': 5, 'title': "Alfred", 'titleRussian': 'Альфред', 'source': ratingAlfred, 'navigate': 'AlfredRating'},
                //  {'id': 6, 'title': "Miss Hourney", 'source': missH, 'navigate': 'MissHourney'}
                ])
        setDataNext([
          // {'id': 4, 'title': "Tarot", 'titleRussian': 'Таро', 'source': tarot, 'navigate': 'Tarot'},
          // {'id': 5, 'title': 'Open case', 'titleRussian': 'Открыть кейс', 'source': roulette, 'navigate': 'Roulette'}
        ])
        setDataVertical([
          // {'id': 6, 'title': "Goods", 'titleRussian': 'Товары', 'source': goods, 'navigate': 'CompaniesStack'}
        ])
        setDataHorizontal([
          // {'id': 7, 'title': "Staff", 'titleRussian': 'Персонал', 'source': staff, 'navigate': 'RatingStack'}
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

      const clickedItem = (item) => {
        if (item['navigate'] != '') {
          props.navigation.navigate(item['navigate'], {data: item})
        }
      }

      useEffect(() => {
        props.navigation.setOptions({ title: language == 'English' ? 'Red pill' : 'Red pill', headerTitleStyle: {fontFamily: 'SftBold', fontSize: 20} })
      }, [language])
    
      const renderData = (data) => {

        return data.map((item, i) => {
            return(
        <View
          style={item.id != 0 && item.id != 7 ? {width: '50%'} : {width: '100%'}}
          key={item.id}
          >
        <TouchableOpacity style={styles.cardStyle} activeOpacity = {0.7} onPress = {() => {
            clickedItem(item)
            }}>
          <View style={{flexDirection:"column", alignItems: 'center', width: '100%'}}>
            {(item.id == 3 && hasLobby || item.id == 5 && hasAlfredMes) && <View
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
                source={item.source}
            >
              
            </ImageBackground>
            </View>}
            <ImageBackground
              resizeMode='cover'
              style={[{width:'100%',  overflow: 'hidden', borderColor: 'blue',
               borderRadius:35 }, item.id%3 != 0 ? {aspectRatio: 1/1} : {aspectRatio: 2/1}]}
            >
              <Image
                style={{width:'100%', height:'100%'}}
                source={item.source}
              />
              <View
                style={{ height: 100, width: '100%', zIndex: 1000,
                        position: 'absolute', bottom: 0, justifyContent: 'flex-end' }}
              >
                <LinearGradient
              colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']}
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
            <Text style = {[{color: '#fff', textAlign: 'center', fontFamily: 'SftBold',
                            bottom: 20}, (item.id != 0 && item.id != 7) ? {fontSize:15} : {fontSize: 25 }]}>{language == 'English' ? item.title: item.titleRussian}</Text>
              </View>
            </ImageBackground>
            {/* <View style={{marginTop: 5}}>
        </View> */}
          </View>
        </TouchableOpacity>
        </View>)
        })
      }

      const renderNextData = (nextData) => {

        return nextData.map((item, i) => {
            return(
        <View
          style={{width: '100%'}}
          key={item.id}
          >
        <TouchableOpacity style={styles.cardStyle} activeOpacity = {0.7} onPress = {() => {
            clickedItem(item['navigate'])
            }}>
          <View style={{flexDirection:"column", alignItems: 'center', width: '100%'}}>
          {(item.id == 3 && hasLobby || item.id == 5 && hasAlfredMes || item.id == 6 && hasPartyRequests.length > 0 || item.id == 6 && hasAcceptedPartyRequests.length > 0) && <View
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
                source={item.source}
            >
              
            </ImageBackground>
            </View>}
            <ImageBackground
              resizeMode='cover'
              style={[{width:'100%',  overflow: 'hidden', borderColor: 'blue',
               borderRadius:35 }, item.id == 6 ? {height: (SCREEN_WIDTH / 2 - 9) * 2} : {aspectRatio: 1/1}]}
            >
              <Image
                style={{width:'100%', height:'100%'}}
                source={item.source}
              />
              <View
                style={{ height: 100, width: '100%', zIndex: 1000,
                        position: 'absolute', bottom: 0, justifyContent: 'flex-end' }}
              >
                <LinearGradient
              colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']}
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
            <Text style = {[{color: '#fff', textAlign: 'center', fontFamily: 'SftBold',
                            bottom: 20}, {fontSize: 15 }]}>{language == 'English' ? item.title: item.titleRussian}</Text>
              </View>
            </ImageBackground>
            {/* <View style={{marginTop: 5}}>
        </View> */}
          </View>
        </TouchableOpacity>
        </View>)
        })
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
        <View style = {{flex: 1, backgroundColor: '#172136', paddingTop: headerHeight}}>
          {/* <FlatList
          data={data}
          numColumns={2}
          contentContainerStyle={{justifyContent: 'flex-start', paddingHorizontal: 10}}
          renderItem = {(item) => {
            return renderData(item)
          }}
          windowSize = {data.length > 0 ? data.length : 30}
          keyExtractor = {item => `${item.id}`}
          /> */}
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <View
                style={{ flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 90 }}
            >
                {renderData(data)}
                <View
                  style={{ width: '50%' }}
                >
                  {renderNextData(dataVertical)}
                </View>
                <View
                  style={{ width: '50%' }}
                >
                  {renderNextData(dataNext)}
                </View>
                {renderData(dataHorizontal)}
            </View>
          </ScrollView>
         </View>
      )
}

const styles = StyleSheet.create({
    cardStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 9,
        width: '100%'
    },
})

export default SelectionScreen