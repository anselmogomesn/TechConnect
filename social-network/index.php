<?php
/**
 * SocialNet - Premium Social Network Platform
 * Entry Point
 */

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', APP_ENV === 'development' ? '1' : '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/storage/logs/error.log');

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// Base paths
define('BASE_PATH', __DIR__);
define('CORE_PATH', BASE_PATH . '/core');
define('CONFIG_PATH', BASE_PATH . '/config');
define('MODELS_PATH', BASE_PATH . '/models');
define('CONTROLLERS_PATH', BASE_PATH . '/controllers');
define('VIEW_PATH', BASE_PATH . '/pages');
define('COMPONENTS_PATH', BASE_PATH . '/components');
define('STORAGE_PATH', BASE_PATH . '/storage');
define('UPLOAD_PATH', BASE_PATH . '/assets/uploads');
define('LANG_PATH', BASE_PATH . '/lang');

// Composer autoload (if exists)
$composerAutoload = BASE_PATH . '/vendor/autoload.php';
if (file_exists($composerAutoload)) {
    require_once $composerAutoload;
}

// Load configuration
require_once CONFIG_PATH . '/app.php';
require_once CONFIG_PATH . '/database.php';

// Custom autoloader
spl_autoload_register(function ($class) {
    // Core classes (namespace Core\)
    if (str_starts_with($class, 'Core\\')) {
        $file = CORE_PATH . '/' . str_replace('Core\\', '', $class) . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }

    // Models
    if (str_starts_with($class, 'App\\Models\\')) {
        $file = MODELS_PATH . '/' . str_replace('App\\Models\\', '', $class) . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }

    // Controllers
    if (str_starts_with($class, 'App\\Controllers\\')) {
        $file = CONTROLLERS_PATH . '/' . str_replace('App\\Controllers\\', '', $class) . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }

    // Middlewares
    if (str_starts_with($class, 'App\\Middlewares\\')) {
        $file = BASE_PATH . '/middlewares/' . str_replace('App\\Middlewares\\', '', $class) . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// Initialize session
\Core\Session::getInstance();

// Load route definitions
require_once BASE_PATH . '/routes.php';

// Dispatch request
\Core\Router::dispatch();
