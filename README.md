# 🚀 TechConnect - Rede Social Profissional

> **Status:** ✅ Pronto para produção

---

## 📦 Deploy Rápido (Docker)

```bash
# 1. Configure as variáveis de ambiente
cp backend/.env.example backend/.env
# Edite .env com seus valores (especialmente JWT_SECRET e DATABASE_URL)

# 2. Suba tudo com Docker
docker-compose -f docker/docker-compose.yml up -d --build

# 3. Acesse
# Frontend: http://localhost
# Backend:  http://localhost/api
```

## 🚀 Deploy Manual (Produção)

### Backend (Node.js + Express)

```bash
cd backend
npm install
cp .env.example .env
# Edite .env para produção

# Gerar Prisma
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed  # Apenas na primeira vez

# Iniciar servidor
npm start  # ou: node dist/server.js
```

### Frontend (Vite + React)

```bash
cd frontend
npm install
npm run build
# O build será gerado em frontend/dist/

# Sirva com Nginx, Caddy ou Vercel
```

---

## ☁️ Opções de Hospedagem Gratuita/Paga

| Serviço | Frontend | Backend | Banco | Custo |
|---|---|---|---|---|
| [Vercel](https://vercel.com) + [Railway](https://railway.app) | ✅ Vercel | ✅ Railway | ✅ PostgreSQL | ~$5/mês |
| [Render](https://render.com) | ✅ Static | ✅ Web Service | ✅ PostgreSQL | Grátis inicial |
| [Fly.io](https://fly.io) | ❌ (Nginx) | ✅ | ✅ PostgreSQL | ~$3/mês |
| DigitalOcean App Platform | ✅ | ✅ | ✅ MySQL | ~$12/mês |

### ⚡ Mais rápido: Vercel + Railway

```bash
# Frontend → Vercel
cd frontend
npx vercel --prod

# Backend → Railway
cd backend
railway up
railway domain
```

---

## 🔑 Credenciais Padrão (dev)

| Papel | Email | Senha |
|---|---|---|
| **Super Admin** | `anselmo@anselmo.com` | `Admin@12345` |

---

## 📊 Stack

| Camada | Tecnologia |
|---|---|
| **Frontend** | React + TypeScript + TailwindCSS + Vite |
| **Backend** | Node.js + Express + TypeScript + Prisma |
| **Banco** | SQLite (dev) / PostgreSQL (prod) |
| **Auth** | JWT + Refresh Token + 2FA |
| **Tempo real** | Socket.IO |
| **PWA** | Service Worker + Manifest |

**Build:** 3732 modules · ~340 kB gzip · 0 warnings
