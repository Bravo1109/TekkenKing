import React, { useState, useEffect, useRef } from 'react'
import { Text, View, ActivityIndicator, Modal,
  TouchableOpacity, KeyboardAvoidingView, ImageBackground,
  ScrollView, Dimensions, StyleSheet, Platform, TextInput,
  Animated, Keyboard, AppState } from 'react-native';
import { Image } from 'expo-image';
import { CommonActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IconButton } from 'react-native-paper'; 
import { BlurView } from 'expo-blur'
import Pen from '../images/pen.svg'
import TrashIcon from '../images/trash.svg'
import ArrowLeft from '../images/arrow_up_left.svg'
import { BASE_URL } from './config';
import { openBrowserAsync } from 'expo-web-browser';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowBack from '../images/turnBack.svg'
import ArrowDown from '../images/arrowDownSign.svg'
import { Picker } from '@react-native-picker/picker';

function Store(props) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const secondListRef = useRef(null);
  const [language, setLanguage] = useState('')
  const [messageSent, setMessageSent] = useState(false)
  const isFocused = useIsFocused();
  const [appState, setAppState] = useState(AppState.currentState)
  const [commentsData, setCommentsData] = useState([])
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [choosenItem, setChoosenItem] = useState(0)
  const SCREEN_WIDTH = Dimensions.get('window').width
  const SCREEN_HEIGHT = Dimensions.get('window').height
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight({ SCREEN_WIDTH, SCREEN_HEIGHT }, Platform.OS, insets.top) - 10
  const [text, setText] = useState("")
  const [modal, setModal] = useState(false)
  const [modalCash, setModalCash] = useState(false)
  const [storeData, setStoreData] = useState(props.route.params.data)
  const [loading, setLoading] = useState(true);
  const [loadingChange, setLoadingChange] = useState(false)
  const token = getTokenData()
  const colorAnim = useRef(new Animated.Value(0)).current;
  const [modalChange, setModalChange] = useState(false)
  const [changeTitle, setChangeTitle] = useState('')
  const [changeDesc, setChangeDesc] = useState('')
  const [changePhones, setChangePhones] = useState('')
  const [changeMail, setChangeMail] = useState('')
  const [changeLpr, setChangeLpr] = useState('')
  const [changeLink, setChangeLink] = useState('')
  const [changeStatus, setChangeStatus] = useState('')
  const [changeStatusModal, setChangeStatusModal] = useState(false)

  const {id} = props.route.params.id
  const loadstoreData = () => {
    setLoading(true)
    fetch(`${BASE_URL}/api/stores/${id}/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      setChangeTitle(res.title)
      setChangeDesc(res.description)
      setChangePhones(res.telephone)
      setChangeMail(res.mail)
      setChangeLpr(res.lpr)
      setChangeLink(res.link)
      setChangeStatus(res.status)
      setStoreData(res)
      setCommentsData(res.comments)
      setLoading(false)
      setModalCash(false)
    })
    .catch(error => {
      console.log("Error", error)
      setLoading(false)
      setModalCash(false)
    })
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState)
    });

    return () => {
      subscription.remove();
    }
  }, []);
  useEffect(() => {
    const listenerId = scrollX.addListener(({ value }) => {
      if (secondListRef.current) {
        secondListRef.current.scrollToOffset({
          offset: value,
          animated: false, // можно поставить true, если нужна плавность
        });
      }
    });
    // В конце убираем подписку
    return () => {
      scrollX.removeListener(listenerId);
    };
  }, [scrollX]);

  const sendComment = () => {
    let status = 0
    fetch(`${BASE_URL}/api/stores/${id}/comment/`, {
        method:"POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${token._j}`
        },
        body: JSON.stringify({
          text: text.trim(),
          store: id
        })
        }).then((resp) => {
          if(resp.status == 201 && text != '') {
            status = 201
            setLoading(false)
            setModal(false)
            loadstoreData()
            return resp.json()
          } else if(resp.status == 404) {
            alert('Ошибка')
            setModal(false)
            setLoading(false)
          }
        }).then((resp) => {
          // if(status == 201 && text != '') {
          //   for (let i = 0; i < tokens.length; i++) {
          //   // const element = tokens[i];
          //     sendPushNotification(tokens[i], id, 'New Message!', text, (`${BASE_URL}` + resp.sender_photo), 0, 'ChatList')
          //   }
          // }
        }).catch(error => {
            console.log('error', error)
            alert('Что-то пошло не так')
            setModal(false)
            setLoading(false)
          })
        }
  
  const deleteComment = (comment_id) => {
    setLoadingDelete(true)
    fetch(`${BASE_URL}/api/stores/${id}/comment/${comment_id}/`, {
        method:"DELETE",
        headers: {
          'Authorization': `${token._j}`
        }
      }).then((res) => {
        if(res.status == 204) {
          const newCommentsData = commentsData.filter(item => item.id !== comment_id);
          setCommentsData(newCommentsData);
          setLoadingDelete(false)
          setChoosenItem(0)
          // setDeleted(true)
        }
      }).catch(error => {
        setLoadingDelete(false)
        setChoosenItem(0)
        console.log("Error del", error)
      })
  }

  // const sendPushNotification = async (token, id, title, body, photo, blur, screen) => {
  //   const message = {
  //     to: 'ExponentPushToken[S173PYN94WQXYlY_3w9hYv]',
  //     sound: 'default',
  //     title: 'Original Title',
  //     body: 'And here is the body!',
  //     data: { recipient_id: id, userPhoto: photo, screen: screen },
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


  const handlePress = async (url) => {
      let result = await openBrowserAsync(url);
      console.log(result);
      if(result.type == 'locked') {
        alert('Ссылка не действительна')
      }
  };

  getTokenData = async () => {
    try {
        tokenData = await AsyncStorage.getItem('token')
        return tokenData
    } catch(e) {
        console.log('error', e)
    }
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
          loadstoreData()
        }
      })
  }, [isFocused])

  const changeStore = () => {
    setLoadingChange(true)
    fetch(`${BASE_URL}/api/stores/${id}/`, {
      method:"PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${token._j}`,
      },
      body: JSON.stringify({
        title: changeTitle,
        description: changeDesc,
        status: changeStatus,
        telephone: changePhones,
        mail: changeMail,
        lpr: changeLpr,
        link: changeLink
      })
    }).then((resp) => {
        status = resp.status
        return resp.json()
    })
    .then(datas => {
      if (status == 200) {
        setLoadingChange(false)
        setModalChange(false)
        loadstoreData()
      } else if (status == 403) {
        setLoadingChange(false)
        alert('Действие запрещено!')
      } else {
        setLoadingChange(false)
        alert('Ошибка! Название магазина и ссылка не могут быть пустыми')
      } 
    })
    .catch(error => {
      console.log("Error", error)
      setLoadingChange(false)
    })
  }

  const renderCommentsData = () => {
    const data = commentsData
    return data.map((item, i) => {
      return(
        <View
          key={item.id} 
          style={{width: '100%', marginTop: 15}}>
        <View style={{flexDirection:"row", alignItems: 'flex-start', width: '100%'}}>
        <ImageBackground
          resizeMode='contain'
          style={{width: 50, aspectRatio: 1/1, overflow: 'hidden', backgroundColor: '#0F1825',
          borderRadius: 100}}
          >
            {item.user.photos.length > 0 && <Image
              style={{width:'100%', height:'100%', opacity: 1}}
              cachePolicy={'disk'}
              source={{
               uri: `${BASE_URL}${item.user.photos[0].compressed_image_url}`
              }}
             />}
        </ImageBackground>
        
          <View
            style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10, alignItems: 'flex-start', justifyContent: 'flex-start', width: SCREEN_WIDTH * 0.9 - 110}}
          >
            <Text
             numberOfLines={1}
             style = {{fontSize:15, color: '#fff', fontFamily: 'SftBold', maxWidth: SCREEN_WIDTH * 0.9 - 110}}>
              {item.user.name}</Text>
            <Text
             style = {{fontSize:15, color: '#fff', fontFamily: 'SftMedium'}}>
              {item.text}</Text>
          </View>
          {item.user.id == storeData.myId && <TouchableOpacity
            onPress={() => {
              deleteComment(item.id)
              setChoosenItem(item.id)
            }}
          >
            {loadingDelete && choosenItem == item.id ? <ActivityIndicator /> :
            <TrashIcon width={30} height={30} color={'tomato'} />}
          </TouchableOpacity>}
        </View>
      </View>
      )
  })
    }

  if(!storeData) {
    return(
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#172136',
      }}>
        <ActivityIndicator />
      </View>
    )
  };
  return (
    <View style={{ flex:1, backgroundColor: '#172136', width: '100%'}}>
      <TouchableOpacity
        onPress={() => {
            props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key})); 
        }}
        style={{left: 20, top: 50, borderRadius: 100, width: 40, height: 40,
          alignItems: 'center', justifyContent: 'center', zIndex: 11111, position: 'absolute',
          backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1, elevation: 3 }}
        activeOpacity={1}
        >
          <ArrowLeft width={30} height={30} fill={'#2688EB'} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setModalChange(true)
        }}
        style={{position: 'absolute', zIndex: 11111, right: 20, top: 50, borderRadius: 100, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', 
          backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: {width: 0, height: 0}, shadowRadius: 1 }}
        activeOpacity={1}
        >
          <Pen width={20} height={20} fill={'#2688EB'} />
      </TouchableOpacity>
          
      <View style={{ width: '100%', height: 90, backgroundColor: '#0F1421',
        position: 'absolute', bottom: 0, zIndex: 100, alignItems: 'center' }}>
        <View style={{ width: '90%', marginTop: 10 }}>
        <TouchableOpacity
          onPress={() => {
              setModal(true)
          }}
          style={[{ borderWidth: 1, borderColor: '#90A9FF', borderRadius: 100, paddingVertical: 12, backgroundColor: '#0F1421',
          shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.8, shadowRadius: 5 }, 
          Platform.OS === 'android' && {elevation: 3}]}
          activeOpacity={0.8}
          >
          <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Comment' : 'Комментировать'}</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    <ScrollView
    keyboardShouldPersistTaps='handled'
    contentContainerStyle={{alignItems: 'center', flexGrow: 1, width: '100%', backgroundColor: '#172136'}}
    scrollIndicatorInsets={{right: 1}}
    showsVerticalScrollIndicator={false}
     >
      <View style={{width:'100%', height: 0.5 * SCREEN_HEIGHT}}>
        <ImageBackground
        resizeMode='contain'
        style={{width:'100%', height: '100%'}}
        >
          {storeData.compressed_image_url && (
          <View>
          <View style={{ zIndex: 100, width: '100%', height: 120, position: 'absolute', opacity: 0.5 }}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']}
              start={{
                x:0,
                y:0
              }}
              end={{
                x:0,
                y:1
              }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          <View style={{ width: SCREEN_WIDTH, height: '100%' }}>
      <TouchableOpacity
        activeOpacity={1}
      >
          <ImageBackground
            resizeMode='contain'
            style={{width:'100%', height: '100%', backgroundColor: '#000',
            position: 'absolute', alignItems: 'center', justifyContent: 'center'}}
          >
          <Image
            style={{width: 30, height: 30, backgroundColor: 'black'}}
            source={require('../images/onload.gif')}
          />
          </ImageBackground>
          <Image
            style={{width:'100%', height: '100%', backgroundColor: 'transparent'}}
            cachePolicy={'disk'}
            source={{
              uri: `${BASE_URL}${storeData.compressed_image_url}`
            }}
          />
        </TouchableOpacity>
      </View></View>)}
        </ImageBackground>
        <View
          style={{ position: 'absolute', bottom: 20, left: 10, borderRadius: 100, overflow: 'hidden' }}
          >
          <BlurView
              intensity={30}
              tint='extraLight'
          >
            {Platform.OS === 'android' && <Image
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.5, position: 'absolute', bottom: -20, left: -10 }}
            cachePolicy={'disk'}
            source={{
              uri: `${BASE_URL}${storeData.compressed_image_url}`
              }}
            blurRadius={10}
          />}
          {Platform.OS === 'android' && <View
            style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          />}
            <View style={{  flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 17 }}>
              {/* <CircleStar width={15} height={15} fill='#fff' /> */}
              <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'SftBold', lineHeight: 24, }}>{storeData.status}</Text>
            </View>
          </BlurView>
          </View>
        
        </View>
        
        <View style={{ width: '90%', marginBottom: 100, paddingHorizontal: 5 }}>
        {storeData.title && <Text style={[{fontSize:30, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff', fontFamily: 'SftBold',
        marginTop: 20, marginBottom: 8, textAlign: 'center'}]}>{storeData.title}</Text>}
          <Text
           style={{ color: '#fff', width: '100%', fontSize: 17, fontFamily: 'SftMedium', marginBottom: 10 }}
           numberOfLines={12}
          >{storeData.description != '' ? storeData.description : 'Нет описания'}</Text>
          <Text style={[{fontSize:25, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff', fontFamily: 'SftBold',
          marginTop: 10, marginBottom: 5,}]}>Телефоны</Text>
          <Text
           style={{ color: '#fff', width: '100%', fontSize: 17, fontFamily: 'SftMedium', marginBottom: 10 }}
           numberOfLines={12}
          >{storeData.telephone != '' ? storeData.telephone : 'не указан'}</Text>
          <Text style={[{fontSize:25, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff', fontFamily: 'SftBold',
          marginTop: 10, marginBottom: 5,}]}>E-mail</Text>
          <Text
           style={{ color: '#fff', width: '100%', fontSize: 17, fontFamily: 'SftMedium', marginBottom: 10 }}
           numberOfLines={12}
          >{storeData.mail != '' ? storeData.mail : 'не указан'}</Text>
          <Text style={[{fontSize:25, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff', fontFamily: 'SftBold',
          marginTop: 10, marginBottom: 5,}]}>ЛПР</Text>
          <Text
           style={{ color: '#fff', width: '100%', fontSize: 17, fontFamily: 'SftMedium', marginBottom: 10 }}
           numberOfLines={12}
          >{storeData.lpr != '' ? storeData.lpr : 'не указан'}</Text>
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginTop: 12,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
                handlePress(storeData.link)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Link' : 'Ссылка'}</Text>
          </TouchableOpacity>
          {storeData.title && <Text style={[{fontSize:30, width: '100%', fontWeight: '600', color: '#fff', shadowColor: '#fff', fontFamily: 'SftBold',
        marginTop: 20, marginBottom: 8}]}>Комментарии</Text>}
        {storeData.comments && storeData.comments.length > 0 ?
        renderCommentsData()
        : <Text
           style={{ color: '#fff', width: '100%', fontSize: 17, fontFamily: 'SftMedium', marginBottom: 10 }}
           numberOfLines={12}
          >Комментариев пока нет...</Text>}
        </View>
        

        <Modal
        transparent={true}
        animationType='fade'
        visible={modal}
        statusBarTranslucent={true}
        >
        {!loading ? <KeyboardAvoidingView style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -70 : -1000}
        >
            
          <TouchableOpacity onPress={() => {
            setMessageSent(false)
            setModal(false)
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.9,
            position:'absolute',
            left: 0,
            top: 0,
            zIndex: 0
          }}
          activeOpacity={0.9}
          >
          </TouchableOpacity>
          {!messageSent ? <View style={{
            borderRadius: 20,
            width: '95%',
            overflow:'hidden',
            backgroundColor: '#172136',
          }} 
          >
            
            <Text
              style={{ textAlign: 'center', color: '#fff', fontSize: 25, marginTop: 30, fontFamily: 'SftBold' }}
            >{language == 'English' ? 'Comment' : 'Комментарий'}</Text>
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setMessageSent(false)
              setModal(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', color: '#fff', fontSize: 17, marginTop: 15, fontWeight: '300', color: '#818C99', fontFamily: 'SftLight'}}
            >{language == 'English' ? 'to' : 'к'} <Text style={{ fontWeight: '600', fontFamily: 'SftBold' }}>{storeData.title}</Text></Text>
          <View style={{
            width: '100%',
            overflow:'hidden'
          }} onPress={() => setModal(false)}>
            <Text style={{ marginLeft: 20, fontSize: 17, color: '#6D7885', fontWeight: '300', marginTop: 20, fontFamily: 'SftLight'  }}>{language == 'English' ? 'Your comment' : 'Ваш комментарий'}</Text>
            <TextInput
            style = {{
              marginHorizontal:20,
              borderRadius: 13,
              marginTop: 10,
              paddingTop: 17,
              paddingBottom: 17,
              paddingHorizontal: 10,
              color: '#fff',
              fontSize: 17,
              fontWeight: '300',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              maxHeight: 120}}
            removeClippedSubviews={false}
            placeholder={language == 'English' ? 'Enter the text' : 'Введите текст'}
            placeholderTextColor={'#818C99'}
            multiline={true}
            value={text}
            mode = "outlined"
            textColor='#fff'
            selectionColor='#818C99'
            // outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            onChangeText = {text => setText(text)}
            />
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, marginHorizontal: 20, marginTop: 20,
            marginBottom: 40, shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              if (text.trim() != '') {
                setLoading(true)
                sendComment()
                setText('')
              }
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Send' : 'Отправить'}</Text>
          </TouchableOpacity>
          </View>
          </View> :
          <View style={{
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.9,
            minHeight: SCREEN_WIDTH * 0.9,
            justifyContent: 'flex-end',
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
              setMessageSent(false)
              setModal(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'Nice' : 'Отлично'}</Text>
            <Text
              style={{ textAlign: 'center', fontSize: 17, color: '#818C99', fontFamily: 'SftLight',
               width: '80%', marginTop: 10 }}
            >{language == 'English' ? 'The comment created' : 'Комментарий создан'}</Text>
            <Image
              source={require('../images/chatOpen.png')}
              style={{ width: '50%', aspectRatio: 1/1, overflow: 'visible', marginVertical: 10 }}
            />
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setMessageSent(false)
              setModal(false)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>ОК</Text>
          </TouchableOpacity>
          </View>
          </View>}
        </KeyboardAvoidingView> : 
        <View
        style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.9)',
        left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator 
          color={'#fff'}
        />  
      </View>}
    </Modal>

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
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Change' : 'Редактировать'}</Text>
                </View>
                <TouchableOpacity
                onPress={() => {
                  changeStore()
                }}
                style={{ width: '20%' }}
                activeOpacity={1}
            >
                <Text style={{ fontSize: 20, fontWeight: '300', color: '#6083FF', textAlign: 'center', fontFamily: 'SftLight'}}>Save</Text>
            </TouchableOpacity>
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
    </ScrollView>
    </View>
      )
}

const styles = StyleSheet.create({
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

export default Store