import { Router } from 'express';
import prisma from '../config/prisma';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const q = (req.query.q as string || '').trim();
  const type = req.query.type as string || 'all';
  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;

  if (!q) {
    res.json({ users: [], posts: [], communities: [], pagination: { page, limit, total: 0, totalPages: 0 } });
    return;
  }

  const results: any = {};

  if (type === 'all' || type === 'users') {
    const [users, userTotal] = await Promise.all([
      prisma.user.findMany({
        where: {
          deletedAt: null,
          OR: [
            { name: { contains: q } },
            { surname: { contains: q } },
            { username: { contains: q } },
            { bio: { contains: q } },
          ],
        },
        select: { id: true, name: true, surname: true, username: true, avatar: true, level: true, title: true, bio: true },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.user.count({
        where: {
          deletedAt: null,
          OR: [{ name: { contains: q } }, { surname: { contains: q } }, { username: { contains: q } }],
        },
      }),
    ]);
    results.users = users;
    results.userTotal = userTotal;
  }

  if (type === 'all' || type === 'posts') {
    const [posts, postTotal] = await Promise.all([
      prisma.post.findMany({
        where: { deletedAt: null, isDraft: false, content: { contains: q } },
        select: { id: true, content: true, type: true, createdAt: true, likesCount: true, commentsCount: true, userId: true },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where: { deletedAt: null, isDraft: false, content: { contains: q } } }),
    ]);
    results.posts = posts;
    results.postTotal = postTotal;
  }

  if (type === 'all' || type === 'communities') {
    const [communities, commTotal] = await Promise.all([
      prisma.community.findMany({
        where: { deletedAt: null, OR: [{ name: { contains: q } }, { description: { contains: q } }] },
        select: { id: true, name: true, slug: true, description: true, avatar: true, membersCount: true, category: true },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.community.count({ where: { deletedAt: null, OR: [{ name: { contains: q } }, { description: { contains: q } }] } }),
    ]);
    results.communities = communities;
    results.commTotal = commTotal;
  }

  res.json({
    ...results,
    query: q,
    pagination: { page, limit },
  });
}));

export default router;
