#!/bin/bash
# 🚀 TechConnect - Deploy Script
# Uso: bash scripts/deploy.sh

set -e

echo "╔══════════════════════════════════════╗"
echo "║   🚀 TechConnect - Deploy           ║"
echo "╚══════════════════════════════════════╝"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado"
    exit 1
fi

echo "✅ Node.js $(node -v)"
echo ""

# Build do frontend
echo "📦 Build frontend..."
cd frontend
npm install --silent
npm run build
cd ..

# Instalar backend
echo "📦 Setup backend..."
cd backend
npm install --silent

# Gerar Prisma
echo "🗄️  Gerando Prisma..."
npx prisma generate
npx prisma migrate deploy

# Seed (opcional)
if [ "$1" = "--seed" ]; then
    echo "🌱 Seed database..."
    npm run prisma:seed
fi

cd ..

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   ✅ TechConnect pronto!            ║"
echo "║                                      ║"
echo "║   Backend:  http://localhost:3000    ║"
echo "║   Frontend: serve frontend/dist      ║"
echo "║                                      ║"
echo "║   Para iniciar o backend:            ║"
echo "║   cd backend && npm start           ║"
echo "╚══════════════════════════════════════╝"
