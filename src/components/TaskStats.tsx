import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskStats.scss';

export const TaskStats: React.FC = () => {
  const { tasks } = useTaskContext();

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;

  return (
    <section className="task-stats" aria-label="Статистика завдань">
      <div className="task-stats__item">
        <span className="task-stats__value">{totalCount}</span>
        <span className="task-stats__label">Усього</span>
      </div>
      <div className="task-stats__item task-stats__item--active">
        <span className="task-stats__value">{activeCount}</span>
        <span className="task-stats__label">Активні</span>
      </div>
      <div className="task-stats__item task-stats__item--completed">
        <span className="task-stats__value">{completedCount}</span>
        <span className="task-stats__label">Виконані</span>
      </div>
    </section>
  );
};
