import { useEffect, useState } from 'react';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';
import { TaskItem } from './TaskItem';
import TaskForm from './TaskForm';
import TaskDetails from './TaskDetails';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'empty'>('loading');
  const [page, setPage] = useState(1);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const limit = 10;

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ви впевнені, що хочете видалити це завдання?')) return;
    try {
      await taskRepository.delete(id);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Не вдалося видалити завдання');
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleToggle = async (task: Task) => {
    try {
      await taskRepository.update(task.id, { completed: !task.completed });
      setTasks((prevTasks) => 
        prevTasks.map((t) => 
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error) {
      console.error('Не вдалося оновити статус завдання');
    }
  };

  const handleViewDetails = (id: number) => {
    setSelectedTaskId(id);
  };

  const fetchTasks = async (currentPage: number, controller: AbortController) => {
    setStatus('loading');
    try {
      const skip = (currentPage - 1) * limit;
      const data = await taskRepository.getAll(limit, skip, controller.signal);
      
      if (data.tasks.length === 0) {
        setStatus('empty');
      } else {
        setTasks(data.tasks);
        setStatus('success');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return; 
      setStatus('error');
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchTasks(page, controller);
    return () => controller.abort(); 
  }, [page]);

  const handleNextPage = () => setPage((p) => p + 1);
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));

  if (status === 'loading') return <div>Loading...</div>; 
  if (status === 'error') {
    return (
      <div>
        <p>Помилка завантаження.</p>
        <button onClick={() => fetchTasks(page, new AbortController())}>Спробувати ще</button>
      </div>
    );
  }
  if (status === 'empty') return <div>Завдань не знайдено.</div>; 

  return (
    <div className="task-list-container">
      {selectedTaskId !== null ? (
        <div>
          <button onClick={() => setSelectedTaskId(null)}>← Назад до списку</button>
          <TaskDetails id={selectedTaskId} />
        </div>
      ) : (
        <>
          <TaskForm onTaskCreated={handleTaskCreated} />
          
          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onDelete={handleDelete}
                onToggle={handleToggle}
                onEdit={() => console.log('Тут буде виклик форми редагування')} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </ul>

          <div className="pagination">
            <button onClick={handlePrevPage} disabled={page === 1}>Попередня</button>
            <span>Сторінка {page}</span>
            <button onClick={handleNextPage}>Наступна</button>
          </div>
        </>
      )}
    </div>
  );
}
