import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Image, View, KeyboardAvoidingView, ScrollView, Dimensions,
   FlatList, TouchableOpacity, ActivityIndicator, Modal, Platform,
   Keyboard} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {TextInput, IconButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions, useIsFocused } from "@react-navigation/native";
import { BASE_URL } from './config';
import IconCheck from '../images/icon-check.svg'
import { toInteger } from 'lodash';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeft from '../images/turnBack.svg'


function SignUp(props) {
    let status = 0
    const [language, setLanguage] = useState('')
    const isFocused = useIsFocused();
    const SCREEN_HEIGHT = Dimensions.get('window').height
    const SCREEN_WIDTH = Dimensions.get('window').width
    const insets = useSafeAreaInsets();
    const bottomHeight = getDefaultHeaderHeight({ SCREEN_WIDTH, SCREEN_HEIGHT }, Platform.OS, insets.bottom)
    const headerHeight = getDefaultHeaderHeight({ SCREEN_WIDTH, SCREEN_HEIGHT }, Platform.OS, insets.top) - 10
    const sex = props.route.params.selected
    const date = props.route.params.date
    const name = props.route.params.name
    const city = props.route.params.city
    const cityName = props.route.params.cityName
    const birthDate = new Date(props.route.params.date); 
    const now = new Date();
    const promocodeId = props.route.params.promocodeId
    const referal = props.route.params.referal
    const formData = props.route.params.formData
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')
    const [cityId, setCityId] = useState()
    const [email, setEmail] = useState('')
    const [modalErr, setModalErr] = useState(false)
    const [modalRegistrated, setModalRegistrated] = useState(false)
    const [errText, setErrText] = useState('')
    const [loading, setLoading] = useState(false);
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();

    // Если месяц или день рождения ещё не наступили в текущем году, уменьшаем возраст на 1
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
      age--;
    }
    const modalErrClose = () => {
      setModalErr(false)
    }

    const registration = () => {
        setLoading(true)
        setModalErr(true)
        formData.append('email', email.toLowerCase());
        formData.append('password', password);
        formData.append('sex', sex);
        formData.append('name', name);
        formData.append('birth_date', date);
        formData.append('city', city);
        // formData.append('username', username);
        promocodeId != 0 && formData.append('promocode', promocodeId);
        referal != '' && formData.append('referal', referal);
        fetch(`${BASE_URL}/api/users/`, {
          method:"POST",
          headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'multipart/form-data'
          },
          
            body: formData
        }).then((resp) => {
            status = resp.status
            return resp.json()
        })
        .then(datas => {
          if (status == 201) {
            setModalErr(false)
            setTimeout(() => {
              setModalRegistrated(true)
            }, 500)
          } else if (status == 400) {
            setLoading(false)
            let text = ''
            console.log(datas)
            for (let i = 0; i < Object.keys(datas).length; i++) {
              const key = Object.keys(datas)[i];
              let value;
              if (language == 'English') {
                value = Object.values(datas)[i];
              } else {
                if (Object.values(datas)[i] == 'Enter a valid email address.') {
                  value = 'Введен недопустимый e-mail.';
                } else if (Object.values(datas)[i] == 'user with this username already exists.') {
                  value = 'Пользователь с таким username уже существует.';
                } else if (Object.values(datas)[i] == 'user with this email already exists.') {
                  value = 'Пользователь с таким e-mail уже существует.';
                }
              }
              // text += `${key}: `
              text += `${i + 1}) ${value}\n`
            }
            setErrText(text)
          }
        })
        .catch(error => {
          console.log("Error", error)
          setLoading(false)
          setModalErr(false)
        })
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
      }, [isFocused])

    return (
        <View style={{flex: 1, backgroundColor: '#172136'}}>
          <View style={{ height: headerHeight, backgroundColor: '#0F1826', 
                                         alignItems: 'flex-end', paddingBottom: 10, flexDirection: 'row', width: '100%' }}>
            <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
              onPress={() => {
                props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
              }}
            >
              <ArrowLeft height={20} width={20} />
            </TouchableOpacity>
            <View style={{ width: '60%' }}>
                <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Sign Up' : 'Регистрация'}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', alignItems: 'center',
       paddingHorizontal: 10, zIndex: 1, backgroundColor: '#172136' }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '25%', paddingHorizontal: 4, marginTop: 20 }}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
       height: 4, backgroundColor: '#6083FF', borderRadius: 100}}
      >
      </TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '25%', paddingHorizontal: 4, marginTop: 20 }}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
       height: 4, backgroundColor: '#6083FF', borderRadius: 100}}
      >
      </TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '25%', paddingHorizontal: 4, marginTop: 20 }}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
       height: 4, backgroundColor: '#6083FF', borderRadius: 100}}
      >
      </TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '25%', paddingHorizontal: 4, marginTop: 20 }}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
       height: 4, backgroundColor: '#6083FF', borderRadius: 100}}
      >
      <Text
        style={[{color: '#818C99'}, {fontSize: 17, padding: 5}]}
      ></Text>
      </TouchableOpacity>
      </View>
      </View>
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : -SCREEN_HEIGHT}
        >
          <TouchableOpacity
            style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
            onPress={() => {
              Keyboard.dismiss()
            }}
          />
          <ScrollView 
          keyboardShouldPersistTaps='handled'
          style={{ overflow: 'visible' }}
          indicatorStyle='white'
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={true}
          >
            <View
              style={{ flexDirection: 'row',  justifyContent: 'flex-end', marginTop: 20, marginHorizontal: 10 }}
            >
                
                
              <TouchableOpacity
                style={{ width: SCREEN_WIDTH * 0.42}}
                activeOpacity={0.7}
                onPress={() => {
                }}
              >
                <View
                  style={{ width: SCREEN_WIDTH * 0.42, height: SCREEN_WIDTH * 0.42, borderRadius: 15, overflow: 'hidden' }}
                >
                  <Image
                    style={{ width: '100%', height: '100%' }}
                    source={formData && {
                      uri: formData["_parts"][0][1]["uri"]
                  }}
                  />
                </View>
              </TouchableOpacity>
              <View
                    style={{ width: SCREEN_WIDTH * 0.58 - 20, justifyContent: 'center', alignItems: 'flex-end' }}
                >
                <Text
                numberOfLines={1}
                style={{ fontSize: 17, textAlign: 'left', color: '#fff', fontFamily: 'SftBold', marginVertical: 5 }}>{name}</Text>
                <Text
                numberOfLines={1}
                style={{ fontSize: 17, textAlign: 'left', color: '#fff', fontFamily: 'SftBold', marginVertical: 5  }}>{age}</Text>
                <Text style={{ fontSize: 17, textAlign: 'left', color: '#fff', fontFamily: 'SftBold', marginVertical: 5  }}>{language != 'English' && sex == 'female' ? 'девушка' : language != 'English' && sex == 'male' ? 'парень' : language == 'English' && sex}</Text>
                <Text
                numberOfLines={1}
                style={{ fontSize: 17, textAlign: 'left', color: '#fff', fontFamily: 'SftBold', marginVertical: 5  }}>{cityName}</Text>
                </View>
              </View>
          <View>
            <View style={{ flexDirection: 'column', margin: 10, marginTop: 10}}>
            <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff', marginTop: 20, fontFamily: 'SftBold' }}>E-mail</Text>         
            <TextInput
                autoCapitalize='none'
                style={{ padding: 2, marginBottom: 5, marginTop: 10, fontSize: 19, fontWeight: '300' }}
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholder={language == 'English' ? 'Enter your e-mail' : 'Введи свой e-mail'}
                placeholderTextColor={'#818C99'}
                value={email}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {email => setEmail(email)}
            />
            </View>
            {/* <View style={{ flexDirection: 'column', marginVertical: 10, margin: 10}}>
            <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff', fontFamily: 'SftBold'}}>Username</Text>
            <TextInput
                autoCapitalize='none'
                style={{ padding: 2, marginBottom: 5, marginTop: 10, fontSize: 19, fontWeight: '300' }}
                placeholder={language == 'English' ? 'Enter your username' : 'Придумай свой username'}
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholderTextColor={'#818C99'}
                value={username}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {username => setUsername(username.trim())}
            />
            </View> */}
            <View style={{ flexDirection: 'column', marginVertical: 10, margin: 10}}>
            <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff', fontFamily: 'SftBold'}}>{language == 'English' ? 'Password' : 'Пароль'}</Text>
            <TextInput 
                style={{ padding: 2, marginBottom: 0, marginTop: 10, fontSize: 19, fontWeight: '300' }}
                placeholder={language == 'English' ? 'Enter your password' : 'Придумай пароль'}
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholderTextColor={'#818C99'}
                secureTextEntry={true}
                value={password}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {password => setPassword(password.trim())}
            />
            </View>
            <View style={{ flexDirection: 'column', margin: 10, marginTop: 0}}>
            <TextInput 
                style={{ padding: 2, marginBottom: 5, marginTop: 0, fontSize: 19, fontWeight: '300' }}
                placeholder={language == 'English' ? 'Confirm your password' : 'Введи пароль еще раз'}
                contentStyle={{ fontFamily: 'SftLight' }}
                placeholderTextColor={'#818C99'}
                secureTextEntry={true}
                value={confirmPassword}
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                mode = "outlined"
                onChangeText = {confirmPassword => setConfirmPassword(confirmPassword.trim())}
            />
            </View>
            </View>
            { Platform.OS === 'android' && <View style={{ flexGrow: 1, justifyContent: 'flex-end', paddingBottom: 40}}>
    <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, flexDirection: 'row', paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4,
            shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              if (
                email != '' &&
                name != '' &&
                city != '' &&
                password != '' &&
                confirmPassword != ''
              ) {
                if (password === confirmPassword) {
                  return registration()
                }
                else {
                  return language == 'English' ? alert('Passwords not matches') : alert('Пароли не совпадают')
                }
              }
              else {
                return language == 'English' ? alert('All fields should be filled!') : alert('Все поля должны быть заполнены')
              }
            }
               
          }
          >
             <IconCheck height={25} width={25} />
             <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', marginLeft: 10, fontFamily: 'SftMedium' }, 
             ]}>{language == 'English' ? 'Sign Up' : 'Зарегистрироваться'}</Text>
            </TouchableOpacity>
            </View>}
          </ScrollView>
        </KeyboardAvoidingView>
        { Platform.OS === 'ios' && <View style={{ width: '100%', bottom: 0, paddingBottom: bottomHeight / 2.5 }}>
    <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, flexDirection: 'row', paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4,
            shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              if (
                email != '' &&
                name != '' &&
                city != '' &&
                password != '' &&
                confirmPassword != ''
              ) {
                if (password === confirmPassword) {
                  return registration()
                }
                else {
                  return language == 'English' ? alert('Passwords not matches') : alert('Пароли не совпадают')
                }
              }
              else {
                return language == 'English' ? alert('All fields should be filled!') : alert('Все поля должны быть заполнены')
              }
            }
               
          }
          >
             <IconCheck height={25} width={25} />
             <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', marginLeft: 10, fontFamily: 'SftMedium' }, 
             ]}>{language == 'English' ? 'Sign Up' : 'Зарегистрироваться'}</Text>
            </TouchableOpacity>
            </View>}
    <Modal style={{ flex: 1 }}
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
            opacity: 0.8,
            position:'absolute',
            left: 0,
            zIndex: 0
          }}
          activeOpacity={0.8}
          >
          </TouchableOpacity>
          {!loading && <View style={{
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
                style={{ textAlign: 'center', fontSize: 25, color: 'tomato', fontFamily: 'SftBold', marginTop: 30 }}
              >{language == 'English' ? 'Warning!' : 'Внимание!'}</Text>
            <View style={{
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20,
              flexWrap: 'wrap', paddingHorizontal: 5
            }}>
              <Text
                style={{ textAlign: 'left', fontSize: 18, color: '#818C99', fontFamily: 'SftMedium' }}
              >{errText}</Text>
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
          </View>}
          {loading && <View
            style={{ width: '100%', height: '100%', position: 'absolute',
            left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator />  
          </View>}
        </View>
        </Modal>

        <Modal
        transparent={true}
        animationType='fade'
        visible={modalRegistrated}
        statusBarTranslucent={true}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            
          <TouchableOpacity onPress={() => {
            props.navigation.navigate("StartScreen")
            setModalRegistrated(false)
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
              props.navigation.navigate("StartScreen")
              setModalRegistrated(false)
            }}
          />
          <View
            style={{ flexGrow: 1 }}
          >
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold' }}
            >{language == 'English' ? 'Account created' : 'Аккаунт создан'}</Text>
            <Text
              style={{ color: '#fff', fontFamily: 'SftMedium', marginTop: 10, textAlign: 'center',
                 paddingHorizontal: 15, width: SCREEN_WIDTH * 0.9, fontSize: 17 }}
            >{language == 'English' ? 'An email with a link to activate your account has been sent to your email address' :
             'На вашу электронную почту было отправлено письмо с ссылкой на активацию аккаунта'}</Text>
            </View>
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', marginTop: 20, borderRadius: 12, paddingVertical: 15,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7 }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              props.navigation.navigate("StartScreen")
              setModalRegistrated(false)
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Ok' : 'Ок'}</Text>
          </TouchableOpacity>
          </View>
          </View>
        </View>
        </Modal>
        {/* <Modal
          style={{ flex: 1 }}
          transparent={true}
          animationType='fade'
          visible={loading}
          statusBarTranslucent={true}
        >
          <View
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', width: '100%', height: '100%', position: 'absolute',
            left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator />  
          </View>
        </Modal> */}
        </View>
      )
    }
    
    const styles = StyleSheet.create({
        inputStyle: {
            padding:10,
            margin:10
        },
        cardStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          margin: 1,
      },
    })

export default SignUp