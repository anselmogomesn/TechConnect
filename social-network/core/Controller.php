<?php
/**
 * Base Controller
 * SocialNet - Premium Social Network Platform
 */

namespace Core;

abstract class Controller
{
    protected ?object $authUser = null;
    protected ?int $authUserId = null;
    protected View $view;
    protected array $data = [];

    /**
     * Controller constructor
     */
    public function __construct()
    {
        $this->view = new View();
        $this->initAuth();
        $this->initData();
    }

    /**
     * Initialize authentication data
     */
    private function initAuth(): void
    {
        $session = Session::getInstance();

        if ($session->isAuthenticated()) {
            $this->authUserId = $session->getUserId();

            // Load user data
            $db = Database::getInstance();
            $this->authUser = $db->fetch(
                "SELECT id, uuid, first_name, last_name, username, email, avatar, cover,
                        biography, location, is_verified, is_admin, account_type, theme, language
                 FROM users WHERE id = ? AND is_active = TRUE AND is_banned = FALSE",
                [$this->authUserId]
            );

            if (!$this->authUser) {
                $session->destroy();
                Router::dispatch();
            }

            // Update last activity
            $db->query(
                "UPDATE users SET last_activity = NOW() WHERE id = ?",
                [$this->authUserId]
            );
        }
    }

    /**
     * Initialize common view data
     */
    private function initData(): void
    {
        $this->data = [
            'appName' => APP_NAME,
            'appDescription' => APP_DESCRIPTION,
            'appUrl' => APP_URL,
            'appVersion' => APP_VERSION,
            'csrfToken' => Session::getInstance()->getCsrfToken(),
            'csrfField' => Security::csrfField(),
            'authUser' => $this->authUser,
            'theme' => $this->getUserTheme(),
            'lang' => $this->getUserLanguage(),
            'flash' => $this->getFlashData(),
            'currentUrl' => $_SERVER['REQUEST_URI'] ?? '/',
        ];
    }

    /**
     * Get user theme preference
     */
    private function getUserTheme(): string
    {
        if ($this->authUser && $this->authUser->theme !== 'system') {
            return $this->authUser->theme;
        }
        return 'light';
    }

    /**
     * Get user language
     */
    private function getUserLanguage(): string
    {
        return $this->authUser->language ?? DEFAULT_LANG;
    }

    /**
     * Get flash messages
     */
    private function getFlashData(): array
    {
        $session = Session::getInstance();
        return [
            'success' => $session->flash('success'),
            'error' => $session->flash('error'),
            'info' => $session->flash('info'),
            'warning' => $session->flash('warning'),
        ];
    }

    /**
     * Render a view
     */
    protected function render(string $view, array $data = []): void
    {
        $this->view->render($view, array_merge($this->data, $data));
    }

    /**
     * Render a component
     */
    protected function component(string $component, array $data = []): void
    {
        $this->view->component($component, array_merge($this->data, $data));
    }

    /**
     * Return JSON response
     */
    protected function json(mixed $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    /**
     * Return success JSON
     */
    protected function success(mixed $data = null, string $message = 'Operação realizada com sucesso.'): void
    {
        $this->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ]);
    }

    /**
     * Return error JSON
     */
    protected function error(string $message = 'Ocorreu um erro.', int $statusCode = 400, mixed $errors = null): void
    {
        $response = [
            'status' => 'error',
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        $this->json($response, $statusCode);
    }

    /**
     * Redirect to URL
     */
    protected function redirect(string $url): void
    {
        header("Location: {$url}");
        exit;
    }

    /**
     * Redirect back
     */
    protected function redirectBack(): void
    {
        $referer = $_SERVER['HTTP_REFERER'] ?? '/';
        $this->redirect($referer);
    }

    /**
     * Redirect to route
     */
    protected function redirectTo(string $route): void
    {
        $this->redirect(APP_URL . $route);
    }

    /**
     * Require authentication
     */
    protected function requireAuth(): void
    {
        if (!$this->authUser) {
            if (Security::isAjax()) {
                $this->error('Autenticação necessária.', 401);
            }
            Session::getInstance()->set('redirect_after_login', $_SERVER['REQUEST_URI']);
            $this->redirect('/login');
        }
    }

    /**
     * Require admin
     */
    protected function requireAdmin(): void
    {
        $this->requireAuth();

        if (!$this->authUser || !$this->authUser->is_admin) {
            if (Security::isAjax()) {
                $this->error('Acesso não autorizado.', 403);
            }
            $this->redirect('/');
        }
    }

    /**
     * Require CSRF token validation
     */
    protected function requireCsrf(): void
    {
        if (!Security::validateCsrf()) {
            if (Security::isAjax()) {
                $this->error('Token CSRF inválido.', 419);
            }
            $this->redirectBack();
        }
    }

    /**
     * Validate request data
     */
    protected function validate(array $data, array $rules): array
    {
        $validator = new Validator();
        return $validator->validate($data, $rules);
    }

    /**
     * Get pagination parameters
     */
    protected function getPaginationParams(int $defaultPerPage = 15): array
    {
        return [
            'page' => max(1, (int)($_GET['page'] ?? 1)),
            'perPage' => max(1, min(100, (int)($_GET['per_page'] ?? $defaultPerPage))),
        ];
    }
}
