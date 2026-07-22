<?php
/**
 * Admin Controller
 * SocialNet - Premium Social Network Platform
 */

namespace App\Controllers;

use Core\Controller;
use Core\Database;
use Core\Security;
use Core\Session;

class AdminController extends Controller
{
    /**
     * Admin dashboard
     */
    public function dashboard(): void
    {
        $this->requireAdmin();

        $db = Database::getInstance();

        $stats = [
            'total_users' => (int)$db->fetchColumn("SELECT COUNT(*) FROM users WHERE is_active = TRUE"),
            'total_posts' => (int)$db->fetchColumn("SELECT COUNT(*) FROM posts WHERE is_active = TRUE"),
            'total_comments' => (int)$db->fetchColumn("SELECT COUNT(*) FROM comments WHERE is_active = TRUE"),
            'total_reports' => (int)$db->fetchColumn("SELECT COUNT(*) FROM reports WHERE status = 'pending'"),
            'users_today' => (int)$db->fetchColumn(
                "SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()"
            ),
            'posts_today' => (int)$db->fetchColumn(
                "SELECT COUNT(*) FROM posts WHERE DATE(created_at) = CURDATE()"
            ),
        ];

        $this->render('admin/dashboard', [
            'title' => 'Admin Dashboard - ' . APP_NAME,
            'stats' => $stats,
        ]);
    }

    /**
     * User management
     */
    public function users(): void
    {
        $this->requireAdmin();

        $page = max(1, (int)($_GET['page'] ?? 1));
        $search = $_GET['search'] ?? '';

        $db = Database::getInstance();

        if ($search) {
            $users = $db->paginate(
                "SELECT id, uuid, first_name, last_name, username, email, avatar,
                        is_verified, is_admin, is_active, is_banned, created_at, last_login
                 FROM users
                 WHERE first_name LIKE :search OR last_name LIKE :search2
                    OR username LIKE :search3 OR email LIKE :search4",
                ['search' => "%{$search}%", 'search2' => "%{$search}%", 'search3' => "%{$search}%", 'search4' => "%{$search}%"],
                $page,
                20
            );
        } else {
            $users = $db->paginate(
                "SELECT id, uuid, first_name, last_name, username, email, avatar,
                        is_verified, is_admin, is_active, is_banned, created_at, last_login
                 FROM users
                 ORDER BY created_at DESC",
                [],
                $page,
                20
            );
        }

        $this->render('admin/users', [
            'title' => 'Usuários - Admin - ' . APP_NAME,
            'users' => $users,
        ]);
    }

    /**
     * Ban user
     */
    public function banUser(array $params): void
    {
        $this->requireAdmin();
        $this->requireCsrf();

        $userId = $params['id'] ?? 0;

        Database::getInstance()->update('users', [
            'is_banned' => true,
            'ban_reason' => Security::clean($_POST['reason'] ?? 'Violação dos termos'),
        ], 'id = :id', ['id' => $userId]);

        Session::getInstance()->success('Usuário banido com sucesso.');
        $this->redirectBack();
    }

    /**
     * Unban user
     */
    public function unbanUser(array $params): void
    {
        $this->requireAdmin();
        $this->requireCsrf();

        $userId = $params['id'] ?? 0;

        Database::getInstance()->update('users', [
            'is_banned' => false,
            'ban_reason' => null,
        ], 'id = :id', ['id' => $userId]);

        Session::getInstance()->success('Usuário desbanido.');
        $this->redirectBack();
    }

    /**
     * Verify user
     */
    public function verifyUser(array $params): void
    {
        $this->requireAdmin();
        $this->requireCsrf();

        $userId = $params['id'] ?? 0;

        Database::getInstance()->update('users', [
            'is_verified' => true,
        ], 'id = :id', ['id' => $userId]);

        Session::getInstance()->success('Usuário verificado.');
        $this->redirectBack();
    }

    /**
     * Post moderation
     */
    public function posts(): void
    {
        $this->requireAdmin();

        $page = max(1, (int)($_GET['page'] ?? 1));

        $db = Database::getInstance();
        $posts = $db->paginate(
            "SELECT p.id, p.uuid, p.content, p.type, p.created_at, p.report_count,
                    u.first_name, u.last_name, u.username
             FROM posts p
             JOIN users u ON p.user_id = u.id
             WHERE p.is_active = TRUE
             ORDER BY p.report_count DESC, p.created_at DESC",
            [],
            $page,
            20
        );

        $this->render('admin/posts', [
            'title' => 'Publicações - Admin - ' . APP_NAME,
            'posts' => $posts,
        ]);
    }

    /**
     * Delete post as admin
     */
    public function deletePost(array $params): void
    {
        $this->requireAdmin();
        $this->requireCsrf();

        $postId = $params['id'] ?? 0;

        Database::getInstance()->update('posts', [
            'is_active' => false,
            'deleted_at' => date('Y-m-d H:i:s'),
        ], 'id = :id', ['id' => $postId]);

        Session::getInstance()->success('Publicação removida.');
        $this->redirectBack();
    }

    /**
     * Reports management
     */
    public function reports(): void
    {
        $this->requireAdmin();

        $page = max(1, (int)($_GET['page'] ?? 1));

        $db = Database::getInstance();
        $reports = $db->paginate(
            "SELECT r.*, reporter.first_name as reporter_name, reporter.username as reporter_username
             FROM reports r
             JOIN users reporter ON r.reporter_id = reporter.id
             WHERE r.status = 'pending'
             ORDER BY r.created_at DESC",
            [],
            $page,
            20
        );

        $this->render('admin/reports', [
            'title' => 'Denúncias - Admin - ' . APP_NAME,
            'reports' => $reports,
        ]);
    }

    /**
     * Resolve report
     */
    public function resolveReport(array $params): void
    {
        $this->requireAdmin();
        $this->requireCsrf();

        $reportId = $params['id'] ?? 0;

        Database::getInstance()->update('reports', [
            'status' => 'resolved',
            'reviewed_by' => $this->authUserId,
            'reviewed_at' => date('Y-m-d H:i:s'),
        ], 'id = :id', ['id' => $reportId]);

        Session::getInstance()->success('Denúncia resolvida.');
        $this->redirectBack();
    }

    /**
     * Analytics page
     */
    public function analytics(): void
    {
        $this->requireAdmin();

        $db = Database::getInstance();

        // Get last 7 days stats
        $userGrowth = $db->fetchAll(
            "SELECT DATE(created_at) as date, COUNT(*) as count
             FROM users
             WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
             GROUP BY DATE(created_at)
             ORDER BY date"
        );

        $postGrowth = $db->fetchAll(
            "SELECT DATE(created_at) as date, COUNT(*) as count
             FROM posts
             WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
             GROUP BY DATE(created_at)
             ORDER BY date"
        );

        $this->render('admin/analytics', [
            'title' => 'Analytics - Admin - ' . APP_NAME,
            'userGrowth' => $userGrowth,
            'postGrowth' => $postGrowth,
        ]);
    }

    /**
     * Activity logs
     */
    public function logs(): void
    {
        $this->requireAdmin();

        $page = max(1, (int)($_GET['page'] ?? 1));

        $db = Database::getInstance();
        $logs = $db->paginate(
            "SELECT al.*, u.first_name, u.last_name, u.username
             FROM activity_logs al
             LEFT JOIN users u ON al.user_id = u.id
             ORDER BY al.created_at DESC",
            [],
            $page,
            50
        );

        $this->render('admin/logs', [
            'title' => 'Logs - Admin - ' . APP_NAME,
            'logs' => $logs,
        ]);
    }

    /**
     * Admin settings
     */
    public function settings(): void
    {
        $this->requireAdmin();

        $this->render('admin/settings', [
            'title' => 'Configurações - Admin - ' . APP_NAME,
        ]);
    }

    /**
     * Update admin settings
     */
    public function updateSettings(): void
    {
        $this->requireAdmin();
        $this->requireCsrf();

        // Handle settings update
        Session::getInstance()->success('Configurações salvas.');
        $this->redirectBack();
    }

    /**
     * Backup page
     */
    public function backup(): void
    {
        $this->requireAdmin();

        $backups = [];
        $backupDir = STORAGE_PATH . '/backups';
        if (is_dir($backupDir)) {
            $files = glob($backupDir . '/*.sql');
            foreach ($files as $file) {
                $backups[] = [
                    'name' => basename($file),
                    'size' => filesize($file),
                    'date' => date('d/m/Y H:i', filemtime($file)),
                ];
            }
        }

        $this->render('admin/backup', [
            'title' => 'Backup - Admin - ' . APP_NAME,
            'backups' => $backups,
        ]);
    }

    /**
     * Create backup
     */
    public function createBackup(): void
    {
        $this->requireAdmin();
        $this->requireCsrf();

        $filename = 'backup_' . date('Y-m-d_H-i-s') . '.sql';
        $path = STORAGE_PATH . '/backups/' . $filename;

        // Create backup directory if not exists
        if (!is_dir(STORAGE_PATH . '/backups')) {
            mkdir(STORAGE_PATH . '/backups', 0755, true);
        }

        // Use mysqldump
        $command = sprintf(
            'mysqldump -h%s -u%s %s %s > %s 2>&1',
            escapeshellarg(DB_HOST),
            escapeshellarg(DB_USER),
            DB_PASS ? '-p' . escapeshellarg(DB_PASS) : '',
            escapeshellarg(DB_NAME),
            escapeshellarg($path)
        );

        exec($command, $output, $returnCode);

        if ($returnCode === 0) {
            // Log the activity
            Database::getInstance()->insert('activity_logs', [
                'user_id' => $this->authUserId,
                'type' => 'backup',
                'description' => 'Backup criado: ' . $filename,
                'ip_address' => Security::getClientIp(),
            ]);

            Session::getInstance()->success('Backup criado com sucesso!');
        } else {
            Session::getInstance()->error('Erro ao criar backup.');
        }

        $this->redirectBack();
    }
}
