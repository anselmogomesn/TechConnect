<!-- ============================================================
 * SocialNet - Notifications Page
 * ============================================================ -->

<div style="max-width:720px;margin:0 auto;padding:var(--space-4) var(--space-6)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);padding-top:var(--space-4)">
        <h3 style="margin:0">Notificações</h3>
        <button class="btn btn-ghost btn-sm">
            <i class="fas fa-check-double"></i> Marcar todas como lidas
        </button>
    </div>

    <!-- Today -->
    <div style="font-size:var(--text-xs);font-weight:var(--font-semibold);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:var(--space-3)">Hoje</div>

    <div class="card" style="border:none;box-shadow:none;padding:0">
        <!-- Notification 1 - Like -->
        <div class="conversation-item" style="background:var(--primary-bg);border-radius:var(--radius-sm);margin-bottom:var(--space-1);border:none">
            <div style="width:48px;height:48px;border-radius:var(--radius-full);background:rgba(253,121,168,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i class="fas fa-heart" style="color:#FD79A8;font-size:18px"></i>
            </div>
            <div class="conversation-info">
                <div style="font-size:var(--text-sm);color:var(--text-primary)">
                    <strong>Maria Santos</strong> e mais 5 pessoas curtiram sua publicação
                </div>
                <div class="conversation-time" style="margin-top:2px">Há 5 minutos</div>
            </div>
            <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=48&h=48&fit=crop" alt="Post" style="width:44px;height:44px;border-radius:var(--radius-sm);object-fit:cover">
        </div>

        <!-- Notification 2 - Comment -->
        <div class="conversation-item" style="border-radius:var(--radius-sm);margin-bottom:var(--space-1);border:none">
            <div style="width:48px;height:48px;border-radius:var(--radius-full);background:var(--primary-bg);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i class="fas fa-comment" style="color:var(--primary);font-size:18px"></i>
            </div>
            <div class="conversation-info">
                <div style="font-size:var(--text-sm);color:var(--text-primary)">
                    <strong>Carlos Oliveira</strong> comentou na sua publicação: "Incrível! 👏"
                </div>
                <div class="conversation-time" style="margin-top:2px">Há 12 minutos</div>
            </div>
            <img src="https://i.pravatar.cc/100?u=11" alt="User" class="avatar avatar-md">
        </div>

        <!-- Notification 3 - Follow -->
        <div class="conversation-item" style="border-radius:var(--radius-sm);margin-bottom:var(--space-1);border:none">
            <div style="width:48px;height:48px;border-radius:var(--radius-full);background:rgba(0,206,201,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i class="fas fa-user-plus" style="color:#00CEC9;font-size:18px"></i>
            </div>
            <div class="conversation-info">
                <div style="font-size:var(--text-sm);color:var(--text-primary)">
                    <strong>Ana Beatriz</strong> começou a seguir você
                </div>
                <div class="conversation-time" style="margin-top:2px">Há 30 minutos</div>
            </div>
            <img src="https://i.pravatar.cc/100?u=301" alt="User" class="avatar avatar-md">
            <button class="btn btn-outline btn-sm">Seguir de volta</button>
        </div>

        <!-- Notification 4 - Share -->
        <div class="conversation-item" style="border-radius:var(--radius-sm);border:none">
            <div style="width:48px;height:48px;border-radius:var(--radius-full);background:rgba(253,203,110,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i class="fas fa-retweet" style="color:#FDCB6E;font-size:18px"></i>
            </div>
            <div class="conversation-info">
                <div style="font-size:var(--text-sm);color:var(--text-primary)">
                    <strong>Pedro Alves</strong> compartilhou sua publicação
                </div>
                <div class="conversation-time" style="margin-top:2px">Há 2 horas</div>
            </div>
        </div>
    </div>

    <!-- Yesterday -->
    <div style="font-size:var(--text-xs);font-weight:var(--font-semibold);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:var(--space-3);margin-top:var(--space-6)">Ontem</div>

    <div class="card" style="border:none;box-shadow:none;padding:0">
        <div class="conversation-item" style="border-radius:var(--radius-sm);margin-bottom:var(--space-1);border:none">
            <div style="width:48px;height:48px;border-radius:var(--radius-full);background:var(--primary-bg);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i class="fas fa-at" style="color:var(--primary);font-size:18px"></i>
            </div>
            <div class="conversation-info">
                <div style="font-size:var(--text-sm);color:var(--text-primary)">
                    <strong>Marina Costa</strong> mencionou você em um comentário
                </div>
                <div class="conversation-time" style="margin-top:2px">Ontem às 20:45</div>
            </div>
        </div>

        <div class="conversation-item" style="border-radius:var(--radius-sm);border:none">
            <div style="width:48px;height:48px;border-radius:var(--radius-full);background:rgba(116,185,255,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i class="fas fa-birthday-cake" style="color:#74B9FF;font-size:18px"></i>
            </div>
            <div class="conversation-info">
                <div style="font-size:var(--text-sm);color:var(--text-primary)">
                    <strong>Lucas Ferreira</strong> faz aniversário hoje! 🎂
                </div>
                <div class="conversation-time" style="margin-top:2px">Ontem às 08:00</div>
            </div>
        </div>
    </div>

    <!-- Empty state toggle -->
    <div style="text-align:center;padding:var(--space-8)">
        <button class="btn btn-ghost">Ver notificações antigas</button>
    </div>
</div>
