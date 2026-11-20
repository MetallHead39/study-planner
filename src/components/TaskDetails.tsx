// src/components/TaskDetails.tsx
import { useEffect, useState } from 'react';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';

export default function TaskDetails({ id }: { id: string }) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    taskRepository.getById(id, controller.signal)
      .then((data) => {
        setTask(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('Помилка завантаження деталей:', err);
      });

    return () => controller.abort();
  }, [id]);

  if (loading) return <div>Завантаження деталей...</div>;
  if (!task) return <div>Завдання не знайдено</div>;

  return (
    <div className="task-details">
      <h2>{task.title}</h2>
      <p>Статус: {task.completed ? 'Виконано' : 'Активне'}</p>
      {/* Інші поля (категорія, пріоритет) */}
    </div>
  );
}
