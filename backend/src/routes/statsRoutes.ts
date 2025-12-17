// backend/src/routes/statsRoutes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getTikTokStats } from '../services/stats/tiktokStats';
import { getYouTubeStats } from '../services/stats/youtubeStats';
import { getInstagramStats } from '../services/stats/instagramStats';
import { getTwitchStats } from '../services/stats/twitchStats';
import { db } from '../db';
import { platforms } from '../db/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();

router.use(authMiddleware);

router.get('/:platform', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { platform } = req.params;
    
    const [platformData] = await db.select().from(platforms).where(
      and(
        eq(platforms.userId, userId),
        eq(platforms.platform, platform)
      )
    );
    
    if (!platformData) {
      return res.status(404).json({ error: 'Platform not connected' });
    }
    
    let stats;
    switch (platform) {
      case 'tiktok':
        stats = await getTikTokStats(platformData.accessToken);
        break;
      case 'youtube':
        stats = await getYouTubeStats(platformData.accessToken);
        break;
      case 'instagram':
        stats = await getInstagramStats(platformData.accessToken, platformData.platformUserId);
        break;
      case 'twitch':
        stats = await getTwitchStats(platformData.accessToken, process.env.TWITCH_CLIENT_ID!);
        break;
      default:
        return res.status(400).json({ error: 'Invalid platform' });
    }
    
    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
