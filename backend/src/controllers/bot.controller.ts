import { Request, Response } from 'express';
import { botService } from '../services/bot.service';
import { asyncHandler } from '../utils/asyncHandler';

export class BotController {
  chat = asyncHandler(async (req: Request, res: Response) => {
    const result = await botService.processMessage(req.userId!, req.body.message);
    res.json(result);
  });

  welcome = asyncHandler(async (req: Request, res: Response) => {
    const result = await botService.getWelcomeMessage(req.userId!);
    res.json(result);
  });
}

export const botController = new BotController();
