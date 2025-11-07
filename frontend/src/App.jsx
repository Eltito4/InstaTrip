import React, { useState, useEffect } from 'react';
import { Plane, Loader2, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';

export default function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState({ city: 'Madrid', iata_code: 'MAD', detected: false });

  // Detectar ubicación del usuario al cargar
  useEffect(() => {
    fetch('http://localhost:5000/api/detect-location')
      .then(res => res.json())
      .then(data => {
        setUserLocation(data);
        console.log('📍 Ubicación detectada:', data);
      })
      .catch(err => {
        console.log('⚠️  No se pudo detectar ubicación, usando Madrid por defecto');
      });
  }, []);

  // Detectar si la app se abrió desde Web Share Target (PWA)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url') || params.get('text');

    if (sharedUrl) {
      // Limpiar la URL de parámetros extras que puedan venir
      let cleanUrl = sharedUrl;

      // Extraer URL de Instagram/TikTok si viene en texto
      if (sharedUrl.includes('tiktok.com')) {
        const match = sharedUrl.match(/(https?:\/\/[^\s]*tiktok\.com[^\s]*)/);
        if (match) cleanUrl = match[1];
      } else if (sharedUrl.includes('instagram.com')) {
        const match = sharedUrl.match(/(https?:\/\/[^\s]*instagram\.com[^\s]*)/);
        if (match) cleanUrl = match[1];
      }

      // Solo prellenar el campo, usuario debe hacer clic en el botón
      setVideoUrl(cleanUrl);

      // Limpiar parámetros de la URL del navegador
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const analyzeVideo = async (urlToAnalyze = null) => {
    const targetUrl = urlToAnalyze || videoUrl;

    if (!targetUrl || !targetUrl.trim()) {
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
        body: JSON.stringify({
          video_url: targetUrl,
          origin_iata: userLocation.iata_code
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al analizar el video');
      }

      setItinerary(data);
      console.log('📦 ITINERARIO COMPLETO:', data);
      console.log('🔗 BOOKING LINKS RECIBIDOS:', data.booking_links);
      console.log('✈️ Flights:', data.booking_links?.flights);
      console.log('🏨 Hotels:', data.booking_links?.hotels);
      console.log('🎫 Activities:', data.booking_links?.activities);

      // Debug: contar cuántos de cada tipo
      if (data.booking_links?.flights) {
        const searchMain = data.booking_links.flights.filter(f => f.type === 'search_main');
        console.log(`🔍 Buscadores de vuelos (search_main): ${searchMain.length}`, searchMain);
      }
      if (data.booking_links?.hotels) {
        const searchMain = data.booking_links.hotels.filter(h => h.type === 'search_main');
        console.log(`🔍 Buscadores de hoteles (search_main): ${searchMain.length}`, searchMain);
      }
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
          <p className="text-gray-600 mb-4">
            Pega el link del video de TikTok o Instagram y te montamos el viaje completo
          </p>

          {/* Ubicación detectada */}
          <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span className="text-gray-700">
                Tu ubicación: <strong>{userLocation.city}</strong> ({userLocation.iata_code})
              </span>
              {userLocation.detected && <span className="text-green-600 text-xs">✓ Detectado</span>}
            </div>
          </div>

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
              onClick={() => analyzeVideo()}
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Itinerario Día a Día
              </h3>
              {itinerary.note && (
                <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-sm text-blue-800">{itinerary.note}</p>
                </div>
              )}
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

            {/* Booking Links */}
            {itinerary.booking_links && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  ✈️ Reserva tu Viaje
                </h3>
                <p className="text-gray-600 mb-6">
                  Haz clic en los enlaces para comparar precios y reservar
                </p>

                {/* Suggested Dates & Explanation */}
                {itinerary.booking_links.suggested_dates && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-6 h-6 text-indigo-600" />
                      <h4 className="text-lg font-bold text-gray-900">Fechas Recomendadas</h4>
                    </div>
                    <p className="text-2xl text-indigo-600 font-bold mb-3">
                      {new Date(itinerary.booking_links.suggested_dates.departure).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} - {new Date(itinerary.booking_links.suggested_dates.return).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-700 bg-white/70 p-3 rounded">
                      {itinerary.booking_links.suggested_dates.explanation || `Viaje de ${itinerary.booking_links.suggested_dates.duration_days} días`}
                    </p>
                  </div>
                )}

                {/* Vuelos */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span>✈️</span> Vuelos Disponibles
                  </h4>

                  {/* Ofertas Reales */}
                  {itinerary.booking_links.flights.filter(f => f.type === 'offer').length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-3">💰 Mejores precios para estas fechas:</p>
                      <div className="space-y-3">
                        {itinerary.booking_links.flights.filter(f => f.type === 'offer').map((flight, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-5 bg-white rounded-xl border-2 border-green-200 hover:border-green-400 transition-all shadow-sm"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                <span className="text-3xl">✈️</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-lg font-bold text-gray-900">{flight.airline}</p>
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                    {flight.date_option || `OPCIÓN ${index + 1}`}
                                  </span>
                                </div>
                                {flight.date_range && (
                                  <p className="text-xs text-indigo-600 mb-1 font-medium">
                                    📅 {flight.date_range} • {flight.date_reason}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600 mb-1">
                                  {flight.duration} • {flight.stops === 0 ? 'Vuelo directo' : `${flight.stops} escala${flight.stops > 1 ? 's' : ''}`}
                                </p>
                                <div className="flex gap-2 text-xs text-gray-500">
                                  <span>✓ {flight.trip_type || 'Ida y vuelta'}</span>
                                  <span>•</span>
                                  <span>🎒 {flight.baggage || '1 equipaje de mano'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-3xl font-bold text-green-600">€{Math.round(flight.price)}</p>
                                <p className="text-xs text-gray-500">por persona</p>
                              </div>
                              <a
                                href={flight.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                              >
                                ¡Comprar!
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buscadores Alternativos */}
                  {itinerary.booking_links.flights.filter(f => f.type === 'search_alternative').length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        🔍 ¿Quieres ver más opciones?
                      </p>
                      <p className="text-xs text-gray-600 mb-3">Explora otros buscadores para comparar</p>
                      <div className="grid grid-cols-2 gap-2">
                        {itinerary.booking_links.flights.filter(f => f.type === 'search_alternative').map((flight, index) => (
                          <a
                            key={index}
                            href={flight.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-300 hover:border-indigo-400"
                          >
                            <span className="text-lg">{flight.icon}</span>
                            <span className="text-sm font-medium text-gray-900">{flight.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hoteles */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span>🏨</span> Hoteles Recomendados
                  </h4>

                  {/* Ofertas Reales */}
                  {itinerary.booking_links.hotels.filter(h => h.type === 'offer').length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-3">💰 Mejores opciones para estas fechas:</p>
                      <div className="space-y-4">
                        {itinerary.booking_links.hotels.filter(h => h.type === 'offer').map((hotel, index) => (
                          <div
                            key={index}
                            className="p-5 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all shadow-sm"
                          >
                            <div className="flex items-start gap-4 mb-4">
                              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-4xl">🏨</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-lg font-bold text-gray-900">{hotel.name}</p>
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                    OPCIÓN {index + 1}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                  {hotel.rating && hotel.rating > 0 && (
                                    <span className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                                      <span className="text-yellow-600 font-bold">{hotel.rating}/5</span>
                                      <span>{' ⭐'.repeat(Math.round(hotel.rating))}</span>
                                    </span>
                                  )}
                                  {(hotel.location || hotel.city) && (
                                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                      <span>📍</span>
                                      <span className="font-medium">{hotel.location || hotel.city}</span>
                                    </span>
                                  )}
                                </div>
                                {hotel.room_description && (
                                  <p className="text-sm text-gray-500 italic mb-2">
                                    {hotel.room_description}
                                  </p>
                                )}
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xl font-bold text-blue-600">€{Math.round(hotel.price_per_night)}</span>
                                  <span className="text-sm text-gray-600">/noche • {hotel.nights} noches</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              <div>
                                <p className="text-xs text-gray-500">Precio total</p>
                                <p className="text-2xl font-bold text-blue-600">€{Math.round(hotel.price_total)}</p>
                              </div>
                              <a
                                href={hotel.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                              >
                                ¡Reservar!
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buscadores Alternativos */}
                  {itinerary.booking_links.hotels.filter(h => h.type === 'search_alternative').length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        🔍 ¿Prefieres explorar más opciones?
                      </p>
                      <p className="text-xs text-gray-600 mb-3">Busca en otras plataformas con fotos e imágenes</p>
                      <div className="grid grid-cols-2 gap-2">
                        {itinerary.booking_links.hotels.filter(h => h.type === 'search_alternative').map((hotel, index) => (
                          <a
                            key={index}
                            href={hotel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-300 hover:border-blue-400"
                          >
                            <span className="text-lg">{hotel.icon}</span>
                            <span className="text-sm font-medium text-gray-900">{hotel.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actividades y Entradas */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>🎫</span> Actividades y Entradas
                  </h4>
                  <div className="space-y-3">
                    {itinerary.booking_links.activities.map((activity, index) => (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">{activity.type === 'specific' ? '🏛️' : '🎯'}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{activity.name}</p>
                            <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
                            <div className="flex gap-2">
                              <a
                                href={activity.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium hover:bg-purple-200 transition-colors"
                              >
                                <span>Tours</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                              {activity.url_official && (
                                <a
                                  href={activity.url_official}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                                >
                                  <span>Web oficial</span>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Te recomendamos comparar precios en varios buscadores antes de reservar. Los links se abren en pestañas nuevas.
                  </p>
                </div>
              </div>
            )}

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

      <style>{`
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
