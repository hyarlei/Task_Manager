import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PRIORITY, TASK_STATUS } from '../src/types/constants';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@taskmanager.com' },
    update: {},
    create: {
      email: 'demo@taskmanager.com',
      name: 'Demo User',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  });

  console.log('👤 Created demo user:', user.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { 
        name_userId: { 
          name: 'Work', 
          userId: user.id 
        } 
      },
      update: {},
      create: {
        name: 'Work',
        description: 'Work-related tasks and projects',
        color: '#3b82f6',
        userId: user.id
      }
    }),
    prisma.category.upsert({
      where: { 
        name_userId: { 
          name: 'Personal', 
          userId: user.id 
        } 
      },
      update: {},
      create: {
        name: 'Personal',
        description: 'Personal tasks and activities',
        color: '#10b981',
        userId: user.id
      }
    }),
    prisma.category.upsert({
      where: { 
        name_userId: { 
          name: 'Study', 
          userId: user.id 
        } 
      },
      update: {},
      create: {
        name: 'Study',
        description: 'Learning and educational tasks',
        color: '#f59e0b',
        userId: user.id
      }
    }),
    prisma.category.upsert({
      where: { 
        name_userId: { 
          name: 'Health', 
          userId: user.id 
        } 
      },
      update: {},
      create: {
        name: 'Health',
        description: 'Health and fitness activities',
        color: '#ef4444',
        userId: user.id
      }
    })
  ]);

  console.log('📂 Created categories:', categories.map(c => c.name).join(', '));

  // Create sample tasks
  const tasks = [
    // Work tasks
    await prisma.task.create({
      data: {
        title: 'Complete project presentation',
        description: 'Prepare slides for quarterly review meeting',
        status: TASK_STATUS.IN_PROGRESS,
        priority: PRIORITY.HIGH,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        userId: user.id,
        categoryId: categories[0].id
      }
    }),
    await prisma.task.create({
      data: {
        title: 'Review code submissions',
        description: 'Review pull requests from team members',
        status: TASK_STATUS.PENDING,
        priority: PRIORITY.MEDIUM,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        userId: user.id,
        categoryId: categories[0].id
      }
    }),
    await prisma.task.create({
      data: {
        title: 'Team standup meeting',
        description: 'Daily standup at 9 AM',
        status: TASK_STATUS.COMPLETED,
        priority: PRIORITY.LOW,
        completedAt: new Date(),
        userId: user.id,
        categoryId: categories[0].id
      }
    }),

    // Personal tasks
    await prisma.task.create({
      data: {
        title: 'Buy groceries',
        description: 'Weekly grocery shopping at the supermarket',
        status: TASK_STATUS.PENDING,
        priority: PRIORITY.MEDIUM,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        userId: user.id,
        categoryId: categories[1].id
      }
    }),
    await prisma.task.create({
      data: {
        title: 'Call mom',
        description: 'Weekly check-in call with family',
        status: TASK_STATUS.COMPLETED,
        priority: PRIORITY.LOW,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        userId: user.id,
        categoryId: categories[1].id
      }
    }),
    await prisma.task.create({
      data: {
        title: 'Plan weekend trip',
        description: 'Research and book weekend getaway',
        status: TASK_STATUS.PENDING,
        priority: PRIORITY.LOW,
        userId: user.id,
        categoryId: categories[1].id
      }
    }),

    // Study tasks
    await prisma.task.create({
      data: {
        title: 'Complete React course',
        description: 'Finish the advanced React patterns course',
        status: TASK_STATUS.IN_PROGRESS,
        priority: PRIORITY.HIGH,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        userId: user.id,
        categoryId: categories[2].id
      }
    }),
    await prisma.task.create({
      data: {
        title: 'Read TypeScript handbook',
        description: 'Study TypeScript documentation and best practices',
        status: TASK_STATUS.PENDING,
        priority: PRIORITY.MEDIUM,
        userId: user.id,
        categoryId: categories[2].id
      }
    }),

    // Health tasks
    await prisma.task.create({
      data: {
        title: 'Morning workout',
        description: '30-minute cardio and strength training',
        status: TASK_STATUS.COMPLETED,
        priority: PRIORITY.MEDIUM,
        completedAt: new Date(),
        userId: user.id,
        categoryId: categories[3].id
      }
    }),
    await prisma.task.create({
      data: {
        title: 'Schedule dental appointment',
        description: 'Book routine dental checkup',
        status: TASK_STATUS.PENDING,
        priority: PRIORITY.LOW,
        userId: user.id,
        categoryId: categories[3].id
      }
    }),

    // Overdue task
    await prisma.task.create({
      data: {
        title: 'Submit tax documents',
        description: 'Gather and submit annual tax documentation',
        status: TASK_STATUS.PENDING,
        priority: PRIORITY.URGENT,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
        userId: user.id,
        categoryId: categories[1].id
      }
    })
  ];

  console.log('✅ Created tasks:', tasks.length);

  console.log('🎉 Database seed completed successfully!');
  console.log(`
📊 Summary:
- Users: 1
- Categories: ${categories.length}
- Tasks: ${tasks.length}

🔐 Demo Account:
- Email: demo@taskmanager.com
- Password: demo123
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
