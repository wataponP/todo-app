export function formatDueDate(dateStr: string): { label: string; isOverdue: boolean; isToday: boolean } {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const isOverdue = diff < 0;
  const isToday = diff === 0;

  let label: string;
  if (diff === 0) label = '今日';
  else if (diff === 1) label = '明日';
  else if (diff === -1) label = '昨日';
  else if (diff > 1 && diff <= 7) label = `${diff}日後`;
  else if (diff < -1) label = `${Math.abs(diff)}日超過`;
  else label = date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });

  return { label, isOverdue, isToday };
}

export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}
