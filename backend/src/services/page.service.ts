import prisma from '../config/prisma';
import { NotFoundError, ConflictError } from '../utils/errors';

export class PageService {
  async create(data: { name: string; description?: string; category?: string }, userId: string) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const existing = await prisma.page.findUnique({ where: { slug } });
    if (existing) throw new ConflictError('Já existe uma página com esse nome');

    const page = await prisma.page.create({
      data: { name: data.name, slug, description: data.description, category: data.category, ownerId: userId },
    });

    // Auto-follow the page as creator
    await prisma.pageFollower.create({ data: { pageId: page.id, userId } });
    await prisma.page.update({ where: { id: page.id }, data: { followersCount: 1 } });

    return page;
  }

  async getAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.page.findMany({
        where: { deletedAt: null },
        orderBy: { followersCount: 'desc' },
        skip, take: limit,
        include: { owner: { select: { id: true, name: true, username: true } }, _count: { select: { followers: true } } },
      }),
      prisma.page.count({ where: { deletedAt: null } }),
    ]);
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getBySlug(slug: string, userId?: string) {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        owner: { select: { id: true, name: true, username: true, avatar: true } },
        _count: { select: { followers: true, pagePosts: true } },
      },
    });
    if (!page || page.deletedAt) throw new NotFoundError('Página não encontrada');

    let isFollowing = false;
    if (userId) {
      const follow = await prisma.pageFollower.findUnique({
        where: { pageId_userId: { pageId: page.id, userId } },
      });
      isFollowing = !!follow;
    }

    return { ...page, isFollowing };
  }

  async toggleFollow(slug: string, userId: string) {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page || page.deletedAt) throw new NotFoundError('Página não encontrada');

    const existing = await prisma.pageFollower.findUnique({
      where: { pageId_userId: { pageId: page.id, userId } },
    });

    if (existing) {
      await prisma.pageFollower.delete({ where: { id: existing.id } });
      await prisma.page.update({ where: { id: page.id }, data: { followersCount: { decrement: 1 } } });
      return { following: false };
    }

    await prisma.pageFollower.create({ data: { pageId: page.id, userId } });
    await prisma.page.update({ where: { id: page.id }, data: { followersCount: { increment: 1 } } });
    return { following: true };
  }

  async createPost(slug: string, userId: string, content: string) {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page || page.deletedAt) throw new NotFoundError('Página não encontrada');
    if (page.ownerId !== userId) throw new Error('Apenas o dono pode postar');

    const post = await prisma.pagePost.create({ data: { pageId: page.id, content } });
    await prisma.page.update({ where: { id: page.id }, data: { postsCount: { increment: 1 } } });
    return post;
  }

  async update(slug: string, userId: string, data: { name?: string; description?: string; category?: string }) {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page || page.deletedAt) throw new NotFoundError('Página não encontrada');
    if (page.ownerId !== userId) throw new Error('Apenas o dono pode editar');

    const updateData: any = {};
    if (data.name !== undefined) { updateData.name = data.name; updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;

    return prisma.page.update({ where: { id: page.id }, data: updateData });
  }

  async remove(slug: string, userId: string) {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page || page.deletedAt) throw new NotFoundError('Página não encontrada');
    if (page.ownerId !== userId) throw new Error('Apenas o dono pode remover');
    await prisma.page.update({ where: { id: page.id }, data: { deletedAt: new Date() } });
  }

  async getPosts(slug: string, pageNum = 1, limit = 20) {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) throw new NotFoundError('Página não encontrada');

    const skip = (pageNum - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.pagePost.findMany({
        where: { pageId: page.id },
        orderBy: { createdAt: 'desc' },
        skip, take: limit,
      }),
      prisma.pagePost.count({ where: { pageId: page.id } }),
    ]);
    return { data, pagination: { page: pageNum, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}

export const pageService = new PageService();
