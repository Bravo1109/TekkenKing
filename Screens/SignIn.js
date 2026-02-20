import React, {useState, useEffect, useRef} from 'react'
import { StyleSheet, Text, Image, View, FlatList, Alert, Modal, TouchableOpacity, Keyboard,
        ActivityIndicator, Dimensions, Platform } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import {TextInput, Button, IconButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from './config';
import { Shadow } from 'react-native-shadow-2';
import * as Font from 'expo-font';
import { useHeaderHeight } from '@react-navigation/elements';


function SignIn(props) {
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
  const headerHeight = useHeaderHeight();
  const [fontsLoaded, setfFontsLoaded] = useState(false)
  const _loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setfFontsLoaded(true);
  }
  _loadFontsAsync()
    let status = 0
    const [language, setLanguage] = useState('')
    const isFocused = useIsFocused();
    const SCREEN_HEIGHT = Dimensions.get('window').height
    const SCREEN_WIDTH = Dimensions.get('window').width
    const [data, setData] = useState([])
    // const expoToken = props.route.params.expoPushToken
    let token = ""
    const [email, setEmail] = useState("")
    const [emailReset, setEmailReset] = useState("")
    const [password, setPassword] = useState("")
    const [modal, setModal] = useState(false)
    const [modalError, setModalError] = useState(false)
    const [modalLanguage, setModalLanguage] = useState(false)
    const [errText, setErrText] = useState('')
    const [activateAccount, setActivateAccount] = useState(false)
    const [loadingActivate, setLoadingActivate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [logLoading, setLogLoading] = useState(false)
    const clickedItem = () => {
        props.navigation.navigate("StartScreen")
      }
    const loadData = () => {
        setLoading(true)
        setLogLoading(true)
        fetch(`${BASE_URL}/api/auth/token/login/`, {
          method:"POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
            password: password
          })
        }).then((resp) => {
            status = resp.status
            return resp.json()
        })
        .then(data => {
          console.log(status)
          setData(data)
          token = `Token ${data.auth_token}`
          console.log(data)
          if (status == 200) {
            writeTokenData(token)
            getTokenData()
            clickedItem()
            setLoading(false)
            setLogLoading(false)
          }
          if (status == 400) {
            let text = ''
            console.log(data.non_field_errors)
            if (data.non_field_errors) { 
              if (data.non_field_errors == 'Your account is not activated. Please check your email for activation link or request a new one.') {
                setErrText(language == 'English' ? data.non_field_errors : 'Ваш имейл еще не подтвержден. При регистрации вам на почту было отправлено письмо с ссылкой на активацию аккаунта. Проверьте свою электронную почту или запросите новое письмо нажав "Отправить снова".')
                setActivateAccount(true)
              } else if (data.non_field_errors == 'Unable to log in with provided credentials.') {
                setErrText(language == 'English' ? data.non_field_errors : 'E-mail или пароль введены не верно')
              }
            } else if (data.email) {
              if (data.email == 'Enter a valid email address.') {
                setErrText(language == 'English' ? ('E-mail: ' + data.email) : 'E-mail: Введите действительный адрес электронной почты.')
              } else {
                setErrText(language == 'English' ? ('E-mail: ' + data.email) : 'E-mail: это поле не может быть пустым')
              }
            } else if (data.password) {
              setErrText(language == 'English' ? ('Password: ' + data.password) : 'Пароль: это поле не может быть пустым')
            }
            // for (let i = 0; i < Object.keys(data).length; i++) {
            //   const key = Object.keys(data)[i];
            //   const value = Object.values(data)[i];
            //   text += `${key}: `
            //   text += `${value} `
            // }
            // alert(text)
            setModalError(true)
            setLoading(false)
            setLogLoading(false)
          }
        })
        .catch(error => {
          console.log("Error", error)
          setLoading(false)
          setLogLoading(false)
        })
      }
      
      const forgotPassword = () => {
        fetch(`${BASE_URL}/api/auth/users/reset_password/`, {
            method:"POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: emailReset
            })
          }).then((resp) => {
            if (resp.status == 204) {
              console.log('sent')
              setModal(false)
              alert(language == 'English' ? 'reset link sent on your email' : 'Ссылка на восстановление пароля отправлена на указанную почту')
            }
            else {
              setLoading(false)
              alert('Something going wrong')
            }
            setLoading(false)
          }).catch(error => {
            console.log("Error", error)
            setLoading(false)
            alert('Error: ', error)
          })
      }

      const resendActivation = () => {
        setLoadingActivate(true)
        fetch(`${BASE_URL}/api/auth/users/resend_activation/`, {
            method:"POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: email
            })
          }).then((resp) => {
            if (resp.status == 204) {
              setModalError(false)
              setActivateAccount(false)
              setLoadingActivate(false)
              alert(language == 'English' ? 'activation link sent on your email' : 'Активационное письмо отправлено вам на почту')
            }
            else {
              setLoadingActivate(false)
              alert(language == 'English' ? 'Something went wrong' : 'что то пошло не так')
            }
          }).catch(error => {
            console.log("Error", error)
            alert('Error: ', error)
            setLoadingActivate(false)
          })
      }

      writeTokenData = async (value) => {
        try {
            await AsyncStorage.setItem('token', value)
        } catch(e) {
            console.log('error', e)
        }
        console.log('Done', value)
      }
      getTokenData = async () => {
        try {
            tokenData = await AsyncStorage.getItem('token')
            console.log('Get Done', tokenData)
            return tokenData
        } catch(e) {
            console.log('error', e)
        }
        
      }
      const getLanguageData = async () => {
        try {
            const languageData = await AsyncStorage.getItem('language')
            console.log(languageData)
            languageData != null ? setLanguage(languageData) : (setModalLanguage(true), setLanguage('English'))
            return languageData
        } catch(e) {
            setLanguage('Russian')
            console.log('error', e)
        }
      }
      const writeLanguageData = async (value) => {
        try {
            await AsyncStorage.setItem('language', value)
        } catch(e) {
            console.log('error', e)
        }
        // console.log('Done', value)
      }
      const removeTokenData = async () => {
        await AsyncStorage.removeItem('token');
      }
      useEffect(() => {
        getLanguageData()
      }, [isFocused])

      useEffect(() => {
        props.navigation.setOptions({ title: language == 'English' ? 'Sign in' : 'Вход' })
      }, [language])

    return (
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#172136', paddingTop: headerHeight }}
          activeOpacity={1}
          onPress={Keyboard.dismiss}
        >
            <Text style={{ marginLeft: 10, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', marginTop: 20, fontFamily: fontsLoaded ? 'SftLight' : ''  }}>E-mail</Text>
            <TextInput style = {styles.inputStyle}
                autoCapitalize='none'
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholder={language == 'English' ? 'Enter your e-mail' : 'Введите e-mail'}
                placeholderTextColor={'#818C99'}
                value={email}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {email => setEmail(email)}
            />
            <Text style={{ marginLeft: 10, fontSize: 17, color: '#6D7885', marginTop: 10, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : '' }}>{language == 'English' ? 'Password' : 'Пароль'}</Text>
            <TextInput style = {styles.inputStyle}
                secureTextEntry={true}
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholder={language == 'English' ? 'Password' : 'Ваш пароль'}
                placeholderTextColor={'#818C99'}
                value={password}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {password => setPassword(password)}
            />
          <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              Keyboard.dismiss()
              loadData();
              
          }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: fontsLoaded ? 'SftMedium' : '' }]}>{language == 'English' ? 'Sign in' : 'Войти'}</Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Button style={{margin:0}}
                mode = 'text'
                labelStyle={{ fontSize: 17, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : '' }}
                textColor='#6083FF'
                onPress={() => {
                  setModal(true)
                }}
            >{language == 'English' ? 'Forgot password' : 'Не помню пароль'}</Button>
            </View>
            <Text 
              style={{textAlign: 'center', color: '#8E8E93', fontSize: 19, fontWeight: '300',
              marginTop: 30, fontFamily: fontsLoaded ? 'SftLight' : ''}}
            >{language == 'English' ? "Don't have an account?" : 'Еще нет аккаунта?'}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            
            <Button style={{margin:0}}
                mode = 'text'
                labelStyle={{ fontSize: 17, fontWeight: '300', fontFamily: fontsLoaded ? 'SftLight' : '' }}
                textColor='#6083FF'
                onPress={() => {
                  props.navigation.navigate("Signup")
                }}
            >{language == 'English' ? 'Sign up' : 'Регистрация'}</Button>

            
            </View>
            
        <Modal
        transparent={true}
        animationType='fade'
        visible={modal}
        statusBarTranslucent={true}
        >
        <View style={{
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'flex-end'
        }}>
          <TouchableOpacity onPress={() => {
            setModal(false)
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.6,
            position:'absolute',
            left: 0,
            top: 0,
            zIndex: 0
          }}
          activeOpacity={0.6}
          >
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '100%', height: '90%', backgroundColor: '#172136',
            borderRadius: 10, bottom: 0 }}
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss()
            }}
          >
            <IconButton
            size={20}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25,
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModal(false)
            }}
          />
          <Text style={{ marginHorizontal: 10, fontSize: 17, color: '#6D7885', marginVertical: 15, fontFamily: fontsLoaded ? 'SftLight' : '' }}>{language == 'English' ? 'We will send a message for password reset on your e-mail' : 'Мы вышлем сообщение для смены пароля на ваш e-mail'}</Text>
            <TextInput style = {styles.inputStyle}
                placeholder={language == 'English' ? 'Enter your e-mail' : 'Введите ваш e-mail'}
                placeholderTextColor={'#818C99'}
                value={emailReset}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 10, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {emailReset => setEmailReset(emailReset)}
            />

            <TouchableOpacity
              style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, margin: 10, marginVertical: 18,
              shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
              Platform.OS === 'android' && {elevation: 2}]}
              activeOpacity={0.8}
              onPress={() => {
                if (emailReset != '' && emailReset != ' ') {
                  setLoading(true)
                  forgotPassword()
                  
                }
                else {
                  language == 'English' ? alert('Enter your email!') : alert('Введите ваш e-mail')
                }
                Keyboard.dismiss()
              }}
            >
              <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Send' : 'Отправить'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          {loading && <View style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          <TouchableOpacity onPress={() => {
            setModal(false)
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.4,
            position:'absolute',
            left: 0,
            top: 0,
            zIndex: 0
          }}
          activeOpacity={0.9}
          >
            
          </TouchableOpacity>
          <ActivityIndicator
            color={'#000'}
          /> 
          </View>}
        </View>
      </Modal>

      {logLoading && <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1000000000,
            width: '100%',
            height: SCREEN_HEIGHT,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          <TouchableOpacity
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
          activeOpacity={0.9}
          >
            </TouchableOpacity>
          <View style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          <ActivityIndicator
            color={'#aaa'}
          /> 
          </View>
        </View>}

      <Modal
        transparent={true}
        animationType='fade'
        visible={modalError}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            setModalError(false)
            setActivateAccount(false)
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.8,
            position:'absolute',
            left: 0,
            zIndex: 0
          }}
          activeOpacity={0.8}
          >
          </TouchableOpacity>
          <View style={{
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.9,
            // minHeight: SCREEN_WIDTH * 0.9,
            justifyContent: 'center',
            overflow:'hidden'
          }}>
            {loadingActivate && <View
              style={{ position: 'absolute', width: '100%', height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 100,
                justifyContent: 'center' }}
            >
              <ActivityIndicator
                color={'#fff'}
              />
            </View>}
          <View
            style={{flexGrow: 1, backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          >
            
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setModalError(false)
              setActivateAccount(false)
            }}
          />
          <View
            style={{ flexGrow: 1 }}
          >
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold' }}
            >{language == 'English' ? 'Oops...' : 'Упс...'}</Text>
            <Text
              style={{ color: '#fff', fontFamily: 'SftMedium', marginTop: 10,
                 paddingHorizontal: 15, width: SCREEN_WIDTH * 0.9, fontSize: 17 }}
            >{errText}</Text>
            </View>
            {activateAccount && <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', marginTop: 20, borderRadius: 12, paddingVertical: 15,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              resendActivation()
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Send again' : 'Отправить снова'}</Text>
          </TouchableOpacity>}
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', marginTop: 20, borderRadius: 12, paddingVertical: 15,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setModalError(false)
              setActivateAccount(false)
              Keyboard.dismiss
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Ok' : 'Ок'}</Text>
          </TouchableOpacity>
          </View>
          </View>
        </View>
    </Modal>



    <Modal
        transparent={true}
        animationType='fade'
        visible={modalLanguage}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.8,
            position:'absolute',
            left: 0,
            zIndex: 0
          }}
          activeOpacity={0.8}
          >
          </TouchableOpacity>
          <View style={{
            borderRadius: 15,
            width: SCREEN_WIDTH * 0.95,
            // minHeight: SCREEN_WIDTH * 0.9,
            justifyContent: 'center',
            overflow:'hidden'
          }}>
          <View
            style={{flexGrow: 1, backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30 }}
          >
            
          <View
            style={{ flexGrow: 1 }}
          >
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold' }}
            >{language == 'English' ? 'Choose language' : 'Выбрать язык'}</Text>
            <View
              style={{ flexDirection: 'row',  justifyContent: 'center', marginTop: 20 }}
            >
              <TouchableOpacity
                style={[{ width: SCREEN_WIDTH * 0.42, marginRight: SCREEN_WIDTH * 0.02 },
                  language == 'English' && {shadowColor: '#fff', shadowOffset: {width: 0, height: 0},
                   shadowOpacity: 1, shadowRadius: 6
                 }]}
                activeOpacity={0.7}
                onPress={() => {
                  setLanguage('English')
                }}
              >
                {Platform.OS === 'android' && language == 'English' && <Shadow
                distance={6}
              startColor='rgba(255, 255, 255, 0.7)'
              style={[{ borderRadius: 15, width: SCREEN_WIDTH * 0.42, height: SCREEN_WIDTH * 0.42,
                 marginRight: SCREEN_WIDTH * 0.02, position: 'absolute', },
                ]}
              />}
                <View
                  style={{ width: SCREEN_WIDTH * 0.42, height: SCREEN_WIDTH * 0.42, borderRadius: 15, overflow: 'hidden' }}
                >
                  <Image
                    style={{ width: '100%', height: '100%' }}
                    source={require('../images/en_lang.jpeg')}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[{ width: SCREEN_WIDTH * 0.42, marginLeft: SCREEN_WIDTH * 0.02 },
                  language == 'Russian' && {shadowColor: '#fff', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 6
                 }]}
                activeOpacity={0.7}
                onPress={() => {
                  setLanguage('Russian')
                }}
              >
                {Platform.OS === 'android' && language == 'Russian' && <Shadow
                distance={6}
              startColor='rgba(255, 255, 255, 0.7)'
              style={[{ borderRadius: 15,width: SCREEN_WIDTH * 0.42, height: SCREEN_WIDTH * 0.42, marginRight: SCREEN_WIDTH * 0.02, position: 'absolute' },
                ]}
              />}
                <View
                  style={{ width: SCREEN_WIDTH * 0.42, height: SCREEN_WIDTH * 0.42, borderRadius: 15, overflow: 'hidden' }}
                >
                  <Image
                    style={{ width: '100%', height: '100%' }}
                    source={require('../images/ru_lang.jpeg')}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Text
              style={{ color: '#fff', textAlign: 'center', marginTop: 10,
                 fontFamily: 'SftBold', fontSize: 17 }}
            >{language == 'English' ? language : 'Русский'}</Text>
            </View>
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', marginTop: 20, borderRadius: 12, paddingVertical: 15,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              writeLanguageData(language)
              setModalLanguage(false)
              Keyboard.dismiss
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Ok' : 'Ок'}</Text>
          </TouchableOpacity>
          </View>
          </View>
        </View>
    </Modal>

      {/* {loading && <View
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', width: '100%', height: SCREEN_HEIGHT - 90, position: 'absolute',
      left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
    >
              <ActivityIndicator 
                color={'#aaa'}
              />  
    </View>}  */}
      
        </TouchableOpacity>
      )
    }
    
    const styles = StyleSheet.create({
        inputStyle: {
            padding:2,
            margin:10,
            marginVertical: 5,
            fontSize: 19,
            fontWeight: '300'
        }
    })

export default SignIn