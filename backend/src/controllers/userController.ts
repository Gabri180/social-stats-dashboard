// backend/src/controllers/userController.ts
import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Set by auth middleware
    
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      username: users.username,
      createdAt: users.createdAt
    }).from(users).where(eq(users.id, userId));
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { username, email } = req.body;
    
    await db.update(users)
      .set({ username, email })
      .where(eq(users.id, userId));
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
