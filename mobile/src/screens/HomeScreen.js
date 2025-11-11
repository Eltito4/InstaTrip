import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ route, navigation }) {
  console.log('>>> HomeScreen RENDER START');
  const { user } = route.params || {};
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) {
      Alert.alert('Error', 'Por favor, pega un link de TikTok o Instagram');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implementar llamada al backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Por ahora, mostrar un mensaje de éxito
      Alert.alert(
        '¡Análisis completo!',
        'Tu itinerario está listo. (En desarrollo)',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo analizar el video');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar' },
        { text: 'Cerrar sesión', onPress: () => navigation.navigate('Landing') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FFFFFF', '#FFFFFF']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.logoText}>InstaTrip</Text>
            <Text style={styles.welcomeText}>Hola, {user?.name || 'viajero'} 👋</Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Input Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>¿Viste un video de viaje que te encantó?</Text>
          <Text style={styles.cardSubtitle}>
            Pega el link del video de TikTok o Instagram y te montamos el viaje completo
          </Text>

          {/* Location Info */}
          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>📍 Tu ubicación: Madrid (MAD)</Text>
          </View>

          {/* Input */}
          <TextInput
            style={styles.input}
            value={videoUrl}
            onChangeText={setVideoUrl}
            placeholder="https://www.tiktok.com/@usuario/video/..."
            placeholderTextColor="#9CA3AF"
            editable={!loading}
          />

          {/* Button */}
          <TouchableOpacity
            style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]}
            onPress={handleAnalyze}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#9CA3AF', '#9CA3AF'] : ['#6366F1', '#8B5CF6']}
              style={styles.analyzeGradient}
              start={[0, 0]}
              end={[1, 0]}
            >
              {loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator color="white" />
                  <Text style={styles.analyzeText}>Analizando...</Text>
                </View>
              ) : (
                <Text style={styles.analyzeText}>✈️ Crear Viaje</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Supported Platforms */}
          <View style={styles.platforms}>
            <Text style={styles.platformsTitle}>✨ Plataformas soportadas:</Text>
            <Text style={styles.platformItem}>• TikTok (videos públicos)</Text>
            <Text style={styles.platformItem}>• Instagram Reels (videos públicos)</Text>
          </View>
        </View>

        {/* How it Works */}
        <View style={styles.howItWorks}>
          <Text style={styles.howTitle}>¿Cómo funciona?</Text>

          <View style={styles.steps}>
            <View style={styles.step}>
              <View style={styles.stepIcon}>
                <Text style={styles.stepEmoji}>📱</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>1. Pega el Link</Text>
                <Text style={styles.stepText}>
                  Copia el enlace de cualquier video de viaje que te inspire
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepIcon}>
                <Text style={styles.stepEmoji}>🤖</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>2. IA Analiza</Text>
                <Text style={styles.stepText}>
                  Nuestra IA identifica lugares, actividades y crea tu itinerario
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepIcon}>
                <Text style={styles.stepEmoji}>✈️</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>3. ¡A Viajar!</Text>
                <Text style={styles.stepText}>
                  Recibe tu plan completo listo para reservar y disfrutar
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  welcomeText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  logoutText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  locationBadge: {
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  locationText: {
    fontSize: 13,
    color: '#4F46E5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#111827',
    marginBottom: 16,
  },
  analyzeButton: {
    marginBottom: 16,
  },
  analyzeButtonDisabled: {
    opacity: 0.7,
  },
  analyzeGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  analyzeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  platforms: {
    
  },
  platformsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  platformItem: {
    fontSize: 13,
    color: '#6B7280',
  },
  howItWorks: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  howTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  steps: {
    
  },
  step: {
    flexDirection: 'row',
    
  },
  stepIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepEmoji: {
    fontSize: 24,
  },
  stepContent: {
    flex: 1,
    
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  stepText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
