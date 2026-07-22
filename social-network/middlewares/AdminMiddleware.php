<?php
/**
 * Admin Middleware
 * SocialNet - Premium Social Network Platform
 */

namespace App\Middlewares;

use Core\Session;
use Core\Security;
use Core\Database;

class AdminMiddleware
{
    public function handle(): void
    {
        $session = Session::getInstance();

        if (!$session->isAuthenticated()) {
            $this->deny();
            return;
        }

        $db = Database::getInstance();
        $user = $db->fetch(
            "SELECT is_admin FROM users WHERE id = ? AND is_active = TRUE AND is_banned = FALSE",
            [$session->getUserId()]
        );

        if (!$user || !$user->is_admin) {
            $this->deny();
        }
    }

    private function deny(): void
    {
        if (Security::isAjax()) {
            http_response_code(403);
            header('Content-Type: application/json');
            echo json_encode(['status' => 'error', 'message' => 'Acesso não autorizado.']);
            exit;
        }

        header('Location: /');
        exit;
    }
}
