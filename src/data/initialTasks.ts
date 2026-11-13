import type { Task } from '../types/task';

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'React Components & Props',
    description: 'Опрацювати базові принципи компонентів та передачу даних',
    completed: true,
    priority: 'high',
    category: 'React',
  },
  {
    id: 2,
    title: 'useReducer та чисті функції',
    description: 'Винести складну логіку оновлення стану в reducer',
    completed: false,
    priority: 'high',
    category: 'React Hooks',
  },
  {
    id: 3,
    title: 'TypeScript Generics',
    description: 'Написати типізований хук useLocalStorage<T>',
    completed: false,
    priority: 'medium',
    category: 'TypeScript',
  },
];
