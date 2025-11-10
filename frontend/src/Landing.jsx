import React, { useState } from 'react';
import { Plane, Sparkles, Zap, Heart, Video, MapPin, ArrowRight } from 'lucide-react';

export default function Landing({ onLogin }) {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora, simplemente loguear al usuario
    onLogin({ email, name: name || email.split('@')[0] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="InstaTrip" className="w-10 h-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              InstaTrip
            </span>
          </div>
          <button
            onClick={() => setShowAuth(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Iniciar Sesión
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>De viral a real en segundos</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Viste un video.
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Vive el viaje.
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Convierte cualquier video de viaje de TikTok o Instagram en un itinerario completo con vuelos, hoteles y actividades.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => {
                    setShowAuth(true);
                    setIsLogin(false);
                  }}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  Empezar Gratis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold text-lg hover:shadow-lg transition-all border-2 border-gray-200">
                  Ver Demo
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 justify-center lg:justify-start">
                <div>
                  <div className="text-3xl font-bold text-gray-900">10k+</div>
                  <div className="text-sm text-gray-600">Viajes creados</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600">Valoración</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Destinos</div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 shadow-2xl">
                {/* Mockup visual */}
                <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <Video className="w-8 h-8 text-purple-500" />
                    <div className="flex-1">
                      <div className="h-3 bg-purple-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-purple-100 rounded w-1/2"></div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <div className="h-3 bg-blue-200 rounded w-1/3"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-blue-100 rounded"></div>
                      <div className="h-2 bg-blue-100 rounded w-4/5"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Plane className="w-6 h-6 text-green-500 mb-2" />
                      <div className="h-2 bg-green-200 rounded mb-1"></div>
                      <div className="h-2 bg-green-100 rounded w-2/3"></div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <Heart className="w-6 h-6 text-yellow-500 mb-2" />
                      <div className="h-2 bg-yellow-200 rounded mb-1"></div>
                      <div className="h-2 bg-yellow-100 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-300 to-pink-300 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona la magia?
            </h2>
            <p className="text-xl text-gray-600">
              Tres pasos para convertir inspiración en aventura
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">1. Pega el link</h3>
                <p className="text-gray-600">
                  Copia cualquier video de TikTok o Instagram que te inspire. ¿Viste un reel de Bali? ¿Un tour por París? Pégalo aquí.
                </p>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-purple-300 to-transparent hidden md:block"></div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">2. IA hace su magia</h3>
                <p className="text-gray-600">
                  Nuestra IA analiza el video, identifica lugares, busca precios reales de vuelos y hoteles, y crea tu itinerario perfecto.
                </p>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-blue-300 to-transparent hidden md:block"></div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="p-8 bg-gradient-to-br from-pink-50 to-yellow-50 rounded-2xl border-2 border-pink-100 hover:border-pink-300 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Plane className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">3. ¡Reserva y viaja!</h3>
                <p className="text-gray-600">
                  Recibe vuelos, hoteles y actividades con precios reales. Un click y estás reservando el viaje de tus sueños.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Únete a miles de viajeros que ya están convirtiendo videos en experiencias reales.
          </p>
          <button
            onClick={() => {
              setShowAuth(true);
              setIsLogin(false);
            }}
            className="px-10 py-5 bg-white text-purple-600 rounded-full font-bold text-lg hover:shadow-2xl transition-all inline-flex items-center gap-2"
          >
            Crear cuenta gratis
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <img src="/logo.svg" alt="InstaTrip" className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? '¡Bienvenido de nuevo!' : '¡Empieza tu aventura!'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Inicia sesión para continuar' : 'Crea tu cuenta en segundos'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Tu nombre"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>

            {!isLogin && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Al crear una cuenta, aceptas nuestros Términos y Condiciones
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
