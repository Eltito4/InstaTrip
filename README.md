# 🌍 InstaTrip - V2.0

**Convierte videos de viajes en itinerarios completos**

Una aplicación PWA que analiza **el contenido real** de videos de TikTok e Instagram de viajes y genera automáticamente un itinerario detallado basado en los diálogos y narración del video.

## 🚀 Características

- ✅ **Compartir directamente desde Instagram/TikTok** (PWA con Web Share Target)
- ✅ **Análisis REAL del contenido del video**:
  - Descarga del video
  - Extracción de audio
  - Transcripción con Whisper AI
  - Análisis inteligente de los diálogos
- ✅ Genera itinerario día a día basado en el contenido real
- ✅ Lista de lugares mencionados en el video
- ✅ Presupuesto estimado
- ✅ Mejor época para viajar
- ✅ Interfaz moderna y responsive
- ✅ **Costes ultra-reducidos**: ~$0.01-0.02 por video (20x más barato)

## 🛠️ Tecnologías

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Lucide Icons
- PWA (Progressive Web App) con Service Worker
- Web Share Target API

**Backend:**
- Python 3.10+
- Flask
- yt-dlp (descarga de videos)
- OpenAI Whisper (transcripción de audio)
- Anthropic Claude Haiku (análisis inteligente)

**IA Stack:**
- Whisper: $0.006 por minuto de audio
- Claude Haiku: $0.25 por millón de tokens (~$0.001-0.002 por consulta)
- **Total**: ~$0.01-0.02 por video analizado

## 📦 Instalación

### Prerequisitos

- Node.js 18+ y npm
- Python 3.10+
- ffmpeg (para procesamiento de audio)
- API Key de Anthropic (Claude)
- API Key de OpenAI (Whisper)

### 1. Clonar/Descargar el proyecto

```bash
cd travel-video-planner
```

### 2. Instalar ffmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
Descarga desde [ffmpeg.org](https://ffmpeg.org/download.html) y añade al PATH

### 3. Configurar Backend

```bash
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar API Keys
export ANTHROPIC_API_KEY='tu-api-key-aqui'
export OPENAI_API_KEY='tu-api-key-aqui'
# En Windows:
# set ANTHROPIC_API_KEY=tu-api-key-aqui
# set OPENAI_API_KEY=tu-api-key-aqui
```

### 4. Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install
```

## 🚀 Ejecutar la aplicación

Necesitas dos terminales abiertas:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Si usas entorno virtual
python app.py
```

El backend correrá en: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

El frontend correrá en: `http://localhost:3000`

## 🎯 Cómo usar

### Opción 1: Copiar y pegar (tradicional)
1. Abre la aplicación en tu navegador (`http://localhost:3000`)
2. Busca un video de viajes en TikTok o Instagram
3. Copia el link del video
4. Pégalo en el campo de entrada
5. Haz clic en "Crear Viaje"
6. ¡Disfruta tu itinerario basado en el contenido real del video!

### Opción 2: Compartir directamente (PWA)
1. Instala la PWA desde tu navegador (botón "Instalar app")
2. En TikTok o Instagram, abre un video de viajes
3. Toca el botón "Compartir"
4. Selecciona "InstaTrip" en la lista de apps
5. ¡La app se abre automáticamente y analiza el video!

## 💰 Costes de IA

Esta versión está optimizada para **minimizar costes durante pruebas**:

| Servicio | Coste | Uso |
|----------|-------|-----|
| Whisper (transcripción) | $0.006/minuto | Extrae diálogos del video |
| Claude Haiku (análisis) | $0.001-0.002/consulta | Genera itinerario |
| **Total por video** | **~$0.01-0.02** | **20x más barato que antes** |

**Antes**: Claude Sonnet 4 costaba ~$0.03-0.05 solo por análisis sin contenido real
**Ahora**: Análisis COMPLETO con transcripción real por ~$0.01-0.02

## 🔑 Obtener API Keys

### API Key de Anthropic (Claude)
1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en el menú
4. Genera una nueva API Key
5. Copia la key y úsala en la configuración

### API Key de OpenAI (Whisper)
1. Ve a [platform.openai.com](https://platform.openai.com/api-keys)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys"
4. Crea una nueva API Key
5. Copia la key y úsala en la configuración

## 📝 Estructura del Proyecto

```
InstaTrip/
├── frontend/                  # Aplicación React PWA
│   ├── src/
│   │   ├── App.jsx           # Componente principal con Web Share
│   │   └── main.jsx          # Entry point
│   ├── public/
│   │   ├── manifest.json     # PWA manifest
│   │   ├── sw.js            # Service Worker
│   │   └── icon.svg         # Iconos de la app
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                  # API Flask
│   ├── app.py               # Servidor con procesamiento real
│   ├── requirements.txt     # Incluye yt-dlp, openai, etc.
│   └── .env.example
└── README.md
```

## 🎨 Próximas Características (Roadmap)

- [x] ✅ Análisis real de video (extracción de audio y transcripción)
- [x] ✅ PWA con Web Share Target
- [x] ✅ Optimización de costes con modelos económicos
- [ ] Análisis de frames con Computer Vision (lugares visuales)
- [ ] Cache de transcripciones para reducir costes
- [ ] Guardar itinerarios (base de datos)
- [ ] Sistema de usuarios
- [ ] Reservas integradas (vuelos, hoteles)
- [ ] Exportar itinerario a PDF
- [ ] App móvil nativa
- [ ] Colaboración en tiempo real

## 💡 Novedades V2.0

Esta versión incluye **análisis REAL del contenido del video**:

✅ **Procesamiento real**:
- Descarga el video con yt-dlp
- Extrae el audio automáticamente
- Transcribe diálogos con Whisper AI
- Analiza el contenido real con Claude Haiku

✅ **Compartir directo**:
- PWA instalable
- Web Share Target API
- Recibe compartidos desde Instagram/TikTok

✅ **Costes optimizados**:
- Cambio de Claude Sonnet 4 a Haiku
- ~$0.01-0.02 por video (20x más barato)
- Transcripción precisa con Whisper

## 🐛 Problemas Conocidos

- Requiere API Keys de Anthropic y OpenAI (créditos gratuitos disponibles)
- Algunos videos privados no se pueden descargar
- CORS puede dar problemas si los puertos cambian
- PWA solo funciona con HTTPS en producción (localhost ok para desarrollo)

## 🤝 Contribuir

Este es un MVP en desarrollo. Ideas para mejorar:

1. **Fork** el proyecto
2. Crea un **branch** (`git checkout -b feature/mejora`)
3. **Commit** tus cambios (`git commit -m 'Add: nueva característica'`)
4. **Push** al branch (`git push origin feature/mejora`)
5. Abre un **Pull Request**

## 📄 Licencia

MIT License - siéntete libre de usar y modificar

## 📊 Comparación de Versiones

| Característica | V1.0 (MVP) | V2.0 (Actual) |
|----------------|------------|---------------|
| Análisis del video | ❌ Simulado | ✅ Real (audio + transcripción) |
| Compartir directo | ❌ No | ✅ Sí (PWA) |
| Modelo IA | Sonnet 4 ($$$) | Haiku ($) |
| Coste por video | ~$0.03-0.05 | ~$0.01-0.02 |
| Precisión | Baja (inventado) | Alta (contenido real) |
| PWA | ❌ No | ✅ Sí |

## 👨‍💻 Autor

Creado con ❤️ como InstaTrip - Travel Video Planner

**V2.0**: Análisis real + PWA + Costes optimizados

---

**¿Preguntas o sugerencias?** Abre un Issue en el repositorio
