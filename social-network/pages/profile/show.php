<!-- ============================================================
 * SocialNet - User Profile Page
 * ============================================================ -->

<div style="max-width:var(--max-content-width);margin:0 auto;padding:var(--space-4) var(--space-6)">

    <!-- Profile Cover -->
    <div class="profile-cover">
        <img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=320&fit=crop" alt="Capa do perfil" loading="lazy">
        <div class="profile-cover-overlay"></div>
    </div>

    <!-- Profile Info -->
    <div class="profile-info">
        <div class="profile-avatar-wrapper">
            <img src="https://i.pravatar.cc/400?u=<?= $profileUser->id ?? 1 ?>"
                 alt="Avatar" class="profile-avatar"
                 onerror="this.src='https://ui-avatars.com/api/?name=<?= urlencode(($profileUser->first_name ?? 'U').'+'.($profileUser->last_name ?? 'S')) ?>&background=6C5CE7&color=fff&size=140'">
        </div>

        <div class="profile-details">
            <div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap">
                <h1 class="profile-name">
                    <?= ($profileUser->first_name ?? 'Usuário') . ' ' . ($profileUser->last_name ?? '') ?>
                    <?php if ($profileUser->is_verified ?? false): ?>
                        <i class="fas fa-check-circle" style="color:var(--primary);font-size:var(--text-xl)"></i>
                    <?php endif; ?>
                </h1>
                <?php if (($authUser->id ?? 0) === ($profileUser->id ?? 0)): ?>
                    <a href="/settings/profile" class="btn btn-outline btn-sm">
                        <i class="fas fa-pen"></i> Editar perfil
                    </a>
                <?php else: ?>
                    <button class="btn btn-primary btn-sm">
                        <i class="fas fa-user-plus"></i> Seguir
                    </button>
                    <div class="dropdown" style="display:inline-block">
                        <button class="btn btn-ghost btn-sm" style="border:1.5px solid var(--border-color)">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                        <div class="dropdown-menu">
                            <button class="dropdown-item"><i class="fas fa-envelope"></i> Enviar mensagem</button>
                            <button class="dropdown-item" style="color:#E17055"><i class="fas fa-ban"></i> Bloquear</button>
                        </div>
                    </div>
                <?php endif; ?>
            </div>

            <div class="profile-username">@<?= $profileUser->username ?? 'usuario' ?></div>

            <div class="profile-bio">
                <?= $profileUser->biography ?? 'Sem biografia ainda.' ?>
            </div>

            <?php if ($profileUser->city ?? $profileUser->location ?? false): ?>
                <div style="font-size:var(--text-sm);color:var(--text-secondary);margin-top:var(--space-2)">
                    <i class="fas fa-map-marker-alt" style="color:var(--text-tertiary);width:18px"></i>
                    <?= $profileUser->city ?? $profileUser->location ?? '' ?>
                </div>
            <?php endif; ?>

            <div class="profile-stats">
                <div class="profile-stat">
                    <div class="profile-stat-value">127</div>
                    <div class="profile-stat-label">Publicações</div>
                </div>
                <div class="profile-stat">
                    <div class="profile-stat-value">1.2K</div>
                    <div class="profile-stat-label">Seguidores</div>
                </div>
                <div class="profile-stat">
                    <div class="profile-stat-value">389</div>
                    <div class="profile-stat-label">Seguindo</div>
                </div>
                <div class="profile-stat">
                    <div class="profile-stat-value">2.1K</div>
                    <div class="profile-stat-label">Curtidas</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Profile Content -->
    <div style="display:grid;grid-template-columns:300px 1fr;gap:var(--space-6);margin-top:var(--space-6)">

        <!-- Left Info -->
        <div>
            <!-- About -->
            <div class="card" style="padding:var(--space-5)">
                <h5 style="margin-bottom:var(--space-4)">Sobre</h5>
                <div style="display:flex;flex-direction:column;gap:var(--space-3);font-size:var(--text-sm)">
                    <?php if ($profileUser->profession ?? false): ?>
                        <div style="display:flex;align-items:center;gap:var(--space-3);color:var(--text-secondary)">
                            <i class="fas fa-briefcase" style="width:18px;color:var(--text-tertiary)"></i>
                            <?= $profileUser->profession ?>
                        </div>
                    <?php endif; ?>
                    <?php if ($profileUser->education ?? false): ?>
                        <div style="display:flex;align-items:center;gap:var(--space-3);color:var(--text-secondary)">
                            <i class="fas fa-graduation-cap" style="width:18px;color:var(--text-tertiary)"></i>
                            <?= $profileUser->education ?>
                        </div>
                    <?php endif; ?>
                    <?php if ($profileUser->birth_date ?? false): ?>
                        <div style="display:flex;align-items:center;gap:var(--space-3);color:var(--text-secondary)">
                            <i class="fas fa-birthday-cake" style="width:18px;color:var(--text-tertiary)"></i>
                            <?= date('d/m/Y', strtotime($profileUser->birth_date)) ?>
                        </div>
                    <?php endif; ?>
                    <?php if ($profileUser->website ?? false): ?>
                        <div style="display:flex;align-items:center;gap:var(--space-3)">
                            <i class="fas fa-link" style="width:18px;color:var(--text-tertiary)"></i>
                            <a href="<?= $profileUser->website ?>" target="_blank" rel="noopener"><?= parse_url($profileUser->website, PHP_URL_HOST) ?></a>
                        </div>
                    <?php endif; ?>
                    <div style="display:flex;align-items:center;gap:var(--space-3);color:var(--text-secondary)">
                        <i class="fas fa-calendar-alt" style="width:18px;color:var(--text-tertiary)"></i>
                        Entrou em junho de 2026
                    </div>
                </div>
            </div>

            <!-- Photos -->
            <div class="card" style="padding:var(--space-5);margin-top:var(--space-4)">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">
                    <h5>Fotos</h5>
                    <a href="#" style="font-size:var(--text-xs)">Ver todas</a>
                </div>
                <div class="grid-3" style="gap:var(--space-2)">
                    <?php for ($i = 1; $i <= 6; $i++): ?>
                        <img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&h=100&fit=crop&sig=<?= $i ?>" alt="Foto <?= $i ?>" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:var(--radius-xs)">
                    <?php endfor; ?>
                </div>
            </div>
        </div>

        <!-- Right - Posts -->
        <div>
            <!-- Profile Tabs -->
            <div class="tabs" style="margin-bottom:var(--space-4)">
                <button class="tab active">Publicações</button>
                <button class="tab">Fotos</button>
                <button class="tab">Vídeos</button>
                <button class="tab">Curtidas</button>
            </div>

            <!-- Sample posts -->
            <div class="post-card">
                <div class="post-header">
                    <a href="/@<?= $profileUser->username ?? '' ?>" class="avatar avatar-md" style="flex-shrink:0">
                        <img src="https://i.pravatar.cc/400?u=<?= $profileUser->id ?? 1 ?>"
                             onerror="this.src='https://ui-avatars.com/api/?name=<?= urlencode(($profileUser->first_name ?? 'U').'+'.($profileUser->last_name ?? 'S')) ?>&background=6C5CE7&color=fff&size=80'">
                    </a>
                    <div class="post-user-info">
                        <a href="/@<?= $profileUser->username ?? '' ?>" class="post-user-name">
                            <?= ($profileUser->first_name ?? 'Usuário') . ' ' . ($profileUser->last_name ?? '') ?>
                        </a>
                        <div class="post-user-handle">@<?= $profileUser->username ?? 'usuario' ?> <span class="post-time">3h</span></div>
                    </div>
                </div>
                <div class="post-content">
                    Explorando novas tecnologias para criar experiências incríveis! 🚀 O futuro é agora.
                    <br><br>
                    #Tecnologia #Inovação #Futuro
                </div>
                <div class="post-actions">
                    <button class="post-action"><i class="far fa-thumbs-up"></i> Curtir</button>
                    <button class="post-action"><i class="far fa-comment"></i> Comentar</button>
                    <button class="post-action"><i class="far fa-share-square"></i> Compartilhar</button>
                </div>
            </div>

            <div class="post-card">
                <div class="post-header">
                    <a href="/@<?= $profileUser->username ?? '' ?>" class="avatar avatar-md">
                        <img src="https://i.pravatar.cc/400?u=<?= $profileUser->id ?? 1 ?>"
                             onerror="this.src='https://ui-avatars.com/api/?name=<?= urlencode(($profileUser->first_name ?? 'U').'+'.($profileUser->last_name ?? 'S')) ?>&background=6C5CE7&color=fff&size=80'">
                    </a>
                    <div class="post-user-info">
                        <a href="/@<?= $profileUser->username ?? '' ?>" class="post-user-name">
                            <?= ($profileUser->first_name ?? 'Usuário') . ' ' . ($profileUser->last_name ?? '') ?>
                        </a>
                        <div class="post-user-handle">@<?= $profileUser->username ?? 'usuario' ?> <span class="post-time">1d</span></div>
                    </div>
                </div>
                <div class="post-content">Momento do pôr do sol perfeito 🌅</div>
                <div class="post-media">
                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop" alt="Sunset" loading="lazy">
                </div>
                <div class="post-actions">
                    <button class="post-action liked"><i class="fas fa-thumbs-up"></i> 32 curtidas</button>
                    <button class="post-action"><i class="far fa-comment"></i> Comentar</button>
                    <button class="post-action"><i class="far fa-share-square"></i> Compartilhar</button>
                </div>
            </div>
        </div>
    </div>
</div>
