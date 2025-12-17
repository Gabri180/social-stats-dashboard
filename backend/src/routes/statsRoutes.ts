// backend/src/routes/statsRoutes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getTikTokStats } from '../services/stats/tiktokStats';
import { getYouTubeStats } from '../services/stats/youtubeStats';

const router = Router();

// Endpoint para obtener stats de TikTok
router.get('/tiktok', authMiddleware, async (req: any, res: any) => {
  try {
    // Obtener el access token del usuario de la base de datos
    // const accessToken = await getTokenFromDB(req.user.id, 'tiktok');
    
    // Por ahora devolvemos datos mock
    res.json({
      platform: 'tiktok',
      stats: {
        followers: 45200,
        views: 1200000,
        likes: 89400,
        videos: 156
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener stats de YouTube
router.get('/youtube', authMiddleware, async (req: any, res: any) => {
  try {
    // Por ahora devolvemos datos mock
    res.json({
      platform: 'youtube',
      stats: {
        subscribers: 128500,
        views: 3800000,
        videos: 234
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
