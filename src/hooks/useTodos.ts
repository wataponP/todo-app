import { useState, useEffect, useCallback } from 'react';
import type { Todo, Category, Priority, FilterStatus, SortField, SortDirection } from '../types';
import { loadTodos, saveTodos, loadCategories, saveCategories } from '../utils/storage';

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [categories, setCategories] = useState<Category[]>(loadCategories);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => { saveTodos(todos); }, [todos]);
  useEffect(() => { saveCategories(categories); }, [categories]);

  const addTodo = useCallback((data: Omit<Todo, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setTodos(prev => [{
      ...data,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    }, ...prev]);
  }, []);

  const updateTodo = useCallback((id: string, data: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
    ));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t
    ));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed));
  }, []);

  const addCategory = useCallback((name: string, color: string): string => {
    const id = crypto.randomUUID();
    setCategories(prev => [...prev, { id, name, color }]);
    return id;
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setTodos(prev => prev.map(t => t.categoryId === id ? { ...t, categoryId: null } : t));
  }, []);

  const filteredTodos = todos
    .filter(t => {
      if (filterStatus === 'active' && t.completed) return false;
      if (filterStatus === 'completed' && !t.completed) return false;
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
      if (filterCategory !== 'all' && t.categoryId !== filterCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        const match =
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some(tag => tag.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'title':
          cmp = a.title.localeCompare(b.title, 'ja');
          break;
        case 'priority':
          cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) cmp = 0;
          else if (!a.dueDate) cmp = 1;
          else if (!b.dueDate) cmp = -1;
          else cmp = a.dueDate.localeCompare(b.dueDate);
          break;
        case 'createdAt':
          cmp = a.createdAt.localeCompare(b.createdAt);
          break;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return {
    todos,
    filteredTodos,
    categories,
    activeCount,
    completedCount,
    filterStatus, setFilterStatus,
    filterPriority, setFilterPriority,
    filterCategory, setFilterCategory,
    search, setSearch,
    sortField, setSortField,
    sortDirection, setSortDirection,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    addCategory,
    deleteCategory,
  };
}
