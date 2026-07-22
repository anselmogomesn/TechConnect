<?php
/**
 * Router - MVC Routing System
 * SocialNet - Premium Social Network Platform
 */

namespace Core;

class Router
{
    private static array $routes = [];
    private static array $middleware = [];
    private static ?string $currentGroup = null;
    private static array $groupMiddleware = [];

    /**
     * Register GET route
     */
    public static function get(string $path, array|callable $handler, array $middleware = []): void
    {
        self::addRoute('GET', $path, $handler, $middleware);
    }

    /**
     * Register POST route
     */
    public static function post(string $path, array|callable $handler, array $middleware = []): void
    {
        self::addRoute('POST', $path, $handler, $middleware);
    }

    /**
     * Register PUT route
     */
    public static function put(string $path, array|callable $handler, array $middleware = []): void
    {
        self::addRoute('PUT', $path, $handler, $middleware);
    }

    /**
     * Register DELETE route
     */
    public static function delete(string $path, array|callable $handler, array $middleware = []): void
    {
        self::addRoute('DELETE', $path, $handler, $middleware);
    }

    /**
     * Register PATCH route
     */
    public static function patch(string $path, array|callable $handler, array $middleware = []): void
    {
        self::addRoute('PATCH', $path, $handler, $middleware);
    }

    /**
     * Group routes with prefix and middleware
     */
    public static function group(string $prefix, array $middleware, callable $callback): void
    {
        $previousGroup = self::$currentGroup;
        $previousMiddleware = self::$groupMiddleware;

        self::$currentGroup = $prefix;
        self::$groupMiddleware = array_merge(self::$groupMiddleware, $middleware);

        $callback();

        self::$currentGroup = $previousGroup;
        self::$groupMiddleware = $previousMiddleware;
    }

    /**
     * Add route to collection
     */
    private static function addRoute(string $method, string $path, array|callable $handler, array $middleware): void
    {
        if (self::$currentGroup) {
            $path = self::$currentGroup . $path;
        }

        $route = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler,
            'middleware' => array_merge(self::$groupMiddleware, $middleware),
            'pattern' => self::pathToRegex($path),
        ];

        self::$routes[] = $route;
    }

    /**
     * Convert path to regex pattern
     */
    private static function pathToRegex(string $path): string
    {
        // Remove trailing slash
        $path = rtrim($path, '/') ?: '/';

        // Convert {param} to named groups
        $pattern = preg_replace('/\{([a-zA-Z_]+)\}/', '(?P<$1>[^/]+)', $path);

        return '#^' . $pattern . '$#';
    }

    /**
     * Extract URL parameters from path
     */
    private static function extractParams(string $pattern, string $uri): array
    {
        if (preg_match($pattern, $uri, $matches)) {
            return array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
        }
        return [];
    }

    /**
     * Dispatch the request
     */
    public static function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Remove base path if in subdirectory
        $basePath = dirname($_SERVER['SCRIPT_NAME']);
        if ($basePath !== '/' && strpos($uri, $basePath) === 0) {
            $uri = substr($uri, strlen($basePath));
        }

        $uri = rtrim($uri, '/') ?: '/';

        // Find matching route
        foreach (self::$routes as $route) {
            if ($route['method'] !== $method) continue;

            if (preg_match($route['pattern'], $uri, $matches)) {
                $params = self::extractParams($route['pattern'], $uri);

                try {
                    // Run middleware
                    foreach ($route['middleware'] as $middleware) {
                        self::runMiddleware($middleware);
                    }

                    // Handle callable handler
                    if (is_callable($route['handler'])) {
                        echo call_user_func_array($route['handler'], [$params]);
                        return;
                    }

                    // Handle [ControllerClass, method] handler
                    [$controllerClass, $action] = $route['handler'];
                    self::runController($controllerClass, $action, $params);
                    return;

                } catch (\Exception $e) {
                    self::handleError($e);
                    return;
                }
            }
        }

        // No route matched - 404
        self::handleNotFound();
    }

    /**
     * Run controller action
     */
    private static function runController(string $controllerClass, string $action, array $params): void
    {
        if (!class_exists($controllerClass)) {
            throw new \RuntimeException("Controller {$controllerClass} not found");
        }

        $controller = new $controllerClass();

        if (!method_exists($controller, $action)) {
            throw new \RuntimeException("Action {$action} not found in {$controllerClass}");
        }

        echo call_user_func_array([$controller, $action], [$params]);
    }

    /**
     * Run middleware
     */
    private static function runMiddleware(string $middleware): void
    {
        if (!class_exists($middleware)) {
            throw new \RuntimeException("Middleware {$middleware} not found");
        }

        $instance = new $middleware();

        if (!method_exists($instance, 'handle')) {
            throw new \RuntimeException("Middleware {$middleware} must implement handle()");
        }

        $instance->handle();
    }

    /**
     * Handle 404
     */
    private static function handleNotFound(): void
    {
        http_response_code(404);

        if (Security::isAjax()) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Rota não encontrada']);
            return;
        }

        // Load 404 page
        include_once VIEW_PATH . '/errors/404.php';
    }

    /**
     * Handle errors
     */
    private static function handleError(\Exception $e): void
    {
        http_response_code(500);

        if (APP_ENV === 'development') {
            $error = [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ];
        } else {
            $error = ['message' => 'Erro interno do servidor'];
            // Log error
            error_log($e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
        }

        if (Security::isAjax()) {
            header('Content-Type: application/json');
            echo json_encode($error);
            return;
        }

        include_once VIEW_PATH . '/errors/500.php';
    }

    /**
     * Get all registered routes (for debugging)
     */
    public static function getRoutes(): array
    {
        return self::$routes;
    }
}
