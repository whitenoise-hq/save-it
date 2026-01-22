'use client';

import { MemoItem } from '../../types';
import { FolderOpen, Link as LinkIcon, Trash2, Tag, CheckSquare, Square, Eye } from 'lucide-react';
import { useState, useMemo } from 'react';

export type MemoListProps = {
  items: MemoItem[];
  selectedIds: Set<string>;
  onToggleSelectAction: (id: string, checked: boolean) => void;
  onToggleSelectAllAction: (checked: boolean) => void;
  onRemoveAction: (id: string) => void;
};

export default function MemoList({
  items,
  selectedIds,
  onToggleSelectAction,
  onToggleSelectAllAction,
  onRemoveAction,
}: MemoListProps) {
  const [showDetailId, setShowDetailId] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  // 폴더 목록 추출
  const folders = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => {
      if (i.folder) set.add(i.folder);
    });
    return Array.from(set);
  }, [items]);

  // 폴더 필터링
  const filteredItems = selectedFolder ? items.filter(i => i.folder === selectedFolder) : items;

  if (items.length === 0) {
    return <p className="text-sm text-gray-500">아직 메모가 없어요.</p>;
  }

  const allSelected = filteredItems.length > 0 && filteredItems.every(i => selectedIds.has(i.id));

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-2 mb-2">
        <div className="flex items-center gap-2 px-0 py-0 rounded-none bg-transparent border-0 shadow-none">
          <button
            className="focus:outline-none"
            aria-label={allSelected ? '전체 선택 해제' : '전체 선택'}
            onClick={() => onToggleSelectAllAction(!allSelected)}
            type="button"
          >
            {allSelected ? (
              <CheckSquare className="w-5 h-5 text-primary-400 flex-shrink-0" />
            ) : (
              <Square className="w-5 h-5 text-gray-300 flex-shrink-0" />
            )}
          </button>
          <span
            className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer select-none"
            onClick={() => onToggleSelectAllAction(!allSelected)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') onToggleSelectAllAction(!allSelected);
            }}
            aria-label={allSelected ? '전체 선택 해제' : '전체 선택'}
          >
            전체 선택
          </span>
        </div>
        <select
          value={selectedFolder}
          onChange={e => setSelectedFolder(e.target.value)}
          className="rounded-lg px-3 py-2 pr-8 border border-primary-200 dark:border-primary-800 bg-white/70 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400/30 shadow-sm text-sm transition appearance-none w-full sm:w-auto"
          style={{ backgroundPosition: 'right 0.75rem center' }}
        >
          <option value="">전체 폴더</option>
          {folders.map(f => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <ul className="space-y-2">
        {filteredItems.map(item => (
          <li
            key={item.id}
            className={`rounded-lg bg-surface-glass/80 dark:bg-surface-glassDark/80 border border-surface-borderLight/60 dark:border-surface-borderDark/60 shadow-sm hover:shadow-sm transition hover:border-primary-300/40 focus-within:ring-2 focus-within:ring-primary-200/30 group p-3 ${selectedIds.has(item.id) ? 'ring-2 ring-primary-200/40' : ''}`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 flex gap-3 min-w-0">
                <button
                  className="pt-1 focus:outline-none flex-shrink-0"
                  aria-label={selectedIds.has(item.id) ? '선택 해제' : '선택'}
                  onClick={() => onToggleSelectAction(item.id, !selectedIds.has(item.id))}
                >
                  {selectedIds.has(item.id) ? (
                    <CheckSquare className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                </button>
                <div className="min-w-0 w-full">
                  {item.folder && (
                    <div className="mb-1 flex items-center gap-1 text-xs text-primary-500 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full w-fit">
                      <FolderOpen className="inline w-3 h-3 mr-0.5" />
                      {item.folder}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-base truncate">
                      {item.title}
                    </span>
                  </div>
                  {item.url && (
                    <div className="flex items-center gap-1 text-primary-500 dark:text-primary-100 text-xs mb-1">
                      <LinkIcon className="w-3 h-3 flex-shrink-0" />
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-primary-400 truncate"
                      >
                        {item.url}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300 text-sm min-w-0">
                    {/* 아이콘 제거, 텍스트만 남김 */}
                    <span className={`min-w-0 ${item.note.length > 0 ? 'line-clamp-2' : ''}`}>
                      {item.note}
                    </span>
                    {item.note.length > 40 && (
                      <button
                        className="ml-1 p-1 rounded hover:bg-primary-100/40 dark:hover:bg-primary-900/20 transition"
                        aria-label="자세히 보기"
                        onClick={() => setShowDetailId(item.id)}
                        tabIndex={0}
                      >
                        <Eye className="w-4 h-4 text-primary-400" />
                      </button>
                    )}
                  </div>
                  {/* 자세히 보기 팝오버 */}
                  {showDetailId === item.id && (
                    <div
                      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30"
                      onClick={() => setShowDetailId(null)}
                    >
                      <div
                        className="bg-white dark:bg-neutral-900 border border-primary-100 dark:border-primary-900 rounded-lg shadow-lg p-5 text-gray-900 dark:text-gray-100 text-sm max-w-xs w-full max-h-[60vh] overflow-auto relative"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">메모 전체보기</span>
                          <button
                            onClick={() => setShowDetailId(null)}
                            aria-label="닫기"
                            className="ml-2 text-gray-400 hover:text-primary-400 text-lg"
                          >
                            ✕
                          </button>
                        </div>
                        <div style={{ whiteSpace: 'pre-line' }}>{item.note}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => onRemoveAction(item.id)}
                className="p-2 rounded-full hover:bg-primary-100/40 dark:hover:bg-primary-900/20 text-gray-400 hover:text-red-500 transition focus:outline-none flex-shrink-0"
                aria-label="삭제"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
