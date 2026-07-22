FROM node:20-alpine AS builder

WORKDIR /app

# Dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

# Prisma generate
COPY backend/prisma ./prisma
RUN npx prisma generate

# Build
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 anselmo

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY backend/package.json ./

RUN mkdir -p /app/uploads && chown anselmo:nodejs /app/uploads

USER anselmo

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "dist/server.js"]
