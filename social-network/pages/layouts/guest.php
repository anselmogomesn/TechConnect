<!DOCTYPE html>
<html lang="<?= $lang ?? 'pt-BR' ?>" data-theme="<?= $theme ?? 'light' ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?= $appDescription ?? '' ?>">
    <meta name="csrf-token" content="<?= $csrfToken ?? '' ?>">
    <title><?= $title ?? $appName ?? 'SocialNet' ?></title>

    <!-- PWA -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#6C5CE7">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <!-- Styles -->
    <link rel="stylesheet" href="/assets/css/app.css">

    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

    <?= $extraHead ?? '' ?>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="navbar-brand">
            <div class="logo-icon">
                <i class="fas fa-network-wired"></i>
            </div>
            <span><?= $appName ?? 'SocialNet' ?></span>
        </div>

        <div style="display:flex;align-items:center;gap:var(--space-3)">
            <a href="/login" class="btn btn-ghost btn-sm">Entrar</a>
            <a href="/register" class="btn btn-primary btn-sm">Cadastrar</a>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
        <?= $content ?? '' ?>
    </div>

    <!-- Scripts -->
    <script src="/assets/js/app.js"></script>
    <?= $extraScripts ?? '' ?>
</body>
</html>
