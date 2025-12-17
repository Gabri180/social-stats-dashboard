// backend/src/services/stats/youtubeStats.ts
import { google } from 'googleapis';

interface YouTubeStatsResponse {
  subscribers: number;
  views: number;
  videos: number;
  channelId: string;
}

export async function getYouTubeStats(accessToken: string): Promise<YouTubeStatsResponse> {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client
    });

    // Obtener información del canal
    const channelResponse = await youtube.channels.list({
      part: ['snippet', 'statistics'],
      mine: true
    });

    const channel = channelResponse.data.items?.[0];

    if (!channel) {
      throw new Error('No YouTube channel found');
    }

    const stats = channel.statistics;

    return {
      subscribers: parseInt(stats?.subscriberCount || '0'),
      views: parseInt(stats?.viewCount || '0'),
      videos: parseInt(stats?.videoCount || '0'),
      channelId: channel.id || ''
    };
  } catch (error: any) {
    console.error('Error fetching YouTube stats:', error.message);
    throw new Error('Failed to fetch YouTube stats');
  }
}

export async function getYouTubeVideos(accessToken: string, maxResults: number = 20) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client
    });

    // Obtener lista de videos del canal
    const response = await youtube.search.list({
      part: ['snippet'],
      forMine: true,
      type: ['video'],
      maxResults: maxResults
    });

    return response.data.items || [];
  } catch (error: any) {
    console.error('Error fetching YouTube videos:', error.message);
    throw new Error('Failed to fetch YouTube videos');
  }
}
