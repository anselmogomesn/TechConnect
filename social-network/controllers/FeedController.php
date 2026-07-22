<?php
/**
 * Feed Controller
 * SocialNet - Premium Social Network Platform
 */

namespace App\Controllers;

use Core\Controller;
use Core\Database;

class FeedController extends Controller
{
    /**
     * Main feed
     */
    public function index(): void
    {
        $this->requireAuth();

        $page = max(1, (int)($_GET['page'] ?? 1));

        $db = Database::getInstance();

        // Get posts with user data
        $posts = $db->fetchAll(
            "SELECT p.*, u.first_name, u.last_name, u.username, u.avatar, u.is_verified
             FROM posts p
             JOIN users u ON p.user_id = u.id
             WHERE p.is_active = TRUE
               AND p.visibility = 'public'
               AND p.is_draft = FALSE
             ORDER BY p.created_at DESC
             LIMIT 15 OFFSET " . (($page - 1) * 15)
        );

        $this->render('feed/index', [
            'title' => 'Feed - ' . APP_NAME,
            'posts' => $posts,
        ]);
    }

    /**
     * Popular feed
     */
    public function popular(): void
    {
        $this->requireAuth();

        $this->render('feed/index', [
            'title' => 'Popular - ' . APP_NAME,
            'filter' => 'popular',
        ]);
    }

    /**
     * Following feed
     */
    public function following(): void
    {
        $this->requireAuth();

        $this->render('feed/index', [
            'title' => 'Seguindo - ' . APP_NAME,
            'filter' => 'following',
        ]);
    }

    /**
     * Explore page
     */
    public function explore(): void
    {
        $this->requireAuth();

        $this->render('feed/explore', [
            'title' => 'Explorar - ' . APP_NAME,
        ]);
    }
}
