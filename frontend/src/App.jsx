import React, { useState } from 'react';
import { Plane, Loader2, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';

export default function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState('');

  const analyzeVideo = async () => {
    if (!videoUrl.trim()) {
      setError('Por favor, pega un link de TikTok o Instagram');
      return;
    }

    setLoading(true);
    setError('');
    setItinerary(null);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_url: videoUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al analizar el video');
      }

      setItinerary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Plane className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">InstaTrip</h1>
              <p className="text-sm text-gray-600">Convierte videos de viajes en itinerarios reales</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Viste un video de viaje que te encantó?
          </h2>
          <p className="text-gray-600 mb-6">
            Pega el link del video de TikTok o Instagram y te montamos el viaje completo
          </p>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@usuario/video/..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={analyzeVideo}
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Plane className="w-5 h-5" />
                  Crear Viaje
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="mt-4 text-sm text-gray-500">
            <p className="font-semibold mb-2">✨ Plataformas soportadas:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>TikTok (videos públicos)</li>
              <li>Instagram Reels (videos públicos)</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        {itinerary && (
          <div className="space-y-6 animate-fadeIn">
            {/* Destination Overview */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {itinerary.destination}
                  </h2>
                  <p className="text-gray-600">{itinerary.description}</p>
                </div>
                <MapPin className="w-8 h-8 text-indigo-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Duración</p>
                    <p className="font-semibold text-gray-900">{itinerary.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Presupuesto estimado</p>
                    <p className="font-semibold text-gray-900">{itinerary.budget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Mejor época</p>
                    <p className="font-semibold text-gray-900">{itinerary.best_time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Itinerary */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Itinerario Día a Día
              </h3>
              <div className="space-y-6">
                {itinerary.days.map((day, index) => (
                  <div key={index} className="border-l-4 border-indigo-600 pl-6 pb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">{day.title}</h4>
                    </div>
                    <div className="space-y-3">
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-gray-400 mt-1" />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{activity.time}</p>
                              <p className="text-gray-700 mt-1">{activity.activity}</p>
                              {activity.location && (
                                <p className="text-sm text-indigo-600 mt-1">
                                  📍 {activity.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Places to Visit */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Lugares Destacados del Video
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itinerary.places.map((place, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-600 transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-2">{place.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{place.description}</p>
                    <p className="text-xs text-indigo-600">💡 {place.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors">
                Guardar Itinerario
              </button>
              <button className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold transition-colors">
                Compartir
              </button>
              <button 
                onClick={() => {
                  setItinerary(null);
                  setVideoUrl('');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Analizar Otro Video
              </button>
            </div>
          </div>
        )}

        {/* How it works */}
        {!itinerary && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              ¿Cómo funciona?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Pega el Link</h4>
                <p className="text-gray-600 text-sm">
                  Copia el enlace de cualquier video de viaje que te inspire
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">2. IA Analiza</h4>
                <p className="text-gray-600 text-sm">
                  Nuestra IA identifica lugares, actividades y crea tu itinerario
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✈️</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">3. ¡A Viajar!</h4>
                <p className="text-gray-600 text-sm">
                  Recibe tu plan completo listo para reservar y disfrutar
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16 py-8 border-t">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>InstaTrip - MVP © 2025</p>
          <p className="mt-2">Convierte la inspiración en aventura</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
