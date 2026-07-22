# 📡 API Reference

Base URL: `/api`

## Autenticação

### POST /api/auth/register
```json
{
  "email": "user@email.com",
  "password": "Senha@123",
  "name": "João",
  "surname": "Silva",
  "username": "joaosilva"
}
```

### POST /api/auth/login
```json
{
  "email": "user@email.com",
  "password": "Senha@123",
  "twoFactorCode": "123456" // opcional
}
```

### POST /api/auth/refresh
- Cookie `refreshToken` ou body `{ "refreshToken": "..." }`

### POST /api/auth/logout
- Requer autenticação

### GET /api/auth/me
- Requer autenticação
- Retorna dados do usuário logado

## Usuários

### GET /api/users/:username
### GET /api/users/:username/followers?page=1&limit=20
### GET /api/users/:username/following?page=1&limit=20

## Posts (em desenvolvimento)

### GET /api/posts
### GET /api/posts/feed
### POST /api/posts
### GET /api/posts/:id
### POST /api/posts/:id/like
### POST /api/posts/:id/comments

## Códigos de Erro

| Status | Code | Descrição |
|--------|------|-----------|
| 400 | VALIDATION_ERROR | Dados inválidos |
| 401 | UNAUTHORIZED | Não autenticado |
| 403 | FORBIDDEN | Sem permissão |
| 404 | NOT_FOUND | Recurso não encontrado |
| 409 | CONFLICT | Conflito (ex: email já existe) |
| 422 | VALIDATION_ERROR | Erro de validação |
| 429 | TOO_MANY_REQUESTS | Rate limit excedido |
| 500 | INTERNAL_ERROR | Erro interno |
