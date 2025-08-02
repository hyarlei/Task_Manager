import axios, { AxiosResponse } from 'axios';
import {
    AuthResponse,
    Category,
    ChangePasswordData,
    CreateCategoryData,
    CreateTaskData,
    LoginData,
    RegisterData,
    Task,
    TaskFilters,
    TaskStats,
    TasksResponse,
    UpdateCategoryData,
    UpdateProfileData,
    UpdateTaskData,
    User,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    try {
      const authData = JSON.parse(token);
      if (authData.state?.token) {
        config.headers.Authorization = `Bearer ${authData.state.token}`;
      }
    } catch (error) {
      console.error('Error parsing auth token:', error);
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: LoginData): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/login', data),
  
  register: (data: RegisterData): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/register', data),
  
  me: (): Promise<AxiosResponse<{ user: User }>> =>
    api.get('/auth/me'),
  
  refresh: (): Promise<AxiosResponse<{ token: string }>> =>
    api.post('/auth/refresh'),
};

// Tasks API
export const tasksAPI = {
  getTasks: (filters?: TaskFilters): Promise<AxiosResponse<TasksResponse>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/tasks?${params.toString()}`);
  },
  
  getTask: (id: string): Promise<AxiosResponse<{ task: Task }>> =>
    api.get(`/tasks/${id}`),
  
  createTask: (data: CreateTaskData): Promise<AxiosResponse<{ task: Task; message: string }>> =>
    api.post('/tasks', data),
  
  updateTask: (id: string, data: UpdateTaskData): Promise<AxiosResponse<{ task: Task; message: string }>> =>
    api.put(`/tasks/${id}`, data),
  
  deleteTask: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/tasks/${id}`),
  
  getStats: (): Promise<AxiosResponse<TaskStats>> =>
    api.get('/tasks/stats/overview'),
};

// Categories API
export const categoriesAPI = {
  getCategories: (): Promise<AxiosResponse<{ categories: Category[] }>> =>
    api.get('/categories'),
  
  getCategory: (id: string): Promise<AxiosResponse<{ category: Category }>> =>
    api.get(`/categories/${id}`),
  
  createCategory: (data: CreateCategoryData): Promise<AxiosResponse<{ category: Category; message: string }>> =>
    api.post('/categories', data),
  
  updateCategory: (id: string, data: UpdateCategoryData): Promise<AxiosResponse<{ category: Category; message: string }>> =>
    api.put(`/categories/${id}`, data),
  
  deleteCategory: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/categories/${id}`),
};

// Users API
export const usersAPI = {
  getProfile: (): Promise<AxiosResponse<{ user: User }>> =>
    api.get('/users/profile'),
  
  updateProfile: (data: UpdateProfileData): Promise<AxiosResponse<{ user: User; message: string }>> =>
    api.put('/users/profile', data),
  
  changePassword: (data: ChangePasswordData): Promise<AxiosResponse<{ message: string }>> =>
    api.put('/users/password', data),
  
  deleteAccount: (): Promise<AxiosResponse<{ message: string }>> =>
    api.delete('/users/account'),
};

export default api;
