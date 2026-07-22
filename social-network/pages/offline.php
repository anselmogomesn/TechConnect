<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - SocialNet</title>
    <link rel="stylesheet" href="/assets/css/app.css">
</head>
<body>
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg-primary)">
        <div style="text-align:center;max-width:400px;padding:var(--space-6)">
            <div style="width:96px;height:96px;border-radius:var(--radius-full);background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-6)">
                <i class="fas fa-wifi-slash" style="font-size:40px;color:var(--text-tertiary)"></i>
            </div>
            <h2 style="margin-bottom:var(--space-3)">Você está offline</h2>
            <p style="color:var(--text-secondary);margin-bottom:var(--space-8)">
                Conecte-se à internet para continuar usando o SocialNet. Seus dados serão sincronizados automaticamente quando você voltar.
            </p>
            <button class="btn btn-primary" onclick="window.location.reload()">
                <i class="fas fa-sync"></i> Tentar novamente
            </button>
        </div>
    </div>
</body>
</html>
