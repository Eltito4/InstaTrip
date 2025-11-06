from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic
import os
import re

app = Flask(__name__)
CORS(app)

# Inicializar cliente de Anthropic (Claude)
client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

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

def generate_itinerary_with_ai(video_url, video_info):
    """Usa Claude para generar un itinerario basado en el video"""
    
    prompt = f"""Eres un experto planificador de viajes. Un usuario ha compartido el siguiente link de video de viaje: {video_url}

Basándote en videos típicos de viajes en {video_info['platform']}, genera un itinerario de viaje realista y detallado.

Para este ejercicio de MVP, asume que el video muestra un destino turístico popular (puedes elegir uno interesante basándote en el URL o username si hay pistas, o elige un destino popular como Bali, Tokio, Barcelona, etc.).

Genera un JSON con la siguiente estructura EXACTA (sin texto adicional, solo el JSON):

{{
  "destination": "Nombre del destino",
  "description": "Breve descripción atractiva del destino (1-2 líneas)",
  "duration": "X días",
  "budget": "€X - €Y por persona",
  "best_time": "Mejor época para visitar",
  "days": [
    {{
      "title": "Día 1: Título descriptivo",
      "activities": [
        {{
          "time": "09:00",
          "activity": "Descripción de la actividad",
          "location": "Nombre del lugar"
        }}
      ]
    }}
  ],
  "places": [
    {{
      "name": "Nombre del lugar",
      "description": "Descripción breve",
      "tip": "Consejo útil para visitar"
    }}
  ]
}}

Incluye 4-5 días de itinerario con 3-4 actividades por día, y lista 4-6 lugares destacados.
Haz que sea inspirador, práctico y realista."""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        # Extraer el contenido de la respuesta
        response_text = message.content[0].text
        
        # Limpiar la respuesta para obtener solo el JSON
        # Buscar el JSON en la respuesta
        import json
        
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

@app.route('/api/analyze', methods=['POST'])
def analyze_video():
    """Endpoint para analizar un video y generar itinerario"""
    try:
        data = request.get_json()
        video_url = data.get('video_url', '').strip()
        
        if not video_url:
            return jsonify({'error': 'URL del video es requerida'}), 400
        
        # Validar que sea un URL válido de TikTok o Instagram
        if not ('tiktok.com' in video_url or 'instagram.com' in video_url):
            return jsonify({'error': 'Por favor, proporciona un link válido de TikTok o Instagram'}), 400
        
        # Extraer información del video
        video_info = extract_video_info(video_url)
        
        if not video_info['platform']:
            return jsonify({'error': 'No se pudo identificar la plataforma del video'}), 400
        
        # Generar itinerario con IA
        itinerary = generate_itinerary_with_ai(video_url, video_info)
        
        return jsonify(itinerary), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Error al procesar el video: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
    return jsonify({'status': 'ok', 'message': 'Backend is running'}), 200

if __name__ == '__main__':
    # Verificar que existe la API key
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("⚠️  WARNING: ANTHROPIC_API_KEY no está configurada")
        print("⚠️  Configúrala con: export ANTHROPIC_API_KEY='tu-api-key'")
    
    print("🚀 InstaTrip Backend iniciando en http://localhost:5000")
    app.run(debug=True, port=5000)
