import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { postController } from '../controllers/post.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createPostSchema, updatePostSchema, createCommentSchema } from '../validators/post.validator';
import { postLimiter, commentLimiter, uploadLimiter } from '../security/rateLimiter';
import config from '../config';

const postUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.resolve(config.upload.dir, 'posts')),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `post-${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (_req: any, file: multer.File, cb: multer.FileFilterCallback) => {
    const allowed = [...config.upload.allowedImageTypes, ...config.upload.allowedVideoTypes];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  },
  limits: { fileSize: 20 * 1024 * 1024, files: 5 },
});

const router = Router();

// All post routes require authentication
router.use(authenticate);

// GET /api/posts/feed - Public feed
router.get('/feed', postController.getFeed);

// GET /api/posts/user/:username - Posts by user
router.get('/user/:username', postController.getByUser);

// POST /api/posts/upload - Upload media for post
router.post('/upload', uploadLimiter, postUpload.array('media', 5), (req, res) => {
  const files = (req.files as multer.File[]) || [];
  const urls = files.map((f) => `/uploads/posts/${f.filename}`);
  res.json({ urls, media: urls[0] || null });
});

// POST /api/posts - Create post (with rate limiting)
router.post('/', postLimiter, validate(createPostSchema), postController.create);

// GET /api/posts/:id - Get post by ID
router.get('/:id', postController.getById);

// PUT /api/posts/:id - Update post
router.put('/:id', validate(updatePostSchema), postController.update);

// DELETE /api/posts/:id - Delete post
router.delete('/:id', postController.delete);

// POST /api/posts/:id/like - Toggle like
router.post('/:id/like', postController.toggleLike);

// GET /api/posts/:id/comments - Get comments
router.get('/:id/comments', postController.getComments);

// POST /api/posts/:id/comments - Create comment (with rate limiting)
router.post('/:id/comments', commentLimiter, validate(createCommentSchema), postController.createComment);

export default router;
