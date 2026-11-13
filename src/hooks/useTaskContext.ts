import { useContext } from 'react';
import { TaskContext } from '../context/taskContextObject';

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error(
      'useTaskContext повинен використовуватися всередині <TaskProvider>'
    );
  }
  return context;
}
