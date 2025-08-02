import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { PRIORITY, PRIORITY_VALUES, TASK_STATUS, TASK_STATUS_VALUES } from '../types/constants';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  priority: z.enum(PRIORITY_VALUES as [string, ...string[]]).default(PRIORITY.MEDIUM),
  dueDate: z.string().datetime().optional()
});

const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(TASK_STATUS_VALUES as [string, ...string[]]).optional()
});

const taskQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  status: z.enum(TASK_STATUS_VALUES as [string, ...string[]]).optional(),
  priority: z.enum(PRIORITY_VALUES as [string, ...string[]]).optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Get all tasks for user
router.get('/', authenticateToken, async (req: AuthRequest, res): Promise<any> => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    const query = taskQuerySchema.parse(req.query);
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 50);
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: req.userId
    };

    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    // Get tasks with pagination
    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, color: true }
          }
        },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: limit
      }),
      prisma.task.count({ where })
    ]);

    res.json({
      tasks,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid query parameters', 
        details: error.errors 
      });
    }
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get task by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { id } = req.params;

    if (!req.userId || !id) {
      return res.status(401).json({ error: 'User ID or Task ID not found' });
    }

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId
      },
      include: {
        category: {
          select: { id: true, name: true, color: true }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new task
router.post('/', authenticateToken, async (req: AuthRequest, res): Promise<any> => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    const data = createTaskSchema.parse(req.body);

    // Validate category belongs to user if provided
    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: data.categoryId,
          userId: req.userId
        }
      });

      if (!category) {
        return res.status(400).json({ error: 'Invalid category' });
      }
    }

    const task = await prisma.task.create({
      data: {
        ...data,
        description: data.description || null,
        categoryId: data.categoryId || null,
        userId: req.userId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null
      },
      include: {
        category: {
          select: { id: true, name: true, color: true }
        }
      }
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.put('/:id', authenticateToken, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { id } = req.params;
    const data = updateTaskSchema.parse(req.body);

    if (!req.userId || !id) {
      return res.status(401).json({ error: 'User ID or Task ID not found' });
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate category belongs to user if provided
    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: data.categoryId,
          userId: req.userId
        }
      });

      if (!category) {
        return res.status(400).json({ error: 'Invalid category' });
      }
    }

    // Set completedAt if status changes to COMPLETED
    const updateData: any = {
      ...data,
      description: data.description !== undefined ? (data.description || null) : undefined,
      categoryId: data.categoryId !== undefined ? (data.categoryId || null) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined
    };

    if (data.status === TASK_STATUS.COMPLETED && existingTask.status !== TASK_STATUS.COMPLETED) {
      updateData.completedAt = new Date();
    } else if (data.status && data.status !== TASK_STATUS.COMPLETED) {
      updateData.completedAt = null;
    }

    // Filter out undefined values
    const filteredUpdateData: any = {};
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        filteredUpdateData[key] = updateData[key];
      }
    });

    const task = await prisma.task.update({
      where: { id },
      data: filteredUpdateData,
      include: {
        category: {
          select: { id: true, name: true, color: true }
        }
      }
    });

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { id } = req.params;

    if (!req.userId || !id) {
      return res.status(401).json({ error: 'User ID or Task ID not found' });
    }

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get task statistics
router.get('/stats/overview', authenticateToken, async (req: AuthRequest, res): Promise<any> => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    const stats = await prisma.task.groupBy({
      by: ['status'],
      where: { userId: req.userId },
      _count: { status: true }
    });

    const priorityStats = await prisma.task.groupBy({
      by: ['priority'],
      where: { userId: req.userId },
      _count: { priority: true }
    });

    const totalTasks = await prisma.task.count({
      where: { userId: req.userId }
    });

    const completedThisWeek = await prisma.task.count({
      where: {
        userId: req.userId,
        status: TASK_STATUS.COMPLETED,
        completedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const overdueTasks = await prisma.task.count({
      where: {
        userId: req.userId,
        status: { not: TASK_STATUS.COMPLETED },
        dueDate: { lt: new Date() }
      }
    });

    res.json({
      statusStats: stats,
      priorityStats,
      totalTasks,
      completedThisWeek,
      overdueTasks
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
