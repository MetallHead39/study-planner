import React, {
  useReducer,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type {
  Task,
  TaskInput,
  FilterType,
  ToastMessage,
  ToastType,
} from '../types/task';
import { TaskContext } from './taskContextObject';
import { taskReducer, type TaskState } from '../reducers/taskReducer';
import { initialTasks } from '../data/initialTasks';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TASKS_STORAGE_KEY = 'study-planner-tasks-v1';
const FILTER_STORAGE_KEY = 'study-planner-filter-v1';
const UNDO_DURATION = 5000;




function initTaskState(): TaskState {
  try {
    const saved = window.localStorage.getItem(TASKS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return { tasks: parsed, pendingDeleteId: null };
      }
    }
  } catch (error) {
    console.error('Пошкоджені дані в localStorage, завантажено початкові:', error);
  }
  return { tasks: initialTasks, pendingDeleteId: null };
}

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(taskReducer, undefined, initTaskState);
  const [filter, setFilter] = useLocalStorage<FilterType>(
    FILTER_STORAGE_KEY,
    'all'
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback(
    (
      text: string,
      type: ToastType = 'info',
      options?: { undoable?: boolean; duration?: number }
    ) => {
      setToast({
        id: Date.now(),
        text,
        type,
        undoable: options?.undoable ?? false,
        duration: options?.duration ?? 3000,
      });
    },
    []
  );

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  // 1. Синхронізація tasks з localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(state.tasks)
      );
    } catch (error) {
      console.error('Не вдалося зберегти завдання в localStorage:', error);
    }
  }, [state.tasks]);

  // 2. Синхронізація заголовка вкладки браузера з кількістю невиконаних завдань
  useEffect(() => {
    const activeCount = state.tasks.filter((t) => !t.completed).length;
    document.title = `Study Planner (${activeCount} active)`;
  }, [state.tasks]);

  // 3. Таймер для Undoable Delete (side effect)
  useEffect(() => {
    if (state.pendingDeleteId === null) return;

    const timerId = window.setTimeout(() => {
      const deletedId = state.pendingDeleteId!;
      dispatch({ type: 'confirmDelete', payload: { id: deletedId } });
      showToast('Завдання остаточно видалено', 'info', { duration: 2500 });
    }, UNDO_DURATION);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [state.pendingDeleteId, showToast]);

  // 4. Автоматичне приховування звичайних Toast-повідомлень
  useEffect(() => {
    if (!toast || toast.undoable) return;

    const timerId = window.setTimeout(() => {
      setToast(null);
    }, toast.duration ?? 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [toast]);

  const addTask = useCallback(
    (data: TaskInput) => {
      if (!data.title.trim()) {
        showToast('Назва завдання не може бути порожньою', 'error');
        return;
      }
      dispatch({ type: 'add', payload: data });
      showToast('Завдання успішно додано!', 'success');
    },
    [showToast]
  );

  const updateTask = useCallback(
    (id: number, data: TaskInput) => {
      if (!data.title.trim()) {
        showToast('Назва завдання не може бути порожньою', 'error');
        return;
      }
      dispatch({ type: 'update', payload: { id, data } });
      setEditingTask(null);
      showToast('Зміни збережено!', 'success');
    },
    [showToast]
  );

  const toggleTask = useCallback((id: number) => {
    dispatch({ type: 'toggle', payload: { id } });
  }, []);

  const requestDelete = useCallback(
    (id: number) => {
      // Якщо вже є інше завдання, яке чекає на видалення — підтверджуємо його
      if (state.pendingDeleteId !== null && state.pendingDeleteId !== id) {
        dispatch({
          type: 'confirmDelete',
          payload: { id: state.pendingDeleteId },
        });
      }

      if (editingTask?.id === id) {
        setEditingTask(null);
      }

      const targetTask = state.tasks.find((t) => t.id === id);
      dispatch({ type: 'requestDelete', payload: { id } });
      showToast(
        `Завдання «${targetTask?.title ?? ''}» буде видалено`,
        'warning',
        { undoable: true, duration: UNDO_DURATION }
      );
    },
    [state.pendingDeleteId, state.tasks, editingTask, showToast]
  );

  const undoDelete = useCallback(() => {
    if (state.pendingDeleteId === null) return;
    dispatch({ type: 'undoDelete' });
    showToast('Видалення скасовано', 'success', { duration: 2000 });
  }, [state.pendingDeleteId, showToast]);

  const resetTasks = useCallback(() => {
    dispatch({ type: 'reset' });
    setEditingTask(null);
    showToast('Дані скинуто до початкових', 'info');
  }, [showToast]);

  const startEditing = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingTask(null);
  }, []);

  const value = useMemo(
    () => ({
      tasks: state.tasks,
      filter,
      setFilter,
      editingTask,
      startEditing,
      cancelEditing,
      pendingDeleteId: state.pendingDeleteId,
      toast,
      dismissToast,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      resetTasks,
    }),
    [
      state.tasks,
      state.pendingDeleteId,
      filter,
      setFilter,
      editingTask,
      startEditing,
      cancelEditing,
      toast,
      dismissToast,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      resetTasks,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
