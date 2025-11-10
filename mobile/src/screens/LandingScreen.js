import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function LandingScreen({ navigation }) {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    const user = { email, name: name || email.split('@')[0] };
    navigation.navigate('Home', { user });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={['#F3E8FF', '#FCE7F3', '#DBEAFE']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.logoText}>InstaTrip</Text>
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => setShowAuth(true)}
            >
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Section */}
          <View style={styles.hero}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✨ De viral a real en segundos</Text>
            </View>

            <Text style={styles.heroTitle}>
              Viste un video.{'\n'}
              <Text style={styles.heroTitleGradient}>Vive el viaje.</Text>
            </Text>

            <Text style={styles.heroSubtitle}>
              Convierte cualquier video de viaje de TikTok o Instagram en un
              itinerario completo con vuelos, hoteles y actividades.
            </Text>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => {
                setShowAuth(true);
                setIsLogin(false);
              }}
            >
              <LinearGradient
                colors={['#A855F7', '#EC4899']}
                style={styles.ctaGradient}
                start={[0, 0]}
                end={[1, 0]}
              >
                <Text style={styles.ctaText}>Empezar Gratis →</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Stats */}
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>10k+</Text>
                <Text style={styles.statLabel}>Viajes creados</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>4.9★</Text>
                <Text style={styles.statLabel}>Valoración</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>50+</Text>
                <Text style={styles.statLabel}>Destinos</Text>
              </View>
            </View>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <Text style={styles.featuresTitle}>¿Cómo funciona la magia?</Text>

            <View style={styles.featuresList}>
              {/* Feature 1 */}
              <View style={styles.feature}>
                <View style={[styles.featureIcon, { backgroundColor: '#F3E8FF' }]}>
                  <Text style={styles.featureEmoji}>📱</Text>
                </View>
                <Text style={styles.featureTitle}>1. Pega el link</Text>
                <Text style={styles.featureText}>
                  Copia cualquier video de TikTok o Instagram que te inspire
                </Text>
              </View>

              {/* Feature 2 */}
              <View style={styles.feature}>
                <View style={[styles.featureIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={styles.featureEmoji}>🤖</Text>
                </View>
                <Text style={styles.featureTitle}>2. IA hace su magia</Text>
                <Text style={styles.featureText}>
                  Nuestra IA identifica lugares y busca precios reales
                </Text>
              </View>

              {/* Feature 3 */}
              <View style={styles.feature}>
                <View style={[styles.featureIcon, { backgroundColor: '#FCE7F3' }]}>
                  <Text style={styles.featureEmoji}>✈️</Text>
                </View>
                <Text style={styles.featureTitle}>3. ¡Reserva y viaja!</Text>
                <Text style={styles.featureText}>
                  Recibe vuelos, hoteles y actividades listo para reservar
                </Text>
              </View>
            </View>
          </View>

          {/* Final CTA */}
          <View style={styles.finalCTA}>
            <LinearGradient
              colors={['#9333EA', '#DB2777', '#2563EB']}
              style={styles.finalCTAGradient}
              start={[0, 0]}
              end={[1, 0]}
            >
              <Text style={styles.finalCTATitle}>
                ¿Listo para tu próxima aventura?
              </Text>
              <Text style={styles.finalCTAText}>
                Únete a miles de viajeros que ya están convirtiendo videos en
                experiencias reales.
              </Text>
              <TouchableOpacity
                style={styles.finalCTAButton}
                onPress={() => {
                  setShowAuth(true);
                  setIsLogin(false);
                }}
              >
                <Text style={styles.finalCTAButtonText}>
                  Crear cuenta gratis →
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>

        {/* Auth Modal */}
        <Modal
          visible={showAuth}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAuth(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowAuth(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>
                {isLogin ? '¡Bienvenido de nuevo!' : '¡Empieza tu aventura!'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {isLogin ? 'Inicia sesión para continuar' : 'Crea tu cuenta en segundos'}
              </Text>

              <View style={styles.form}>
                {!isLogin && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nombre</Text>
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder="Tu nombre"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="tu@email.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Contraseña</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={true}
                  />
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <LinearGradient
                    colors={['#A855F7', '#EC4899']}
                    style={styles.submitGradient}
                    start={[0, 0]}
                    end={[1, 0]}
                  >
                    <Text style={styles.submitText}>
                      {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.toggleText}>
                  {isLogin
                    ? '¿No tienes cuenta? Regístrate'
                    : '¿Ya tienes cuenta? Inicia sesión'}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  loginButton: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  badge: {
    backgroundColor: '#F3E8FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  badgeText: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '500',
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 48,
  },
  heroTitleGradient: {
    color: '#A855F7',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 26,
  },
  ctaButton: {
    marginBottom: 40,
  },
  ctaGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  ctaText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  features: {
    backgroundColor: 'white',
    paddingVertical: 60,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  featuresTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 40,
  },
  featuresList: {
    
  },
  feature: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureEmoji: {
    fontSize: 32,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  finalCTA: {
    marginHorizontal: 20,
    marginTop: 40,
    borderRadius: 24,
    overflow: 'hidden',
  },
  finalCTAGradient: {
    padding: 40,
  },
  finalCTATitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  finalCTAText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  finalCTAButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  finalCTAButtonText: {
    color: '#7C3AED',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    width: '90%',
    maxWidth: 400,
  },
  modalClose: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  modalCloseText: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    
  },
  inputGroup: {
    
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  submitButton: {
    marginTop: 8,
  },
  submitGradient: {
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  toggleText: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
  },
});
