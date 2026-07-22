<?php
/**
 * Route Definitions
 * SocialNet - Premium Social Network Platform
 */

use Core\Router;

// ============================================================
// Public Routes
// ============================================================

// Offline page (PWA)
Router::get('/offline', function() {
    include_once VIEW_PATH . '/offline.php';
});

// Landing / Home
Router::get('/', ['App\Controllers\HomeController', 'index']);
Router::get('/about', ['App\Controllers\HomeController', 'about']);
Router::get('/contact', ['App\Controllers\HomeController', 'contact']);
Router::post('/contact', ['App\Controllers\HomeController', 'sendContact']);

// Authentication
Router::get('/login', ['App\Controllers\AuthController', 'loginForm']);
Router::post('/login', ['App\Controllers\AuthController', 'login']);
Router::get('/register', ['App\Controllers\AuthController', 'registerForm']);
Router::post('/register', ['App\Controllers\AuthController', 'register']);
Router::get('/forgot-password', ['App\Controllers\AuthController', 'forgotPasswordForm']);
Router::post('/forgot-password', ['App\Controllers\AuthController', 'forgotPassword']);
Router::get('/reset-password/{token}', ['App\Controllers\AuthController', 'resetPasswordForm']);
Router::post('/reset-password', ['App\Controllers\AuthController', 'resetPassword']);
Router::get('/verify-email/{token}', ['App\Controllers\AuthController', 'verifyEmail']);

// OAuth
Router::get('/auth/google', ['App\Controllers\AuthController', 'googleLogin']);
Router::get('/auth/google/callback', ['App\Controllers\AuthController', 'googleCallback']);
Router::get('/auth/github', ['App\Controllers\AuthController', 'githubLogin']);
Router::get('/auth/github/callback', ['App\Controllers\AuthController', 'githubCallback']);
Router::get('/auth/facebook', ['App\Controllers\AuthController', 'facebookLogin']);
Router::get('/auth/facebook/callback', ['App\Controllers\AuthController', 'facebookCallback']);

// 2FA
Router::get('/two-factor', ['App\Controllers\AuthController', 'twoFactorForm']);
Router::post('/two-factor', ['App\Controllers\AuthController', 'twoFactorVerify']);

// ============================================================
// Authenticated Routes
// ============================================================

Router::group('', ['App\Middlewares\AuthMiddleware'], function () {
    // Logout
    Router::post('/logout', ['App\Controllers\AuthController', 'logout']);

    // Feed
    Router::get('/feed', ['App\Controllers\FeedController', 'index']);
    Router::get('/feed/popular', ['App\Controllers\FeedController', 'popular']);
    Router::get('/feed/following', ['App\Controllers\FeedController', 'following']);
    Router::get('/feed/explore', ['App\Controllers\FeedController', 'explore']);

    // Posts
    Router::get('/post/create', ['App\Controllers\PostController', 'create']);
    Router::post('/posts', ['App\Controllers\PostController', 'store']);
    Router::get('/post/{uuid}', ['App\Controllers\PostController', 'show']);
    Router::post('/post/{uuid}/edit', ['App\Controllers\PostController', 'update']);
    Router::delete('/post/{uuid}', ['App\Controllers\PostController', 'destroy']);
    Router::post('/post/{uuid}/pin', ['App\Controllers\PostController', 'togglePin']);
    Router::post('/post/{uuid}/report', ['App\Controllers\PostController', 'report']);

    // Post Media
    Router::post('/upload/image', ['App\Controllers\UploadController', 'image']);
    Router::post('/upload/video', ['App\Controllers\UploadController', 'video']);
    Router::post('/upload/file', ['App\Controllers\UploadController', 'file']);

    // Interactions
    Router::post('/post/{type}/{id}/react', ['App\Controllers\ReactionController', 'toggle']);
    Router::get('/post/{uuid}/reactions', ['App\Controllers\ReactionController', 'list']);

    // Comments
    Router::get('/post/{uuid}/comments', ['App\Controllers\CommentController', 'index']);
    Router::post('/post/{uuid}/comments', ['App\Controllers\CommentController', 'store']);
    Router::post('/comment/{id}/reply', ['App\Controllers\CommentController', 'reply']);
    Router::post('/comment/{id}/edit', ['App\Controllers\CommentController', 'update']);
    Router::delete('/comment/{id}', ['App\Controllers\CommentController', 'destroy']);
    Router::post('/comment/{id}/react', ['App\Controllers\CommentController', 'react']);

    // Bookmarks
    Router::post('/post/{uuid}/bookmark', ['App\Controllers\BookmarkController', 'toggle']);
    Router::get('/bookmarks', ['App\Controllers\BookmarkController', 'index']);

    // Shares
    Router::post('/post/{uuid}/share', ['App\Controllers\ShareController', 'store']);

    // User Profile
    Router::get('/@{username}', ['App\Controllers\ProfileController', 'show']);
    Router::get('/settings/profile', ['App\Controllers\ProfileController', 'edit']);
    Router::post('/settings/profile', ['App\Controllers\ProfileController', 'update']);
    Router::post('/settings/avatar', ['App\Controllers\ProfileController', 'updateAvatar']);
    Router::post('/settings/cover', ['App\Controllers\ProfileController', 'updateCover']);
    Router::get('/@{username}/followers', ['App\Controllers\ProfileController', 'followers']);
    Router::get('/@{username}/following', ['App\Controllers\ProfileController', 'following']);

    // Follow
    Router::post('/user/{id}/follow', ['App\Controllers\FollowController', 'toggle']);

    // Messaging
    Router::get('/messages', ['App\Controllers\MessageController', 'index']);
    Router::get('/messages/{uuid}', ['App\Controllers\MessageController', 'conversation']);
    Router::post('/messages', ['App\Controllers\MessageController', 'send']);
    Router::post('/messages/{uuid}/read', ['App\Controllers\MessageController', 'markRead']);
    Router::delete('/messages/{id}', ['App\Controllers\MessageController', 'delete']);

    // Notifications
    Router::get('/notifications', ['App\Controllers\NotificationController', 'index']);
    Router::post('/notifications/read', ['App\Controllers\NotificationController', 'markAllRead']);
    Router::post('/notifications/{id}/read', ['App\Controllers\NotificationController', 'markRead']);

    // Search
    Router::get('/search', ['App\Controllers\SearchController', 'index']);
    Router::get('/search/users', ['App\Controllers\SearchController', 'users']);
    Router::get('/search/posts', ['App\Controllers\SearchController', 'posts']);
    Router::get('/search/hashtags', ['App\Controllers\SearchController', 'hashtags']);

    // Hashtags
    Router::get('/hashtag/{tag}', ['App\Controllers\HashtagController', 'show']);
    Router::get('/trending', ['App\Controllers\HashtagController', 'trending']);

    // Communities
    Router::get('/communities', ['App\Controllers\CommunityController', 'index']);
    Router::get('/community/create', ['App\Controllers\CommunityController', 'create']);
    Router::post('/communities', ['App\Controllers\CommunityController', 'store']);
    Router::get('/community/{slug}', ['App\Controllers\CommunityController', 'show']);
    Router::post('/community/{slug}/join', ['App\Controllers\CommunityController', 'join']);
    Router::post('/community/{slug}/leave', ['App\Controllers\CommunityController', 'leave']);

    // Marketplace
    Router::get('/marketplace', ['App\Controllers\MarketplaceController', 'index']);
    Router::get('/marketplace/create', ['App\Controllers\MarketplaceController', 'create']);
    Router::post('/marketplace', ['App\Controllers\MarketplaceController', 'store']);
    Router::get('/marketplace/{uuid}', ['App\Controllers\MarketplaceController', 'show']);

    // Events
    Router::get('/events', ['App\Controllers\EventController', 'index']);
    Router::get('/events/create', ['App\Controllers\EventController', 'create']);
    Router::post('/events', ['App\Controllers\EventController', 'store']);
    Router::get('/events/{uuid}', ['App\Controllers\EventController', 'show']);
    Router::post('/events/{uuid}/attend', ['App\Controllers\EventController', 'attend']);

    // Stories
    Router::post('/stories', ['App\Controllers\StoryController', 'store']);
    Router::get('/stories/{id}', ['App\Controllers\StoryController', 'show']);
    Router::delete('/stories/{id}', ['App\Controllers\StoryController', 'destroy']);

    // Settings
    Router::get('/settings', ['App\Controllers\SettingsController', 'index']);
    Router::get('/settings/account', ['App\Controllers\SettingsController', 'account']);
    Router::post('/settings/account', ['App\Controllers\SettingsController', 'updateAccount']);
    Router::get('/settings/privacy', ['App\Controllers\SettingsController', 'privacy']);
    Router::post('/settings/privacy', ['App\Controllers\SettingsController', 'updatePrivacy']);
    Router::get('/settings/security', ['App\Controllers\SettingsController', 'security']);
    Router::post('/settings/security', ['App\Controllers\SettingsController', 'updateSecurity']);
    Router::post('/settings/security/2fa', ['App\Controllers\SettingsController', 'toggle2FA']);
    Router::get('/settings/notifications', ['App\Controllers\SettingsController', 'notifications']);
    Router::post('/settings/notifications', ['App\Controllers\SettingsController', 'updateNotifications']);
    Router::get('/settings/sessions', ['App\Controllers\SettingsController', 'sessions']);
    Router::delete('/settings/sessions/{id}', ['App\Controllers\SettingsController', 'removeSession']);
    Router::get('/settings/blocked', ['App\Controllers\SettingsController', 'blockedUsers']);
    Router::post('/settings/blocked/{id}', ['App\Controllers\SettingsController', 'unblock']);
    Router::get('/settings/data', ['App\Controllers\SettingsController', 'downloadData']);
    Router::post('/settings/delete-account', ['App\Controllers\SettingsController', 'deleteAccount']);
});

// ============================================================
// Admin Routes
// ============================================================

Router::group('/admin', ['App\Middlewares\AuthMiddleware', 'App\Middlewares\AdminMiddleware'], function () {
    Router::get('/', ['App\Controllers\AdminController', 'dashboard']);
    Router::get('/users', ['App\Controllers\AdminController', 'users']);
    Router::post('/users/{id}/ban', ['App\Controllers\AdminController', 'banUser']);
    Router::post('/users/{id}/unban', ['App\Controllers\AdminController', 'unbanUser']);
    Router::post('/users/{id}/verify', ['App\Controllers\AdminController', 'verifyUser']);
    Router::get('/posts', ['App\Controllers\AdminController', 'posts']);
    Router::post('/posts/{id}/delete', ['App\Controllers\AdminController', 'deletePost']);
    Router::get('/reports', ['App\Controllers\AdminController', 'reports']);
    Router::post('/reports/{id}/resolve', ['App\Controllers\AdminController', 'resolveReport']);
    Router::get('/analytics', ['App\Controllers\AdminController', 'analytics']);
    Router::get('/logs', ['App\Controllers\AdminController', 'logs']);
    Router::get('/settings', ['App\Controllers\AdminController', 'settings']);
    Router::post('/settings', ['App\Controllers\AdminController', 'updateSettings']);
    Router::get('/backup', ['App\Controllers\AdminController', 'backup']);
    Router::post('/backup/create', ['App\Controllers\AdminController', 'createBackup']);
});

// ============================================================
// API Routes
// ============================================================

Router::group('/api/v1', ['App\Middlewares\ApiMiddleware'], function () {
    // Auth
    Router::post('/auth/login', ['App\Controllers\Api\AuthController', 'login']);
    Router::post('/auth/register', ['App\Controllers\Api\AuthController', 'register']);

    // Feed
    Router::get('/feed', ['App\Controllers\Api\FeedController', 'index']);

    // Users
    Router::get('/users/{id}', ['App\Controllers\Api\UserController', 'show']);
    Router::get('/users/{id}/posts', ['App\Controllers\Api\UserController', 'posts']);

    // Posts
    Router::get('/posts', ['App\Controllers\Api\PostController', 'index']);
    Router::get('/posts/{uuid}', ['App\Controllers\Api\PostController', 'show']);
    Router::post('/posts', ['App\Controllers\Api\PostController', 'store']);

    // Notifications
    Router::get('/notifications', ['App\Controllers\Api\NotificationController', 'index']);

    // Search
    Router::get('/search', ['App\Controllers\Api\SearchController', 'index']);
});
