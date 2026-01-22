import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          light: '#F6F7FB',
          dark: '#0E0F12',
          glass: 'rgba(255,255,255,0.15)',
          glassDark: 'rgba(30, 41, 59, 0.25)',
          borderLight: 'rgba(200,200,220,0.35)',
          borderDark: 'rgba(60,60,80,0.45)',
          bg: '#eaf1fb', // 페이지 배경(연한 블루그레이)
          bgDark: '#181d23', // 다크모드 배경(딥 블루그레이)
          card: '#fafdff', // 카드/컨텐츠 배경(밝은 화이트블루)
          cardDark: '#232a33', // 다크모드 카드 배경(블루그레이)
        },
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          glass: 'rgba(59,130,246,0.10)',
        },
        accent: {
          pink: '#f472b6',
          yellow: '#fde68a',
          green: '#6ee7b7',
          blue: '#60a5fa',
          purple: '#a78bfa',
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      },
      backdropBlur: {
        glass: '8px',
      },
    },
  },
  plugins: [],
};
export default config;
