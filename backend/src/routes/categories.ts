import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  description: z.string().max(255, 'Description too long').optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').default('#6366f1')
});

const updateCategorySchema = createCategorySchema.partial();

// Get all categories for user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.userId },
      include: {
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get category by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: req.userId
      },
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new category
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const data = createCategorySchema.parse(req.body);

    // Check if category name already exists for user
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: data.name,
        userId: req.userId
      }
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }

    const category = await prisma.category.create({
      data: {
        ...data,
        userId: req.userId!
      },
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update category
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const data = updateCategorySchema.parse(req.body);

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if new name conflicts with existing category
    if (data.name && data.name !== existingCategory.name) {
      const nameConflict = await prisma.category.findFirst({
        where: {
          name: data.name,
          userId: req.userId,
          id: { not: id }
        }
      });

      if (nameConflict) {
        return res.status(400).json({ error: 'Category with this name already exists' });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    });

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete category
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: req.userId
      },
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has tasks
    if (category._count.tasks > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing tasks',
        tasksCount: category._count.tasks 
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
