import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions,
   Modal, FlatList, ActivityIndicator, Platform, ImageBackground } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing
  } from 'react-native-reanimated';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import ArrowLeft from '../../images/turnBack.svg';
import { BASE_URL } from '../config';


const { width } = Dimensions.get('window');

const icon1 = require("../../images/roulette/vcoin.jpg")
const icon2 = require("../../images/roulette/vcoin150.jpg")
const icon3 = require("../../images/roulette/vcoin500.jpg")
const icon4 = require("../../images/roulette/PLMI3892.jpg")
const icon5 = require("../../images/roulette/midCoin.jpg")
const icon6 = require("../../images/roulette/qrticket.jpg")
const icon7 = require("../../images/roulette/skullCoin.jpg")

const Roulette = (props) => {
  const { SCREEN_HEIGHT } = Dimensions.get('window').height
  const { widthH, heightH } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight({ widthH, heightH }, Platform.OS, insets.top) - 10
  const nowDate = new Date()
  const [rouletteFinishDate, setRouletteFinishDate] = useState('')
  const [language, setLanguage] = useState('')
  const caseItems = [
    { local: true, name: "50 coins", probability: 65, cost: 50, image: icon1, color: 'rgba(77, 120, 169, 0.9)', action: (cost, item) => sendPrize(cost, item) },
    { local: true, name: "150 coins", probability: 15, cost: 150, image: icon2, color: 'rgba(81, 104, 236, 0.9)', action: (cost, item) => sendPrize(cost, item) },
    { local: true, name: "500 coins", probability: 7, cost: 500, image: icon3, color: 'rgba(133, 80, 222, 0.9)', action: (cost, item) => sendPrize(cost, item) },
    { local: true, name: "1000 coins", probability: 6, cost: 1000, image: icon4, color: 'rgba(195, 61, 210, 0.9)', action: (cost, item) => sendPrize(cost, item) },
    { local: true, name: "1500 coins", probability: 4, cost: 1500, image: icon5, color: 'rgba(219, 81, 81, 0.9)', action: (cost, item) => sendPrize(cost, item) },
    { local: false, name: "Voucher", probability: 3, cost: 10000, image: icon6, color: 'rgba(248, 216, 43, 0.9)', action: (cost, item) => getVoucher(cost, item) },
    { local: true, name: "5000 coins", probability: 3, cost: 5000, image: icon7, color: 'rgba(248, 216, 43, 0.9)', action: (cost, item) => sendPrize(cost, item) },
  ];
  const timerRef = useRef(null);
  const [prizeModal, setPrizeModal] = useState(false)
  const [prizeItem, setPrizeItem] = useState(caseItems[0])
  const [loading, setLoading] = useState(true)
  const [loadingPrize, setLoadingPrize] = useState(true)
  const [companiesData, setCompaniesData] = useState([])
  const [openProcess, setOpenProcess] = useState(false)
  const [modal, setModal] = useState(false)
  const [voucher, setVoucher] = useState(false)
  const [modalVoucher, setModalVoucher] = useState(false)
  const [vouchersData, setVouchersData] = useState([])
  const [randomSpace, setRandomSpace] = useState(0)
  const [items, setItems] = useState([])
  const SPINNER_ITEM_WIDTH = width / 4; // Измените это значение в соответствии с размером вашего элемента
  const SPINNER_WIDTH = items.length * SPINNER_ITEM_WIDTH;
  const token = getTokenData()
  const isFocused = useIsFocused();
  function generateItemsArray() {
    let result = [];
    for (let i = 0; i < 70; i++) {
        let a = Math.random() * 100
        if (a <= 65 && a >= 0) {
          result.push(caseItems[0]);
        } else if (a <= 80 && a >= 66) {
          result.push(caseItems[1]);
        } else if (a <= 87 && a >= 81) {
          result.push(caseItems[2]);
        } else if (a <= 93 && a >= 88) {
          result.push(caseItems[3]);
        } else if (a <= 97 && a >= 94) {
          result.push(caseItems[4]);
        } else if (a <= 100 && a >= 98) {
          result.push(caseItems[5]);
        }
    }
    setItems(result)
    return result;
  }
  const [previewOpacity, setPreviewOpacity] = useState(1)
  const scrollX = useSharedValue(0);
  const [caseOpen, setCaseOpen] = useState(false)


  const getRouletteDate = async () => {
    try {
        let rouletteDate = await AsyncStorage.getItem('rouletteDate')
        if(rouletteDate != null) {
          const roulDate = new Date(rouletteDate)
          roulDate.setDate(roulDate.getDate() + 1)
          setRouletteFinishDate(roulDate)
        }
        else {
          const roulDate = new Date('2024-05-05')
          setRouletteFinishDate(roulDate)
        }
    } catch(e) {
        console.log('error', e)
        const roulDate = new Date('2024-05-05')
        setRouletteFinishDate(roulDate)
    }
  }

  const writeRouletteDate = async (value) => {
    try {
        await AsyncStorage.setItem('rouletteDate', value)
        getRouletteDate()
    } catch(e) {
        console.log('error', e)
    }
    console.log('Done', value)
  }

  useEffect(() => {
    if (isFocused) {
      getRouletteDate()
      // const dateb = new Date().getDate(new Date().setDate() -1)
      // writeRouletteDate(new Date(dateb).toUTCString())
    }
  }, [isFocused]);

  const loadItems = () => {
    let status = 0
    fetch(`${BASE_URL}/api/prize_items/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then((resp) => {
        status = resp.status
        return resp.json()
    }).then(res => {
      console.log(res)
      if (status == 200) {
        setVoucher(res.random_qr.voucher)
        setRandomSpace(res.random)
        writeRouletteDate(new Date().toUTCString())
        let result = [];
        for (let i = 0; i < res.items.length; i++) {
          result.push(caseItems[res.items[i]])
        }
        setItems(result)
      } else if (status == 403) {
        writeRouletteDate(res.roulette)
        setOpenProcess(false)
      }
      
    })
    .catch(error => {
      console.log("Error load data", error)
      setOpenProcess(false)
    })
  }

  const loadVouchers = () => {
    console.log('loadVoucers')
    fetch(`${BASE_URL}/api/companies/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._j}`
      }
    }).then(resp => resp.json())
    .then(res => {
      setCompaniesData(res.results)
      setLoading(false)
    })
    .catch(error => {
      console.log("Error", error)
      setLoading(false)
    })
  }

  const sendPrize = async (prize, item) => {
    console.log('prizeee', prizeItem)
    const citem = item
    setPrizeItem(citem)
    setPrizeModal(true)
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
    setLoadingPrize(false)
    // await fetch(`https://bravo511.pythonanywhere.com/api/prize/`, {
    //     method:"POST",
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //       'Authorization': `${token._j}`
    //     },
    //     body: JSON.stringify({
    //       vallet: prize
    //     })
    //   }).then((resp) => {
    //     console.log('resp')
    //   }).catch(error => {
    //     console.log("Error", error)
    //   })
  }
  const getVoucher = async (prize, item) => {
    setLoadingPrize(true)
    setPrizeModal(true)
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
    console.log('items', item)
    console.log('voucher', prize)
    setPrizeItem(prize)
    setLoadingPrize(false)
    // await fetch(`https://bravo511.pythonanywhere.com/api/qrcode/get_random_qr/`, {
    //     method:"GET",
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //       'Authorization': `${token._j}`
    //     }
    //   }).then(resp => resp.json())
    //   .then((res) => {
    //     console.log(res)
    //     setPrizeItem(res.voucher)
    //     Haptics.notificationAsync(
    //       Haptics.NotificationFeedbackType.Success
    //     )
    //     setLoadingPrize(false)
    //   })
    //   .catch(error => {
    //     console.log("Error", error)
    //   })

  }
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
    loadVouchers()
  }, []);
  useEffect(() => {
    if(items.length > 0 && isFocused) {
      scV()
      setPreviewOpacity(0)
      setCaseOpen(true)
      timerRef.current = setTimeout(() => {
        setLoadingPrize(true)
        const selectedItem = getSelectedItem(scrollX.value, SPINNER_ITEM_WIDTH);
        console.log('items35', items[Math.floor(((110) * (randomSpace + 35) + 200) / (110)) % items.length])
        // setPrizeItem(selectedItem)
        // setPrizeModal(true)
        // Haptics.notificationAsync(
        //   Haptics.NotificationFeedbackType.Success
        // )
        selectedItem.action(voucher, selectedItem)
        // setPrizeModal(true)
        // Haptics.notificationAsync(
        //   Haptics.NotificationFeedbackType.Success
        // )
        setCaseOpen(false)
        clearTimeout(timerRef.current)
      }, 6000)
    }
  }, [items]);
  useEffect(() => {
    if (caseOpen === true) {
      const duration = 6000; // длительность анимации в мс
      const startTime = Date.now();
      const fromValue = scrollX.value;
      const toValue = (width / 4 + 10) * (randomSpace + 35);

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Пример easing-функции cubic out:
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        // Вычисляем новое значение
        scrollX.value = fromValue + (toValue - fromValue) * easedProgress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [caseOpen, randomSpace, scrollX]);
  // useEffect(() => {
  //   if(caseOpen === true) {
  //     scrollX.value = withTiming((width / 4 + 10) * (randomSpace + 35), { duration: 6000, easing: Easing.out(Easing.cubic) });
  //   }
  // }, [caseOpen]);
//
  const scV = () => {
    scrollX.value = 0
  }

  function getSelectedItem(position, itemWidth) {
    const totalItemWidth = itemWidth + 10; // учет отступов
    const index = Math.floor((position + width / 2) / totalItemWidth); // добавить половину ширины экрана
    return items[index % items.length];
  }

  const renderLogos = (item) => {
    return(
    <View
      style={{ width: '100%',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}
    >
      <TouchableOpacity
        style={{  overflow: 'hidden', width: '100%', flexDirection:"row", alignItems: 'center' }}
        activeOpacity={0.8}
        onPress={() => {
          setVouchersData(item.vouchers)
          setModalVoucher(true)
        }}
      >
        <ImageBackground
          style={{width: 60, aspectRatio: 1/1, overflow: 'hidden', backgroundColor: '#0F1825',
                  borderRadius: 10}}
        >
          <ActivityIndicator
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          />
        <Image
        style={{ width: '100%', borderRadius: 10, aspectRatio: 1/1 }}
        source={{uri: `${BASE_URL}${item.compressed_image_url}`}}
      />
      </ImageBackground>
      <Text
        style={{ fontSize:17, color: '#fff', fontFamily: 'SftMedium', marginLeft: 15 }}
      >{item.name}</Text>
      </TouchableOpacity>
    </View>
    )
  }

  const renderVoucherData = () => {
    const data = vouchersData

    return data.map((item, i) => {
      return(
      <View key={item.id}
        style={{ width: '50%', paddingHorizontal: 5, marginVertical: 5 }}
      >
      <View style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 20 }}>
      <View
        style={{ width: '100%', aspectRatio: 1/1, alignSelf: 'center', padding: 15 }}
      >
        <ImageBackground
          style={{width: '100%', aspectRatio: 1/1, overflow: 'hidden', backgroundColor: '#0F1825',
                  borderRadius: 10}}
        >
          <ActivityIndicator
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          />
          <Image
            style={{ width: '100%', height: '100%', borderRadius: 10 }}
            source={{uri: `${BASE_URL}${item.compressed_image_url}`}}
          />
        </ImageBackground>   
      </View>
      <View
        style={{ paddingHorizontal: 20 }}
      >
        <Text
          style={{ color: '#fff', fontSize: 17, fontWeight: '600', textAlign: 'center', marginBottom: 25}}
        >{item.name}</Text>
      </View>
      </View>
      
      </View>
      )
  })
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -scrollX.value }],
    };
  });

  return (
    <View style={{  flex: 1, backgroundColor: '#172136', }}>
      {prizeModal && <View
            style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}
          >
            <View
            style={{ width: width * 0.9, minHeight: width * 0.9, justifyContent: 'space-between',
             backgroundColor: "#172136", alignItems: 'center', paddingVertical: 30, borderRadius: 15 }}
          >
            <IconButton
            size={17}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 25, height: 25, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              setPrizeModal(false)
            }}
          />
            <Text
              style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontFamily: 'SftBold', width: '80%' }}
            >{language == 'English' ? 'Your Prize' : 'Вы выиграли'}</Text>
            {!loadingPrize && <Text
              style={{ textAlign: 'center', fontSize: 17, color: '#fff', fontFamily: 'SftMedium',
               marginTop: 10, backgroundColor: '#193456', paddingVertical: 7, paddingHorizontal: 15,  borderRadius: 8, overflow: 'hidden' }}
            >{prizeItem.name}</Text>}
            {!loadingPrize ? <View
              style={{ borderRadius: 25, overflow: 'hidden', marginVertical: 20, height: width * 0.4, width: width * 0.4 }}
            >
              {console.log('sadfsdfsdf', prizeItem)}
              {prizeItem.local && <Image
                source={prizeItem.image}
                style={{ height: '100%', width: '100%',  paddingHorizontal: 0 }}
              />}
              {!prizeItem.local && <Image
                source={{uri: `${prizeItem.image}`}}
                style={{ height: '100%', width: '100%',  paddingHorizontal: 0 }}
              />
              }
            </View> :
            <View
            style={{  height: width * 0.4, aspectRatio: 1/1, left: 0, top: 0, zIndex: 100000000,
               alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator 
              color={'#fff'}
            />  
          </View>}
            
            <TouchableOpacity
            style={[{ backgroundColor: '#6083FF', width: '80%', borderRadius: 12, paddingVertical: 15, flexDirection: 'row', 
            shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
            Platform.OS === 'android' && {elevation: 2}]}
            activeOpacity={0.8}
            onPress={() => {
              setPrizeModal(false)
              setOpenProcess(false) 
            }}
          >
            <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'SftMedium', marginRight: 5 }]}>{language == 'English' ? 'Get' : 'Получить'}</Text>
          </TouchableOpacity>
          </View>
          </View>}
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
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Cases' : 'Кейсы'}</Text>
                </View>
            </View>
    <View style={{ flex: 1, justifyContent: 'center', marginBottom: '10%'}}>
      <View style={{justifyContent: 'center', marginBottom: 20}}>
        
      <View
        style={{ width: width / 2, height: SPINNER_ITEM_WIDTH + 30,
         position: 'absolute', left: 3, zIndex: 1000, borderRightWidth: 3, borderColor: 'tomato' }}
      ></View>
      <View
        style={{ width: width / 2, height: SPINNER_ITEM_WIDTH + 30,
         position: 'absolute', left: 0, zIndex: 100, flexDirection: 'row', alignItems: 'center', opacity: previewOpacity}}
      >
        <View style={{ width: SPINNER_ITEM_WIDTH, aspectRatio: 1/1, margin: 5, borderRadius: 15, overflow: 'hidden' }}>
          <Image
          source={caseItems[0].image}
            style={{ width: SPINNER_ITEM_WIDTH, height: SPINNER_ITEM_WIDTH, backgroundColor: '#000' }}
          />
          <View style={{ position: 'absolute', bottom: 0, left: 0, backgroundColor: caseItems[0].color,
           height: '30%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{ color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'SftMedium' }}
            >{caseItems[0]['name']}</Text>
          </View>
        </View>
        <View style={{ width: SPINNER_ITEM_WIDTH, aspectRatio: 1/1, margin: 5, borderRadius: 15, overflow: 'hidden' }}>
          <Image
          source={caseItems[3].image}
            style={{ width: SPINNER_ITEM_WIDTH, height: SPINNER_ITEM_WIDTH, backgroundColor: '#000'  }}
          />
          <View style={{ position: 'absolute', bottom: 0, left: 0, backgroundColor: caseItems[3].color,
           height: '30%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{ color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'SftMedium' }}
            >{caseItems[3]['name']}</Text>
          </View>
        </View>
        
        <View style={{ width: SPINNER_ITEM_WIDTH, aspectRatio: 1/1, margin: 5, borderRadius: 15, overflow: 'hidden' }}>
          <Image
          source={caseItems[5].image}
            style={{ width: SPINNER_ITEM_WIDTH, height: SPINNER_ITEM_WIDTH, backgroundColor: '#000'  }}
          />
          <View style={{ position: 'absolute', bottom: 0, left: 0, backgroundColor: caseItems[5].color,
           height: '30%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{ color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'SftMedium' }}
            >{caseItems[5]['name']}</Text>
          </View>
        </View>
        <View style={{ width: SPINNER_ITEM_WIDTH, aspectRatio: 1/1, margin: 5, borderRadius: 15, overflow: 'hidden' }}>
          <Image
          source={caseItems[4].image}
            style={{ width: SPINNER_ITEM_WIDTH, height: SPINNER_ITEM_WIDTH, backgroundColor: '#000'  }}
          />
          <View style={{ position: 'absolute', bottom: 0, left: 0, backgroundColor: caseItems[4].color,
           height: '30%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{ color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'SftMedium' }}
            >{caseItems[4]['name']}</Text>
          </View>
        </View>
      </View>
      <Animated.View style={[{ flexDirection: 'row', width: SPINNER_WIDTH, minWidth: (SPINNER_ITEM_WIDTH + 10) * 70, height: SPINNER_ITEM_WIDTH + 30, backgroundColor: '#0F1826', paddingVertical: 10 }, animatedStyle]}>
      
      {items.map((item, index) => (
        <View key={index} style={{ width: SPINNER_ITEM_WIDTH, margin: 5, borderRadius: 15, overflow: 'hidden' }}>
          <Image
          source={item.image}
            style={{ width: SPINNER_ITEM_WIDTH, height: SPINNER_ITEM_WIDTH,  }}
          />
          <View style={{ position: 'absolute', bottom: 0, left: 0, backgroundColor: item.color,
           height: '30%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}
            >{item['name']}</Text>
          </View>
        </View>
      ))}
    </Animated.View>
    
    </View>
    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
    {nowDate > rouletteFinishDate ? <TouchableOpacity
        style={[{ backgroundColor: '#6083FF', borderRadius: 15, flexDirection: 'row', paddingVertical: 17, margin: 10, marginVertical: 20,
        shadowColor: '#6083FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.4,
        paddingHorizontal: 20, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }, 
        Platform.OS === 'android' && {elevation: 2}]}
        onPress={() => {
            if (openProcess == false && caseOpen === false) {
                // generateItemsArray()
                setOpenProcess(true)
                loadItems()
            }
            
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontFamily: 'SftBold', opacity: !openProcess ? 1 : 0 }}>{language == 'English' ? 'Open Case' : 'Открыть Кейс'}</Text>
        {openProcess && <ActivityIndicator
          style={{ position: 'absolute' }}
          color={'#fff'}
        />}
      </TouchableOpacity> : <TouchableOpacity
        style={[{ backgroundColor: '#818C99', borderRadius: 15, flexDirection: 'row', paddingVertical: 17, margin: 10, marginVertical: 20,
        paddingHorizontal: 20, shadowRadius: 7, justifyContent: 'center', alignItems: 'center' }]}
        onPress={() => {
            // if (openProcess == false && caseOpen === false) {
            //     // generateItemsArray()
            //     setOpenProcess(true)
            //     loadItems()
            // }
            alert('Вы можете открыть кейс только один раз за день')
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontFamily: 'SftBold' }}>{language == 'English' ? 'Open Case' : 'Открыть Кейс'}  <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center',fontFamily: 'SftMedium' }}>{Math.floor((new Date(rouletteFinishDate) - nowDate) / (1000 * 60 * 60)) < 10 && '0'}{Math.floor((new Date(rouletteFinishDate) - nowDate) / (1000 * 60 * 60)) >= 0 ? Math.floor((new Date(rouletteFinishDate) - nowDate) / (1000 * 60 * 60)) : '0'}:{(Math.floor(((new Date(rouletteFinishDate) - nowDate) / (1000 * 60)) % 60) < 10 || Math.floor((new Date(rouletteFinishDate) - nowDate) / (1000 * 60 * 60)) < 0) && '0'}{Math.floor((new Date(rouletteFinishDate) - nowDate) / (1000 * 60 * 60)) >= 0 ? Math.floor(((new Date(rouletteFinishDate) - nowDate) / (1000 * 60)) % 60) : '0'}</Text></Text>
      </TouchableOpacity>}
    </View>
    <View style={{ width: '100%', alignItems: 'center', marginTop: 20}}>
        <Button style={{margin:0}}
                mode = 'text'
                icon={'chevron-down'}
                contentStyle={{ flexDirection: 'row-reverse' }}
                labelStyle={{ fontSize: 17, fontWeight: '300', fontFamily: 'SftLight' }}
                textColor='#6083FF'
                onPress={() => {
                  setModal(true)
                }}
            >{language == 'English' ? 'Prizes of the month' : 'Призы этого месяца'}</Button>
        </View>
      <Modal
        transparent={true}
        animationType='fade'
        visible={modal}
        statusBarTranslucent={true}
        >
        {!loading ? <View style={{
            flex: 1,
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
            opacity: 0.6,
            position:'absolute',
            left: 0,
            top: 0,
            zIndex: 0
          }}
          activeOpacity={0.6}
          >
          </TouchableOpacity>
          <View
            style={{ width: '100%', height: '100%', backgroundColor: '#172136' }}
          >
            <View style={{ height: headerHeight, backgroundColor: '#0F1826', 
            alignItems: 'flex-end', paddingBottom: 10, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                      setModal(false)
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Prizes of the month' : 'Призы месяца'}</Text>
                </View>
            </View>
           
            {companiesData ? <FlatList
              data={companiesData}
              numColumns={1}
              renderItem = {({item}) => {
                return renderLogos(item)
              }}
              keyExtractor = {item => `${item.id}`}
            /> : 
            <View
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', width: '100%', height: '100%', position: 'absolute',
            left: 0, top: 0, zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator 
              color={'#fff'}
            />  
          </View>}
            {modalVoucher && <View
              style={{ width: '100%', height: '100%', backgroundColor: '#172136', borderRadius: 15,
              position: 'absolute', zIndex: 100  }}
            >
              <View style={{ height: headerHeight, backgroundColor: '#0F1826', borderTopLeftRadius: 10, borderTopRightRadius: 10, 
            alignItems: 'flex-end', paddingBottom: 10, flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity style={{ width: '20%', paddingLeft: 10 }}
                    onPress={() => {
                      setModalVoucher(false)
                    }}
                >
                    <ArrowLeft height={20} width={20} />
                </TouchableOpacity>
                <View style={{ width: '60%' }}>
                    <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Prizes of the month' : 'Призы месяца'}</Text>
                </View>
            </View>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, paddingVertical: 20 }}
              bounces={true}
            >
              {renderVoucherData()}
            </ScrollView>
              
              
            </View>}
          </View>
          </View> : 
          <View>
            <ActivityIndicator size='small' color='#aaa' />
          </View>}
          </Modal>
          
    </View>
    </View>
  )
}

export default Roulette