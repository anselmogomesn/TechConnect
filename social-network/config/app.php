<?php
/**
 * Application Configuration
 * SocialNet - Premium Social Network Platform
 */

define('APP_NAME', 'SocialNet');
define('APP_DESCRIPTION', 'A plataforma social mais moderna e conectada do Brasil');
define('APP_URL', 'https://socialnet.com');
define('APP_VERSION', '1.0.0');
define('APP_ENV', 'production'); // development | production | testing

// Time & Location
define('TIMEZONE', 'America/Sao_Paulo');
define('DEFAULT_LANG', 'pt-BR');
define('SUPPORTED_LANGS', ['en', 'pt-BR', 'es']);

// Features
define('ALLOW_REGISTRATION', true);
define('ALLOW_UPLOADS', true);
define('ALLOW_COMMENTS', true);
define('ALLOW_MESSAGES', true);
define('ALLOW_LIVE_STREAMING', false);
define('ALLOW_MARKETPLACE', true);
define('ALLOW_COMMUNITIES', true);
define('ALLOW_EVENTS', true);
define('ALLOW_STORIES', true);
define('ALLOW_REELS', false);

// Upload Limits
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('MAX_IMAGE_SIZE', 10 * 1024 * 1024); // 10MB
define('MAX_VIDEO_SIZE', 100 * 1024 * 1024); // 100MB
define('ALLOWED_IMAGES', ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']);
define('ALLOWED_VIDEOS', ['mp4', 'webm', 'ogg', 'mov']);
define('ALLOWED_DOCS', ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip']);

// Pagination
define('POSTS_PER_PAGE', 15);
define('USERS_PER_PAGE', 20);
define('COMMENTS_PER_PAGE', 10);
define('MESSAGES_PER_PAGE', 50);
define('NOTIFICATIONS_PER_PAGE', 20);

// Security
define('PASSWORD_MIN_LENGTH', 8);
define('LOGIN_MAX_ATTEMPTS', 5);
define('LOGIN_TIMEOUT', 15); // minutes
define('SESSION_LIFETIME', 7 * 24 * 3600); // 7 days
define('REMEMBER_ME_LIFETIME', 30 * 24 * 3600); // 30 days
define('CSRF_EXPIRY', 3600); // 1 hour

// API
define('API_RATE_LIMIT', 60); // requests per minute
define('API_VERSION', 'v1');

// Cache
define('CACHE_ENABLED', true);
define('CACHE_LIFETIME', 3600); // 1 hour
define('CACHE_DRIVER', 'file'); // file | redis | memcached

// Mail
define('MAIL_DRIVER', 'smtp');
define('MAIL_HOST', 'smtp.sendgrid.net');
define('MAIL_PORT', 587);
define('MAIL_USERNAME', '');
define('MAIL_PASSWORD', '');
define('MAIL_ENCRYPTION', 'tls');
define('MAIL_FROM_ADDRESS', 'noreply@socialnet.com');
define('MAIL_FROM_NAME', 'SocialNet');

// Social Login
define('GOOGLE_CLIENT_ID', '');
define('GOOGLE_CLIENT_SECRET', '');
define('GITHUB_CLIENT_ID', '');
define('GITHUB_CLIENT_SECRET', '');
define('FACEBOOK_APP_ID', '');
define('FACEBOOK_APP_SECRET', '');

// Pusher / WebSocket
define('PUSHER_APP_ID', '');
define('PUSHER_KEY', '');
define('PUSHER_SECRET', '');
define('PUSHER_CLUSTER', 'us2');

// reCAPTCHA
define('RECAPTCHA_SITE_KEY', '');
define('RECAPTCHA_SECRET_KEY', '');
