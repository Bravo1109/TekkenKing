import React, {useState, useEffect, useCallback} from 'react'
import { StyleSheet, Text, Image, View, KeyboardAvoidingView, ActivityIndicator,
    ScrollView, Dimensions, FlatList, TouchableOpacity, ImageBackground, Platform, Keyboard} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions, useIsFocused } from "@react-navigation/native";
import { Button, IconButton, TextInput } from 'react-native-paper';
import CloudIcon from '../images/cloud.svg'
import ArrowRight from '../images/iconArrowRight.svg'
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { BASE_URL } from './config';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeft from '../images/turnBack.svg'
import debounce from 'lodash.debounce';


function PhotoRegistration(props) {
    const SCREEN_HEIGHT = Dimensions.get('window').height
    const SCREEN_WIDTH = Dimensions.get('window').width
    const insets = useSafeAreaInsets();
    const bottomHeight = getDefaultHeaderHeight({ SCREEN_WIDTH, SCREEN_HEIGHT }, Platform.OS, insets.bottom)
    const headerHeight = getDefaultHeaderHeight({ SCREEN_WIDTH, SCREEN_HEIGHT }, Platform.OS, insets.top) - 10
    const [language, setLanguage] = useState('')
    const isFocused = useIsFocused();
    const sex = props.route.params.selected
    const date = props.route.params.date
    const name = props.route.params.name
    const promocodeId = props.route.params.promocodeId
    const referal = props.route.params.referal
    const [data, setData] = useState()
    let [fData, setFData] = useState()
    const [city, setCity] = useState('')
    const [cityNoCountry, setCityNoCountry] = useState('')
    const [cityId, setCityId] = useState()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false);
    const PickImage = async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission denied!')
          return
        }
        
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
    
        if (!result.canceled) {
          let newImageUri = result.assets[0].uri;
    
          // Получаем исходные размеры изображения
        let width = 0;
        let height = 0;
        try {
          await new Promise((resolve, reject) => {
            Image.getSize(
              newImageUri,
              (w, h) => {
                width = w;
                height = h;
                resolve();
              },
              (error) => reject(error)
            );
          });
        } catch (error) {
          console.error("Ошибка при получении размеров изображения:", error);
          Alert.alert('Не удалось получить размеры изображения');
          return;
        }

        // Рассчитываем новые размеры, если превышают 1500 по любой стороне
        const maxDimension = 1500;
        let finalWidth = width;
        let finalHeight = height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            const ratio = maxDimension / width;
            finalWidth = maxDimension;
            finalHeight = Math.round(height * ratio);
          } else {
            const ratio = maxDimension / height;
            finalHeight = maxDimension;
            finalWidth = Math.round(width * ratio);
          }
        }

        // Если необходимо изменить размер (когда он больше 1500x1500)
        if (finalWidth !== width || finalHeight !== height) {
          const resizedImage = await ImageManipulator.manipulateAsync(
            newImageUri,
            [{ resize: { width: finalWidth, height: finalHeight } }],
            {
              format: ImageManipulator.SaveFormat.JPEG,
              compress: 0.95
            }
          );
          newImageUri = resizedImage.uri;
        }
    
          let fileInfo = await FileSystem.getInfoAsync(newImageUri, { size: true });
    
          // Проверка на максимальный размер 15MB
          if (fileInfo.size > 15 * 1024 * 1024) {
            alert('The image size is too large! Please select an image less than 15MB.');
            return;
          }
    
          // Процедура сжатия
          // let compression = 1; 
          // do {
          //   const compressedResult = await ImageManipulator.manipulateAsync(
          //     newImageUri,
          //     [],
          //     {
          //       format: ImageManipulator.SaveFormat.JPEG,
          //       compress: compression
          //     }
          //   );
          //   newImageUri = compressedResult.uri;
          //   fileInfo = await FileSystem.getInfoAsync(newImageUri, { size: true });
          //   compression -= 0.1;
          // } while (fileInfo.size > 400 * 1024 && compression > 0.1);
    
          let formData = new FormData();
          formData.append('photo', {
            uri: newImageUri,
            name: 'image.jpeg',
            type: 'image/jpeg'
          });
    
          setFData(formData);
        }
      }
    }
    const loadCity = async (cityName) => {
      // Если поле пустое, можно сразу очищать данные и не выполнять запрос
      if (!cityName) {
        setData([]);
        setLoading(false)
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/cities/?search=${cityName}`, {
          method: "GET",
        });
        const result = await response.json();
        setData(result.results);
        console.log(result);
      } catch (error) {
        console.log("Error", error);
      } finally {
        setLoading(false);
      }
    };
    const debouncedLoadCity = useCallback(
      debounce((cityName) => {
        loadCity(cityName);
      }, 500),
      []
    );
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
      console.log('promoId: ', promocodeId)
    }, [isFocused])

    useEffect(() => {
      props.navigation.setOptions({ title: language == 'English' ? 'Sign up' : 'Регистрация' })
    }, [language])

    const renderData = (item, index) => {
        return(
        <View>
        <TouchableOpacity style={[styles.cardStyle, {height: 50}]} activeOpacity = {1}
        onPress = {() => {
          setCityId(item.id)
          setCityNoCountry((language == 'English' ? item.name_eng : item.name))
          setCity((language == 'English' ? item.name_eng : item.name) + ', ' + item.country)
          setShow(false)
          Keyboard.dismiss()
          console.log(cityId)
        }}
        >
          <View style={[{flexDirection:"column", alignItems: 'flex-start', width: '100%'}, index != data.length - 1 && { borderBottomWidth: 1,
            borderBottomColor: '#1F3646' }]}> 
            <Text
              style={{ color: '#fff', padding: 13, textAlign: 'left', fontSize: 17, fontFamily: 'SftMedium'}}
            >{language == 'English' ? item.name_eng : item.name}, {item.country}</Text>
          </View>
        </TouchableOpacity>
        </View>
        )
    }

  return (
    <View style={{ flexGrow: 1, backgroundColor: '#172136' }}>
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
       paddingHorizontal: 10 }}>
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
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '25%', paddingHorizontal: 4, marginTop: 20 }}>
      <TouchableOpacity
      activeOpacity={1}
      style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
       height: 4, backgroundColor: '#243A4A', borderRadius: 100}}
      >
      </TouchableOpacity>
      </View>
      </View>
    <ScrollView contentContainerStyle={Platform.OS === 'android' ? { height: SCREEN_HEIGHT - 90} : {flex: 1}}
        keyboardShouldPersistTaps='handled'
        bounces={true}
    >
    <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: '#172136'}}
            behavior={Platform.OS === 'ios' ? 'position': 'position'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : -100}
            keyboardShouldPersistTaps='handled'
        >
    <ImageBackground
        style={{width: SCREEN_WIDTH / 3, height: SCREEN_WIDTH / 3, borderRadius: 30, alignSelf: 'center', marginTop: 30,
         marginBottom: 10, backgroundColor: '#2B4150', overflow: 'hidden'}}
    >
      <TouchableOpacity 
        style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
        onPress={PickImage}
        activeOpacity={0.7}
      >
        
        <CloudIcon height={40} width={40} />
        <Image
          style={{width: SCREEN_WIDTH / 3, height: SCREEN_WIDTH / 3, position: 'absolute'}}
          source={fData && {
            uri: fData["_parts"][0][1]["uri"]
        }}
        />
      </TouchableOpacity>
      
    </ImageBackground>
    <Button
          mode='text'
          textColor='#6083FF'
          labelStyle={{ fontSize: 17, fontWeight: '300', fontFamily: 'SftLight' }}
          style={{
            borderRadius: 10,
            width: 200,
            alignSelf: 'center'
          }}
          onPress={PickImage}
    >{language == 'English' ? 'Choose profile photo' : 'Выбрать фото'}</Button>
            <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff', marginTop: 10,  marginTop: 20, fontFamily: 'SftBold'  }}>{language == 'English' ? 'City' : 'Город'}</Text>
            <TextInput style = {{padding:2,
            margin:10,
            // marginVertical: 5,
            fontSize: 17,
            fontWeight: '300',
            marginBottom: 0}}
                placeholder={language == 'English' ? 'Enter the name' : 'Название города'}
                contentStyle={{ fontFamily: 'SftLight', fontSize: 19 }}
                placeholderTextColor={'#818C99'}
                value={city}
                mode = "outlined"
                textColor='#fff'
                selectionColor='#818C99'
                outlineColor='transparent'
                outlineStyle={{ borderRadius: 13, borderWidth: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onChangeText = {(city) => {
                  setCity(city)
                  setLoading(true)
                  debouncedLoadCity(city);
                  setShow(true)
                }}
                onEndEditing = {() => setShow(false)}
            />
    <View style={{ zIndex: 10000, width: '100%' }}>
        {show && <ScrollView 
            style={{width: '100%', height: 200, position: 'absolute', zIndex: 1000}}
            horizontal={true}
            bounces={false}
            keyboardShouldPersistTaps='handled'
        >
          
          <View style={{  width: SCREEN_WIDTH, }}>
            <View
              style={{ height: 10 }}
            >
            {loading && <ActivityIndicator size="small" color="#fff" />}
            </View>
            <FlatList
              data={data}
              contentContainerStyle={{zIndex: 100, zIndex: 1000}}
              style={{width: SCREEN_WIDTH, maxHeight: 200, zIndex: 1000}}
              bounces={false}
              keyboardShouldPersistTaps='handled'
              renderItem = {({item, index}) => {
                return renderData(item, index)
              }}
              keyExtractor = {item => `${item.id}`}
            />
            </View>
        </ScrollView>}
    </View>
    
    
    </KeyboardAvoidingView>
    { Platform.OS === 'android' && <View style={{justifyContent: 'flex-end', paddingBottom: 40}}>
    <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, flexDirection: 'row', paddingVertical: 15, margin: 10, marginVertical: 18,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4,
            shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              if (!fData) {
                language == 'English' ? alert("You should choose a profile photo") : alert('Вы должны выбрать фото профиля')
              }
              else if (!cityId) {
                language == 'English' ? alert("You should choose a valid city") : alert('Вы должны выбрать доступный город')
              }
              else {
                  console.log(fData)
                  props.navigation.navigate(
                      'UserInfo',
                      {
                          selected: sex,
                          date: date,
                          name: name,
                          city: cityId,
                          cityName: cityNoCountry,
                          promocodeId: promocodeId,
                          formData: fData,
                          referal: referal
                      }
                  )
              }
          }}
          >
             <ArrowRight height={25} width={25} />
             <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', marginLeft: 10, fontFamily: 'SftMedium' }, 
             ]}>{language == 'English' ? 'Next' : 'Далее'}</Text>
            </TouchableOpacity>
            </View>}
    </ScrollView>
    {Platform.OS === 'ios' && <View style={{ width: '100%', bottom: 0, paddingBottom: bottomHeight / 2.5 }}>
    <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', borderRadius: 12, flexDirection: 'row', paddingVertical: 15, margin: 10, marginBottom: 18, marginTop: 0,
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4,
            shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              if (!fData) {
                language == 'English' ? alert("You should choose a profile photo") : alert('Вы должны выбрать фото профиля')
              }
              else if (!cityId) {
                language == 'English' ? alert("You should choose a valid city") : alert('Вы должны выбрать доступный город')
              }
              else {
                  console.log(fData)
                  props.navigation.navigate(
                      'UserInfo',
                      {
                          selected: sex,
                          date: date,
                          name: name,
                          city: cityId,
                          cityName: cityNoCountry,
                          formData: fData,
                          promocodeId: promocodeId,
                          referal: referal
                      }
                  )
              }
          }}
          >
             <ArrowRight height={25} width={25} />
             <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', marginLeft: 10, fontFamily: 'SftMedium' }, 
             ]}>{language == 'English' ? 'Next' : 'Далее'}</Text>
            </TouchableOpacity>
            </View>}
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
      zIndex: 1000
  },
})

export default PhotoRegistration