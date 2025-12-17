// backend/src/services/oauth/instagramOAuth.ts
import axios from 'axios';

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const REDIRECT_URI = 'http://localhost:3001/api/oauth/instagram/callback';

export const getInstagramAuthUrl = (): string => {
  return `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
};

export const getInstagramAccessToken = async (code: string) => {
  const response = await axios.post('https://api.instagram.com/oauth/access_token', {
    client_id: INSTAGRAM_APP_ID,
    client_secret: INSTAGRAM_APP_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
    code
  }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  
  return response.data;
};

export const getInstagramLongLivedToken = async (shortLivedToken: string) => {
  const response = await axios.get('https://graph.instagram.com/access_token', {
    params: {
      grant_type: 'ig_exchange_token',
      client_secret: INSTAGRAM_APP_SECRET,
      access_token: shortLivedToken
    }
  });
  
  return response.data;
};
