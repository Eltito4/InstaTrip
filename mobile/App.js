import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreenMinimal from './src/screens/LandingScreenMinimal';
import HomeScreenMinimal from './src/screens/HomeScreenMinimal';

const Stack = createNativeStackNavigator();

export default function App() {
  console.log('=== APP INICIANDO - TESTING MINIMAL VERSION ===');
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreenMinimal} />
        <Stack.Screen name="Home" component={HomeScreenMinimal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
