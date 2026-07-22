# 🚀 TechConnect - Deploy Script (Windows)

Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🚀 TechConnect - Deploy           ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan

# 1. Build Frontend
Write-Host "`n📦 Build frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install --silent
npm run build
Write-Host "✅ Frontend compilado!" -ForegroundColor Green
Set-Location ..

# 2. Build Backend
Write-Host "`n📦 Compilando backend..." -ForegroundColor Yellow
Set-Location backend
npm install --silent

# 3. Prisma
Write-Host "`n🗄️  Gerando Prisma..." -ForegroundColor Yellow
npx prisma generate
npx prisma migrate deploy 2>$null

Write-Host "✅ Backend pronto!" -ForegroundColor Green
Set-Location ..

# 4. Resumo
Write-Host "`n╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   ✅ TechConnect pronto para deploy! ║" -ForegroundColor Cyan
Write-Host "║                                      ║" -ForegroundColor Cyan
Write-Host "║   Frontend: frontend/dist/           ║" -ForegroundColor Cyan
Write-Host "║   Backend:  backend/src/             ║" -ForegroundColor Cyan
Write-Host "║                                      ║" -ForegroundColor Cyan
Write-Host "║   Para iniciar local:                ║" -ForegroundColor Cyan
Write-Host "║   cd backend && npm start           ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan
