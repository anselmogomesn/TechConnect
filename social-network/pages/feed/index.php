<!-- ============================================================
 * SocialNet - Feed Page
 * ============================================================ -->

<div class="feed-layout" data-feed-container>
    <!-- Main Feed -->
    <div>
        <!-- Stories -->
        <div class="card" style="padding:var(--space-4);margin-bottom:var(--space-4)">
            <div class="stories-container">
                <div class="story-item">
                    <div class="story-circle" style="background:var(--bg-secondary)">
                        <img src="https://i.pravatar.cc/200?u=<?= $authUser->id ?? 0 ?>" alt="Seu Story">
                        <div class="story-add"><i class="fas fa-plus"></i></div>
                    </div>
                    <span class="story-name">Seu Story</span>
                </div>
                <?php for ($i = 1; $i <= 8; $i++): ?>
                <div class="story-item">
                    <div class="story-circle" style="background:var(--gradient-accent)">
                        <img src="https://i.pravatar.cc/200?u=<?= $i * 100 ?>" alt="Story <?= $i ?>">
                    </div>
                    <span class="story-name">Usuário <?= $i ?></span>
                </div>
                <?php endfor; ?>
            </div>
        </div>

        <!-- Post Composer -->
        <div class="card" style="padding:var(--space-5);margin-bottom:var(--space-4)">
            <div class="post-composer" style="display:flex;gap:var(--space-3)">
                <img src="/assets/uploads/avatars/<?= $authUser->avatar ?? 'default-avatar.png' ?>"
                     alt="Seu avatar"
                     class="avatar avatar-md"
                     onerror="this.src='https://ui-avatars.com/api/?name=<?= urlencode(($authUser->first_name ?? 'U').'+'.($authUser->last_name ?? 'S')) ?>&background=6C5CE7&color=fff'">
                <div style="flex:1">
                    <textarea class="form-input" placeholder="No que você está pensando, <?= explode(' ', $authUser->first_name ?? 'usuário')[0] ?>?"
                              style="border:none;background:var(--bg-secondary);border-radius:var(--radius-full);padding:12px 20px;resize:none;cursor:pointer;min-height:44px"
                              readonly
                              onclick="document.querySelector('[data-modal=\"post-create\"]')?.click()"></textarea>
                    <div style="display:flex;gap:var(--space-4);margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border-color)">
                        <button class="post-action" data-modal="post-create" style="gap:var(--space-2)">
                            <i class="fas fa-image" style="color:#00B894"></i>
                            <span>Foto</span>
                        </button>
                        <button class="post-action" data-modal="post-create" style="gap:var(--space-2)">
                            <i class="fas fa-video" style="color:#6C5CE7"></i>
                            <span>Vídeo</span>
                        </button>
                        <button class="post-action" data-modal="post-create" style="gap:var(--space-2)">
                            <i class="fas fa-poll" style="color:#FDCB6E"></i>
                            <span>Enquete</span>
                        </button>
                        <button class="post-action" data-modal="post-create" style="gap:var(--space-2)">
                            <i class="fas fa-smile" style="color:#FD79A8"></i>
                            <span>Sentimento</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Feed Tabs -->
        <div class="tabs" style="margin-bottom:var(--space-4)">
            <button class="tab active" data-tab="recent">Recentes</button>
            <button class="tab" data-tab="following">Seguindo</button>
            <button class="tab" data-tab="popular">Populares</button>
            <button class="tab" data-tab="media">Mídia</button>
        </div>

        <!-- Posts -->
        <div data-post-item>
            <div class="post-card">
                <div class="post-header">
                    <a href="/@usuario1" class="avatar avatar-md" style="flex-shrink:0">
                        <img src="https://i.pravatar.cc/200?u=101" alt="Usuário">
                    </a>
                    <div class="post-user-info">
                        <a href="/@usuario1" class="post-user-name">
                            João Silva
                            <i class="fas fa-check-circle" style="color:var(--primary);font-size:12px" title="Verificado"></i>
                        </a>
                        <div class="post-user-handle">@joaosilva <span class="post-time">2h</span></div>
                    </div>
                    <div class="dropdown">
                        <button class="nav-icon" style="width:32px;height:32px;font-size:var(--text-sm)"
                                onclick="this.closest('.dropdown').querySelector('.dropdown-menu').classList.toggle('show')">
                            <i class="fas fa-ellipsis"></i>
                        </button>
                        <div class="dropdown-menu" style="right:0;left:auto">
                            <button class="dropdown-item"><i class="fas fa-bookmark"></i> Salvar</button>
                            <button class="dropdown-item"><i class="fas fa-link"></i> Copiar link</button>
                            <button class="dropdown-item" style="color:#E17055"><i class="fas fa-flag"></i> Denunciar</button>
                        </div>
                    </div>
                </div>

                <div class="post-content">
                    Acabei de descobrir que o futuro das redes sociais é uma experiência mais autêntica e menos algorítmica.
                    Que tal construirmos juntos essa nova era? 🚀✨
                    <br><br>
                    #Inovação #Futuro #Tecnologia
                </div>

                <div class="post-media">
                    <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop" alt="Post image" loading="lazy">
                </div>

                <!-- Reactions bar -->
                <div style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2) 0 var(--space-3)">
                    <div class="reaction-bar">
                        <span style="display:flex;align-items:center">
                            <span style="font-size:16px;margin-right:4px">❤️</span>
                            <span style="font-size:16px;margin-right:4px;margin-left:-4px">🔥</span>
                            <span style="font-size:16px;margin-left:-4px">👍</span>
                        </span>
                        <span style="font-size:var(--text-xs);color:var(--text-tertiary)">24 curtidas</span>
                    </div>
                    <div style="margin-left:auto;font-size:var(--text-xs);color:var(--text-tertiary)">
                        12 comentários · 5 compartilhamentos
                    </div>
                </div>

                <!-- Action buttons -->
                <div class="post-actions">
                    <button class="post-action" onclick="this.classList.toggle('liked')">
                        <i class="far fa-thumbs-up"></i>
                        <span>Curtir</span>
                    </button>
                    <button class="post-action commented">
                        <i class="far fa-comment"></i>
                        <span>Comentar</span>
                    </button>
                    <button class="post-action shared">
                        <i class="far fa-share-square"></i>
                        <span>Compartilhar</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Post 2 (Poll) -->
        <div data-post-item>
            <div class="post-card">
                <div class="post-header">
                    <a href="/@usuario2" class="avatar avatar-md" style="flex-shrink:0">
                        <img src="https://i.pravatar.cc/200?u=102" alt="Usuário">
                    </a>
                    <div class="post-user-info">
                        <a href="/@usuario2" class="post-user-name">Maria Santos</a>
                        <div class="post-user-handle">@mariasantos <span class="post-time">5h</span></div>
                    </div>
                    <div class="dropdown">
                        <button class="nav-icon" style="width:32px;height:32px;font-size:var(--text-sm)">
                            <i class="fas fa-ellipsis"></i>
                        </button>
                    </div>
                </div>

                <div class="post-content">Qual linguagem de programação você recomenda para iniciantes em 2026?</div>

                <div style="display:flex;flex-direction:column;gap:var(--space-2);margin-bottom:var(--space-4)">
                    <div style="position:relative;background:var(--bg-secondary);border-radius:var(--radius-sm);overflow:hidden;cursor:pointer;padding:var(--space-3) var(--space-4)">
                        <div style="position:absolute;inset:0;background:var(--primary-bg);width:45%;transition:width 0.3s"></div>
                        <span style="position:relative;z-index:1;font-size:var(--text-sm);font-weight:var(--font-medium)">Python</span>
                        <span style="position:relative;z-index:1;float:right;font-size:var(--text-sm);color:var(--primary)">45%</span>
                    </div>
                    <div style="position:relative;background:var(--bg-secondary);border-radius:var(--radius-sm);overflow:hidden;cursor:pointer;padding:var(--space-3) var(--space-4)">
                        <div style="position:absolute;inset:0;background:var(--primary-bg);width:30%;transition:width 0.3s"></div>
                        <span style="position:relative;z-index:1;font-size:var(--text-sm);font-weight:var(--font-medium)">JavaScript</span>
                        <span style="position:relative;z-index:1;float:right;font-size:var(--text-sm);color:var(--primary)">30%</span>
                    </div>
                    <div style="position:relative;background:var(--bg-secondary);border-radius:var(--radius-sm);overflow:hidden;cursor:pointer;padding:var(--space-3) var(--space-4)">
                        <div style="position:absolute;inset:0;background:var(--primary-bg);width:15%;transition:width 0.3s"></div>
                        <span style="position:relative;z-index:1;font-size:var(--text-sm);font-weight:var(--font-medium)">Java</span>
                        <span style="position:relative;z-index:1;float:right;font-size:var(--text-sm);color:var(--primary)">15%</span>
                    </div>
                    <div style="position:relative;background:var(--bg-secondary);border-radius:var(--radius-sm);overflow:hidden;cursor:pointer;padding:var(--space-3) var(--space-4)">
                        <div style="position:absolute;inset:0;background:var(--primary-bg);width:10%;transition:width 0.3s"></div>
                        <span style="position:relative;z-index:1;font-size:var(--text-sm);font-weight:var(--font-medium)">Outra</span>
                        <span style="position:relative;z-index:1;float:right;font-size:var(--text-sm);color:var(--primary)">10%</span>
                    </div>
                    <div style="font-size:var(--text-xs);color:var(--text-tertiary)">1.234 votos · Encerra em 3 dias</div>
                </div>

                <div class="post-actions">
                    <button class="post-action">
                        <i class="far fa-thumbs-up"></i>
                        <span>Curtir</span>
                    </button>
                    <button class="post-action commented">
                        <i class="far fa-comment"></i>
                        <span>Comentar</span>
                    </button>
                    <button class="post-action shared">
                        <i class="far fa-share-square"></i>
                        <span>Compartilhar</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Post 3 (Multiple images) -->
        <div data-post-item>
            <div class="post-card">
                <div class="post-header">
                    <a href="/@usuario3" class="avatar avatar-md" style="flex-shrink:0">
                        <img src="https://i.pravatar.cc/200?u=103" alt="Usuário">
                    </a>
                    <div class="post-user-info">
                        <a href="/@usuario3" class="post-user-name">
                            Tech Brasil
                            <i class="fas fa-check-circle" style="color:var(--primary);font-size:12px" title="Verificado"></i>
                        </a>
                        <div class="post-user-handle">@techbrasil <span class="post-time">1d</span></div>
                    </div>
                </div>

                <div class="post-content">Nosso escritório hoje! Dia produtivo criando a próxima geração da web. 🌐💻</div>

                <div class="post-media-grid" style="border-radius:var(--radius-md);overflow:hidden;margin-bottom:var(--space-4)">
                    <div class="media-item">
                        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop" alt="Office 1" loading="lazy" style="width:100%;height:100%;object-fit:cover">
                    </div>
                    <div class="media-item">
                        <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=200&fit=crop" alt="Office 2" loading="lazy" style="width:100%;height:100%;object-fit:cover">
                    </div>
                    <div class="media-item">
                        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=200&fit=crop" alt="Office 3" loading="lazy" style="width:100%;height:100%;object-fit:cover">
                    </div>
                </div>

                <div class="post-actions">
                    <button class="post-action liked">
                        <i class="fas fa-thumbs-up"></i>
                        <span>89 curtidas</span>
                    </button>
                    <button class="post-action commented">
                        <i class="far fa-comment"></i>
                        <span>Comentar</span>
                    </button>
                    <button class="post-action shared">
                        <i class="far fa-share-square"></i>
                        <span>Compartilhar</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Infinite Scroll Sentinel -->
        <div data-infinite-scroll data-page="1" data-url="/feed" style="display:flex;justify-content:center;padding:var(--space-8)">
            <div class="spinner"></div>
        </div>
    </div>

    <!-- Right Sidebar -->
    <aside style="position:sticky;top:calc(var(--header-height) + 20px)">
        <!-- Profile card -->
        <div class="card" style="text-align:center;overflow:hidden">
            <div style="height:80px;background:var(--gradient-primary);margin:calc(-1px)"></div>
            <div style="margin-top:-32px;padding:0 var(--space-5) var(--space-5)">
                <img src="https://i.pravatar.cc/200?u=<?= $authUser->id ?? 0 ?>"
                     alt="Perfil" class="avatar avatar-xl"
                     style="border:3px solid var(--bg-card);margin-bottom:var(--space-3)"
                     onerror="this.src='https://ui-avatars.com/api/?name=<?= urlencode(($authUser->first_name ?? 'U').'+'.($authUser->last_name ?? 'S')) ?>&background=6C5CE7&color=fff&size=80'">
                <a href="/@<?= $authUser->username ?? '' ?>" style="font-weight:var(--font-semibold);color:var(--text-primary);font-size:var(--text-base)">
                    <?= ($authUser->first_name ?? 'Usuário') . ' ' . ($authUser->last_name ?? '') ?>
                </a>
                <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:var(--space-1)">@<?= $authUser->username ?? 'usuario' ?></div>
                <div style="display:flex;justify-content:center;gap:var(--space-5);margin-top:var(--space-4);font-size:var(--text-xs)">
                    <div><span style="font-weight:var(--font-bold);color:var(--text-primary);display:block">127</span> Seguidores</div>
                    <div><span style="font-weight:var(--font-bold);color:var(--text-primary);display:block">89</span> Seguindo</div>
                    <div><span style="font-weight:var(--font-bold);color:var(--text-primary);display:block">15</span> Posts</div>
                </div>
            </div>
        </div>

        <!-- Trending -->
        <div class="card" style="margin-top:var(--space-4);padding:var(--space-5)">
            <h5 style="margin-bottom:var(--space-4)">Trending no Brasil 🔥</h5>
            <div style="display:flex;flex-direction:column;gap:var(--space-3)">
                <div>
                    <div style="font-size:var(--text-xs);color:var(--text-tertiary)">1 · Tecnologia</div>
                    <a href="/hashtag/Inovação" style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--text-primary)">#Inovação</a>
                    <div style="font-size:var(--text-xs);color:var(--text-tertiary)">12.5K publicações</div>
                </div>
                <div>
                    <div style="font-size:var(--text-xs);color:var(--text-tertiary)">2 · Música</div>
                    <a href="/hashtag/MúsicaNova" style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--text-primary)">#MúsicaNova</a>
                    <div style="font-size:var(--text-xs);color:var(--text-tertiary)">8.2K publicações</div>
                </div>
                <div>
                    <div style="font-size:var(--text-xs);color:var(--text-tertiary)">3 · Esportes</div>
                    <a href="/hashtag/Futebol" style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--text-primary)">#Futebol</a>
                    <div style="font-size:var(--text-xs);color:var(--text-tertiary)">6.8K publicações</div>
                </div>
                <div>
                    <div style="font-size:var(--text-xs);color:var(--text-tertiary)">4 · Tech</div>
                    <a href="/hashtag/IA" style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--text-primary)">#InteligênciaArtificial</a>
                    <div style="font-size:var(--text-xs);color:var(--text-tertiary)">5.1K publicações</div>
                </div>
            </div>
        </div>

        <!-- Suggestions -->
        <div class="card" style="margin-top:var(--space-4);padding:var(--space-5)">
            <h5 style="margin-bottom:var(--space-4)">Sugestões para seguir</h5>
            <div style="display:flex;flex-direction:column;gap:var(--space-4)">
                <div style="display:flex;align-items:center;gap:var(--space-3)">
                    <img src="https://i.pravatar.cc/100?u=201" alt="Sugestão" class="avatar avatar-md">
                    <div style="flex:1;min-width:0">
                        <div style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--text-primary)">Ana Tech</div>
                        <div style="font-size:var(--text-xs);color:var(--text-tertiary)">@anatech</div>
                    </div>
                    <button class="btn btn-outline btn-sm">Seguir</button>
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-3)">
                    <img src="https://i.pravatar.cc/100?u=202" alt="Sugestão" class="avatar avatar-md">
                    <div style="flex:1;min-width:0">
                        <div style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--text-primary)">Pedro Dev</div>
                        <div style="font-size:var(--text-xs);color:var(--text-tertiary)">@pedrodev</div>
                    </div>
                    <button class="btn btn-outline btn-sm">Seguir</button>
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-3)">
                    <img src="https://i.pravatar.cc/100?u=203" alt="Sugestão" class="avatar avatar-md">
                    <div style="flex:1;min-width:0">
                        <div style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--text-primary)">Carla Inovação</div>
                        <div style="font-size:var(--text-xs);color:var(--text-tertiary)">@carlainova</div>
                    </div>
                    <button class="btn btn-outline btn-sm">Seguir</button>
                </div>
            </div>
        </div>

        <!-- Footer links -->
        <div style="padding:var(--space-5);font-size:var(--text-xs);color:var(--text-tertiary);line-height:1.8">
            <a href="#" style="margin-right:var(--space-2)">Sobre</a>
            <a href="#" style="margin-right:var(--space-2)">Privacidade</a>
            <a href="#" style="margin-right:var(--space-2)">Termos</a>
            <a href="#" style="margin-right:var(--space-2)">Cookies</a>
            <div style="margin-top:var(--space-3)">© <?= date('Y') ?> SocialNet</div>
        </div>
    </aside>
</div>

<!-- Create Post Modal -->
<div class="modal-backdrop" id="post-create-modal">
    <div class="modal">
        <div class="modal-header">
            <h3 class="modal-title">Criar Publicação</h3>
            <button class="modal-close" onclick="document.getElementById('post-create-modal').classList.remove('show')">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div style="display:flex;gap:var(--space-3);margin-bottom:var(--space-4)">
                <img src="https://i.pravatar.cc/200?u=<?= $authUser->id ?? 0 ?>"
                     alt="Avatar" class="avatar avatar-md"
                     onerror="this.src='https://ui-avatars.com/api/?name=<?= urlencode(($authUser->first_name ?? 'U').'+'.($authUser->last_name ?? 'S')) ?>&background=6C5CE7&color=fff&size=80'">
                <div>
                    <div style="font-weight:var(--font-semibold);font-size:var(--text-sm)"><?= ($authUser->first_name ?? '') . ' ' . ($authUser->last_name ?? '') ?></div>
                    <select class="form-select" style="width:auto;padding:2px 28px 2px 8px;font-size:var(--text-xs);margin-top:2px">
                        <option>Público</option>
                        <option>Seguidores</option>
                        <option>Apenas amigos</option>
                    </select>
                </div>
            </div>

            <form action="/posts" method="POST" enctype="multipart/form-data">
                <?= $csrfField ?? '' ?>
                <textarea name="content" class="form-textarea" placeholder="No que você está pensando?"
                          style="border:none;font-size:var(--text-lg);min-height:140px;resize:none;padding:0;background:transparent"
                          autofocus></textarea>

                <!-- Media preview area -->
                <div id="post-media-preview" style="display:none"></div>

                <div style="display:flex;align-items:center;justify-content:space-between;padding-top:var(--space-4);border-top:1px solid var(--border-color);margin-top:var(--space-4)">
                    <div style="display:flex;gap:var(--space-2)">
                        <button type="button" class="post-action" title="Adicionar fotos">
                            <i class="fas fa-image" style="color:#00B894"></i>
                        </button>
                        <button type="button" class="post-action" title="Adicionar vídeo">
                            <i class="fas fa-video" style="color:#6C5CE7"></i>
                        </button>
                        <button type="button" class="post-action" title="Adicionar GIF">
                            <i class="fas fa-gift" style="color:#FDCB6E"></i>
                        </button>
                        <button type="button" class="post-action" title="Adicionar enquete">
                            <i class="fas fa-poll" style="color:#E17055"></i>
                        </button>
                        <button type="button" class="post-action" title="Marcar local">
                            <i class="fas fa-map-marker-alt" style="color:#00CEC9"></i>
                        </button>
                        <button type="button" class="post-action" data-emoji-picker data-target="#post-content" title="Adicionar emoji">
                            <i class="far fa-smile"></i>
                        </button>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        Publicar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
// Open create post modal
document.querySelector('[data-modal="post-create"]')?.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('post-create-modal').classList.add('show');
});
</script>
