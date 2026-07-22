import prisma from '../config/prisma';
import { gamificationService } from './gamification.service';

const TREASURE_CLUES = [
  { location: 'feed', clue: '📜 "Onde as histórias ganham vida. O início da jornada."', hint: 'Procure na página principal de postagens' },
  { location: 'profile', clue: '👤 "Quem és tu? O espelho mostra tua jornada."', hint: 'Visite seu próprio perfil' },
  { location: 'communities', clue: '🏛️ "Juntos somos mais fortes. Onde almas se encontram."', hint: 'Vá para a página de comunidades' },
  { location: 'badges', clue: '⚜️ "Tuas conquistas brilham como estrelas."', hint: 'Olhe suas coleções e badges' },
  { location: 'messages', clue: '💬 "Segredos compartilhados em sussurros digitais."', hint: 'Abra suas mensagens' },
  { location: 'notifications', clue: '🔔 "O sino toca. Novidades te aguardam."', hint: 'Verifique suas notificações' },
  { location: 'settings', clue: '⚙️ "Nos bastidores, onde tudo se ajusta."', hint: 'Vá nas configurações' },
  { location: 'search', clue: '🔍 "O que procuras? O saber está escondido."', hint: 'Use a busca' },
];

export class TreasureService {
  async getDailyTreasure(userId: string) {
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const dayOfYear = new Date().getDate() + new Date().getMonth() * 31;
    const clueIndex = dayOfYear % TREASURE_CLUES.length;
    const dailyClue = TREASURE_CLUES[clueIndex];

    // Upsert today's treasure
    const treasure = await prisma.treasureHunt.upsert({
      where: { date: today },
      update: {},
      create: {
        date: today,
        clue: dailyClue.clue,
        location: dailyClue.location,
        hint: dailyClue.hint,
        xpReward: 50,
      },
    });

    // Get user's find status
    const userFind = await prisma.userTreasureFind.findUnique({
      where: { userId_treasureId: { userId, treasureId: treasure.id } },
    });

    // Check streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const yesterdayFind = await prisma.userTreasureFind.findFirst({
      where: { userId, found: true },
      orderBy: { foundAt: 'desc' },
      include: { treasure: true },
    });

    const streakCount = yesterdayFind?.treasure?.date === yesterday
      ? await this.getStreakCount(userId)
      : 0;

    return {
      id: treasure.id,
      clue: treasure.clue,
      date: treasure.date,
      xpReward: treasure.xpReward,
      streakBonus: (streakCount + 1) * 10,
      found: userFind?.found || false,
      attempts: userFind?.attempts || 0,
      hintsUsed: userFind?.hintsUsed || 0,
      streakCount,
    };
  }

  async searchTreasure(userId: string, location: string) {
    const today = new Date().toISOString().split('T')[0];
    const treasure = await prisma.treasureHunt.findUnique({ where: { date: today } });
    if (!treasure) return { found: false, message: 'Nenhum tesouro hoje...' };

    const userFind = await prisma.userTreasureFind.findUnique({
      where: { userId_treasureId: { userId, treasureId: treasure.id } },
    });

    if (userFind?.found) return { found: true, message: 'Você já encontrou o tesouro hoje!' };

    const attempt = (userFind?.attempts || 0) + 1;
    const correct = location === treasure.location;

    // Upsert attempt
    await prisma.userTreasureFind.upsert({
      where: { userId_treasureId: { userId, treasureId: treasure.id } },
      update: { attempts: attempt, found: correct, foundAt: correct ? new Date() : undefined },
      create: { userId, treasureId: treasure.id, attempts: attempt, found: correct, foundAt: correct ? new Date() : undefined },
    });

    if (correct) {
      const streakCount = await this.getStreakCount(userId);
      const bonus = (streakCount + 1) * 10;
      const totalXp = treasure.xpReward + bonus;

      await gamificationService.awardXp(userId, totalXp, `Tesouro encontrado! Streak: ${streakCount + 1}d`);
      await gamificationService.checkAchievements(userId, 'xp', totalXp);

      return {
        found: true,
        message: `🎉 Tesouro encontrado! +${treasure.xpReward} XP${bonus > 0 ? ` (Streak: +${bonus})` : ''}`,
        xpReward: totalXp,
        streakCount: streakCount + 1,
        attempts: attempt,
      };
    }

    if (attempt >= 3) {
      return {
        found: false,
        message: `❌ Não é aqui... Dica: ${treasure.hint}`,
        hintRevealed: true,
        attempts: attempt,
      };
    }

    return {
      found: false,
      message: `❌ Não é aqui... Tentativa ${attempt}/3`,
      attempts: attempt,
    };
  }

  private async getStreakCount(userId: string): Promise<number> {
    const finds = await prisma.userTreasureFind.findMany({
      where: { userId, found: true },
      orderBy: { foundAt: 'desc' },
      take: 30,
      include: { treasure: true },
    });

    if (finds.length === 0) return 0;

    let streak = 1;
    for (let i = 1; i < finds.length; i++) {
      const prevDate = new Date(finds[i - 1].treasure.date);
      const currDate = new Date(finds[i].treasure.date);
      const diffDays = (prevDate.getTime() - currDate.getTime()) / 86400000;
      if (Math.abs(diffDays - 1) < 0.1) streak++;
      else break;
    }
    return streak;
  }
}

export const treasureService = new TreasureService();
