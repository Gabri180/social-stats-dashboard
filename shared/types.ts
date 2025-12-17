// shared/types.ts
export interface User {
    id: number;
    email: string;
    username: string;
    createdAt: Date;
  }
  
  export interface Platform {
    id: number;
    userId: number;
    platform: 'tiktok' | 'youtube' | 'instagram' | 'twitch' | 'kick';
    accessToken: string;
    refreshToken?: string;
    tokenExpiry?: Date;
    platformUserId: string;
    platformUsername?: string;
    connectedAt: Date;
  }
  
  export interface Stats {
    id: number;
    platformId: number;
    followers?: number;
    views?: number;
    likes?: number;
    comments?: number;
    engagement?: string;
    fetchedAt: Date;
  }
  
  export interface AuthResponse {
    token: string;
    user: Omit<User, 'password'>;
  }
  