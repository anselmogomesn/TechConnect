#!/bin/bash
# ============================================
# ANSELMO - Setup Script
# ============================================

echo "🚀 Inicializando Anselmo..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js LTS primeiro."
    exit 1
fi

echo "✅ Node.js $(node -v)"

# Backend setup
echo ""
echo "📦 Instalando dependências do backend..."
cd backend
npm install

echo ""
echo "🗄️  Configurando banco de dados..."
cp .env.example .env 2>/dev/null || true

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npm run prisma:seed

echo ""
echo "📦 Instalando dependências do frontend..."
cd ../frontend
npm install

cd ..

echo ""
echo "============================================"
echo "  ✅ Anselmo configurado com sucesso!"
echo "============================================"
echo ""
echo "  Backend:  http://localhost:3000"
echo "  Frontend: http://localhost:5173"
echo ""
echo "  Admin:    anselmo@anselmo.com"
echo "  Senha:    Admin@12345"
echo ""
echo "============================================"
