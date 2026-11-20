import React, { useState, FormEvent } from 'react';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setStatus('loading');
    
    try {
      const newTask = await taskRepository.create({
        title,
        completed: false,
        category: 'General', 
        priority: 'medium',
      });
      
      onTaskCreated(newTask);
      
      setTitle('');
      setStatus('success');
      
      setTimeout(() => setStatus('idle'), 3000);
      
    } catch (error) {
      setStatus('error');
      console.error('Помилка створення:', error);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Що потрібно зробити?"
        disabled={status === 'loading'}
      />
      <button type="submit" disabled={status === 'loading' || !title.trim()}>
        {status === 'loading' ? 'Створення...' : 'Додати'}
      </button>

      {status === 'success' && <p className="success-msg">Завдання успішно створено!</p>}
      {status === 'error' && <p className="error-msg">Не вдалося створити завдання.</p>}
    </form>
  );
}
