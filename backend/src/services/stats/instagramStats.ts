// backend/src/services/stats/instagramStats.ts
import axios from 'axios';

export const getInstagramStats = async (accessToken: string, userId: string) => {
  // User insights
  const insightsResponse = await axios.get(
    `https://graph.instagram.com/${userId}/insights`,
    {
      params: {
        metric: 'impressions,reach,follower_count,profile_views',
        period: 'day',
        access_token: accessToken
      }
    }
  );
  
  // Media
  const mediaResponse = await axios.get(
    `https://graph.instagram.com/${userId}/media`,
    {
      params: {
        fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count',
        access_token: accessToken
      }
    }
  );
  
  return {
    insights: insightsResponse.data.data,
    media: mediaResponse.data.data
  };
};
