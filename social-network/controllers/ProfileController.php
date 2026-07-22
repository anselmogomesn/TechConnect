<?php
/**
 * Profile Controller
 * SocialNet - Premium Social Network Platform
 */

namespace App\Controllers;

use Core\Controller;
use Core\Database;
use Core\Security;
use Core\Session;

class ProfileController extends Controller
{
    /**
     * Show user profile
     */
    public function show(array $params): void
    {
        $username = $params['username'] ?? '';

        $db = Database::getInstance();
        $profileUser = $db->fetch(
            "SELECT id, uuid, first_name, last_name, username, email, avatar, cover,
                    biography, location, city, country, profession, company, education,
                    birth_date, website, is_verified, account_type, created_at
             FROM users
             WHERE username = :username AND is_active = TRUE AND is_banned = FALSE",
            ['username' => $username]
        );

        if (!$profileUser) {
            // User not found
            $this->render('errors/404', ['title' => 'Usuário não encontrado']);
            return;
        }

        $this->render('profile/show', [
            'title' => $profileUser->first_name . ' ' . $profileUser->last_name . ' - ' . APP_NAME,
            'profileUser' => $profileUser,
        ]);
    }

    /**
     * Edit profile form
     */
    public function edit(): void
    {
        $this->requireAuth();

        $db = Database::getInstance();
        $user = $db->fetch(
            "SELECT * FROM users WHERE id = :id",
            ['id' => $this->authUserId]
        );

        $this->render('profile/edit', [
            'title' => 'Editar Perfil - ' . APP_NAME,
            'profileUser' => $user,
        ]);
    }

    /**
     * Update profile
     */
    public function update(): void
    {
        $this->requireAuth();
        $this->requireCsrf();

        $db = Database::getInstance();

        $data = [
            'first_name' => Security::clean($_POST['first_name'] ?? ''),
            'last_name' => Security::clean($_POST['last_name'] ?? ''),
            'biography' => Security::clean($_POST['biography'] ?? ''),
            'location' => Security::clean($_POST['location'] ?? ''),
            'city' => Security::clean($_POST['city'] ?? ''),
            'country' => Security::clean($_POST['country'] ?? ''),
            'profession' => Security::clean($_POST['profession'] ?? ''),
            'company' => Security::clean($_POST['company'] ?? ''),
            'education' => Security::clean($_POST['education'] ?? ''),
            'website' => Security::clean($_POST['website'] ?? ''),
        ];

        $db->update('users', $data, 'id = :id', ['id' => $this->authUserId]);

        Session::getInstance()->success('Perfil atualizado com sucesso!');
        $this->redirectBack();
    }

    /**
     * Update avatar
     */
    public function updateAvatar(): void
    {
        $this->requireAuth();
        $this->requireCsrf();

        if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
            Session::getInstance()->error('Selecione uma imagem.');
            $this->redirectBack();
        }

        $validation = Security::validateFile($_FILES['avatar'], ['jpg', 'jpeg', 'png', 'webp'], 5 * 1024 * 1024);
        if (!$validation['valid']) {
            Session::getInstance()->error(implode('<br>', $validation['errors']));
            $this->redirectBack();
        }

        $ext = strtolower(pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION));
        $filename = 'avatar_' . $this->authUserId . '_' . time() . '.' . $ext;
        $path = UPLOAD_PATH . '/avatars/' . $filename;

        if (move_uploaded_file($_FILES['avatar']['tmp_name'], $path)) {
            Database::getInstance()->update(
                'users',
                ['avatar' => $filename],
                'id = :id',
                ['id' => $this->authUserId]
            );
            Session::getInstance()->success('Foto de perfil atualizada!');
        } else {
            Session::getInstance()->error('Erro ao fazer upload.');
        }

        $this->redirectBack();
    }

    /**
     * Update cover
     */
    public function updateCover(): void
    {
        $this->requireAuth();
        $this->requireCsrf();

        if (!isset($_FILES['cover']) || $_FILES['cover']['error'] !== UPLOAD_ERR_OK) {
            Session::getInstance()->error('Selecione uma imagem.');
            $this->redirectBack();
        }

        $validation = Security::validateFile($_FILES['cover'], ['jpg', 'jpeg', 'png', 'webp'], 10 * 1024 * 1024);
        if (!$validation['valid']) {
            Session::getInstance()->error(implode('<br>', $validation['errors']));
            $this->redirectBack();
        }

        $ext = strtolower(pathinfo($_FILES['cover']['name'], PATHINFO_EXTENSION));
        $filename = 'cover_' . $this->authUserId . '_' . time() . '.' . $ext;
        $path = UPLOAD_PATH . '/covers/' . $filename;

        if (move_uploaded_file($_FILES['cover']['tmp_name'], $path)) {
            Database::getInstance()->update(
                'users',
                ['cover' => $filename],
                'id = :id',
                ['id' => $this->authUserId]
            );
            Session::getInstance()->success('Foto de capa atualizada!');
        } else {
            Session::getInstance()->error('Erro ao fazer upload.');
        }

        $this->redirectBack();
    }

    /**
     * Show followers
     */
    public function followers(array $params): void
    {
        $username = $params['username'] ?? '';
        $db = Database::getInstance();

        $user = $db->fetch("SELECT id FROM users WHERE username = :username", ['username' => $username]);
        if (!$user) {
            $this->render('errors/404');
            return;
        }

        $followers = $db->fetchAll(
            "SELECT u.id, u.first_name, u.last_name, u.username, u.avatar, u.is_verified
             FROM followers f
             JOIN users u ON f.follower_id = u.id
             WHERE f.following_id = :user_id AND f.status = 'accepted'
             ORDER BY f.created_at DESC",
            ['user_id' => $user->id]
        );

        $this->json(['followers' => $followers]);
    }

    /**
     * Show following
     */
    public function following(array $params): void
    {
        $username = $params['username'] ?? '';
        $db = Database::getInstance();

        $user = $db->fetch("SELECT id FROM users WHERE username = :username", ['username' => $username]);
        if (!$user) {
            $this->render('errors/404');
            return;
        }

        $following = $db->fetchAll(
            "SELECT u.id, u.first_name, u.last_name, u.username, u.avatar, u.is_verified
             FROM followers f
             JOIN users u ON f.following_id = u.id
             WHERE f.follower_id = :user_id AND f.status = 'accepted'
             ORDER BY f.created_at DESC",
            ['user_id' => $user->id]
        );

        $this->json(['following' => $following]);
    }
}
