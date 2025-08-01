import {
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from 'react-query';
import { tasksAPI } from '../services/api';
import { Priority, TaskStatus } from '../types';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery(
    'task-stats',
    () => tasksAPI.getStats(),
    {
      select: (response) => response.data,
    }
  );

  const { data: recentTasks, isLoading: tasksLoading } = useQuery(
    'recent-tasks',
    () => tasksAPI.getTasks({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
    {
      select: (response) => response.data.tasks,
    }
  );

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'text-green-600 bg-green-100';
      case TaskStatus.IN_PROGRESS:
        return 'text-blue-600 bg-blue-100';
      case TaskStatus.PENDING:
        return 'text-yellow-600 bg-yellow-100';
      case TaskStatus.CANCELLED:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return 'text-red-600 bg-red-100';
      case Priority.HIGH:
        return 'text-orange-600 bg-orange-100';
      case Priority.MEDIUM:
        return 'text-yellow-600 bg-yellow-100';
      case Priority.LOW:
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const statCards = [
    {
      title: 'Total de Tarefas',
      value: stats?.totalTasks || 0,
      icon: CheckCircleIcon,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Concluídas esta Semana',
      value: stats?.completedThisWeek || 0,
      icon: CheckCircleIcon,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Em Atraso',
      value: stats?.overdueTasks || 0,
      icon: ExclamationTriangleIcon,
      color: 'text-red-600 bg-red-100',
    },
    {
      title: 'Em Andamento',
      value: stats?.statusStats?.find(s => s.status === TaskStatus.IN_PROGRESS)?._count.status || 0,
      icon: ClockIcon,
      color: 'text-yellow-600 bg-yellow-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Bem-vindo de volta! Aqui está um resumo das suas tarefas.
          </p>
        </div>
        <button className="btn-primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Nova Tarefa
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? '...' : card.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Tarefas Recentes</h3>
          </div>
          <div className="card-body">
            {tasksLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentTasks && recentTasks.length > 0 ? (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                        >
                          {task.status}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      {task.dueDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Vence em: {format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Nenhuma tarefa encontrada
              </p>
            )}
          </div>
        </div>

        {/* Task Status Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Status das Tarefas</h3>
          </div>
          <div className="card-body">
            {statsLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : stats?.statusStats ? (
              <div className="space-y-3">
                {stats.statusStats.map((stat) => (
                  <div key={stat.status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(stat.status).split(' ')[1]}`}></div>
                      <span className="text-sm text-gray-700">{stat.status}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stat._count.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Nenhum dado disponível
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
