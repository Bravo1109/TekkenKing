import { StyleSheet, Text, View, TextInput, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { PanGestureHandler, GestureHandlerRootView, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Animated, {
    useSharedValue, useAnimatedStyle,
    useAnimatedGestureHandler, useAnimatedProps,
    runOnJS, useDerivedValue
} from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';

const RangeSlider = ({sliderWidth, min, max, step, onValueChange, startPos, endPos, labelAlign='flex-start', labelColor='#BDBDBD', labelFSZ=20}) => {
  const [language, setLanguage] = useState('')
  const position = useSharedValue(Math.floor(startPos * (sliderWidth / (max - min)) - min * (sliderWidth / (max - min))) + sliderWidth / 100);
  const position2 = useSharedValue(Math.floor(endPos * (sliderWidth / (max - min)) - min * (sliderWidth / (max - min))) + sliderWidth / 100);
  const zIndex = useSharedValue(0);
  const zIndex2 = useSharedValue(0);
  const opacity = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const [minValue, setMinValue] = useState(startPos);
  const [maxValue, setMaxValue] = useState(endPos);
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
        ctx.startX = position.value;
    },
    onActive: (e, ctx) => {
        opacity.value = 1
        if(ctx.startX + e.translationX < 0) {
            position.value = 0 
        } else if(ctx.startX + e.translationX > position2.value - 15) {
            position.value = position2.value - 15;
            zIndex.value = 1
            zIndex2.value = 0
        } else {
            position.value = ctx.startX + e.translationX;
        }
        runOnJS(setMinValue)(min + Math.floor(position.value / (sliderWidth / ((max - min) / step))) * step);
    },
    onEnd: () => {
        opacity.value = 0;
        runOnJS(onValueChange)({
            min: min + Math.floor(position.value / (sliderWidth / ((max - min) / step))) * step,
            max: min + Math.floor(position2.value / (sliderWidth / ((max - min) / step))) * step
        })
    }
  })
  const gestureHandler2 = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
        ctx.startX = position2.value;
    },
    onActive: (e, ctx) => {
        opacity2.value = 1
        if(ctx.startX + e.translationX > sliderWidth) {
            position2.value = sliderWidth 
        } else if(ctx.startX + e.translationX < position.value + 15) {
            position2.value = position.value + 15;
            zIndex.value = 0
            zIndex2.value = 1
        } else {
            position2.value = ctx.startX + e.translationX;
        }
        runOnJS(setMaxValue)(min + Math.floor(position2.value / (sliderWidth / ((max - min) / step))) * step);
    },
    onEnd: () => {
        opacity2.value = 0;
        runOnJS(onValueChange)({
            min: min + Math.floor(position.value / (sliderWidth / ((max - min) / step))) * step,
            max: min + Math.floor(position2.value / (sliderWidth / ((max - min) / step))) * step
        })
    }
  })
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: position.value}],
  }))
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{translateX: position2.value}],
  }))
  
  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{translateX: position.value}],
    width: position2.value - position.value,
  }))

  const getLanguageData = async () => {
    try {
        const languageData = await AsyncStorage.getItem('language')
        console.log('slider lang', languageData)
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
    <View style={[styles.sliderContainer, {width: sliderWidth}]}>
      <View style={[styles.labelUp, {alignSelf: labelAlign}]}>
        <Text style={[styles.labelUpText, {color: labelColor, fontSize: labelFSZ}]}>{language == 'English' ? 'Age' : 'Возраст'}</Text>
      </View>
      <View style={[styles.sliderBack, {width: sliderWidth}]} />
      <Animated.View style={[styles.sliderFront, sliderStyle]} />
      <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.thumbLeftShadow, animatedStyle]}>
      {Platform.OS === 'android' && <Shadow
                distance={80}
                offset={[-30, 30]}
                startColor='rgba(5, 0, 255, 0.12)'
              />}
      <Animated.View style={[styles.thumbLeftShadow]}>
      <Animated.View style={[styles.thumb]}>
        <Animated.View style={[styles.label]}>
          <Text style={styles.labelText}>
            {minValue}
          </Text>
        </Animated.View>
        </Animated.View>
        </Animated.View>
      </Animated.View>
      </PanGestureHandler>
      <PanGestureHandler onGestureEvent={gestureHandler2}>
      <Animated.View style={[styles.thumbRightShadow, animatedStyle2]}>
      {Platform.OS === 'android' && <Shadow
                distance={80}
                offset={[-30, 30]}
                startColor='rgba(181, 255, 60, 0.1)'
              />}
      <Animated.View style={[styles.thumbRightShadow]}>
      <Animated.View style={[styles.thumb]}>
        <Animated.View style={[styles.label, {flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start'}]}>
          <Text style={styles.labelText}>
            {maxValue}
          </Text>
          {maxValue == 60 && <Text style={{ color: '#BDBDBD', fontFamily: 'SftMedium' }}>+</Text>}
        </Animated.View>
        </Animated.View>
        </Animated.View>
      </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

export default RangeSlider

const styles = StyleSheet.create({
    sliderContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
    },
    sliderBack: {
        height: 3,
        backgroundColor: '#616161',
        borderRadius: 20,
        width: 300
    },
    sliderFront: {
        height: 3,
        backgroundColor: '#6083FF',
        borderRadius: 20,
        position: 'absolute',
        shadowColor: '#6083FF',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 3
    }, thumb: {
        position: 'absolute',
        width: 30,
        height: 30,
        left: -15,
        backgroundColor: '#6083FF',
        borderRadius: 100,
        borderColor: '#fff',
        borderWidth: 2,
        shadowColor: '#6083FF',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 2,
    },
    thumbLeftShadow: {
      position: 'absolute',
      width: 30,
      height: 30,
      left: 0,
      borderRadius: 100,
      shadowColor: '#0500FF',
      shadowOffset: {width: -25, height: 15},
      shadowOpacity: 0.6,
      shadowRadius: 40,
  },
  thumbRightShadow: {
    position: 'absolute',
    width: 30,
    height: 30,
    left: 0,
    borderRadius: 100,
    shadowColor: '#B5FF3C',
    shadowOffset: {width: 25, height: 15},
    shadowOpacity: 0.6,
    shadowRadius: 40,
},
    label: {
        position: 'absolute',
        top: 35,
    },
    labelText: {
        fontWeight: '400',
        fontSize: 16,
        zIndex: 100,
        opacity: 1,
        color: '#BDBDBD',
        fontFamily: 'SftLight'
    },
    labelUp: {
      position: 'absolute',
      top: -45,
    },
    labelUpText: {
      fontWeight: '300',
      width: '100%',
      zIndex: 100,
      opacity: 1,
      fontFamily: 'SftLight'
  },
})