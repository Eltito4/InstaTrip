#!/bin/bash

echo "🚀 InstaTrip - Iniciando MVP..."
echo ""

# Colores para la terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que existe ANTHROPIC_API_KEY
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  WARNING: ANTHROPIC_API_KEY no está configurada${NC}"
    echo "Por favor, configúrala con:"
    echo "export ANTHROPIC_API_KEY='tu-api-key'"
    echo ""
    echo "Obtén tu API key en: https://console.anthropic.com"
    echo ""
    read -p "¿Continuar de todas formas? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar Python
if ! command_exists python3; then
    echo "❌ Python 3 no está instalado"
    exit 1
fi

# Verificar Node
if ! command_exists node; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

echo -e "${BLUE}📦 Instalando dependencias...${NC}"
echo ""

# Backend
echo "Backend (Python)..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
cd ..

# Frontend
echo "Frontend (Node.js)..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install --silent
fi
cd ..

echo ""
echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""
echo -e "${BLUE}🚀 Iniciando servidores...${NC}"
echo ""

# Iniciar backend en background
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Esperar a que el backend esté listo
sleep 3

# Iniciar frontend
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ Servidores iniciados${NC}"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:5000"
echo ""
echo "Presiona Ctrl+C para detener ambos servidores"
echo ""

# Esperar a que el usuario presione Ctrl+C
trap "echo ''; echo 'Deteniendo servidores...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Mantener el script corriendo
wait
