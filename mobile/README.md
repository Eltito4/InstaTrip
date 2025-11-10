# InstaTrip Mobile App 📱

App nativa de InstaTrip construida con React Native y Expo.

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js 18+ instalado
- npm o yarn instalado
- Expo Go app en tu móvil ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### 1. Instalar dependencias

```bash
cd mobile
npm install
```

### 2. Iniciar el servidor de desarrollo

```bash
npm start
```

Se abrirá Expo Dev Tools en tu navegador con un código QR.

### 3. Probar en tu móvil

#### iOS (iPhone/iPad):
1. Abre la app **Camera** (cámara nativa de iOS)
2. Escanea el código QR que aparece en la terminal o navegador
3. Toca la notificación "Abrir en Expo Go"

#### Android:
1. Abre la app **Expo Go**
2. Toca "Scan QR Code"
3. Escanea el código QR que aparece en la terminal o navegador

### 4. Probar en Simulador/Emulador

#### iOS Simulator (solo macOS):
```bash
npm run ios
```

#### Android Emulator:
```bash
npm run android
```

## 📱 Estructura del Proyecto

```
mobile/
├── App.js                      # Punto de entrada con navegación
├── src/
│   └── screens/
│       ├── LandingScreen.js    # Pantalla de inicio/registro
│       └── HomeScreen.js       # Pantalla principal de la app
├── assets/                     # Iconos e imágenes
├── app.json                    # Configuración de Expo
└── package.json                # Dependencias
```

## 🎨 Features Implementados

✅ Landing page con diseño moderno y gradientes pastel
✅ Sistema de autenticación (login/registro)
✅ Pantalla principal para analizar videos
✅ Navegación entre pantallas
✅ Diseño responsive y nativo
✅ Componentes optimizados para móvil

## 🔜 Próximos Pasos

- [ ] Conectar con backend para análisis de videos
- [ ] Pantalla de resultados con itinerario
- [ ] Sistema de guardado de viajes favoritos
- [ ] Notificaciones push
- [ ] Deep linking para compartir viajes
- [ ] Build para App Store y Google Play

## 📦 Build para Producción

### Crear build de desarrollo
```bash
npx eas build --platform android --profile development
npx eas build --platform ios --profile development
```

### Crear build de producción
```bash
# Configurar EAS (Expo Application Services)
npm install -g eas-cli
eas login
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

## 📄 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run android` - Ejecuta en emulador Android
- `npm run ios` - Ejecuta en simulador iOS
- `npm run web` - Ejecuta en navegador web

## 🛠️ Tecnologías Usadas

- **React Native** - Framework para apps nativas
- **Expo** - Plataforma de desarrollo
- **React Navigation** - Navegación entre pantallas
- **Expo Linear Gradient** - Gradientes nativos
- **React Native Safe Area Context** - Manejo de áreas seguras (notch)

## 📱 Capturas (Preview)

La app incluye:
- 🎨 Diseño con tonos pastel profesionales
- 🔐 Autenticación fluida con modales nativos
- ✨ Animaciones y transiciones suaves
- 📱 Optimizado para iOS y Android
- 🚀 Performance nativa

## 🐛 Troubleshooting

**Error: "Metro bundler not starting"**
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

**Error: "Command not found: expo"**
```bash
npm install -g expo-cli
```

**QR Code no funciona:**
- Asegúrate de estar en la misma red WiFi
- Usa la opción "Connect via LAN" en Expo Dev Tools
- O ingresa manualmente la URL en Expo Go

## 📞 Soporte

Para problemas o preguntas, crea un issue en el repositorio de GitHub.
