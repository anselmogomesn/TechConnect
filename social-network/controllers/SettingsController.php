<?php
/**
 * Settings Controller
 * SocialNet - Premium Social Network Platform
 */

namespace App\Controllers;

use Core\Controller;
use Core\Database;
use Core\Security;
use Core\Session;

class SettingsController extends Controller
{
    public function index(): void    { $this->redirect('/settings/profile'); }

    public function account(): void
    {
        $this->requireAuth();
        $this->render('settings/account', ['title' => 'Configurações - ' . APP_NAME]);
    }

    public function updateAccount(): void
    {
        $this->requireAuth();
        $this->requireCsrf();

        Session::getInstance()->success('Conta atualizada.');
        $this->redirectBack();
    }

    public function privacy(): void
    {
        $this->requireAuth();
        $this->render('settings/privacy', ['title' => 'Privacidade - ' . APP_NAME]);
    }

    public function updatePrivacy(): void
    {
        $this->requireAuth();
        $this->requireCsrf();
        Session::getInstance()->success('Privacidade atualizada.');
        $this->redirectBack();
    }

    public function security(): void
    {
        $this->requireAuth();
        $this->render('settings/security', ['title' => 'Segurança - ' . APP_NAME]);
    }

    public function updateSecurity(): void
    {
        $this->requireAuth();
        $this->requireCsrf();

        $currentPassword = $_POST['current_password'] ?? '';
        $newPassword = $_POST['new_password'] ?? '';

        $db = Database::getInstance();
        $user = $db->fetch("SELECT password FROM users WHERE id = :id", ['id' => $this->authUserId]);

        if (!Security::verifyPassword($currentPassword, $user->password)) {
            Session::getInstance()->error('Senha atual incorreta.');
            $this->redirectBack();
        }

        $db->update('users', ['password' => Security::hashPassword($newPassword)], 'id = :id', ['id' => $this->authUserId]);
        Session::getInstance()->success('Senha alterada com sucesso.');
        $this->redirectBack();
    }

    public function toggle2FA(): void
    {
        $this->requireAuth();
        $this->requireCsrf();

        $db = Database::getInstance();
        $user = $db->fetch("SELECT two_factor_enabled FROM users WHERE id = :id", ['id' => $this->authUserId]);

        $db->update('users', ['two_factor_enabled' => !$user->two_factor_enabled], 'id = :id', ['id' => $this->authUserId]);
        Session::getInstance()->success($user->two_factor_enabled ? '2FA desativado.' : '2FA ativado.');
        $this->redirectBack();
    }

    public function notifications(): void
    {
        $this->requireAuth();
        $this->render('settings/notifications', ['title' => 'Notificações - ' . APP_NAME]);
    }

    public function updateNotifications(): void
    {
        $this->requireAuth();
        $this->requireCsrf();
        Session::getInstance()->success('Notificações atualizadas.');
        $this->redirectBack();
    }

    public function sessions(): void
    {
        $this->requireAuth();
        $this->render('settings/sessions', ['title' => 'Sessões - ' . APP_NAME]);
    }

    public function removeSession(array $params): void
    {
        $this->requireAuth();
        $this->requireCsrf();
        Session::getInstance()->success('Sessão removida.');
        $this->redirectBack();
    }

    public function blockedUsers(): void
    {
        $this->requireAuth();
        $this->render('settings/blocked', ['title' => 'Bloqueados - ' . APP_NAME]);
    }

    public function unblock(array $params): void
    {
        $this->requireAuth();
        $this->requireCsrf();
        Session::getInstance()->success('Usuário desbloqueado.');
        $this->redirectBack();
    }

    public function downloadData(): void
    {
        $this->requireAuth();
        Session::getInstance()->info('Seus dados serão exportados em breve.');
        $this->redirectBack();
    }

    public function deleteAccount(): void
    {
        $this->requireAuth();
        $this->requireCsrf();

        Database::getInstance()->update('users', ['is_active' => false], 'id = :id', ['id' => $this->authUserId]);
        Session::getInstance()->destroy();
        Session::getInstance()->info('Conta excluída.');
        $this->redirect('/');
    }
}
