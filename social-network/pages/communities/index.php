<!-- ============================================================
 * SocialNet - Communities Page
 * ============================================================ -->

<div style="max-width:var(--max-content-width);margin:0 auto;padding:var(--space-6)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-8);padding-top:var(--space-4)">
        <div>
            <h3 style="margin:0">Comunidades</h3>
            <p style="color:var(--text-secondary);font-size:var(--text-sm);margin-top:var(--space-1)">
                Encontre comunidades incríveis para participar
            </p>
        </div>
        <a href="/community/create" class="btn btn-primary">
            <i class="fas fa-plus"></i> Criar Comunidade
        </a>
    </div>

    <!-- Search -->
    <div style="position:relative;margin-bottom:var(--space-6)">
        <i class="fas fa-search" style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--text-tertiary)"></i>
        <input type="text" class="form-input" placeholder="Pesquisar comunidades..." style="padding-left:44px;border-radius:var(--radius-full);border:none;background:var(--bg-secondary)">
    </div>

    <!-- Categories -->
    <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-6);flex-wrap:wrap">
        <button class="chip active">Todas</button>
        <button class="chip">Tecnologia</button>
        <button class="chip">Música</button>
        <button class="chip">Esportes</button>
        <button class="chip">Arte</button>
        <button class="chip">Games</button>
        <button class="chip">Educação</button>
        <button class="chip">Negócios</button>
    </div>

    <!-- Community Cards -->
    <div class="grid-3" style="gap:var(--space-4)">
        <?php for ($i = 1; $i <= 6; $i++):
            $communities = [
                ['name' => 'Devs Brasil', 'members' => '12.4K', 'desc' => 'Comunidade de desenvolvedores brasileiros. Compartilhe conhecimento, tire dúvidas e faça networking.'],
                ['name' => 'Música & Arte', 'members' => '8.7K', 'desc' => 'Para amantes da música e arte em geral. Compartilhe suas criações e descubra novos talentos.'],
                ['name' => 'Tech Inovação', 'members' => '6.2K', 'desc' => 'Discussões sobre tecnologia, inovação e o futuro digital. Novidades e debates quentes.'],
                ['name' => 'Fitness & Saúde', 'members' => '5.8K', 'desc' => 'Dicas de treino, nutrição e bem-estar. Transforme seu estilo de vida com a gente!'],
                ['name' => 'Games Brasil', 'members' => '9.1K', 'desc' => 'Maior comunidade gamer do Brasil. Jogue, converse e participe de torneios.'],
                ['name' => 'Fotografia', 'members' => '4.3K', 'desc' => 'Compartilhe suas melhores fotos, dicas de equipamento e técnicas fotográficas.'],
            ];
            $c = $communities[$i - 1];
        ?>
        <a href="/community/<?= strtolower(str_replace(' ', '-', $c['name'])) ?>" class="card card-hover" style="text-decoration:none;overflow:hidden">
            <div style="height:100px;background:<?= ['var(--gradient-primary)', 'var(--gradient-accent)', 'var(--gradient-secondary)', 'var(--gradient-night)', 'var(--gradient-primary)', 'var(--gradient-accent)'][$i-1] ?>;display:flex;align-items:center;justify-content:center">
                <div style="width:64px;height:64px;border-radius:var(--radius-full);background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;">
                    <i class="fas fa-users" style="font-size:28px;color:white"></i>
                </div>
            </div>
            <div style="padding:var(--space-5)">
                <h5 style="margin-bottom:var(--space-1);color:var(--text-primary)"><?= $c['name'] ?></h5>
                <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-bottom:var(--space-3)">
                    <i class="fas fa-user"></i> <?= $c['members'] ?> membros
                </div>
                <p style="font-size:var(--text-sm);color:var(--text-secondary);margin:0;line-height:var(--leading-relaxed)">
                    <?= $c['desc'] ?>
                </p>
            </div>
            <div style="padding:0 var(--space-5) var(--space-5)">
                <button class="btn btn-outline btn-sm btn-block">Participar</button>
            </div>
        </a>
        <?php endfor; ?>
    </div>
</div>
