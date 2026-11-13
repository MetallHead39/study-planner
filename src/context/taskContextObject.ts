import { createContext } from 'react';
import type {
  Task,
  TaskInput,
  FilterType,
  ToastMessage,
} from '../types/task';

export interface TaskContextValue {
  tasks: Task[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  editingTask: Task | null;
  startEditing: (task: Task) => void;
  cancelEditing: () => void;
  pendingDeleteId: number | null;
  toast: ToastMessage | null;
  dismissToast: () => void;
  addTask: (data: TaskInput) => void;
  updateTask: (id: number, data: TaskInput) => void;
  toggleTask: (id: number) => void;
  requestDelete: (id: number) => void;
  undoDelete: () => void;
  resetTasks: () => void;
}

export const TaskContext = createContext<TaskContextValue | undefined>(
  undefined
);
