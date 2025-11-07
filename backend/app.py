from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic
import os
import re
import tempfile
import yt_dlp
from openai import OpenAI
import json
from pathlib import Path
from dotenv import load_dotenv
from urllib.parse import quote
from datetime import datetime, timedelta
import requests

# Cargar variables de entorno desde .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Inicializar clientes de IA
anthropic_client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Configuración de Amadeus
AMADEUS_API_KEY = os.environ.get("AMADEUS_API_KEY")
AMADEUS_API_SECRET = os.environ.get("AMADEUS_API_SECRET")
amadeus_token = None
amadeus_token_expires = None

def get_amadeus_token():
    """Obtiene el token de autenticación de Amadeus (OAuth)"""
    global amadeus_token, amadeus_token_expires

    # Si tenemos un token válido, reutilizarlo
    if amadeus_token and amadeus_token_expires and datetime.now() < amadeus_token_expires:
        return amadeus_token

    try:
        url = "https://test.api.amadeus.com/v1/security/oauth2/token"
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = {
            "grant_type": "client_credentials",
            "client_id": AMADEUS_API_KEY,
            "client_secret": AMADEUS_API_SECRET
        }

        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()

        token_data = response.json()
        amadeus_token = token_data['access_token']
        # El token expira en ~30 minutos, guardamos el tiempo
        amadeus_token_expires = datetime.now() + timedelta(seconds=token_data.get('expires_in', 1800) - 60)

        return amadeus_token

    except Exception as e:
        print(f"Error obteniendo token de Amadeus: {str(e)}")
        return None

def search_flights_amadeus(origin, destination, departure_date, return_date, adults=1):
    """Busca vuelos con Amadeus API y devuelve las 2 opciones más baratas"""
    try:
        token = get_amadeus_token()
        if not token:
            return []

        url = "https://test.api.amadeus.com/v2/shopping/flight-offers"
        headers = {"Authorization": f"Bearer {token}"}
        params = {
            "originLocationCode": origin,
            "destinationLocationCode": destination,
            "departureDate": departure_date,
            "returnDate": return_date,
            "adults": adults,
            "max": 5  # Traer 5 para elegir los 2 mejores
        }

        print(f"🔍 Buscando vuelos {origin} → {destination} ({departure_date} - {return_date})...")
        response = requests.get(url, headers=headers, params=params, timeout=10)

        if response.status_code != 200:
            print(f"⚠️  Error API Amadeus vuelos: {response.status_code}")
            return []

        data = response.json()
        offers = data.get('data', [])

        if not offers:
            print("⚠️  No se encontraron vuelos")
            return []

        # Procesar y ordenar por precio
        flight_options = []
        for offer in offers[:2]:  # Solo los 2 primeros (ya vienen ordenados por precio)
            price = float(offer['price']['total'])
            currency = offer['price']['currency']

            # Obtener información del vuelo
            itineraries = offer.get('itineraries', [])
            if itineraries:
                first_segment = itineraries[0]['segments'][0]
                airline_code = first_segment['carrierCode']
                duration = itineraries[0].get('duration', 'N/A')
                stops = len(itineraries[0]['segments']) - 1

                # Formatear duración (viene como PT2H30M)
                duration_formatted = duration.replace('PT', '').replace('H', 'h ').replace('M', 'min')

                flight_options.append({
                    'airline': airline_code,
                    'price': price,
                    'currency': currency,
                    'duration': duration_formatted,
                    'stops': stops,
                    'direct': stops == 0
                })

        print(f"✅ Encontrados {len(flight_options)} vuelos")
        return flight_options

    except Exception as e:
        print(f"Error buscando vuelos: {str(e)}")
        return []

def search_hotels_amadeus(city_code, checkin, checkout):
    """Busca hoteles con Amadeus API y devuelve las 2 opciones más baratas"""
    try:
        token = get_amadeus_token()
        if not token:
            return []

        # Primero buscar hoteles en la ciudad
        url_search = "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city"
        headers = {"Authorization": f"Bearer {token}"}
        params_search = {"cityCode": city_code}

        print(f"🔍 Buscando hoteles en {city_code} ({checkin} - {checkout})...")
        response_search = requests.get(url_search, headers=headers, params=params_search, timeout=10)

        if response_search.status_code != 200:
            print(f"⚠️  Error API Amadeus hoteles search: {response_search.status_code}")
            return []

        hotels_data = response_search.json().get('data', [])
        if not hotels_data:
            print("⚠️  No se encontraron hoteles")
            return []

        # Obtener IDs de los primeros 10 hoteles
        hotel_ids = [h['hotelId'] for h in hotels_data[:10]]

        # Buscar ofertas para esos hoteles
        url_offers = "https://test.api.amadeus.com/v3/shopping/hotel-offers"
        params_offers = {
            "hotelIds": ','.join(hotel_ids),
            "checkInDate": checkin,
            "checkOutDate": checkout,
            "adults": 2,
            "roomQuantity": 1
        }

        response_offers = requests.get(url_offers, headers=headers, params=params_offers, timeout=10)

        if response_offers.status_code != 200:
            print(f"⚠️  Error API Amadeus hotel offers: {response_offers.status_code}")
            return []

        offers_data = response_offers.json().get('data', [])
        print(f"📊 Total ofertas de hoteles recibidas: {len(offers_data)}")

        # Procesar y ordenar por precio
        hotel_options = []
        for hotel in offers_data:
            if not hotel.get('offers'):
                continue

            hotel_info = hotel.get('hotel', {})
            hotel_name = hotel_info.get('name', 'Hotel')
            rating = hotel_info.get('rating', 0)

            # FILTRAR: Solo hoteles con rating >= 4 estrellas (equivalente a 8/10)
            # Si no hay suficientes con rating alto, relajar el filtro
            if rating and int(rating) < 4:
                continue

            # Obtener la oferta más barata
            offer = sorted(hotel['offers'], key=lambda x: float(x['price']['total']))[0]
            price_total = float(offer['price']['total'])
            currency = offer['price']['currency']

            # Información adicional del hotel
            address = hotel_info.get('address', {})
            city_name = address.get('cityName', '')

            # Calcular precio por noche
            checkin_date = datetime.strptime(checkin, '%Y-%m-%d')
            checkout_date = datetime.strptime(checkout, '%Y-%m-%d')
            nights = (checkout_date - checkin_date).days
            price_per_night = price_total / nights if nights > 0 else price_total

            hotel_options.append({
                'name': hotel_name,
                'price_per_night': round(price_per_night, 2),
                'price_total': round(price_total, 2),
                'currency': currency,
                'rating': int(rating) if rating else 0,
                'nights': nights,
                'city': city_name,
                'description': offer.get('room', {}).get('description', {}).get('text', 'Habitación estándar')
            })

        # Ordenar por precio y tomar los 3 más baratos
        hotel_options.sort(key=lambda x: x['price_per_night'])
        result = hotel_options[:3]

        print(f"✅ Encontrados {len(result)} hoteles después del filtrado (rating >= 4)")
        for idx, h in enumerate(result, 1):
            print(f"   {idx}. {h['name']} - {h['currency']}{h['price_per_night']}/noche ({h['rating']} estrellas)")
        return result

    except Exception as e:
        print(f"Error buscando hoteles: {str(e)}")
        return []

def get_city_from_iata(iata_code):
    """Convierte código IATA a nombre de ciudad"""
    iata_to_city = {
        'MAD': 'Madrid',
        'BCN': 'Barcelona',
        'VLC': 'Valencia',
        'SVQ': 'Sevilla',
        'AGP': 'Málaga',
        'BIO': 'Bilbao',
        'ALC': 'Alicante',
        'PMI': 'Palma de Mallorca',
    }
    return iata_to_city.get(iata_code, 'Madrid')

def generate_booking_links(itinerary, origin_iata='MAD'):
    """Genera links automáticos a buscadores Y busca ofertas reales con Amadeus"""

    destination = itinerary.get('destination', '')
    city = itinerary.get('city', destination)
    airport_code = itinerary.get('airport_code', '').upper()
    city_code = itinerary.get('city_code', airport_code).upper()  # Para hoteles

    # Si no hay ciudad, usar el destino
    if not city:
        city = destination

    duration_str = itinerary.get('duration', '5 días')
    duration_days = int(re.search(r'\d+', duration_str).group()) if re.search(r'\d+', duration_str) else 5

    # Generar 2 opciones de fechas DIFERENTES
    date_options = []

    # Opción 1: Dentro de 2 meses
    start_date_1 = datetime.now() + timedelta(days=60)
    end_date_1 = start_date_1 + timedelta(days=duration_days)
    date_options.append({
        'departure': start_date_1.strftime('%Y-%m-%d'),
        'return': end_date_1.strftime('%Y-%m-%d'),
        'duration_days': duration_days,
        'label': 'Opción 1',
        'reason': 'Precios más económicos (60 días anticipación)'
    })

    # Opción 2: Dentro de 2.5 meses
    start_date_2 = datetime.now() + timedelta(days=75)
    end_date_2 = start_date_2 + timedelta(days=duration_days)
    date_options.append({
        'departure': start_date_2.strftime('%Y-%m-%d'),
        'return': end_date_2.strftime('%Y-%m-%d'),
        'duration_days': duration_days,
        'label': 'Opción 2',
        'reason': 'Mayor flexibilidad (75 días anticipación)'
    })

    links = {
        'flights': [],
        'hotels': [],
        'activities': [],
        'origin': {
            'iata_code': origin_iata,
            'city': get_city_from_iata(origin_iata)
        },
        'date_options': date_options
    }

    # === OBTENER OFERTAS REALES DE VUELOS PARA CADA OPCIÓN DE FECHA ===
    if airport_code and AMADEUS_API_KEY:
        for date_option in date_options:
            print(f"💰 Buscando vuelos para {date_option['label']} ({date_option['departure']} - {date_option['return']})...")
            flight_offers = search_flights_amadeus(origin_iata, airport_code, date_option['departure'], date_option['return'])

            if flight_offers:
                # Tomar solo la mejor oferta para esta fecha
                best_flight = flight_offers[0]

                # URL para reservar
                booking_url = f"https://www.google.com/travel/flights?hl=es&gl=ES&q=flights+from+{origin_iata}+to+{airport_code}+on+{date_option['departure']}+return+{date_option['return']}"

                links['flights'].append({
                    'type': 'offer',  # Oferta real con precio
                    'date_option': date_option['label'],
                    'date_range': f"{date_option['departure']} - {date_option['return']}",
                    'date_reason': date_option['reason'],
                    'airline': best_flight['airline'],
                    'price': best_flight['price'],
                    'currency': best_flight['currency'],
                    'duration': best_flight['duration'],
                    'direct': best_flight['direct'],
                    'stops': best_flight['stops'],
                    'trip_type': 'Ida y vuelta',
                    'baggage': '1 equipaje de mano incluido',
                    'url': booking_url,
                    'name': f"{best_flight['airline']} - €{best_flight['price']:.0f}",
                    'description': f"{best_flight['duration']}, {'Directo' if best_flight['direct'] else f'{best_flight['stops']} escala(s)'}"
                })
                print(f"   ✈️  {date_option['label']}: {best_flight['airline']} - €{best_flight['price']:.0f} ({best_flight['duration']})")

    # === BUSCADORES ALTERNATIVOS DE VUELOS ===
    destination_clean = destination.replace(',', '').strip()

    # Google Flights
    google_flights = f"https://www.google.com/travel/flights?hl=es&gl=ES&q=flights+from+{origin_iata}+to+{airport_code if airport_code else quote(destination_clean)}"
    links['flights'].append({
        'type': 'search_alternative',
        'name': 'Google Flights',
        'url': google_flights,
        'description': 'Compara todas las aerolíneas',
        'icon': '✈️'
    })

    # Skyscanner
    if airport_code:
        skyscanner = f"https://www.skyscanner.es/transport/flights/{origin_iata.lower()}/{airport_code.lower()}/"
    else:
        skyscanner = f"https://www.skyscanner.es/transport/flights/{origin_iata.lower()}/{quote(destination_clean)}/"

    links['flights'].append({
        'type': 'search_alternative',
        'name': 'Skyscanner',
        'url': skyscanner,
        'description': 'Encuentra más ofertas',
        'icon': '🔍'
    })

    # === OBTENER OFERTAS REALES DE HOTELES ===
    # Usar la primera opción de fecha
    first_date = date_options[0]
    if city_code and AMADEUS_API_KEY:
        print(f"💰 Buscando ofertas reales de hoteles en {city_code}...")
        hotel_offers = search_hotels_amadeus(city_code, first_date['departure'], first_date['return'])

        if hotel_offers:
            for idx, hotel in enumerate(hotel_offers[:3], 1):  # Máximo 3 ofertas
                stars = '⭐' * hotel['rating'] if hotel['rating'] > 0 else ''

                # URL para reservar (Booking.com con ciudad y fechas)
                city_for_booking = city.replace(',', '').strip()
                booking_url = f"https://www.booking.com/searchresults.html?ss={quote(city_for_booking)}&checkin={first_date['departure']}&checkout={first_date['return']}&group_adults=2&no_rooms=1"

                links['hotels'].append({
                    'type': 'offer',  # Oferta real con precio
                    'rank': idx,
                    'name': hotel['name'],
                    'price_per_night': hotel['price_per_night'],
                    'price_total': hotel['price_total'],
                    'currency': hotel['currency'],
                    'rating': hotel['rating'],
                    'nights': hotel['nights'],
                    'city': hotel.get('city', city),
                    'location': hotel.get('city', city),
                    'room_description': hotel.get('description', 'Habitación estándar'),
                    'url': booking_url,
                    'description': f"€{hotel['price_per_night']:.0f}/noche ({hotel['nights']} noches) {stars}"
                })
                print(f"   🏨 Opción {idx}: {hotel['name']} - €{hotel['price_per_night']:.0f}/noche ({hotel['rating']} estrellas)")
        else:
            print(f"   ⚠️  No se encontraron hoteles con Amadeus. Se mostrarán buscadores.")

    # === BUSCADORES ALTERNATIVOS DE HOTELES ===
    city_clean = city.replace(',', '').strip()

    # Booking.com
    booking = f"https://www.booking.com/searchresults.html?ss={quote(city_clean)}&checkin={first_date['departure']}&checkout={first_date['return']}&group_adults=2&no_rooms=1&group_children=0"
    links['hotels'].append({
        'type': 'search_alternative',
        'name': 'Booking.com',
        'url': booking,
        'description': 'Miles de hoteles con fotos y opiniones',
        'icon': '🏨'
    })

    # Airbnb
    airbnb = f"https://www.airbnb.es/s/{quote(city_clean)}/homes?checkin={first_date['departure']}&checkout={first_date['return']}&adults=2"
    links['hotels'].append({
        'type': 'search_alternative',
        'name': 'Airbnb',
        'url': airbnb,
        'description': 'Apartamentos y experiencias únicas',
        'icon': '🏠'
    })

    # === ACTIVIDADES Y ENTRADAS ===

    # GetYourGuide para el destino general
    getyourguide = f"https://www.getyourguide.es/s/?q={quote(destination_clean)}"
    links['activities'].append({
        'name': f'Tours en {destination}',
        'url': getyourguide,
        'provider': 'GetYourGuide',
        'type': 'general',
        'description': 'Tours, entradas y experiencias'
    })

    # Civitatis
    civitatis_city = city_clean.lower().replace(' ', '-').replace('á','a').replace('é','e').replace('í','i').replace('ó','o').replace('ú','u')
    civitatis = f"https://www.civitatis.com/es/{civitatis_city}/"
    links['activities'].append({
        'name': f'Free tours en {city}',
        'url': civitatis,
        'provider': 'Civitatis',
        'type': 'general',
        'description': 'Visitas guiadas gratuitas'
    })

    # Links específicos para cada lugar mencionado (hasta 5)
    places = itinerary.get('places', [])
    for place in places[:5]:
        place_name = place.get('name', '')
        if place_name:
            # Buscar en Google el sitio oficial
            google_search = f"https://www.google.com/search?q={quote(place_name + ' ' + city + ' entradas oficial')}"

            # También GetYourGuide para ese lugar específico
            place_encoded = quote(f"{place_name} {city}")
            getyourguide_place = f"https://www.getyourguide.es/s/?q={place_encoded}"

            links['activities'].append({
                'name': place_name,
                'url': getyourguide_place,
                'url_official': google_search,
                'provider': 'GetYourGuide',
                'type': 'specific',
                'description': f'Entradas y tours para {place_name}'
            })

    # Debug: imprimir resumen de lo que se va a devolver
    print(f"\n📋 RESUMEN BOOKING LINKS:")
    print(f"   ✈️  Vuelos: {len(links['flights'])} items")
    for f in links['flights']:
        print(f"      - {f.get('type')}: {f.get('name')}")
    print(f"   🏨 Hoteles: {len(links['hotels'])} items")
    for h in links['hotels']:
        print(f"      - {h.get('type')}: {h.get('name')}")
    print(f"   🎫 Actividades: {len(links['activities'])} items")

    return links

def extract_video_info(url):
    """Extrae información básica del URL del video"""
    info = {
        'platform': None,
        'video_id': None,
        'username': None
    }
    
    # Detectar TikTok
    if 'tiktok.com' in url:
        info['platform'] = 'tiktok'
        # Extraer username e ID de video si es posible
        match = re.search(r'@([^/]+)/video/(\d+)', url)
        if match:
            info['username'] = match.group(1)
            info['video_id'] = match.group(2)
    
    # Detectar Instagram
    elif 'instagram.com' in url:
        info['platform'] = 'instagram'
        match = re.search(r'reel/([^/?]+)', url)
        if match:
            info['video_id'] = match.group(1)
    
    return info

def download_video_audio(video_url):
    """Descarga el video y extrae el audio usando yt-dlp"""
    try:
        # Crear directorio temporal
        temp_dir = tempfile.mkdtemp()
        audio_path = os.path.join(temp_dir, 'audio.m4a')

        # Configurar yt-dlp para extraer solo audio
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': audio_path,
            'quiet': True,
            'no_warnings': True,
            'extract_audio': True,
        }

        print(f"📥 Descargando audio del video...")
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        # Buscar el archivo de audio descargado
        audio_files = list(Path(temp_dir).glob('audio.*'))
        if not audio_files:
            raise ValueError("No se pudo descargar el audio del video")

        return str(audio_files[0])

    except Exception as e:
        print(f"Error al descargar video: {str(e)}")
        raise

def transcribe_audio(audio_path):
    """Transcribe el audio usando Whisper de OpenAI"""
    try:
        print(f"🎤 Transcribiendo audio con Whisper...")

        with open(audio_path, 'rb') as audio_file:
            transcript = openai_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="es"  # Español por defecto, Whisper detecta automáticamente si es otro idioma
            )

        print(f"✅ Transcripción completada: {len(transcript.text)} caracteres")
        return transcript.text

    except Exception as e:
        print(f"Error al transcribir audio: {str(e)}")
        raise

def generate_itinerary_with_ai(video_transcript, video_info):
    """Usa Claude Haiku (económico) para generar itinerario basado en la transcripción REAL del video"""

    # Si no hay transcripción, usar mensaje de error
    if not video_transcript or len(video_transcript.strip()) < 10:
        video_transcript = "[No se pudo extraer audio del video - video sin sonido o error en descarga]"

    prompt = f"""Eres un experto planificador de viajes. Un usuario ha compartido un video de {video_info['platform']} sobre un destino turístico.

TRANSCRIPCIÓN DEL VIDEO (diálogos y narración REALES extraídos del video):
---
{video_transcript}
---

Basándote ÚNICAMENTE en lo que se menciona en la transcripción del video (lugares, actividades, recomendaciones), genera un itinerario de viaje detallado y REALISTA.

REGLAS IMPORTANTES PARA DÍAS:
- Los días se cuentan por DÍAS NATURALES (calendario), NO por bloques de actividades
- Si alguien llega un viernes a las 18:00, ese viernes ES el Día 1 (incluye vuelo + actividad nocturna si hay)
- El sábado siguiente ES el Día 2 (día completo)
- El domingo ES el Día 3, y así sucesivamente
- NO dividas un mismo día natural en dos días diferentes

REGLAS IMPORTANTES PARA HORARIOS:
- Usa horarios REALISTAS y LÓGICOS según cada actividad:
  * Desayuno: entre 8:00-10:00
  * Actividades matutinas: 9:00-13:00
  * Comida: 13:00-15:00
  * Actividades tarde: 16:00-19:00
  * Cena: 20:00-22:00
  * Actividades nocturnas: 22:00-01:00
- NO uses horarios equiespaciados (8:00, 10:00, 12:00, 14:00...)
- Los horarios deben tener SENTIDO cronológico y dejar tiempo entre actividades
- Varía los horarios según el tipo de actividad (museo vs playa vs restaurante)

ESTRUCTURA DEL ITINERARIO:
- Día 1: Si incluye llegada/vuelo, pon la hora de llegada estimada y solo actividades viables DESPUÉS de llegar
- Días intermedios: Días completos de actividades (mañana, tarde, noche)
- Último día: Si incluye vuelo de vuelta, termina las actividades ANTES de la hora de salida

Genera un JSON con la siguiente estructura EXACTA (sin texto adicional, solo el JSON):

{{
  "destination": "Nombre del destino mencionado en el video",
  "city": "Ciudad principal del destino",
  "country": "País",
  "airport_code": "Código IATA del aeropuerto principal (3 letras: BCN, MAD, NYC, TAS, etc.)",
  "city_code": "Código IATA de la ciudad (3 letras - mismo que airport_code normalmente)",
  "description": "Breve descripción basada en lo que se dice en el video (1-2 líneas)",
  "duration": "X días",
  "budget": "€X - €Y por persona (orientativo)",
  "best_time": "Mejor época para visitar",
  "days": [
    {{
      "title": "Día 1: Llegada a [Ciudad] (Viernes)" // Ejemplo: incluir día de la semana si es relevante
      "activities": [
        {{
          "time": "18:00",
          "activity": "Llegada al aeropuerto y traslado al hotel (vuelo incluido)",
          "location": "Aeropuerto Internacional"
        }},
        {{
          "time": "21:00",
          "activity": "Cena en restaurante local y primer paseo nocturno",
          "location": "Centro histórico"
        }}
      ]
    }},
    {{
      "title": "Día 2: [Descripción] (Sábado)" // Día completo
      "activities": [
        {{
          "time": "09:30",
          "activity": "Desayuno y visita guiada matinal",
          "location": "Plaza principal"
        }},
        {{
          "time": "13:30",
          "activity": "Comida tradicional",
          "location": "Restaurante recomendado en el video"
        }},
        {{
          "time": "16:00",
          "activity": "Tarde libre en la playa/museo/actividad",
          "location": "Zona costera"
        }},
        {{
          "time": "20:30",
          "activity": "Cena con vistas y experiencia nocturna",
          "location": "Mirador mencionado"
        }}
      ]
    }}
  ],
  "places": [
    {{
      "name": "Nombre del lugar mencionado en el video",
      "description": "Descripción breve",
      "tip": "Consejo útil basado en el contenido del video"
    }}
  ],
  "note": "⏰ Los horarios son orientativos y pueden ajustarse según tus preferencias y disponibilidad de cada lugar."
}}

IMPORTANTE:
- Identifica el destino mencionado en el video
- Usa las actividades y lugares específicos que se mencionan en el audio
- Si no se menciona un destino claro, intenta inferirlo del contexto
- Incluye solo información relevante al contenido del video
- Incluye 4-5 días de itinerario con 3-5 actividades por día
- Lista 4-6 lugares destacados MENCIONADOS EN EL VIDEO
- Los horarios deben ser REALISTAS y con SENTIDO (desayuno por la mañana, cena por la noche, etc.)
- Respeta los DÍAS NATURALES (un viernes es un día, el sábado siguiente es otro día distinto)"""

    try:
        # Usar Claude Haiku - mucho más económico (~20x más barato que Sonnet 4)
        message = anthropic_client.messages.create(
            model="claude-3-5-haiku-20241022",  # Haiku es ~$0.25 vs ~$5 por millón de tokens
            max_tokens=4000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Extraer el contenido de la respuesta
        response_text = message.content[0].text

        # Intentar parsear directamente
        try:
            itinerary = json.loads(response_text)
        except json.JSONDecodeError:
            # Si falla, intentar extraer JSON de markdown o texto
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                itinerary = json.loads(json_match.group(0))
            else:
                raise ValueError("No se pudo extraer JSON válido de la respuesta")

        return itinerary

    except Exception as e:
        print(f"Error al generar itinerario: {str(e)}")
        raise

@app.route('/api/detect-location', methods=['GET'])
def detect_location():
    """Detecta la ubicación del usuario basándose en su IP"""
    try:
        # Intentar obtener IP del usuario
        if request.headers.getlist("X-Forwarded-For"):
            user_ip = request.headers.getlist("X-Forwarded-For")[0]
        else:
            user_ip = request.remote_addr

        # Si es localhost, usar servicio de IP pública
        if user_ip in ['127.0.0.1', 'localhost', '::1']:
            # Obtener IP pública
            try:
                ip_response = requests.get('https://api.ipify.org?format=json', timeout=3)
                user_ip = ip_response.json().get('ip', user_ip)
            except:
                pass

        # Usar servicio de geolocalización gratuito
        try:
            geo_response = requests.get(f'http://ip-api.com/json/{user_ip}', timeout=5)
            geo_data = geo_response.json()

            if geo_data.get('status') == 'success':
                city = geo_data.get('city', 'Madrid')
                country = geo_data.get('country', 'España')

                # Mapeo de ciudades a códigos de aeropuerto IATA
                city_to_iata = {
                    'Madrid': 'MAD',
                    'Barcelona': 'BCN',
                    'Valencia': 'VLC',
                    'Sevilla': 'SVQ',
                    'Málaga': 'AGP',
                    'Bilbao': 'BIO',
                    'Alicante': 'ALC',
                    'Palma': 'PMI',
                }

                iata_code = city_to_iata.get(city, 'MAD')

                return jsonify({
                    'city': city,
                    'country': country,
                    'iata_code': iata_code,
                    'detected': True
                })
        except Exception as e:
            print(f"Error en geolocalización: {str(e)}")

        # Fallback a Madrid si falla
        return jsonify({
            'city': 'Madrid',
            'country': 'España',
            'iata_code': 'MAD',
            'detected': False
        })

    except Exception as e:
        print(f"Error detectando ubicación: {str(e)}")
        return jsonify({
            'city': 'Madrid',
            'country': 'España',
            'iata_code': 'MAD',
            'detected': False
        })

@app.route('/api/analyze', methods=['POST'])
def analyze_video():
    """Endpoint para analizar un video REAL y generar itinerario basado en su contenido"""
    audio_path = None

    try:
        data = request.get_json()
        video_url = data.get('video_url', '').strip()
        origin_iata = data.get('origin_iata', 'MAD').strip().upper()  # Origen del vuelo

        if not video_url:
            return jsonify({'error': 'URL del video es requerida'}), 400

        # Validar que sea un URL válido de TikTok o Instagram
        if not ('tiktok.com' in video_url or 'instagram.com' in video_url):
            return jsonify({'error': 'Por favor, proporciona un link válido de TikTok o Instagram'}), 400

        # Extraer información del video
        video_info = extract_video_info(video_url)

        if not video_info['platform']:
            return jsonify({'error': 'No se pudo identificar la plataforma del video'}), 400

        print(f"🎬 Procesando video de {video_info['platform']}...")

        # PASO 1: Descargar audio del video
        try:
            audio_path = download_video_audio(video_url)
        except Exception as e:
            print(f"⚠️  No se pudo descargar el video: {str(e)}")
            return jsonify({'error': 'No se pudo descargar el video. Verifica que el link sea público y válido.'}), 400

        # PASO 2: Transcribir audio con Whisper (barato: $0.006 por minuto)
        try:
            video_transcript = transcribe_audio(audio_path)
            print(f"📝 Transcripción obtenida: {video_transcript[:200]}...")
        except Exception as e:
            print(f"⚠️  No se pudo transcribir: {str(e)}")
            video_transcript = ""

        # PASO 3: Generar itinerario con Claude Haiku basado en transcripción REAL
        itinerary = generate_itinerary_with_ai(video_transcript, video_info)

        # PASO 4: Generar links automáticos a buscadores de vuelos, hoteles y actividades
        print(f"🔗 Generando links a buscadores de vuelos, hoteles y actividades...")
        print(f"📍 Origen del vuelo: {get_city_from_iata(origin_iata)} ({origin_iata})")
        booking_links = generate_booking_links(itinerary, origin_iata)
        itinerary['booking_links'] = booking_links

        # Limpiar archivo temporal
        if audio_path and os.path.exists(audio_path):
            try:
                os.remove(audio_path)
                # Eliminar directorio temporal si está vacío
                temp_dir = os.path.dirname(audio_path)
                if os.path.exists(temp_dir) and not os.listdir(temp_dir):
                    os.rmdir(temp_dir)
            except:
                pass

        return jsonify(itinerary), 200

    except Exception as e:
        print(f"❌ Error: {str(e)}")

        # Limpiar archivo temporal en caso de error
        if audio_path and os.path.exists(audio_path):
            try:
                os.remove(audio_path)
                temp_dir = os.path.dirname(audio_path)
                if os.path.exists(temp_dir) and not os.listdir(temp_dir):
                    os.rmdir(temp_dir)
            except:
                pass

        return jsonify({'error': f'Error al procesar el video: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
    return jsonify({'status': 'ok', 'message': 'Backend is running'}), 200

if __name__ == '__main__':
    # Verificar que existen las API keys
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("⚠️  WARNING: ANTHROPIC_API_KEY no está configurada")
        print("⚠️  Configúrala con: export ANTHROPIC_API_KEY='tu-api-key'")

    if not os.environ.get("OPENAI_API_KEY"):
        print("⚠️  WARNING: OPENAI_API_KEY no está configurada")
        print("⚠️  Configúrala con: export OPENAI_API_KEY='tu-api-key'")

    print("🚀 InstaTrip Backend iniciando en http://localhost:5000")
    print("💰 Usando Claude Haiku (económico) + Whisper para transcripción")
    app.run(debug=True, port=5000)
