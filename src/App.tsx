import { useState } from 'react';
import type { Todo } from './types';
import { useTodos } from './hooks/useTodos';
import Modal from './components/Modal';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';

export default function App() {
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const {
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
  } = useTodos();

  function handleEdit(todo: Todo) {
    setEditingTodo(todo);
    setModalMode('edit');
  }

  function handleClose() {
    setModalMode(null);
    setEditingTodo(null);
  }

  function handleSubmit(data: Omit<Todo, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) {
    if (modalMode === 'edit' && editingTodo) {
      updateTodo(editingTodo.id, data);
    } else {
      addTodo(data);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">TODOアプリ</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {activeCount}件の未完了タスク
              {completedCount > 0 && ` · 完了 ${completedCount}件`}
            </p>
          </div>
          <button
            onClick={() => setModalMode('add')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 cursor-pointer transition shadow-sm shadow-indigo-200"
          >
            <span className="text-lg leading-none">+</span>
            タスク追加
          </button>
        </div>

        {/* Filter bar */}
        <div className="mb-4">
          <FilterBar
            categories={categories}
            filterStatus={filterStatus} setFilterStatus={setFilterStatus}
            filterPriority={filterPriority} setFilterPriority={setFilterPriority}
            filterCategory={filterCategory} setFilterCategory={setFilterCategory}
            search={search} setSearch={setSearch}
            sortField={sortField} setSortField={setSortField}
            sortDirection={sortDirection} setSortDirection={setSortDirection}
          />
        </div>

        {/* Clear completed */}
        {completedCount > 0 && filterStatus !== 'active' && (
          <div className="mb-3 flex justify-end">
            <button
              onClick={clearCompleted}
              className="text-xs text-gray-400 hover:text-red-500 cursor-pointer transition"
            >
              完了済みを削除 ({completedCount})
            </button>
          </div>
        )}

        {/* Todo list */}
        <TodoList
          todos={filteredTodos}
          categories={categories}
          onToggle={toggleTodo}
          onEdit={handleEdit}
          onDelete={deleteTodo}
        />
      </div>

      {/* Modal */}
      {modalMode && (
        <Modal onClose={handleClose}>
          <TodoForm
            mode={modalMode}
            todo={editingTodo}
            categories={categories}
            onSubmit={handleSubmit}
            onClose={handleClose}
            onAddCategory={addCategory}
          />
        </Modal>
      )}
    </div>
  );
}
