<?php
/**
 * Home Controller
 * SocialNet - Premium Social Network Platform
 */

namespace App\Controllers;

use Core\Controller;
use Core\Session;

class HomeController extends Controller
{
    /**
     * Landing page
     */
    public function index(): void
    {
        // If authenticated, redirect to feed
        if ($this->authUser) {
            $this->redirect('/feed');
        }

        $this->render('landing', [
            'title' => APP_NAME . ' - ' . APP_DESCRIPTION,
        ]);
    }

    /**
     * About page
     */
    public function about(): void
    {
        $this->render('about', [
            'title' => 'Sobre - ' . APP_NAME,
        ]);
    }

    /**
     * Contact page
     */
    public function contact(): void
    {
        $this->render('contact', [
            'title' => 'Contato - ' . APP_NAME,
        ]);
    }

    /**
     * Send contact form
     */
    public function sendContact(): void
    {
        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $message = $_POST['message'] ?? '';

        // Validate
        $errors = [];

        if (empty($name)) {
            $errors[] = 'Nome é obrigatório.';
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'E-mail inválido.';
        }

        if (strlen($message) < 10) {
            $errors[] = 'Mensagem deve ter pelo menos 10 caracteres.';
        }

        if (!empty($errors)) {
            Session::getInstance()->error(implode('<br>', $errors));
            $this->redirectBack();
        }

        // TODO: Send email
        Session::getInstance()->success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        $this->redirectBack();
    }
}
