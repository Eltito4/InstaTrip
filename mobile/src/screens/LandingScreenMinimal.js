import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LandingScreenMinimal({ navigation }) {
  console.log('>>> MINIMAL LandingScreen RENDER');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>InstaTrip</Text>
      <Text style={styles.subtitle}>Testing Minimal Version</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home', { user: { name: 'Test' } })}
      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#7C3AED',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 600,
  },
});
