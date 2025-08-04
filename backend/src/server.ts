import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// Routes
import authRoutes from './routes/auth';
import categoriesRoutes from './routes/categories';
import tasksRoutes from './routes/tasks';
import usersRoutes from './routes/users';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Trust proxy - Necessário para Railway/Heroku/etc
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://task-manager-front-vsby.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      tasks: '/api/tasks',
      categories: '/api/categories',
      users: '/api/users'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Endpoint para popular banco com dados demo (apenas para produção)
app.post('/seed-demo', async (req, res): Promise<void> => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      res.status(403).json({ error: 'Only available in production' });
      return;
    }

    const bcrypt = require('bcryptjs');
    
    // Verificar se já existe usuário demo
    let demoUser = await prisma.user.findUnique({
      where: { email: 'demo@taskmanager.com' }
    });

    if (!demoUser) {
      // Criar usuário demo
      const hashedPassword = await bcrypt.hash('demo123', 12);
      demoUser = await prisma.user.create({
        data: {
          name: 'Demo User',
          email: 'demo@taskmanager.com',
          password: hashedPassword
        }
      });
    }

    // Verificar se já existem categorias
    const categoriesCount = await prisma.category.count();
    if (categoriesCount === 0) {
      // Criar categorias demo
      const categories = await Promise.all([
        prisma.category.create({
          data: {
            name: 'Trabalho',
            description: 'Tarefas relacionadas ao trabalho',
            color: '#3B82F6',
            userId: demoUser.id
          }
        }),
        prisma.category.create({
          data: {
            name: 'Pessoal',
            description: 'Tarefas pessoais e da vida cotidiana',
            color: '#10B981',
            userId: demoUser.id
          }
        }),
        prisma.category.create({
          data: {
            name: 'Estudos',
            description: 'Tarefas de aprendizado e desenvolvimento',
            color: '#8B5CF6',
            userId: demoUser.id
          }
        })
      ]);

      // Criar tarefas demo
      await Promise.all([
        prisma.task.create({
          data: {
            title: 'Finalizar relatório mensal',
            description: 'Completar o relatório de vendas do mês atual',
            status: 'pending',
            priority: 'high',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
            userId: demoUser.id,
            categoryId: categories[0].id
          }
        }),
        prisma.task.create({
          data: {
            title: 'Fazer compras do mercado',
            description: 'Comprar itens da lista semanal',
            status: 'pending',
            priority: 'medium',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 dias
            userId: demoUser.id,
            categoryId: categories[1].id
          }
        }),
        prisma.task.create({
          data: {
            title: 'Estudar React avançado',
            description: 'Completar o curso de React Hooks e Context',
            status: 'in_progress',
            priority: 'medium',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 dias
            userId: demoUser.id,
            categoryId: categories[2].id
          }
        }),
        prisma.task.create({
          data: {
            title: 'Organizar escritório',
            description: 'Limpar e organizar o espaço de trabalho',
            status: 'completed',
            priority: 'low',
            completedAt: new Date(),
            userId: demoUser.id,
            categoryId: categories[1].id
          }
        })
      ]);
    }

    res.json({ 
      message: 'Demo data created successfully', 
      user: { id: demoUser.id, email: demoUser.email }
    });
  } catch (error) {
    console.error('Seed demo error:', error);
    res.status(500).json({ error: 'Failed to create demo data' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', usersRoutes);

// Error handling
app.use(errorHandler);

// 404 handler (DEVE ser o último middleware)
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('👋 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
