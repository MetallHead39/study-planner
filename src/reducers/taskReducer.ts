import type { Task, TaskInput } from '../types/task';
import { initialTasks } from '../data/initialTasks';

export interface TaskState {
  tasks: Task[];
  pendingDeleteId: number | null;
}

export type TaskAction =
  | { type: 'add'; payload: TaskInput }
  | { type: 'toggle'; payload: { id: number } }
  | { type: 'update'; payload: { id: number; data: TaskInput } }
  | { type: 'requestDelete'; payload: { id: number } }
  | { type: 'confirmDelete'; payload: { id: number } }
  | { type: 'undoDelete' }
  | { type: 'reset' };

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add': {
      const newTask: Task = {
        id: Date.now(),
        title: action.payload.title.trim(),
        description: action.payload.description.trim(),
        priority: action.payload.priority,
        category: action.payload.category.trim() || 'Загальне',
        completed: false,
      };
      return {
        ...state,
        tasks: [newTask, ...state.tasks],
      };
    }

    case 'toggle': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    }

    case 'update': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? {
                ...task,
                title: action.payload.data.title.trim(),
                description: action.payload.data.description.trim(),
                priority: action.payload.data.priority,
                category: action.payload.data.category.trim() || 'Загальне',
              }
            : task
        ),
      };
    }

    case 'requestDelete': {
      return {
        ...state,
        pendingDeleteId: action.payload.id,
      };
    }

    case 'confirmDelete': {
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
        pendingDeleteId:
          state.pendingDeleteId === action.payload.id
            ? null
            : state.pendingDeleteId,
      };
    }

    case 'undoDelete': {
      return {
        ...state,
        pendingDeleteId: null,
      };
    }

    case 'reset': {
      return {
        tasks: initialTasks,
        pendingDeleteId: null,
      };
    }

    default:
      return state;
  }
}
