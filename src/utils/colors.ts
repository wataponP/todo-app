export interface ColorConfig {
  bg: string;
  text: string;
  dot: string;
  label: string;
}

export const CATEGORY_COLORS: Record<string, ColorConfig> = {
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500',   label: '青' },
  green:  { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500',  label: '緑' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500', label: '紫' },
  red:    { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500',    label: '赤' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: '黄' },
  pink:   { bg: 'bg-pink-100',   text: 'text-pink-700',   dot: 'bg-pink-500',   label: 'ピンク' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500', label: '藍' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', label: 'オレンジ' },
  teal:   { bg: 'bg-teal-100',   text: 'text-teal-700',   dot: 'bg-teal-500',   label: 'ティール' },
};

export const PRIORITY_CONFIG = {
  high:   { label: '高', borderLeft: 'border-l-4 border-l-red-500',    badge: 'bg-red-100 text-red-700' },
  medium: { label: '中', borderLeft: 'border-l-4 border-l-yellow-500', badge: 'bg-yellow-100 text-yellow-700' },
  low:    { label: '低', borderLeft: 'border-l-4 border-l-green-500',  badge: 'bg-green-100 text-green-700' },
};
