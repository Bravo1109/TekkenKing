import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'

const Tipewriter = ({inputText, typingSpeed = 100, onTypingComplete}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    console.log(inputText)
    let index = 0;
    let typingTimeout;

    const typeText = () => {
        if (index < inputText.length) {
            if(index > 1) {
                setDisplayedText((prevText) => prevText + inputText[index]);
            }
            index++;
            typingTimeout = setTimeout(typeText, typingSpeed);
        } else {
            onTypingComplete()
        }
    };
    
    typeText()
    return () => {
        clearTimeout(typingTimeout);
    }
  }, [inputText, typingSpeed]);

  useEffect(() => {
    setDisplayedText(inputText[0] + inputText[1])
  }, [inputText, typingSpeed])
  return (
    <View 
      style={inputText == ' ' ? { opacity: 0 } : {opacity: 1}}
    >
      <Text style={{ padding: 10, fontSize: 20 }}>{displayedText}</Text>
    </View>
  )
}

export default Tipewriter