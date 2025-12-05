import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Save It',
  description: 'Save It',
  openGraph: {
    title: '',
    description: '',
    url: '',
    siteName: '',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: ``,
        width: 1200,
        height: 628,
        alt: '',
      },
    ],
  },
  icons: {
    icon: [{ url: ``, type: 'image/svg+xml' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
