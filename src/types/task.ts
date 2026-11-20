export type Priority = 'low' | 'medium' | 'high';

export type FilterType = 'all' | 'active' | 'completed';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
}

export interface TaskInput {
  title: string;
  description: string;
  priority: Priority;
  category: string;
}

export interface PendingDeletion {
  task: Task;
  startedAt: number;
  duration: number; // 5000 мс
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
  undoable?: boolean;
  duration?: number;
}

