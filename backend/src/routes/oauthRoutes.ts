// backend/src/routes/oauthRoutes.ts
import { Router } from 'express';
import { google } from 'googleapis';
import axios from 'axios';
import crypto from 'crypto';

const router = Router();

// YouTube OAuth (mantener el código anterior)
router.get('/youtube', (req, res) => {
  const token = req.query.token as string;
  
  if (!token) {
    return res.redirect('http://localhost:4321/login');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );

  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/yt-analytics.readonly'
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: token
  });

  res.redirect(authUrl);
});

router.get('/youtube/callback', async (req, res) => {
  const code = req.query.code as string;
  const state = req.query.state as string;
  
  if (!code) {
    return res.redirect('http://localhost:4321/platforms?error=no_code');
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('YouTube tokens received:', tokens);
    
    res.redirect('http://localhost:4321/dashboard?connected=youtube');
  } catch (error) {
    console.error('Error connecting YouTube:', error);
    res.redirect('http://localhost:4321/platforms?error=youtube_failed');
  }
});

// TikTok OAuth
router.get('/tiktok', (req, res) => {
  const token = req.query.token as string;
  
  if (!token) {
    return res.redirect('http://localhost:4321/login');
  }

  const csrfState = crypto.randomBytes(16).toString('hex');
  
  // Guardar el state en memoria o Redis para validarlo después
  // Por simplicidad, lo incluimos en el state
  const state = JSON.stringify({ token, csrfState });
  const encodedState = Buffer.from(state).toString('base64');

  const scopes = [
    'user.info.basic',
    'user.info.stats',
    'video.list',
    'video.insights'
  ].join(',');

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?` +
    `client_key=${process.env.TIKTOK_CLIENT_KEY}` +
    `&scope=${scopes}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(process.env.TIKTOK_REDIRECT_URI!)}` +
    `&state=${encodedState}`;

  res.redirect(authUrl);
});

router.get('/tiktok/callback', async (req, res) => {
  const code = req.query.code as string;
  const encodedState = req.query.state as string;
  
  if (!code) {
    return res.redirect('http://localhost:4321/platforms?error=no_code');
  }

  try {
    // Decodificar el state
    const state = JSON.parse(Buffer.from(encodedState, 'base64').toString());
    
    // Intercambiar el código por access token
    const tokenResponse = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TIKTOK_REDIRECT_URI
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      }
    });

    const { access_token, refresh_token, expires_in, open_id } = tokenResponse.data.data;

    console.log('TikTok tokens received:', {
      access_token: access_token.substring(0, 20) + '...',
      expires_in,
      open_id
    });

    // Obtener información básica del usuario
    const userInfoResponse = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      params: {
        fields: 'open_id,union_id,avatar_url,display_name,follower_count,following_count,likes_count,video_count'
      }
    });

    console.log('TikTok user info:', userInfoResponse.data.data.user);

    // Aquí deberías guardar los tokens y user info en la base de datos
    // Asociados al usuario (usando state.token para identificar al usuario)

    res.redirect('http://localhost:4321/dashboard?connected=tiktok');
  } catch (error: any) {
    console.error('Error connecting TikTok:', error.response?.data || error.message);
    res.redirect('http://localhost:4321/platforms?error=tiktok_failed');
  }
});

// Instagram, Twitch, Kick (para después)
router.get('/instagram', (req, res) => {
  res.status(501).json({ error: 'Instagram OAuth not implemented yet' });
});

router.get('/twitch', (req, res) => {
  res.status(501).json({ error: 'Twitch OAuth not implemented yet' });
});

router.get('/kick', (req, res) => {
  res.status(501).json({ error: 'Kick OAuth not implemented yet' });
});

export default router;
