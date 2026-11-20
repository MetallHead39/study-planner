import React from 'react';
import type { Task } from '../types/task';
import './TaskItem.scss';


interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onViewDetails: (id: string) => void; 
}

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onDelete, 
  onToggle, 
  onEdit, 
  onViewDetails 
}) => {
 

  return (
    <li className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
      <div className="task-item__main">
        <label className="task-item__checkbox-label">
          <input
            type="checkbox"
            className="task-item__checkbox"
            checked={task.completed}
            onChange={() => onToggle(task)}
          />
          <span className="task-item__title">{task.title}</span>
        </label>

        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}

        <div className="task-item__meta">
          <span className="task-item__category">{task.category}</span>
          <span className={`task-item__priority task-item__priority--${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
      </div>

      <div className="task-item__actions">
        {/* Нова кнопка для перегляду деталей */}
        <button
          type="button"
          className="task-item__btn task-item__btn--details"
          onClick={() => onViewDetails(task.id)}
        >
          Деталі
        </button>
        
        <button
          type="button"
          className="task-item__btn task-item__btn--edit"
          onClick={() => onEdit(task)}
        >
          Редагувати
        </button>
        
        <button
          type="button"
          className="task-item__btn task-item__btn--delete"
          onClick={() => onDelete(task.id)}
        >
          Видалити
        </button>
      </div>
    </li>
  );
};
