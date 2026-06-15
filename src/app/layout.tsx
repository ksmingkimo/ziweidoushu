import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '紫微君 - AI 紫微斗数命理解读',
  description: '基于 AI 大模型的紫微斗数在线命理解读，通俗易懂，洞察人生',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-b from-purple-50 to-white">
        <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-purple-800">
              🧘 紫微君
            </Link>
            <nav className="flex items-center gap-4 text-sm text-gray-600">
              <Link href="/chart" className="hover:text-purple-700">
                开始排盘
              </Link>
              <Link href="/daily" className="hover:text-purple-700">
                每日运势
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t py-8 text-center text-sm text-gray-500">
          <div className="max-w-4xl mx-auto px-4">
            <p>紫微君 · AI 命理解读 · 仅供参考</p>
            <p className="mt-1">命理是参考，人生在自己手中 👐</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
