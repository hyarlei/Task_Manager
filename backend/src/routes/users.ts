import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional()
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});

// Get user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res): Promise<any> => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            tasks: true,
            categories: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res): Promise<any> => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    const data = updateProfileSchema.parse(req.body);

    // Filter out undefined values
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.put('/password', authenticateToken, async (req: AuthRequest, res): Promise<any> => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedNewPassword }
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user account
router.delete('/account', authenticateToken, async (req: AuthRequest, res): Promise<any> => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    // Delete user (cascade will handle tasks and categories)
    await prisma.user.delete({
      where: { id: req.userId }
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
