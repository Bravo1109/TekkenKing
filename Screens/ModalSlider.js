import React, {useState, useEffect, useContext} from 'react';
import { Modal, View, TouchableOpacity, Animated, Text, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IconButton } from 'react-native-paper';
import RangeSlider from './RangeSlider';
import CheckBox from './CheckBox';
import { CommonActions } from '@react-navigation/native';
import ParamsContext from './ParamsContext';

function ModalSlider(props) {
    console.log('set')
    const { triggerFunction } = useContext(ParamsContext)
    const [language, setLanguage] = useState('')
    const writeAgeFrom = async (value) => {
        try {
            await AsyncStorage.setItem('ageFrom', value)
            .then(() => {triggerFunction()})
        } catch(e) {
            console.log('error', e)
        }
        console.log('Done', value)
      }

    const writeAgeTo = async (value) => {
        try {
            await AsyncStorage.setItem('ageTo', value)
        } catch(e) {
            console.log('error', e)
        }
        console.log('Done', value)
      }
    
    const writeGender = async (value) => {
        try {
            await AsyncStorage.setItem('chooseGender', value)
        } catch(e) {
            console.log('error', e)
        }
        console.log('Done', value)
    }
  const SCREEN_WIDTH = Dimensions.get('window').width
  const {data} = props.route.params
  const [checkMale, setCheckMale] = useState(data.gender == 'male')
  const [checkFemale, setCheckFemale] = useState(data.gender == 'female')
  const [checkAll, setCheckAll] = useState(data.gender == 'all')
  const [gender, setGender] = useState(data.gender)
  const [ageFrom, setAgeFrom] = useState(data.startPos)
  const [ageTo, setAgeTo] = useState(data.endPos)
  console.log(data.sliderWidth)
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
  }, [])
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
    <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: SCREEN_WIDTH,
          backgroundColor: 'transparent'
        }}
        >
        <View style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'transparent'
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            
          <TouchableOpacity onPress={() => {
            props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.8,
            position:'absolute',
            left: 0,
            top: 0,
            zIndex: 0
          }}
          activeOpacity={0.8}
          >
          </TouchableOpacity>
          <Animated.View style={{
            backgroundColor: '#172136',
            // borderRadius: 15,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            width: '100%',
            overflow:'hidden',
          }}
          activeOpacity={1}
          >
          <View style={{ marginTop: 20}}>
            <Text style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontWeight: '600', fontFamily: 'SftBold' }}>{language == 'English' ? 'Search settings' : 'Фильтры поиска'}</Text>
          </View>
          <IconButton
            size={20}
            icon='close'
            iconColor='#818C99'
            style={{ alignSelf: 'flex-end', width: 30, height: 30, position: 'absolute',
            backgroundColor: 'rgba(129, 140, 153, 0.2)', top: 5, right: 5, zIndex: 10 }}
            onPress={() => {
              props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
            }}
          />
          <View style={{
            height: 0.33,
            width: '100%',
            backgroundColor: '#343434',
            marginTop: 20
          }} />
          <View style={{ marginTop: 60 }}>
          <RangeSlider sliderWidth={data.sliderWidth} min={data.min} max={data.max} step={1} startPos={data.startPos} endPos={data.endPos} onValueChange={(range) => {
            setAgeFrom(range.min)
            setAgeTo(range.max)
            console.log(ageFrom, ageTo)
          }} />
          </View>
          {/* </GestureHandlerRootView> */}
          <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: 50 }}>
          <Text style={{ fontSize: 20, marginLeft: 20, color: '#BDBDBD', fontWeight: '300', fontFamily: 'SftLight' }}>{language == 'English' ? 'Gender' : 'Пол'}: </Text>
          <TouchableOpacity style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', marginTop: 17 }}
            activeOpacity={0.6}
            onPress={() => {
                setCheckMale(false)
                setCheckFemale(false)
                setCheckAll(true)
                setGender('all')
            }}
          >
          <CheckBox size={35} color='#B8C1CC' selectedColor='#2688EB'
            selected={checkAll}
            onPress={() => {
                setCheckMale(false)
                setCheckFemale(false)
                setCheckAll(true)
                setGender('all')
            }}
          /> 
          <Text style={{ fontSize: 17, color: '#fff', fontFamily: 'SftLight' }}>{language == 'English' ? 'All' : 'Любой'}</Text>
          </TouchableOpacity> 
          <TouchableOpacity style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', marginTop: 17 }}
          activeOpacity={0.6}
            onPress={() => {
              setCheckMale(true)
              setCheckFemale(false)
              setCheckAll(false)
              setGender('male')
            }}
          >
          <CheckBox size={35} color='#B8C1CC' selectedColor='#2688EB'
            selected={checkMale}
            onPress={() => {
                setCheckMale(true)
                setCheckFemale(false)
                setCheckAll(false)
                setGender('male')
            }}
          /> 
          <Text style={{ fontSize: 17, color: '#fff', fontFamily: 'SftLight' }}>{language == 'English' ? 'Male' : 'Мужчины'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', marginTop: 17 }}
            activeOpacity={0.6}
            onPress={() => {
                setCheckMale(false)
                setCheckFemale(true)
                setCheckAll(false)
                setGender('female')
            }}
          >
          <CheckBox size={35} color='#B8C1CC' selectedColor='#2688EB'
            selected={checkFemale}
            onPress={() => {
                setCheckMale(false)
                setCheckFemale(true)
                setCheckAll(false)
                setGender('female')
            }}
          /> 
          <Text style={{ fontSize: 17, color: '#fff', fontFamily: 'SftLight' }}>{language == 'English' ? 'Female' : 'Женщины'}</Text>
          </TouchableOpacity>
          
          </View>
          <View style={{ width: '100%', paddingHorizontal: 20, marginBottom: 40, marginTop:30 }}>
          <TouchableOpacity
          onPress={() => {
            // this.loadData()
            writeAgeFrom(ageFrom.toString())
            writeAgeTo(ageTo.toString())
            writeGender(gender)
            .then(() => {
                props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
            })
            // .then(() => {triggerFunction()})
            // this.writeAgeTo(this.state.age_to._j.toString())
          }}
          style={[{ borderWidth: 1, borderColor: '#90A9FF', borderRadius: 12, paddingVertical: 12,
          shadowColor: '#90A9FF', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 3 },
          Platform.OS === 'android' && {elevation: 3, backgroundColor: '#172136'}]}
          activeOpacity={0.8}
          >
          <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 20, fontFamily: 'SftMedium' }, Platform.OS === 'android' && {
            textShadowColor: '#fff', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 7
          }]}>{language == 'English' ? 'Accept' : 'Принять'}</Text>
          </TouchableOpacity>
          </View>
          </Animated.View>
        </View>
      </View>
      </View>
  );
}

export default ModalSlider;