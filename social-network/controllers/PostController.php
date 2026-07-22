<?php
/**
 * Post Controller
 * SocialNet - Premium Social Network Platform
 */

namespace App\Controllers;

use Core\Controller;
use Core\Database;
use Core\Security;
use Core\Session;

class PostController extends Controller
{
    /**
     * Show create post form
     */
    public function create(): void
    {
        $this->requireAuth();
        // Modal is rendered on feed page - redirect to feed
        $this->redirect('/feed');
    }

    /**
     * Store new post
     */
    public function store(): void
    {
        $this->requireAuth();
        $this->requireCsrf();

        $content = $_POST['content'] ?? '';
        $type = $_POST['type'] ?? 'text';
        $visibility = $_POST['visibility'] ?? 'public';

        if (empty($content) && empty($_FILES['media'])) {
            Session::getInstance()->error('Adicione conteúdo à sua publicação.');
            $this->redirectBack();
        }

        $db = Database::getInstance();
        $db->beginTransaction();

        try {
            $uuid = Security::generateUuid();

            $postId = $db->insert('posts', [
                'uuid' => $uuid,
                'user_id' => $this->authUserId,
                'content' => Security::clean($content),
                'type' => $type,
                'visibility' => $visibility,
            ]);

            // Handle media uploads
            if (isset($_FILES['media']) && !empty($_FILES['media']['name'][0])) {
                $this->handlePostMedia($postId, $_FILES['media']);
            }

            // Extract and save hashtags
            $this->extractHashtags($postId, $content);

            $db->commit();

            Session::getInstance()->success('Publicação criada com sucesso!');
        } catch (\Exception $e) {
            $db->rollback();
            Session::getInstance()->error('Erro ao criar publicação.');
        }

        $this->redirectBack();
    }

    /**
     * Show single post
     */
    public function show(array $params): void
    {
        $uuid = $params['uuid'] ?? '';

        $db = Database::getInstance();
        $post = $db->fetch(
            "SELECT p.*, u.first_name, u.last_name, u.username, u.avatar, u.is_verified
             FROM posts p
             JOIN users u ON p.user_id = u.id
             WHERE p.uuid = :uuid AND p.is_active = TRUE",
            ['uuid' => $uuid]
        );

        if (!$post) {
            $this->render('errors/404');
            return;
        }

        // Get comments
        $comments = $db->fetchAll(
            "SELECT c.*, u.first_name, u.last_name, u.username, u.avatar, u.is_verified
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.post_id = :post_id AND c.parent_id IS NULL AND c.is_active = TRUE
             ORDER BY c.created_at DESC
             LIMIT 10",
            ['post_id' => $post->id]
        );

        $this->render('post/show', [
            'title' => 'Publicação - ' . APP_NAME,
            'post' => $post,
            'comments' => $comments,
        ]);
    }

    /**
     * Update post
     */
    public function update(array $params): void
    {
        $this->requireAuth();
        $this->requireCsrf();

        $uuid = $params['uuid'] ?? '';
        $content = $_POST['content'] ?? '';

        $db = Database::getInstance();
        $post = $db->fetch(
            "SELECT id, user_id FROM posts WHERE uuid = :uuid",
            ['uuid' => $uuid]
        );

        if (!$post || $post->user_id != $this->authUserId) {
            Session::getInstance()->error('Publicação não encontrada.');
            $this->redirectBack();
        }

        $db->update('posts', [
            'content' => Security::clean($content),
            'is_edited' => true,
        ], 'id = :id', ['id' => $post->id]);

        Session::getInstance()->success('Publicação atualizada!');
        $this->redirectBack();
    }

    /**
     * Delete post
     */
    public function destroy(array $params): void
    {
        $this->requireAuth();
        $this->requireCsrf();

        $uuid = $params['uuid'] ?? '';

        $db = Database::getInstance();
        $db->query(
            "UPDATE posts SET is_active = FALSE, deleted_at = NOW()
             WHERE uuid = :uuid AND user_id = :user_id",
            ['uuid' => $uuid, 'user_id' => $this->authUserId]
        );

        if (Security::isAjax()) {
            $this->success(null, 'Publicação excluída.');
        }

        Session::getInstance()->success('Publicação excluída.');
        $this->redirectBack();
    }

    /**
     * Toggle pin post
     */
    public function togglePin(array $params): void
    {
        $this->requireAuth();

        $uuid = $params['uuid'] ?? '';

        $db = Database::getInstance();
        $post = $db->fetch(
            "SELECT id, is_pinned FROM posts WHERE uuid = :uuid AND user_id = :user_id",
            ['uuid' => $uuid, 'user_id' => $this->authUserId]
        );

        if (!$post) {
            $this->error('Publicação não encontrada.');
        }

        $db->update('posts', ['is_pinned' => !$post->is_pinned], 'id = :id', ['id' => $post->id]);

        $this->success(['is_pinned' => !$post->is_pinned]);
    }

    /**
     * Report post
     */
    public function report(array $params): void
    {
        $this->requireAuth();
        $this->requireCsrf();

        $uuid = $params['uuid'] ?? '';
        $reason = $_POST['reason'] ?? 'other';
        $description = $_POST['description'] ?? '';

        $db = Database::getInstance();
        $post = $db->fetch("SELECT id FROM posts WHERE uuid = :uuid", ['uuid' => $uuid]);

        if (!$post) {
            $this->error('Publicação não encontrada.');
        }

        // Check if already reported
        $existing = $db->fetch(
            "SELECT id FROM reports WHERE reporter_id = :reporter AND post_id = :post_id AND status = 'pending'",
            ['reporter' => $this->authUserId, 'post_id' => $post->id]
        );

        if ($existing) {
            $this->error('Você já denunciou esta publicação.');
        }

        $db->insert('reports', [
            'reporter_id' => $this->authUserId,
            'post_id' => $post->id,
            'reason' => $reason,
            'description' => Security::clean($description),
        ]);

        $db->query(
            "UPDATE posts SET report_count = report_count + 1 WHERE id = :id",
            ['id' => $post->id]
        );

        $this->success(null, 'Denúncia enviada com sucesso.');
    }

    /**
     * Handle post media upload
     */
    private function handlePostMedia(int $postId, array $files): void
    {
        $db = Database::getInstance();
        $uploadDir = UPLOAD_PATH . '/posts/';
        $allowedImages = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $order = 0;

        foreach ($files['name'] as $key => $name) {
            if ($files['error'][$key] !== UPLOAD_ERR_OK) continue;

            $file = [
                'name' => $files['name'][$key],
                'type' => $files['type'][$key],
                'tmp_name' => $files['tmp_name'][$key],
                'error' => $files['error'][$key],
                'size' => $files['size'][$key],
            ];

            $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
            $filename = 'post_' . $postId . '_' . time() . '_' . $key . '.' . $ext;

            if (move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {
                $mediaType = in_array($ext, $allowedImages) ? 'image' : 'file';

                $db->insert('post_media', [
                    'post_id' => $postId,
                    'type' => $mediaType,
                    'file_path' => $filename,
                    'file_size' => $file['size'],
                    'mime_type' => $file['type'],
                    'order_index' => $order++,
                ]);
            }
        }
    }

    /**
     * Extract and save hashtags from content
     */
    private function extractHashtags(int $postId, string $content): void
    {
        preg_match_all('/#(\w+)/u', $content, $matches);
        $tags = array_unique($matches[1] ?? []);

        if (empty($tags)) return;

        $db = Database::getInstance();

        foreach ($tags as $tag) {
            $tag = strtolower(trim($tag));
            if (empty($tag)) continue;

            $existing = $db->fetch(
                "SELECT id FROM hashtags WHERE tag = :tag",
                ['tag' => $tag]
            );

            if ($existing) {
                $hashtagId = $existing->id;
                $db->query(
                    "UPDATE hashtags SET usage_count = usage_count + 1 WHERE id = :id",
                    ['id' => $hashtagId]
                );
            } else {
                $hashtagId = $db->insert('hashtags', [
                    'tag' => $tag,
                    'slug' => $tag,
                    'usage_count' => 1,
                ]);
            }

            $db->insert('post_hashtags', [
                'post_id' => $postId,
                'hashtag_id' => $hashtagId,
            ]);
        }
    }
}
