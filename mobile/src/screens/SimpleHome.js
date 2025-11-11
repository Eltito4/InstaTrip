import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SimpleHome({ user, onLogout }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) {
      Alert.alert('Error', 'Por favor, pega un link de TikTok o Instagram');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('¡Análisis completo!', 'Tu itinerario está listo. (En desarrollo)');
    } catch (error) {
      Alert.alert('Error', 'No se pudo analizar el video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>InstaTrip</Text>
          <Text style={styles.welcome}>Hola, {user?.name || 'viajero'} 👋</Text>
        </View>
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            ¿Viste un video de viaje que te encantó?
          </Text>
          <Text style={styles.cardSubtitle}>
            Pega el link del video de TikTok o Instagram y te montamos el viaje completo
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>📍 Tu ubicación: Madrid (MAD)</Text>
          </View>

          <TextInput
            style={styles.input}
            value={videoUrl}
            onChangeText={setVideoUrl}
            placeholder="https://www.tiktok.com/@usuario/video/..."
            placeholderTextColor="#9CA3AF"
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAnalyze}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#9CA3AF', '#9CA3AF'] : ['#6366F1', '#8B5CF6']}
              style={styles.buttonGradient}
              start={[0, 0]}
              end={[1, 0]}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>✨ Analizar Video</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>Plataformas Soportadas</Text>
          <View style={styles.platforms}>
            <View style={styles.platform}>
              <Text style={styles.platformText}>🎵 TikTok</Text>
            </View>
            <View style={styles.platform}>
              <Text style={styles.platformText}>📸 Instagram</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  logo: { fontSize: 24, fontWeight: 700, color: '#7C3AED' },
  welcome: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  logout: { fontSize: 14, color: '#EF4444', fontWeight: 600 },
  content: { flex: 1 },
  card: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeText: { fontSize: 12, color: '#7C3AED', fontWeight: 600 },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  button: { width: '100%' },
  buttonDisabled: { opacity: 0.6 },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 600,
  },
  info: { padding: 20 },
  infoTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 12,
  },
  platforms: {
    flexDirection: 'row',
    gap: 12,
  },
  platform: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  platformText: { fontSize: 14, fontWeight: 600 },
});
