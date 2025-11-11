import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SimpleLanding({ onLogin }) {
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    setShowAuth(false);
    onLogin({ name: email.split('@')[0], email });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F3E8FF', '#FCE7F3', '#DBEAFE']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>InstaTrip</Text>
          </View>

          <View style={styles.hero}>
            <Text style={styles.badge}>✨ De viral a real en segundos</Text>
            <Text style={styles.title}>
              Viste un video.{'\n'}
              <Text style={styles.titleAccent}>Vive el viaje.</Text>
            </Text>
            <Text style={styles.subtitle}>
              Convierte cualquier video de viaje de TikTok o Instagram en un
              itinerario completo con vuelos, hoteles y actividades.
            </Text>

            <TouchableOpacity style={styles.button} onPress={() => setShowAuth(true)}>
              <LinearGradient
                colors={['#A855F7', '#EC4899']}
                style={styles.buttonGradient}
                start={[0, 0]}
                end={[1, 0]}
              >
                <Text style={styles.buttonText}>Empezar Gratis →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal visible={showAuth} onRequestClose={() => setShowAuth(false)}>
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAuth(false)}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>¡Bienvenido!</Text>

              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@email.com"
                  placeholderTextColor="#9CA3AF"
                />

                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Contraseña"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={true}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <LinearGradient
                    colors={['#A855F7', '#EC4899']}
                    style={styles.buttonGradient}
                    start={[0, 0]}
                    end={[1, 0]}
                  >
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: { padding: 20, paddingTop: 60 },
  header: { marginBottom: 40 },
  logo: { fontSize: 28, fontWeight: 700, color: '#7C3AED' },
  hero: { alignItems: 'center' },
  badge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  titleAccent: { color: '#A855F7' },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  button: { width: '100%', marginBottom: 16 },
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
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeText: {
    fontSize: 24,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: { width: '100%' },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
