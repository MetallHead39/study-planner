import React from 'react';
import type { FilterType } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskFilters.scss';

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'active', label: 'Не виконані' },
  { value: 'completed', label: 'Виконані' },
];

export const TaskFilters: React.FC = () => {
  const { filter, setFilter, tasks } = useTaskContext();

  const getCount = (type: FilterType) => {
    if (type === 'all') return tasks.length;
    if (type === 'completed') return tasks.filter((t) => t.completed).length;
    return tasks.filter((t) => !t.completed).length;
  };

  return (
    <div className="task-filters" role="group" aria-label="Фільтр завдань">
      {FILTERS.map((item) => (
        <button
          key={item.value}
          type="button"
          className={`task-filters__btn ${
            filter === item.value ? 'task-filters__btn--active' : ''
          }`}
          onClick={() => setFilter(item.value)}
        >
          {item.label}
          <span className="task-filters__badge">{getCount(item.value)}</span>
        </button>
      ))}
    </div>
  );
};
