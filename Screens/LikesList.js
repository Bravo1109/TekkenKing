import React, {useState, useEffect, useContext} from 'react'
import { Text, View, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator,
   ImageBackground, RefreshControl, Dimensions,
  Modal, Platform } from 'react-native'
import { useIsFocused } from "@react-navigation/native";
import {IconButton} from 'react-native-paper';
import Male from '../images/male.png'
import LikeHearts from '../images/likeHearts.png'
import Female from '../images/female.png'
import Dollar from '../images/dollar.png'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Location from '../images/location.svg'
import CircleStar from '../images/star_circle.svg'
import CheckMark from '../images/checkmarkShadows.svg'
import { BlurView } from 'expo-blur'
import { UnreadContext } from './UnreadContext';
import * as Font from 'expo-font';
import { BASE_URL } from './config';
import LottieView from 'lottie-react-native';

function LikesList(props) {
  const SCREEN_WIDTH = Dimensions.get('window').width
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
      const getUserData = async () => {
        try {
            let userData = await AsyncStorage.getItem('user')
            setUserId(userData)
            return userData
        } catch(e) {
            console.log('error', e)
        }
      }
      const bluredBg = require('../images/bluredRating.png')
      const nowDate = new Date();
      const [modal, setModal] = useState(false)
      const [language, setLanguage] = useState('')
      const [modalErr, setModalErr] = useState(false)
      const [errText, setErrText] = useState('')
      const [itemId, setItemId] = useState(0)
      const [userId, setUserId] = useState('0')
      const { hasMatches } = useContext(UnreadContext);
      const { hasLikes, setHasLikes } = useContext(UnreadContext);
      const [ matches, setMatches ] = useState(false)
      const [ newLikes, setNewLikes ] = useState(false)
      const male = Image.resolveAssetSource(Male).uri
      const likeOpenImage = Image.resolveAssetSource(LikeHearts).uri
      const [likes, setLikes] = useState('likes')
      const female = Image.resolveAssetSource(Female).uri
      const dollar = Image.resolveAssetSource(Dollar).uri
      const isFocused = useIsFocused();
      const [currentPage, setCurrentPage] = useState(1);
      const [nextPageIsNull, setNextPageIsNull] = useState(false)
      const token = getTokenData()
      const [data, setData] = useState([])
      const [loading, setLoading] = useState(true)
      const [loadingProfiles, setLoadingProfiles] = useState(true)
      const [sortLikes, setSortLikes] = useState(1)
      const [sortMatches, setSortMatches] = useState(0)
      const [lastLikeId, setLastLikeId] = useState(0)
      const [lastLikeDataId, setLastLikeDataId] = useState(0)
      const loadData = () => {
        if(!nextPageIsNull || currentPage === 1) {
        setLoading(true)
        fetch(`${BASE_URL}/api/${likes}/?limit=10&page=${currentPage}`, {
          method:"GET",
          headers: {
            'Authorization': `${token._j}`
          }
        }).then(resp => resp.json())
        .then(res => {
          // console.log('load', ...res.results)
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
          if (likes == 'likes') {
            if (res.results.length > 0) {
              setLastLikeDataId(res.results[0].id)
              
            }
          }
          
          setLoading(false)
          setLoadingProfiles(false)
        })
        .catch(error => {
          console.log("Error", error)
        })
      }}
      const openLike = () => {
        let status = 0
        fetch(`${BASE_URL}/api/likes/${itemId}/open/`, {
          method:"GET",
          headers: {
            'Authorization': `${token._j}`
          }
        }).then((res) => {
          status = res.status
          return res.json()
        }).then((resp) => {
          if (status == 200) {   
            loadOpenedData(itemId)
            setModal(false)
          } else if (status == 400) {
            setModal(false)
            let text = ''
            for (let i = 0; i < Object.keys(resp).length; i++) {
              const key = Object.keys(resp)[i];
              const value = Object.values(resp)[i];
              text += `${value} `
            }
            setErrText(text)
            setLoading(false)
            setModalErr(true)
          } else {
            setModal(false)
            alert('Something going wrong!')
            setLoading(false)
          }
        })
          
        .catch(error => {
          console.log('error', error)
          setLoading(false)
        })
      }


      const loadOpenedData = (id) => {
        if(!nextPageIsNull || currentPage === 1) {
        setLoading(true)
        fetch(`${BASE_URL}/api/likes/${id}/`, {
          method:"GET",
          headers: {
            'Authorization': `${token._j}`
          }
        }).then(resp => resp.json())
        .then(res => {
          // console.log('res', res)
          setData(prevData => {
            const index = prevData.findIndex(item => item.id === res.id);
            if (index !== -1) {
              // Replace the existing item with the new one.
              const updatedData = [...prevData];
              updatedData[index] = res;
              // console.log(updatedData);
              return updatedData;
            }})
          setLoading(false)
        })
        .catch(error => {
          console.log("Error", error)
        })
      }}


      const refreshData = () => {
        setLoading(true)
        fetch(`${BASE_URL}/api/${likes}/?limit=10&page=1`, {
          method:"GET",
          headers: {
            'Authorization': `${token._j}`
          }
        }).then(resp => resp.json())
        .then(res => {
          if (currentPage == 1) {
            if (res.next == null) {
              setNextPageIsNull(true)
            }
            else if (res.next != null) {
              setNextPageIsNull(false)
            }
          }
          let newData = [...data, ...res.results].filter((item, index, array) => {
            return array.findIndex(t => t.id === item.id) === index;
          });
          newData.unshift(...res.results)
          const uniqueData = [...newData].filter((item, index, array) => {
            return array.findIndex(t => t.id === item.id) === index;
          });
          setData(uniqueData)
          setLoading(false)
          setLoadingProfiles(false)
          // console.log(data)
        })
        .catch(error => {
          console.log("Error", error)
        })
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
        getTokenData()
        getUserData()
          .then(() => {
            if (isFocused) {
              loadData()
            }
          })
      }, [currentPage])

      useEffect(() => {
        getLanguageData()
      }, [isFocused])

      useEffect(() => {
        props.navigation.setOptions({ title: language == 'English' ? 'Likes' : 'Лайки', headerTitleStyle: {fontFamily: 'SftBold', fontSize: 20} })
      }, [language])

      useEffect(() => {
        getTokenData()
          .then(() => {
            if (isFocused) {
              refreshData()
            }
          })
      }, [isFocused])

      const writeLastLike = async (value) => {
        try {
          await AsyncStorage.setItem(`lastLike${userId}`, value)
        } catch(e) {
          console.log('error', e)
        }
        // console.log('Done', value)
      }
      const getLastLike = async () => {
        try {
          let likeData = await AsyncStorage.getItem(`lastLike${userId}`)
          // console.log('likedata', likeData)
          if(likeData != null) {
            setLastLikeId(parseInt(likeData))
            return '0'
          }
          else {
            setLastLikeId(0)
            return '0'
          }
        } catch(e) {
            console.log('error', e)
            setLastLikeId(0)
            return '0'
        }
      }
      useEffect(() => {
        getTokenData()
        getLastLike()
          .then(() => {
            if (!isFocused || sortLikes != 1) {
              if (data.length > 0 && data[0].is_mutually == false) {
                writeLastLike(data[0].id.toString())
                setHasLikes(false)
              }
            }
          })
      }, [isFocused, sortLikes])



      useEffect(() => {
        getTokenData()
          .then(() => {
            if (isFocused) {
              loadData()
            }
          })
      }, [likes])

      useEffect(() => {
        getTokenData()
          .then(() => {
            if (isFocused && userId != '0') {
              getLastLike()
            }
          })
      }, [userId])

      useEffect(() => {
          if (hasMatches == true) {
            setMatches(true)
          } else {
            setMatches(false)
          }
      }, [hasMatches])

      useEffect(() => {
        if (hasLikes == true) {
          setNewLikes(true)
        } else {
          setNewLikes(false)
        }
    }, [hasLikes])

      const LoadMoreItem = () => {
        if (data.length > 9 && !nextPageIsNull) {
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

      const clickedItem = (id) => {
        props.navigation.navigate("Profile", {id: id, data: id})
      }
    
      const renderData = (item) => {
        return(
        <View style={{width: '50%'}}>
        <TouchableOpacity style={styles.cardStyle} activeOpacity = {1} onPress = {() => {
          if (item.is_mutually === true || item.is_opened === true || item.premium) {
            clickedItem(item.sender)
          } else {
            setItemId(item.id)
            setModal(true)
          }
        }}>
          <View style={{flexDirection:"column", alignItems: 'flex-start', width: '100%'}}>
          {(item.is_mutually === true && item.sender.verified || item.is_opened === true && item.sender.verified) && <CheckMark width={35} height={35} style={{ position: 'absolute', zIndex: 1, right: -5, top: -5 }} />}
            <ImageBackground
              source={item.sender.photos.length == 0 ? item.sender.sex == 'male' ? {uri: male} : {uri: female} : {}}
              resizeMode='cover'
              blurRadius={item.is_mutually === true || item.is_opened === true ? 0 : 50}
              style={{width: '100%', aspectRatio: 1/1, overflow: 'hidden', borderColor: 'blue',
                      borderRadius: 35, backgroundColor: '#0F1825' }}
            >
              {item.is_mutually === true && item.viewed === false && <Text style={{ position: 'absolute', top: 15, right: 10, zIndex: 10, fontSize: 17,
              fontWeight: '600', fontFamily: 'SftBold', color: 'blue', transform: [{rotate: '40deg'}] }}>New</Text>}
              {item.is_mutually === false && item.id > lastLikeId && <Text style={{ position: 'absolute', top: 15, right: 10, zIndex: 10, fontSize: 17,
              fontWeight: '600', fontFamily: 'SftBold', color: 'blue', transform: [{rotate: '40deg'}] }}>New</Text>}
              
              {item.sender.photos.length != 0 && <ActivityIndicator
                style={{ position: 'absolute', width: '100%', height: '100%' }}
              />}
              {item.sender.photos.length != 0 ? <Image
                style={{width:'100%', height:'100%'}}
                
                source={{
                  uri: `${BASE_URL}${item.sender.photos[0].compressed_image_url}`
                }}
                blurRadius={item.is_mutually === true || item.is_opened === true || item.premium  ? 0 : 20}
              /> : <View></View> }
              <BlurView style={{ position: 'absolute', alignItems: 'center',
            borderRadius: 40, overflow: 'hidden', bottom: 15, left: 15,  backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
              source={item.sender.photos.length > 0 ? {uri: `${BASE_URL}${item.sender.photos[0].compressed_image_url}`}: bluredBg}
              blurRadius={20}
            />}
            {Platform.OS === 'android' && <View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            />}
            <View style={{  flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12 }}>
            <CircleStar width={15} height={15} fill='#fff' />
            <Text style={{ color: '#fff', fontSize: 12, marginLeft: 5, fontFamily: 'SftMedium' }}>Rating: {item.is_mutually === true || item.is_opened === true || item.premium ? `${item.sender.rating}`
            : '??'}</Text>
            </View>
          </BlurView>
            </ImageBackground>
            <View style={{marginTop: 5}}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
          {item.is_mutually === true || item.is_opened === true || item.premium ? <Text
           numberOfLines={1}
           style = {{fontSize:15, color: '#fff', fontFamily: 'SftMedium', marginRight: 2}}>{item.sender.name.length < 15
              ? `${item.sender.name}`
              : `${item.sender.name.substring(0, 13)}...`}, {item.sender.age}</Text>
            : <Text style = {{fontSize:15, color: '#fff', fontFamily: 'SftMedium', marginRight: 2}}>???</Text>
            }
         {((nowDate - new Date(item.sender.last_seen)) / 60 / 1000) < 15 && <View
            style={{ backgroundColor: '#65B141', width: 7, aspectRatio: 1/1, borderRadius: 100, marginLeft: 5 }}
          ></View>}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Location width={15} height={15} fill='#A1AAB1' />
            {item.is_mutually === true || item.is_opened === true || item.premium ? <Text style={{ fontSize:12, color: '#A1AAB1', marginLeft: 5, fontFamily: 'SftMedium' }}>{language == 'English' ? item.sender.city.name_eng : item.sender.city.name}</Text> :
              <Text
               numberOfLines={1}
               style={{ fontSize:12, color: '#A1AAB1', marginLeft: 5, fontFamily: 'SftMedium' }}>???</Text>
            }
          </View>
          
        </View>
          </View>
        </TouchableOpacity>
        </View>
        )
      }
      if(!data) {
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 10  }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%'}}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}
      onPress={() => {
        if (sortLikes != 1) {
          setSortLikes(1)
          setSortMatches(0)
          setLikes('likes')
          setLoadingProfiles(true)
          setCurrentPage(1)
        }
        }}>
      <Text
        style={[sortLikes == 1 ? { color: '#fff'} : {color: '#818C99'}, {fontSize: 17, padding: 5, fontFamily: 'SftMedium'}]}
      >{language == 'English' ? 'Likes' : 'Лайки'}</Text>
      {newLikes && <View style={{ width: 7, height: 7, backgroundColor: 'yellow', borderRadius: 100 }} />}
      </TouchableOpacity>
      <View
        style={[{ width: '90%', height: 2, borderRadius: 100 }, sortLikes == 1 ? {backgroundColor: '#3F8AE0'} : {backgroundColor: 'transparent'}]}
      ></View>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%'}}>
      <TouchableOpacity
      activeOpacity={1}
      style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}
      onPress={() => {
        if (sortLikes == 1) {
        setSortLikes(0)
        setSortMatches(1)
        setLikes('matches')
        setLoadingProfiles(true)
        setCurrentPage(1)
        }
        }}>
      <Text
        style={[sortMatches == 1 ? {  color: '#fff' } : {color: '#818C99'}, {fontSize: 17, padding: 5, fontFamily: 'SftMedium'}]}
      >{language == 'English' ? 'Matches' : 'Мэтчи'}</Text>
      {matches && <View style={{ width: 7, height: 7, backgroundColor: 'yellow', borderRadius: 100 }} />}
      </TouchableOpacity>
      <View
        style={[{ width: '90%', height: 2, borderRadius: 100 }, sortMatches == 1 ? {backgroundColor: '#3F8AE0'} : {backgroundColor: 'transparent'}]}
      ></View>
      </View>
      </View>
      {(!loadingProfiles || !loading) ? <View style={{ flex: 1 }}>
          {data.length > 0 ? (<FlatList
          data={data}
          numColumns={2}
          contentContainerStyle={{justifyContent: 'flex-start', paddingTop: 10, paddingHorizontal: 10}}
          renderItem = {({item}) => {
            return renderData(item)
          }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          // windowSize = {data.length > 0 ? data.length : 30}
          windowSize = {7}
          keyExtractor = {item => `${item.id}`}
          onEndReached={LoadMoreItem}
          // onEndReachedThreshold={1}
          
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
              // style = {{ opacity: 1, transform: [{ scale: 0.7 }]}}
            />
          }
          ListFooterComponent = {renderLoader}
          />) : (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#172136'}}>
          <Text style={{ fontSize: 25, color: '#fff', fontFamily: 'SftMedium' }}>{language == 'English' ? 'You have no new' : 'У вас нет новых'} {likes}</Text>
          </View>)}
          </View> : 
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#172136'
          }}>
            {/* <ActivityIndicator/> */}
            <LottieView
              source={require('../animation/anim_glasses.json')}
              style={{width: 100, height: 100 }}
              loop={true}
              autoPlay={true}
              // renderMode='SOFTWARE'
              speed={1}
            />
          </View>}
          <Modal
        transparent={true}
        animationType='fade'
        visible={modal}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setItemId(0)
            setModal(false)
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
            width: SCREEN_WIDTH * 0.9,
            minHeight: SCREEN_WIDTH * 0.9,
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
              setItemId(0)
              setModal(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'Do you want to open this like' : 'Вы хотите открыть этот лайк'}?</Text>
            <Image
              source={{uri: likeOpenImage}}
              style={{ height: SCREEN_WIDTH * 0.9 * 0.5, aspectRatio: 1/0.8, overflow: 'visible' }}
            />
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setLoading(true)
              openLike()
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{language == 'English' ? 'Open' : 'Открыть'}</Text>
            <Image source={{uri: dollar}} style={{ width: 25, aspectRatio: 1/1 }} />
              <Text
                style={{ marginLeft: 5, fontSize: 20, color: '#fff', fontFamily: 'SftMedium' }}
              >50 cash</Text>
          </TouchableOpacity>
          </View>
          {/* <TouchableOpacity
            onPress={() => {
              setLoading(true)
              openLike()
            }}
            style={{
                height: 50,
                width: '100%',
                backgroundColor: 'tomato',
                borderRadius: 0,
                justifyContent: 'center',
                borderWidth: 0,
            }}
          ><Text style={{fontSize: 20, textAlign: 'center', color: '#fff', fontFamily: 'SftMedium'}}>Open</Text></TouchableOpacity> */}
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

        <Modal
        transparent={true}
        animationType='fade'
        visible={modalErr}
        statusBarTranslucent={true}
    >
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
              >{language == 'English' ? 'Not enough cash!' : 'Не достаточно средств'}</Text>
            <View style={{
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20,
              flexWrap: 'wrap', paddingHorizontal: 5
            }}>
              <Text
                style={{ textAlign: 'center', fontSize: 17, color: '#818C99', fontFamily: 'SftMedium' }}
              >{errText}</Text>
              <Image source={{uri: dollar}} style={{ width: 20, aspectRatio: 1/1, marginLeft: 5 }} />
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

export default LikesList