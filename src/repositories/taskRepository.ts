import type { Task } from '../types/task';
import { httpClient } from '../api/httpClient';

export type ApiTodo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

export type TodosResponse = {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
};

const toTask = (todo: ApiTodo): Task => ({
  id: todo.id, // Залишаємо як число
  title: todo.todo,
  description: '',
  completed: todo.completed,
  priority: 'medium',
  category: 'General',
});

export const taskRepository = {
  getAll: async (limit = 10, skip = 0, signal?: AbortSignal) => {
    const data = await httpClient<TodosResponse>(`/todos?limit=${limit}&skip=${skip}`, { signal });
    return {
      tasks: data.todos.map(toTask),
      total: data.total
    };
  },
  
  getById: async (id: number, signal?: AbortSignal) => {
    const data = await httpClient<ApiTodo>(`/todos/${id}`, { signal });
    return toTask(data);
  },

  create: async (task: Omit<Task, 'id'>) => {
    const data = await httpClient<ApiTodo>('/todos/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todo: task.title,
        completed: task.completed,
        userId: 1, 
      }),
    });
    return toTask(data);
  },

  update: async (id: number, updates: Partial<Task>) => {
    const payload: Partial<ApiTodo> = {};
    if (updates.title !== undefined) payload.todo = updates.title;
    if (updates.completed !== undefined) payload.completed = updates.completed;

    const data = await httpClient<ApiTodo>(`/todos/${id}`, {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return toTask(data);
  },

  delete: async (id: number) => {
    const data = await httpClient<ApiTodo>(`/todos/${id}`, { method: 'DELETE' });
    return toTask(data);
  }
};
