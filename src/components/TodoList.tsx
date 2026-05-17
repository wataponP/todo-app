import type { Todo, Category } from '../types';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  categories: Category[];
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, categories, onToggle, onEdit, onDelete }: Props) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-gray-500 text-sm">タスクがありません</p>
        <p className="text-gray-400 text-xs mt-1">「+ タスク追加」からタスクを作成できます</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          categories={categories}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
