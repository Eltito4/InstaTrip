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

app = Flask(__name__)
CORS(app)

# Inicializar clientes de IA
anthropic_client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

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

Basándote ÚNICAMENTE en lo que se menciona en la transcripción del video (lugares, actividades, recomendaciones), genera un itinerario de viaje detallado.

IMPORTANTE:
- Identifica el destino mencionado en el video
- Usa las actividades y lugares específicos que se mencionan en el audio
- Si no se menciona un destino claro, intenta inferirlo del contexto
- Incluye solo información relevante al contenido del video

Genera un JSON con la siguiente estructura EXACTA (sin texto adicional, solo el JSON):

{{
  "destination": "Nombre del destino mencionado en el video",
  "description": "Breve descripción basada en lo que se dice en el video (1-2 líneas)",
  "duration": "X días",
  "budget": "€X - €Y por persona",
  "best_time": "Mejor época para visitar",
  "days": [
    {{
      "title": "Día 1: Título descriptivo",
      "activities": [
        {{
          "time": "09:00",
          "activity": "Descripción de la actividad mencionada en el video",
          "location": "Lugar específico mencionado"
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
  ]
}}

Incluye 4-5 días de itinerario con 3-4 actividades por día, y lista 4-6 lugares destacados MENCIONADOS EN EL VIDEO."""

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

@app.route('/api/analyze', methods=['POST'])
def analyze_video():
    """Endpoint para analizar un video REAL y generar itinerario basado en su contenido"""
    audio_path = None

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
