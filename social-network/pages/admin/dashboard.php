<!-- ============================================================
 * SocialNet - Admin Dashboard
 * ============================================================ -->

<div style="max-width:var(--max-content-width);margin:0 auto;padding:var(--space-6)">
    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-8);padding-top:var(--space-4)">
        <div>
            <h2 style="margin:0">Painel Administrativo</h2>
            <p style="color:var(--text-secondary);font-size:var(--text-sm);margin-top:var(--space-1)">
                Gerencie sua plataforma SocialNet
            </p>
        </div>
        <div style="display:flex;gap:var(--space-3)">
            <a href="/admin/backup" class="btn btn-outline btn-sm">
                <i class="fas fa-download"></i> Backup
            </a>
            <a href="/admin/settings" class="btn btn-outline btn-sm">
                <i class="fas fa-cog"></i> Configurações
            </a>
        </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid-4" style="gap:var(--space-4)">
        <div class="card stat-card">
            <div class="stat-card-header">
                <div class="stat-card-icon" style="background:var(--primary-bg);color:var(--primary)">
                    <i class="fas fa-users"></i>
                </div>
                <span class="badge badge-success">+12%</span>
            </div>
            <div class="stat-card-value">12.458</div>
            <div class="stat-card-label">Usuários Totais</div>
        </div>

        <div class="card stat-card">
            <div class="stat-card-header">
                <div class="stat-card-icon" style="background:rgba(0,184,148,0.1);color:#00B894">
                    <i class="fas fa-file-alt"></i>
                </div>
                <span class="badge badge-success">+8%</span>
            </div>
            <div class="stat-card-value">48.230</div>
            <div class="stat-card-label">Publicações</div>
        </div>

        <div class="card stat-card">
            <div class="stat-card-header">
                <div class="stat-card-icon" style="background:rgba(253,203,110,0.15);color:#E17055">
                    <i class="fas fa-flag"></i>
                </div>
                <span class="badge badge-danger">+3</span>
            </div>
            <div class="stat-card-value">12</div>
            <div class="stat-card-label">Denúncias Pendentes</div>
        </div>

        <div class="card stat-card">
            <div class="stat-card-header">
                <div class="stat-card-icon" style="background:rgba(116,185,255,0.1);color:#74B9FF">
                    <i class="fas fa-eye"></i>
                </div>
                <span class="badge badge-success">+24%</span>
            </div>
            <div class="stat-card-value">89.2K</div>
            <div class="stat-card-label">Visualizações Hoje</div>
        </div>
    </div>

    <!-- Charts & Activity -->
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--space-6);margin-top:var(--space-6)">
        <!-- Users chart -->
        <div class="card" style="padding:var(--space-6)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6)">
                <h5 style="margin:0">Crescimento de Usuários</h5>
                <select class="form-select" style="width:auto;padding:4px 28px 4px 12px;font-size:var(--text-xs)">
                    <option>Últimos 7 dias</option>
                    <option>Últimos 30 dias</option>
                    <option>Últimos 90 dias</option>
                </select>
            </div>
            <div style="height:300px;display:flex;align-items:flex-end;gap:var(--space-2);padding-top:var(--space-4)">
                <?php
                $chartDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
                $chartData = [65, 72, 58, 85, 90, 78, 95];
                $maxVal = max($chartData);
                foreach ($chartData as $i => $val):
                    $height = ($val / $maxVal) * 100;
                ?>
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:var(--space-2)">
                    <span style="font-size:var(--text-xs);color:var(--text-tertiary)"><?= $val ?></span>
                    <div style="width:100%;height:250px;display:flex;align-items:flex-end;justify-content:center">
                        <div style="width:60%;height:<?= $height ?>%;background:var(--gradient-primary);border-radius:var(--radius-sm) var(--radius-sm) 0 0;transition:height 0.5s;min-height:8px;opacity:<?= 0.4 + ($val / $maxVal) * 0.6 ?>"></div>
                    </div>
                    <span style="font-size:var(--text-xs);color:var(--text-tertiary)"><?= $chartDays[$i] ?></span>
                </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="card" style="padding:var(--space-6)">
            <h5 style="margin-bottom:var(--space-4)">Atividades Recentes</h5>
            <div style="display:flex;flex-direction:column;gap:var(--space-4)">
                <div style="display:flex;align-items:flex-start;gap:var(--space-3);font-size:var(--text-sm)">
                    <div style="width:8px;height:8px;border-radius:50%;background:var(--primary);margin-top:6px;flex-shrink:0"></div>
                    <div>
                        <span style="color:var(--text-primary)">Novo usuário registrado: </span>
                        <strong>joaosilva</strong>
                        <div style="color:var(--text-tertiary);font-size:var(--text-xs)">Há 2 minutos</div>
                    </div>
                </div>
                <div style="display:flex;align-items:flex-start;gap:var(--space-3);font-size:var(--text-sm)">
                    <div style="width:8px;height:8px;border-radius:50%;background:#00B894;margin-top:6px;flex-shrink:0"></div>
                    <div>
                        <span style="color:var(--text-primary)">Publicação denunciada como spam</span>
                        <div style="color:var(--text-tertiary);font-size:var(--text-xs)">Há 15 minutos</div>
                    </div>
                </div>
                <div style="display:flex;align-items:flex-start;gap:var(--space-3);font-size:var(--text-sm)">
                    <div style="width:8px;height:8px;border-radius:50%;background:var(--primary);margin-top:6px;flex-shrink:0"></div>
                    <div>
                        <span style="color:var(--text-primary)">Nova comunidade criada: </span>
                        <strong>Devs Brasil</strong>
                        <div style="color:var(--text-tertiary);font-size:var(--text-xs)">Há 1 hora</div>
                    </div>
                </div>
                <div style="display:flex;align-items:flex-start;gap:var(--space-3);font-size:var(--text-sm)">
                    <div style="width:8px;height:8px;border-radius:50%;background:#E17055;margin-top:6px;flex-shrink:0"></div>
                    <div>
                        <span style="color:var(--text-primary)">Usuário bloqueado: </span>
                        <strong>spammer123</strong>
                        <div style="color:var(--text-tertiary);font-size:var(--text-xs)">Há 2 horas</div>
                    </div>
                </div>
                <div style="display:flex;align-items:flex-start;gap:var(--space-3);font-size:var(--text-sm)">
                    <div style="width:8px;height:8px;border-radius:50%;background:#00B894;margin-top:6px;flex-shrink:0"></div>
                    <div>
                        <span style="color:var(--text-primary)">Backup realizado com sucesso</span>
                        <div style="color:var(--text-tertiary);font-size:var(--text-xs)">Há 3 horas</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div style="margin-top:var(--space-6)">
        <h5 style="margin-bottom:var(--space-4)">Ações Rápidas</h5>
        <div class="grid-4" style="gap:var(--space-4)">
            <a href="/admin/users" class="card card-hover" style="padding:var(--space-5);display:flex;align-items:center;gap:var(--space-4);text-decoration:none">
                <div style="width:48px;height:48px;border-radius:var(--radius-md);background:var(--primary-bg);display:flex;align-items:center;justify-content:center;color:var(--primary)">
                    <i class="fas fa-user-cog"></i>
                </div>
                <div>
                    <div style="font-weight:var(--font-semibold);color:var(--text-primary)">Gerenciar Usuários</div>
                    <div style="font-size:var(--text-xs);color:var(--text-tertiary)">Ver, banir, verificar</div>
                </div>
            </a>

            <a href="/admin/posts" class="card card-hover" style="padding:var(--space-5);display:flex;align-items:center;gap:var(--space-4);text-decoration:none">
                <div style="width:48px;height:48px;border-radius:var(--radius-md);background:rgba(0,184,148,0.1);display:flex;align-items:center;justify-content:center;color:#00B894">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div>
                    <div style="font-weight:var(--font-semibold);color:var(--text-primary)">Moderar Conteúdo</div>
                    <div style="font-size:var(--text-xs);color:var(--text-tertiary)">Publicações e comentários</div>
                </div>
            </a>

            <a href="/admin/reports" class="card card-hover" style="padding:var(--space-5);display:flex;align-items:center;gap:var(--space-4);text-decoration:none">
                <div style="width:48px;height:48px;border-radius:var(--radius-md);background:rgba(225,112,85,0.1);display:flex;align-items:center;justify-content:center;color:#E17055">
                    <i class="fas fa-flag"></i>
                </div>
                <div>
                    <div style="font-weight:var(--font-semibold);color:var(--text-primary)">Denúncias</div>
                    <div style="font-size:var(--text-xs);color:var(--text-tertiary)">12 pendentes</div>
                </div>
            </a>

            <a href="/admin/analytics" class="card card-hover" style="padding:var(--space-5);display:flex;align-items:center;gap:var(--space-4);text-decoration:none">
                <div style="width:48px;height:48px;border-radius:var(--radius-md);background:rgba(116,185,255,0.1);display:flex;align-items:center;justify-content:center;color:#74B9FF">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div>
                    <div style="font-weight:var(--font-semibold);color:var(--text-primary)">Analytics</div>
                    <div style="font-size:var(--text-xs);color:var(--text-tertiary)">Relatórios detalhados</div>
                </div>
            </a>
        </div>
    </div>
</div>
