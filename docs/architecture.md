# 🏗️ Arquitetura do Anselmo

## Visão Geral

```
┌─────────────────────────────────────────────────┐
│                   CLIENTE                        │
│  React + Vite + TailwindCSS + TypeScript         │
│  React Router / React Query / Axios / Socket.IO │
├─────────────────────────────────────────────────┤
│                   API GATEWAY                    │
│  Express + Helmet + CORS + Rate Limiter         │
├─────────────────────────────────────────────────┤
│               APPLICATION LAYER                  │
│  Controllers → Services → Repositories → Prisma │
│  Middleware Chain (Auth → Validation → Security) │
├─────────────────────────────────────────────────┤
│               REAL-TIME LAYER                    │
│  Socket.IO - Chat, Notificações, Status          │
├─────────────────────────────────────────────────┤
│                   DATA LAYER                     │
│  SQLite (Dev) / PostgreSQL (Prod)                │
│  Prisma ORM                                      │
└─────────────────────────────────────────────────┘
```

## Clean Architecture

O projeto segue princípios de Clean Architecture:

1. **Entities** - Modelos Prisma (regras de negócio)
2. **Use Cases** - Services (casos de uso da aplicação)  
3. **Controllers** - Adaptadores HTTP
4. **Frameworks** - Express, React, Prisma

## SOLID Aplicado

- **S** - Single Responsibility: Cada classe tem uma única responsabilidade
- **O** - Open/Closed: Services estendem comportamentos sem modificar
- **L** - Liskov: Repositories seguem interfaces consistentes
- **I** - Interface Segregation: DTOs específicos para cada operação
- **D** - Dependency Inversion: Services dependem de abstrações (interfaces)

## Fluxo de Dados

```
Request → Middleware Chain → Controller → Service → Repository → Prisma → Database
                                                              ↓
                                                          Response
```

## Segurança em Camadas

1. Helmet (headers)
2. CORS
3. Rate Limiting
4. Autenticação JWT
5. Autorização RBAC
6. Validação Zod
7. Sanitização
