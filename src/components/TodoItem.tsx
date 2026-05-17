import { useState } from 'react';
import type { Todo, Category } from '../types';
import { CATEGORY_COLORS, PRIORITY_CONFIG } from '../utils/colors';
import { formatDueDate } from '../utils/dates';

interface Props {
  todo: Todo;
  categories: Category[];
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, categories, onToggle, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const category = categories.find(c => c.id === todo.categoryId);
  const catColors = category ? CATEGORY_COLORS[category.color] ?? CATEGORY_COLORS.blue : null;
  const priorityCfg = PRIORITY_CONFIG[todo.priority];
  const dueDateInfo = todo.dueDate ? formatDueDate(todo.dueDate) : null;

  return (
    <div
      className={`group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${priorityCfg.borderLeft} ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition ${
            todo.completed
              ? 'bg-indigo-500 border-indigo-500 text-white'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          {todo.completed && <span className="text-xs leading-none">✓</span>}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium text-gray-900 leading-snug ${todo.completed ? 'line-through text-gray-400' : ''}`}>
            {todo.title}
          </p>

          {todo.description && (
            <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{todo.description}</p>
          )}

          {/* Meta */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {/* Priority badge */}
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${priorityCfg.badge}`}>
              {priorityCfg.label}
            </span>

            {/* Category */}
            {catColors && category && (
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${catColors.bg} ${catColors.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${catColors.dot}`} />
                {category.name}
              </span>
            )}

            {/* Due date */}
            {dueDateInfo && (
              <span className={`inline-flex items-center gap-0.5 text-xs ${
                dueDateInfo.isOverdue ? 'text-red-600 font-medium' : dueDateInfo.isToday ? 'text-orange-500 font-medium' : 'text-gray-500'
              }`}>
                <span>📅</span>
                {dueDateInfo.label}
              </span>
            )}

            {/* Tags */}
            {todo.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          {confirmDelete ? (
            <>
              <button
                onClick={() => onDelete(todo.id)}
                className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200 cursor-pointer transition"
              >
                削除
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs hover:bg-gray-200 cursor-pointer transition"
              >
                取消
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onEdit(todo)}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition"
                title="編集"
              >
                ✏️
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition"
                title="削除"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
