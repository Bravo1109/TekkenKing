import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';

const { width } = Dimensions.get('window');

const data = [
  { id: '1', title: 'Опрос №1' },
  { id: '2', title: 'Опрос №2' },
  { id: '3', title: 'Опрос №3' },
  { id: '4', title: 'Опрос №4' },
  { id: '5', title: 'Опрос №5' },
];

const SurveySlider = () => {
  return (
    <View style={styles.container}>
      <FlashList
        data={data}
        horizontal
        pagingEnabled
        // estimatedItemSize={100}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.text}>{item.title}</Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff'
  },
});

export default SurveySlider;