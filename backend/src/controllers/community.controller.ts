import { Request, Response } from 'express';
import { communityService } from '../services/community.service';
import { asyncHandler } from '../utils/asyncHandler';

export class CommunityController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const community = await communityService.create(req.body, req.userId!);
    res.status(201).json({ message: 'Comunidade criada', community });
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const result = await communityService.getAll(page);
    res.json(result);
  });

  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const community = await communityService.getBySlug(req.params.slug, req.userId);
    res.json({ community });
  });

  join = asyncHandler(async (req: Request, res: Response) => {
    const result = await communityService.join(req.params.slug, req.userId!);
    res.json(result);
  });

  leave = asyncHandler(async (req: Request, res: Response) => {
    const result = await communityService.leave(req.params.slug, req.userId!);
    res.json(result);
  });

  getMembers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const result = await communityService.getMembers(req.params.slug, page);
    res.json(result);
  });

  // NOVOS
  update = asyncHandler(async (req: Request, res: Response) => {
    const community = await communityService.update(req.params.slug, req.userId!, req.body);
    res.json({ message: 'Comunidade atualizada', community });
  });

  removeMember = asyncHandler(async (req: Request, res: Response) => {
    await communityService.removeMember(req.params.slug, req.userId!, req.params.userId);
    res.json({ message: 'Membro removido' });
  });

  updateMemberRole = asyncHandler(async (req: Request, res: Response) => {
    await communityService.updateMemberRole(req.params.slug, req.userId!, req.params.userId, req.body.role);
    res.json({ message: 'Cargo atualizado' });
  });

  getPosts = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const result = await communityService.getPosts(req.params.slug, page);
    res.json(result);
  });
}

export const communityController = new CommunityController();
