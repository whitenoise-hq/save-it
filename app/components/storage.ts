import { MemoItem } from '@/app/types';

const STORAGE_KEY = 'save-it:memos';

export function loadMemos(): MemoItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MemoItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMemos(items: MemoItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  const prefixed = raw.match(/^https?:\/\//i) ? raw : `https://${raw}`;
  try {
    const u = new URL(prefixed);
    return u.toString();
  } catch {
    return null;
  }
}

export function clearMemos() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
