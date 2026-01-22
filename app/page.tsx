'use client';

import { useEffect, useMemo, useState } from 'react';
import MemoForm from './components/MemoForm';
import MemoList from './components/MemoList';
import { loadMemos, saveMemos, normalizeUrl, clearMemos } from './components/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Sun, Moon, ArrowLeft, ArrowRight, Trash2, Search } from 'lucide-react';
import { MemoItem } from '../types';

export default function Home() {
  const [items, setItems] = useState<MemoItem[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDark, setIsDark] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);

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

  useEffect(() => {
    // items에서 폴더 목록 추출
    const set = new Set<string>();
    items.forEach(i => {
      if (i.folder) set.add(i.folder);
    });
    setFolders(Array.from(set));
  }, [items]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i => [i.title, i.url ?? '', i.note].some(f => f.toLowerCase().includes(q)));
  }, [items, filter]);

  function handleAdd(item: MemoItem) {
    // normalize/validate URL
    let rawUrl = item.url ?? '';
    if (rawUrl) {
      // 입력값 앞에 https://, http://, // 등이 있으면 제거
      rawUrl = rawUrl.replace(/^(https?:\/\/|\/\/)/, '');
      const normalized = normalizeUrl('https://' + rawUrl);
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

  function handleAddFolder(folder: string) {
    setFolders(prev => (prev.includes(folder) ? prev : [...prev, folder]));
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
    <div className="min-h-screen bg-[#fbfbfb] flex flex-col dark:bg-[#181c20]">
      <div className="mx-auto w-full max-w-2xl px-2 sm:px-4 py-4 sm:py-6">
        <div className="rounded-xl shadow-sm border border-surface-borderLight dark:border-surface-borderDark bg-[#f4faff] dark:bg-[#232a33] backdrop-blur-glass overflow-hidden">
          {/* macOS-like toolbar */}
          <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 glass-toolbar border-b border-surface-borderLight dark:border-surface-borderDark bg-white/30 dark:bg-white/10 backdrop-blur-glass">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 inline-block" />
              <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-yellow-400 inline-block" />
              <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green-500 inline-block" />
            </div>
            <div className="flex-1 flex items-center gap-2 sm:gap-3 text-gray-500 dark:text-gray-300 ml-2 sm:ml-3">
              <ArrowLeft className="w-4 h-4 opacity-40" />
              <ArrowRight className="w-4 h-4 opacity-40" />
            </div>
            <button
              className="ml-auto p-1 rounded-full sm:p-1.5 hover:bg-primary-500/10 transition focus:outline-none"
              aria-label="다크/라이트 모드 전환"
              onClick={() => setIsDark(v => !v)}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              )}
            </button>
          </div>
          <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
            <MemoForm
              onAddAction={handleAdd}
              folders={folders}
              onAddFolderAction={handleAddFolder}
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0 justify-between">
              <div className="flex items-center bg-surface-glass/70 dark:bg-surface-glassDark/70 border border-primary-100 dark:border-primary-900 rounded-md px-2 py-2 w-full max-w-xs shadow-sm backdrop-blur-glass">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="bg-transparent border-none outline-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 flex-1 text-sm min-w-0"
                />
              </div>
              <div className="flex gap-0">
                <div className="relative group">
                  <button
                    onClick={removeSelected}
                    disabled={selectedIds.size === 0}
                    className="px-3 py-1.5 rounded-l-md bg-red-100/80 hover:bg-red-200/90 text-red-700 hover:text-red-900 dark:bg-red-900/40 dark:hover:bg-red-800/60 dark:text-red-200 font-semibold shadow-sm border border-red-200 dark:border-red-900 border-r-0 backdrop-blur-glass transition disabled:opacity-40 disabled:cursor-not-allowed text-sm flex items-center gap-1"
                    aria-label="선택 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-0.5 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                    선택 삭제
                  </span>
                </div>
                <div className="relative group">
                  <button
                    onClick={removeAll}
                    className="px-3 py-1.5 rounded-r-md bg-red-100/80 hover:bg-red-200/90 text-red-700 hover:text-red-900 dark:bg-red-900/40 dark:hover:bg-red-800/60 dark:text-red-200 font-semibold shadow-sm border border-red-200 dark:border-red-900 border-l-0 backdrop-blur-glass transition text-sm flex items-center gap-1"
                    aria-label="전체 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-0.5 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                    전체 삭제
                  </span>
                </div>
              </div>
            </div>
            <MemoList
              items={filtered}
              selectedIds={selectedIds}
              onToggleSelectAction={toggleSelect}
              onToggleSelectAllAction={toggleSelectAll}
              onRemoveAction={removeItem}
            />
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={1800}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        toastClassName={opts => {
          const type = opts && 'type' in opts ? opts.type : undefined;
          return `rounded-xl px-4 py-2 min-h-0 h-auto text-sm font-semibold flex items-center gap-2 shadow-glass backdrop-blur-glass border
            ${
              type === 'success'
                ? 'bg-green-50/90 border-green-200 text-green-900 dark:bg-green-900/80 dark:border-green-800 dark:text-green-100'
                : type === 'error'
                  ? 'bg-red-50/90 border-red-200 text-red-900 dark:bg-red-900/80 dark:border-red-800 dark:text-red-100'
                  : 'bg-gradient-to-br from-[#e3f0ff]/90 to-[#fafdff]/90 dark:from-[#232a33]/90 dark:to-[#1a222b]/90 border-primary-100 dark:border-primary-900 text-gray-900 dark:text-gray-100'
            } text-sm font-semibold flex-1`;
        }}
        closeButton={({ closeToast }) => (
          <button
            onClick={closeToast}
            className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
            aria-label="닫기"
          >
            <span className="text-base">✕</span>
          </button>
        )}
        icon={({ type }) => (
          <span className="mr-1">{type === 'success' ? '✅' : type === 'error' ? '⚠️' : '💡'}</span>
        )}
      />
    </div>
  );
}
