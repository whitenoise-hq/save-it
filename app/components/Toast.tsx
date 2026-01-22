'use client';

import { useEffect } from 'react';

export type ToastProps = {
  message: string;
  onCloseAction: () => void;
  duration?: number; // ms
};

export default function Toast({ message, onCloseAction, duration = 2000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onCloseAction, duration);
    return () => clearTimeout(id);
  }, [message, duration, onCloseAction]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-2 rounded shadow">
      <span className="text-sm">{message}</span>
    </div>
  );
}
