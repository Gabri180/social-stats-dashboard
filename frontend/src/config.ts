// frontend/src/config.ts
export const API_URL = import.meta.env.PROD 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:3001';

export const PLATFORMS = {
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  INSTAGRAM: 'instagram',
  TWITCH: 'twitch',
  KICK: 'kick'
} as const;

export const PLATFORM_COLORS = {
  [PLATFORMS.TIKTOK]: 'bg-black',
  [PLATFORMS.YOUTUBE]: 'bg-red-600',
  [PLATFORMS.INSTAGRAM]: 'bg-gradient-to-br from-purple-600 to-pink-600',
  [PLATFORMS.TWITCH]: 'bg-purple-600',
  [PLATFORMS.KICK]: 'bg-green-500'
} as const;
