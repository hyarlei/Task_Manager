// Task Status Constants
export const TASK_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

// Priority Constants
export const PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const;

export type Priority = typeof PRIORITY[keyof typeof PRIORITY];

// Validation arrays for Zod
export const TASK_STATUS_VALUES = Object.values(TASK_STATUS);
export const PRIORITY_VALUES = Object.values(PRIORITY);
