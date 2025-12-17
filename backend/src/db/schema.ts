// backend/src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  username: text('username').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
});

export const platforms = sqliteTable('platforms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(), // 'tiktok', 'youtube', 'instagram', 'twitch', 'kick'
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  tokenExpiry: integer('token_expiry', { mode: 'timestamp' }),
  platformUserId: text('platform_user_id').notNull(),
  platformUsername: text('platform_username'),
  connectedAt: integer('connected_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
});

export const stats = sqliteTable('stats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  platformId: integer('platform_id').notNull().references(() => platforms.id, { onDelete: 'cascade' }),
  followers: integer('followers'),
  views: integer('views'),
  likes: integer('likes'),
  comments: integer('comments'),
  engagement: text('engagement'), // Stored as JSON
  fetchedAt: integer('fetched_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
});

export const videos = sqliteTable('videos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  platformId: integer('platform_id').notNull().references(() => platforms.id, { onDelete: 'cascade' }),
  videoId: text('video_id').notNull(),
  title: text('title'),
  views: integer('views'),
  likes: integer('likes'),
  comments: integer('comments'),
  shares: integer('shares'),
  duration: integer('duration'),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  metrics: text('metrics') // JSON con datos adicionales
});
