import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestScreen from './src/screens/TestScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  console.log('=== TEST NAVIGATION SIN OPCIONES ===');
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Test" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
