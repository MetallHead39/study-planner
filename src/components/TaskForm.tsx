import React, { useState } from 'react';
import type { Priority } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskForm.scss';

export const TaskForm: React.FC = () => {
  const { addTask, updateTask, editingTask, cancelEditing } = useTaskContext();

  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [description, setDescription] = useState(editingTask?.description ?? '');
  const [category, setCategory] = useState(editingTask?.category ?? '');
  const [priority, setPriority] = useState<Priority>(
    editingTask?.priority ?? 'medium'
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Введіть назву навчального завдання');
      return;
    }

    const taskData = {
      title,
      description,
      category,
      priority,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
      setTitle('');
      setDescription('');
      setCategory('');
      setPriority('medium');
    }
    setError('');
  };

  return (
    <form
      className={`task-form ${editingTask ? 'task-form--editing' : ''}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="task-form__heading">
        {editingTask ? 'Редагування завдання' : 'Нове завдання'}
      </h2>

      <div className="task-form__grid">
        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-title">
            Назва *
          </label>
          <input
            id="task-title"
            type="text"
            className={`task-form__input ${
              error ? 'task-form__input--error' : ''
            }`}
            placeholder="Наприклад: Вивчити Context API"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
          />
          {error && <span className="task-form__error">{error}</span>}
        </div>

        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-category">
            Категорія
          </label>
          <input
            id="task-category"
            type="text"
            className="task-form__input"
            placeholder="React, TypeScript, Git..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-priority">
            Пріоритет
          </label>
          <select
            id="task-priority"
            className="task-form__select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Низький (Low)</option>
            <option value="medium">Середній (Medium)</option>
            <option value="high">Високий (High)</option>
          </select>
        </div>

        <div className="task-form__field task-form__field--full">
          <label className="task-form__label" htmlFor="task-desc">
            Опис
          </label>
          <textarea
            id="task-desc"
            className="task-form__textarea"
            rows={2}
            placeholder="Короткі нотатки до завдання..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="task-form__actions">
        <button type="submit" className="task-form__submit">
          {editingTask ? 'Зберегти зміни' : 'Додати завдання'}
        </button>
        {editingTask && (
          <button
            type="button"
            className="task-form__cancel"
            onClick={cancelEditing}
          >
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
};
