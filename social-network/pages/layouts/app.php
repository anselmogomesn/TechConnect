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

    <!-- Styles -->
    <link rel="stylesheet" href="/assets/css/app.css">

    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

    <?= $extraHead ?? '' ?>
</head>
<body>
    <!-- Top Navigation -->
    <nav class="navbar">
        <div style="display:flex;align-items:center;gap:var(--space-3)">
            <button class="nav-icon show-mobile" data-toggle="sidebar" aria-label="Abrir menu">
                <i class="fas fa-bars"></i>
            </button>
            <a href="/feed" class="navbar-brand">
                <div class="logo-icon" style="width:32px;height:32px;font-size:16px">
                    <i class="fas fa-network-wired"></i>
                </div>
            </a>
        </div>

        <div class="navbar-search">
            <i class="fas fa-search search-icon"></i>
            <input type="text" class="form-input" placeholder="Pesquisar no SocialNet..." aria-label="Pesquisar">
        </div>

        <div class="navbar-actions">
            <a href="/feed" class="nav-icon" data-tooltip="Início">
                <i class="fas fa-home"></i>
            </a>
            <a href="/messages" class="nav-icon" data-tooltip="Mensagens">
                <i class="fas fa-comment"></i>
                <span class="badge">3</span>
            </a>
            <a href="/notifications" class="nav-icon" data-tooltip="Notificações">
                <i class="fas fa-bell"></i>
                <span class="badge">5</span>
            </a>
            <button class="nav-icon" data-theme-toggle data-tooltip="Alternar tema">
                <i class="fas fa-moon"></i>
            </button>
            <div class="dropdown">
                <button class="nav-icon" onclick="this.closest('.dropdown').querySelector('.dropdown-menu').classList.toggle('show')">
                    <img src="/assets/uploads/avatars/<?= $authUser->avatar ?? 'default-avatar.png' ?>"
                         alt="Perfil" class="avatar avatar-sm"
                         onerror="this.src='https://ui-avatars.com/api/?name=<?= urlencode(($authUser->first_name ?? 'U').'+'.($authUser->last_name ?? 'S')) ?>&background=6C5CE7&color=fff'">
                </button>
                <div class="dropdown-menu">
                    <div class="dropdown-header">
                        <?= ($authUser->first_name ?? '') . ' ' . ($authUser->last_name ?? '') ?>
                    </div>
                    <a href="/@<?= $authUser->username ?? '' ?>" class="dropdown-item">
                        <i class="fas fa-user"></i> Meu Perfil
                    </a>
                    <a href="/feed" class="dropdown-item">
                        <i class="fas fa-stream"></i> Feed
                    </a>
                    <a href="/bookmarks" class="dropdown-item">
                        <i class="fas fa-bookmark"></i> Salvos
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="/settings" class="dropdown-item">
                        <i class="fas fa-cog"></i> Configurações
                    </a>
                    <?php if ($authUser->is_admin ?? false): ?>
                    <a href="/admin" class="dropdown-item">
                        <i class="fas fa-shield-alt"></i> Admin
                    </a>
                    <?php endif; ?>
                    <div class="dropdown-divider"></div>
                    <form action="/logout" method="POST" style="margin:0">
                        <?= $csrfField ?? '' ?>
                        <button type="submit" class="dropdown-item" style="color:#E17055">
                            <i class="fas fa-sign-out-alt"></i> Sair
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </nav>

    <!-- Sidebar -->
    <aside class="sidebar">
        <nav class="sidebar-nav">
            <div class="sidebar-label">Principal</div>
            <a href="/feed" class="sidebar-item <?= str_starts_with($currentUrl ?? '', '/feed') ? 'active' : '' ?>">
                <i class="fas fa-home"></i>
                <span>Feed</span>
            </a>
            <a href="/trending" class="sidebar-item">
                <i class="fas fa-fire"></i>
                <span>Trending</span>
            </a>
            <a href="/feed/explore" class="sidebar-item">
                <i class="fas fa-compass"></i>
                <span>Explorar</span>
            </a>

            <div class="sidebar-divider"></div>
            <div class="sidebar-label">Social</div>
            <a href="/messages" class="sidebar-item">
                <i class="fas fa-comment"></i>
                <span>Mensagens</span>
            </a>
            <a href="/notifications" class="sidebar-item">
                <i class="fas fa-bell"></i>
                <span>Notificações</span>
            </a>
            <a href="/communities" class="sidebar-item">
                <i class="fas fa-users"></i>
                <span>Comunidades</span>
            </a>

            <div class="sidebar-divider"></div>
            <div class="sidebar-label">Conteúdo</div>
            <a href="/bookmarks" class="sidebar-item">
                <i class="fas fa-bookmark"></i>
                <span>Salvos</span>
            </a>
            <a href="/events" class="sidebar-item">
                <i class="fas fa-calendar"></i>
                <span>Eventos</span>
            </a>
            <a href="/marketplace" class="sidebar-item">
                <i class="fas fa-store"></i>
                <span>Marketplace</span>
            </a>

            <div class="sidebar-divider"></div>
            <div class="sidebar-label">Outros</div>
            <a href="/settings" class="sidebar-item">
                <i class="fas fa-cog"></i>
                <span>Configurações</span>
            </a>
            <?php if ($authUser->is_admin ?? false): ?>
            <a href="/admin" class="sidebar-item">
                <i class="fas fa-shield-alt"></i>
                <span>Admin</span>
            </a>
            <?php endif; ?>
        </nav>
    </aside>

    <!-- Sidebar Backdrop (Mobile) -->
    <div class="sidebar-backdrop"></div>

    <!-- Main Content -->
    <div class="main-content with-sidebar">
        <?php if ($flash['success'] ?? false): ?>
        <div class="toast-container" style="position:fixed;top:calc(var(--header-height) + 16px);right:16px;z-index:800">
            <div class="toast success" style="animation:toastIn 0.3s ease">
                <div class="toast-icon"><i class="fas fa-check-circle"></i></div>
                <div class="toast-content">
                    <div class="toast-title">Sucesso!</div>
                    <div class="toast-message"><?= $flash['success'] ?></div>
                </div>
                <button class="toast-close" onclick="SocialNet.closeToast(this.parentElement)"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <?php endif; ?>

        <?php if ($flash['error'] ?? false): ?>
        <div class="toast-container" style="position:fixed;top:calc(var(--header-height) + 16px);right:16px;z-index:800">
            <div class="toast error" style="animation:toastIn 0.3s ease">
                <div class="toast-icon"><i class="fas fa-exclamation-circle"></i></div>
                <div class="toast-content">
                    <div class="toast-title">Erro!</div>
                    <div class="toast-message"><?= $flash['error'] ?></div>
                </div>
                <button class="toast-close" onclick="SocialNet.closeToast(this.parentElement)"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <?php endif; ?>

        <?= $content ?? '' ?>
    </div>

    <!-- Mobile Bottom Navigation -->
    <nav class="mobile-bottom-nav">
        <a href="/feed" class="mobile-nav-item <?= str_starts_with($currentUrl ?? '', '/feed') ? 'active' : '' ?>">
            <i class="fas fa-home"></i>
            <span>Início</span>
        </a>
        <a href="/feed/explore" class="mobile-nav-item">
            <i class="fas fa-compass"></i>
            <span>Explorar</span>
        </a>
        <button class="mobile-nav-item" onclick="document.querySelector('[data-modal=\"post-create\"]')?.click()">
            <i class="fas fa-plus-circle" style="color:var(--primary);font-size:28px"></i>
        </button>
        <a href="/notifications" class="mobile-nav-item">
            <i class="fas fa-bell"></i>
            <span>Alertas</span>
            <span class="badge" style="position:absolute;top:2px;right:50%;transform:translateX(18px)">5</span>
        </a>
        <a href="/messages" class="mobile-nav-item">
            <i class="fas fa-comment"></i>
            <span>Chat</span>
        </a>
    </nav>

    <!-- Toast Container -->
    <div class="toast-container"></div>

    <!-- Scripts -->
    <script src="/assets/js/app.js"></script>
    <?= $extraScripts ?? '' ?>
</body>
</html>
