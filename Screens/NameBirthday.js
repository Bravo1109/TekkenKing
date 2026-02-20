import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Keyboard, View, KeyboardAvoidingView, ScrollView, ActivityIndicator,
    TouchableOpacity, Platform, Modal, Dimensions, Image} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from './CheckBox';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import {TextInput, Button, IconButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions, useIsFocused } from "@react-navigation/native";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import ArrowDown from '../images/arrowDownSign.svg'
import ArrowRight from '../images/iconArrowRight.svg'
import ArrowLeft from '../images/turnBack.svg'
import { BASE_URL } from './config';
import { toInteger } from 'lodash';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



function NameBirthday(props) {
    const SCREEN_HEIGHT = Dimensions.get('window').height
    const SCREEN_WIDTH = Dimensions.get('window').width
    const insets = useSafeAreaInsets();
    const bottomHeight = getDefaultHeaderHeight({ SCREEN_WIDTH, SCREEN_HEIGHT }, Platform.OS, insets.bottom)
    const headerHeight = getDefaultHeaderHeight({ SCREEN_WIDTH, SCREEN_HEIGHT }, Platform.OS, insets.top) - 10
    const [language, setLanguage] = useState('')
    const isFocused = useIsFocused();
    const [dd, setDd] = useState('')
    const [mm, setMm] = useState('')
    const [yyyy, setYyyy] = useState('')
    const [loading, setLoading] = useState(false)
    
    const [checkMale, setCheckMale] = useState(selected == 'male')
    const [checkFemale, setCheckFemale] = useState(selected == 'female')
    const [checkAll, setCheckAll] = useState(selected == 'other')
    
    const [labelDate, setLabelDate] = useState('Choose date')
    const [name, setName] = useState('')
    const [promocode, setPromocode] = useState('')
    const [referal, setReferal] = useState('')
    const [promocodeExists, setPromocodeExists] = useState(0)
    const [loadingPromocode, setLoadingPromocode] = useState(false)
    const [referalExists, setReferalExists] = useState(0)
    const [loadingReferal, setLoadingReferal] = useState(false)
    const [promocodeId, setPromocodeId] = useState(0)
    const [referalUsername, setReferalUsername] = useState('')
    const sex = props.route.params.selected
    const [selected, setSelected] = useState(props.route.params.selected)
    const [labelGender, setLabelGender] = useState(props.route.params.selected)
    let maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() - 18)
    const [date, setDate] = useState(maxDate)
    
    let minDate = new Date()
    minDate.setFullYear(minDate.getFullYear() - 120)
    const [modalGender, setModalGender] = useState(false)
    const [modalBirthday, setModalBirthday] = useState(false)
    const [show, setShow] = useState(false)
    const [text, setText] = useState('Empty')
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setShow(Platform.OS === 'ios')
        setDate(currentDate)
        let tempDate = new Date(currentDate)
        let fDate = (tempDate.getMonth() + 1) + '/' + tempDate.getDate() + '/' + tempDate.getFullYear() 
        setText(fDate)
    }
    const showMode = () => {
        if (Platform.OS === 'android') {
            setShow(true)
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

      const getPromoCode = () => {
        let status = 0
        setLoadingPromocode(true)
        fetch(`${BASE_URL}/api/promocode/${promocode}/`, {
          method:"GET"
        }).then((resp) => {
          if(resp.status == 200 && text != '') {
            status = 200
            return resp.json()
          } else {
            setPromocodeExists(0)
            setLoadingPromocode(false)
          }
        }).then((resp) => {
            if (resp.promocode != false) {
                setPromocodeId(resp.promocode)
                setPromocodeExists(1)
            } else {
                setPromocodeExists(2)
            }
            setLoadingPromocode(false)
        })
        .catch(error => {
          console.log("Error", error)
          alert('Something went wrong!')
          setLoadingPromocode(false)
        })
      }

      const getReferal = (refUsername) => {
        let status = 0
        setLoadingReferal(true)
        fetch(`${BASE_URL}/api/referal/?username=${refUsername}`, {
          method:"GET"
        }).then((resp) => {
          if(resp.status == 200 && text != '') {
            status = 200
            return resp.json()
          } else {
            setReferalExists(0)
            setLoadingReferal(false)
          }
        }).then((resp) => {
            if (resp.items == 1) {
                setReferalUsername(refUsername)
                setReferalExists(1)
            } else {
                setReferalExists(2)
            }
            setLoadingReferal(false)
        })
        .catch(error => {
          console.log("Error", error)
          alert('Something went wrong!')
          setLoadingReferal(false)
        })
      }

      useEffect(() => {
        getLanguageData()
      }, [isFocused])

      useEffect(() => {
        props.navigation.setOptions({ title: language == 'English' ? 'Sign up' : 'Регистрация' })
      }, [language])

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
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', alignItems: 'center', paddingHorizontal: 10, zIndex: 1, backgroundColor: '#172136' }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '25%', paddingHorizontal: 4, marginTop: 20 }}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
       height: 4, backgroundColor: '#6083FF', borderRadius: 100}}
      >
      <Text
        style={[{color: '#243A4A'}, {fontSize: 17, padding: 5}]}
      ></Text>
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
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '25%', paddingHorizontal: 4, marginTop: 20 }}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
       height: 4, backgroundColor: '#243A4A', borderRadius: 100}}
      >
      <Text
        style={[{color: '#818C99'}, {fontSize: 17, padding: 5}]}
      ></Text>
      </TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '25%', paddingHorizontal: 4, marginTop: 20 }}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
       height: 4, backgroundColor: '#243A4A', borderRadius: 100}}
      >
      <Text
        style={[{color: '#818C99'}, {fontSize: 17, padding: 5}]}
      ></Text>
      </TouchableOpacity>
      </View>
      </View>
          <KeyboardAvoidingView
          style={{flex: 1, backgroundColor: '#172136'}}
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
             contentContainerStyle={Platform.OS === 'android' ? { height: SCREEN_HEIGHT - 80 } : {flexGrow: 1}}
             style={{ overflow: 'visible' }}
            >
            <View
              style={{ flexDirection: 'row',  justifyContent: 'flex-end', marginTop: 20, marginHorizontal: 10 }}
            >
                <View
                    style={{ width: SCREEN_WIDTH * 0.4 - 20, justifyContent: 'flex-end', alignItems: 'center' }}
                >
                <Text style={{ fontSize: 20, textAlign: 'left', color: '#fff', fontFamily: 'SftBold' }}>{language == 'English' ? 'Name' : 'Имя'}</Text>
                </View>
                
              <TouchableOpacity
                style={{ width: SCREEN_WIDTH * 0.6}}
                activeOpacity={0.7}
                onPress={() => {
                }}
              >
                <View
                  style={{ width: SCREEN_WIDTH * 0.6, height: SCREEN_WIDTH * 0.42, borderRadius: 15, overflow: 'hidden' }}
                >
                  <Image
                    style={{ width: '100%', height: '100%' }}
                    source={selected == 'female' ? require('../images/woman.jpeg') : require('../images/man.jpeg')}
                  />
                </View>
              </TouchableOpacity>
              </View>
            <View style={{ flexDirection: 'column', marginBottom: 10, margin: 10}}>
            {/* <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', fontWeight: '300', marginTop: 30, fontFamily: 'SftLight' }}>{language == 'English' ? 'Name *' : 'Имя *'}</Text> */}
            <TextInput
                placeholder={language == 'English' ? 'Enter your name' : 'Введите ваше имя'}
                placeholderTextColor={'#818C99'}
                style={{ padding: 0, marginVertical: 5, marginTop: 10, fontSize: 19, fontWeight: '300', fontFamily: 'SftLight' }}
                contentStyle={{ fontFamily: 'SftLight' }}
                value={name}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onSubmitEditing={Keyboard.dismiss}
                maxLength={20}
                onChangeText = {(name) => {
                    const filteredText = name.replace(/^\s+/, '');
                    setName(filteredText)
                }}
            />
            </View>
            
            <View style={{ marginHorizontal: 10, marginTop: 20 }}>
            <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff', fontFamily: 'SftBold' }}>{language == 'English' ? 'Your birthday' : 'Дата рождения'}</Text>
            {Platform.OS === 'ios' && <TouchableOpacity
              style={{ padding: 17, marginVertical: 10, borderRadius: 13, borderWidth: 0,
                       backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => {
                setModalBirthday(true)
              }}
            >
              <Text style={[{ fontSize: 17, fontWeight: '300', fontFamily: 'SftLight' }, labelDate == 'Choose date' ? {color: '#818C99'} : {color: '#fff'}]}>{language != 'English' && labelDate == 'Choose date' ? 'Выбрать дату' : labelDate}</Text>
              <ArrowDown height={20} width={20} />
            </TouchableOpacity>}
            {Platform.OS === 'android' && <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    maxLength={2}
                    contentStyle={{ fontFamily: 'SftLight' }}
                    placeholder={language == 'English' ? 'DD' : 'ДД'}
                    value={`${dd}`}
                    placeholderTextColor={'#818C99'}
                    style={{ width: 70, padding: 2, marginVertical: 10, fontSize: 19, fontWeight: '300', textAlign: 'center' }}
                    mode='outlined'
                    keyboardType='decimal-pad'
                    textColor='#fff'
                    selectionColor='#818C99'
                    outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                    onChangeText = {(day) => {
                        setDd(day)
                        console.log(dd)
                    }}
                />
                <Text style={{ color: '#818C99', fontSize: 25, margin: 5 }}>-</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    maxLength={2}
                    contentStyle={{ fontFamily: 'SftLight' }}
                    placeholder='MM'
                    placeholderTextColor={'#818C99'}
                    value={`${mm}`}
                    style={{ width: 70, padding: 2, marginVertical: 10, fontSize: 19, fontWeight: '300', textAlign: 'center' }}
                    mode='outlined'
                    keyboardType='decimal-pad'
                    textColor='#fff'
                    selectionColor='#818C99'
                    outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                    onChangeText = {(month) => {
                        setMm(month)
                        console.log(mm)
                    }}
                />
                <Text style={{ color: '#818C99', fontSize: 25, margin: 5 }}>-</Text>
                </View>
                <View>
                <TextInput
                    maxLength={4}
                    contentStyle={{ fontFamily: 'SftLight' }}
                    multiline={false}
                    placeholder={language == 'English' ? 'YYYY' : 'ГГГГ'}
                    value={`${yyyy}`}
                    placeholderTextColor={'#818C99'}
                    style={{ width: 90, padding: 2, marginVertical: 10, fontSize: 19, fontWeight: '300', textAlign: 'center' }}
                    mode='outlined'
                    keyboardType='decimal-pad'
                    textColor='#fff'
                    selectionColor='#818C99'
                    outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                    onChangeText = {(year) => {
                        setYyyy(year)
                        console.log(yyyy)
                    }}
                />
                </View>
                
            </View>}
            </View>

            {/* <View style={{ flexDirection: 'column', marginVertical: 5, margin: 10}}>
            <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', fontWeight: '300', marginBottom: 0, fontFamily: 'SftLight' }}>{language == 'English' ? 'Promocode' : 'Промокод'}</Text>
            <View
                style={{ paddingBottom: 0, flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between' }}
            >
              <TextInput
                placeholder={language == 'English' ? 'Get the bonus' : 'Получи бонус'}
                placeholderTextColor={'#818C99'}
                style={{ padding: 0, 
                         fontSize: 19, fontWeight: '300', fontFamily: 'SftLight',
                         width: '65%', height: 56 }}
                contentStyle={{ fontFamily: 'SftLight' }}
                value={promocode}
                mode = "outlined"
                editable={promocodeId != 0 ? false : true}
                textColor={promocodeId == 0 ? '#fff' : 'rgba(255, 255, 255, 0.4)'}
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: promocodeId == 0 ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)' }}
                onSubmitEditing={Keyboard.dismiss}
                onChangeText = {(promocode) => {
                    const filteredText = promocode.replace(/\s/g, '');
                    setPromocode(filteredText.toLowerCase())
                    promocodeExists == 2 && setPromocodeExists(0)
                }}
              />
              <TouchableOpacity
                style={{ backgroundColor: promocodeId == 0 ? promocodeExists == 2 ? 'rgba(227, 61, 100, 1)' : 'rgba(97, 131, 255, 1)' : 'rgba(97, 131, 255, 0.2)',
                          borderRadius: 12, margin: 0, width: '32%',
                          shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, height: 56, justifyContent: 'center',
                          shadowOpacity: 0.2, shadowRadius: 7 }}
                activeOpacity={promocodeId == 0 ? 0.8 : 1}
                
                onPress={() => {
                  Keyboard.dismiss
                  promocodeId == 0 && promocode.length > 0 && getPromoCode()
                }}
              >
                {!loadingPromocode ? <Text style={[{ color: promocodeId == 0 ?  '#fff' : 'rgba(255, 255, 255, 0.4)', textAlign: 'center', fontSize: 15, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Activate' : 'Активировать'}</Text> :
                <ActivityIndicator
                    color={'#fff'}
                />}
              </TouchableOpacity>
            </View>
            
            </View> */}

            {/* <View style={{ flexDirection: 'column', margin: 10}}>
            <Text style={{ fontSize: 17, textAlign: 'left', color: '#6D7885', fontWeight: '300', marginBottom: 0, fontFamily: 'SftLight' }}>{language == 'English' ? "Friend's Username" : 'Username друга'}</Text>
            <View
                style={{ paddingBottom: 30, flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between' }}
            >
              <TextInput
                placeholder={language == 'English' ? 'Get the bonus' : 'Получи бонус'}
                placeholderTextColor={'#818C99'}
                style={{ padding: 0, 
                         fontSize: 19, fontWeight: '300', fontFamily: 'SftLight',
                         width: '65%', height: 56 }}
                contentStyle={{ fontFamily: 'SftLight' }}
                value={referal}
                mode = "outlined"
                autoCapitalize='none'
                editable={referalUsername != '' ? false : true}
                textColor={referalUsername == '' ? '#fff' : 'rgba(255, 255, 255, 0.4)'}
                selectionColor='#818C99'
                outlineStyle={{ borderRadius: 13, borderWidth: 0, backgroundColor: referalUsername == '' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)' }}
                onSubmitEditing={Keyboard.dismiss}
                onChangeText = {(referal) => {
                    setReferal(referal)
                    referalExists == 2 && setReferalExists(0)
                }}
              />
              <TouchableOpacity
                style={{ backgroundColor: referalUsername == '' ? referalExists == 2 ? 'rgba(227, 61, 100, 1)' : 'rgba(97, 131, 255, 1)' : 'rgba(97, 131, 255, 0.2)',
                          borderRadius: 12, margin: 0, width: '32%',
                          shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, height: 56, justifyContent: 'center',
                          shadowOpacity: 0.2, shadowRadius: 7 }}
                activeOpacity={referalUsername == '' ? 0.8 : 1}
                
                onPress={() => {
                  Keyboard.dismiss
                  referalUsername == '' && referal.length > 0 && getReferal(referal)
                }}
              >
                {!loadingReferal ? <Text style={[{ color: referalUsername == '' ?  '#fff' : 'rgba(255, 255, 255, 0.4)', textAlign: 'center', fontSize: 15, fontWeight: '400', fontFamily: 'SftMedium' }]}>{language == 'English' ? 'Search' : 'Найти'}</Text> :
                <ActivityIndicator
                    color={'#fff'}
                />}
              </TouchableOpacity>
            </View>
            
            </View> */}

            
            { Platform.OS === 'android' && <View style={{flexGrow: 1, justifyContent: 'flex-end', paddingBottom: 40}}>
    <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, flexDirection: 'row', paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4,
            shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
                if (name != '') {
                    if(Platform.OS === 'ios') {
                        props.navigation.navigate(
                            'PhotoAdd',
                            {
                                selected: selected,
                                date: format(date, "yyyy-MM-dd"),
                                name: name.trim(),
                                promocodeId: promocodeId,
                                referal: referalUsername
                            }
                        )
                    } else {
                        try {
                            const localDate = new Date(`${yyyy}-${mm}-${dd}`)
                            
                            if(!isNaN(localDate.getTime()) && localDate >= minDate) {
                                console.log(localDate)
                                if(localDate <= maxDate) {
                                    props.navigation.navigate(
                                        'PhotoAdd',
                                        {
                                            selected: selected,
                                            date: `${yyyy}-${mm}-${dd}`,
                                            name: name.trim(),
                                            promocodeId: promocodeId,
                                            referal: referalUsername
                                        }
                                    )
                                } else {
                                    language == 'English' ? alert('You should be 18+ years old') : alert('Вы должны быть старше 18 лет')
                                }  
                            } else {
                                language == 'English' ? alert('Enter a valid birthday date!') : alert('Введите корректную дату!')
                            }
                        } catch (error) {
                            language == 'English' ? alert('Something going wrong!') : alert('Что-то пошло не так!')
                        }
                    }
                }
                else {
                    language == 'English' ? alert("Name can't be empty!") : alert('Введите имя!')
                }
            }}
          >
             <ArrowRight height={25} width={25} />
             <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', marginLeft: 10, fontFamily: 'SftMedium' }, 
             ]}>{language == 'English' ? 'Next' : 'Далее'}</Text>
            </TouchableOpacity>
            </View>}
            </ScrollView>
          </KeyboardAvoidingView>
          {Platform.OS === 'ios' && <View style={{ width: '100%', bottom: 0, backgroundColor: '#172136', paddingBottom: bottomHeight / 2.5 }}>
            {loading == true ? <ActivityIndicator /> : 
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, flexDirection: 'row', paddingVertical: 15, margin: 10, marginBottom: 18, marginTop: 0,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4,
            shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
                if (name != '' && labelGender != 'Choose gender' && labelDate != 'Choose date') {
                    {Platform.OS === 'ios' ? props.navigation.navigate(
                        'PhotoAdd',
                        {
                            selected: selected,
                            date: format(date, "yyyy-MM-dd"),
                            name: name.trim(),
                            promocodeId: promocodeId,
                            referal: referalUsername
                        }
                    ) : 
                    props.navigation.navigate(
                        'PhotoAdd',
                        {
                            selected: selected,
                            date: `${yyyy}-${mm}-${dd}`,
                            name: name.trim(),
                            promocodeId: promocodeId,
                            referal: referalUsername
                        }
                    )
                    }
                }
                else {
                    if (name == '') {
                        language == 'English' ? alert("Name can't be empty!") : alert('Введите имя!')
                    } else if (labelGender == 'Choose gender') {
                        language == 'English' ? alert("Choose your gender!") : alert('Укажите ваш пол!')
                    } else if (labelDate == 'Choose date') {
                        language == 'English' ? alert("Choose your birth date!") : alert('Укажите дату рождения!')
                    }
                    
                }
            }}
          >
             <ArrowRight height={25} width={25} />
             <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', marginLeft: 10, fontFamily: 'SftMedium' }, 
             ]}>{language == 'English' ? 'Next' : 'Далее'}</Text>
            </TouchableOpacity>}
            </View>}
            <Modal
                transparent={true}
                animationType='fade'
                visible={modalGender}
                statusBarTranslucent={true}
            >
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}>
            <TouchableOpacity onPress={() => {
                setModalGender(false)
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
            <View style={{ width: '100%', backgroundColor: '#172136', height: SCREEN_HEIGHT - 50,
             borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
            <View style={{ height: 70, backgroundColor: '#0F1826', borderTopLeftRadius: 10, borderTopRightRadius: 10, 
            alignItems: 'center', paddingTop: 10, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                        setModalGender(false)
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 25, textAlign: 'center', fontFamily: 'SftMedium' }}>{language == 'English' ? 'Gender' : 'Пол'}</Text>
                </View>
                <TouchableOpacity
                onPress={() => {
                  setLabelGender(selected)
                  setModalGender(false)
                }}
                style={{ width: '20%' }}
                activeOpacity={1}
            >
                <Text style={{ fontSize: 20, fontWeight: '300', color: '#6083FF', textAlign: 'center', fontFamily: 'SftLight'}}>Save</Text>
            </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
             width: '100%'}}>
            <Picker
            selectedValue={selected}
            onValueChange={(itemValue, itemIndex) => { 
                setSelected(itemValue)  
            }}
            style= {{ width: '100%', marginTop: 40 }}
            mode='dropdown'
            itemStyle={{ fontSize: 25, color: '#99A1AE', fontFamily: 'SftMedium' }}
            >
                <Picker.Item label={language == 'English' ? 'Male' : 'Мужчина'} value='male' />
                <Picker.Item label={language == 'English' ? 'Female' : 'Женщина'} value='female' />
                {/* <Picker.Item label={language == 'English' ? 'Other' : 'Другое'} value='other' /> */}
            </Picker>
            </View>
            </View>
        </View>
      </Modal>
      <Modal
                transparent={true}
                animationType='fade'
                visible={modalBirthday}
                statusBarTranslucent={true}
            >
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}>
            <TouchableOpacity onPress={() => {
                setModalBirthday(false)
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
            <View style={{ width: '100%', backgroundColor: '#172136', height: SCREEN_HEIGHT - 50,
             borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
            <View style={{ height: 70, backgroundColor: '#0F1826', borderTopLeftRadius: 10, borderTopRightRadius: 10, 
            alignItems: 'center', paddingTop: 10, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                        setModalBirthday(false)
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 25, textAlign: 'center', fontFamily: 'SftMedium' }}>{language == 'English' ? 'Your birthday' : 'Дата рождения'}</Text>
                </View>
                <TouchableOpacity
                onPress={() => {
                  setLabelDate(format(date, 'dd MMMM yyyy'))
                  setModalBirthday(false)
                }}
                style={{ width: '20%' }}
                activeOpacity={1}
            >
                <Text style={{ fontSize: 20, fontWeight: '300', color: '#6083FF', textAlign: 'center', fontFamily: 'SftLight'}}>Save</Text>
            </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            {(Platform.OS === 'android') && (<Button
                textColor='blue'
                mode='text'
                contentStyle={{ flexDirection: 'row-reverse' }}
                icon='chevron-down'
                onPress={() => {showMode()}}
            ><Text style={{ fontSize: 16 }}>{format(date, 'MM/dd/yyyy')}</Text></Button>)}
            <View style={{ width: '100%', marginTop: 40 }}>
            {Platform.OS === 'android' && (show && (<RNDateTimePicker
                testID='dateTimePicker'
                value={date}
                mode={'date'}
                display={'spinner'}
                style= {{ height: 120, color: '#fff', backgroundColor: '#000' }}
                onChange={onChange}
            />))}
            {Platform.OS === 'ios' && (
                <RNDateTimePicker
                testID='dateTimePicker'
                value={date}
                maximumDate={maxDate}
                mode={'date'}
                display={"spinner"}
                textColor='#fff'
                onChange={onChange}
            />
            )}
            </View>
            </View>
            </View>
        </View>
      </Modal>
          </View>
      )
    }

    const styles = StyleSheet.create({
        inputStyle: {
            padding:10,
            margin:10
        }
    })

export default NameBirthday