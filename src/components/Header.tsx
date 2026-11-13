import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import './Header.scss';

export const Header: React.FC = () => {
  const { resetTasks } = useTaskContext();

  return (
    <header className="header">
      <div className="header__info">
        <h1 className="header__title">Study Planner</h1>
        <p className="header__subtitle">
          Планувальник навчальних завдань (Lab 09: Reducer, Context & Effects)
        </p>
      </div>
      <button
        type="button"
        className="header__reset-btn"
        onClick={resetTasks}
        title="Повернути початковий список завдань"
      >
        Скинути дані
      </button>
    </header>
  );
};
