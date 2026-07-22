# 🗄️ Database Schema

## Estrutura

**Desenvolvimento:** SQLite  
**Produção:** PostgreSQL  
**ORM:** Prisma

## Modelos Principais

### User
- Core: id, email, password, name, username
- Profile: bio, avatar, banner, website, location
- Status: ACTIVE, INACTIVE, BANNED, SILENCED, DELETED
- Role: USER, MODERATOR, ADMIN, SUPER_ADMIN
- XP: level (1-∞), xp, totalXpEarned, reputation, rank
- Streak: streakCount, lastDailyAt, lastStreakDate
- Security: twoFactorSecret, twoFactorEnabled

### Post
- Types: TEXT, IMAGE, VIDEO, CODE, POLL, LINK
- Flags: isEdited, isArchived, isPinned, isDraft
- Stats: likesCount, commentsCount, sharesCount
- Poll: pollQuestion, pollOptions (JSON), pollEndsAt

### Comment
- Nested: parentId for threaded comments
- Flags: isEdited, isPinned
- Stats: likesCount, repliesCount

### Reaction
- Types: LIKE, LOVE, INTERESTING, FUNNY, ANGRY, APPLAUSE
- Unique per user+post or user+comment+type

### Message
- Types: TEXT, IMAGE, VIDEO, AUDIO, FILE, GIF
- Status: isRead, isDelivered, isEdited, isDeleted
- Real-time via Socket.IO

### Level
- 100+ níveis pré-definidos
- xpRequired segue curva: 100 * N^1.5 + (N-1) * 100

### Badge
- Rarity: COMMON, UNCOMMON, RARE, EPIC, LEGENDARY, MYTHIC
- Category: GENERAL, SOCIAL, CONTENT, COMMUNITY, MILESTONE, SPECIAL, ADMINISTRATIVE

### Mission
- Types: DAILY, WEEKLY, MONTHLY, EVENT, SEASONAL, SPECIAL
- Requirements e rewards em JSON

### Community
- Roles: OWNER, ADMIN, MODERATOR, MEMBER
- Flags: isPrivate, isVerified

## Índices

Todos os modelos possuem índices nos campos mais consultados:
- User: email, username, level, xp, status, role
- Post: userId, createdAt, type, likesCount
- Reaction: postId, userId, type (unique composto)
- Message: conversationId, senderId, createdAt, isRead
