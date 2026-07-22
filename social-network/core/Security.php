<?php
/**
 * Security Handler - CSRF, XSS, Sanitization, Encryption
 * SocialNet - Premium Social Network Platform
 */

namespace Core;

class Security
{
    /**
     * Generate CSRF token field
     */
    public static function csrfField(): string
    {
        $token = Session::getInstance()->getCsrfToken();
        return '<input type="hidden" name="_csrf_token" value="' . $token . '">';
    }

    /**
     * Validate CSRF token from request
     */
    public static function validateCsrf(): bool
    {
        $token = $_POST['_csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        return Session::getInstance()->validateCsrfToken($token);
    }

    /**
     * Sanitize output against XSS
     */
    public static function escape(mixed $data, string $encoding = 'UTF-8'): string
    {
        if (is_array($data)) {
            return array_map([self::class, 'escape'], $data);
        }
        return htmlspecialchars((string)$data, ENT_QUOTES | ENT_HTML5, $encoding, false);
    }

    /**
     * Sanitize input data
     */
    public static function sanitize(mixed $data): mixed
    {
        if (is_array($data)) {
            return array_map([self::class, 'sanitize'], $data);
        }

        $data = trim((string)$data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data, ENT_QUOTES | ENT_HTML5, 'UTF-8', false);

        return $data;
    }

    /**
     * Sanitize for database input (strip tags, trim)
     */
    public static function clean(mixed $input): mixed
    {
        if (is_array($input)) {
            return array_map([self::class, 'clean'], $input);
        }
        return trim(strip_tags((string)$input));
    }

    /**
     * Validate email
     */
    public static function validateEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Validate URL
     */
    public static function validateUrl(string $url): bool
    {
        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }

    /**
     * Validate username (alphanumeric, underscores, dots, 3-30 chars)
     */
    public static function validateUsername(string $username): bool
    {
        return preg_match('/^[a-zA-Z0-9_.]{3,30}$/', $username) === 1;
    }

    /**
     * Validate password strength
     * Returns array with 'valid' bool and 'message' string
     */
    public static function validatePassword(string $password): array
    {
        $errors = [];

        if (strlen($password) < PASSWORD_MIN_LENGTH) {
            $errors[] = 'A senha deve ter no mínimo ' . PASSWORD_MIN_LENGTH . ' caracteres.';
        }

        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = 'A senha deve conter pelo menos uma letra maiúscula.';
        }

        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = 'A senha deve conter pelo menos uma letra minúscula.';
        }

        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = 'A senha deve conter pelo menos um número.';
        }

        if (!preg_match('/[^a-zA-Z0-9]/', $password)) {
            $errors[] = 'A senha deve conter pelo menos um caractere especial.';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'score' => self::passwordStrengthScore($password)
        ];
    }

    /**
     * Calculate password strength score (0-100)
     */
    public static function passwordStrengthScore(string $password): int
    {
        $score = 0;

        // Length scoring
        $len = strlen($password);
        if ($len >= 8) $score += 10;
        if ($len >= 10) $score += 10;
        if ($len >= 12) $score += 10;
        if ($len >= 16) $score += 10;

        // Character variety
        if (preg_match('/[a-z]/', $password)) $score += 10;
        if (preg_match('/[A-Z]/', $password)) $score += 10;
        if (preg_match('/[0-9]/', $password)) $score += 10;
        if (preg_match('/[^a-zA-Z0-9]/', $password)) $score += 15;

        // Pattern bonuses
        if (preg_match('/[a-z].*[A-Z]|[A-Z].*[a-z]/', $password)) $score += 5;
        if (preg_match('/[0-9].*[^a-zA-Z0-9]|[^a-zA-Z0-9].*[0-9]/', $password)) $score += 5;
        if (preg_match('/.{16,}/', $password) && preg_match('/[^a-zA-Z0-9].*[^a-zA-Z0-9]/', $password)) $score += 5;

        return min(100, $score);
    }

    /**
     * Hash password with bcrypt
     */
    public static function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    /**
     * Verify password against hash
     */
    public static function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    /**
     * Generate cryptographically secure random token
     */
    public static function generateToken(int $length = 64): string
    {
        return bin2hex(random_bytes($length / 2));
    }

    /**
     * Generate UUID v4
     */
    public static function generateUuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    /**
     * Encrypt data
     */
    public static function encrypt(string $data, string $key): string
    {
        $iv = random_bytes(16);
        $encrypted = openssl_encrypt($data, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
        return base64_encode($iv . $encrypted);
    }

    /**
     * Decrypt data
     */
    public static function decrypt(string $data, string $key): string
    {
        $data = base64_decode($data);
        $iv = substr($data, 0, 16);
        $encrypted = substr($data, 16);
        return openssl_decrypt($encrypted, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
    }

    /**
     * Check if request is AJAX
     */
    public static function isAjax(): bool
    {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH'])
            && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }

    /**
     * Get client IP
     */
    public static function getClientIp(): string
    {
        $headers = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];

        foreach ($headers as $header) {
            if (isset($_SERVER[$header])) {
                $ips = explode(',', $_SERVER[$header]);
                $ip = trim($ips[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }

        return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    }

    /**
     * Rate limit check
     */
    public static function checkRateLimit(string $key, int $maxAttempts = 60, int $period = 60): bool
    {
        $cacheFile = STORAGE_PATH . '/cache/ratelimit_' . md5($key) . '.cache';

        $data = [];
        if (file_exists($cacheFile)) {
            $data = json_decode(file_get_contents($cacheFile), true) ?? [];
            // Clean expired entries
            $data = array_filter($data, fn($time) => $time > time() - $period);
        }

        if (count($data) >= $maxAttempts) {
            return false; // Rate limit exceeded
        }

        $data[] = time();
        file_put_contents($cacheFile, json_encode($data));
        return true;
    }

    /**
     * Validate file upload
     */
    public static function validateFile(array $file, array $allowedTypes = ['jpg', 'jpeg', 'png'], int $maxSize = 5242880): array
    {
        $errors = [];

        if ($file['error'] !== UPLOAD_ERR_OK) {
            return ['valid' => false, 'errors' => ['Erro no upload do arquivo.']];
        }

        if ($file['size'] > $maxSize) {
            return ['valid' => false, 'errors' => ['Arquivo muito grande.']];
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedTypes)) {
            return ['valid' => false, 'errors' => ['Tipo de arquivo não permitido.']];
        }

        // Verify mime type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        $validMimes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
        ];

        if (isset($validMimes[$ext]) && $mime !== $validMimes[$ext]) {
            return ['valid' => false, 'errors' => ['Arquivo corrompido ou inválido.']];
        }

        return ['valid' => true, 'errors' => []];
    }
}
