import { Request, Response } from 'express';
import { treasureService } from '../services/treasure.service';
import { asyncHandler } from '../utils/asyncHandler';

export class TreasureController {
  getDaily = asyncHandler(async (req: Request, res: Response) => {
    const data = await treasureService.getDailyTreasure(req.userId!);
    res.json(data);
  });

  search = asyncHandler(async (req: Request, res: Response) => {
    const result = await treasureService.searchTreasure(req.userId!, req.body.location);
    res.json(result);
  });
}

export const treasureController = new TreasureController();
