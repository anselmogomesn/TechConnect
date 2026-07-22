# TechConnect - Rede Social Profissional

## Stack
- **Backend:** Node.js + Express + TypeScript + Prisma + SQLite/PostgreSQL
- **Frontend:** React + Vite + TypeScript + TailwindCSS
- **Auth:** JWT + Refresh Token + 2FA
- **Real-time:** Socket.IO
- **Validação:** Zod

## Commands
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`
- Prisma: `cd backend && npx prisma migrate dev --name init`
- Seed: `cd backend && npm run prisma:seed`
- Tests: `cd backend && npm test`

## Structure
- `/backend/src` - API Express com Clean Architecture
  - `config/` - Configurações centralizadas
  - `middlewares/` - Auth, validation, error handling
  - `controllers/` - Thin controllers
  - `services/` - Business logic
  - `repositories/` - Data access
  - `routes/` - Route definitions
  - `validators/` - Zod schemas
  - `security/` - Rate limit, sanitization
  - `socket/` - WebSocket
- `/frontend/src` - React SPA
  - `components/ui/` - Base components
  - `components/layout/` - App shell
  - `pages/` - Route pages
  - `hooks/` - Custom hooks
  - `services/` - Axios API client
  - `contexts/` - Theme, Auth contexts

## Key Patterns
- Repository Pattern: Data access abstraction
- Service Layer: Business logic
- DTO: Data Transfer Objects
- Zod validation on all inputs
- JWT auth with refresh tokens
- RBAC authorization
