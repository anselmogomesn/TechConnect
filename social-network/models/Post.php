<?php
/**
 * Post Model
 * SocialNet - Premium Social Network Platform
 */

namespace App\Models;

use Core\Model;
use Core\Database;

class Post extends Model
{
    protected static string $table = 'posts';
    protected static string $primaryKey = 'id';
    protected static bool $usesUuid = true;

    protected array $fillable = [
        'user_id', 'content', 'type', 'visibility', 'is_pinned', 'is_draft',
        'is_scheduled', 'scheduled_at', 'location', 'allow_comments', 'allow_shares',
    ];

    protected array $casts = [
        'is_pinned' => 'boolean',
        'is_draft' => 'boolean',
        'is_scheduled' => 'boolean',
        'allow_comments' => 'boolean',
        'allow_shares' => 'boolean',
        'is_edited' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get post author
     */
    public function author(): ?User
    {
        return User::find($this->user_id);
    }

    /**
     * Get post media
     */
    public function media(): array
    {
        $db = Database::getInstance();
        return $db->fetchAll(
            "SELECT * FROM post_media WHERE post_id = :id ORDER BY order_index ASC",
            ['id' => $this->id]
        );
    }

    /**
     * Get post comments
     */
    public function comments(int $page = 1, int $perPage = 10): array
    {
        $db = Database::getInstance();
        $offset = ($page - 1) * $perPage;

        return $db->fetchAll(
            "SELECT c.*, u.first_name, u.last_name, u.username, u.avatar, u.is_verified
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.post_id = :post_id AND c.parent_id IS NULL AND c.is_active = TRUE
             ORDER BY c.created_at DESC
             LIMIT :limit OFFSET :offset",
            ['post_id' => $this->id, 'limit' => $perPage, 'offset' => $offset]
        );
    }

    /**
     * Get reactions grouped by type
     */
    public function getReactions(): array
    {
        $db = Database::getInstance();
        return $db->fetchAll(
            "SELECT type, COUNT(*) as count FROM reactions WHERE post_id = :id GROUP BY type",
            ['id' => $this->id]
        );
    }

    /**
     * Check if user reacted
     */
    public function hasReacted(int $userId): ?string
    {
        $db = Database::getInstance();
        return $db->fetchColumn(
            "SELECT type FROM reactions WHERE user_id = :user AND post_id = :post",
            ['user' => $userId, 'post' => $this->id]
        ) ?: null;
    }

    /**
     * Toggle reaction
     */
    public function toggleReaction(int $userId, string $type): array
    {
        $db = Database::getInstance();

        $existing = $db->fetch(
            "SELECT id, type FROM reactions WHERE user_id = :user AND post_id = :post",
            ['user' => $userId, 'post' => $this->id]
        );

        if ($existing) {
            if ($existing->type === $type) {
                $db->delete('reactions', 'id = :id', ['id' => $existing->id]);
                $db->query("UPDATE posts SET reaction_count = reaction_count - 1 WHERE id = :id", ['id' => $this->id]);
                return ['active' => false, 'type' => null];
            }

            $db->update('reactions', ['type' => $type], 'id = :id', ['id' => $existing->id]);
            return ['active' => true, 'type' => $type];
        }

        $db->insert('reactions', [
            'user_id' => $userId,
            'post_id' => $this->id,
            'type' => $type,
        ]);
        $db->query("UPDATE posts SET reaction_count = reaction_count + 1 WHERE id = :id", ['id' => $this->id]);

        return ['active' => true, 'type' => $type];
    }

    /**
     * Get related hashtags
     */
    public function hashtags(): array
    {
        $db = Database::getInstance();
        return $db->fetchAll(
            "SELECT h.tag, h.slug FROM hashtags h
             JOIN post_hashtags ph ON h.id = ph.hashtag_id
             WHERE ph.post_id = :id",
            ['id' => $this->id]
        );
    }

    /**
     * Check if post is bookmarked by user
     */
    public function isBookmarkedBy(int $userId): bool
    {
        $db = Database::getInstance();
        return (bool)$db->fetchColumn(
            "SELECT COUNT(*) FROM bookmarks WHERE user_id = :user AND post_id = :post",
            ['user' => $userId, 'post' => $this->id]
        );
    }

    /**
     * Toggle bookmark
     */
    public function toggleBookmark(int $userId): bool
    {
        $db = Database::getInstance();

        if ($this->isBookmarkedBy($userId)) {
            $db->delete('bookmarks', 'user_id = :user AND post_id = :post', ['user' => $userId, 'post' => $this->id]);
            $db->query("UPDATE posts SET save_count = save_count - 1 WHERE id = :id", ['id' => $this->id]);
            return false;
        }

        $db->insert('bookmarks', ['user_id' => $userId, 'post_id' => $this->id]);
        $db->query("UPDATE posts SET save_count = save_count + 1 WHERE id = :id", ['id' => $this->id]);
        return true;
    }

    /**
     * Search posts
     */
    public static function search(string $query, int $page = 1, int $perPage = 15): object
    {
        $db = Database::getInstance();
        return $db->paginate(
            "SELECT p.*, u.first_name, u.last_name, u.username, u.avatar, u.is_verified
             FROM posts p
             JOIN users u ON p.user_id = u.id
             WHERE (p.content LIKE :query OR p.content LIKE :query2)
             AND p.is_active = TRUE AND p.visibility = 'public'
             ORDER BY p.created_at DESC",
            ['query' => "%{$query}%", 'query2' => "%{$query}%"],
            $page,
            $perPage
        );
    }

    /**
     * Get trending posts
     */
    public static function trending(int $limit = 15): array
    {
        $db = Database::getInstance();
        return $db->fetchAll(
            "SELECT p.*, u.first_name, u.last_name, u.username, u.avatar, u.is_verified
             FROM posts p
             JOIN users u ON p.user_id = u.id
             WHERE p.is_active = TRUE AND p.visibility = 'public'
             AND p.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
             ORDER BY (p.reaction_count * 2 + p.comment_count * 3 + p.share_count * 4) DESC
             LIMIT :limit",
            ['limit' => $limit]
        );
    }
}
