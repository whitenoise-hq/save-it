'use client';

import { useState } from 'react';
import { MemoItem } from '@/app/types';

export type MemoFormProps = {
  onAddAction: (item: MemoItem) => void;
};

export default function MemoForm({ onAddAction }: MemoFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');

  function handleSubmit() {
    const t = title.trim();
    const n = note.trim();
    const u = url.trim();
    if (!t && !n) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const item: MemoItem = {
      id,
      title: t || '(제목 없음)',
      url: u || undefined,
      note: n,
      createdAt: Date.now(),
    };
    onAddAction(item);
    setTitle('');
    setUrl('');
    setNote('');
  }

  return (
    <div className="grid gap-2">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="제목"
        className="rounded-full px-4 py-2 bg-white/60 dark:bg-neutral-800/50 border border-white/20 dark:border-white/10 backdrop-blur-md text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
      />
      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="링크(URL)"
        className="rounded-full px-4 py-2 bg-white/60 dark:bg-neutral-800/50 border border-white/20 dark:border-white/10 backdrop-blur-md text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
      />
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="메모"
        rows={4}
        className="rounded-2xl px-4 py-3 bg-white/60 dark:bg-neutral-800/50 border border-white/20 dark:border-white/10 backdrop-blur-md text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-full bg-primary-500/80 hover:bg-primary-600/80 text-white shadow-sm"
        >
          저장
        </button>
      </div>
    </div>
  );
}
