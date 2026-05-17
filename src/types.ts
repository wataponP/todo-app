export type Priority = 'high' | 'medium' | 'low';
export type FilterStatus = 'all' | 'active' | 'completed';
export type SortField = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  categoryId: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
