import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-20 px-4 text-center">
        <h1 className="text-5xl font-bold text-purple-900 mb-4">紫微君</h1>
        <p className="text-xl text-gray-600 mb-2">AI 驱动的紫微斗数命理解读</p>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          输入出生时间，AI 为你深度解读性格、事业、感情、财运——通俗易懂，温暖有洞察
        </p>
        <Link
          href="/chart"
          className="inline-block bg-purple-700 hover:bg-purple-800 text-white text-lg px-8 py-4 rounded-full shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
        >
          开始排盘 ✨
        </Link>
        <p className="mt-4">
          <Link href="/help" className="text-purple-600 hover:underline text-sm">
            📖 不知道怎么用？查看使用教程 →
          </Link>
        </p>
      </section>

      <section className="w-full max-w-4xl px-4 py-16 grid md:grid-cols-3 gap-8">
        {[
          { emoji: '🔮', title: 'AI 深度解读', desc: '基于大模型的多维度命理解读，像真人大师一样细致入微' },
          { emoji: '💬', title: '通俗易懂', desc: '用日常语言解释专业术语，零基础也能轻松理解' },
          { emoji: '⚡', title: '即看即得', desc: '输入出生时间，秒出命盘，AI 流式解读逐字呈现' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-xl p-6 shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">{f.emoji}</div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="w-full max-w-4xl px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">全面解读，多维度了解自己</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['本命盘', '大限运势', '流年分析', '流月运势', '合盘姻缘', '择日建议', '事业财运', '感情婚姻'].map((item) => (
            <div key={item} className="bg-purple-50 rounded-lg p-4 text-center text-purple-800 font-medium hover:bg-purple-100 transition-colors">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="w-full max-w-md px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold mb-2">准备好了解自己了吗？</h3>
          <p className="text-purple-200 mb-6 text-sm">输入出生时间，获取专属 AI 命理解读</p>
          <Link href="/chart" className="inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-full hover:bg-purple-50 transition-colors">
            免费排盘 →
          </Link>
        </div>
      </section>
    </div>
  );
}
