import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';
import { AppError } from '../utils/errors';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.upload.dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = [
    ...config.upload.allowedImageTypes,
    ...config.upload.allowedVideoTypes,
    'application/pdf',
    'application/zip',
    'text/plain',
    'text/csv',
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${file.mimetype} not allowed`, 400, 'INVALID_FILE_TYPE'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 5,
  },
});

export const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.resolve(config.upload.dir, 'avatars')),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `avatar-${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (config.upload.allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files are allowed', 400, 'INVALID_FILE_TYPE'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5MB
});

export const uploadBanner = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.resolve(config.upload.dir, 'banners')),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `banner-${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (config.upload.allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files are allowed', 400, 'INVALID_FILE_TYPE'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024, files: 1 }, // 10MB
});
