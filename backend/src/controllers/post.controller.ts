import { Request, Response } from 'express';
import { postService } from '../services/post.service';
import { asyncHandler } from '../utils/asyncHandler';

export class PostController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const post = await postService.create(req.userId!, req.body);
    res.status(201).json({ message: 'Post created', post });
  });

  getFeed = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const result = await postService.getFeed(page);
    res.json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const post = await postService.findById(req.params.id, req.userId);
    res.json({ post });
  });

  getByUser = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const result = await postService.getByUser(req.params.username, page);
    res.json(result);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const post = await postService.update(req.params.id, req.userId!, req.body);
    res.json({ message: 'Post updated', post });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await postService.delete(req.params.id, req.userId!, req.userRole!);
    res.json({ message: 'Post deleted' });
  });

  toggleLike = asyncHandler(async (req: Request, res: Response) => {
    const result = await postService.toggleLike(req.params.id, req.userId!);
    res.json(result);
  });

  getComments = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const result = await postService.getComments(req.params.id, page);
    res.json(result);
  });

  createComment = asyncHandler(async (req: Request, res: Response) => {
    const { content, parentId } = req.body;
    const comment = await postService.createComment(req.params.id, req.userId!, content, parentId);
    res.status(201).json({ message: 'Comment created', comment });
  });
}

export const postController = new PostController();
