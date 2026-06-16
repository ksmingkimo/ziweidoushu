import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-8xl mb-4">🔮</div>
      <h1 className="text-4xl font-bold text-purple-900 mb-2">此页不在命盘之中</h1>
      <p className="text-gray-500 mb-2">天机不可泄露，此页面或许已被星曜带走了</p>
      <p className="text-gray-400 text-sm mb-8">404 · 页面未找到</p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="inline-block bg-purple-700 hover:bg-purple-800 text-white px-6 py-2.5 rounded-full transition-colors"
        >
          返回首页
        </Link>
        <Link
          href="/chart"
          className="inline-block border border-purple-300 text-purple-700 hover:bg-purple-50 px-6 py-2.5 rounded-full transition-colors"
        >
          开始排盘
        </Link>
      </div>
    </div>
  );
}
