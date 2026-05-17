import type { Priority, FilterStatus, SortField, SortDirection, Category } from '../types';

interface Props {
  categories: Category[];
  filterStatus: FilterStatus;
  setFilterStatus: (v: FilterStatus) => void;
  filterPriority: Priority | 'all';
  setFilterPriority: (v: Priority | 'all') => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  sortField: SortField;
  setSortField: (v: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (v: SortDirection) => void;
}

const STATUS_TABS: { value: FilterStatus; label: string }[] = [
  { value: 'all',       label: 'すべて' },
  { value: 'active',    label: '未完了' },
  { value: 'completed', label: '完了済' },
];

export default function FilterBar({
  categories,
  filterStatus, setFilterStatus,
  filterPriority, setFilterPriority,
  filterCategory, setFilterCategory,
  search, setSearch,
  sortField, setSortField,
  sortDirection, setSortDirection,
}: Props) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="タスクを検索..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status tabs + filters row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status tabs */}
        <div className="flex rounded-lg bg-gray-100 p-0.5">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition ${
                filterStatus === tab.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value as Priority | 'all')}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-400 transition cursor-pointer"
        >
          <option value="all">優先度: すべて</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>

        {/* Category filter */}
        {categories.length > 0 && (
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-400 transition cursor-pointer"
          >
            <option value="all">カテゴリ: すべて</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        )}

        {/* Sort */}
        <div className="flex items-center gap-1 ml-auto">
          <select
            value={sortField}
            onChange={e => setSortField(e.target.value as SortField)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-400 transition cursor-pointer"
          >
            <option value="createdAt">作成日</option>
            <option value="dueDate">期日</option>
            <option value="priority">優先度</option>
            <option value="title">タイトル</option>
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-700 cursor-pointer text-xs transition"
            title={sortDirection === 'asc' ? '昇順' : '降順'}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );
}
