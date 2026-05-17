import { useState, useRef, type KeyboardEvent } from 'react';
import type { Todo, Priority, Category } from '../types';
import { CATEGORY_COLORS } from '../utils/colors';

interface Props {
  mode: 'add' | 'edit';
  todo?: Todo | null;
  categories: Category[];
  onSubmit: (data: Omit<Todo, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  onAddCategory: (name: string, color: string) => string;
}

const COLOR_OPTIONS = Object.entries(CATEGORY_COLORS).map(([value, cfg]) => ({ value, ...cfg }));

export default function TodoForm({ mode, todo, categories, onSubmit, onClose, onAddCategory }: Props) {
  const [title, setTitle] = useState(todo?.title ?? '');
  const [description, setDescription] = useState(todo?.description ?? '');
  const [priority, setPriority] = useState<Priority>(todo?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(todo?.dueDate ?? '');
  const [categoryId, setCategoryId] = useState(todo?.categoryId ?? '');
  const [tags, setTags] = useState<string[]>(todo?.tags ?? []);
  const [tagInput, setTagInput] = useState('');

  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('blue');
  const [titleError, setTitleError] = useState(false);

  const tagInputRef = useRef<HTMLInputElement>(null);

  function addTag(value: string) {
    const trimmed = value.trim().replace(/,+$/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
    }
    setTagInput('');
  }

  function handleTagKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(prev => prev.slice(0, -1));
    }
  }

  function handleNewCategory() {
    if (!newCatName.trim()) return;
    const id = onAddCategory(newCatName.trim(), newCatColor);
    setCategoryId(id);
    setNewCatName('');
    setShowNewCat(false);
  }

  function handleSubmit() {
    if (!title.trim()) { setTitleError(true); return; }
    if (tagInput.trim()) addTag(tagInput);
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
      categoryId: categoryId || null,
      tags,
    });
    onClose();
  }

  const PRIORITY_OPTIONS: { value: Priority; label: string; cls: string }[] = [
    { value: 'high',   label: '高', cls: 'bg-red-100 text-red-700 border-red-300' },
    { value: 'medium', label: '中', cls: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { value: 'low',    label: '低', cls: 'bg-green-100 text-green-700 border-green-300' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {mode === 'add' ? 'タスクを追加' : 'タスクを編集'}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer">✕</button>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={e => { setTitle(e.target.value); setTitleError(false); }}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="タスクのタイトルを入力"
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition ${
              titleError ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {titleError && <p className="mt-1 text-xs text-red-500">タイトルを入力してください</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="詳細を入力（任意）"
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">優先度</label>
          <div className="flex gap-2">
            {PRIORITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPriority(opt.value)}
                className={`flex-1 py-1.5 rounded-lg border text-sm font-medium cursor-pointer transition ${
                  priority === opt.value ? opt.cls + ' ring-2 ring-offset-1 ring-indigo-400' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Due date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">期日</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
          <div className="flex gap-2">
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
            >
              <option value="">なし</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCat(v => !v)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition"
            >
              + 新規
            </button>
          </div>

          {showNewCat && (
            <div className="mt-2 p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
              <input
                type="text"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleNewCategory(); }}
                placeholder="カテゴリ名"
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="flex flex-wrap gap-1.5">
                {COLOR_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setNewCatColor(opt.value)}
                    title={opt.label}
                    className={`w-6 h-6 rounded-full cursor-pointer transition ${opt.dot} ${
                      newCatColor === opt.value ? 'ring-2 ring-offset-1 ring-gray-600 scale-110' : ''
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleNewCategory}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 cursor-pointer transition"
                >
                  追加
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCat(false)}
                  className="px-3 py-1 text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">タグ</label>
          <div
            className="flex flex-wrap gap-1.5 rounded-lg border border-gray-300 px-3 py-2 min-h-[42px] cursor-text focus-within:ring-2 focus-within:ring-indigo-400 transition"
            onClick={() => tagInputRef.current?.focus()}
          >
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {tag}
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setTags(prev => prev.filter(t => t !== tag)); }}
                  className="text-gray-400 hover:text-gray-600 leading-none cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              ref={tagInputRef}
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
              placeholder={tags.length === 0 ? 'Enter で追加' : ''}
              className="flex-1 min-w-[80px] text-sm outline-none bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 cursor-pointer transition"
        >
          {mode === 'add' ? '追加' : '保存'}
        </button>
      </div>
    </div>
  );
}
