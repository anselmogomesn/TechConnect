import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { treasureController } from '../controllers/treasure.controller';
import { botController } from '../controllers/bot.controller';

const router = Router();
router.use(authenticate);

// Treasure Hunt
router.get('/treasure/daily', treasureController.getDaily);
router.post('/treasure/search', treasureController.search);

// Bot Assistant
router.post('/bot/chat', botController.chat);
router.get('/bot/welcome', botController.welcome);

export default router;
