<?php
/**
 * Global Helper Functions
 * SocialNet - Premium Social Network Platform
 */

if (!function_exists('__')) {
    /**
     * Translate a string
     */
    function __(string $key, array $params = []): string
    {
        static $translations = [];

        $langCode = $_SESSION['language'] ?? DEFAULT_LANG;
        $file = LANG_PATH . '/' . $langCode . '/common.php';

        if (empty($translations) && file_exists($file)) {
            $translations = require $file;
        }

        $text = $translations[$key] ?? $key;

        if (!empty($params)) {
            foreach ($params as $k => $v) {
                $text = str_replace('{' . $k . '}', $v, $text);
            }
        }

        return $text;
    }
}

if (!function_exists('timeAgo')) {
    /**
     * Convert timestamp to human-readable time ago
     */
    function timeAgo(string $timestamp): string
    {
        $time = strtotime($timestamp);
        $diff = time() - $time;

        if ($diff < 60) return __('time_just_now');
        if ($diff < 3600) return __('time_minutes_ago', ['minutes' => floor($diff / 60)]);
        if ($diff < 86400) return __('time_hours_ago', ['hours' => floor($diff / 3600)]);
        if ($diff < 172800) return __('time_yesterday');
        if ($diff < 2592000) return __('time_days_ago', ['days' => floor($diff / 86400)]);

        return date('d/m/Y', $time);
    }
}

if (!function_exists('asset')) {
    /**
     * Get asset URL
     */
    function asset(string $path): string
    {
        return '/assets/' . ltrim($path, '/');
    }
}

if (!function_exists('uploadUrl')) {
    /**
     * Get upload URL
     */
    function uploadUrl(string $path): string
    {
        return '/assets/uploads/' . ltrim($path, '/');
    }
}

if (!function_exists('truncate')) {
    /**
     * Truncate text
     */
    function truncate(string $text, int $length = 100, string $suffix = '...'): string
    {
        if (mb_strlen($text) <= $length) return $text;
        return mb_substr($text, 0, $length) . $suffix;
    }
}

if (!function_exists('slugify')) {
    /**
     * Create URL-friendly slug
     */
    function slugify(string $text): string
    {
        $text = preg_replace('/[^\p{L}\p{N}\s-]/u', '', $text);
        $text = preg_replace('/[\s-]+/', '-', $text);
        $text = trim($text, '-');
        return mb_strtolower($text);
    }
}

if (!function_exists('formatNumber')) {
    /**
     * Format number (1K, 1.5M, etc)
     */
    function formatNumber(int $number): string
    {
        if ($number >= 1000000) {
            return number_format($number / 1000000, 1) . 'M';
        }
        if ($number >= 1000) {
            return number_format($number / 1000, 1) . 'K';
        }
        return (string)$number;
    }
}

if (!function_exists('isAjax')) {
    /**
     * Check if request is AJAX
     */
    function isAjax(): bool
    {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH'])
            && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }
}

if (!function_exists('getAvatarUrl')) {
    /**
     * Get user avatar URL
     */
    function getAvatarUrl(?object $user): string
    {
        if (!$user) return 'https://ui-avatars.com/api/?name=U&background=6C5CE7&color=fff&size=200';

        if ($user->avatar && $user->avatar !== 'default-avatar.png') {
            return '/assets/uploads/avatars/' . $user->avatar;
        }

        $name = urlencode(($user->first_name ?? 'U') . '+' . ($user->last_name ?? 'S'));
        return "https://ui-avatars.com/api/?name={$name}&background=6C5CE7&color=fff&size=200";
    }
}

if (!function_exists('getCoverUrl')) {
    /**
     * Get user cover URL
     */
    function getCoverUrl(?object $user): string
    {
        if ($user && $user->cover && $user->cover !== 'default-cover.jpg') {
            return '/assets/uploads/covers/' . $user->cover;
        }
        return 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=320&fit=crop';
    }
}

if (!function_exists('generateMetaTags')) {
    /**
     * Generate Open Graph / Meta tags
     */
    function generateMetaTags(array $data = []): string
    {
        $title = $data['title'] ?? APP_NAME;
        $description = $data['description'] ?? APP_DESCRIPTION;
        $image = $data['image'] ?? '/assets/images/og-image.png';
        $url = $data['url'] ?? APP_URL;

        return <<<HTML
        <meta property="og:title" content="{$title}">
        <meta property="og:description" content="{$description}">
        <meta property="og:image" content="{$image}">
        <meta property="og:url" content="{$url}">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{$title}">
        <meta name="twitter:description" content="{$description}">
        <meta name="twitter:image" content="{$image}">
HTML;
    }
}

if (!function_exists('dd')) {
    /**
     * Dump and die (debugging)
     */
    function dd(...$vars): void
    {
        foreach ($vars as $var) {
            echo '<pre style="background:#1a1a2e;color:#fff;padding:16px;border-radius:8px;margin:8px;font-size:13px;overflow:auto">';
            print_r($var);
            echo '</pre>';
        }
        die(1);
    }
}
