# SocialNet - Premium Social Network Platform

Uma rede social completa, moderna e responsiva com identidade própria, design premium e experiência de usuário extremamente fluida.

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript ES6+, Bootstrap 5, Tailwind CSS, Font Awesome, GSAP, Chart.js, PWA
- **Backend:** PHP 8+, MySQL, PDO, MVC Architecture, REST API
- **Segurança:** Password Hash (bcrypt), Prepared Statements, CSRF Token, XSS Protection, SQL Injection Protection, Rate Limit, 2FA

## Estrutura do Projeto

```
social-network/
├── .htaccess                    # URL rewriting & security headers
├── index.php                    # Entry point
├── manifest.json                # PWA manifest
├── sw.js                        # Service Worker
├── routes.php                   # Route definitions
├── config/
│   ├── app.php                  # Application configuration
│   └── database.php             # Database configuration
├── core/
│   ├── Database.php             # PDO Singleton
│   ├── Router.php               # MVC Router
│   ├── Controller.php           # Base Controller
│   ├── Model.php                # Active Record Model
│   ├── View.php                 # View Renderer
│   ├── Session.php              # Session Manager
│   ├── Security.php             # CSRF, XSS, Encryption
│   └── Validator.php            # Form Validation
├── controllers/
│   ├── HomeController.php       # Landing, About, Contact
│   ├── AuthController.php       # Login, Register, OAuth, 2FA
│   ├── FeedController.php       # Feed, Explore
│   ├── PostController.php       # CRUD Posts, Media, Hashtags
│   ├── ProfileController.php    # Profiles, Avatars, Covers
│   ├── SettingsController.php   # Account, Privacy, Security
│   └── AdminController.php      # Dashboard, Users, Reports, Backups
├── models/
│   ├── User.php                 # User model with relationships
│   └── Post.php                 # Post model with interactions
├── middlewares/
│   ├── AuthMiddleware.php       # Authentication check
│   ├── AdminMiddleware.php      # Admin access check
│   └── ApiMiddleware.php        # Rate limiting & CORS
├── helpers/
│   └── functions.php            # Global helper functions
├── pages/
│   ├── landing.php              # Landing page
│   ├── offline.php              # PWA offline page
│   ├── layouts/
│   │   ├── guest.php            # Guest layout
│   │   └── app.php              # Authenticated layout
│   ├── auth/
│   │   ├── login.php            # Login page
│   │   └── register.php         # Multi-step registration
│   ├── feed/
│   │   └── index.php            # Main feed with stories
│   ├── profile/
│   │   └── show.php             # User profile
│   ├── messages/
│   │   └── index.php            # Real-time chat
│   ├── notifications/
│   │   └── index.php            # Notifications center
│   ├── communities/
│   │   └── index.php            # Communities hub
│   ├── settings/
│   │   └── account.php          # Settings panel
│   ├── admin/
│   │   └── dashboard.php        # Admin dashboard
│   └── errors/
│       ├── 404.php              # 404 page
│       └── 500.php              # 500 page
├── database/
│   └── schema.sql               # Complete database schema
├── lang/
│   ├── pt-BR/common.php         # Portuguese translations
│   └── en/common.php            # English translations
└── assets/
    ├── css/
    │   ├── app.css              # Main stylesheet
    │   ├── design-system.css    # Complete CSS design system
    │   └── responsive.css       # Responsive helpers
    ├── js/
    │   └── app.js               # Application JavaScript
    └── uploads/
        ├── avatars/
        ├── covers/
        ├── posts/
        ├── files/
        └── temp/
```

## Funcionalidades Implementadas

### Core
- [x] MVC Architecture with Router
- [x] PDO Database Layer (Singleton)
- [x] CSRF Protection
- [x] XSS Prevention
- [x] SQL Injection Protection
- [x] Rate Limiting
- [x] Form Validation
- [x] Session Management
- [x] Multi-language Support
- [x] Dark/Light Theme

### Frontend
- [x] Premium Design System (CSS Variables)
- [x] Glassmorphism & Gradients
- [x] Responsive Design (Desktop, Tablet, Mobile)
- [x] GSAP Animations
- [x] Infinite Scroll
- [x] Skeleton Loading
- [x] Toast Notifications
- [x] Modal System
- [x] Password Strength Meter
- [x] Emoji Picker
- [x] Ripple Effect
- [x] Mobile Bottom Navigation

### Auth System
- [x] Registration (Multi-step)
- [x] Login with Remember Me
- [x] Password Recovery
- [x] Email Verification
- [x] Two-Factor Authentication (2FA)
- [x] OAuth (Google, GitHub, Facebook)
- [x] Account Deletion

### Social Features
- [x] User Profiles with Cover
- [x] Follow/Unfollow System
- [x] Posts (Text, Image, Video, Poll)
- [x] 9 Reaction Types
- [x] Comments with Replies
- [x] Shares & Reposts
- [x] Bookmarks
- [x] Hashtags & Mentions
- [x] Real-time Messaging
- [x] Typing Indicator
- [x] Online Status
- [x] Notifications Center

### Community
- [x] Communities Hub
- [x] Categories & Search
- [x] Events System
- [x] Marketplace
- [x] Admin Dashboard
- [x] User Management
- [x] Content Moderation
- [x] Reports System
- [x] Activity Logs
- [x] Database Backup

### PWA
- [x] Manifest.json
- [x] Service Worker
- [x] Offline Page
- [x] Push Notifications
- [x] Background Sync

## Database Schema

30+ tables including: users, posts, comments, reactions, followers, messages, conversations, notifications, stories, reels, communities, events, products, reports, roles, permissions, hashtags, bookmarks, shares, blocks, mutes, activity_logs, user_settings, sessions, etc.

## Instalação

1. Configure o banco MySQL e importe `database/schema.sql`
2. Configure as credenciais em `config/database.php`
3. Ajuste as configurações do app em `config/app.php`
4. Configure o servidor web para apontar para a pasta `social-network/`
5. Certifique-se que `mod_rewrite` está habilitado (Apache)
6. Assegure permissões de escrita nas pastas `storage/` e `assets/uploads/`

Para servidor de desenvolvimento:
```bash
php -S localhost:8000 -t social-network/
```
