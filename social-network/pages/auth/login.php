<!-- ============================================================
 * SocialNet - Login Page
 * ============================================================ -->

<div class="auth-page">
    <div class="auth-container">
        <div class="auth-card animate__animated animate__fadeInUp">
            <!-- Header -->
            <div class="auth-header">
                <div class="auth-logo">
                    <div class="logo-icon"><i class="fas fa-network-wired"></i></div>
                    <?= $appName ?? 'SocialNet' ?>
                </div>
                <h1 class="auth-title">Bem-vindo de volta</h1>
                <p class="auth-subtitle">Entre na sua conta para continuar</p>
            </div>

            <!-- Flash Messages -->
            <?php if ($flash['error'] ?? false): ?>
                <div class="card" style="background:rgba(225,112,85,0.1);border-color:rgba(225,112,85,0.2);padding:var(--space-4);border-radius:var(--radius-sm);margin-bottom:var(--space-5)">
                    <p style="color:#E17055;font-size:var(--text-sm);margin:0"><?= $flash['error'] ?></p>
                </div>
            <?php endif; ?>

            <?php if ($flash['success'] ?? false): ?>
                <div class="card" style="background:rgba(0,184,148,0.1);border-color:rgba(0,184,148,0.2);padding:var(--space-4);border-radius:var(--radius-sm);margin-bottom:var(--space-5)">
                    <p style="color:#00B894;font-size:var(--text-sm);margin:0"><?= $flash['success'] ?></p>
                </div>
            <?php endif; ?>

            <!-- Login Form -->
            <form action="/login" method="POST" data-validate>
                <?= $csrfField ?? '' ?>

                <div class="form-group">
                    <label class="form-label" for="login">Email ou Usuário</label>
                    <input type="text" id="login" name="login"
                           class="form-input" placeholder="seu@email.com ou usuario"
                           data-validate-field="required"
                           value="<?= $_POST['login'] ?? '' ?>" required autofocus>
                </div>

                <div class="form-group">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2)">
                        <label class="form-label" for="password" style="margin-bottom:0">Senha</label>
                        <a href="/forgot-password" style="font-size:var(--text-xs);font-weight:var(--font-medium)">Esqueceu a senha?</a>
                    </div>
                    <input type="password" id="password" name="password"
                           class="form-input" placeholder="Sua senha"
                           data-validate-field="required|min:8" required>
                </div>

                <div class="form-group" style="display:flex;align-items:center;justify-content:space-between">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" name="remember" id="remember">
                        <label class="checkbox-custom" for="remember"></label>
                        <label for="remember" style="font-size:var(--text-sm);cursor:pointer;color:var(--text-secondary)">Lembrar de mim</label>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-lg btn-block" style="margin-top:var(--space-2)">
                    Entrar
                </button>
            </form>

            <!-- Social Login -->
            <div class="auth-divider">
                <span>ou continue com</span>
            </div>

            <div class="auth-social">
                <a href="/auth/google" class="auth-social-btn">
                    <i class="fab fa-google" style="color:#DB4437"></i>
                    Google
                </a>
                <a href="/auth/github" class="auth-social-btn">
                    <i class="fab fa-github"></i>
                    GitHub
                </a>
                <a href="/auth/facebook" class="auth-social-btn">
                    <i class="fab fa-facebook-f" style="color:#4267B2"></i>
                    Facebook
                </a>
            </div>

            <div class="auth-footer">
                Não tem uma conta? <a href="/register">Cadastre-se</a>
            </div>
        </div>
    </div>
</div>
