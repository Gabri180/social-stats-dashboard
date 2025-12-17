// backend/src/controllers/platformController.ts
import { Request, Response } from 'express';
import { db } from '../db';
import { platforms } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export const getUserPlatforms = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const userPlatforms = await db.select().from(platforms).where(eq(platforms.userId, userId));
    
    res.json({ platforms: userPlatforms });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const disconnectPlatform = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { platformName } = req.params;
    
    await db.delete(platforms).where(
      and(
        eq(platforms.userId, userId),
        eq(platforms.platform, platformName)
      )
    );
    
    res.json({ message: 'Platform disconnected successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
