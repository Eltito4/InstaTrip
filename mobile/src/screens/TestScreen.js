import React from 'react';
import { View, Text } from 'react-native';

export default function TestScreen() {
  console.log('>>> TEST SCREEN RENDER');

  return (
    <View style={{ flex: 1, padding: 50, backgroundColor: '#FFFFFF' }}>
      <Text style={{ fontSize: 24, color: '#000000' }}>
        Test Screen - Si ves esto, funciona!
      </Text>
    </View>
  );
}
