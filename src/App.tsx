import React from 'react';
import { TaskProvider } from './context/TaskContext';
import { useTaskContext } from './hooks/useTaskContext';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Toast } from './components/Toast';
import './App.scss';

const PlannerContent: React.FC = () => {
  const { editingTask } = useTaskContext();

  return (
    <div className="app">
      <main className="app__container">
        <Header />
        <TaskForm key={editingTask?.id ?? 'new'} />
        <TaskStats />
        <TaskFilters />
        <TaskList />
      </main>
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TaskProvider>
      <PlannerContent />
    </TaskProvider>
  );
};

export default App;
