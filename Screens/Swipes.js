import React from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, PanResponder,
         ActivityIndicator, ImageBackground, Modal,
         TouchableOpacity, ScrollView, Platform, AppState } from 'react-native';
import { Image as ImageRN } from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { openBrowserAsync } from 'expo-web-browser';
import { LinearGradient } from 'expo-linear-gradient';
import { IconButton } from 'react-native-paper';
import * as Font from 'expo-font';
import { BlurView } from 'expo-blur'
import CircleStar from '../images/star_circle.svg'
import CheckMark from '../images/checkmark.svg'
import Location from '../images/location.svg'
import FilterSettings from '../images/filter_settings.svg'
import Boosts from '../images/boost.svg'
import RangeSlider from './RangeSlider';
import { gestureHandlerRootHOC, GestureHandlerRootView } from 'react-native-gesture-handler';
import ParamsContext from './ParamsContext';
import * as Haptics from 'expo-haptics';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import LottieView from 'lottie-react-native';
// import { Video } from 'expo-av';
import { BASE_URL } from './config';
import ArrowLeft from '../images/turnBack.svg'
import * as Device from 'expo-device';
import Glasses from '../images/glassesSwipes.svg'
import { UnreadContext } from './UnreadContext';


let customFonts = {
  'RobotoFlex': require('../assets/RobotoFlex.ttf'),
  'RobotoMedium': require('../assets/Roboto-Medium.ttf'),
  'RobotoBold': require('../assets/Roboto-Bold.ttf'),
  'RobotoLight': require('../assets/Roboto-Light.ttf'),
  'RobotoThin': require('../assets/Roboto-Thin.ttf'),
  'RobotoRegular': require('../assets/Roboto-Regular.ttf'),
  'SftBold': require('../assets/SFTSchriftedSans-ExtraBoldComp.ttf'),
  'SftLight': require('../assets/SFTSchriftedSans-ExtraLightComp.ttf'),
  'SftMedium': require('../assets/SFTSchriftedSans-MediumComp.ttf')
};
// let onScrollEnd = (e) => {
//   let pageNum = Math.floor(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width)
//   setPageNumber(pageNum + 1)
// }
const bluredBg = require('../images/bluredProfile.png')
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const MIN_DEFAULT = 18
const MAX_DEFAULT = 60
const nowDate = new Date()
const ExampleWithHoc = gestureHandlerRootHOC(() => (
  <View>
    <RangeSlider sliderWidth={SCREEN_WIDTH - 40} min={MIN_DEFAULT} max={MAX_DEFAULT} step={1} startPos={this.state.age_from._j} endPos={this.state.age_to._j} onValueChange={(range) => {
            this.setState({age_from: {_z: range.min}, age_to: {_z: range.max}})
    }} />
  </View>
  )
)
// const renderGallery = (item) => {
//   return(
//   <View style={{ width: SCREEN_WIDTH, height: '100%' }}>
//     <TouchableOpacity
//       onPress={() => {
//         console.log('pressed')
//       }}
//       activeOpacity={1}
//     >
//         <ImageBackground
//           source={(item.sex == 'male' ? {uri: male} : {uri: female})}
//           resizeMode='contain'
//           style={{flex: 1, height: null, width: null, overflow: 'hidden', backgroundColor: '#aaa'}}
//           >
//             <Image
//               style={{width:'100%', height:'100%', backgroundColor: '#aaa'}}
//               source={{
//                 uri: `${item.photo.slice(0, -5) + '.full.jpeg'}`
//               }}
              
//             />
//         </ImageBackground>
//       </TouchableOpacity>
//     </View>
//   )
// }

class Swipes extends React.Component {
    static contextType = ParamsContext;
    
    
    getTokenData = async () => {
        try {
            tokenData = await AsyncStorage.getItem('token')
            return tokenData
        } catch(e) {
            console.log('error', e)
        }
    }
    writeAgeFrom = async (value) => {
      try {
          await AsyncStorage.setItem('ageFrom', value)
      } catch(e) {
          console.log('error', e)
      }
      console.log('Done', value)
    }
    getAgeFrom = async () => {
      try {
          let ageFromData = await AsyncStorage.getItem('ageFrom')
          if(ageFromData != null) {
            return ageFromData
          }
          else {
            return 18
          }
      } catch(e) {
          console.log('error', e)
          return 18
      }
    }
    writeAgeTo = async (value) => {
      try {
          await AsyncStorage.setItem('ageTo', value)
      } catch(e) {
          console.log('error', e)
      }
      console.log('Done', value)
    }
    getAgeTo= async () => {
      try {
          let ageToData = await AsyncStorage.getItem('ageTo')
          if(ageToData != null) {
            return ageToData
          }
          else {
            console.log('ageT', ageToData)
            return 30
          }
      } catch(e) {
          console.log('error', e)
          return 30
      }
    }
    getGender = async () => {
      try {
          let genderData = await AsyncStorage.getItem('chooseGender')
          if(genderData != null) {
            return genderData
          }
          else {
            console.log('genderD', genderData)
            return 'all'
          }
      } catch(e) {
          console.log('error', e)
          return 30
      }
    }

    writeTutorialSwipes = async () => {
      try {
          await AsyncStorage.setItem('tutorialSwipes1', 'false')
      } catch(e) {
          console.log('error', e)
      }
      console.log('Done')
    }
    getTutorialSwipes = async () => {
      try {
          let tutorialSwipesData = await AsyncStorage.getItem('tutorialSwipes1')
          if(tutorialSwipesData != null) {
            if (tutorialSwipesData === 'true') {
              return true
            } else {
              return false
            }
          }
          else {
            return true
          }
      } catch(e) {
          console.log('error', e)
          return 18
      }
    }

    getLanguageData = async () => {
      try {
          const languageData = await AsyncStorage.getItem('language')
          console.log(languageData)
          // languageData != null ? this.setState({language: languageData}) : this.setState({language: 'English'})
          return languageData
      } catch(e) {
          setLanguage('Russian')
          console.log('error', e)
      }
    }

    clickedItem = (id) => {
      this.setState({ logoOpacity: 0 })
      this.props.navigation.navigate("Profile", {id: id, swipes: {'swipes': true}, data: this.state.data[this.state.currentIndex]})
    }
    
    onScrollEnd = (e) => {
      let pageNum = Math.floor(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width)
      this.setState({pageNumber: pageNum + 1})
      console.log(this.state.pageNumber)
    }
    loadData = () => {
      const { setHasBoostsToTop } = this.context
      this.setState({loading: true})
      console.log('load')
        fetch(`${BASE_URL}/api/swipes/?age_from=${this.state.age_from._j}&age_to=${this.state.age_to._j}&gender=${this.state.gender._j}&limit=20`, {
          method:"GET",
          headers: {
            'Authorization': `${this.token._j}`
          }
        }).then(resp => resp.json())
        .then(res => {
          this.setState({data: [...res.results]})
          this.setState({loading: false})
          this.updateUserId()
          setHasBoostsToTop(res.my_boosts_qty)
        }).then(res => {
          if (!this.state.translateAnimationStarted) {
            this.setState({ translateAnimationStarted: true })
            this.translateAnimationBg()
          }
          this.loadAdv()
        })
        .catch(error => {
          console.log("Error", error)
          console.log(this.state.age_from)
        })
    }
    ListItem = ({ text }) => {
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
            marginLeft: 10, marginRight: 5, fontSize: 15, color: '#fff', lineHeight: 20
          }}>{text}</Text>
        </View>
      );
    };

    recieveRating = () => {
      let status = 0
      this.setState({loading: true})
      fetch(`${BASE_URL}/api/get_rating/one_t/`, {
        method:"GET",
        headers: {
          'Authorization': `${this.token._j}`
        }
      }).then(resp => {
        status = resp.status
        return resp.json()
      })
      .then(res => {
        if(status == 200) {
          this.setState({modalBuyRatingGot: 1})
          this.setState({loading: false})
        } else if(status == 400) {
          this.setState({errType: 1})
          this.setState({modalBuyRating: false})
          let text = ''
          for (let i = 0; i < Object.keys(res).length; i++) {
            const key = Object.keys(res)[i];
            const value = Object.values(res)[i];
            text += `${value} `
          }
          this.setState({errText: text})
          this.setState({loading: false})
          this.setState({modalErr: true})
        }
      })
      .catch(error => {
        console.log("Error", error)
      })
    }

    useBoostToTop = () => {
      const { setHasBoostsToTop } = this.context
      let status = 0
      this.setState({loading: true})
      console.log('load')
        fetch(`${BASE_URL}/api/boosts/top_raise/`, {
          method:"GET",
          headers: {
            'Authorization': `${this.token._j}`
          }
        }).then(resp => {
          status = resp.status
          return resp.json()
        }).then(res => {
          if(status == 200) {
            if (res.message == 1) {
              this.setState({modalToTheTopGot: 1})
              setHasBoostsToTop(res.boosts_qty)
              this.setState({loading: false})
            } else if (res.message == 2) {
              this.setState({errType: 2})
              setHasBoostsToTop(res.boosts_qty)
              this.setState({modalToTheTop: false})
              let text = this.state.language._j == 'English' ? 'You are already on top' : 'Ты уже в топе!'
              this.setState({errText: text})
              this.setState({loading: false})
              this.setState({modalErr: true})
            } else if (res.message == 3) {
              this.setState({errType: 2})
              setHasBoostsToTop(res.boosts_qty)
              this.setState({modalToTheTop: false})
              let text = this.state.language._j == 'English' ? 'Not enough users to use this boost' : 'Не достаточно пользователей, чтобы использовать этот бустер'
              this.setState({errText: text})
              this.setState({loading: false})
              this.setState({modalErr: true})
            }
          } else if(status == 400) {
            this.setState({errType: 2})
            this.setState({modalToTheTop: false})
            let text = this.state.language._j == 'English' ? 'You have no boosts to top' : 'У вас нет бустеров в наличии'
            this.setState({errText: text})
            this.setState({loading: false})
            this.setState({modalErr: true})
          }
        }).catch(error => {
          console.log("Error", error)
          this.setState({loading: false})
          alert('error')
        })
    }

    loadAdv = () => {
      console.log('loadadvvv')
        fetch(`${BASE_URL}/api/ads/`, {
          method:"GET",
          headers: {
            'Authorization': `${this.token._j}`
          }
        }).then(resp => resp.json())
        .then(res => {
          if (res.results.length > 0) {
            const index = Math.floor(Math.random() * res.results.length);
            const newItem = res.results[index];
            const newData = [...this.state.data];
            newData.splice(this.state.currentIndex + 6, 0, newItem);
            this.setState({data: newData})
          }
          this.setState({loading: false})
        })
        .catch(error => {
          console.log("Error", error)
          console.log(this.state.age_from)
        })
    }
    loadMoreAdv = () => {
      console.log('loadadvvv')
        fetch(`${BASE_URL}/api/ads/`, {
          method:"GET",
          headers: {
            'Authorization': `${this.token._j}`
          }
        }).then(resp => resp.json())
        .then(res => {
          if (res.results.length > 0) {
            const index = Math.floor(Math.random() * res.results.length);
            const newItem = res.results[index];
            const newData = [...this.state.data];
            newData.splice(this.state.currentIndex + 10, 0, newItem);
            this.setState({data: newData})
          }
          this.setState({loading: false})
        })
        .catch(error => {
          console.log("Error", error)
          console.log(this.state.age_from)
        })
    }
    loadMoreData = () => {
      let resValue = 0
      console.log('loadMore')
        fetch(`${BASE_URL}/api/swipes/?age_from=${this.state.age_from._j}&age_to=${this.state.age_to._j}&gender=${this.state.gender._j}&limit=20`, {
          method:"GET",
          headers: {
            'Authorization': `${this.token._j}`
          }
        }).then(resp => resp.json())
        .then(res => {
          this.setState(prevState => {
            const newData = [...prevState.data];
          
            res.results.forEach(item => {
              if (item.image !== undefined) {
                // Добавляем элементы с изображением без проверки на дублирование id
                newData.push(item);
              } else if (!prevState.data.some(dataItem => dataItem.id === item.id)) {
                // Для элементов без изображения добавляем, если такого id нет в data
                newData.push(item);
              }
            });
          
            return { data: newData };
          });
          this.setState({loading: false})
          resValue = res.count
        }).then(res => {
          if(resValue > 10) {
            this.loadMoreAdv()
          }
        })
        .catch(error => {
          console.log("Error", error)
        })
    }
    sendLike = async (id, tokens, listIndex) => {
        let status = 0
        await fetch(`${BASE_URL}/api/users/${id}/like/create/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${this.token._j}`
            }
        }).then((res) => {
          if(res.status == 201) {
            status = 201
            return res.json()
          }
        }).then((resp) => {
          console.log('id: ', id)
          console.log('swipes_photos: ', resp.sender.photos[0])
          if (status == 201) {
            if (resp.is_mutually == false) {
              // {resp.sender.photos.length > 0 && this.sendPushNotification(tokens[i], id, 'New Like!', 'Somebody liked you', (`${BASE_URL}` + resp.sender.photos[0].compressed_image_url), 50, 'Likes')}
            } else {
              // {resp.sender.photos.length > 0 && this.sendPushNotification(tokens[i], id, 'Match!', 'You have a new match!', (`${BASE_URL}` + resp.sender.photos[0].compressed_image_url), 0, 'Likes')}
              {resp.recipient_photo != null && Toast.show({
                type: 'tomatoToast',
                position: 'top',
                text1: 'Match!',
                text2: 'You have a new match!',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 40,
                bottomOffset: 0,
                props: {userImage: `${BASE_URL}` + resp.recipient_photo, screen: 'Likes'}
              })}
            }
        }
          if(this.state.data.length - listIndex == 7) {
            this.loadMoreData() 
          }
        })
      }

      // async sendPushNotification(token, id, title, body, photo, blur, screen) {
      //   const message = {
      //     to: 'ExponentPushToken[S173PYN94WQXYlY_3w9hYv]',
      //     sound: 'default',
      //     title: 'Original Title',
      //     body: 'And here is the body!',
      //     data: { recipient_id: id, screen: screen },
      //   };
      
      //   await fetch('https://exp.host/--/api/v2/push/send', {
      //     method: 'POST',
      //     headers: {
      //       'Accept': 'application/json',
      //       'Host': 'exp.host',
      //       'Accept-encoding': 'gzip, deflate',
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       to: token,
      //       body: body,
      //       title: title,
      //       data: {recipient_id: id, userPhoto: photo, blur: blur, screen: screen}
      //     }),
      //   });
      // }

      myFunction = () => {
        console.log('Вызвана функция из другого экрана');
      };


      sendDislike = async (id, listIndex) => {
        console.log('Dislike')
        console.log(this.state.data.length, listIndex, this.state.currentIndex)
        await fetch(`${BASE_URL}/api/users/${id}/dislike/create/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${this.token._j}`
            }
        }).then(() => {
          if(this.state.data.length - listIndex == 7) {
            this.loadMoreData()
          }
        })
      }

      

  constructor() {
    super()
    this.animation = React.createRef();
    this.animationDislike = React.createRef();
    this.androidAnimation = React.createRef();
    this.timeRef = React.createRef(null)
    this.timeAnimRef = React.createRef(null)
    this.timeRefLogo = React.createRef(null)
    // this.progress = React.createRef(new Animated.Value(0));
    this.renderGallery = (item,  forward=true) => {
      let data = item
      if (item.length > 0) {
      return item.map((item, i) => {
        if (forward) {
        return(
      <View
      key={item.id}
      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 50, position: 'absolute', top: 0 }}>
        <View
        style={{ position: 'absolute', height: SCREEN_HEIGHT - 270, alignSelf: 'flex-end',
         borderRadius: 50, zIndex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}
        >
        {data.map((it, idx) => {
          return(
          <Animated.View
          key={it.id}
          style={[{margin: 4, marginRight: 15,
           borderRadius: 50, zIndex: 1, opacity: this.state.forwardCard ? this.currentCardOpacity : this.currentCardOpacitySecond
          }, idx == this.state.photoIndex ? {backgroundColor: '#4525EB', width: 15, height: 15, borderWidth: 4, borderColor: '#fff'} : {backgroundColor: 'rgba(255, 255, 255, 0.53)', width: 10, height: 10}]}
        />
          ) 
        })}
        </View>
        {/* <TouchableOpacity
          style={{
            position:'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '100%',
            zIndex: 1000
          }}
          onPress={() => {
            if (i > 0) {
              Haptics.impactAsync(
                Haptics.ImpactFeedbackStyle.Light
              )
              this.setState({ photoIndex: this.state.photoIndex - 1 })
            } else {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              )
            }
          }}
        >
        </TouchableOpacity> */}
        {/* <TouchableOpacity
        style={{
          position:'absolute',
          width: '50%',
          top: 0,
          right: 0,
          height: '100%',
          zIndex: 1000
        }}
        onPress={() => {
          if (i < data.length - 1) {
            Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Light
            )
            this.setState({ photoIndex: this.state.photoIndex + 1 })
          } else {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            )
          }
        }}
        >
          
        </TouchableOpacity> */}
        <TouchableOpacity
          style={{width: '100%', height: '100%'}}
          // onPress={() => {
          //   this.clickedItem({'id' : id})
          // }}
          activeOpacity={1}
        >
            <ImageBackground
              // source={(item.sex == 'male' ? {uri: male} : {uri: female})}
              resizeMode='contain'
              style={{flex: 1, height: null, width: null, overflow: 'hidden'}}
              >
                {/* <Animated.View
                  style={{
                    position: 'absolute',
                    width: '100%', 
                    height: '100%',
                    top: 0,
                    left: 0,
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: this.currentIndicatorOpacity
                  }}
              >
                  <ActivityIndicator />
              </Animated.View> */}
              {data.map((it, idx) => {
                return(
                  <Animated.View
                  key={idx}
                  style={[{width:'100%', height:'100%', position: 'absolute', backgroundColor: '#CCCCCC',
                    opacity: this.state.forwardCard ? this.currentCardOpacity : this.currentCardOpacitySecond},
                   idx != this.state.photoIndex && {opacity: 0}]}
                  >
                <Animated.View
                  style={{ width: 200, height: SCREEN_HEIGHT * 1.5, position: 'absolute',
                     bottom: -SCREEN_HEIGHT * 0.5, left: -SCREEN_WIDTH,
                      transform: [{ rotateZ: '-25deg' }, {translateX: this.state.translateAnimation}],
                    opacity: this.AnimBgOpacity}}
                >
                    <LinearGradient
              colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.4);', 'rgba(255, 255,255, 0)']}
              start={{
                x:1,
                y:0
              }}
              end={{
                x:0,
                y:0
              }}
              style={{ width: '100%', height: '100%'}}
              />
              </Animated.View>
                <Animated.Image
                  // key={idx}
                  style={[{width:'100%', height:'100%',
                   opacity: this.state.forwardCard ? this.currentCardOpacity : this.currentCardOpacitySecond},
                  idx != this.state.photoIndex && {opacity: 0}]}
                  source={{
                    uri: `${BASE_URL}${it.compressed_image_url}`
                  }}
                />
                <Image
                  // key={idx}
                  style={[{width:'100%', height:'100%',
                   opacity: 0, zIndex: -10000}]}
                  source={{
                    uri: `${BASE_URL}${it.compressed_image_url}`
                  }}
                />
                
                </Animated.View>
                )})}
                {this.state.forwardImage + 2 <= this.state.data.length - 1 && this.state.data[this.state.forwardImage + 2].photos != undefined ? <Animated.Image
                  style={{width:'100%', height:'100%', backgroundColor: '#CCCCCC',
                   opacity: 0}}
                  source={{
                    uri: `${BASE_URL}${this.state.data[this.state.forwardImage + 2].photos[0].compressed_image_url}`
                  }}
                /> : this.state.forwardImage + 2 <= this.state.data.length - 1 && this.state.data[this.state.forwardImage + 2].image != undefined && <Animated.Image
                style={{width:'100%', height:'100%', backgroundColor: '#CCCCCC',
                 opacity: 0}}
                source={{
                  uri: `${BASE_URL}${this.state.data[this.state.forwardImage + 2].compressed_image_url}`
                }}
              /> }
                {this.state.backwardImage + 2 <= this.state.data.length - 1 && this.state.data[this.state.backwardImage + 2].photos != undefined ? <Animated.Image
                  style={{width:'100%', height:'100%', backgroundColor: '#CCCCCC',
                   opacity: 0}}
                  source={{
                    uri: `${BASE_URL}${this.state.data[this.state.backwardImage + 2].photos[0].compressed_image_url}`
                  }}
                /> : this.state.backwardImage + 2 <= this.state.data.length - 1 && this.state.data[this.state.backwardImage + 2].image != undefined && <Animated.Image
                style={{width:'100%', height:'100%', backgroundColor: '#CCCCCC',
                 opacity: 0}}
                source={{
                  uri: `${BASE_URL}${this.state.data[this.state.backwardImage + 2].compressed_image_url}`
                }}
              />}
            </ImageBackground>
          </TouchableOpacity>
        </View>
        )}
        else if (!forward) {
          return (
            <View
      key={item.id}
      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 50, position: 'absolute' }}>
        <View
        style={{ position: 'absolute', height: SCREEN_HEIGHT - 270, alignSelf: 'flex-end',
         borderRadius: 50, zIndex: 100, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}
        >
        {data.map((it, idx) => {
          return(
          <Animated.View
          key={it.id}
          style={[{margin: 4, marginRight: 15,
           borderRadius: 50, zIndex: 100, opacity: !this.state.forwardCard ? this.currentCardOpacity : this.currentCardOpacitySecond
          }, idx == this.state.backPhotoIndex ? {backgroundColor: '#4525EB', width: 15, height: 15, borderWidth: 4, borderColor: '#fff'} : {backgroundColor: 'rgba(255, 255, 255, 0.53)', width: 10, height: 10}]}
        />
          ) 
        })}
        </View>
        <TouchableOpacity
          style={{width: '100%', height: '100%'}}
          activeOpacity={1}
        >
            <ImageBackground
              resizeMode='contain'
              style={{flex: 1, height: null, width: null, overflow: 'hidden'}}
              >
                {data.map((it, idx) => {
                return(
                  <Animated.View
                  key={idx}
                  style={[{width:'100%', height:'100%', position: 'absolute',
                    opacity: this.state.currentIndex < this.state.data.length - 1 ? 1 : this.currentCardOpacity},
                    ]}
                  >
                  <Animated.View
                  style={{ width: 200, height: SCREEN_HEIGHT * 1.5, position: 'absolute',
                     bottom: -SCREEN_HEIGHT * 0.5, left: -SCREEN_WIDTH,
                      transform: [{ rotateZ: '-25deg' }, {translateX: this.state.translateAnimation}],
                    opacity: this.AnimBgOpacity}}
                >
                    {/* <LinearGradient
              colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.4);', 'rgba(255, 255,255, 0)']}
              start={{
                x:1,
                y:0
              }}
              end={{
                x:0,
                y:0
              }}
              style={{ width: '100%', height: '100%'}}
              /> */}
              </Animated.View>
                <Animated.Image
                  // key={idx}
                  style={[{width:'100%', height:'100%', backgroundColor: '#CCCCCC',
                           opacity: this.state.currentIndex < this.state.data.length - 1 ? 1 : this.currentCardOpacity},
                           idx != this.state.backPhotoIndex && {opacity: 0}]}
                  source={{
                    uri: `${BASE_URL}${it.compressed_image_url}`
                  }} 
                />
                <Image
                  // key={idx}
                  style={[{width:'100%', height:'100%',
                   opacity: 0, zIndex: -1000000}]}
                  source={{
                    uri: `${BASE_URL}${it.compressed_image_url}`
                  }}
                />
                </Animated.View>
                )})}
                <View
                  style={{
                    position: 'absolute',
                    width: '100%', 
                    height: '100%',
                    top: 0,
                    left: 0,
                    // backgroundColor: 'rgba(0, 0, 0, 0.1)'
                  }}
                />
            </ImageBackground>
          </TouchableOpacity>
        </View>
          )
        }
      })
    } else {
      if (forward == true) {
        return(
          <View
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'absolute', top: 0 }}
          >
            <TouchableOpacity
          style={{width: '100%', height: '100%'}}
          // onPress={() => {
          //   this.clickedItem({'id' : id})
          // }}
          activeOpacity={1}
        >
            <ImageBackground
              // source={(item.sex == 'male' ? {uri: male} : {uri: female})}
              resizeMode='contain'
              style={{flex: 1, height: null, width: null, overflow: 'hidden'}}
              >
                {/* <Animated.View
                  style={{
                    position: 'absolute',
                    width: '100%', 
                    height: '100%',
                    top: 0,
                    left: 0,
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: this.currentIndicatorOpacity
                  }}
              >
                  <ActivityIndicator />
              </Animated.View> */}
                <Animated.Image
                resizeMode={'contain'}
                  style={{width:'100%', height:'100%', backgroundColor: '#CCCCCC',
                   opacity: this.state.forwardCard ? this.currentCardOpacity : this.currentCardOpacitySecond}}
                  source={(item.sex == 'male' ? require('../images/male.png') : require('../images/female.png'))}
                />
            </ImageBackground>
          </TouchableOpacity>
          </View>
        )
      } else {
        return(
          <View
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'absolute', top: 0 }}
          >
            <TouchableOpacity
          style={{width: '100%', height: '100%'}}
          activeOpacity={1}
        >
            <ImageBackground
              resizeMode='contain'
              style={{flex: 1, height: null, width: null, overflow: 'hidden'}}
              >
                <Animated.Image
                  style={{width:'100%', height:'100%', backgroundColor: '#aaa', opacity: this.state.currentIndex < this.state.data.length - 1 ? 1 : this.currentCardOpacity}}
                  source={(item.sex == 'male' ? require('../images/male.png') : require('../images/female.png'))}
                  resizeMode={'contain'}
                />
                <View
                  style={{
                    position: 'absolute',
                    width: '100%', 
                    height: '100%',
                    top: 0,
                    left: 0,
                    // backgroundColor: 'rgba(0, 0, 0, 0.1)'
                  }}
                />
            </ImageBackground>
          </TouchableOpacity>
          </View>
        )
      }
    }
    }
    this.token = this.getTokenData()
    this.position = new Animated.ValueXY()
    this.state = {
      forwardCard: true,
      forwardImage: 0,
      backwardImage: 1,
      language: this.getLanguageData(),
      isDragging: true,
      currentIndex: 0,
      photoIndex: 0,
      backPhotoIndex: 0,
      modal: this.getTutorialSwipes(),
      fontsLoaded: false,
      age_from: this.getAgeFrom(),
      age_to: this.getAgeTo(),
      loading: true,
      gender: this.getGender(),
      checkMale: false,
      checkFemale: false,
      checkAll: true,
      data: [],
      fadeAnimation: new Animated.Value(250),
      fadeAnimationFinished: false,
      translateAnimationStarted: false,
      translateAnimation: new Animated.Value(0),
      minValue: 18,
      maxValue: 99,
      pageNumber: 1,
      pageList: 1,
      userId: 0,
      ad_link: '',
      processSwipe: false,
      currentSlide: 0,
      modalWallet: false,
      modalBuyRating: false,
      modalToTheTop: false,
      modalBuyPremium: false,
      modalBuyMuchRating: false,
      modalBuyRatingGot: 0,
      modalToTheTopGot: 0,
      modalBuyPremiumGot: 0,
      modalBuyMuchRatingGot: 0,
      modalErr: false,
      errText: '',
      errType: 1,
      logoOpacity: 1,
      appState: AppState.currentState
    };
    this.slides = [
      {
        video: require('../images/tutorial/videoTutorial/openProfile.mp4'),
        title: 'Нажми на нижнюю размытую область, чтобы перейти в профиль пользователя',
        titleEng : "Tap the blurred area at the bottom to view the user's profile.",
        progress: '20%',
      },
      {
        video: require('../images/tutorial/videoTutorial/swipeRight.mp4'),
        title: 'Свайпай вправо понравившихся пользователей!',
        titleEng : 'Swipe right on those you like!',
        progress: '40%',
      },
      {
        video: require('../images/tutorial/videoTutorial/swipeLeft.mp4'),
        title: 'Свайпай влево если пользователь тебя не впечатлил',
        titleEng : 'Swipe left if the user didn’t impress you.',
        progress: '60%',
      },
      {
        video: require('../images/tutorial/videoTutorial/photos.mp4'),
        title: 'Тапай по правому или левому краю экрана, чтобы листать фотографии пользователя',
        titleEng : "Tap on the right or left edge of the screen to browse through the user's photos.",
        progress: '80%',
      },
      {
        video: require('../images/tutorial/videoTutorial/settings.mp4'),
        title: 'Фильтруй пользователей по своим параметрам',
        titleEng : 'Filter users based on your preferences.',
        progress: '100%',
      },
    ];

    this.translateAnimationBg = () => {
      this.state.translateAnimation.setValue(0)
      Animated.timing(this.state.translateAnimation, {
        useNativeDriver: false,
        toValue: SCREEN_WIDTH * 3,
        duration: 1300,
      }).start(() => {
          console.log('focusedfocused')
          this.reload()
      })
      
    };

    this.reload = () => {
      if (this.props.navigation.isFocused()) {
        this.translateAnimationBg();
      } else {
        this.timeAnimRef.current = setTimeout(() => {
          clearTimeout(this.timeAnimRef.current);
          console.log('not translate');
          this.reload();
        }, 1300);
      }
    };
    
    this.translateIn = () => {
      this.state.fadeAnimation.setValue(250)
      Animated.timing(this.state.fadeAnimation, {
        useNativeDriver: false,
        toValue: 25,
        duration: 300,
      }).start(() => {
        this.setState({fadeAnimationFinished: true})
      })
      
    };

    this.likeRight = () => {
      this.setState({ processSwipe: true })
      Animated.timing(this.position, {
        toValue: { x: SCREEN_WIDTH + 100, y: 0 },
        useNativeDriver: false
      }).start(() => {
        this.setState(this.state.forwardCard ? {forwardCard: false, forwardImage: this.state.forwardImage + 2}: {forwardCard: true, backwardImage: this.state.backwardImage + 2})
        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
          this.position.setValue({ x: 0, y: 0 })
          this.updateUserId()
          if (this.state.userId != 0) {
            this.sendLike(this.state.data[this.state.currentIndex - 1].id, this.state.data[this.state.currentIndex - 1].tokens, this.state.currentIndex)
          } else {
            openBrowserAsync(this.state.ad_link)
          }
        })
        this.setState({ processSwipe: false })
      })
    }

    this.likeRightProfile = () => {
      this.setState({ processSwipe: true })
      Animated.timing(this.position, {
        toValue: { x: SCREEN_WIDTH + 100, y: 0 },
        useNativeDriver: false
      }).start(() => {
        this.setState(this.state.forwardCard ? {forwardCard: false, forwardImage: this.state.forwardImage + 2}: {forwardCard: true, backwardImage: this.state.backwardImage + 2})
        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
          this.position.setValue({ x: 0, y: 0 })
          this.updateUserId()
        })
        this.setState({ processSwipe: false })
      })
    }

    this.disLikeLeft = () => {
        this.setState({ processSwipe: true })
        Animated.timing(this.position, {
          toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
          useNativeDriver: false
        }).start(() => {
          this.setState(this.state.forwardCard ? {forwardCard: false, forwardImage: this.state.forwardImage + 2}: {forwardCard: true, backwardImage: this.state.backwardImage + 2})
          // this.setState(this.state.forwardCard ? this.state.data.length - 1 > this.state.forwardImage + 2 ? {forwardImage: this.state.forwardImage + 2} : {forwardImage: this.state.forwardImage} : this.state.data.length - 1 > this.state.backwardImage + 2 ? {backwardImage: this.state.backwardImage + 2} : {backwardImage: this.state.backwardImage})
          this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
            this.position.setValue({ x: 0, y: 0 })
            if (this.state.userId != 0) {
              this.sendDislike(this.state.data[this.state.currentIndex - 1].id, this.state.currentIndex)
            }
            this.updateUserId()
          })
          this.setState({ processSwipe: false })
        })
    }

    this.disLikeLeftProfile = () => {
      this.setState({ processSwipe: true })
      Animated.timing(this.position, {
        toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
        useNativeDriver: false
      }).start(() => {
        this.setState(this.state.forwardCard ? {forwardCard: false, forwardImage: this.state.forwardImage + 2}: {forwardCard: true, backwardImage: this.state.backwardImage + 2})
        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
          this.position.setValue({ x: 0, y: 0 })
          this.updateUserId()
        })
        this.setState({ processSwipe: false })
      })
  }

    // this.translateIn()
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['0deg', '0deg', '0deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }
    this.likeDislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH -100, -SCREEN_WIDTH, -SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_WIDTH, SCREEN_WIDTH + 100],
      outputRange: [0, 1, 1, 1, 1, 1, 0],
      extrapolate: 'clamp'
    })
    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 3, SCREEN_WIDTH, SCREEN_WIDTH + 100],
      outputRange: [0, 0, 1, 1, 0],
      extrapolate: 'clamp'
    })
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH -100, -SCREEN_WIDTH, -SCREEN_WIDTH / 3, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 1, 1, 0, 0],
      extrapolate: 'clamp'
    })
    this.AnimBgOpacity = this.position.x.interpolate({
      inputRange: [-10, 0, 10],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp'
    })
    // this.dislikeTranslate = this.position.x.interpolate({
    //   inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    //   outputRange: [0, SCREEN_WIDTH / 2, SCREEN_WIDTH / 2],
    //   extrapolate: 'clamp'
    // })
    // this.dislikeRotate = this.position.x.interpolate({
    //   inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    //   outputRange: ['0deg', '-20deg', '-20deg'],
    //   extrapolate: 'clamp'
    // })
    // this.likeTranslate = this.position.x.interpolate({
    //   inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    //   outputRange: [-SCREEN_WIDTH / 2, -SCREEN_WIDTH / 2, 0],
    //   extrapolate: 'clamp'
    // })
    // this.likeRotate = this.position.x.interpolate({
    //   inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    //   outputRange: ['20deg', '20deg', '0deg'],
    //   extrapolate: 'clamp'
    // })

    this.nextCardOpacity = this.position.x.interpolate(
      Platform.OS === 'ios' ? {
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.95, 1],
      extrapolate: 'clamp'
      } : {
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0.9, 1],
        extrapolate: 'clamp'
      }
    )
    this.currentCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp'
    })
    this.currentCardOpacitySecond = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.currentIndicatorOpacity = this.position.x.interpolate({
      inputRange: [-10, 0, 10],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp'
    })
    this.nextBlurOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.nextBlurFirstOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp'
    })
    this.currentBlurWhiteOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.6, 1],
      extrapolate: 'clamp'
    })
    this.nextBlurWhiteOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0.6, 0.5, 0.6],
      extrapolate: 'clamp'
    })
    this.translateXBlurOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: [SCREEN_WIDTH, 0, -SCREEN_WIDTH],
      extrapolate: 'clamp'
    })
    this.translateXBlurOpacityLast = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, -SCREEN_WIDTH, 0],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.90, 1],
      extrapolate: 'clamp'
    })
    this.nextCardTranslateX = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 30, 0],
      extrapolate: 'clamp'
    })
    this.nextCardTranslateY = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, -12, 0],
      extrapolate: 'clamp'
    })
    this.thirdCardTranslateX = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [30, SCREEN_WIDTH + 50, 30],
      extrapolate: 'clamp'
    })

  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this.appStateListener = AppState.addEventListener('change', this.handleAppStateChange);
    this.getAgeFrom()
    this.getAgeTo()
    this.getGender()
    this.getTutorialSwipes()
    .then(() => this.getTokenData())
    // .then(() => this.getAgeTo())
    // .then(() => this.getAgeFrom())
    .then(() => this.loadData())
    .then(() => this._loadFontsAsync())
  }
  componentWillUnmount() {
    // Очистка таймаутов
    this.appStateListener.remove();
    if (this.timeAnimRef.current) {
      clearTimeout(this.timeAnimRef.current);
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { route, navigation } = this.props;
    this.timeRefLogo.current = setTimeout(() => {
      clearTimeout(this.timeRefLogo.current)
      if (this.props.navigation.isFocused()) {
        this.setState({ logoOpacity: 1 })
      }
    }, 500)
    if (this.context.isTriggered) {
      this.getAgeFrom()
      .then(() => this.setState({ loading: true }))
      .then(() => this.setState({ currentIndex: 0, forwardCard: true, forwardImage: 0, backwardImage: 1 }))
      .then(() => this.updateUserId())
      .then(() => this.context.resetFunction())
      .then(() => {this.setState({age_from: this.getAgeFrom()})})
      .then(() => {this.setState({age_to: this.getAgeTo()})})
      .then(() => {this.setState({gender: this.getGender()})})
      .then(() => this.getTokenData())
      .then(() => {
        if (this.state.age_from._j != null) {
          this.loadData()
        }
      })
      .then(() => {this._loadFontsAsync()})
    } else {
      if (this.state.processSwipe == false) {
        if (
          this.props.route.params?.likedChanged == 'dislike' && this.props.route.params?.id == this.state.data[this.state.currentIndex].id
        ) {
          navigation.setParams({ likedChanged: 'none' });
          this.timeRef.current = setTimeout(() => {
            clearTimeout(this.timeRef.current)
            this.disLikeLeftProfile()
            Platform.OS === 'ios' && this.animationDislike.current.play(0, 30);
          }, 300)
        } else if (this.props.route.params?.likedChanged == 'like' && this.props.route.params?.id == this.state.data[this.state.currentIndex].id) {
          navigation.setParams({ likedChanged: 'none' });
          this.timeRef.current = setTimeout(() => {
            clearTimeout(this.timeRef.current)
            this.likeRightProfile()
            Platform.OS === 'ios' && this.animation.current.play(0, 60);
          }, 300)
        }
      }  
      }
    } 

  handleAppStateChange = (nextAppState) => {
    this.setState({ appState: nextAppState });
  };

  UNSAFE_componentWillMount() {
    this.PanResponder = PanResponder.create({
      // onStartShouldSetPanResponderCapture: () => false,
      // onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderEnd: (evt, gestureState) => {
        if (Math.abs(gestureState.dy) < 1) {
          if (this.state.userId != 0) {
            this.clickedItem({'id': this.state.userId})
          } else {
              openBrowserAsync(this.state.ad_link)
          }
          
        }
      },
      // onMoveShouldSetPanResponder: (evt, gestureState) => {
      //   // Если есть вертикальное движение более 5 пикселей, то PanResponder начинает отслеживать жест
      //   return true
      // },
      onPanResponderMove: (evt, gestureState) => {
        if (this.animation.current) {
          if (gestureState.dx > 0) {
            this.animation.current.play(gestureState.dx / 5, gestureState.dx / 5);
          } else {
            this.animation.current.play(0, 0)
          }
        }
        if (this.animationDislike.current) {
          if (gestureState.dx < 0) {
            this.animationDislike.current.play(-gestureState.dx / 5, -gestureState.dx / 5);
          } else {
            this.animationDislike.current.play(0, 0)
          }
        }
        this.position.setValue({ x: gestureState.dx, y: 0 })
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.setState({ isDragging: false });
        if (gestureState.dx > 70) {
          this.likeRight()
          if (this.animation.current) {
            this.animation.current.play(gestureState.dx / 5, 60);
          }
        }
        else if (gestureState.dx < -70) {
          this.disLikeLeft()
          if (this.animationDislike.current) {
            this.animationDislike.current.play(-gestureState.dx / 5, 30);
          }
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false
          }).start()
          if (this.animation.current) {
            if (gestureState.dx > 0) {
              this.animation.current.play(gestureState.dx / 5, 0);
            } else if (gestureState.dx < 0){
              this.animationDislike.current.play(-gestureState.dx / 5, 0);
            } else {
              this.animation.current.play(0, 0)
              this.animationDislike.current.play(0, 0)
            }
          }
        }
      }
    })
  }
  updateUserId = () => {
    if (this.state.data[this.state.currentIndex]) {
      const currentItem = this.state.data[this.state.currentIndex];
      if (currentItem.image == undefined && this.state.userId !== currentItem.id) {
        this.setState({ userId: currentItem.id });
        this.setState({ photoIndex: 0, backPhotoIndex: 0 });
      } else if (currentItem.image != undefined) {
        this.setState({ userId: 0 });
        this.setState({ photoIndex: 0, backPhotoIndex: 0 });
        this.setState({ ad_link: currentItem.link })
      }
  }
  };
  renderUsers = () => {
    const data = this.state.data
    
    // console.log(this.state.fadeAnimation)
    return data.map((item, i) => {
      const itId = item.id
      if (i < this.state.currentIndex) {
        return null
      }
      else if (i == this.state.currentIndex) {
        // if (this.state.userId != item.id) {
        //   this.setState({userId: item.id})
        // }
        if (item.image == undefined) {
        return (
          
          <Animated.View
            key={item.id} 
            style={[

               { height: '100%', width: SCREEN_WIDTH,
                
               position: 'absolute', alignSelf: 'center', zIndex: 1000 }
              ]}
               >
            <Animated.View
              style={{ opacity: this.likeDislikeOpacity }}
            >
              <Animated.View
                style={{ opacity: Platform.OS === 'ios' ? 1 : this.likeOpacity }}
              >
              <LottieView
              ref={Platform.OS === 'ios' ? this.animation : this.androidAnimation}
              source={require('../animation/like.json')}
              style={{width: SCREEN_WIDTH / 3, height: SCREEN_WIDTH / 3,
                      position: 'absolute', top: 50, left: 10,}}
              loop={false}
              progress={Platform.OS === 'android' && 1}
              // renderMode='SOFTWARE'
              speed={1.5}
            />
              </Animated.View>
            
            <Animated.View
              style={{ opacity: Platform.OS === 'ios' ? 1 : this.dislikeOpacity }}
            >
            <LottieView
              ref={Platform.OS === 'ios' ? this.animationDislike : this.androidAnimation}
              source={require('../animation/dislike.json')}
              style={{ width: SCREEN_WIDTH / 3, height: SCREEN_WIDTH / 3,
                       position: 'absolute', top: 50, left: 10}}
              loop={false}
              progress={Platform.OS === 'android' && 1}
              // renderMode='AUTOMATIC'
              speed={1.5}
            />
            </Animated.View>
            
            </Animated.View>
            
            {/* <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: this.likeRotate }, {translateX: this.likeTranslate}], position: 'absolute', top: 50, left: -SCREEN_WIDTH / 3.1, zIndex: 1000 }}>
              <GlassesSwipes width={SCREEN_WIDTH / 1.5} height={SCREEN_WIDTH / 1.5} />
            </Animated.View>
            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: this.dislikeRotate }, {translateX: this.dislikeTranslate}], position: 'absolute', top: 50, right: -SCREEN_WIDTH / 3.1, zIndex: 1000 }}>
              <GlassesSwipes width={SCREEN_WIDTH / 1.5} height={SCREEN_WIDTH / 1.5} />
            </Animated.View> */}
            
            <View style={{flex: 1, backgroundColor: 'transparent', overflow: 'hidden'}}>
            <Animated.View style={{flex: 1, backgroundColor: 'transparent', overflow: 'hidden'}}
            
            >
            {/* {(item.new_user == true || item.boosted == true) && <Animated.View 
              style={{ position: 'absolute', width: '90%', alignSelf: 'center',
                      bottom: 20, height: 200, opacity: this.currentCardOpacity
             }}>
            <View
              style={{ position: 'absolute', top: -50, flexDirection: 'row', alignItems: 'center' }}
            >
            {item.boosted == true && <View
              style={{ backgroundColor: ('rgba(102, 51, 153, 0.7)'), padding: 7, borderRadius: 100, marginRight: 5 }}
            >
              <Text
                style={{ color: '#fff', fontSize: 15 }}
              >Boosted Profile</Text>
            </View>}
            {item.new_user == true && <View
              style={{ backgroundColor: ('rgba(189, 195, 199, 0.7)'), padding: 7, borderRadius: 100 }}
            >
              <Text
                style={{ color: '#fff', fontSize: 15 }}
              >New User</Text>
            </View>}
            </View>
            </Animated.View>} */}
            {/* {item.photos.length > 0 ?
            this.renderGallery(this.state.data[this.state.forwardImage].photos, id=this.state.data[this.state.currentIndex].id)
          :
            <ImageBackground
            source={item.photos.length == 0 && (item.sex == 'male' ? {uri: male} : {uri: female})}
            resizeMode='contain'
            style={{flex: 1, height: null, width: null, overflow: 'hidden', backgroundColor: '#aaa'}}
            >
              {item.photos.length > 0 ? <Image
                style={{width:'100%', height:'100%'}}
                source={{
                  uri: `${item.photos[0].photo.slice(0, -5) + '.full.jpeg'}`
                }}
                
              /> : <View></View> }
              <ActivityIndicator 
              style={{position: 'absolute', left:0, top:0, right:0, bottom:0}}
              animating={false}
              />
            </ImageBackground>} */}

        <TouchableOpacity
          style={{
            position:'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '100%',
            zIndex: 1000
          }}
          onPress={() => {
            if(this.state.forwardCard) {
            if (this.state.photoIndex > 0) {
              Haptics.impactAsync(
                Haptics.ImpactFeedbackStyle.Light
              )
              this.setState({ photoIndex: this.state.photoIndex - 1 })
            } else {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              )
            }
          } else {
            if (this.state.backPhotoIndex > 0) {
              Haptics.impactAsync(
                Haptics.ImpactFeedbackStyle.Light
              )
              this.setState({ backPhotoIndex: this.state.backPhotoIndex - 1 })
            } else {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              )
            }
          }
        }
        }
          
        >
        </TouchableOpacity>
        <TouchableOpacity
        style={{
          position:'absolute',
          width: '50%',
          top: 0,
          right: 0,
          height: '100%',
        }}
        onPress={() => {
          if(this.state.forwardCard) {
          if (this.state.photoIndex < item.photos.length - 1) {
            Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Light
            )
            this.setState({ photoIndex: this.state.photoIndex + 1 })
          } else {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            )
          }
        } else {
          if (this.state.backPhotoIndex < item.photos.length - 1) {
            Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Light
            )
            this.setState({ backPhotoIndex: this.state.backPhotoIndex + 1 })
          } else {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            )
          }
        }
      }
      }
        >
          
        </TouchableOpacity>


            </Animated.View>
            <Animated.View
              {...this.PanResponder.panHandlers}
              key={item.id} style={[this.rotateAndTranslate, { height: '0%', width: SCREEN_WIDTH, 
               position: 'absolute', alignSelf: 'center', bottom: 0, zIndex: 10 }]}
            >
             
            <BlurView style={{ position: 'absolute', width: '90%', alignSelf: 'center',
            borderRadius: 40, overflow: 'hidden', bottom: 20, backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            intensity={70}
            >
            {Platform.OS === 'android' && <Animated.Image
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 50, backgroundColor: '#aaa', position: 'absolute', bottom: -15, left: -20, transform: [{translateX: this.translateXBlurOpacity}] }}
              source={item.image == undefined ? (item.photos.length == 1 ? {uri: `${BASE_URL}${item.photos[0].compressed_image_url}`}: item.photos.length > 1 ? {uri: `${BASE_URL}${item.photos[this.state.forwardCard ? this.state.photoIndex : this.state.backPhotoIndex].compressed_image_url}`} : bluredBg) : {uri: `${BASE_URL}${item.compressed_image_url}`}}
              blurRadius={20}
            />}
            {(Platform.OS === 'android' && data[i + 1]) && <Animated.Image
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 50, position: 'absolute', bottom: -15, left: -20, opacity: this.nextBlurOpacity, transform: [{translateX: this.translateXBlurOpacity}] }}
              source={data[i + 1].image == undefined ? (data[i + 1].photos.length > 0 ? {uri: `${BASE_URL}${data[i + 1].photos[0].compressed_image_url}`}: bluredBg) : {uri: `${BASE_URL}${data[i + 1].compressed_image_url}`}}
              blurRadius={20}
            />}
            {Platform.OS === 'android' && <View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            />}
            {Platform.OS === 'android' && <Animated.View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.2)', opacity: this.currentBlurWhiteOpacity }}
            />}
              {/* <LinearGradient
              colors={['rgba(226, 255,108, 0.1)', 'rgba(255, 37, 37, 0.3)']}
              start={{
                x:1,
                y:0
              }}
              end={{
                x:0.4,
                y:0
              }}
              style={{ width: '100%', height: '100%', position: 'absolute'}}
              /> */}
              <View style={{width: '100%', zIndex: 100, paddingVertical: 25, paddingHorizontal: 30, }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}
              >
               <Text
                numberOfLines={1}
                style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                  color: '#fff', maxWidth: '70%'}}
               >{item.name}</Text>
              <Text
                style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                  color: '#fff', marginRight: 2}}
              >, {item.age}</Text>
                {item.verified && <CheckMark width={30} height={30} style={{ shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: {width: 0, height: 0}, shadowRadius: 3 }} />}
                {((nowDate - new Date(item.last_seen)) / 60 / 1000) < 15 && <View
                  style={{ backgroundColor: '#65B141', width: 7, aspectRatio: 1/1, borderRadius: 100, marginLeft: 5 }}
                ></View>}
                </View>
                <View >
                {item.description != '' ? <Text
                style={{ color: '#fff', marginTop: 15, minHeight: 35, fontSize: 15, fontFamily: 'SftMedium',
                 }}
                 ellipsizeMode='tail'
                 numberOfLines={2}
                >{item.description}</Text> :
                <Text
                style={{ color: '#fff', marginTop: 15, fontFamily: 'SftMedium', height: 35 }}
                numberOfLines={2}
                >{this.state.language._j == 'English' ? "No description" : 'Нет описания'}</Text>}
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{ width: '50%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Location width={20} height={20} fill='#fff'/>
                    <Text
                      style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium'}}
                    >{this.state.language._j == 'English' ? item.city.name_eng : item.city.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                  <CircleStar width={20} height={20} fill='#fff'/>
                  <Text
                  numberOfLines={1}
                  style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium' }}
                  >Rating: <Text
                    style={item.boosted && { color: '#ffa420', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowRadius: 1 }}
                  >{item.rating}</Text></Text>
                  </View>
                </View>
                <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <IconButton 
                  icon='close'
                  iconColor='#FF2525'
                  size={25}
                  style={{ borderColor: '#FF2525', width: 50, height: 50, borderWidth: 2, borderRadius: 100,
                   marginLeft: 15 }}
                  onPress={() => {
                    if(this.state.processSwipe == false) {
                      this.disLikeLeft()
                      Platform.OS === 'ios' && this.animationDislike.current.play(0, 30);
                    }
                  }}
                  />
                  <IconButton 
                  icon='cards-heart-outline'
                  iconColor='#E2FF6C'
                  size={25}
                  style={{ borderColor: '#E2FF6C', width: 50, height: 50, borderWidth: 2, borderRadius: 100,
                  marginLeft: 20 }}
                  onPress={() => {
                    if(this.state.processSwipe == false) {
                      this.likeRight()
                      Platform.OS === 'ios' && this.animation.current.play(0, 60);
                    }
                  }}
                  />
                </View>
                </View>

              </View>
            </BlurView>

            </Animated.View>

            {data[i + 1] && <Animated.View
               style={[{transform: [{ scale: this.nextCardScale }, {translateX: this.nextCardTranslateX}, {translateY: this.nextCardTranslateY}],
               height: '0%', width: SCREEN_WIDTH, opacity: 1,
               position: 'absolute', alignSelf: 'center', bottom: 0, zIndex: 5 }]}
            >
            <BlurView style={{ position: 'absolute', width: '90%', alignSelf: 'center',
            borderRadius: 40, overflow: 'hidden', bottom: 20, backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: 0 }}
            intensity={70}
            >
              {data[i + 1].image && <View
              style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            />}
            {Platform.OS === 'android' && <Animated.Image
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 50, position: 'absolute', bottom: -15, left: -20, opacity: 1 }}
              source={data[i + 1].image == undefined ? (data[i + 1].photos.length > 0 ? {uri: `${BASE_URL}${data[i + 1].photos[0].compressed_image_url}`}: bluredBg) : {uri: `${BASE_URL}${data[i + 1].compressed_image_url}`}}
              blurRadius={20}
            />}
            {Platform.OS === 'android' && <Animated.Image
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 50, position: 'absolute', bottom: -15, left: -20, opacity: this.nextBlurFirstOpacity }}
              source={item.image == undefined ? (item.photos.length == 1 ? {uri: `${BASE_URL}${item.photos[0].compressed_image_url}`}: item.photos.length > 1 ? {uri: `${BASE_URL}${item.photos[this.state.forwardCard ? this.state.photoIndex : this.state.backPhotoIndex].compressed_image_url}`} : bluredBg) : {uri: `${BASE_URL}${item.compressed_image_url}`}}
              blurRadius={20}
            />}
            {Platform.OS === 'android' && <View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            />}
            {Platform.OS === 'android' && <Animated.View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.2)', opacity: this.nextBlurWhiteOpacity }}
            />}
              <View style={{width: '100%', zIndex: 100, paddingVertical: 25, paddingHorizontal: 30 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                {data[i + 1].image == undefined && <Text
                numberOfLines={1}
                  style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                    color: '#fff', maxWidth: '70%'}}
                >{data[i + 1].name}</Text>}
                {data[i + 1].image == undefined && <Text
                  style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                    color: '#fff', marginRight: 2}}
                >, {data[i + 1].age}</Text>}
               
                {data[i + 1].image && <Text
                  style={{fontSize: 25, textAlign: 'center', marginLeft: 0, fontFamily: 'SftBold',
                  color: '#fff', width: '100%'}}
                >{data[i + 1].name}</Text>}
                {data[i + 1].verified && <CheckMark width={30} height={30} style={{ shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: {width: 0, height: 0}, shadowRadius: 3 }} />}
                {((nowDate - new Date(data[i + 1].last_seen)) / 60 / 1000) < 15 && <View
                  style={{ backgroundColor: '#65B141', width: 7, aspectRatio: 1/1, borderRadius: 100, marginLeft: 7 }}
                ></View>}
                </View>
                <View >
                {data[i + 1].description != '' ? <Text
                style={[{ color: '#fff', marginTop: 15, minHeight: 35, fontSize: 15, fontFamily: 'SftMedium',
                 }, data[i + 1].image != undefined && {textAlign: 'center'}]}
                 ellipsizeMode='tail'
                 numberOfLines={2}
                >{data[i + 1].description}</Text> :
                <Text
                style={{ color: '#fff', marginTop: 15, fontFamily: 'SftMedium', height: 35 }}
                numberOfLines={2}
                >{this.state.language._j == 'English' ? "No description" : 'Нет описания'}</Text>}
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                {data[i + 1].image == undefined && <View style={{ width: '50%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Location width={20} height={20} fill='#fff'/>
                    <Text
                      style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium'}}
                    >{data[i + 1].city && this.state.language._j == 'English' ? data[i + 1].city.name_eng : data[i + 1].city.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                  <CircleStar width={20} height={20} fill='#fff'/>
                  <Text
                  numberOfLines={1}
                  style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium' }}
                  >Rating: <Text
                  style={data[i + 1].boosted && { color: '#ffa420', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowRadius: 1 }}
                >{data[i + 1].rating}</Text></Text>
                  </View>
                </View>}
                <View style={[{ flexDirection: 'row', justifyContent: 'flex-end' }, data[i + 1].image == undefined ? { width: '50%' } : {width: '100%', height: 60} ]}>
                {data[i + 1].image == undefined && <IconButton 
                  icon='close'
                  iconColor='#FF2525'
                  size={25}
                  style={{ borderColor: '#FF2525', width: 50, height: 50, borderWidth: 2, borderRadius: 100,
                   marginLeft: 15 }}
                  
                  />}
                  {data[i + 1].image == undefined && <IconButton 
                  icon='cards-heart-outline'
                  iconColor='#E2FF6C'
                  size={25}
                  style={{ borderColor: '#E2FF6C', width: 50, height: 50, borderWidth: 2, borderRadius: 100,
                  marginLeft: 20 }}
                  
                  />}
                  {data[i + 1].image && <TouchableOpacity
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center',
                      borderWidth: 2, borderColor: data[i + 1].colour, borderRadius: 16        
                    }}
                  >
                    <Text
                      style={{ color: data[i + 1].colour, fontSize: 17, fontFamily: 'SftBold' }}
                    >{data[i + 1].btn_text}</Text>
                  </TouchableOpacity>}
                </View>
                </View>

              </View>
             
            </BlurView>
            </Animated.View>}


            {data[i + 2] && <Animated.View
               style={[{transform: [{ scale: 0.90 }, {translateX: this.thirdCardTranslateX}, {translateY: -12}],
               height: '0%', width: SCREEN_WIDTH, 
               position: 'absolute', alignSelf: 'center', bottom: 0, zIndex: 0 }, Platform.OS === 'ios' ? {opacity: 0.95} : {opacity: this.currentBlurWhiteOpacity}]}
            >
            <BlurView style={{ position: 'absolute', width: '90%', alignSelf: 'center',
            borderRadius: 40, overflow: 'hidden', bottom: 20, backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: 0 }}
            intensity={70}
            >
            {Platform.OS === 'android' && <Animated.Image
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 50, position: 'absolute', bottom: -15, left: -20, transform: [{translateX: this.translateXBlurOpacityLast}] }}
              source={data[i + 1].image == undefined ? (data[i + 1].photos.length > 0 ? {uri: `${BASE_URL}${data[i + 1].photos[0].compressed_image_url}`}: bluredBg) : {uri: `${BASE_URL}${data[i + 1].compressed_image_url}`}}
              blurRadius={20}
            />}
            {Platform.OS === 'android' && <View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            />}
            {Platform.OS === 'android' && <Animated.View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.2)', opacity: 0.5 }}
            />}
              <View style={{width: '100%', zIndex: 100, paddingVertical: 25, paddingHorizontal: 30 }}>
                <View
                  style={{width: '100%', flexDirection: 'row', alignItems: 'center' }}
                >
              {data[i + 2].image == undefined && <Text
                numberOfLines={1}
                style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                  color: '#fff', maxWidth: '70%'}}
                >{data[i + 2].name}</Text>}
                {data[i + 2].image == undefined && <Text
                  style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                    color: '#fff', marginRight: 2}}
                >, {data[i + 2].age}</Text>}
                {data[i + 2].image && <Text
                  style={{fontSize: 25, textAlign: 'center', marginLeft: 0, fontFamily: 'SftBold',
                  color: '#fff', letterSpacing: -1, width: '100%'}}
                >{data[i + 2].name}</Text>}
                {data[i + 2].verified && <CheckMark width={30} height={30} style={{ shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: {width: 0, height: 0}, shadowRadius: 3 }} />}
                </View>
                <View style={{ height: 50 }}>
                {data[i + 2].description != '' ? <Text
                style={{ color: '#fff', marginTop: 15, fontSize: 15, fontFamily: 'SftMedium' }}
                >{data[i + 2].description}</Text> :
                <Text
                style={{ color: '#fff', marginTop: 15, fontFamily: 'SftMedium' }}
                >{this.state.language._j == 'English' ? "No description" : 'Нет описания'}</Text>}
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                {data[i + 2].image == undefined && <View style={{ width: '50%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Location width={20} height={20} fill='#fff'/>
                    <Text
                      style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium'}}
                    >{data[i + 2].city && this.state.language._j == 'English' ? data[i + 2].city.name_eng :  data[i + 2].city.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                  <CircleStar width={20} height={20} fill='#fff'/>
                  <Text
                  numberOfLines={1}
                  style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium' }}
                  >Rating: <Text
                  style={data[i + 2].boosted && { color: '#ffa420', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowRadius: 1 }}
                >{data[i + 2].rating}</Text></Text>
                  </View>
                </View>}
                <View style={[{ flexDirection: 'row', justifyContent: 'flex-end' }, data[i + 2].image == undefined ? { width: '50%' } : { width: '100%', height: 60 }]}>
                {data[i + 2].image == undefined && <IconButton 
                  icon='close'
                  iconColor='#FF2525'
                  size={25}
                  style={{ borderColor: '#FF2525', width: 50, height: 50, borderWidth: 2, borderRadius: 100,
                   marginLeft: 15 }}
                  
                  />}
                  {data[i + 2].image == undefined && <IconButton 
                  icon='cards-heart-outline'
                  iconColor='#E2FF6C'
                  size={25}
                  style={{ borderColor: '#E2FF6C', width: 50, height: 50, borderWidth: 2, borderRadius: 100,
                  marginLeft: 20 }}
                  
                  />}
                  {data[i + 2].image && <TouchableOpacity
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center',
                      borderWidth: 2, borderColor: data[i + 2].colour, borderRadius: 16        
                    }}
                  >
                    <Text
                      style={{ color: data[i + 2].colour, fontSize: 17, fontFamily: 'SftBold' }}
                    >{data[i + 2].btn_text}</Text>
                  </TouchableOpacity>}
                </View>
                </View>

              </View>
             
            </BlurView>
            </Animated.View>}

            
            </View>
            

          </Animated.View>
        )}
        else {
          return (
            <Animated.View
            key={item.id} 
            style={[

               { height: '100%', width: SCREEN_WIDTH,
                
               position: 'absolute', alignSelf: 'center' }
              ]}
               >
            
            <View style={{flex: 1, backgroundColor: 'transparent', overflow: 'hidden'}}>
            <Animated.View style={{width: '100%', height: '100%', backgroundColor: 'transparent', overflow: 'hidden', opacity: this.currentCardOpacity,}}
            
            >
            {/* <ImageBackground
            resizeMode='cover'
            style={{flex: 1 }}
            source={{
              uri: `${BASE_URL}${item.compressed_image_url}`
            }}
            imageStyle={{
              bottom: '-10%',
            }}
            >
            </ImageBackground> */}
            <View style={{ position: 'absolute', width: '90%', alignSelf: 'center',
            bottom: 20, height: 200
             }}>
                {/* <View style={{ marginTop: 20, height: 180 }}/> */}
            <Image
              source={require('../images/ads/ad.png')}
              style={{ position: 'absolute', top: -60, width: 35, height: 25 }}
            />
            </View>
            </Animated.View>
            <Animated.View
              {...this.PanResponder.panHandlers}
              // pointerEvents='box-only'
              // onTouchStart={() => this.setState({ isDragging: true })}
              key={item.id} style={[this.rotateAndTranslate, { height: '0%', width: SCREEN_WIDTH, 
               position: 'absolute', alignSelf: 'center', bottom: 0, zIndex: 10 }]}
            >
            
            <BlurView style={{ position: 'absolute', width: '90%', alignSelf: 'center',
            borderRadius: 40, overflow: 'hidden', bottom: 20, backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            intensity={70}
            >
            <View
              style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            />
            {Platform.OS === 'android' && <Image
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 50, position: 'absolute', bottom: -15, left: -20 }}
              source={{uri: `${BASE_URL}${item.compressed_image_url}`}}
              blurRadius={20}
            />}
            {Platform.OS === 'android' && <View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            />}
              <View style={{width: '100%', zIndex: 100, paddingVertical: 25, paddingHorizontal: 30, }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', minHeight: 30}}
              >
               {item.image == undefined && <Text style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                color: '#fff'}}
              >{item.name.length <= 17
                ? `${item.name}`
                : `${item.name.substring(0, 17)}...`}</Text>}
                {item.image && <Text
                  style={{fontSize: 25, textAlign: 'center', marginLeft: 0, fontFamily: 'SftBold',
                  color: '#fff', width: '100%'}}>
                    {item.name}
                  </Text>}
                </View>
                <View style={{ height: 50 }}>
                  <Text
                    style={{ color: '#fff', marginTop: 15, fontSize: 15, fontFamily: 'SftMedium', textAlign: 'center' }}
                  >{item.description}</Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                {item.image == undefined && <View style={{ width: '50%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Location width={20} height={20} fill='#fff'/>
                    <Text
                      style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium'}}
                    > text</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                  <CircleStar width={20} height={20} fill='#fff'/>
                  <Text
                  style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium' }}
                  >Rating: </Text>
                  </View>
                </View>}
                <View style={{ width: '100%', height: 60, flexDirection: 'row', justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center',
                      borderWidth: 2, borderColor: item.colour, borderRadius: 16        
                    }}
                    onPress={() => {
                      openBrowserAsync(item.link)
                    }}
                  >
                    <Text
                      style={{ color: item.colour, fontSize: 17, fontFamily: 'SftBold' }}
                    >{item.btn_text}</Text>
                  </TouchableOpacity>
                </View>
                </View>

              </View>
            </BlurView>
           
            </Animated.View>

            {data[i + 1] && <Animated.View
               style={[{transform: [{ scale: this.nextCardScale }, {translateX: this.nextCardTranslateX}, {translateY: this.nextCardTranslateY}],
               height: '0%', width: SCREEN_WIDTH, opacity: this.nextCardOpacity,
               position: 'absolute', alignSelf: 'center', bottom: 0, zIndex: 5 }]}
            >
            <BlurView style={{ position: 'absolute', width: '90%', alignSelf: 'center',
            borderRadius: 40, overflow: 'hidden', bottom: 20, backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: 0 }}
            intensity={70}
            >
            {Platform.OS === 'android' && <Animated.Image
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 50, position: 'absolute', bottom: -15, left: -20, opacity: this.nextBlurOpacity }}
              source={data[i + 1].image == undefined ? (data[i + 1].photos.length > 0 ? {uri: `${BASE_URL}${data[i + 1].photos[0].compressed_image_url}`}: bluredBg) : {uri: `${BASE_URL}${data[i + 1].compressed_image_url}`}}
              blurRadius={20}
            />}
            {Platform.OS === 'android' && <View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            />}
              <View style={{width: '100%', zIndex: 100, paddingVertical: 25, paddingHorizontal: 30 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
               <Text style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftBold',
                color: '#fff'}}
              >{data[i + 1].name.length <= 10
                ? `${data[i + 1].name}, ${data[i + 1].age}`
                : `${data[i + 1].name.substring(0, 9)}..., ${data[i + 1].age}`}</Text>
              </View>
                <View style={{ height: 50 }}>
                {data[i + 1].description != '' ? <Text
                style={[{ color: '#fff', marginTop: 15, fontSize: 15,
                 fontFamily: 'SftMedium' }, data[i + 1].image != undefined && {textAlign: 'center'}]}
                >{data[i + 1].description}</Text> :
                <Text
                style={{ color: '#fff', marginTop: 15, fontFamily: 'SftMedium' }}
                >{this.state.language._j == 'English' ? "No description" : 'Нет описания'}</Text>}
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{ width: '50%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Location width={20} height={20} fill='#fff'/>
                    <Text
                      style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium'}}
                    >{data[i + 1].city.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                  <CircleStar width={20} height={20} fill='#fff'/>
                  <Text
                  style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium' }}
                  >Rating: {data[i + 1].rating}</Text>
                  </View>
                </View>
                <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <IconButton 
                  icon='close'
                  iconColor='#FF2525'
                  size={25}
                  style={{ borderColor: '#FF2525', width: 50, height: 50, borderWidth: 2, borderRadius: 100,
                   marginLeft: 15 }}
                  
                  />
                  <IconButton 
                  icon='cards-heart-outline'
                  iconColor='#E2FF6C'
                  size={25}
                  style={{ borderColor: '#E2FF6C', width: 50, height: 50, borderWidth: 2, borderRadius: 100,
                  marginLeft: 20 }}
                  
                  />
                </View>
                </View>

              </View>
             
            </BlurView>
            </Animated.View>}


            {data[i + 2] && <Animated.View
               style={[{transform: [{ scale: 0.90 }, {translateX: this.thirdCardTranslateX}, {translateY: -12}],
               height: '0%', width: SCREEN_WIDTH, 
               position: 'absolute', alignSelf: 'center', bottom: 0, zIndex: 0 }, Platform.OS === 'ios' ? {opacity: this.nextCardOpacity} : {opacity: 0.6}]}
            >
            <BlurView style={{ position: 'absolute', width: '90%', alignSelf: 'center',
            borderRadius: 40, overflow: 'hidden', bottom: 20, backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: 0 }}
            intensity={70}
            >
            {Platform.OS === 'android' && <Image
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 50, position: 'absolute', bottom: -15, left: -20 }}
              source={data[i + 1].image == undefined ? (data[i + 1].photos.length > 0 ? {uri: `${BASE_URL}${data[i + 1].photos[0].compressed_image_url}`}: bluredBg) : {uri: `${BASE_URL}${data[i + 1].compressed_image_url}`}}
              blurRadius={20}
            />}
            {Platform.OS === 'android' && <View
              style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            />}
              <View style={{width: '100%', zIndex: 100, paddingVertical: 25, paddingHorizontal: 30 }}>
               <Text style={{fontSize: 25, textAlign: 'left', marginLeft: 0, fontFamily: 'SftMedium',
                color: '#fff'}}
              >{item.name.length <= 10
                ? `${data[i + 2].name}, ${data[i + 2].age}`
                : `${data[i + 2].name.substring(0, 9)}..., ${data[i + 2].age}`}</Text>
                <View style={{ height: 50 }}>
                {data[i + 2].description != '' ? <Text
                style={[{ color: '#fff', marginTop: 15, fontSize: 15,
                 fontFamily: 'SftMedium' }, data[i + 1].image != undefined && {textAlign: 'center'}]}
                >{data[i + 2].description}</Text> :
                <Text
                style={{ color: '#fff', marginTop: 15, fontFamily: 'SftMedium' }}
                >{this.state.language._j == 'English' ? "No description" : 'Нет описания'}</Text>}
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{ width: '50%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Location width={20} height={20} fill='#fff'/>
                    <Text
                      style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium'}}
                    > text</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                  <CircleStar width={20} height={20} fill='#fff'/>
                  <Text
                  style={{ color: '#fff', marginLeft: 5, fontFamily: 'SftMedium' }}
                  >Rating:</Text>
                  </View>
                </View>
                <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <IconButton 
                  icon='close'
                  iconColor='#FF2525'
                  size={25}
                  style={{ borderColor: '#FF2525', width: 50, height: 50, borderWidth: 2, borderRadius: 100,
                   marginLeft: 15 }}
                  
                  />
                  <IconButton 
                  icon='cards-heart-outline'
                  iconColor='#E2FF6C'
                  size={25}
                  style={{ borderColor: '#E2FF6C', width: 50, height: 50, borderWidth: 2, borderRadius: 100,
                  marginLeft: 20 }}
                  
                  />
                </View>
                </View>

              </View>
             
            </BlurView>
            </Animated.View>}

            
            </View>
            

          </Animated.View>
          )
        }
      }
      else if (i == this.state.currentIndex + 1) {
        if (item.image == undefined) {
        return (
          <Animated.View

            key={item.id} style={[{
              opacity: 1,
              // transform: [{ scale: this.nextCardScale }],
              height: '100%', width: SCREEN_WIDTH,
              position: 'absolute', alignSelf: 'center'
            }]}>
            <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>

            </Animated.View>

            <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>

            </Animated.View>
            <View style={{flex: 1, backgroundColor: 'transparent', overflow: 'hidden'}}>
            <Animated.View style={{flex: 1, backgroundColor: 'transparent', overflow: 'hidden'}}
            
            >
            
            </Animated.View>
            
            
            
            </View>

          </Animated.View>
        )}
        else {
          return(
            <Animated.View

            key={item.id} style={[{
              opacity: 1,
              // transform: [{ scale: this.nextCardScale }],
              height: '100%', width: SCREEN_WIDTH,
              position: 'absolute', alignSelf: 'center'
            }]}>
            
            <View style={{flex: 1, backgroundColor: 'transparent', overflow: 'hidden'}}>
            <Animated.View style={{flex: 1, backgroundColor: 'transparent', overflow: 'hidden'}}
            
            >
              <Animated.View
                style={{ flex: 1, opacity: this.currentCardOpacitySecond }}
              >
            {/* <ImageBackground
            resizeMode='cover'
            style={{flex: 1 }}
            source={{
              uri: `${BASE_URL}${item.compressed_image_url}`
            }}
            imageStyle={{
              bottom: '-10%',
            }}
            >
              <ActivityIndicator 
              style={{position: 'absolute', left:0, top:0, right:0, bottom:0}}
              animating={false}
              />
            </ImageBackground> */}
            </Animated.View>
            <Animated.View style={{ position: 'absolute', width: '90%', alignSelf: 'center',
            bottom: 20, height: 200, opacity: this.nextBlurOpacity
             }}>
                {/* <View style={{ marginTop: 20, height: 180 }}/> */}
            <Image
              source={require('../images/ads/ad.png')}
              style={{ position: 'absolute', top: -60, width: 35, height: 25 }}
            />
            </Animated.View>
            </Animated.View>
            
            
            
            </View>

          </Animated.View>
          )
        }
      }
    }).reverse()
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.state.age_from !== nextState.age_from || this.state.age_to !== nextState.age_to) {
  //     return false;
  //   }
  //   return true;
  // }

  render() {
    const { navigation } = this.props;
    const deviceModel = Device.modelName;
    const modelsDict = {
      'iPhone 16 Pro Max': 17,
      'iPhone 16 Pro': 17,
      'iPhone 16 Plus': 15,
      'iPhone 16': 15,
      'iPhone 15 Pro Max': 17,
      'iPhone 15 Pro': 17,
      'iPhone 15 Plus': 15,
      'iPhone 15': 15,
      'iPhone 14 Pro Max': 17,
      'iPhone 14 Pro': 17,
      'iPhone 14 Plus': 5,
      'iPhone 14': 5,
      'iPhone 13 Pro Max': 5,
      'iPhone 13 Pro': 5,
      'iPhone 13 mini': 5,
      'iPhone 13': 5,
      'iPhone 12 Pro Max': 5,
      'iPhone 12 Pro': 5,
      'iPhone 12 mini': 5,
      'iPhone 12': 5,
      'iPhone 11 Pro Max': 3,
      'iPhone 11 Pro': 3,
      'iPhone 11': 3,
      'iPhone X': 3,
      'iPhone Xʀ': 3,
      'iPhone Xs': 3,
      'iPhone Xs Max': 3,
    }
    const { hasBoostsToTop, setHasBoostsToTop } = this.context;
    return (
      <View style={{ flex: 1, backgroundColor: '#0b0b0b' }}>
        <TouchableOpacity
            onPress={() => {
              this.setState({modalWallet: true})
            }}
            style={{right: 70, top: 50, borderRadius: 100, width: 40, height: 40,
              alignItems: 'center', justifyContent: 'center', zIndex: 11111, position: 'absolute',
              backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1 }}
            activeOpacity={1}
            >
              <Boosts height={30} color={'#2688EB'} style={{ transform: [{rotateZ: '15deg'}] }} />
          </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {
              // this.setState({modal: true})
              this.props.navigation.navigate("ModalSlider", {data: {sliderWidth: SCREEN_WIDTH - 40, min: MIN_DEFAULT, max: MAX_DEFAULT, step: 1, startPos: this.state.age_from._j, endPos: this.state.age_to._j, gender: this.state.gender._j}})
            }}
            style={{right: 20, top: 50, borderRadius: 100, width: 40, height: 40,
              alignItems: 'center', justifyContent: 'center', zIndex: 11111, position: 'absolute',
              backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1 }}
            activeOpacity={1}
            >
              <FilterSettings width={30} height={30} />
          </TouchableOpacity>
        <ImageRN
          style={{ position: 'absolute', width: '100%', height:'100%' }}
          source={require('../images/wall2.png')}
          blurRadius={5}
        />
        <LinearGradient
              colors={['rgba(11, 11, 11, 1);', 'rgba(0, 0, 0, 0.5)']}
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
        {this.state.loading == false && this.state.data != undefined && this.state.currentIndex > this.state.data.length - 2 && this.state.fontsLoaded && <View style={{position:'absolute', width: '100%', height: '100%', justifyContent:'center',
        shadowColor: '#5555ff', shadowOpacity: 1, shadowOffset: {width: 0, height:0}, shadowRadius: 10}}>
        <Text style={{fontSize: 40, textAlign: 'center', color: '#fff', fontFamily: 'SftMedium',
        textShadowColor: '#5555ff', textShadowOffset: {width: 0, height:0}, textShadowRadius: 20, padding: 20, margin: -20}}>{this.state.language._j == 'English' ? "That's All" : 'Это все'}</Text>
        <Text style={{fontSize: 30, textAlign: 'center', color: '#fff', fontFamily: 'SftMedium',
        textShadowColor: '#5555ff', textShadowOffset: {width: 0, height:0}, textShadowRadius: 20, padding: 20, margin: -20}}>{this.state.language._j == 'English' ? "for now" : 'на данный момент'}</Text>
        </View>}
        {this.state.loading == true || this.state.data == undefined || !this.state.fontsLoaded ? <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
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
        </View>: 
          <View style={{ flex: 1 }}>
            {Platform.OS === 'ios' && deviceModel in modelsDict && this.state.appState == 'active' && <View
              style={{ borderRadius: 100, overflow: 'hidden', opacity: this.state.logoOpacity, position: 'absolute', top: modelsDict[deviceModel], zIndex: 10000, alignSelf: 'center' }}
            ><BlurView
              intensity={10}
              style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100,
                 backgroundColor: 'rgba(164,225,5,0.7)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
            >
              <Glasses width={30} height={10} color={'#7424EB'} style={{ marginTop: 1 }} />
              <Text
                style={{ color: '#fff', fontFamily: 'SftBold', fontSize: 13 }}
              > Vertep</Text>
            </BlurView></View>}
            {this.state.data.length > 0 && this.state.currentIndex <= this.state.data.length - 1 && <View>
            {this.state.backwardImage <= this.state.data.length - 1 && this.state.data[this.state.backwardImage].image == undefined ? this.renderGallery(this.state.data[this.state.backwardImage].photos, false) : this.state.backwardImage <= this.state.data.length - 1 && this.state.data[this.state.backwardImage].image != undefined && this.renderGallery([{'image': this.state.data[this.state.backwardImage].compressed_image_url, 'compressed_image_url': this.state.data[this.state.backwardImage].compressed_image_url}], false)}
            {this.state.forwardImage <= this.state.data.length - 1 && this.state.data[this.state.forwardImage].image == undefined ? this.renderGallery(this.state.data[this.state.forwardImage].photos) : this.state.forwardImage <= this.state.data.length - 1 && this.state.data[this.state.forwardImage].image != undefined && this.renderGallery([{'image': this.state.data[this.state.forwardImage].compressed_image_url, 'compressed_image_url': this.state.data[this.state.forwardImage].compressed_image_url}])}
            </View>}
            {this.renderUsers()}
          
        </View>}
        

        {(<Modal
        transparent={true}
        statusBarTranslucent={true}
        animationType='fade'
        visible={this.state.modal._j}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: SCREEN_WIDTH,
        }}
        >
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}
        >
            <View
              style={{ width: '100%', height: '100%', backgroundColor: '#000', alignItems: 'center', paddingTop: 70, paddingHorizontal: 10 }}
            >
              <View
                style={{ height: 4, width: '90%', borderRadius: 100, backgroundColor: '#3A4E5C', alignItems: 'flex-start' }}
              >
                <View
                  style={{ height: '100%', width: this.slides[this.state.currentSlide].progress, borderRadius: 100, backgroundColor: '#4425EB' }}
                />
              </View>
              <Text
                style={{ color: '#fff', fontSize: 28, fontFamily: 'SftBold', textAlign: 'center', marginTop: 20 }}
              >Welcome to our App!</Text>
              <Text
                style={{ color: '#fff', fontSize: 16, fontFamily: 'SftMedium', textAlign: 'center', marginTop: 10, marginBottom: 30 }}
              >Get Started: A Quick Video Guide</Text>
              {/* <Video
                source={this.slides[this.state.currentSlide].video}
                rate={1.5}
                volume={0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                isLooping={true}
                style={{height: SCREEN_HEIGHT / 2, aspectRatio: 1/2}}
              /> */}
              <Text
                style={{ color: '#fff', fontSize: 16, marginTop: 30, fontFamily: 'SftMedium' }}
              >{this.state.language._j == 'English' ? this.slides[this.state.currentSlide].titleEng : this.slides[this.state.currentSlide].title}</Text>
              <View
                style={{ flex: 1 }}
              />
              <View
                style={{ width: '100%', paddingBottom: 40, }}
              >
              <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              if (this.state.currentSlide < 4) {
                this.setState({ currentSlide: this.state.currentSlide + 1 })
              } else {
                this.setState({ modal: {_j: false} })
                this.writeTutorialSwipes()
              }
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{this.state.currentSlide < 4 ? this.state.language._j == 'English' ? 'Next' : 'Далее' : this.state.language._j == 'English' ? 'Start' : 'Начать'}</Text>
          </TouchableOpacity>
              </View>
              
            </View>
            
          </View>
      </Modal>)}


      <Modal
        transparent={true}
        animationType='fade'
        visible={this.state.modalWallet}
        statusBarTranslucent={true}
        >
          <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <TouchableOpacity onPress={() => {
            // setModalWallet(false)
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
          activeOpacity={1}
          >
          <View style={{
            height: '100%',
            width: '100%'
        }}
        >
            <View style={{ height: 90, backgroundColor: '#0F1826', 
            alignItems: 'flex-end', paddingBottom: 15, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                      this.setState({modalWallet: false})
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{this.state.language._j == 'English' ? 'Boosts' : 'Бустеры'}</Text>
                </View>
            </View>
            
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 10, marginTop: 20, zIndex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center',
                         backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 16,
                         shadowColor: '#bc13fe', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.7, shadowRadius: 10 }}>
              <Image
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, borderRadius: 16, opacity: 1 }}
                source={require('../images/boostedPerson.jpg')}
                blurRadius={5}
              />
              <View
                style={{ width: '100%', height: '100%', paddingHorizontal: 30, paddingVertical: 20 }}
              >
                <Text
                  style={{ color: '#fff', fontSize: 22, fontFamily: 'SftBold', textAlign: 'center' }}
                >{this.state.language._j == 'English' ? 'Be on top' : 'Будь на вершине'}</Text>
                <Text
                  style={{ color: '#fff', fontSize: 17, fontFamily: 'SftMedium', textAlign: 'center', marginTop: 10 }}
                >{this.state.language._j == 'English' ? 'Boost your rating, unlock premium features, or soar straight to the top' : 'Повышай рейтинг, получай премиум-возможности или сразу взлетай на вершину топа'}</Text>
              </View>
          </View>
          
          </View>
          <ScrollView
            style={{ paddingHorizontal: 10, flex: 1, paddingTop: 0 }}
            // contentContainerStyle={{   }}
            showsVerticalScrollIndicator={false}
          ><View
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
              >{this.state.language._j == 'English' ? 'Rating up' : 'Рейтинг'}</Text>
              <Text
                style={{ color: '#818C99', fontSize: 17, marginLeft: 5, fontFamily: 'SftMedium', marginTop: 10 }}
              >+1000 rating</Text>
              <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, width: '90%' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              this.setState({modalBuyRating: true})
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', lineHeight: 22, fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{this.state.language._j == 'English' ? 'Get' : 'Получить'}</Text>
          </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#1E2742', width: '48%', borderRadius: 16, alignItems: 'center', marginBottom: 15 }}
              activeOpacity={1}
            >
              <View
                style={{ backgroundColor: '#fe019a', position: 'absolute', top: -10, left: -10,
                   width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 100,
                   shadowColor: '#fe019a', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.7, shadowRadius: 5,
                   elevation: 3 }}
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
              >{this.state.language._j == 'English' ? 'Boost to top' : 'Войти в топ'}</Text>
              <Text
                style={{ color: '#818C99', fontSize: 17, marginLeft: 5, fontFamily: 'SftMedium', marginTop: 10 }}
              >{this.state.language._j == 'English' ? 'Fly so high' : 'Взлети на вершину'}</Text>
              <TouchableOpacity
            style={[{ backgroundColor: 'rgba(96, 131, 255, 1)', borderRadius: 12, paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, width: '90%' }, 
            Platform.OS === 'android' && {elevation: 0}]}
            activeOpacity={0.8}
            onPress={() => {
              this.setState({modalToTheTop: true})
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', lineHeight: 22, fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{this.state.language._j == 'English' ? 'Explore' : 'Подробнее'}</Text>
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
              >{this.state.language._j == 'English' ? 'Premium' : 'Премиум'}</Text>
              <Text
                style={{ color: '#818C99', fontSize: 17, marginLeft: 5, fontFamily: 'SftMedium', marginTop: 10 }}
              >{this.state.language._j == 'English' ? 'Become a king' : 'Стань королем'}</Text>
              <TouchableOpacity
            style={[{ backgroundColor: 'rgba(96, 131, 255, 1)', borderRadius: 12, paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, width: '90%' }, 
            Platform.OS === 'android' && {elevation: 0}]}
            activeOpacity={0.8}
            onPress={() => {
              this.setState({ modalBuyPremium: true })
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', lineHeight: 22, fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{this.state.language._j == 'English' ? 'Explore' : 'Подробнее'}</Text>
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
              >{this.state.language._j == 'English' ? 'Boost Rating' : 'Буст Рейтинг'}</Text>
              <Text
                style={{ color: '#818C99', fontSize: 17, marginLeft: 5, fontFamily: 'SftMedium', marginTop: 10 }}
              >+10000 rating</Text>
              <TouchableOpacity
            style={[{ backgroundColor: 'rgba(96, 131, 255, 1)', borderRadius: 12, paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, width: '90%' }, 
            Platform.OS === 'android' && {elevation: 0}]}
            activeOpacity={0.8}
            onPress={() => {
              this.setState({ modalBuyMuchRating: true })
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', lineHeight: 22, fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{this.state.language._j == 'English' ? 'Explore' : 'Подробнее'}</Text>
          </TouchableOpacity>
            </TouchableOpacity>
            </View>
          </ScrollView>
          </View>
          
          </View>
          </View>
        </View>
        {this.state.modalBuyRating && <View
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            this.setState({modalBuyRating: false})
            this.setState({modalBuyRatingGot: 0})
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
          {!this.state.loading ? <View style={{
            backgroundColor: 'white',
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.9,
            justifyContent: 'center',
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
              this.setState({modalBuyRating: false})
              this.setState({modalBuyRatingGot: 0})
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%', marginBottom: 20 }}
            >{this.state.language._j == 'English' ? 'Rating Up' : 'Рейтинг'}</Text>
            {this.ListItem({text: this.state.language._j == 'English' ? 'Your rating directly impacts how visible your profile is' : 'Рейтинг прямо пропорционально влияет на видимость вашего профиля'})}
            {this.ListItem({text: this.state.language._j == 'English' ? 'The higher your rating, the sooner other users will come across your profile' : 'Чем выше рейтинг - тем раньше ваш профиль будет попадаться другим пользователям'})}
            {this.ListItem({text: this.state.language._j == 'English' ? 'Purchased rating stays with you forever' : 'Купленный рейтинг останется с тобой навсегда'})}
            <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '100%', marginTop: 20, marginBottom: 25 }}
            >+1000 Rating</Text>
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              this.recieveRating()
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{this.state.language._j == 'English' ? 'Buy' : 'Получить'}</Text>
            <Image source={require('../images/dollar.png')} style={{ width: 25, aspectRatio: 1/1 }} />
              <Text
                style={{ marginLeft: 5, fontSize: 20, color: '#fff', fontFamily: 'SftMedium' }}
              >1500 cash</Text>
          </TouchableOpacity>
          </View>
          {this.state.modalBuyRatingGot != 0 && <View
            style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: '#172136', top: 0, left: 0 }}
          >
          <View
            style={{ flex: 1, alignItems: 'center', paddingTop: 30 }}
          >
          <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{this.state.language._j == 'English' ? 'You got +1000 rating' : 'Вы получили +1000 рейтинга'}</Text>
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
              this.setState({modalBuyRating: false})
              this.setState({modalBuyRatingGot: 0})
            }}
          />
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', marginBottom: 30,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignSelf: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              this.setState({modalBuyRating: false})
              this.setState({modalBuyRatingGot: 0})
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{`${this.state.language._j == 'English' ? 'Ok' : 'Ок'}`}</Text>
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

        {this.state.modalToTheTop && <View
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            this.setState({modalToTheTop: false})
            this.setState({modalToTheTopGot: 0})
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
          {!this.state.loading ? <View style={{
            backgroundColor: 'white',
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.9,
            justifyContent: 'center',
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
              this.setState({modalToTheTop: false})
              this.setState({modalToTheTopGot: 0})
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%', marginBottom: 20 }}
            >{this.state.language._j == 'English' ? 'Boost to top' : 'Войти в топ'}</Text>
            {this.ListItem({text: this.state.language._j == 'English' ? "These boosts will elevate your rating to top levels for a whole day" : 'Эти бустеры на сутки поднимут ваш рейтинг до топовых значений'})}
            {this.ListItem({text: this.state.language._j == 'English' ? "You'll be front and center in Swipes and featured among the top profiles." : 'Вы будете на передовых местах в свайпах и в топ-профилях'})}
            <View
              style={{ width: '100%', marginTop: 20, marginBottom: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
            >
              <Text
                style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold' }}
              >{this.state.language._j == 'English' ? 'Balance: ' : 'Баланс: '}</Text>
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
                this.useBoostToTop()
              }
            }}
          >
            {/* <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{this.state.language._j == 'English' ? 'Buy' : 'Купить'}</Text> */}
              <Text
                style={{ fontSize: 20, color: '#fff', fontFamily: 'SftMedium' }}
              >{hasBoostsToTop > 0 ? this.state.language._j == 'English' ? 'Use' : 'Использовать' :
               this.state.language._j == 'English' ? 'Coming soon' : 'Скоро'}</Text>
          </TouchableOpacity>
          </View>
          {this.state.modalToTheTopGot != 0 && <View
            style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: '#172136', top: 0, left: 0 }}
          >
          <View
            style={{ flex: 1, alignItems: 'center', paddingTop: 30 }}
          >
          <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{this.state.language._j == 'English' ? "You're now at the top!" : 'Ты поднялся в топ!'}</Text>
            <View
              style={{ flexGrow: 1, justifyContent: 'center' }}
            >
            <Image
              source={require("../images/rocket.png")}
              style={{ height: SCREEN_WIDTH * 0.9 * 0.4, width:  SCREEN_WIDTH * 0.9 * 0.6}}
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
              this.setState({modalToTheTop: false})
              this.setState({modalToTheTopGot: 0})
            }}
          />
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', marginBottom: 30,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignSelf: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              this.setState({modalToTheTop: false})
              this.setState({modalToTheTopGot: 0})
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{`${this.state.language._j == 'English' ? 'Ok' : 'Ок'}`}</Text>
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

        {this.state.modalBuyPremium && <View
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            this.setState({modalBuyPremium: false})
            this.setState({modalBuyPremiumGot: 0})
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
          {!this.state.loading ? <View style={{
            backgroundColor: 'white',
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.9,
            justifyContent: 'center',
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
              this.setState({modalBuyPremium: false})
              this.setState({modalBuyPremiumGot: 0})
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%', marginBottom: 25 }}
            >{this.state.language._j == 'English' ? 'Premium' : 'Премиум'}</Text>
            {this.ListItem({text: this.state.language._j == 'English' ? "4 'Boost to top' boosts included in the bundle" : '4 бустера "Войти в топ" в комплекте'})}
            {this.ListItem({text: this.state.language._j == 'English' ? 'See all likes and message anyone without using in-game currency' : 'Просматривай все лайки и пиши любому пользователю без использования внутриигровой валюты'})}
            {this.ListItem({text: this.state.language._j == 'English' ? 'Your profile will get more visibility even without boosters' : 'Твой профиль будут видеть чаще даже без бустеров'})}
            
            <View
              style={{ width: '100%', marginTop: 20, marginBottom: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
            >
              <Text
                style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold' }}
              >{this.state.language._j == 'English' ? '30 days premium' : '1 месяц премиума: '}</Text>
            </View>
            <TouchableOpacity
            style={[{ backgroundColor: 'rgba(96, 131, 255, 0.5)', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 0}]}
            activeOpacity={0.8}
            onPress={() => {
              // this.recieveRating()
            }}
          >
            {/* <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{this.state.language._j == 'English' ? 'Buy' : 'Купить'}</Text> */}
              <Text
                style={{ fontSize: 20, color: '#fff', fontFamily: 'SftMedium' }}
              >{this.state.language._j == 'English' ? 'Coming soon' : 'Скоро'}</Text>
          </TouchableOpacity>
          </View>
          {this.state.modalBuyPremiumGot != 0 && <View
            style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: '#172136', top: 0, left: 0 }}
          >
          <View
            style={{ flex: 1, alignItems: 'center',
              justifyContent: 'center', paddingTop: 30 }}
          >
          <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{this.state.language._j == 'English' ? 'You got premium!' : 'Вы получили премиум!'}</Text>
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
              this.setState({modalBuyPremium: false})
              this.setState({modalBuyPremiumGot: 0})
            }}
          />
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', marginBottom: 30,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignSelf: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              this.setState({modalBuyPremium: false})
              this.setState({modalBuyPremiumGot: 0})
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{`${this.state.language._j == 'English' ? 'Ok' : 'Ок'}`}</Text>
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

        {this.state.modalBuyMuchRating && <View
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            this.setState({modalBuyMuchRating: false})
            this.setState({modalBuyMuchRatingGot: 0})
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
          {!this.state.loading ? <View style={{
            backgroundColor: 'white',
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.9,
            justifyContent: 'center',
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
              this.setState({modalBuyMuchRating: false})
              this.setState({modalBuyMuchRatingGot: 0})
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%', marginBottom: 20 }}
            >{this.state.language._j == 'English' ? 'Boost Rating' : 'Буст Рейтинг'}</Text>
            {this.ListItem({text: this.state.language._j == 'English' ? 'Your rating directly impacts how visible your profile is' : 'Рейтинг прямо пропорционально влияет на видимость вашего профиля'})}
            {this.ListItem({text: this.state.language._j == 'English' ? 'The higher your rating, the sooner other users will come across your profile' : 'Чем выше рейтинг - тем раньше ваш профиль будет попадаться другим пользователям'})}
            {this.ListItem({text: this.state.language._j == 'English' ? 'Purchased rating stays with you forever' : 'Купленный рейтинг останется с тобой навсегда'})}
            <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '100%', marginTop: 20, marginBottom: 25 }}
            >+10000 Rating</Text>
            <TouchableOpacity
            style={[{ backgroundColor: 'rgba(96, 131, 255, 0.5)', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 0}]}
            activeOpacity={0.8}
            onPress={() => {
              // this.recieveRating()
            }}
          >
              <Text
                style={{ marginLeft: 5, fontSize: 20, color: '#fff', fontFamily: 'SftMedium' }}
              >{this.state.language._j == 'English' ? 'Coming soon' : 'Скоро'}</Text>
          </TouchableOpacity>
          </View>
          {this.state.modalBuyMuchRatingGot != 0 && <View
            style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: '#172136', top: 0, left: 0 }}
          >
          <View
            style={{ flex: 1, alignItems: 'center',
              justifyContent: 'center', paddingTop: 30 }}
          >
          <Text
              style={{ textAlign: 'center', fontSize: 30, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{this.state.language._j == 'English' ? 'You got +10000 rating' : 'Вы получили +10000 рейтинга'}</Text>
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
              this.setState({modalBuyMuchRating: false})
              this.setState({modalBuyMuchRatingGot: 0})
            }}
          />
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', marginBottom: 30,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignSelf: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              this.setState({modalBuyMuchRating: false})
              this.setState({modalBuyMuchRatingGot: 0})
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{`${this.state.language._j == 'English' ? 'Ok' : 'Ок'}`}</Text>
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
        {this.state.modalErr && <View style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            this.setState({modalErr: false})
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
              this.setState({modalErr: false})
            }}
          />
            <Text
                style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', marginTop: 30 }}
              >{this.state.errType == 1 ? this.state.language._j == 'English' ? 'Not enough cash!' : 'Недостаточно средств' :
                this.state.errType == 2 && this.state.language._j == 'English' ? 'Error' : 'Ошибка'}</Text>
            <View style={{
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20,
              flexWrap: 'wrap', paddingHorizontal: 5
            }}>
              <Text
                style={{ textAlign: 'center', fontSize: 17, color: '#818C99', fontFamily: 'SftMedium' }}
              >{this.state.errText}</Text>
              {this.state.errType == 1 && <Image source={require('../images/dollar.png')} style={{ width: 20, aspectRatio: 1/1, marginLeft: 5 }} />}
            </View>
            
          </View>
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginTop: 20, width: '80%',
            marginBottom: 35, alignSelf: 'center', shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              this.setState({modalErr: false})
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{this.state.language._j == 'English' ? 'Close' : 'Закрыть'}</Text>
          </TouchableOpacity>
          </View>
        </View>
        </View>}
      </Modal>
      </View>
    );
  }
}

export default Swipes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});