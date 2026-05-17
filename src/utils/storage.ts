import type { Todo, Category } from '../types';

const TODOS_KEY = 'todos_v1';
const CATEGORIES_KEY = 'categories_v1';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: '仕事', color: 'blue' },
  { id: 'cat-2', name: '個人', color: 'green' },
  { id: 'cat-3', name: '買い物', color: 'purple' },
];

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(TODOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

export function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}
