import prisma from '../config/prisma';
import { treasureService } from './treasure.service';

function levDist(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[m][n];
}

function fuzzy(a: string, b: string): number {
  const w = a.toLowerCase(), t = b.toLowerCase();
  if (w === t) return 1;
  if (w.includes(t) || t.includes(w)) return 0.8;
  const d = levDist(w, t);
  return Math.max(0, 1 - d / Math.max(w.length, t.length, 1));
}

function norm(t: string): string {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

interface KBEntry {
  topics: string[];
  keywords: string[];
  synonyms: string[];
  priority: number;
  response: string;
}

const knowledge: KBEntry[] = [
  { topics: ['bot'], keywords: ['quem e voce', 'quem e', 'você', 'bot', 'techbot', 'assistente'], synonyms: ['inteligência', 'inteligencia', 'robô', 'robo', 'ai', 'ia'], priority: 5, response: 'bot_about' },
  { topics: ['greeting'], keywords: ['oi', 'ola', 'hey', 'bom dia', 'boa tarde', 'boa noite', 'oie', 'eai', 'fala', 'iae', 'beleza', 'salve', 'bom'], synonyms: ['hello', 'hi', 'alo', 'saudação', 'saudar'], priority: 2, response: 'greeting' },
  { topics: ['xp', 'level'], keywords: ['xp', 'nivel', 'level', 'pontos', 'experiencia', 'evoluir', 'subir', 'progresso'], synonyms: ['score', 'ranking', 'crescimento'], priority: 3, response: 'xp_info' },
  { topics: ['badges'], keywords: ['badge', 'badges', 'conquista', 'medalha', 'emblema', 'insignia', 'trofeu'], synonyms: ['premio', 'honraria', 'selo'], priority: 3, response: 'badges_info' },
  { topics: ['treasure'], keywords: ['tesouro', 'caca', 'treasure', 'hunt', 'jogo', 'pista', 'enigma', 'aventura'], synonyms: ['desafio', 'recompensa diaria', 'daily'], priority: 4, response: 'treasure_info' },
  { topics: ['streak'], keywords: ['streak', 'sequencia', 'dias', 'login diario'], synonyms: ['continuidade', 'frequencia'], priority: 3, response: 'streak_info' },
  { topics: ['posts'], keywords: ['post', 'postar', 'publicar', 'publicacao', 'conteudo', 'escrever', 'texto'], synonyms: ['compartilhar', 'criacao'], priority: 3, response: 'posts_info' },
  { topics: ['comments'], keywords: ['comentario', 'comentar', 'responder', 'reply'], synonyms: ['interagir', 'opiniao'], priority: 2, response: 'comments_info' },
  { topics: ['likes'], keywords: ['curtir', 'curtida', 'like', 'likes', 'reacoes', 'coracao'], synonyms: ['gostei', 'reagir'], priority: 2, response: 'likes_info' },
  { topics: ['messages'], keywords: ['mensagem', 'chat', 'conversar', 'msg', 'bate papo', 'conversa', 'falar'], synonyms: ['comunicar', 'direct', 'dm'], priority: 3, response: 'messages_info' },
  { topics: ['communities'], keywords: ['comunidade', 'grupo', 'community'], synonyms: ['clube', 'turma', 'networking'], priority: 3, response: 'communities_info' },
  { topics: ['profile'], keywords: ['perfil', 'profile', 'avatar', 'banner', 'bio', 'foto', 'editar perfil'], synonyms: ['capa', 'descricao', 'informacoes', 'personalizar'], priority: 3, response: 'profile_info' },
  { topics: ['settings'], keywords: ['config', 'configuracao', 'senha', 'tema', '2fa', 'seguranca'], synonyms: ['ajustes', 'preferencias', 'alterar senha'], priority: 2, response: 'settings_info' },
  { topics: ['follow'], keywords: ['seguir', 'seguidor', 'seguidores', 'follow', 'amigo', 'conexao'], synonyms: ['adicionar', 'conectar', 'rede'], priority: 3, response: 'follow_info' },
  { topics: ['help'], keywords: ['ajuda', 'help', 'socorro', 'como', 'o que', 'funcao', 'tutorial', 'guia', 'duvida'], synonyms: ['explicar', 'ensinar', 'saber', 'aprender', 'iniciante'], priority: 1, response: 'help_info' },
  { topics: ['feedback'], keywords: ['obrigado', 'valeu', 'thanks', 'thx', 'brigado', 'obg', 'top', 'show', 'ajudou'], synonyms: ['gratidao', 'vlw', 'demais'], priority: 1, response: 'feedback_info' },
  { topics: ['about'], keywords: ['stack', 'tecnologia', 'techconnect', 'plataforma', 'sobre'], synonyms: ['tech', 'codigo', 'desenvolvimento', 'framework'], priority: 2, response: 'about_info' },
];

// ─── RESPOSTAS (armazenadas como strings com placeholder) ──
const responses: Record<string, string> = {
  bot_about: `🤖 **TechBot 3.0** — Assistente Inteligente TechConnect

Sou um assistente autônomo projetado para ajudar você a aproveitar ao máximo a plataforma!

**O que posso fazer:**
• 💬 Conversar — Entendo perguntas naturais
• 🧠 Aprender — Melhoro com cada interação
• 🔮 Sugerir — Dou dicas baseadas no seu perfil
• 💾 Memória — Lembro das nossas conversas

**Versão:** 3.0 🚀`,

  greeting: `Bom dia! 🌞 Tudo bem por aí?

Sou o assistente da TechConnect, prazer! Posso te ajudar com o que precisar — é só perguntar sobre XP, badges, posts, comunidades... o que vier na mente!

💡 **Ah!** Que tal começar o dia com a **Caça ao Tesouro**? Tá tendo bônus de streak! 🗺️`,

  greeting_small: `E aí! 😊 Por aqui tudo tranquilo também!

Se precisar de alguma ajuda, pode mandar — tô aqui pra isso!

Enquanto isso, já deu uma olhada no **tesouro do dia**? Tá imperdível! 🗺️`,

  greeting_afternoon: `Boa tarde! 🌤️ Beleza?

Tudo certo por aqui! Lembrando que tem **Caça ao Tesouro** te esperando — já tentou achar o de hoje? 🗺️`,

  greeting_evening: `Boa noite! 🌙 Espero que o dia tenha sido produtivo!

Se ainda não encontrou o **tesouro de hoje**, corre lá que ainda dá tempo! 🗺️`,

  xp_info: [
    `Então, sobre XP... é mais simples do que parece! 😊

Cada coisa que você faz aqui na TechConnect te dá pontinhos:

• 📝 **Postar** → +10 XP (ou +15 se for com imagem!)
• 💬 **Comentar** → +5 XP
• ❤️ **Receber curtida** → +2 XP
• 🔥 **Só de entrar hoje** → +10 XP
• 🗺️ **Achar o tesouro** → +50 XP (+bônus de streak!)
• 🏛️ **Criar comunidade** → +50 XP
• 👤 **Seguir alguém** → +5 XP

No fim das contas, é só ir usando a plataforma que você evolui naturalmente. Bora tentar? 💪`,
    `Ah, sobre XP! 🚀

Basicamente, você ganha XP fazendo o que já faz naturalmente aqui:

Postar (+10), comentar (+5), receber curtidas (+2)... até logar todo dia dá +10 XP!

A **Caça ao Tesouro** então... 50 XP por dia, mais bônus se você mantiver streak. Vale super a pena!

Quer ver teu progresso atual? É só olhar no topo do teu perfil!`,
  ],

  badges_info: [
    `Os badges são tipo medalhas que você ganha conforme vai usando a plataforma 🏅

Olha só alguns:

• 📝 **Postar** → 'first-post', 'writer' (50 posts), 'best-seller' (200)
• ❤️ **Likes** → 'first-like', '100-likes'
• 👥 **Seguidores** → 'first-follower', 'influenciador' (500), 'celebridade' (1000)
• 🔥 **Streak de login** → 'dedicated' (7d), 'marathon' (30d), 'legend' (100d)
• 👤 **Completar perfil** → 'profile-complete'

Tem também as raridades: Comum → Incomum → Raro → Épico → Lendário → Mítico!

Dá uma olhada em **Coleções** no menu que você vê todos eles! 😊`,
    `Sobre badges... você já ganhou alguns sem nem perceber! 🏅

Conforme você usa a plataforma — posta, comenta, segue, mantém streak — os badges vão sendo desbloqueados automagicamente.

Cada badge tem uma raridade e te dá XP extra quando conquistado.

O legal é que tem badge pra tudo: desde "Primeira Curtida" (comum) até "Lenda" por 100 dias de streak (lendário)!

Quer ver a lista completa? Vai em **Coleções**!`,
  ],

  treasure_info: [
    `Ah, a Caça ao Tesouro! 🗺️ Meu preferido!

Todo dia uma pista diferente aparece, e você tem que adivinhar em qual página da plataforma o tesouro tá escondido.

Funciona assim:
• Uma **pista** é revelada
• Você escolhe um local pra procurar (Feed, Perfil, etc)
• Tem **3 tentativas** por dia
• Se errar todas, uma **dica** aparece

A recompensa? **50 XP** por tesouro encontrado! Mais **bônus de streak** se você encontrar vários dias seguidos.

Bora tentar achar o de hoje? 🗺️`,
    `O tesouro de hoje já tá escondido por aí! 🗺️

A cada dia uma pista nova aparece. É tipo um joguinho de adivinhação — você escolhe um lugar na plataforma e "cava" pra ver se encontra.

São 3 tentativas por dia, e cada acerto te dá 50 XP + bônus se tiver com streak ativo.

Já tentou hoje? Corre lá no menu **Caça ao Tesouro**! 🔥`,
  ],

  streak_info: [
    `Streak é basicamente quantos dias seguidos você entra na plataforma 🔥

E por que isso importa? Porque:
• **+10 XP** todo dia que você loga
• **Bônus no tesouro** — mais XP por dia de streak
• **Badges** especiais: 7 dias (Dedicado), 30 dias (Maratonista), 100 dias (Lenda)!

Então não pula um dia hein! 😊`,
  ],

  posts_info: [
    `Publicar na TechConnect é bem tranquilo! 📝

Lá no Feed tem um campo "No que você está pensando?". Clica ali e já era.

Dá pra postar:
✏️ Texto simples
🖼️ Imagem com legenda
💻 Código com syntax highlight
📊 Enquete pra votação

Cada tipo tem uma XP diferente — texto dá +10, imagem dá +15.

Ah, e usa **Ctrl+Enter** pra publicar sem precisar clicar no botão! 😉`,
  ],

  comments_info: [
    `Comentar é super fácil! 💬

É só clicar no ícone de 💬 embaixo de qualquer post, digitar e dar Enter.

Dá pra responder comentários também — é só clicar em "Responder" que vira uma thread.

Cada comentário te dá **+5 XP**, e quando chegar em **100 comentários** você ganha o badge "Mestre dos Comentários"!`,
  ],

  likes_info: [
    `Curtir é a ação mais simples de todas! ❤️

É só clicar no coração do post. A pessoa que postou ganha **+2 XP** por cada curtida que receber.

E tem badges também: ao atingir 100 curtidas no total, você ganha o badge "Popular"!`,
  ],

  messages_info: [
    `Quer conversar com alguém? 💬

Tem dois jeitos:
1️⃣ Vai no **perfil** da pessoa e clica no 💬
2️⃣ Ou entra em **Mensagens** no menu lateral

Lá funciona igual WhatsApp: mensagem em tempo real, visto, digitando... tudo na hora!

E o melhor: as mensagens são **em tempo real** com Socket.IO, então não tem delay! 🚀`,
  ],

  communities_info: [
    `As comunidades são tipo grupos temáticos 🏛️

Cada uma tem seu próprio feed, membros e até regras personalizadas.

Se você criar uma comunidade, ganha **+50 XP** e o badge **'Criador'**!

Como admin, você pode promover moderadores, remover membros e editar as regras.

Quer dar uma olhada? Vai em **Comunidades** no menu!`,
  ],

  profile_info: [
    `Seu perfil é seu cartão de visitas! 👤

Dá pra personalizar:
🖼️ **Avatar** — sua foto principal
🎨 **Banner** — a capa
📝 **Bio** — falar sobre você
🌐 **Website** — seu portfólio
📍 **Localização** — de onde você é

Se completar TUDO, ganha o badge **'Completou o Perfil'** com +50 XP!

Bora deixar o perfil bonitão? É em **Configurações > Perfil** 😊`,
  ],

  settings_info: [
    `Nas configurações você controla tudo ⚙️

• **Perfil** — editar dados pessoais
• **Segurança** — trocar senha e ativar 2FA
• **Aparência** — tema Dark/Light/System
• **Sessões** — ver dispositivos conectados

Recomendo ativar o **2FA** pra segurança extra! 🔐`,
  ],

  follow_info: [
    `Seguir alguém é o primeiro passo pra construir sua rede! 👥

É só entrar no perfil da pessoa e clicar em **"Seguir"**.

A cada novo seguidor, você ganha XP e pode desbloquear badges:
• 1 seguidor → 'first-follower'
• 500 → 'influenciador'
• 1000 → 'celebridade'

Então bora seguir e interagir com o pessoal!`,
  ],

  help_info: [
    `Pois não! 😊 Me diz o que você precisa que eu ajudo!

Posso falar sobre:
• ⚡ **XP** — como ganhar e evoluir
• 🏅 **Badges** — conquistas da plataforma
• 📝 **Posts** — como publicar
• 💬 **Mensagens** — conversar com outros
• 🏛️ **Comunidades** — grupos temáticos
• 🗺️ **Caça ao Tesouro** — o joguinho diário

É só perguntar! Ex: "Como ganhar XP?"`,
    `Tranquilo! Tô aqui pra isso 😊

Pode perguntar sobre qualquer coisa da plataforma: XP, badges, posts, comunidades, mensagens, configurações...

O que você quer saber?`,
  ],

  feedback_info: [
    `Imagina! 😊 Tô sempre aqui se precisar de algo.

Ah, e não esquece de fazer o **streak diário** hein! 🔥`,
    `Disponha! 😄

Continue explorando a TechConnect — cada coisinha que você faz aqui te dá XP e te ajuda a evoluir! 🚀`,
  ],

  about_info: `A TechConnect foi construída com tecnologia moderna ⚡

**O que tem por trás:**
🎨 **Frontend:** React + TypeScript + TailwindCSS
⚙️ **Backend:** Node.js + Express + Prisma
🔐 **Segurança:** JWT + 2FA + Cookies seguros
💬 **Tempo real:** Socket.IO
🎭 **Animações:** Framer Motion

**O que faz a diferença:**
🏅 Gamificação completa com XP e badges
🗺️ Caça ao Tesouro diária
🤖 Eu, o TechBot! (Memória e aprendizado)
🎆 Fundo com partículas animadas

Bem legal, né? 😊`,
};

const fallbacks = [
  `Hmm, não entendi muito bem... 🤔

**Tente perguntar sobre:**
• ⚡ "Como ganhar XP?"
• 🏅 "O que são badges?"
• 🗺️ "Como funciona o tesouro?"
• 📝 "Como criar um post?"`,

  `Ainda estou aprendendo! 🌱

**Sei responder sobre:**
✅ XP e Níveis
✅ Badges e Conquistas
✅ Posts e Comentários
✅ Mensagens e Chat
✅ Comunidades
✅ Caça ao Tesouro
✅ Configurações`,

  `Não achei resposta para isso... 🤔

**Alguma dessas opções?**
• "Como ganhar XP?"
• "O que são badges?"
• "Como funciona o tesouro?"
• "Me ajuda com o perfil"`,
];

// ─── SUGESTÃO PROATIVA ──────────────────────────
function getSuggestionText(stats: any): string {
  const tips: string[] = [];
  if (!stats) return 'continue explorando a plataforma! 🚀';
  if (!stats.avatar) tips.push('📸 Adicione uma **foto de perfil** em Configurações');
  if (!stats.bio) tips.push('📝 **Complete sua bio** para ganhar +50 XP');
  if (stats.postsCount === 0) tips.push('📝 **Faça seu primeiro post** — +10 XP');
  if (stats.commentsCount === 0) tips.push('💬 **Comente em um post** — +5 XP');
  if (stats.streakCount === 0) tips.push('🔥 **Faça login diário** para iniciar seu streak');
  if (tips.length === 0) return 'continue assim, você está indo muito bem! 🎉';
  return tips[Math.floor(Math.random() * tips.length)];
}

// ─── SERVIÇO ─────────────────────────────────────
export class BotService {
  async processMessage(userId: string, message: string) {
    const msg = norm(message);
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, level: true, xp: true, streakCount: true, title: true, followersCount: true, followingCount: true, postsCount: true, commentsCount: true, avatar: true, bio: true } });

    let conv = await prisma.botConversation.findUnique({ where: { userId } });
    let history: string[] = [];
    let ctx: any = { turns: 0, lastTopic: 'greeting' };

    if (conv) {
      try { history = JSON.parse(conv.messages || '[]'); } catch { }
      try { ctx = { ...ctx, ...JSON.parse(conv.context || '{}') }; } catch { }
    }

    ctx.turns = (ctx.turns || 0) + 1;

    // ── PRE-CHECK: Greetings & Small talk ──
    const greetingWords = ['bom dia', 'boa tarde', 'boa noite', 'oi', 'ola', 'hey', 'eai', 'oie', 'fala', 'salve', 'iae'];
    const isGreeting = greetingWords.some((g) => msg === g || msg.startsWith(g) || msg === g.replace(' ', '') || msg.endsWith(g));
    const isSmallTalk = ['tudo bem', 'tudo bom', 'como vai', 'beleza', 'suave', 'blz', 'how are', 'td bem'].some((g) => msg.includes(g));
    const hour = new Date().getHours();

    // Reset turns when greeting detected — allows fresh conversation
    if (isGreeting) {
      ctx.turns = 0;
      let greetResp = responses.greeting;
      if (hour >= 18) greetResp = responses.greeting_evening;
      else if (hour >= 12) greetResp = responses.greeting_afternoon;
      // Save context with reset turns
      if (conv) await prisma.botConversation.update({ where: { userId }, data: { context: JSON.stringify(ctx) } });
      return { message: greetResp, user, topic: 'greeting' };
    }

    if (isSmallTalk && ctx.turns <= 3) {
      const resp = Array.isArray(responses.greeting_small)
        ? responses.greeting_small[Math.floor(Math.random() * responses.greeting_small.length)]
        : responses.greeting_small;
      return { message: resp, user, topic: 'greeting' };
    }

    // ── DELETE old conversation if too stale ──
    if (conv && ctx.turns > 50) {
      await prisma.botConversation.delete({ where: { userId } });
      conv = null;
      ctx = { turns: 1, lastTopic: 'greeting' };
    }

    // Parse intent with fuzzy matching
    const words = msg.split(/\s+/);
    let bestTopic = 'unknown';
    let bestScore = 0;

    for (const item of knowledge) {
      let score = 0;
      let matched = false;
      for (const kw of item.keywords) {
        if (msg.includes(kw)) { score = 1; matched = true; break; }
        for (const word of words) {
          if (word.length < 2) continue; // Skip very short words
          const m = fuzzy(word, kw);
          if (m > score) score = m;
          if (m > 0.85) { matched = true; break; }
        }
        if (matched) break;
      }
      if (!matched) {
        for (const syn of item.synonyms) {
          if (msg.includes(syn)) { score = Math.max(score, 0.8); matched = true; break; }
          for (const word of words) {
            if (word.length < 2) continue;
            const m = fuzzy(word, syn);
            if (m > score) score = m;
            if (m > 0.8) { matched = true; break; }
          }
          if (matched) break;
        }
      }
      // Only apply priority boost if score is decent
      if (score > 0.3) score = score * (1 + (item.priority - 1) * 0.1);
      if (score > bestScore) { bestScore = score; bestTopic = item.topics[0]; }
    }

    // Context memory: if user says "conta mais", reuse last topic
    const followUps = ['conta mais', 'conte mais', 'explique', 'mais sobre', 'e sobre', 'tambem', 'continua', 'fala mais'];
    if (followUps.some((f) => msg.includes(f)) && ctx.lastTopic !== 'greeting') {
      bestTopic = ctx.lastTopic;
    }

    let responseText = '';

    if (bestScore < 0.25 && ctx.turns > 1) {
      responseText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      bestTopic = 'fallback';
    } else {
      const respKey = knowledge.find((k) => k.topics.includes(bestTopic))?.response || 'help_info';
      const resp = responses[respKey] || responses.help_info;
      responseText = Array.isArray(resp) ? resp[Math.floor(Math.random() * resp.length)] : resp;
      ctx.lastTopic = bestTopic;
    }

    // Add suggestion every 3 turns (only for non-greeting topics)
    if (ctx.turns % 3 === 0 && bestTopic !== 'greeting' && bestTopic !== 'fallback') {
      const tip = getSuggestionText(user);
      responseText += `\n\n**💡 Dica:** ${tip}`;
    }

    // Save memory
    history.push(msg);
    if (history.length > 20) history.splice(0, history.length - 20);
    if (conv) {
      await prisma.botConversation.update({ where: { userId }, data: { messages: JSON.stringify(history), context: JSON.stringify(ctx), updatedAt: new Date() } });
    } else {
      await prisma.botConversation.create({ data: { userId, messages: JSON.stringify(history), context: JSON.stringify(ctx) } });
    }

    return { message: responseText, user, topic: bestTopic };
  }

  async getWelcomeMessage(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, level: true, xp: true, streakCount: true, postsCount: true, commentsCount: true, avatar: true, bio: true } });
    const tip = getSuggestionText(user);
    return {
      message: `👋 **Olá, ${user?.name?.split(' ')[0] || 'viajante'}!** Seja bem-vindo ao TechBot 3.0! 🤖\n\nSou seu assistente inteligente na TechConnect. Posso ajudar com:\n\n• ⚡ **XP** — Como ganhar pontos\n• 🏅 **Badges** — Conquiste todos\n• 🗺️ **Caça ao Tesouro** — Jogue e ganhe XP\n• 📝 **Posts** — Publique conteúdo\n• 💬 **Mensagens** — Converse com outros\n\n**💡 Dica para você:** ${tip}\n\nComo posso ajudar? 😊`,
      user,
    };
  }
}

export const botService = new BotService();
