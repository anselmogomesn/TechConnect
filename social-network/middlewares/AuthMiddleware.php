<?php
/**
 * Authentication Middleware
 * SocialNet - Premium Social Network Platform
 */

namespace App\Middlewares;

use Core\Session;
use Core\Security;

class AuthMiddleware
{
    public function handle(): void
    {
        $session = Session::getInstance();

        if (!$session->isAuthenticated()) {
            $session->set('redirect_after_login', $_SERVER['REQUEST_URI']);

            if (Security::isAjax()) {
                http_response_code(401);
                header('Content-Type: application/json');
                echo json_encode(['status' => 'error', 'message' => 'Autenticação necessária.']);
                exit;
            }

            header('Location: /login');
            exit;
        }
    }
}
