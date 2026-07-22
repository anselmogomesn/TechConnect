<?php
/**
 * API Middleware - Rate Limiting & Headers
 * SocialNet - Premium Social Network Platform
 */

namespace App\Middlewares;

use Core\Security;

class ApiMiddleware
{
    public function handle(): void
    {
        // CORS headers
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
        header('Content-Type: application/json; charset=utf-8');

        // Handle preflight
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        // Rate limiting
        $ip = Security::getClientIp();
        $key = 'api_' . $ip;
        $maxAttempts = API_RATE_LIMIT;

        if (!Security::checkRateLimit($key, $maxAttempts, 60)) {
            http_response_code(429);
            echo json_encode([
                'status' => 'error',
                'message' => 'Muitas requisições. Tente novamente em instantes.'
            ]);
            exit;
        }

        // API version check
        // TODO: Add API key validation for third-party apps
    }
}
