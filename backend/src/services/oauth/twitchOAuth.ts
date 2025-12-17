// backend/src/services/oauth/twitchOAuth.ts
import axios from 'axios';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3001/api/oauth/twitch/callback';

export const getTwitchAuthUrl = (): string => {
  return `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=user:read:email channel:read:subscriptions analytics:read:extensions analytics:read:games`;
};

export const getTwitchAccessToken = async (code: string) => {
  const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI
    }
  });
  
  return response.data;
};
