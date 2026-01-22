'use client';

import { useEffect, useMemo, useState } from 'react';
import MemoForm from './components/MemoForm';
import MemoList from './components/MemoList';
import { loadMemos, saveMemos, normalizeUrl, clearMemos } from './components/storage';
import { toast } from 'sonner';
import { MemoItem } from '@/app/types';
import { Sun, Moon } from 'lucide-react';

export default function Home() {
  const [items, setItems] = useState<MemoItem[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setItems(loadMemos());
  }, []);

  useEffect(() => {
    saveMemos(items);
  }, [items]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDark]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i => [i.title, i.url ?? '', i.note].some(f => f.toLowerCase().includes(q)));
  }, [items, filter]);

  function handleAdd(item: MemoItem) {
    // normalize/validate URL
    const rawUrl = item.url ?? '';
    if (rawUrl) {
      const normalized = normalizeUrl(rawUrl);
      if (!normalized) {
        toast.error('URL이 올바르지 않습니다');
        return;
      }
      item = { ...item, url: normalized };
    }
    setItems(prev => [item, ...prev]);
    toast.success('저장했어요');
    setSelectedIds(new Set());
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success('삭제했어요');
  }

  function toggleSelect(id: string, checked: boolean) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleSelectAll(checked: boolean) {
    if (!checked) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(filtered.map(i => i.id)));
  }

  function removeSelected() {
    if (selectedIds.size === 0) return;
    const ids = new Set(selectedIds);
    setItems(prev => prev.filter(i => !ids.has(i.id)));
    setSelectedIds(new Set());
    toast.success('선택 항목을 삭제했어요');
  }

  function removeAll() {
    setItems([]);
    clearMemos();
    toast.success('모두 삭제했어요');
    setSelectedIds(new Set());
  }

  return (
    <div className="min-h-screen">
      <div className={`mx-auto max-w-4xl px-6 py-10`}>
        <div className="rounded-xl glass overflow-hidden">
          {/* macOS-like toolbar */}
          <div className="flex items-center gap-3 px-4 py-3 glass-toolbar">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500 inline-block" />
              <span className="h-3 w-3 rounded-full bg-yellow-400 inline-block" />
              <span className="h-3 w-3 rounded-full bg-green-500 inline-block" />
            </div>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-300">
              {/* back/forward icons */}
              <button
                className="h-7 w-7 flex items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="뒤로"
              >
                <span className="i-material-symbols-arrow-back-ios-new-rounded text-base" />
              </button>
              <button
                className="h-7 w-7 flex items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="앞으로"
              >
                <span className="i-material-symbols-arrow-forward-ios-rounded text-base" />
              </button>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-[60%] md:w-[70%] lg:w-[60%]">
                <div className="flex items-center gap-2 rounded-full border border-white/20 dark:border-white/10 bg-white/60 dark:bg-neutral-800/50 backdrop-blur-md px-4 py-1.5 text-sm text-gray-700 dark:text-gray-300">
                  <span className="truncate">
                    save-it.local/{' '}
                    {filter
                      ? `search?q=${encodeURIComponent(filter)}`
                      : 'Quick link and memo saver'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* dark mode toggle */}
              <button
                onClick={() => setIsDark(v => !v)}
                className="h-8 w-8 flex items-center justify-center rounded-full border border-white/20 dark:border-white/10 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-md text-gray-800 dark:text-gray-200"
                aria-label="다크 모드 토글"
                title={isDark ? '라이트 모드' : '다크 모드'}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* content area */}
          <div className="px-6 py-6">
            <header className="space-y-1 mb-4">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Save It
              </h1>
            </header>

            <section className="space-y-4">
              <MemoForm onAddAction={handleAdd} />
              <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                <input
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  placeholder="검색"
                  className="rounded-full px-4 py-2 flex-1 bg-white/80 dark:bg-neutral-800/60 border border-gray-200/70 dark:border-white/10 backdrop-blur-md text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
                <div className="flex gap-2">
                  <button
                    onClick={removeSelected}
                    className="px-4 py-2 rounded-full bg-white/60 dark:bg-neutral-800/50 border border-white/20 dark:border-white/10 backdrop-blur-md text-gray-800 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-neutral-800/60 disabled:opacity-50"
                    disabled={selectedIds.size === 0}
                  >
                    선택 삭제
                  </button>
                  <button
                    onClick={removeAll}
                    className="px-4 py-2 rounded-full bg-white/60 dark:bg-neutral-800/50 border border-white/20 dark:border-white/10 backdrop-blur-md text-gray-800 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-neutral-800/60"
                  >
                    모두 삭제
                  </button>
                </div>
              </div>
            </section>

            <section className="space-y-3 mt-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-2">
                Quick link and memo saver for your browser
              </h2>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                Save links, notes, and reminders all in one place.
              </p>
              <div className="rounded-lg glass">
                <div className="p-4">
                  <MemoList
                    items={filtered}
                    selectedIds={selectedIds}
                    onToggleSelectAction={toggleSelect}
                    onToggleSelectAllAction={toggleSelectAll}
                    onRemoveAction={removeItem}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* toast removed; Toaster is in layout */}
        </div>
      </div>
    </div>
  );
}
