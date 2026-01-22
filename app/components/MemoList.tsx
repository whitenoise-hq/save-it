'use client';

import Link from 'next/link';
import { MemoItem } from '@/app/types';
import { Bookmark, Link as LinkIcon, Trash2, Tag } from 'lucide-react';

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
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">아직 항목이 없어요.</p>;
  }

  const allSelected = items.length > 0 && items.every(i => selectedIds.has(i.id));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={e => onToggleSelectAllAction(e.target.checked)}
        />
        <span className="text-sm text-gray-600">전체 선택</span>
      </div>
      <ul className="space-y-3">
        {items.map(item => (
          <li
            key={item.id}
            className={`rounded-xl bg-white/70 dark:bg-neutral-800/60 backdrop-blur border border-white/30 dark:border-white/10 p-3 shadow-sm ${selectedIds.has(item.id) ? 'ring-1 ring-primary-500/30' : ''}`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 flex gap-3">
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={e => onToggleSelectAction(item.id, e.target.checked)}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {item.url ? (
                      <LinkIcon className="h-4 w-4 text-primary-500" />
                    ) : (
                      <Bookmark className="h-4 w-4 text-yellow-500" />
                    )}
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {item.title}
                    </div>
                  </div>
                  {item.url ? (
                    <Link
                      href={item.url}
                      target="_blank"
                      className="text-primary-600 hover:underline break-all"
                    >
                      {item.url}
                    </Link>
                  ) : null}
                  <p className="text-sm whitespace-pre-wrap break-words text-gray-700 dark:text-gray-300">
                    {item.note}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Tag className="h-3 w-3" />
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onRemoveAction(item.id)}
                  className="px-2 py-1 rounded-full bg-white/70 dark:bg-neutral-800/60 border border-white/30 dark:border-white/10 backdrop-blur text-sm text-gray-800 dark:text-gray-200 hover:bg-white/80"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
