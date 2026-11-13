import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';
import './TaskList.scss';

export const TaskList: React.FC = () => {
  const { tasks, filter } = useTaskContext();

  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p className="task-list__empty-title">Завдань поки немає.</p>
        <p className="task-list__empty-text">
          Додайте перше навчальне завдання за допомогою форми вище.
        </p>
      </div>
    );
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p className="task-list__empty-title">За цим фільтром завдань немає.</p>
        <p className="task-list__empty-text">
          Спробуйте обрати іншу вкладку фільтрації.
        </p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
};
