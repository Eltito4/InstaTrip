import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TestScreen() {
  console.log('>>> TEST SCREEN RENDER');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Test Screen - Con StyleSheet!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 24,
    color: '#000000',
    fontWeight: 600,
  },
});
