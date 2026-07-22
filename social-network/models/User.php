<?php
/**
 * User Model
 * SocialNet - Premium Social Network Platform
 */

namespace App\Models;

use Core\Model;

class User extends Model
{
    protected static string $table = 'users';
    protected static string $primaryKey = 'id';
    protected static bool $usesUuid = true;

    protected array $fillable = [
        'first_name', 'last_name', 'username', 'email', 'password',
        'birth_date', 'gender', 'marital_status', 'biography', 'website',
        'location', 'city', 'country', 'profession', 'company', 'education',
        'avatar', 'cover', 'account_type', 'theme', 'language',
    ];

    protected array $casts = [
        'is_verified' => 'boolean',
        'is_admin' => 'boolean',
        'is_active' => 'boolean',
        'is_banned' => 'boolean',
    ];

    /**
     * Get full name
     */
    public function getFullName(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Get avatar URL
     */
    public function getAvatarUrl(): string
    {
        if ($this->avatar && $this->avatar !== 'default-avatar.png') {
            return '/assets/uploads/avatars/' . $this->avatar;
        }
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->getFullName()) . '&background=6C5CE7&color=fff&size=200';
    }

    /**
     * Get cover URL
     */
    public function getCoverUrl(): string
    {
        if ($this->cover && $this->cover !== 'default-cover.jpg') {
            return '/assets/uploads/covers/' . $this->cover;
        }
        return 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=320&fit=crop';
    }

    /**
     * Get profile URL
     */
    public function getProfileUrl(): string
    {
        return '/@' . $this->username;
    }

    /**
     * Get followers count
     */
    public function getFollowersCount(): int
    {
        $db = \Core\Database::getInstance();
        return (int)$db->fetchColumn(
            "SELECT COUNT(*) FROM followers WHERE following_id = :id AND status = 'accepted'",
            ['id' => $this->id]
        );
    }

    /**
     * Get following count
     */
    public function getFollowingCount(): int
    {
        $db = \Core\Database::getInstance();
        return (int)$db->fetchColumn(
            "SELECT COUNT(*) FROM followers WHERE follower_id = :id AND status = 'accepted'",
            ['id' => $this->id]
        );
    }

    /**
     * Get posts count
     */
    public function getPostsCount(): int
    {
        $db = \Core\Database::getInstance();
        return (int)$db->fetchColumn(
            "SELECT COUNT(*) FROM posts WHERE user_id = :id AND is_active = TRUE",
            ['id' => $this->id]
        );
    }

    /**
     * Check if user follows another user
     */
    public function isFollowing(int $userId): bool
    {
        $db = \Core\Database::getInstance();
        return (bool)$db->fetchColumn(
            "SELECT COUNT(*) FROM followers WHERE follower_id = :follower AND following_id = :following AND status = 'accepted'",
            ['follower' => $this->id, 'following' => $userId]
        );
    }

    /**
     * Follow a user
     */
    public function follow(int $userId): bool
    {
        $db = \Core\Database::getInstance();
        try {
            $db->insert('followers', [
                'follower_id' => $this->id,
                'following_id' => $userId,
            ]);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Unfollow a user
     */
    public function unfollow(int $userId): bool
    {
        $db = \Core\Database::getInstance();
        return $db->delete('followers',
            'follower_id = :follower AND following_id = :following',
            ['follower' => $this->id, 'following' => $userId]
        ) > 0;
    }

    /**
     * Get user feed posts
     */
    public function getFeed(int $page = 1, int $perPage = 15): array
    {
        $db = \Core\Database::getInstance();
        $offset = ($page - 1) * $perPage;

        return $db->fetchAll(
            "SELECT p.*, u.first_name, u.last_name, u.username, u.avatar, u.is_verified
             FROM posts p
             JOIN users u ON p.user_id = u.id
             WHERE p.user_id IN (
                 SELECT following_id FROM followers WHERE follower_id = :user_id AND status = 'accepted'
                 UNION SELECT :user_id2
             )
             AND p.is_active = TRUE AND p.visibility = 'public' AND p.is_draft = FALSE
             ORDER BY p.created_at DESC
             LIMIT :limit OFFSET :offset",
            [
                'user_id' => $this->id,
                'user_id2' => $this->id,
                'limit' => $perPage,
                'offset' => $offset,
            ]
        );
    }

    /**
     * Search users
     */
    public static function search(string $query, int $limit = 10): array
    {
        $db = \Core\Database::getInstance();
        return $db->fetchAll(
            "SELECT id, first_name, last_name, username, avatar, is_verified
             FROM users
             WHERE (first_name LIKE :query OR last_name LIKE :query2 OR username LIKE :query3)
             AND is_active = TRUE AND is_banned = FALSE
             LIMIT :limit",
            [
                'query' => "%{$query}%",
                'query2' => "%{$query}%",
                'query3' => "%{$query}%",
                'limit' => $limit,
            ]
        );
    }
}
