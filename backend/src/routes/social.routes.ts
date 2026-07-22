import { Router } from 'express';
import { authenticate, optionalAuth } from '../middlewares/auth';
import prisma from '../config/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { pageService } from '../services/page.service';
import { z } from 'zod';

const router = Router();

// ════════════════════════════════════════
// AMIGOS - Sugestões e busca de pessoas
// ════════════════════════════════════════

// GET /api/friends/suggestions - Sugestões de amizade
router.get('/friends/suggestions', authenticate, asyncHandler(async (req, res) => {
  const userId = req.userId!;

  // Get users the current user already follows
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);
  const excludeIds = [userId, ...followingIds];

  // Get users with most followers (popular), excluding already followed
  const suggestions = await prisma.user.findMany({
    where: { id: { notIn: excludeIds }, status: 'ACTIVE', deletedAt: null },
    orderBy: { followersCount: 'desc' },
    take: 20,
    select: { id: true, name: true, surname: true, username: true, avatar: true, level: true, title: true, followersCount: true, bio: true },
  });

  // Get mutual friends count for each suggestion
  const withMutual = await Promise.all(suggestions.map(async (s) => {
    const myFollows = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const theirFollowers = await prisma.follow.findMany({
      where: { followingId: s.id },
      select: { followerId: true },
    });
    const mySet = new Set(myFollows.map((f) => f.followingId));
    const mutualCount = theirFollowers.filter((f) => mySet.has(f.followerId)).length;
    return { ...s, mutualFriends: mutualCount };
  }));

  res.json({ suggestions: withMutual.sort((a, b) => b.mutualFriends - a.mutualFriends) });
}));

// GET /api/friends/search?q=... - Buscar pessoas
router.get('/friends/search', authenticate, asyncHandler(async (req, res) => {
  const q = (req.query.q as string || '').trim();
  const userId = req.userId!;

  if (!q) { res.json({ users: [] }); return; }

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      status: 'ACTIVE',
      OR: [
        { name: { contains: q } },
        { surname: { contains: q } },
        { username: { contains: q } },
        { bio: { contains: q } },
      ],
    },
    take: 30,
    select: { id: true, name: true, surname: true, username: true, avatar: true, level: true, title: true, followersCount: true, bio: true },
  });

  // Check follow status
  const withStatus = await Promise.all(users.map(async (u) => {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: userId, followingId: u.id } },
    });
    return { ...u, isFollowing: !!follow, isOwn: u.id === userId };
  }));

  res.json({ users: withStatus.filter((u) => !u.isOwn) });
}));

// ════════════════════════════════════════
// PÁGINAS
// ════════════════════════════════════════

router.get('/pages', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const result = await pageService.getAll(page);
  res.json(result);
}));

router.get('/pages/:slug', optionalAuth, asyncHandler(async (req, res) => {
  const page = await pageService.getBySlug(req.params.slug, req.userId);
  res.json({ page });
}));

router.post('/pages', authenticate, asyncHandler(async (req, res) => {
  const page = await pageService.create(req.body, req.userId!);
  res.status(201).json({ message: 'Página criada!', page });
}));

router.put('/pages/:slug', authenticate, asyncHandler(async (req, res) => {
  const page = await pageService.update(req.params.slug, req.userId!, req.body);
  res.json({ message: 'Página atualizada!', page });
}));

router.delete('/pages/:slug', authenticate, asyncHandler(async (req, res) => {
  await pageService.remove(req.params.slug, req.userId!);
  res.json({ message: 'Página removida' });
}));

router.post('/pages/:slug/follow', authenticate, asyncHandler(async (req, res) => {
  const result = await pageService.toggleFollow(req.params.slug, req.userId!);
  res.json(result);
}));

router.get('/pages/:slug/posts', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const result = await pageService.getPosts(req.params.slug, page);
  res.json(result);
}));

router.post('/pages/:slug/posts', authenticate, asyncHandler(async (req, res) => {
  const post = await pageService.createPost(req.params.slug, req.userId!, req.body.content);
  res.status(201).json({ message: 'Post publicado na página', post });
}));

// ════════════════════════════════════════
// COMUNIDADES - Recursos extras
// ════════════════════════════════════════

// Transferir propriedade
router.post('/communities/:slug/transfer', authenticate, asyncHandler(async (req, res) => {
  const { userId: targetUserId } = req.body;
  await prisma.communityMember.updateMany({
    where: { community: { slug: req.params.slug }, userId: req.userId, role: 'OWNER' },
    data: { role: 'ADMIN' },
  });
  await prisma.communityMember.update({
    where: { communityId_userId: { communityId: (await prisma.community.findUnique({ where: { slug: req.params.slug } }))!.id, userId: targetUserId } },
    data: { role: 'OWNER' },
  });
  await prisma.community.update({ where: { slug: req.params.slug }, data: { ownerId: targetUserId } });
  res.json({ message: 'Propriedade transferida!' });
}));

export default router;
