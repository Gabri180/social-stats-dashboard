// backend/src/services/stats/tiktokStats.ts
import axios from 'axios';

interface TikTokStatsResponse {
  followers: number;
  views: number;
  likes: number;
  videos: number;
}

export async function getTikTokStats(accessToken: string): Promise<TikTokStatsResponse> {
  try {
    const response = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        fields: 'follower_count,following_count,likes_count,video_count'
      }
    });

    const user = response.data.data.user;

    return {
      followers: user.follower_count || 0,
      views: 0, // TikTok no proporciona views totales directamente
      likes: user.likes_count || 0,
      videos: user.video_count || 0
    };
  } catch (error: any) {
    console.error('Error fetching TikTok stats:', error.response?.data || error.message);
    throw new Error('Failed to fetch TikTok stats');
  }
}

export async function getTikTokVideos(accessToken: string, maxCount: number = 20) {
  try {
    const response = await axios.post('https://open.tiktokapis.com/v2/video/list/', {
      max_count: maxCount
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.data.videos || [];
  } catch (error: any) {
    console.error('Error fetching TikTok videos:', error.response?.data || error.message);
    throw new Error('Failed to fetch TikTok videos');
  }
}
