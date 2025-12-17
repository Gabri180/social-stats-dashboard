// backend/src/services/tiktokService.ts
import axios from 'axios';

interface TikTokStats {
  followers: number;
  following: number;
  likes: number;
  videos: number;
}

interface TikTokVideo {
  id: string;
  title: string;
  create_time: number;
  cover_image_url: string;
  share_url: string;
  video_description: string;
  duration: number;
  height: number;
  width: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
}

export class TikTokService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getUserStats(): Promise<TikTokStats> {
    try {
      const response = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          fields: 'follower_count,following_count,likes_count,video_count'
        }
      });

      const user = response.data.data.user;

      return {
        followers: user.follower_count,
        following: user.following_count,
        likes: user.likes_count,
        videos: user.video_count
      };
    } catch (error: any) {
      console.error('Error fetching TikTok stats:', error.response?.data || error.message);
      throw new Error('Failed to fetch TikTok stats');
    }
  }

  async getUserVideos(maxCount: number = 20): Promise<TikTokVideo[]> {
    try {
      const response = await axios.post('https://open.tiktokapis.com/v2/video/list/', {
        max_count: maxCount
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.data.videos || [];
    } catch (error: any) {
      console.error('Error fetching TikTok videos:', error.response?.data || error.message);
      throw new Error('Failed to fetch TikTok videos');
    }
  }

  async getVideoInsights(videoId: string): Promise<any> {
    try {
      const response = await axios.post('https://open.tiktokapis.com/v2/video/query/', {
        filters: {
          video_ids: [videoId]
        },
        fields: [
          'id',
          'create_time',
          'view_count',
          'like_count',
          'comment_count',
          'share_count',
          'download_count'
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.data.videos[0];
    } catch (error: any) {
      console.error('Error fetching video insights:', error.response?.data || error.message);
      throw new Error('Failed to fetch video insights');
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return {
        access_token: response.data.data.access_token,
        refresh_token: response.data.data.refresh_token
      };
    } catch (error: any) {
      console.error('Error refreshing TikTok token:', error.response?.data || error.message);
      throw new Error('Failed to refresh TikTok token');
    }
  }
}
