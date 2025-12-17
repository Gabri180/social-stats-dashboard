// backend/src/services/stats/twitchStats.ts
import axios from 'axios';

export const getTwitchStats = async (accessToken: string, clientId: string) => {
  // Get user info
  const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': clientId
    }
  });
  
  const userId = userResponse.data.data[0].id;
  
  // Get channel info
  const channelResponse = await axios.get(`https://api.twitch.tv/helix/channels?broadcaster_id=${userId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': clientId
    }
  });
  
  // Get follower count
  const followersResponse = await axios.get(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': clientId
    }
  });
  
  return {
    user: userResponse.data.data[0],
    channel: channelResponse.data.data[0],
    followerCount: followersResponse.data.total
  };
};
