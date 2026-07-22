<!-- ============================================================
 * SocialNet - Settings Page
 * ============================================================ -->

<div style="max-width:720px;margin:0 auto;padding:var(--space-6)">
    <div style="margin-bottom:var(--space-8);padding-top:var(--space-4)">
        <h3 style="margin:0">Configurações</h3>
        <p style="color:var(--text-secondary);font-size:var(--text-sm)">Gerencie sua conta e preferências</p>
    </div>

    <!-- Settings Nav -->
    <div style="display:flex;gap:var(--space-2);overflow-x:auto;padding-bottom:var(--space-1);margin-bottom:var(--space-6)">
        <a href="/settings/account" class="btn btn-primary btn-sm">Conta</a>
        <a href="/settings/profile" class="btn btn-ghost btn-sm" style="border:1px solid var(--border-color)">Perfil</a>
        <a href="/settings/privacy" class="btn btn-ghost btn-sm" style="border:1px solid var(--border-color)">Privacidade</a>
        <a href="/settings/security" class="btn btn-ghost btn-sm" style="border:1px solid var(--border-color)">Segurança</a>
        <a href="/settings/notifications" class="btn btn-ghost btn-sm" style="border:1px solid var(--border-color)">Notificações</a>
        <a href="/settings/sessions" class="btn btn-ghost btn-sm" style="border:1px solid var(--border-color)">Sessões</a>
        <a href="/settings/blocked" class="btn btn-ghost btn-sm" style="border:1px solid var(--border-color)">Bloqueados</a>
    </div>

    <!-- Account Settings Form -->
    <div class="card" style="padding:var(--space-6)">
        <h5 style="margin-bottom:var(--space-6)">Informações da Conta</h5>

        <form action="/settings/account" method="POST">
            <?= $csrfField ?? '' ?>

            <div class="form-group">
                <label class="form-label">E-mail</label>
                <input type="email" class="form-input" value="<?= $authUser->email ?? '' ?>" placeholder="seu@email.com">
                <div class="form-hint">Não verificado. <a href="#">Reenviar verificação</a></div>
            </div>

            <div class="form-group">
                <label class="form-label">Idioma</label>
                <select class="form-select">
                    <option value="pt-BR" <?= ($authUser->language ?? '') === 'pt-BR' ? 'selected' : '' ?>>Português (Brasil)</option>
                    <option value="en" <?= ($authUser->language ?? '') === 'en' ? 'selected' : '' ?>>English</option>
                    <option value="es" <?= ($authUser->language ?? '') === 'es' ? 'selected' : '' ?>>Español</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Tema</label>
                <select class="form-select" onchange="document.documentElement.setAttribute('data-theme', this.value);localStorage.setItem('sn-theme', this.value)">
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="system">Sistema</option>
                </select>
            </div>

            <button type="submit" class="btn btn-primary">Salvar Alterações</button>
        </form>
    </div>

    <!-- Delete Account -->
    <div class="card" style="padding:var(--space-6);margin-top:var(--space-4);border-color:rgba(225,112,85,0.2)">
        <h5 style="color:#E17055;margin-bottom:var(--space-3)">Zona de Perigo</h5>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-4)">
            Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
        </p>
        <form action="/settings/delete-account" method="POST" onsubmit="return confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')">
            <?= $csrfField ?? '' ?>
            <button type="submit" class="btn btn-danger">
                <i class="fas fa-trash"></i> Excluir Minha Conta
            </button>
        </form>
    </div>
</div>
