import {
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  category: Category | null;
}

interface CreateTaskData {
  title: string;
  description?: string;
  categoryId?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
}

interface TaskFilters {
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  categoryId?: string;
  search?: string;
}

const statusOptions = [
  { value: 'TODO', label: 'A Fazer', color: 'bg-gray-100 text-gray-800' },
  { value: 'IN_PROGRESS', label: 'Em Progresso', color: 'bg-blue-100 text-blue-800' },
  { value: 'COMPLETED', label: 'Concluída', color: 'bg-green-100 text-green-800' },
];

const priorityOptions = [
  { value: 'LOW', label: 'Baixa', color: 'text-green-600' },
  { value: 'MEDIUM', label: 'Média', color: 'text-yellow-600' },
  { value: 'HIGH', label: 'Alta', color: 'text-red-600' },
];

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    categoryId: '',
    priority: 'MEDIUM',
    dueDate: '',
  });

  // Check for action parameter to open modal automatically
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowModal(true);
      // Remove the parameter from URL to keep it clean
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, categoriesResponse] = await Promise.all([
        api.get('/tasks', { params: filters }),
        api.get('/categories')
      ]);
      
      setTasks(tasksResponse.data.tasks || []);
      setCategories(categoriesResponse.data.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        ...formData,
        categoryId: formData.categoryId || undefined,
        description: formData.description || undefined,
        dueDate: formData.dueDate || undefined,
      };

      if (editingTask) {
        // Update task
        const response = await api.put(`/tasks/${editingTask.id}`, payload);
        setTasks(tasks.map(task => 
          task.id === editingTask.id ? response.data.task : task
        ));
      } else {
        // Create task
        const response = await api.post('/tasks', payload);
        setTasks([response.data.task, ...tasks]);
      }
      
      resetForm();
      setShowModal(false);
    } catch (error: any) {
      console.error('Error saving task:', error);
      setError(error.response?.data?.error || 'Erro ao salvar tarefa');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      categoryId: task.category?.id || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error: any) {
      console.error('Error deleting task:', error);
      setError(error.response?.data?.error || 'Erro ao excluir tarefa');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data.task : task
      ));
    } catch (error: any) {
      console.error('Error updating task status:', error);
      setError(error.response?.data?.error || 'Erro ao atualizar status da tarefa');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      categoryId: '',
      priority: 'MEDIUM',
      dueDate: '',
    });
    setEditingTask(null);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption : statusOptions[0];
  };

  const getPriorityColor = (priority: string) => {
    const priorityOption = priorityOptions.find(opt => opt.value === priority);
    return priorityOption ? priorityOption.color : 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays === -1) return 'Ontem';
    if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
    if (diffDays > 0) return `Em ${diffDays} dias`;

    return date.toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: string | null, status: string) => {
    if (!dueDate || status === 'COMPLETED') return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
            <p className="text-gray-600">
              Gerencie todas as suas tarefas em um só lugar.
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Carregando tarefas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-600">
            Gerencie todas as suas tarefas em um só lugar.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filtros
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="input pl-10"
                    placeholder="Buscar tarefas..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                  className="input"
                >
                  <option value="">Todos</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <select
                  value={filters.priority || ''}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}
                  className="input"
                >
                  <option value="">Todas</option>
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={filters.categoryId || ''}
                  onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                  className="input"
                >
                  <option value="">Todas</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="btn btn-secondary"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma tarefa encontrada</p>
              <p className="text-sm text-gray-400 mt-2">
                {Object.keys(filters).length > 0 
                  ? 'Tente ajustar os filtros ou crie uma nova tarefa.'
                  : 'Crie sua primeira tarefa para começar a organizar seu trabalho.'
                }
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary mt-4"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Criar Tarefa
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const statusBadge = getStatusBadge(task.status);
            const overdue = isOverdue(task.dueDate, task.status);
            
            return (
              <div key={task.id} className={`card ${overdue ? 'border-red-200' : ''}`}>
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => handleStatusChange(
                          task.id, 
                          task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED'
                        )}
                        className="mt-1"
                      >
                        {task.status === 'COMPLETED' ? (
                          <CheckCircleIconSolid className="w-5 h-5 text-green-600" />
                        ) : (
                          <CheckCircleIcon className="w-5 h-5 text-gray-400 hover:text-green-600" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`font-semibold ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                            {statusBadge.label}
                          </span>
                          <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                            {priorityOptions.find(p => p.value === task.priority)?.label}
                          </span>
                        </div>
                        
                        {task.description && (
                          <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {task.category && (
                            <div className="flex items-center space-x-1">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: task.category.color }}
                              ></div>
                              <span>{task.category.name}</span>
                            </div>
                          )}
                          
                          {task.dueDate && (
                            <div className={`flex items-center space-x-1 ${overdue ? 'text-red-600' : ''}`}>
                              <ClockIcon className="w-4 h-4" />
                              <span>{formatDate(task.dueDate)}</span>
                              {overdue && <ExclamationTriangleIcon className="w-4 h-4" />}
                            </div>
                          )}
                          
                          <span>
                            Criada em {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-1 text-gray-400 hover:text-indigo-600"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="Título da tarefa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  placeholder="Descrição da tarefa"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="input"
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="input"
                  >
                    <option value="">Sem categoria</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="input"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  {editingTask ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
