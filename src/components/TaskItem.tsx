import React from 'react';
import type { Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
}

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const {
    toggleTask,
    requestDelete,
    undoDelete,
    startEditing,
    pendingDeleteId,
  } = useTaskContext();

  const isPendingDelete = pendingDeleteId === task.id;

  return (
    <li
      className={`task-item ${task.completed ? 'task-item--completed' : ''} ${
        isPendingDelete ? 'task-item--pending-delete' : ''
      }`}
    >
      <div className="task-item__main">
        <label className="task-item__checkbox-label">
          <input
            type="checkbox"
            className="task-item__checkbox"
            checked={task.completed}
            disabled={isPendingDelete}
            onChange={() => toggleTask(task.id)}
          />
          <span className="task-item__title">{task.title}</span>
        </label>

        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}

        <div className="task-item__meta">
          <span className="task-item__category">{task.category}</span>
          <span
            className={`task-item__priority task-item__priority--${task.priority}`}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
          {isPendingDelete && (
            <span className="task-item__pending-badge">Буде видалено...</span>
          )}
        </div>
      </div>

      <div className="task-item__actions">
        {isPendingDelete ? (
          <button
            type="button"
            className="task-item__btn task-item__btn--undo"
            onClick={undoDelete}
          >
            Скасувати
          </button>
        ) : (
          <>
            <button
              type="button"
              className="task-item__btn task-item__btn--edit"
              onClick={() => startEditing(task)}
            >
              Редагувати
            </button>
            <button
              type="button"
              className="task-item__btn task-item__btn--delete"
              onClick={() => requestDelete(task.id)}
            >
              Видалити
            </button>
          </>
        )}
      </div>
    </li>
  );
};
