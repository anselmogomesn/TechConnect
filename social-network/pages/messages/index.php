<!-- ============================================================
 * SocialNet - Messages / Chat Page
 * ============================================================ -->

<div class="chat-container">
    <!-- Chat Sidebar -->
    <div class="chat-sidebar">
        <div style="padding:var(--space-5);border-bottom:1px solid var(--border-color)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">
                <h4 style="margin:0">Mensagens</h4>
                <button class="btn btn-primary btn-sm" data-modal="new-chat">
                    <i class="fas fa-pen"></i>
                </button>
            </div>
            <div style="position:relative">
                <i class="fas fa-search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);font-size:var(--text-sm)"></i>
                <input type="text" class="form-input" placeholder="Pesquisar conversas..."
                       style="padding-left:36px;border-radius:var(--radius-full);background:var(--bg-secondary);border:none">
            </div>
        </div>

        <div style="flex:1;overflow-y:auto">
            <!-- Conversation 1 (unread) -->
            <div class="conversation-item active">
                <div class="avatar-badge">
                    <img src="https://i.pravatar.cc/100?u=301" alt="User" class="avatar avatar-md">
                    <span class="status-badge status-online"></span>
                </div>
                <div class="conversation-info">
                    <div class="conversation-name">Ana Beatriz</div>
                    <div class="conversation-preview" style="font-weight:var(--font-semibold);color:var(--text-primary)">
                        Claro! Vamos marcar para amanhã...
                    </div>
                </div>
                <div style="text-align:right;flex-shrink:0">
                    <div class="conversation-time">12:30</div>
                    <div class="conversation-unread">3</div>
                </div>
            </div>

            <!-- Conversation 2 -->
            <div class="conversation-item">
                <div class="avatar-badge">
                    <img src="https://i.pravatar.cc/100?u=302" alt="User" class="avatar avatar-md">
                    <span class="status-badge status-idle"></span>
                </div>
                <div class="conversation-info">
                    <div class="conversation-name">Carlos Mendes</div>
                    <div class="conversation-preview">Obrigado pela ajuda! 🙌</div>
                </div>
                <div style="text-align:right;flex-shrink:0">
                    <div class="conversation-time">Ontem</div>
                </div>
            </div>

            <!-- Conversation 3 -->
            <div class="conversation-item">
                <div class="avatar-badge">
                    <img src="https://i.pravatar.cc/100?u=303" alt="User" class="avatar avatar-md">
                    <span class="status-badge status-offline"></span>
                </div>
                <div class="conversation-info">
                    <div class="conversation-name">Tech Community</div>
                    <div class="conversation-preview">
                        <i class="fas fa-users" style="font-size:10px"></i>
                        Novo membro: João entrou no grupo
                    </div>
                </div>
                <div style="text-align:right;flex-shrink:0">
                    <div class="conversation-time">11:45</div>
                </div>
            </div>

            <!-- Conversation 4 -->
            <div class="conversation-item">
                <div class="avatar-badge">
                    <img src="https://i.pravatar.cc/100?u=304" alt="User" class="avatar avatar-md">
                    <span class="status-badge status-online"></span>
                </div>
                <div class="conversation-info">
                    <div class="conversation-name">Marina Costa</div>
                    <div class="conversation-preview">
                        <i class="fas fa-image" style="font-size:10px"></i>
                        Foto
                    </div>
                </div>
                <div style="text-align:right;flex-shrink:0">
                    <div class="conversation-time">10:20</div>
                </div>
            </div>

            <!-- Conversation 5 -->
            <div class="conversation-item">
                <div class="avatar-badge">
                    <img src="https://i.pravatar.cc/100?u=305" alt="User" class="avatar avatar-md">
                    <span class="status-badge status-offline"></span>
                </div>
                <div class="conversation-info">
                    <div class="conversation-name">Pedro Alves</div>
                    <div class="conversation-preview">Vamos sim! Qual horário?</div>
                </div>
                <div style="text-align:right;flex-shrink:0">
                    <div class="conversation-time">Ontem</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Chat Main -->
    <div class="chat-main">
        <div class="chat-header">
            <div class="avatar-badge">
                <img src="https://i.pravatar.cc/100?u=301" alt="Ana" class="avatar avatar-md">
                <span class="status-badge status-online"></span>
            </div>
            <div style="flex:1">
                <div style="font-weight:var(--font-semibold);font-size:var(--text-base);color:var(--text-primary)">Ana Beatriz</div>
                <div style="font-size:var(--text-xs);color:#00B894">Online</div>
            </div>
            <div style="display:flex;gap:var(--space-1)">
                <button class="nav-icon"><i class="fas fa-phone"></i></button>
                <button class="nav-icon"><i class="fas fa-video"></i></button>
                <button class="nav-icon"><i class="fas fa-info-circle"></i></button>
            </div>
        </div>

        <div class="chat-messages">
            <!-- Received message -->
            <div class="chat-message received">
                <img src="https://i.pravatar.cc/100?u=301" alt="Ana" class="avatar avatar-sm">
                <div>
                    <div class="chat-bubble">Oi! Tudo bem? 😊</div>
                    <div class="chat-time">11:30</div>
                </div>
            </div>

            <!-- Sent message -->
            <div class="chat-message sent">
                <div>
                    <div class="chat-bubble">Tudo sim! E você?</div>
                    <div class="chat-time">11:31</div>
                </div>
            </div>

            <!-- Received -->
            <div class="chat-message received">
                <img src="https://i.pravatar.cc/100?u=301" alt="Ana" class="avatar avatar-sm">
                <div>
                    <div class="chat-bubble">Tudo bem também! Queria saber se você pode me ajudar com o projeto do site...</div>
                    <div class="chat-time">11:32</div>
                </div>
            </div>

            <!-- Sent with multiple lines -->
            <div class="chat-message sent">
                <div>
                    <div class="chat-bubble">Claro! O que você precisa?<br><br>Posso ajudar com o front-end e também com a parte de banco de dados se precisar.</div>
                    <div class="chat-time">11:35</div>
                </div>
            </div>

            <!-- Received with image -->
            <div class="chat-message received">
                <img src="https://i.pravatar.cc/100?u=301" alt="Ana" class="avatar avatar-sm">
                <div>
                    <div class="chat-bubble">Preciso de ajuda com a integração da API. Dá uma olhada nesse layout que fiz:</div>
                    <div style="margin-top:var(--space-2)">
                        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop" alt="Layout" style="border-radius:var(--radius-md);max-width:280px">
                    </div>
                    <div class="chat-time">11:40</div>
                </div>
            </div>

            <!-- Sent -->
            <div class="chat-message sent">
                <div>
                    <div class="chat-bubble">Ficou ótimo! Vamos marcar uma call para alinharmos os detalhes? <br><br>Que tal amanhã às 14h?</div>
                    <div class="chat-time">11:42</div>
                </div>
            </div>

            <!-- Received (unread) -->
            <div class="chat-message received">
                <img src="https://i.pravatar.cc/100?u=301" alt="Ana" class="avatar avatar-sm">
                <div>
                    <div class="chat-bubble" style="background:var(--primary-bg);color:var(--text-primary)">Claro! Vamos marcar para amanhã... 😊</div>
                    <div class="chat-time">12:30</div>
                </div>
            </div>

            <!-- Typing indicator -->
            <div class="typing-indicator">
                <img src="https://i.pravatar.cc/100?u=301" alt="Ana" class="avatar avatar-xs">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
                <span style="font-size:var(--text-xs);color:var(--text-tertiary)">Ana está digitando...</span>
            </div>
        </div>

        <!-- Chat Input -->
        <div class="chat-input-area">
            <div class="chat-input-wrapper">
                <input type="text" class="chat-input" placeholder="Digite sua mensagem..." autofocus>
                <div style="display:flex;gap:var(--space-1)">
                    <button class="comment-tool" title="Anexar arquivo">
                        <i class="fas fa-paperclip"></i>
                    </button>
                    <button class="comment-tool" data-emoji-picker data-target=".chat-input" title="Emoji">
                        <i class="far fa-smile"></i>
                    </button>
                    <button class="btn btn-primary btn-icon btn-sm" title="Enviar">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- New Chat Modal -->
<div class="modal-backdrop" id="new-chat">
    <div class="modal">
        <div class="modal-header">
            <h3 class="modal-title">Nova Conversa</h3>
            <button class="modal-close" onclick="document.getElementById('new-chat').classList.remove('show')">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Pesquisar pessoas..." style="border-radius:var(--radius-full);background:var(--bg-secondary);border:none;padding-left:36px">
            </div>
            <div style="display:flex;flex-direction:column;gap:var(--space-2);margin-top:var(--space-4)">
                <?php for ($i = 1; $i <= 5; $i++): ?>
                <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3);border-radius:var(--radius-sm);cursor:pointer" class="hover-bg-secondary">
                    <img src="https://i.pravatar.cc/100?u=40<?= $i ?>" alt="User" class="avatar avatar-md">
                    <div style="flex:1">
                        <div style="font-size:var(--text-sm);font-weight:var(--font-medium)">Usuário <?= $i ?></div>
                        <div style="font-size:var(--text-xs);color:var(--text-tertiary)">@usuario<?= $i ?></div>
                    </div>
                    <input type="checkbox" style="width:18px;height:18px;accent-color:var(--primary)">
                </div>
                <?php endfor; ?>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-ghost" onclick="document.getElementById('new-chat').classList.remove('show')">Cancelar</button>
            <button class="btn btn-primary">Iniciar conversa</button>
        </div>
    </div>
</div>

<script>
// Hover effect for new chat items
document.querySelectorAll('.hover-bg-secondary').forEach(el => {
    el.addEventListener('mouseenter', () => el.style.background = 'var(--bg-secondary)');
    el.addEventListener('mouseleave', () => el.style.background = 'transparent');
});
</script>
