import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import './Toast.scss';

export const Toast: React.FC = () => {
  const { toast, undoDelete, dismissToast } = useTaskContext();

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      className={`toast toast--${toast.type}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast__content">
        <span className="toast__text">{toast.text}</span>
        <div className="toast__actions">
          {toast.undoable && (
            <button
              type="button"
              className="toast__undo-btn"
              onClick={undoDelete}
            >
              Undo
            </button>
          )}
          <button
            type="button"
            className="toast__close-btn"
            onClick={dismissToast}
            aria-label="Закрити повідомлення"
          >
            ✕
          </button>
        </div>
      </div>

      {toast.undoable && (
        <div
          className="toast__progress"
          style={{ animationDuration: `${toast.duration ?? 5000}ms` }}
        />
      )}
    </div>
  );
};
