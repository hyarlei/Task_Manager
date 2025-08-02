export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks: number;
  };
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  categoryId?: string;
  category?: Category;
}

export interface TaskStats {
  statusStats: Array<{
    status: TaskStatus;
    _count: { status: number };
  }>;
  priorityStats: Array<{
    priority: Priority;
    _count: { priority: number };
  }>;
  totalTasks: number;
  completedThisWeek: number;
  overdueTasks: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: PaginationInfo;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface ApiError {
  error: string;
  details?: any;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  categoryId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  categoryId?: string;
  priority?: Priority;
  dueDate?: string;
}

export interface UpdateTaskData extends CreateTaskData {
  status?: TaskStatus;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryData extends CreateCategoryData {}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
