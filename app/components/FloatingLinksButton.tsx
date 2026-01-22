'use client';
import { useState } from 'react';
import { MessageCircle, Github, Globe } from 'lucide-react';

const LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/whitenoise-hq/save-it',
    icon: <Github className="w-5 h-5 mr-2" />,
  },
  {
    label: 'Blog',
    href: 'https://devwoodie.com',
    icon: <Globe className="w-5 h-5 mr-2" />,
  },
];

export default function FloatingLinksButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed z-50 right-8 bottom-8 flex flex-col items-end gap-2">
      {open && (
        <div className="mb-3 w-48 rounded-xl shadow-lg bg-white/95 dark:bg-neutral-900/95 border border-gray-200 dark:border-neutral-800 py-2 px-3 animate-fade-in-up">
          {LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 text-gray-800 dark:text-gray-100 transition text-sm font-medium"
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>
      )}
      <button
        className={`rounded-full shadow-lg bg-primary-500 hover:bg-primary-600 text-white w-14 h-14 flex items-center justify-center text-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 ${open ? 'rotate-12 scale-110' : ''}`}
        aria-label="외부 링크 열기"
        onClick={() => setOpen(v => !v)}
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}
