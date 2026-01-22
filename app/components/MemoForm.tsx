'use client';

import { useState } from 'react';
import { MemoItem } from '../../types';

export type MemoFormProps = {
  onAddAction: (item: MemoItem) => void;
  folders: string[];
  onAddFolderAction: (folder: string) => void;
};

export default function MemoForm({ onAddAction, folders, onAddFolderAction }: MemoFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [folder, setFolder] = useState('');
  const [newFolder, setNewFolder] = useState('');

  function handleSubmit() {
    const t = title.trim();
    const n = note.trim();
    const u = url.trim();
    const f = newFolder.trim() || folder;
    if (!t && !n) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const item: MemoItem = {
      id,
      title: t || '(제목 없음)',
      note: n,
      url: u || undefined,
      createdAt: Date.now(),
      folder: f || undefined,
    };
    onAddAction(item);
    if (newFolder.trim()) {
      onAddFolderAction(newFolder.trim());
      setNewFolder('');
    }
    setTitle('');
    setUrl('');
    setNote('');
    setFolder('');
  }

  return (
    <div className="grid gap-2 p-4 rounded-xl bg-surface-glass dark:bg-surface-glassDark shadow-sm backdrop-blur-glass border border-surface-borderLight dark:border-surface-borderDark">
      <div className="flex gap-2 items-center mb-2">
        <select
          value={folder}
          onChange={e => setFolder(e.target.value)}
          className="rounded-lg px-3 py-2 pr-8 border border-primary-200 dark:border-primary-800 bg-white/70 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400/30 shadow-sm text-sm transition appearance-none"
          style={{ backgroundPosition: 'right 0.75rem center' }}
        >
          <option value="">폴더 선택</option>
          {folders.map(f => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <input
          value={newFolder}
          onChange={e => setNewFolder(e.target.value)}
          placeholder="새 폴더명"
          className={`rounded-lg px-3 py-2 border border-primary-200 dark:border-primary-800 bg-white/70 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400/30 shadow-sm text-sm transition${
            folder ? ' bg-gray-200 dark:bg-neutral-700 cursor-not-allowed' : ''
          }`}
          disabled={!!folder}
        />
      </div>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="제목"
        className="rounded-md px-3 py-2 bg-white/30 dark:bg-white/10 border border-surface-borderLight dark:border-surface-borderDark text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition shadow-sm backdrop-blur-glass text-sm"
      />
      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="링크(URL)"
        className="rounded-md px-3 py-2 bg-white/30 dark:bg-white/10 border border-surface-borderLight dark:border-surface-borderDark text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition shadow-sm backdrop-blur-glass text-sm"
      />
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="메모"
        rows={3}
        className="rounded-lg px-3 py-2 bg-white/30 dark:bg-white/10 border border-surface-borderLight dark:border-surface-borderDark text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition shadow-sm backdrop-blur-glass resize-none text-sm"
      />
      <div className="flex gap-2 justify-end mt-1">
        <button
          onClick={handleSubmit}
          className="px-4 py-1.5 rounded-md bg-primary-glass hover:bg-primary-500/80 text-primary-600 hover:text-white dark:text-primary-50 font-semibold shadow-sm border border-primary-500/10 backdrop-blur-glass transition text-sm"
        >
          저장
        </button>
      </div>
    </div>
  );
}
