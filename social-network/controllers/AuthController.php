<?php
/**
 * Authentication Controller
 * SocialNet - Premium Social Network Platform
 */

namespace App\Controllers;

use Core\Controller;
use Core\Database;
use Core\Security;
use Core\Session;

class AuthController extends Controller
{
    /**
     * Show login form
     */
    public function loginForm(): void
    {
        if ($this->authUser) {
            $this->redirect('/feed');
        }

        $this->render('auth/login', [
            'title' => 'Entrar - ' . APP_NAME,
        ]);
    }

    /**
     * Process login
     */
    public function login(): void
    {
        $login = $_POST['login'] ?? '';
        $password = $_POST['password'] ?? '';
        $remember = isset($_POST['remember']);

        // Validate input
        if (empty($login) || empty($password)) {
            Session::getInstance()->error('Informe seu e-mail/usuario e senha.');
            $this->redirectBack();
        }

        // Validate CSRF
        $this->requireCsrf();

        // Check rate limit
        $ip = Security::getClientIp();
        if (!Security::checkRateLimit('login_' . $ip, LOGIN_MAX_ATTEMPTS, LOGIN_TIMEOUT * 60)) {
            Session::getInstance()->error(
                'Muitas tentativas de login. Aguarde ' . LOGIN_TIMEOUT . ' minutos.'
            );
            $this->redirectBack();
        }

        // Find user by email or username
        $db = Database::getInstance();
        $user = $db->fetch(
            "SELECT id, uuid, username, email, password, is_active, is_banned,
                    two_factor_enabled, two_factor_secret, email_verified_at
             FROM users
             WHERE (email = :login OR username = :login2)
             LIMIT 1",
            ['login' => $login, 'login2' => $login]
        );

        // Verify user exists and is active
        if (!$user) {
            Session::getInstance()->error('Credenciais inválidas.');
            $this->redirectBack();
        }

        if ($user->is_banned) {
            Session::getInstance()->error('Sua conta foi suspensa. Entre em contato com o suporte.');
            $this->redirectBack();
        }

        if (!$user->is_active) {
            Session::getInstance()->error('Sua conta está desativada.');
            $this->redirectBack();
        }

        // Verify password
        if (!Security::verifyPassword($password, $user->password)) {
            Session::getInstance()->error('Credenciais inválidas.');
            $this->redirectBack();
        }

        // Check if email is verified
        if (!$user->email_verified_at) {
            // TODO: Resend verification email option
            Session::getInstance()->warning(
                'Confirme seu e-mail antes de continuar. Verifique sua caixa de entrada.'
            );
            $this->redirectBack();
        }

        // Check 2FA
        if ($user->two_factor_enabled) {
            Session::getInstance()->set('2fa_user_id', $user->id);
            $this->redirect('/two-factor');
            return;
        }

        // Login successful
        $this->authenticateUser($user->id, $remember);
    }

    /**
     * Show registration form
     */
    public function registerForm(): void
    {
        if ($this->authUser) {
            $this->redirect('/feed');
        }

        $this->render('auth/register', [
            'title' => 'Criar Conta - ' . APP_NAME,
        ]);
    }

    /**
     * Process registration
     */
    public function register(): void
    {
        $this->requireCsrf();

        $data = [
            'first_name' => $_POST['first_name'] ?? '',
            'last_name' => $_POST['last_name'] ?? '',
            'username' => strtolower($_POST['username'] ?? ''),
            'email' => strtolower($_POST['email'] ?? ''),
            'password' => $_POST['password'] ?? '',
            'password_confirmation' => $_POST['password_confirmation'] ?? '',
            'birth_date' => $_POST['birth_date'] ?? null,
            'gender' => $_POST['gender'] ?? 'prefer_not_to_say',
            'marital_status' => $_POST['marital_status'] ?? 'single',
            'biography' => $_POST['biography'] ?? '',
            'location' => $_POST['location'] ?? '',
            'profession' => $_POST['profession'] ?? '',
            'website' => $_POST['website'] ?? '',
            'terms' => $_POST['terms'] ?? false,
        ];

        // Validation
        $validator = new \Core\Validator();
        $validation = $validator->validate($data, [
            'first_name' => 'required|min:2|max:50',
            'last_name' => 'required|min:2|max:50',
            'username' => 'required|username|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'password_confirmation' => 'required|confirmed',
            'birth_date' => 'required|date',
            'terms' => 'required',
        ]);

        if (!$validation['valid']) {
            $errorMessages = [];
            foreach ($validation['errors'] as $field => $errors) {
                $errorMessages[] = implode('<br>', $errors);
            }
            Session::getInstance()->error(implode('<br>', $errorMessages));
            $this->redirectBack();
        }

        // Password strength check
        $passwordCheck = Security::validatePassword($data['password']);
        if (!$passwordCheck['valid']) {
            Session::getInstance()->error(implode('<br>', $passwordCheck['errors']));
            $this->redirectBack();
        }

        $db = Database::getInstance();

        // Begin transaction
        $db->beginTransaction();

        try {
            // Create user
            $uuid = Security::generateUuid();
            $userId = $db->insert('users', [
                'uuid' => $uuid,
                'first_name' => Security::clean($data['first_name']),
                'last_name' => Security::clean($data['last_name']),
                'username' => Security::clean($data['username']),
                'email' => Security::clean($data['email']),
                'password' => Security::hashPassword($data['password']),
                'birth_date' => $data['birth_date'],
                'gender' => $data['gender'],
                'marital_status' => $data['marital_status'],
                'biography' => Security::clean($data['biography']),
                'location' => Security::clean($data['location']),
                'profession' => Security::clean($data['profession']),
                'website' => Security::clean($data['website']),
                'language' => DEFAULT_LANG,
            ]);

            // Create default settings
            $db->insert('user_settings', [
                'user_id' => $userId,
                'language' => DEFAULT_LANG,
            ]);

            // Assign default role
            $userRole = $db->fetch("SELECT id FROM roles WHERE slug = 'user'");
            if ($userRole) {
                $db->insert('user_roles', [
                    'user_id' => $userId,
                    'role_id' => $userRole->id,
                ]);
            }

            // Handle avatar upload
            if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
                $avatarPath = $this->handleImageUpload($_FILES['avatar'], 'avatars');
                if ($avatarPath) {
                    $db->update('users', ['avatar' => $avatarPath], 'id = :id', ['id' => $userId]);
                }
            }

            // Handle cover upload
            if (isset($_FILES['cover']) && $_FILES['cover']['error'] === UPLOAD_ERR_OK) {
                $coverPath = $this->handleImageUpload($_FILES['cover'], 'covers');
                if ($coverPath) {
                    $db->update('users', ['cover' => $coverPath], 'id = :id', ['id' => $userId]);
                }
            }

            $db->commit();

            // Send verification email
            $this->sendVerificationEmail($userId, $data['email']);

            // Auto-login
            $this->authenticateUser($userId);

            Session::getInstance()->success(
                'Conta criada com sucesso! Enviamos um e-mail de confirmação.'
            );
            $this->redirect('/feed');

        } catch (\Exception $e) {
            $db->rollback();
            Session::getInstance()->error('Erro ao criar conta. Tente novamente.');
            $this->redirectBack();
        }
    }

    /**
     * Process logout
     */
    public function logout(): void
    {
        $this->requireCsrf();

        $db = Database::getInstance();
        $db->update(
            'users',
            ['last_login' => date('Y-m-d H:i:s')],
            'id = :id',
            ['id' => $this->authUserId]
        );

        Session::getInstance()->destroy();
        $this->redirect('/login');
    }

    /**
     * Show forgot password form
     */
    public function forgotPasswordForm(): void
    {
        $this->render('auth/forgot-password', [
            'title' => 'Recuperar Senha - ' . APP_NAME,
        ]);
    }

    /**
     * Process forgot password
     */
    public function forgotPassword(): void
    {
        $this->requireCsrf();

        $email = strtolower($_POST['email'] ?? '');

        if (!Security::validateEmail($email)) {
            Session::getInstance()->error('Informe um e-mail válido.');
            $this->redirectBack();
        }

        $db = Database::getInstance();
        $user = $db->fetch("SELECT id, email FROM users WHERE email = :email", ['email' => $email]);

        if ($user) {
            $token = Security::generateToken(64);
            $db->insert('email_verifications', [
                'user_id' => $user->id,
                'token' => $token,
                'type' => 'reset',
                'expires_at' => date('Y-m-d H:i:s', time() + 3600),
            ]);

            // TODO: Send reset email
        }

        // Always show success (don't reveal if email exists)
        Session::getInstance()->success(
            'Se o e-mail existir em nossa base, você receberá instruções para redefinir sua senha.'
        );
        $this->redirect('/login');
    }

    /**
     * Show reset password form
     */
    public function resetPasswordForm(array $params): void
    {
        $token = $params['token'] ?? '';

        $db = Database::getInstance();
        $verification = $db->fetch(
            "SELECT id, user_id FROM email_verifications
             WHERE token = :token AND type = 'reset' AND used_at IS NULL
             AND expires_at > NOW()",
            ['token' => $token]
        );

        if (!$verification) {
            Session::getInstance()->error('Link inválido ou expirado.');
            $this->redirect('/forgot-password');
        }

        $this->render('auth/reset-password', [
            'title' => 'Redefinir Senha - ' . APP_NAME,
            'token' => $token,
        ]);
    }

    /**
     * Process reset password
     */
    public function resetPassword(): void
    {
        $this->requireCsrf();

        $token = $_POST['token'] ?? '';
        $password = $_POST['password'] ?? '';
        $confirmation = $_POST['password_confirmation'] ?? '';

        if ($password !== $confirmation) {
            Session::getInstance()->error('As senhas não conferem.');
            $this->redirectBack();
        }

        if (strlen($password) < 8) {
            Session::getInstance()->error('A senha deve ter no mínimo 8 caracteres.');
            $this->redirectBack();
        }

        $db = Database::getInstance();
        $verification = $db->fetch(
            "SELECT id, user_id FROM email_verifications
             WHERE token = :token AND type = 'reset' AND used_at IS NULL
             AND expires_at > NOW()",
            ['token' => $token]
        );

        if (!$verification) {
            Session::getInstance()->error('Link inválido ou expirado.');
            $this->redirect('/forgot-password');
        }

        $db->beginTransaction();
        try {
            $db->update(
                'users',
                ['password' => Security::hashPassword($password)],
                'id = :id',
                ['id' => $verification->user_id]
            );

            $db->update(
                'email_verifications',
                ['used_at' => date('Y-m-d H:i:s')],
                'id = :id',
                ['id' => $verification->id]
            );

            $db->commit();

            Session::getInstance()->success('Senha redefinida com sucesso! Faça login.');
            $this->redirect('/login');
        } catch (\Exception $e) {
            $db->rollback();
            Session::getInstance()->error('Erro ao redefinir senha. Tente novamente.');
            $this->redirectBack();
        }
    }

    /**
     * Verify email
     */
    public function verifyEmail(array $params): void
    {
        $token = $params['token'] ?? '';

        $db = Database::getInstance();
        $verification = $db->fetch(
            "SELECT id, user_id FROM email_verifications
             WHERE token = :token AND type = 'verify' AND used_at IS NULL
             AND expires_at > NOW()",
            ['token' => $token]
        );

        if (!$verification) {
            Session::getInstance()->error('Link de verificação inválido ou expirado.');
            $this->redirect('/login');
        }

        $db->beginTransaction();
        try {
            $db->update(
                'users',
                ['email_verified_at' => date('Y-m-d H:i:s')],
                'id = :id',
                ['id' => $verification->user_id]
            );

            $db->update(
                'email_verifications',
                ['used_at' => date('Y-m-d H:i:s')],
                'id = :id',
                ['id' => $verification->id]
            );

            $db->commit();

            Session::getInstance()->success('E-mail verificado com sucesso!');
        } catch (\Exception $e) {
            $db->rollback();
            Session::getInstance()->error('Erro ao verificar e-mail.');
        }

        $this->redirect('/login');
    }

    // ---- 2FA ----

    public function twoFactorForm(): void
    {
        if (!Session::getInstance()->has('2fa_user_id')) {
            $this->redirect('/login');
        }

        $this->render('auth/two-factor', [
            'title' => 'Autenticação em Dois Fatores - ' . APP_NAME,
        ]);
    }

    public function twoFactorVerify(): void
    {
        $this->requireCsrf();

        $userId = Session::getInstance()->get('2fa_user_id');
        if (!$userId) {
            $this->redirect('/login');
        }

        $code = $_POST['code'] ?? '';

        $db = Database::getInstance();
        $user = $db->fetch(
            "SELECT id, two_factor_secret FROM users WHERE id = :id",
            ['id' => $userId]
        );

        if (!$user) {
            Session::getInstance()->error('Usuário não encontrado.');
            $this->redirect('/login');
        }

        // Verify TOTP code
        if ($this->verifyTOTP($user->two_factor_secret, $code)) {
            Session::getInstance()->remove('2fa_user_id');
            $this->authenticateUser($user->id);
        } else {
            Session::getInstance()->error('Código inválido. Tente novamente.');
            $this->redirectBack();
        }
    }

    // ---- OAuth Methods ----

    public function googleLogin(): void
    {
        $params = [
            'client_id' => GOOGLE_CLIENT_ID,
            'redirect_uri' => APP_URL . '/auth/google/callback',
            'response_type' => 'code',
            'scope' => 'email profile',
            'state' => Security::generateToken(32),
        ];

        Session::getInstance()->set('oauth_state', $params['state']);
        $this->redirect('https://accounts.google.com/o/oauth2/auth?' . http_build_query($params));
    }

    public function googleCallback(): void
    {
        $this->handleOAuthCallback('google', $_GET);
    }

    public function githubLogin(): void
    {
        $params = [
            'client_id' => GITHUB_CLIENT_ID,
            'redirect_uri' => APP_URL . '/auth/github/callback',
            'scope' => 'user:email',
            'state' => Security::generateToken(32),
        ];

        Session::getInstance()->set('oauth_state', $params['state']);
        $this->redirect('https://github.com/login/oauth/authorize?' . http_build_query($params));
    }

    public function githubCallback(): void
    {
        $this->handleOAuthCallback('github', $_GET);
    }

    public function facebookLogin(): void
    {
        $params = [
            'client_id' => FACEBOOK_APP_ID,
            'redirect_uri' => APP_URL . '/auth/facebook/callback',
            'scope' => 'email,public_profile',
            'state' => Security::generateToken(32),
        ];

        Session::getInstance()->set('oauth_state', $params['state']);
        $this->redirect('https://www.facebook.com/v19.0/dialog/oauth?' . http_build_query($params));
    }

    public function facebookCallback(): void
    {
        $this->handleOAuthCallback('facebook', $_GET);
    }

    // ---- Helper Methods ----

    /**
     * Authenticate user and create session
     */
    private function authenticateUser(int $userId, bool $remember = false): void
    {
        $session = Session::getInstance();
        $session->setAuth($userId);

        // Update last login
        Database::getInstance()->update(
            'users',
            ['last_login' => date('Y-m-d H:i:s')],
            'id = :id',
            ['id' => $userId]
        );

        // Log activity
        Database::getInstance()->insert('activity_logs', [
            'user_id' => $userId,
            'type' => 'login',
            'description' => 'Usuário fez login',
            'ip_address' => Security::getClientIp(),
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
        ]);

        // Redirect to intended page
        $redirect = $session->get('redirect_after_login', '/feed');
        $session->remove('redirect_after_login');
        $this->redirect($redirect);
    }

    /**
     * Handle OAuth callback
     */
    private function handleOAuthCallback(string $provider, array $params): void
    {
        $code = $params['code'] ?? null;
        $state = $params['state'] ?? null;

        if (!$code || !$state) {
            Session::getInstance()->error('Autenticação falhou.');
            $this->redirect('/login');
        }

        if ($state !== Session::getInstance()->get('oauth_state')) {
            Session::getInstance()->error('Estado inválido. Tente novamente.');
            $this->redirect('/login');
        }

        Session::getInstance()->remove('oauth_state');

        // TODO: Exchange code for token and get user info from provider
        // Then find or create user and authenticate

        Session::getInstance()->error('Login social em implementação.');
        $this->redirect('/login');
    }

    /**
     * Send verification email
     */
    private function sendVerificationEmail(int $userId, string $email): void
    {
        $token = Security::generateToken(64);

        Database::getInstance()->insert('email_verifications', [
            'user_id' => $userId,
            'token' => $token,
            'type' => 'verify',
            'expires_at' => date('Y-m-d H:i:s', time() + 86400), // 24h
        ]);

        // TODO: Send email via mail service
        // $verificationUrl = APP_URL . '/verify-email/' . $token;
    }

    /**
     * Handle image upload
     */
    private function handleImageUpload(array $file, string $folder): ?string
    {
        $validation = Security::validateFile($file, ['jpg', 'jpeg', 'png', 'webp'], 5 * 1024 * 1024);
        if (!$validation['valid']) {
            return null;
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $filename = uniqid('img_') . '_' . time() . '.' . $ext;
        $path = UPLOAD_PATH . '/' . $folder . '/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $path)) {
            return $filename;
        }

        return null;
    }

    /**
     * Simple TOTP verification (placeholder)
     */
    private function verifyTOTP(string $secret, string $code): bool
    {
        // TODO: Implement proper TOTP verification
        return $code === '123456';
    }
}
