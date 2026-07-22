<!-- ============================================================
 * SocialNet - Registration Page
 * ============================================================ -->

<div class="auth-page" style="align-items:flex-start;padding-top:calc(var(--header-height) + 40px)">
    <div class="auth-container" style="max-width:520px">
        <div class="auth-card animate__animated animate__fadeInUp">
            <!-- Header -->
            <div class="auth-header">
                <div class="auth-logo">
                    <div class="logo-icon"><i class="fas fa-network-wired"></i></div>
                    <?= $appName ?? 'SocialNet' ?>
                </div>
                <h1 class="auth-title">Criar Conta</h1>
                <p class="auth-subtitle">Junte-se a milhares de pessoas no SocialNet</p>
            </div>

            <!-- Flash Messages -->
            <?php if ($flash['error'] ?? false): ?>
                <div class="card" style="background:rgba(225,112,85,0.1);border-color:rgba(225,112,85,0.2);padding:var(--space-4);border-radius:var(--radius-sm);margin-bottom:var(--space-5)">
                    <p style="color:#E17055;font-size:var(--text-sm);margin:0"><?= $flash['error'] ?></p>
                </div>
            <?php endif; ?>

            <!-- Registration Progress -->
            <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-8)">
                <div style="flex:1;height:4px;background:var(--primary);border-radius:var(--radius-full)"></div>
                <div style="flex:1;height:4px;background:var(--bg-tertiary);border-radius:var(--radius-full)"></div>
                <div style="flex:1;height:4px;background:var(--bg-tertiary);border-radius:var(--radius-full)"></div>
            </div>

            <!-- Register Form -->
            <form action="/register" method="POST" enctype="multipart/form-data" data-validate>
                <?= $csrfField ?? '' ?>

                <!-- Step 1: Basic Info -->
                <div class="form-step" data-step="1">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
                        <div class="form-group">
                            <label class="form-label" for="first_name">Nome</label>
                            <input type="text" id="first_name" name="first_name"
                                   class="form-input" placeholder="Seu nome"
                                   data-validate-field="required"
                                   value="<?= $_POST['first_name'] ?? '' ?>" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="last_name">Sobrenome</label>
                            <input type="text" id="last_name" name="last_name"
                                   class="form-input" placeholder="Seu sobrenome"
                                   data-validate-field="required"
                                   value="<?= $_POST['last_name'] ?? '' ?>" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="username">Nome de usuário</label>
                        <input type="text" id="username" name="username"
                               class="form-input" placeholder="exemplo_usuario"
                               data-validate-field="required|username"
                               value="<?= $_POST['username'] ?? '' ?>" required>
                        <div class="form-hint">Mínimo 3 caracteres. Letras, números, _ e .</div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="email">E-mail</label>
                        <input type="email" id="email" name="email"
                               class="form-input" placeholder="seu@email.com"
                               data-validate-field="required|email"
                               value="<?= $_POST['email'] ?? '' ?>" required>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
                        <div class="form-group">
                            <label class="form-label" for="password">Senha</label>
                            <input type="password" id="password" name="password"
                                   class="form-input" placeholder="Crie uma senha"
                                   data-validate-field="required|min:8" data-password-strength
                                   required>
                            <div class="password-strength">
                                <div class="strength-bar"></div>
                                <div class="strength-bar"></div>
                                <div class="strength-bar"></div>
                                <div class="strength-bar"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="password_confirmation">Confirmar senha</label>
                            <input type="password" id="password_confirmation" name="password_confirmation"
                                   class="form-input" placeholder="Repita a senha"
                                   data-validate-field="required|match:password" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="birth_date">Data de Nascimento</label>
                        <input type="date" id="birth_date" name="birth_date"
                               class="form-input"
                               data-validate-field="required"
                               value="<?= $_POST['birth_date'] ?? '' ?>" required>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
                        <div class="form-group">
                            <label class="form-label" for="gender">Gênero</label>
                            <select id="gender" name="gender" class="form-select">
                                <option value="prefer_not_to_say">Prefiro não dizer</option>
                                <option value="male">Masculino</option>
                                <option value="female">Feminino</option>
                                <option value="other">Outro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="marital_status">Estado Civil</label>
                            <select id="marital_status" name="marital_status" class="form-select">
                                <option value="single">Solteiro(a)</option>
                                <option value="married">Casado(a)</option>
                                <option value="relationship">Relacionamento</option>
                                <option value="divorced">Divorciado(a)</option>
                            </select>
                        </div>
                    </div>

                    <button type="button" class="btn btn-primary btn-lg btn-block" onclick="nextStep(1)">
                        Continuar <i class="fas fa-arrow-right"></i>
                    </button>
                </div>

                <!-- Step 2: Profile Info -->
                <div class="form-step" data-step="2" style="display:none">
                    <div class="form-group">
                        <label class="form-label" for="biography">Biografia</label>
                        <textarea id="biography" name="biography" class="form-textarea"
                                  placeholder="Conte um pouco sobre você..." style="min-height:100px"><?= $_POST['biography'] ?? '' ?></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="location">Localização</label>
                        <input type="text" id="location" name="location"
                               class="form-input" placeholder="Cidade, País"
                               value="<?= $_POST['location'] ?? '' ?>">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="profession">Profissão</label>
                        <input type="text" id="profession" name="profession"
                               class="form-input" placeholder="Ex: Desenvolvedor Web"
                               value="<?= $_POST['profession'] ?? '' ?>">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="website">Website</label>
                        <input type="url" id="website" name="website"
                               class="form-input" placeholder="https://seusite.com"
                               data-validate-field="url"
                               value="<?= $_POST['website'] ?? '' ?>">
                    </div>

                    <div style="display:flex;gap:var(--space-3)">
                        <button type="button" class="btn btn-ghost btn-lg" onclick="prevStep(2)">
                            <i class="fas fa-arrow-left"></i> Voltar
                        </button>
                        <button type="button" class="btn btn-primary btn-lg flex-1" onclick="nextStep(2)">
                            Continuar <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <!-- Step 3: Photos & Terms -->
                <div class="form-step" data-step="3" style="display:none">
                    <div class="form-group" data-file-upload>
                        <label class="form-label">Foto de Perfil</label>
                        <div class="upload-trigger"
                             style="width:120px;height:120px;border-radius:var(--radius-full);border:2px dashed var(--border-color);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all var(--transition-fast);margin:0 auto var(--space-4)"
                             onmouseover="this.style.borderColor='var(--primary)';this.style.background='var(--primary-bg)'"
                             onmouseout="this.style.borderColor='var(--border-color)';this.style.background='transparent'">
                            <i class="fas fa-camera" style="font-size:24px;color:var(--text-tertiary);margin-bottom:var(--space-1)"></i>
                            <span style="font-size:var(--text-xs);color:var(--text-tertiary)">Adicionar foto</span>
                        </div>
                        <input type="file" id="avatar" name="avatar" accept="image/*" style="display:none">
                        <div class="upload-preview" style="text-align:center;margin-top:var(--space-2)"></div>
                    </div>

                    <div class="form-group" data-file-upload>
                        <label class="form-label">Foto de Capa</label>
                        <div class="upload-trigger"
                             style="width:100%;height:120px;border-radius:var(--radius-md);border:2px dashed var(--border-color);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all var(--transition-fast)"
                             onmouseover="this.style.borderColor='var(--primary)';this.style.background='var(--primary-bg)'"
                             onmouseout="this.style.borderColor='var(--border-color)';this.style.background='transparent'">
                            <i class="fas fa-image" style="font-size:24px;color:var(--text-tertiary);margin-bottom:var(--space-1)"></i>
                            <span style="font-size:var(--text-xs);color:var(--text-tertiary)">Adicionar capa</span>
                        </div>
                        <input type="file" id="cover" name="cover" accept="image/*" style="display:none">
                        <div class="upload-preview" style="margin-top:var(--space-2)"></div>
                    </div>

                    <div class="form-group">
                        <div class="checkbox-wrapper">
                            <input type="checkbox" id="terms" name="terms" value="1" data-validate-field="required">
                            <label class="checkbox-custom" for="terms"></label>
                            <label for="terms" style="font-size:var(--text-sm);cursor:pointer;color:var(--text-secondary)">
                                Aceito os <a href="#" target="_blank">Termos de Uso</a> e a <a href="#" target="_blank">Política de Privacidade</a>
                            </label>
                        </div>
                    </div>

                    <div style="display:flex;gap:var(--space-3)">
                        <button type="button" class="btn btn-ghost btn-lg" onclick="prevStep(3)">
                            <i class="fas fa-arrow-left"></i> Voltar
                        </button>
                        <button type="submit" class="btn btn-primary btn-lg flex-1">
                            <i class="fas fa-rocket"></i> Criar Conta
                        </button>
                    </div>
                </div>

                <input type="hidden" name="form_step" id="form_step" value="1">
            </form>

            <!-- Social Login -->
            <div class="auth-divider">
                <span>ou cadastre-se com</span>
            </div>

            <div class="auth-social" style="flex-direction:row">
                <a href="/auth/google" class="auth-social-btn" style="flex:1">
                    <i class="fab fa-google" style="color:#DB4437"></i>
                </a>
                <a href="/auth/github" class="auth-social-btn" style="flex:1">
                    <i class="fab fa-github"></i>
                </a>
                <a href="/auth/facebook" class="auth-social-btn" style="flex:1">
                    <i class="fab fa-facebook-f" style="color:#4267B2"></i>
                </a>
            </div>

            <div class="auth-footer">
                Já tem uma conta? <a href="/login">Entrar</a>
            </div>
        </div>
    </div>
</div>

<script>
// Multi-step form navigation
function nextStep(current) {
    const next = current + 1;
    document.querySelector(`[data-step="${current}"]`).style.display = 'none';
    document.querySelector(`[data-step="${next}"]`).style.display = 'block';
    document.getElementById('form_step').value = next;

    // Update progress
    const bars = document.querySelectorAll('.form-step + div .auth-card [style*="display:flex;gap:var(--space-2)"]') ||
                 document.querySelectorAll('[style*="display:flex;gap:var(--space-2);margin-bottom"]');

    // Actually use the progress bar div before form
    const progressBars = document.querySelector('.auth-card > [style*="display:flex;gap:var(--space-2);margin-bottom"]');
    if (progressBars) {
        const barElements = progressBars.querySelectorAll('div');
        barElements.forEach((bar, i) => {
            if (i < next) {
                bar.style.background = 'var(--primary)';
            }
        });
    }
}

function prevStep(current) {
    const prev = current - 1;
    document.querySelector(`[data-step="${current}"]`).style.display = 'none';
    document.querySelector(`[data-step="${prev}"]`).style.display = 'block';
    document.getElementById('form_step').value = prev;
}

// File upload triggers
document.querySelectorAll('[data-file-upload]').forEach(wrapper => {
    const input = wrapper.querySelector('input[type="file"]');
    const trigger = wrapper.querySelector('.upload-trigger');
    trigger?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', function() {
        const preview = wrapper.querySelector('.upload-preview');
        if (this.files?.[0] && preview) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (this.id === 'avatar') {
                    preview.innerHTML = `<img src="${e.target.result}" style="width:80px;height:80px;border-radius:50%;object-fit:cover">`;
                } else {
                    preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100px;border-radius:var(--radius-md);object-fit:cover">`;
                }
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
});
</script>
