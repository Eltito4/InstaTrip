# 🌍 InstaTrip - MVP

**Convierte videos de viajes en itinerarios completos**

Una aplicación que analiza videos de TikTok e Instagram de viajes y genera automáticamente un itinerario detallado para que puedas vivir esa experiencia.

## 🚀 Características del MVP

- ✅ Pega un link de TikTok o Instagram Reels
- ✅ IA analiza el contenido del video
- ✅ Genera itinerario día a día
- ✅ Lista de lugares destacados
- ✅ Presupuesto estimado
- ✅ Mejor época para viajar
- ✅ Interfaz moderna y responsive

## 🛠️ Tecnologías

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Lucide Icons

**Backend:**
- Python 3.10+
- Flask
- Anthropic Claude API (IA)

## 📦 Instalación

### Prerequisitos

- Node.js 18+ y npm
- Python 3.10+
- API Key de Anthropic (Claude)

### 1. Clonar/Descargar el proyecto

```bash
cd travel-video-planner
```

### 2. Configurar Backend

```bash
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar API Key de Anthropic
export ANTHROPIC_API_KEY='tu-api-key-aqui'
# En Windows: set ANTHROPIC_API_KEY=tu-api-key-aqui
```

### 3. Configurar Frontend

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

1. Abre la aplicación en tu navegador (`http://localhost:3000`)
2. Busca un video de viajes en TikTok o Instagram
3. Copia el link del video
4. Pégalo en el campo de entrada
5. Haz clic en "Crear Viaje"
6. ¡Disfruta tu itinerario personalizado!

## 🔑 Obtener API Key de Anthropic

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en el menú
4. Genera una nueva API Key
5. Copia la key y úsala en la configuración

## 📝 Estructura del Proyecto

```
travel-video-planner/
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── App.jsx        # Componente principal
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/               # API Flask
│   ├── app.py            # Servidor principal
│   └── requirements.txt
└── README.md
```

## 🎨 Próximas Características (Roadmap)

- [ ] Análisis real de video (extraer frames, audio, texto)
- [ ] Integración con APIs de TikTok/Instagram
- [ ] Reconocimiento de lugares con Computer Vision
- [ ] Guardar itinerarios (base de datos)
- [ ] Sistema de usuarios
- [ ] Reservas integradas (vuelos, hoteles)
- [ ] Exportar itinerario a PDF
- [ ] Compartir en redes sociales
- [ ] App móvil nativa
- [ ] Colaboración en tiempo real

## 💡 Notas del MVP

Este es un **MVP (Producto Mínimo Viable)**. Por ahora:

- La IA genera itinerarios basándose en destinos populares
- No extrae contenido real del video (fase posterior)
- Usa Claude para generar contenido inteligente
- Se puede expandir con APIs de redes sociales

## 🐛 Problemas Conocidos

- Requiere API Key de Anthropic (de pago después de créditos gratuitos)
- No analiza el video real aún (simulado con IA)
- CORS puede dar problemas si los puertos cambian

## 🤝 Contribuir

Este es un MVP en desarrollo. Ideas para mejorar:

1. **Fork** el proyecto
2. Crea un **branch** (`git checkout -b feature/mejora`)
3. **Commit** tus cambios (`git commit -m 'Add: nueva característica'`)
4. **Push** al branch (`git push origin feature/mejora`)
5. Abre un **Pull Request**

## 📄 Licencia

MIT License - siéntete libre de usar y modificar

## 👨‍💻 Autor

Creado con ❤️ como MVP de TripFromVideo

---

**¿Preguntas o sugerencias?** Abre un Issue en el repositorio
