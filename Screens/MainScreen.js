import React, {useState, useEffect, useRef, useCallback} from 'react'
import { StyleSheet, Text, Image, View, KeyboardAvoidingView, ActivityIndicator,
    ScrollView, Dimensions, FlatList, TouchableOpacity, ImageBackground, Platform, Keyboard} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { Image } from 'expo-image';
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
import { BlurView } from 'expo-blur';
import { FlashList } from '@shopify/flash-list';


function MainScreen(props) {
    const SCREEN_HEIGHT = Dimensions.get('window').height
    const SCREEN_WIDTH = Dimensions.get('window').width
    const insets = useSafeAreaInsets();
    const bottomHeight = getDefaultHeaderHeight({ SCREEN_WIDTH, SCREEN_HEIGHT }, Platform.OS, insets.bottom)
    const headerHeight = getDefaultHeaderHeight({ SCREEN_WIDTH, SCREEN_HEIGHT }, Platform.OS, insets.top) - 10
    const [language, setLanguage] = useState('')
    const isFocused = useIsFocused();
    const [data, setData] = useState()
    let [fData, setFData] = useState()
    const [city, setCity] = useState('')
    const [cityNoCountry, setCityNoCountry] = useState('')
    const [cityId, setCityId] = useState()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false);
    const listRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const diagram1 = require('../images/diagrams/diagram1.png')
    const { width: origW, height: origH } = Image.resolveAssetSource(diagram1);
    const ratio = origW / origH;
    
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
    }, [isFocused])

    useEffect(() => {
      props.navigation.setOptions({ title: language == 'English' ? 'Sign up' : 'Регистрация' })
    }, [language])

    const ListItem = ({ text, item }) => {
        return (
        <View style={{
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
            marginLeft: 10, fontSize: 15, color: '#fff', lineHeight: 20, fontFamily: 'SftMedium'
            }}>{text} <Text style={{ fontFamily: 'SftBold' }}>{item}</Text></Text>
        </View>
        );
    };

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

    const dataSurveys = [
        { id: '1', title: 'Опрос №1' },
        { id: '2', title: 'Опрос №2' },
        { id: '3', title: 'Опрос №3' },
        { id: '4', title: 'Опрос №4' },
        { id: '5', title: 'Опрос №5' },
    ];

    const scrollToIndex = (index) => {
        listRef.current.scrollToIndex({ index, animated: true });
        setActiveIndex(index);
    };

    const handlePrev = () => {
        if (activeIndex > 0) scrollToIndex(activeIndex - 1);
    };

    const handleNext = () => {
        if (activeIndex < dataSurveys.length - 1) scrollToIndex(activeIndex + 1);
    };

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems[0]) {
        setActiveIndex(viewableItems[0].index);
        }
    };

  return (
    <View style={{ flexGrow: 1, backgroundColor: '#172136' }}>
      <View style={{ height: headerHeight, backgroundColor: '#0F1826', 
                               alignItems: 'flex-end', paddingBottom: 10, flexDirection: 'row', width: '100%' }}>
        <View style={{ width: '100%' }}>
            <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'VPG' : 'VPG'}</Text>
        </View>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        <View
            style={{ marginTop: 30, borderRadius: 20, overflow: 'hidden' }}
        >
        <BlurView
            style={{ padding: 20 }}
        >
            <Text
                style={{ color: '#fff', fontSize: 17, fontFamily: 'SftBold', textAlign: 'justify' }}
            >Здесь будут отображаться результаты анонимных опросов, голосований, графики, а так же наиболее популярные анонимные бланки пользователей</Text>
        </BlurView>
        </View>
        <Text
            style={{ color: '#fff', marginTop: 20, fontSize: 20, textAlign: 'center', fontFamily: 'SftMedium' }}
        >Последний опрос на тему <Text style={{ fontFamily: 'SftBold' }}>"Неудовлетворенность сотрудников"</Text> показал:</Text>
        <View
            style={{ marginTop: 15 }}
        >
            <ListItem text={'75% работников не удовлетворены пунктом'} item={'Зарплата'} />
            <ListItem text={'5% работников не удовлетворены пунктом'} item={'Рабочий процесс'} />
            <ListItem text={'19% работников не удовлетворены пунктом'} item={'Ночные смены'} />
            <ListItem text={'1% работников не удовлетворены пунктом'} item={'Другое'} />
        </View>
        <View
            style={{ width: '100%', marginTop: 15 }}
        >
            <Image
                source={diagram1}
                resizeMode='contain'
                style={{ width: '100%', height: 'auto', aspectRatio: ratio }}
            />
        </View>
        <View
            style={{ marginTop: 20 }}
        >
            <Text
                style={{ fontSize: 20, fontFamily: 'SftBold', color: '#fff', textAlign: 'center' }}
            >Наиболее популярные бланки пользователей</Text>
        </View>
        <View
            style={{ marginTop: 0 }}
        >
            <FlashList
            ref={listRef}
            data={dataSurveys}
            horizontal
            pagingEnabled
            estimatedItemSize={SCREEN_WIDTH - 30}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <View style={[styles.slide, { width: SCREEN_WIDTH - 30 }]}>
                <View
                    style={{  backgroundColor: 'skyblue', width: '100%', padding: 10, borderRadius: 15}}
                >
                    <Text style={styles.text}>Анонимный бланк</Text>
                    <ScrollView
                        style={{ marginTop: 10, height: (SCREEN_WIDTH - 90) * 0.6}}
                    >
                        <Text
                            style={styles.textRegular}
                        >Меня не устраивает <Text style={{ fontFamily: 'SftBold' }}>Salary</Text></Text>
                        <Text
                            style={styles.textRegular}
                        >Потому что</Text>
                        <Text
                            style={styles.textRegular}
                        >Я <Text style={{ fontFamily: 'SftBold' }}>НЕ </Text>задумывался об увольнении</Text>
                        <Text
                            style={styles.textRegular}
                        >Потому что</Text>
                    </ScrollView>
                </View>
            </View>
            )}
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />
        
        <TouchableOpacity
            style={{ left: -5, position: 'absolute', top: '40%' }}
            onPress={handlePrev}
            disabled={activeIndex === 0}
        >
          <ArrowLeft width={14} height={30} />
        </TouchableOpacity>

        <TouchableOpacity
            style={{ right: -5, position: 'absolute', top: '40%' }}
            onPress={handleNext}
            disabled={activeIndex === dataSurveys.length - 1}
        >
          <ArrowLeft width={14} height={30} style={{ transform: [{rotateZ: '180deg'}], }} />
        </TouchableOpacity>
     
        <View style={styles.dots}>
        {dataSurveys.map((_, index) => (
          <TouchableOpacity
            onPress={() => {
                scrollToIndex(index)
            }}
            key={index}
            style={[
              styles.dot,
              { opacity: activeIndex === index ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>
        </View>
        <View
            style={{ flexDirection: 'row', justifyContent: 'center' }}
        >
            <TouchableOpacity
                style={[{ backgroundColor: '#6083FF', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 20, margin: 10, marginBottom: 18, marginTop: 0,
                shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4,
                shadowRadius: 7 }, 
                Platform.OS === 'android' && {elevation: 2}]}
                activeOpacity={0.8}
                onPress={() => {
                    
                }}
                >
                    <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 17, fontWeight: '400', fontFamily: 'SftMedium' }, 
                    ]}>{language == 'English' ? 'View more' : 'Остальные бланки'}</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
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
  slide: {
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
    // borderWidth: 1
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'SftBold',
    color: '#000'
  },
  textRegular: {
    color: '#000',
    fontFamily: 'SftMedium',
    fontSize: 17
  },
  arrows: {
    position: 'absolute',
    width: '100%',
    top: '43%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 15,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
})

export default MainScreen