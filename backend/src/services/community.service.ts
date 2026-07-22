import prisma from '../config/prisma';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/errors';
import { logger } from '../utils/logger';
import { gamificationService } from './gamification.service';

export class CommunityService {
  async create(data: { name: string; description?: string; category?: string }, userId: string) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const existing = await prisma.community.findUnique({ where: { slug } });
    if (existing) throw new ConflictError('Community name already taken');

    const community = await prisma.community.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        category: data.category,
        ownerId: userId,
      },
    });

    // Add creator as owner
    await prisma.communityMember.create({
      data: { communityId: community.id, userId, role: 'OWNER' },
    });

    // Update member count
    await prisma.community.update({
      where: { id: community.id },
      data: { membersCount: 1 },
    });

    // Gamification
    await gamificationService.awardXp(userId, 50, 'Criou comunidade');
    await gamificationService.onCommunityCreated(userId);

    logger.info(`Community created: ${community.slug} by ${userId}`);
    return community;
  }

  async getAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.community.findMany({
        where: { deletedAt: null },
        orderBy: { membersCount: 'desc' },
        skip,
        take: limit,
        include: {
          owner: { select: { id: true, name: true, username: true, avatar: true } },
          _count: { select: { members: true } },
        },
      }),
      prisma.community.count({ where: { deletedAt: null } }),
    ]);

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getBySlug(slug: string, userId?: string) {
    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        owner: { select: { id: true, name: true, username: true, avatar: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, username: true, avatar: true, level: true } },
          },
          take: 20,
          orderBy: { role: 'asc' },
        },
        _count: { select: { members: true } },
      },
    });

    if (!community || community.deletedAt) throw new NotFoundError('Community not found');

    let userRole = null;
    if (userId) {
      const membership = await prisma.communityMember.findUnique({
        where: { communityId_userId: { communityId: community.id, userId } },
      });
      userRole = membership?.role || null;
    }

    return { ...community, userRole };
  }

  async join(slug: string, userId: string) {
    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community || community.deletedAt) throw new NotFoundError('Community not found');

    const existing = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: community.id, userId } },
    });
    if (existing) throw new ConflictError('Already a member');

    await prisma.communityMember.create({
      data: { communityId: community.id, userId, role: 'MEMBER' },
    });
    await prisma.community.update({
      where: { id: community.id },
      data: { membersCount: { increment: 1 } },
    });

    await gamificationService.awardXp(userId, 5, 'Entrou em comunidade');

    return { joined: true };
  }

  async leave(slug: string, userId: string) {
    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community || community.deletedAt) throw new NotFoundError('Community not found');
    if (community.ownerId === userId) throw new ForbiddenError('Owner cannot leave, transfer ownership first');

    const membership = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: community.id, userId } },
    });
    if (!membership) throw new NotFoundError('Not a member');

    await prisma.communityMember.delete({ where: { id: membership.id } });
    await prisma.community.update({
      where: { id: community.id },
      data: { membersCount: { decrement: 1 } },
    });

    return { joined: false };
  }

  async getMembers(slug: string, page = 1, limit = 20) {
    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundError('Community not found');

    const skip = (page - 1) * limit;
    const [members, total] = await Promise.all([
      prisma.communityMember.findMany({
        where: { communityId: community.id },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, username: true, avatar: true, level: true, title: true } },
        },
        orderBy: { role: 'asc' },
      }),
      prisma.communityMember.count({ where: { communityId: community.id } }),
    ]);

    return { members, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  // ============ NOVOS MÉTODOS ============

  async update(slug: string, userId: string, data: { name?: string; description?: string; category?: string; rules?: string }) {
    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community || community.deletedAt) throw new NotFoundError('Community not found');

    const member = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: community.id, userId } },
    });
    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      throw new ForbiddenError('Only owner or admin can update');
    }

    const updateData: any = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.rules !== undefined) updateData.rules = data.rules;

    const updated = await prisma.community.update({ where: { id: community.id }, data: updateData });
    return updated;
  }

  async removeMember(slug: string, requesterId: string, targetUserId: string) {
    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community || community.deletedAt) throw new NotFoundError('Community not found');

    const requester = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: community.id, userId: requesterId } },
    });
    if (!requester || (requester.role !== 'OWNER' && requester.role !== 'ADMIN')) {
      throw new ForbiddenError('Only admin can remove members');
    }
    if (community.ownerId === targetUserId) throw new ForbiddenError('Cannot remove the owner');

    const target = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: community.id, userId: targetUserId } },
    });
    if (!target) throw new NotFoundError('Member not found');

    await prisma.communityMember.delete({ where: { id: target.id } });
    await prisma.community.update({
      where: { id: community.id },
      data: { membersCount: { decrement: 1 } },
    });
  }

  async updateMemberRole(slug: string, requesterId: string, targetUserId: string, role: string) {
    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community || community.deletedAt) throw new NotFoundError('Community not found');

    const requester = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: community.id, userId: requesterId } },
    });
    if (!requester || requester.role !== 'OWNER') throw new ForbiddenError('Only owner can change roles');

    await prisma.communityMember.update({
      where: { communityId_userId: { communityId: community.id, userId: targetUserId } },
      data: { role: role as any },
    });
  }

  async getPosts(slug: string, page = 1, limit = 20) {
    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundError('Community not found');

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { deletedAt: null, isDraft: false },  // We'll use tags to identify community posts
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, surname: true, username: true, avatar: true, level: true } },
          reactions: { select: { id: true, userId: true, type: true }, take: 5 },
          _count: { select: { comments: true, reactions: true } },
        },
      }),
      prisma.post.count({ where: { deletedAt: null, isDraft: false } }),
    ]);

    return { data: posts, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}

export const communityService = new CommunityService();
