<?php
/**
 * Session Manager
 * SocialNet - Premium Social Network Platform
 */

namespace Core;

class Session
{
    private static ?Session $instance = null;
    private static bool $started = false;

    private function __construct()
    {
        $this->start();
    }

    private function __clone() {}

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Start session securely
     */
    public function start(): void
    {
        if (self::$started) return;

        if (session_status() === PHP_SESSION_NONE) {
            // Secure session settings
            ini_set('session.use_strict_mode', 1);
            ini_set('session.use_only_cookies', 1);
            ini_set('session.cookie_httponly', 1);
            ini_set('session.cookie_samesite', 'Lax');

            if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
                ini_set('session.cookie_secure', 1);
            }

            session_name('SN_SESSION');
            session_set_cookie_params([
                'lifetime' => SESSION_LIFETIME,
                'path' => '/',
                'domain' => '',
                'secure' => isset($_SERVER['HTTPS']),
                'httponly' => true,
                'samesite' => 'Lax'
            ]);

            session_start();
            self::$started = true;

            // Regenerate ID periodically to prevent session fixation
            if (!isset($_SESSION['_created'])) {
                $_SESSION['_created'] = time();
                $_SESSION['_regenerated'] = time();
            } elseif (time() - $_SESSION['_regenerated'] > 300) {
                $this->regenerate();
            }
        }
    }

    /**
     * Set session value
     */
    public function set(string $key, mixed $value): void
    {
        $_SESSION[$key] = $value;
    }

    /**
     * Get session value
     */
    public function get(string $key, mixed $default = null): mixed
    {
        return $_SESSION[$key] ?? $default;
    }

    /**
     * Check if session has key
     */
    public function has(string $key): bool
    {
        return isset($_SESSION[$key]);
    }

    /**
     * Remove session key
     */
    public function remove(string $key): void
    {
        unset($_SESSION[$key]);
    }

    /**
     * Get flash message (auto-deletes after read)
     */
    public function flash(string $key, ?string $value = null): ?string
    {
        if ($value !== null) {
            $_SESSION['_flash'][$key] = $value;
            return null;
        }

        $flash = $_SESSION['_flash'][$key] ?? null;
        unset($_SESSION['_flash'][$key]);
        return $flash;
    }

    /**
     * Set success flash message
     */
    public function success(string $message): void
    {
        $this->flash('success', $message);
    }

    /**
     * Set error flash message
     */
    public function error(string $message): void
    {
        $this->flash('error', $message);
    }

    /**
     * Set info flash message
     */
    public function info(string $message): void
    {
        $this->flash('info', $message);
    }

    /**
     * Set warning flash message
     */
    public function warning(string $message): void
    {
        $this->flash('warning', $message);
    }

    /**
     * Get all session data
     */
    public function all(): array
    {
        return $_SESSION ?? [];
    }

    /**
     * Regenerate session ID
     */
    public function regenerate(): bool
    {
        $_SESSION['_regenerated'] = time();
        return session_regenerate_id(true);
    }

    /**
     * Destroy session
     */
    public function destroy(): void
    {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }

        session_destroy();
        self::$started = false;
    }

    /**
     * Set authenticated user
     */
    public function setAuth(int $userId): void
    {
        $this->set('user_id', $userId);
        $this->set('authenticated', true);
        $this->set('login_time', time());
        $this->regenerate();
    }

    /**
     * Check if user is authenticated
     */
    public function isAuthenticated(): bool
    {
        return $this->get('authenticated') === true && $this->get('user_id') !== null;
    }

    /**
     * Get authenticated user ID
     */
    public function getUserId(): ?int
    {
        return $this->get('user_id');
    }

    /**
     * Set CSRF token
     */
    public function setCsrfToken(): string
    {
        $token = bin2hex(random_bytes(32));
        $this->set('csrf_token', $token);
        $this->set('csrf_expiry', time() + CSRF_EXPIRY);
        return $token;
    }

    /**
     * Get CSRF token
     */
    public function getCsrfToken(): string
    {
        if (!$this->has('csrf_token') || $this->get('csrf_expiry') < time()) {
            return $this->setCsrfToken();
        }
        return $this->get('csrf_token');
    }

    /**
     * Validate CSRF token
     */
    public function validateCsrfToken(string $token): bool
    {
        if (!$this->has('csrf_token') || $this->get('csrf_expiry') < time()) {
            return false;
        }
        return hash_equals($this->get('csrf_token'), $token);
    }
}
