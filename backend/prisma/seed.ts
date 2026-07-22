// ============================================
// ANSELMO - Database Seed
// ============================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================
  // 1. SUPER ADMIN - Anselmo Gomes
  // ============================================
  const adminPassword = await bcrypt.hash('Admin@12345', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'anselmo@anselmo.com' },
    update: {},
    create: {
      email: 'anselmo@anselmo.com',
      password: adminPassword,
      name: 'Anselmo',
      surname: 'Gomes',
      username: 'anselmo',
      bio: 'Criador e Super Administrador da plataforma TechConnect.',
      role: 'SUPER_ADMIN',
      emailVerified: true,
      level: 100,
      xp: 999999,
      totalXpEarned: 999999,
    },
  });

  console.log(`✅ Super Admin criado: ${superAdmin.email}`);

  // ============================================
  // 2. INITIAL LEVELS (1-100)
  // ============================================
  const levels = [];
  for (let i = 1; i <= 100; i++) {
    const xpRequired = Math.floor(100 * Math.pow(i, 1.5) + (i - 1) * 100);
    levels.push({
      level: i,
      xpRequired,
      title: getLevelTitle(i),
      rewards: JSON.stringify(getLevelRewards(i)),
    });
  }

  for (const level of levels) {
    await prisma.level.upsert({
      where: { level: level.level },
      update: level,
      create: level,
    });
  }

  console.log(`✅ ${levels.length} níveis criados`);

  // ============================================
  // 3. BADGES
  // ============================================
  const badges = [
    // General
    { name: 'Primeira Postagem', slug: 'first-post', description: 'Publicou sua primeira postagem', category: 'GENERAL', rarity: 'COMMON', xpReward: 25 },
    { name: 'Primeira Curtida', slug: 'first-like', description: 'Recebeu sua primeira curtida', category: 'GENERAL', rarity: 'COMMON', xpReward: 25 },
    { name: 'Primeiro Seguidor', slug: 'first-follower', description: 'Ganhou seu primeiro seguidor', category: 'SOCIAL', rarity: 'COMMON', xpReward: 25 },
    { name: 'Completou o Perfil', slug: 'profile-complete', description: 'Completou todas as informações do perfil', category: 'GENERAL', rarity: 'COMMON', xpReward: 50 },

    // Social
    { name: 'Popular', slug: '100-likes', description: 'Recebeu 100 curtidas no total', category: 'SOCIAL', rarity: 'UNCOMMON', xpReward: 100 },
    { name: 'Influenciador', slug: '500-followers', description: 'Alcançou 500 seguidores', category: 'SOCIAL', rarity: 'RARE', xpReward: 250 },
    { name: 'Celebridade', slug: '1000-followers', description: 'Alcançou 1000 seguidores', category: 'SOCIAL', rarity: 'EPIC', xpReward: 500 },
    { name: 'Viral', slug: 'viral', description: 'Uma postagem alcançou 100 curtidas', category: 'SOCIAL', rarity: 'RARE', xpReward: 200 },

    // Milestone
    { name: 'Veterano', slug: 'veteran', description: 'Membro há mais de 1 ano', category: 'MILESTONE', rarity: 'RARE', xpReward: 300 },
    { name: 'Dedicado', slug: 'dedicated', description: 'Manteve streak de 7 dias', category: 'MILESTONE', rarity: 'UNCOMMON', xpReward: 150 },
    { name: 'Maratonista', slug: 'marathon', description: 'Manteve streak de 30 dias', category: 'MILESTONE', rarity: 'EPIC', xpReward: 500 },
    { name: 'Lenda', slug: 'legend', description: 'Manteve streak de 100 dias', category: 'MILESTONE', rarity: 'LEGENDARY', xpReward: 2000 },

    // Content
    { name: 'Escritor', slug: 'writer', description: 'Publicou 50 postagens', category: 'CONTENT', rarity: 'UNCOMMON', xpReward: 100 },
    { name: 'Autor Best-Seller', slug: 'best-seller', description: 'Publicou 200 postagens', category: 'CONTENT', rarity: 'RARE', xpReward: 300 },
    { name: 'Mestre dos Comentários', slug: 'comment-master', description: 'Fez 100 comentários', category: 'CONTENT', rarity: 'UNCOMMON', xpReward: 100 },

    // Community
    { name: 'Criador', slug: 'creator', description: 'Criou uma comunidade', category: 'COMMUNITY', rarity: 'COMMON', xpReward: 50 },
    { name: 'Líder Comunitário', slug: 'community-leader', description: 'Comunidade alcançou 100 membros', category: 'COMMUNITY', rarity: 'RARE', xpReward: 300 },

    // Special
    { name: 'Colecionador', slug: 'collector', description: 'Ganhou 10 badges diferentes', category: 'SPECIAL', rarity: 'RARE', xpReward: 500 },
    { name: 'Explorador', slug: 'explorer', description: 'Visitou mais de 50 perfis diferentes', category: 'SPECIAL', rarity: 'UNCOMMON', xpReward: 100 },
    { name: 'Membro Fundador', slug: 'founding-member', description: 'Fez parte dos primeiros 100 usuários', category: 'SPECIAL', rarity: 'LEGENDARY', xpReward: 1000 },
    { name: 'Beta Tester', slug: 'beta-tester', description: 'Participou da fase beta', category: 'SPECIAL', rarity: 'EPIC', xpReward: 500 },

    // Administrative
    { name: 'Moderador', slug: 'moderator', description: 'É um moderador da plataforma', category: 'ADMINISTRATIVE', rarity: 'EPIC', xpReward: 1000 },
    { name: 'Administrador', slug: 'administrator', description: 'É um administrador da plataforma', category: 'ADMINISTRATIVE', rarity: 'LEGENDARY', xpReward: 2000 },
    { name: 'Super Administrador', slug: 'super-admin', description: 'É um super administrador da plataforma', category: 'ADMINISTRATIVE', rarity: 'MYTHIC', xpReward: 5000 },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: badge,
      create: badge,
    });
  }

  console.log(`✅ ${badges.length} badges criadas`);

  // ============================================
  // 4. ACHIEVEMENTS
  // ============================================
  const achievements = [
    // Social Achievements
    { name: 'Primeiros Passos', slug: 'first-steps', description: 'Complete seu perfil e faça sua primeira postagem', category: 'SOCIAL', rarity: 'COMMON', xpReward: 50, maxProgress: 2, criteria: JSON.stringify({ events: ['profile_complete', 'first_post'] }) },
    { name: 'Popularidade', slug: 'popularity', description: 'Acumule 100 curtidas em suas postagens', category: 'SOCIAL', rarity: 'UNCOMMON', xpReward: 100, maxProgress: 100, criteria: JSON.stringify({ event: 'total_likes', target: 100 }) },
    { name: 'Estrela', slug: 'star', description: 'Acumule 1000 curtidas em suas postagens', category: 'SOCIAL', rarity: 'EPIC', xpReward: 500, maxProgress: 1000, criteria: JSON.stringify({ event: 'total_likes', target: 1000 }) },
    { name: 'Rede de Contatos', slug: 'network', description: 'Tenha 50 seguidores', category: 'SOCIAL', rarity: 'UNCOMMON', xpReward: 100, maxProgress: 50, criteria: JSON.stringify({ event: 'followers', target: 50 }) },

    // Content Achievements
    { name: 'Escritor Prolífico', slug: 'prolific-writer', description: 'Publique 100 postagens', category: 'CONTENT', rarity: 'RARE', xpReward: 300, maxProgress: 100, criteria: JSON.stringify({ event: 'posts_count', target: 100 }) },
    { name: 'Mestre do Debate', slug: 'debate-master', description: 'Receba 500 comentários no total', category: 'CONTENT', rarity: 'RARE', xpReward: 300, maxProgress: 500, criteria: JSON.stringify({ event: 'total_comments_received', target: 500 }) },
    { name: 'Engajador', slug: 'engager', description: 'Comente em 50 postagens diferentes', category: 'CONTENT', rarity: 'UNCOMMON', xpReward: 100, maxProgress: 50, criteria: JSON.stringify({ event: 'comments_made', target: 50 }) },

    // Level Achievements
    { name: 'Iniciante', slug: 'level-5', description: 'Alcance o nível 5', category: 'LEVEL', rarity: 'COMMON', xpReward: 50, maxProgress: 5, criteria: JSON.stringify({ event: 'level', target: 5 }) },
    { name: 'Intermediário', slug: 'level-10', description: 'Alcance o nível 10', category: 'LEVEL', rarity: 'UNCOMMON', xpReward: 150, maxProgress: 10, criteria: JSON.stringify({ event: 'level', target: 10 }) },
    { name: 'Avançado', slug: 'level-25', description: 'Alcance o nível 25', category: 'LEVEL', rarity: 'RARE', xpReward: 500, maxProgress: 25, criteria: JSON.stringify({ event: 'level', target: 25 }) },
    { name: 'Especialista', slug: 'level-50', description: 'Alcance o nível 50', category: 'LEVEL', rarity: 'EPIC', xpReward: 1500, maxProgress: 50, criteria: JSON.stringify({ event: 'level', target: 50 }) },
    { name: 'Mestre', slug: 'level-100', description: 'Alcance o nível 100', category: 'LEVEL', rarity: 'LEGENDARY', xpReward: 5000, maxProgress: 100, criteria: JSON.stringify({ event: 'level', target: 100 }) },

    // Streak Achievements
    { name: 'Compromisso', slug: 'streak-7', description: 'Mantenha uma sequência de 7 dias de login', category: 'STREAK', rarity: 'UNCOMMON', xpReward: 100, maxProgress: 7, criteria: JSON.stringify({ event: 'streak', target: 7 }) },
    { name: 'Dedicação', slug: 'streak-30', description: 'Mantenha uma sequência de 30 dias de login', category: 'STREAK', rarity: 'EPIC', xpReward: 500, maxProgress: 30, criteria: JSON.stringify({ event: 'streak', target: 30 }) },
    { name: 'Lenda Viva', slug: 'streak-365', description: 'Mantenha uma sequência de 365 dias de login', category: 'STREAK', rarity: 'MYTHIC', xpReward: 10000, maxProgress: 365, criteria: JSON.stringify({ event: 'streak', target: 365 }) },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: achievement,
      create: achievement,
    });
  }

  console.log(`✅ ${achievements.length} conquistas criadas`);

  // ============================================
  // 5. MISSIONS DAILY/WEEKLY/MONTHLY
  // ============================================
  const missions = [
    // Daily
    { name: 'Login Diário', slug: 'daily-login', description: 'Faça login hoje e ganhe XP extra!', type: 'DAILY', xpReward: 10, maxProgress: 1, isRepeatable: true },
    { name: 'Comentarista', slug: 'daily-comment', description: 'Faça 3 comentários hoje', type: 'DAILY', xpReward: 30, maxProgress: 3, isRepeatable: true },
    { name: 'Social', slug: 'daily-like', description: 'Curta 5 postagens hoje', type: 'DAILY', xpReward: 20, maxProgress: 5, isRepeatable: true },
    { name: 'Criador de Conteúdo', slug: 'daily-post', description: 'Crie 1 postagem hoje', type: 'DAILY', xpReward: 25, maxProgress: 1, isRepeatable: true },

    // Weekly
    { name: 'Engajamento Semanal', slug: 'weekly-engagement', description: 'Receba 20 curtidas nesta semana', type: 'WEEKLY', xpReward: 100, maxProgress: 20, isRepeatable: true },
    { name: 'Conexões', slug: 'weekly-follow', description: 'Siga 5 novos perfis esta semana', type: 'WEEKLY', xpReward: 75, maxProgress: 5, isRepeatable: true },
    { name: 'Criador Semanal', slug: 'weekly-posts', description: 'Crie 5 postagens esta semana', type: 'WEEKLY', xpReward: 100, maxProgress: 5, isRepeatable: true },

    // Monthly
    { name: 'Mestre do Engajamento', slug: 'monthly-engagement', description: 'Acumule 200 curtidas no mês', type: 'MONTHLY', xpReward: 500, maxProgress: 200, isRepeatable: true },
    { name: 'Crescimento', slug: 'monthly-growth', description: 'Ganhe 30 novos seguidores no mês', type: 'MONTHLY', xpReward: 400, maxProgress: 30, isRepeatable: true },
    { name: 'Conteúdo Mensal', slug: 'monthly-content', description: 'Publique 20 postagens no mês', type: 'MONTHLY', xpReward: 300, maxProgress: 20, isRepeatable: true },
  ];

  for (const mission of missions) {
    await prisma.mission.upsert({
      where: { slug: mission.slug },
      update: mission,
      create: mission as any,
    });
  }

  console.log(`✅ ${missions.length} missões criadas`);

  console.log('\n🎉 Seed concluído com sucesso!');
}

function getLevelTitle(level: number): string {
  if (level >= 90) return 'Lendário';
  if (level >= 75) return 'Mestre Supremo';
  if (level >= 60) return 'Grão-Mestre';
  if (level >= 50) return 'Mestre';
  if (level >= 40) return 'Veterano';
  if (level >= 30) return 'Especialista';
  if (level >= 20) return 'Avançado';
  if (level >= 15) return 'Intermediário';
  if (level >= 10) return 'Dedicado';
  if (level >= 5) return 'Ativo';
  if (level >= 3) return 'Iniciante';
  return 'Recruta';
}

function getLevelRewards(level: number): Record<string, any> {
  const rewards: Record<string, any> = {};
  if (level % 5 === 0) rewards.badge = true;
  if (level % 10 === 0) rewards.title = true;
  if (level === 10) rewards.feature = 'custom_profile';
  if (level === 25) rewards.feature = 'custom_badge';
  if (level === 50) rewards.feature = 'verified_badge';
  if (level === 100) rewards.feature = 'legendary_status';
  return rewards;
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
